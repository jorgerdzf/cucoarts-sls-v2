'use strict';

/* Servidor de la agenda cucoarts.com/mty: check-ins, calificaciones, recomendaciones y sugerencias, con moderación por correo.
 *  POST /mty/submit    -> valida, guarda como "pendiente" y manda a NOTIFY_TO un correo con botones Aprobar / Rechazar.
 *  GET  /mty/public    -> solo lo aprobado (promedios; o los comentarios de un destino con ?ref=evento:<id> | lugar:<id> | reco).
 *  GET  <URL de moderación>?k&s&a&e&t  -> página de confirmación (abrir el enlace NO cambia nada).
 *  POST <URL de moderación>            -> aprueba o rechaza (una sola vez); el enlace va firmado (HMAC) y caduca a los 14 días.
 * Usa solo el AWS SDK v3 que ya trae el runtime de Lambda (sin node_modules). Diseño: MTY_PROTOTIPO/DISENO_SERVIDOR_MTY.md. */

const crypto = require('crypto');
const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, QueryCommand, TransactWriteItemsCommand } = require('@aws-sdk/client-dynamodb');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const L = require('./lib');
const { makeStore } = require('./store');

const REGION = process.env.AWS_REGION || 'us-east-2';
const TABLE = process.env.MTY_TABLE;
const NOTIFY_TO = process.env.NOTIFY_TO;
const NOTIFY_FROM = process.env.NOTIFY_FROM;
const SECRET_PARAM = process.env.MTY_SECRET_PARAM;
const MAX_MAIL_DAY = parseInt(process.env.MAX_MAIL_DAY || '30', 10);
const MAX_BODY = 10 * 1024;

const ddb = new DynamoDBClient({ region: REGION });
const ses = new SESv2Client({ region: REGION });
const ssm = new SSMClient({ region: REGION });
let store = makeStore({ ddb, table: TABLE, C: { PutItemCommand, GetItemCommand, UpdateItemCommand, QueryCommand, TransactWriteItemsCommand } });
let mailer = (msg) => ses.send(new SendEmailCommand({
  FromEmailAddress: NOTIFY_FROM, Destination: { ToAddresses: [NOTIFY_TO] },
  Content: { Simple: { Subject: { Data: msg.subject, Charset: 'UTF-8' }, Body: { Text: { Data: msg.text, Charset: 'UTF-8' }, Html: { Data: msg.html, Charset: 'UTF-8' } } } },
}));

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
};
const reply = (statusCode, body, extra) => ({ statusCode, headers: { ...HEADERS, ...(extra || {}) }, body: JSON.stringify(body) });
const page = (statusCode, html) => ({ statusCode, headers: L.PAGE_HEADERS, body: html });

/* secreto de firma: parámetro SecureString de SSM, en memoria mientras la función siga caliente */
let secretCache = null;
async function getSecret() {
  if (process.env.MTY_SECRET) return process.env.MTY_SECRET;      // solo para pruebas locales
  if (secretCache) return secretCache;
  const r = await ssm.send(new GetParameterCommand({ Name: SECRET_PARAM, WithDecryption: true }));
  secretCache = r.Parameter.Value;
  return secretCache;
}

const parseJson = (event) => { try { return JSON.parse(event.body || '{}'); } catch (e) { return null; } };
const rawBody = (event) => (event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || ''));
const modBase = () => process.env.MOD_BASE;
const newId = (now) => now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '-' + crypto.randomBytes(3).toString('hex');

/* ---------- POST /mty/submit ---------- */
async function submit(event, deps = {}) {
  const now = deps.now || new Date();
  if (rawBody(event).length > MAX_BODY) return reply(413, { ok: false, error: 'too_large' });
  const body = parseJson(event);
  if (!body) return reply(400, { ok: false, error: 'json' });
  if (body.website) return reply(200, { ok: true, id: 'ok' });                    // trampa para bots: se ignora en silencio
  const { errs, item } = L.validate(body);
  if (errs.length) return reply(400, { ok: false, error: 'validation', fields: errs });

  const nowIso = now.toISOString(), nowSec = Math.floor(now.getTime() / 1000);
  const target = L.targetOf(item);
  try {
    const secret = await getSecret();
    if (item.tipo !== 'sug' && !(await store.reserveDedupe(target, L.contactHash(secret, item), nowSec))) {
      return reply(409, { ok: false, error: 'duplicate' });
    }
    const id = newId(now);
    const key = await store.putSubmission(target, id, item, item.tipo === 'sug' ? 'info' : 'pendiente', nowIso, nowSec);

    // correo: si falla o se pasó el tope del día, el envío ya está guardado
    let emailed = false;
    try {
      const n = await store.bumpMail(nowIso.slice(0, 10), nowSec);
      if (n <= MAX_MAIL_DAY) {
        const msg = item.tipo === 'sug'
          ? L.emailSuggestion({ id, item })
          : L.emailPending({ id, item, names: {}, approveUrl: L.modLink(modBase(event), secret, key, 'ok', nowSec), rejectUrl: L.modLink(modBase(event), secret, key, 'no', nowSec) });
        await (deps.mailer || mailer)(msg);
        emailed = true;
      }
    } catch (e) { console.error('mail', e && e.name); }
    return reply(200, { ok: true, id, pending: item.tipo !== 'sug', emailed });
  } catch (e) { console.error('submit', e && e.name, e && e.message); return reply(500, { ok: false, error: 'storage' }); }
}

/* ---------- GET /mty/public ---------- */
const pub = (x) => (x.tipo === 'reco'
  ? { tipo: 'reco', nombre: x.nombre, disciplina: x.disciplina, link: x.link || '', zona: x.zona || '', porque: x.porque, alias: x.alias || '', fecha: String(x.sk || '').slice(0, 10) }
  : { tipo: 'checkin', ref: x.ref, estrellas: x.estrellas, comentario: x.comentario, alias: x.alias || '', social: x.social || '', link: x.link || '', fecha: String(x.sk || '').slice(0, 10) });

async function publicList(event) {
  const ref = event.queryStringParameters && event.queryStringParameters.ref;
  const cache = { 'Cache-Control': 'public, max-age=30' };
  try {
    if (!ref) return reply(200, { ok: true, agg: await store.listAgg() }, cache);
    if (ref !== 'reco' && !L.targetOk(ref)) return reply(400, { ok: false, error: 'ref' });
    const items = await store.listApproved(ref);
    return reply(200, { ok: true, items: items.map(pub) }, cache);
  } catch (e) { console.error('public', e && e.name); return reply(500, { ok: false, error: 'storage' }); }
}

/* ---------- GET y POST de la URL de moderación (los enlaces del correo) ---------- */
async function moderate(event, deps = {}) {
  const now = deps.now || new Date();
  const nowSec = Math.floor(now.getTime() / 1000);
  const method = event.httpMethod || (event.requestContext && event.requestContext.http && event.requestContext.http.method);   // API Gateway (v1) o URL de función (v2)
  const isPost = method === 'POST';
  const params = isPost ? Object.fromEntries(new URLSearchParams(rawBody(event).slice(0, 2000))) : (event.queryStringParameters || {});
  try {
    const secret = await getSecret();
    const v = L.verify(secret, params, nowSec);
    if (v === 'bad') return page(400, L.messagePage('Enlace no válido', 'Este enlace no es válido.'));
    if (v === 'expired') return page(410, L.messagePage('Enlace caducado', 'Este enlace caducó (duran 14 días). Revisa el envío directamente en la tabla de AWS.'));
    const approve = params.a === 'ok';
    if (!isPost) {
      const cur = await store.getSubmission(params.k, params.s);
      if (!cur || !params.k.startsWith('s#')) return page(404, L.messagePage('No encontrado', 'Ese envío ya no existe (pudo vencer).'));
      if (cur.estado !== 'pendiente') return page(200, L.messagePage('Ya decidido', `Este envío ya está: ${cur.estado}.`));
      return page(200, L.confirmPage({ item: cur, names: {}, action: params.a, params }));
    }
    const r = await store.decide(params.k, params.s, approve, now.toISOString(), nowSec);
    if (r.status === 'missing') return page(404, L.messagePage('No encontrado', 'Ese envío ya no existe (pudo vencer).'));
    if (r.status === 'already') return page(200, L.messagePage('Ya decidido', `Este envío ya está: ${r.estado || 'decidido'}. No se cambió nada.`));
    return page(200, L.messagePage(approve ? 'Aprobado' : 'Rechazado', approve ? 'Listo: ya aparece en /mty.' : 'Listo: no se publicará.'));
  } catch (e) { console.error('moderate', e && e.name); return page(500, L.messagePage('Error', 'No se pudo completar. Intenta de nuevo en un momento.')); }
}

module.exports = {
  submit, publicList, moderate,
  _test: { setStore: (s) => { store = s; }, setMailer: (m) => { mailer = m; }, pub },
};

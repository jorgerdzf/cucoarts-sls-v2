'use strict';

/* Solicitudes de cucoarts.com (cotizador artístico y registro de artistas para la tienda).
 *  POST /requests/upload-url  -> devuelve URLs firmadas para subir archivos (CV, colección, imágenes) a S3.
 *  POST /requests             -> valida la solicitud, la guarda en DynamoDB y la envía por correo (SES) a NOTIFY_TO,
 *                                con los archivos adjuntos cuando caben en el correo.
 * Usa solo el AWS SDK v3 que ya trae el runtime de Lambda (sin node_modules). */

const crypto = require('crypto');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const REGION = process.env.AWS_REGION || 'us-east-2';
const TABLE = process.env.REQUESTS_TABLE;
const BUCKET = process.env.UPLOADS_BUCKET;
const NOTIFY_TO = process.env.NOTIFY_TO;
const NOTIFY_FROM = process.env.NOTIFY_FROM;
const POLICY_VERSION = '2026-10-05';

const MAX_FILES = 4;
const MAX_FILE = 5 * 1024 * 1024;       // 5 MB por archivo
const MAX_TOTAL = 7 * 1024 * 1024;      // 7 MB en total (cabe en un correo de 10 MB)
const ALLOWED = {
  pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  zip: 'application/zip',
};

const ddb = new DynamoDBClient({ region: REGION });
const s3 = new S3Client({ region: REGION });
const ses = new SESv2Client({ region: REGION });

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
};
const reply = (statusCode, body) => ({ statusCode, headers: HEADERS, body: JSON.stringify(body) });

/* ---------- utilidades ---------- */
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/[\r\n]+/g, ' ');
const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;
const parse = (event) => { try { return JSON.parse(event.body || '{}'); } catch (e) { return null; } };
const safeName = (n) => oneLine(n, 120).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '') || 'archivo';
const extOf = (n) => (n.split('.').pop() || '').toLowerCase();

const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

/* URL firmada (SigV4, query string) para subir un objeto con PUT. Sin dependencias extra. */
function presignPut({ bucket, key, contentType, expires = 900, now = new Date(), creds = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, sessionToken: process.env.AWS_SESSION_TOKEN } }) {
  const host = `${bucket}.s3.${REGION}.amazonaws.com`;
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const scope = `${date}/${REGION}/s3/aws4_request`;
  const params = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${creds.accessKeyId}/${scope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expires),
    'X-Amz-SignedHeaders': 'content-type;host',
  };
  if (creds.sessionToken) params['X-Amz-Security-Token'] = creds.sessionToken;
  const qs = Object.keys(params).sort().map((k) => `${enc(k)}=${enc(params[k])}`).join('&');
  const uri = '/' + key.split('/').map(enc).join('/');
  const canonical = ['PUT', uri, qs, `content-type:${contentType}\nhost:${host}\n`, 'content-type;host', 'UNSIGNED-PAYLOAD'].join('\n');
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonical)].join('\n');
  const kSigning = hmac(hmac(hmac(hmac('AWS4' + creds.secretAccessKey, date), REGION), 's3'), 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(toSign).digest('hex');
  return `https://${host}${uri}?${qs}&X-Amz-Signature=${signature}`;
}

/* ---------- POST /requests/upload-url ---------- */
async function uploadUrl(event) {
  const body = parse(event);
  if (!body || !Array.isArray(body.files) || !body.files.length) return reply(400, { ok: false, error: 'files' });
  if (body.files.length > MAX_FILES) return reply(400, { ok: false, error: 'too_many_files' });
  let total = 0;
  const batch = crypto.randomUUID();
  const uploads = [];
  for (let i = 0; i < body.files.length; i++) {
    const f = body.files[i] || {};
    const name = safeName(f.name);
    const type = ALLOWED[extOf(name)];
    const size = Number(f.size) || 0;
    if (!type) return reply(400, { ok: false, error: 'file_type', name });
    if (size <= 0 || size > MAX_FILE) return reply(400, { ok: false, error: 'file_size', name });
    total += size;
    if (total > MAX_TOTAL) return reply(400, { ok: false, error: 'total_size' });
    const key = `uploads/${batch}/${i + 1}-${name}`;
    uploads.push({ key, name, type, url: presignPut({ bucket: BUCKET, key, contentType: type }) });
  }
  return reply(200, { ok: true, batch, uploads });
}

/* ---------- validación de solicitudes ---------- */
function validate(type, v) {
  const out = {};
  const need = (k, max, msg, test) => { out[k] = oneLine(v[k], max); if (!out[k] || (test && !test(out[k]))) return msg || k; return null; };
  const opt = (k, max, multiline) => { out[k] = multiline ? clean(v[k], max) : oneLine(v[k], max); };
  const errs = [];
  if (type === 'sell') {
    [need('nombre', 120), need('correo', 200, 'correo', emailOk), need('ig', 120), need('portafolio', 2000)].forEach((e) => e && errs.push(e));
    out.portafolio = clean(v.portafolio, 2000);
    if (!['paquete', 'condonacion', 'propio'].includes(v.opcion)) errs.push('opcion'); else out.opcion = v.opcion;
    opt('colab', 1500, true); opt('extras', 3000, true);
    if (v.consent !== 'on') errs.push('consent'); else out.consent = 'on';
  } else if (type === 'rob') {
    [need('nombre', 120), need('tel', 40, 'tel', (s) => s.replace(/\D/g, '').length >= 10)].forEach((e) => e && errs.push(e));
    if (!Object.keys(ROB_SERVICIOS).includes(v.servicio)) errs.push('servicio'); else out.servicio = v.servicio;
    opt('correo', 200); if (out.correo && !emailOk(out.correo)) errs.push('correo');
    opt('fecha', 20); opt('presupuesto', 60); opt('factura', 5); opt('idea', 3000, true);
  } else {
    [need('nombre', 120), need('tel', 40, 'tel', (s) => s.replace(/\D/g, '').length >= 10)].forEach((e) => e && errs.push(e));
    opt('correo', 200); if (out.correo && !emailOk(out.correo)) errs.push('correo');
    opt('tipo', 30); opt('lugar', 30); opt('ancho', 20); opt('alto', 20); opt('unidad', 10); opt('presupuesto', 60);
    opt('ciudad', 120); opt('fecha', 20); opt('factura', 5); opt('idea', 3000, true);
  }
  out.novedades = v.novedades === 'on' ? 'on' : '';
  return { errs, out };
}

/* ---------- correo ---------- */
const b64 = (buf) => Buffer.from(buf).toString('base64').replace(/(.{76})/g, '$1\r\n');
const encSubject = (s) => '=?UTF-8?B?' + Buffer.from(s, 'utf8').toString('base64') + '?=';

function buildRaw({ subject, text, replyTo, attachments }) {
  const boundary = 'cuco_' + crypto.randomBytes(12).toString('hex');
  const head = [
    `From: CUCO ARTS web <${NOTIFY_FROM}>`,
    `To: ${NOTIFY_TO}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encSubject(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ].filter(Boolean).join('\r\n');
  const parts = [
    `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64(text)}\r\n`,
    ...attachments.map((a) => `--${boundary}\r\nContent-Type: ${a.type}; name="${a.name}"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename="${a.name}"\r\n\r\n${b64(a.data)}\r\n`),
    `--${boundary}--`,
  ];
  return Buffer.from(head + '\r\n\r\n' + parts.join(''), 'utf8');
}

const ROB_SERVICIOS = {
  evento: 'Cobertura de un evento', contenido: 'Contenido para marca o educación', edicion: 'Edición de video',
  tienda: 'Tienda en línea para artistas', encargo: 'Obra por encargo', otro: 'Otro / colaboración creativa',
};

const LABELS = {
  sell: { nombre: 'Nombre', correo: 'Correo', ig: 'Instagram', portafolio: 'Portafolio con precios', opcion: 'Opción', colab: 'Puede ofrecer', extras: 'Extras' },
  rob: { servicio: 'Servicio', nombre: 'Nombre', tel: 'WhatsApp', correo: 'Correo', fecha: 'Fecha', presupuesto: 'Presupuesto', factura: 'Factura', idea: 'Descripción' },
  quote: { tipo: 'Tipo', lugar: 'Dónde va', ancho: 'Ancho', alto: 'Alto', unidad: 'Unidad', presupuesto: 'Presupuesto (opción)', ciudad: 'Ciudad', fecha: 'Fecha límite', factura: 'Factura', nombre: 'Nombre', tel: 'WhatsApp', correo: 'Correo', idea: 'Idea' },
};
const OPCIONES = { paquete: 'Paquete de registro ($1,500 IVA incluido)', condonacion: 'Solicita condonación o colaboración equivalente', propio: 'Ya tiene fotos y entrevista (solo comisión y acuerdo)' };

function emailText({ id, type, lang, values, summary, files, notAttached }) {
  const L = [];
  const titulo = type === 'sell' ? 'NUEVA SOLICITUD: artista que quiere vender en la tienda'
    : type === 'rob' ? `NUEVA SOLICITUD (cucoarts.com/rob): ${ROB_SERVICIOS[values.servicio] || 'cotización'}`
    : 'NUEVA SOLICITUD: cotización artística';
  L.push(titulo, `Folio: ${id}`, `Idioma de la persona: ${lang}`, '');
  Object.entries(LABELS[type]).forEach(([k, label]) => {
    let val = values[k]; if (!val) return;
    if (k === 'opcion') val = OPCIONES[val] || val;
    if (k === 'servicio') val = ROB_SERVICIOS[val] || val;
    L.push(`${label}: ${val}`);
  });
  L.push(`Quiere recibir noticias: ${values.novedades ? 'Sí' : 'No'}`);
  if (files.length) { L.push('', 'Archivos recibidos:'); files.forEach((f) => L.push(`- ${f.name} (${Math.round(f.size / 1024)} KB)${notAttached.includes(f.key) ? ' — no se adjuntó al correo; está guardado en S3: ' + f.key : ''}`)); }
  L.push('', '--- Mensaje tal como lo vio la persona ---', summary);
  return L.join('\n');
}

/* ---------- POST /requests ---------- */
async function submit(event) {
  const body = parse(event);
  if (!body) return reply(400, { ok: false, error: 'json' });
  if (body.website) return reply(200, { ok: true, id: 'ok' });                  // trampa para bots: se ignora en silencio
  const type = ['sell', 'quote', 'rob'].includes(body.type) ? body.type : null;
  if (!type) return reply(400, { ok: false, error: 'type' });
  const { errs, out } = validate(type, body.values || {});
  if (errs.length) return reply(400, { ok: false, error: 'validation', fields: errs });

  // archivos: deben venir de un lote de este servicio y existir en S3 con tamaño permitido
  const files = [];
  let total = 0;
  const wanted = Array.isArray(body.files) ? body.files.slice(0, MAX_FILES) : [];
  for (const f of wanted) {
    const key = String((f && f.key) || '');
    if (!/^uploads\/[0-9a-f-]{36}\/[1-9]-[A-Za-z0-9._-]+$/.test(key)) continue;
    try {
      const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
      if (head.ContentLength > MAX_FILE || total + head.ContentLength > MAX_TOTAL) continue;
      total += head.ContentLength;
      files.push({ key, name: key.split('/').pop().replace(/^\d+-/, ''), size: head.ContentLength, type: head.ContentType || 'application/octet-stream' });
    } catch (e) { /* el archivo no llegó: se omite */ }
  }

  const id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '-' + crypto.randomBytes(3).toString('hex');
  const lang = body.lang === 'en' ? 'en' : 'es';
  const summary = clean(body.summary, 4000);
  const item = {
    id: { S: id }, type: { S: type }, status: { S: 'nuevo' }, createdAt: { S: new Date().toISOString() },
    lang: { S: lang }, policyVersion: { S: POLICY_VERSION }, values: { S: JSON.stringify(out) },
    files: { S: JSON.stringify(files) }, summary: { S: summary },
  };
  try { await ddb.send(new PutItemCommand({ TableName: TABLE, Item: item, ConditionExpression: 'attribute_not_exists(id)' })); }
  catch (e) { console.error('dynamodb', e); return reply(500, { ok: false, error: 'storage' }); }

  // correo (si falla, la solicitud ya está guardada)
  let emailed = false;
  try {
    const attachments = []; const notAttached = [];
    for (const f of files) {
      try {
        const o = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: f.key }));
        const chunks = []; for await (const c of o.Body) chunks.push(c);
        attachments.push({ name: f.name, type: f.type, data: Buffer.concat(chunks) });
      } catch (e) { notAttached.push(f.key); }
    }
    const subject = type === 'sell' ? `Tienda: quiere vender su obra — ${out.nombre}`
      : type === 'rob' ? `Rob: ${ROB_SERVICIOS[out.servicio]} — ${out.nombre}`
      : `Cotización artística — ${out.nombre}`;
    const raw = buildRaw({ subject, text: emailText({ id, type, lang, values: out, summary, files, notAttached }), replyTo: out.correo || null, attachments });
    await ses.send(new SendEmailCommand({ FromEmailAddress: NOTIFY_FROM, Destination: { ToAddresses: [NOTIFY_TO] }, Content: { Raw: { Data: raw } } }));
    emailed = true;
  } catch (e) { console.error('ses', e); }

  return reply(200, { ok: true, id, emailed });
}

module.exports = { uploadUrl, submit, _test: { presignPut, validate, buildRaw, emailText, safeName } };

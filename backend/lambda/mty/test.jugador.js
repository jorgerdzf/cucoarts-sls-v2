'use strict';
// Prueba local sin AWS del registro de jugadores y de los eventos compartidos:  node mty_vs_art/test.jugador.js
// (se copia como backend/lambda/mty/test.jugador.js junto con los archivos de servidor/)
const Module = require('module'), assert = require('assert');
const fake = {
  '@aws-sdk/client-dynamodb': new Proxy({ DynamoDBClient: class { send() { return {}; } } }, { get: (t, k) => t[k] || class { constructor(i) { Object.assign(this, i, { __cmd: String(k) }); } } }),
  '@aws-sdk/client-sesv2': { SESv2Client: class { send() { return {}; } }, SendEmailCommand: class { constructor(i) { Object.assign(this, i); } } },
  '@aws-sdk/client-ssm': { SSMClient: class { send() { return {}; } }, GetParameterCommand: class { constructor(i) { Object.assign(this, i); } } },
};
const orig = Module.prototype.require;
Module.prototype.require = function (id) { return fake[id] || orig.apply(this, arguments); };
Object.assign(process.env, { MTY_TABLE: 't', NOTIFY_TO: 'to@x.mx', NOTIFY_FROM: 'from@x.mx', MTY_SECRET: 'secreto-de-prueba', MAX_MAIL_DAY: '30', MOD_BASE: 'https://mod.test/', MAX_SHARE_PER_IP: '2' });
const dir = process.env.MTY_DIR || __dirname;
const L = require(dir + '/lib'), m = require(dir + '/index.js');

function memStore() {
  const rows = new Map(), dedupe = new Set(), ips = {};
  return {
    rows,
    async reserveDedupe(t, h) { const k = t + '|' + h; if (dedupe.has(k)) return false; dedupe.add(k); return true; },
    async releaseDedupe(t, h) { dedupe.delete(t + '|' + h); },
    async bumpIp(k, max) { ips[k] = ips[k] || 0; if (ips[k] >= max) return false; ips[k]++; return true; },
    async bumpMail() { return 1; },
    async putSubmission(target, id, item, estado, nowIso) { const pk = 's#' + target, sk = nowIso + '#' + id; rows.set(pk + '|' + sk, { ...item, pk, sk, id, estado }); return { pk, sk }; },
    async getSubmission(pk, sk) { return rows.get(pk + '|' + sk) || null; },
    async decide(pk, sk, approve) { const r = rows.get(pk + '|' + sk); if (!r) return { status: 'missing' }; if (r.estado !== 'pendiente') return { status: 'already', estado: r.estado }; r.estado = approve ? 'aprobado' : 'rechazado'; return { status: 'ok', item: r }; },
    async listApproved(target) { return [...rows.values()].filter((r) => r.pk === 's#' + target && r.estado === 'aprobado').map((r) => ({ ...r })); },
    async listInfo(target) { return [...rows.values()].filter((r) => r.pk === 's#' + target && r.estado === 'info').map((r) => ({ ...r })); },
    async listAgg() { return {}; },
  };
}
const outbox = [], st = memStore();
m._test.setStore(st); m._test.setMailer(async (msg) => { outbox.push(msg); });
const ev = (b, extra) => ({ body: JSON.stringify(b), requestContext: { domainName: 'api.test', stage: 'dev', identity: { sourceIp: '1.2.3.4' } }, ...(extra || {}) });
const claim = (o) => ({ tipo: 'jugador', ig: '@Ana.Arte', via: 'ig', alias: 'Ana', consent: 'on', adulto: 'on', categoria: 'artist', ...(o || {}) });
const qs = (url) => Object.fromEntries(new URL(url).searchParams);

(async () => {
  /* validación */
  let r = L.validate(claim()); assert.deepStrictEqual(r.errs, []); assert.strictEqual(r.item.ig, 'ana.arte');
  assert.strictEqual(L.validate(claim({ ig: 'https://www.instagram.com/Ana.Arte/?hl=es' })).item.ig, 'ana.arte');
  assert(L.validate(claim({ ig: 'a' })).errs.includes('ig'));
  assert(L.validate(claim({ ig: 'ana arte' })).errs.includes('ig'));
  assert(L.validate(claim({ consent: '' })).errs.includes('consent'));
  assert(L.validate(claim({ adulto: '' })).errs.includes('consent'));
  assert(L.validate(claim({ categoria: '' })).errs.includes('categoria'));
  assert(L.validate(claim({ categoria: 'rey' })).errs.includes('categoria'));
  assert.strictEqual(L.validate(claim({ categoria: 'museum' })).item.categoria, 'museum');                      // sin confirmar 18 años no se registra
  assert.strictEqual(L.validate(claim({ via: 'ig', marketing: 'on' })).item.marketing, undefined);   // sin correo ni WhatsApp no hay invitaciones
  assert.strictEqual(L.validate(claim({ via: 'correo', contacto: 'ana@correo.mx', marketing: 'on' })).item.marketing, 'on');
  assert.strictEqual(L.validate(claim({ via: 'correo', contacto: 'ana@correo.mx' })).item.marketing, undefined);   // casilla B aparte: no marcada = no
  assert.strictEqual(L.validate(claim({ alias_pub: 'on' })).item.alias_pub, 'on');
  assert(L.validate(claim({ via: 'correo', contacto: 'no-es-correo' })).errs.includes('contacto'));
  assert(L.validate(claim({ via: 'correo', contacto: 'ana@correo.mx' })).errs.length === 0);
  assert(L.validate(claim({ via: 'whatsapp', contacto: '81 1234 5678' })).errs.length === 0);
  assert.deepStrictEqual(L.validate({ tipo: 'checkin', ref: 'evento:x', estrellas: 5, comentario: 'muy bien!!', via: 'correo', contacto: 'a@b.mx', consent: 'on' }).errs, []);   // los tipos de siempre siguen igual

  /* registro: respuesta con código, aviso a Roberto con botones, dedupe */
  let res = await m.submit(ev(claim({ via: 'correo', contacto: 'ana@correo.mx' })));
  let b = JSON.parse(res.body); assert.strictEqual(res.statusCode, 200); assert(b.ok && b.pending && /^MTY-[A-Z2-9]{6}$/.test(b.codigo), res.body);
  assert.strictEqual(outbox.length, 1); const mail = outbox[0];
  assert(mail.text.includes(b.codigo) && mail.text.includes('@ana.arte') && /APROBAR: https:\/\/mod\.test\//.test(mail.text)); assert(mail.subject.includes('@ana.arte'));
  assert(JSON.parse((await m.submit(ev(claim()))).body).error === 'duplicate');
  assert.strictEqual(JSON.parse((await m.submit(ev({ ...claim(), website: 'spam' }))).body).id, 'ok');   // honeypot
  assert.strictEqual(L.claimCode('secreto-de-prueba', 'ana.arte'), b.codigo);                              // el código es estable para el mismo usuario

  /* antes de aprobar no aparece en la lista pública */
  let pub = JSON.parse((await m.publicList({ queryStringParameters: { ref: 'jugador' } })).body); assert.deepStrictEqual(pub.items, []);

  /* moderación: abrir el enlace no cambia nada; confirmar sí */
  const approve = /APROBAR: (\S+)/.exec(mail.text)[1], p = qs(approve);
  const page = await m.moderate({ httpMethod: 'GET', queryStringParameters: p }); assert.strictEqual(page.statusCode, 200); assert(page.body.includes(b.codigo) && page.body.includes('@ana.arte'));
  assert.strictEqual([...st.rows.values()].find((x) => x.tipo === 'jugador').estado, 'pendiente');
  const done = await m.moderate({ httpMethod: 'POST', body: new URLSearchParams(p).toString() }); assert.strictEqual(done.statusCode, 200);
  assert.strictEqual([...st.rows.values()].find((x) => x.tipo === 'jugador').estado, 'aprobado');
  pub = JSON.parse((await m.publicList({ queryStringParameters: { ref: 'jugador' } })).body);
  assert.strictEqual(pub.items.length, 1); assert.deepStrictEqual(Object.keys(pub.items[0]).sort(), ['alias', 'categoria', 'fecha', 'ig', 'tipo']);   // nunca el contacto ni el código
  assert(!JSON.stringify(pub).includes('ana@correo.mx') && !JSON.stringify(pub).includes(b.codigo));

  /* eventos compartidos: una vez por usuario y evento, tope por IP, lista sin datos privados */
  assert.strictEqual((await m.submit(ev({ tipo: 'compartir', ig: '@Ana.Arte', ev: 'evento:fama-26' }))).statusCode, 200);
  assert.strictEqual(JSON.parse((await m.submit(ev({ tipo: 'compartir', ig: 'ana.arte', ev: 'evento:fama-26' }))).body).error, 'duplicate');
  assert.strictEqual((await m.submit(ev({ tipo: 'compartir', ig: 'ana.arte', ev: 'evento:resolana' }))).statusCode, 200);
  assert.strictEqual((await m.submit(ev({ tipo: 'compartir', ig: 'ana.arte', ev: 'evento:../x' }))).statusCode, 400);
  assert.strictEqual((await m.submit(ev({ tipo: 'compartir', ig: 'ana.arte', ev: 'evento:otro' }))).statusCode, 429);   // tope por IP (2 en esta prueba)
  // un usuario SIN verificar no deja rastro: se responde igual, pero no se guarda ni sale en la lista pública
  assert.strictEqual((await m.submit(ev({ tipo: 'compartir', ig: 'intruso.sin.verificar', ev: 'evento:fama-26' }))).statusCode, 200);
  const sh = JSON.parse((await m.publicList({ queryStringParameters: { ref: 'compartidos' } })).body);
  assert(!JSON.stringify(sh).includes('intruso'));
  assert.strictEqual(sh.items.length, 2); assert.deepStrictEqual(Object.keys(sh.items[0]).sort(), ['ev', 'fecha', 'ig']);

  /* rechazar libera el usuario: quien aparta @ajeno no lo bloquea para su dueño real */
  const evIp = (b, ip) => ev(b, { requestContext: { domainName: 'api.test', stage: 'dev', identity: { sourceIp: ip } } });
  res = await m.submit(evIp(claim({ ig: '@duena.real' }), '5.5.5.5')); assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(JSON.parse((await m.submit(evIp(claim({ ig: '@duena.real' }), '6.6.6.6'))).body).error, 'duplicate');
  const rej = /RECHAZAR: (\S+)/.exec(outbox[outbox.length - 1].text)[1];
  assert.strictEqual((await m.moderate({ httpMethod: 'POST', body: new URLSearchParams(qs(rej)).toString() })).statusCode, 200);
  assert.strictEqual((await m.submit(evIp(claim({ ig: '@duena.real' }), '6.6.6.6'))).statusCode, 200);   // ya puede registrarse

  /* tope de registros por IP (8 por omisión) */
  for (let i = 0; i < 8; i++) assert.strictEqual((await m.submit(evIp(claim({ ig: '@bot.uno' + i }), '9.9.9.9'))).statusCode, 200);
  assert.strictEqual(JSON.parse((await m.submit(evIp(claim({ ig: '@bot.uno9' }), '9.9.9.9'))).body).error, 'limit');
  console.log('OK · registro de jugadores y compartidos: todas las pruebas pasaron');
})().catch((e) => { console.error('FALLÓ:', e && e.stack || e); process.exit(1); });

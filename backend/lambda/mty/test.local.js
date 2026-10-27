'use strict';
// Prueba local sin AWS: node backend/lambda/mty/test.local.js
// Sustituye el SDK por simulaciones y revisa validación, firma de enlaces, moderación, privacidad y los comandos a DynamoDB.
const Module = require('module');
const assert = require('assert');

const fake = {
  '@aws-sdk/client-dynamodb': new Proxy({ DynamoDBClient: class { send() { return {}; } } }, { get: (t, k) => t[k] || class { constructor(i) { Object.assign(this, i, { __cmd: String(k) }); } } }),
  '@aws-sdk/client-sesv2': { SESv2Client: class { send() { return {}; } }, SendEmailCommand: class { constructor(i) { Object.assign(this, i); } } },
  '@aws-sdk/client-ssm': { SSMClient: class { send() { return {}; } }, GetParameterCommand: class { constructor(i) { Object.assign(this, i); } } },
};
const orig = Module.prototype.require;
Module.prototype.require = function (id) { return fake[id] || orig.apply(this, arguments); };
Object.assign(process.env, { MTY_TABLE: 't', NOTIFY_TO: 'to@x.mx', NOTIFY_FROM: 'from@x.mx', MTY_SECRET: 'secreto-de-prueba', MAX_MAIL_DAY: '30', MOD_BASE: 'https://mod.test/' });

const L = require('./lib');
const { makeStore, plain } = require('./store');
const m = require('./index.js');

/* ---------- almacén en memoria con la misma interfaz que store.js ---------- */
function memStore() {
  const rows = new Map(); const dedupe = new Set(); const mail = {}; const agg = {};
  return {
    rows, agg,
    async reserveDedupe(t, h) { const k = t + '|' + h; if (dedupe.has(k)) return false; dedupe.add(k); return true; },
    async bumpMail(day) { mail[day] = (mail[day] || 0) + 1; return mail[day]; },
    async putSubmission(target, id, item, estado, nowIso) { const pk = 's#' + target, sk = nowIso + '#' + id; rows.set(pk + '|' + sk, { ...item, pk, sk, id, estado }); return { pk, sk }; },
    async getSubmission(pk, sk) { return rows.get(pk + '|' + sk) || null; },
    async decide(pk, sk, approve) {
      const r = rows.get(pk + '|' + sk); if (!r) return { status: 'missing' };
      if (r.estado !== 'pendiente') return { status: 'already', estado: r.estado };
      r.estado = approve ? 'aprobado' : 'rechazado';
      if (approve && r.tipo === 'checkin') { const a = agg[r.ref] || (agg[r.ref] = { n: 0, sum: 0 }); a.n++; a.sum += r.estrellas; }
      return { status: 'ok', item: r };
    },
    async listApproved(target) { return [...rows.values()].filter((r) => r.pk === 's#' + target && r.estado === 'aprobado').map((r) => ({ ...r })); },
    async listAgg() { return agg; },
  };
}
const outbox = [];
const st = memStore();
m._test.setStore(st);
m._test.setMailer(async (msg) => { outbox.push(msg); });

const ev = (b, extra) => ({ body: JSON.stringify(b), requestContext: { domainName: 'api.test', stage: 'dev' }, ...(extra || {}) });
const good = () => ({ tipo: 'checkin', ref: 'evento:megaflat', titulo: 'Flux Forma MEGAFLAT', estrellas: 4, comentario: 'Muy buena expo, me encantó', alias: 'Ana', via: 'correo', contacto: 'Ana@Correo.com', social: '@ana.arte', link: 'https://instagram.com/p/xyz', consent: 'on' });
const linksOf = (msg) => ({ ok: /APROBAR: (\S+)/.exec(msg.text)[1], no: /RECHAZAR: (\S+)/.exec(msg.text)[1] });
const qs = (url) => Object.fromEntries(new URL(url).searchParams);

(async () => {
  /* ---- validación ---- */
  let r = L.validate(good()); assert.deepStrictEqual(r.errs, []); assert.strictEqual(r.item.social, '@ana.arte');
  assert(L.validate({ ...good(), ref: 'evento:../x' }).errs.includes('ref'));
  assert(L.validate({ ...good(), ref: 'otro:abc' }).errs.includes('ref'));
  assert(L.validate({ ...good(), estrellas: 0 }).errs.includes('estrellas')); assert(L.validate({ ...good(), estrellas: 6 }).errs.includes('estrellas'));
  assert(L.validate({ ...good(), estrellas: 'x' }).errs.includes('estrellas'));
  assert(L.validate({ ...good(), comentario: 'hey' }).errs.includes('comentario'));
  assert(L.validate({ ...good(), contacto: 'no-es-correo' }).errs.includes('contacto'));
  assert(L.validate({ ...good(), via: 'whatsapp', contacto: '81 1234' }).errs.includes('contacto'));
  assert.deepStrictEqual(L.validate({ ...good(), via: 'whatsapp', contacto: '81 1234 5678' }).errs, []);
  assert(L.validate({ ...good(), consent: '' }).errs.includes('consent'));
  for (const bad of ['javascript:alert(1)', 'data:text/html,<b>x</b>', 'ftp://x.com/a', 'https://x.com/"onmouseover=1', 'https://x.com/<script>']) assert(L.validate({ ...good(), link: bad }).errs.includes('link'), bad);
  assert(L.validate({ ...good(), social: 'javascript:alert(1)' }).errs.includes('social'));
  assert.strictEqual(L.validate({ ...good(), social: 'ana_arte' }).item.social, '@ana_arte');
  assert.strictEqual(L.validate({ ...good(), social: 'https://instagram.com/ana' }).item.social, 'https://instagram.com/ana');
  assert.strictEqual(L.validate({ ...good(), alias: 'A\u0000na\r\nBcc: x@y.z‮' }).item.alias, 'Ana Bcc: x@y.z');
  assert.strictEqual(L.validate({ ...good(), comentario: 'x'.repeat(5000) }).item.comentario.length, 600);
  assert.strictEqual(L.validate({ tipo: 'otro' }).errs[0], 'tipo');
  const reco = { tipo: 'reco', nombre: 'Colectivo X', disciplina: 'urbano', link: '@colectivox', zona: 'norte', porque: 'Pintan los muros del barrio', alias: '', consent: 'on' };
  r = L.validate(reco); assert.deepStrictEqual(r.errs, []); assert.strictEqual(r.item.ref, 'reco');
  assert(L.validate({ ...reco, disciplina: 'inventada' }).errs.includes('disciplina')); assert(L.validate({ ...reco, link: '' }).errs.includes('link'));
  const sug = L.validate({ tipo: 'sug', ref: 'Evento: X', motivo: 'fecha', texto: 'Cambia la hora a las 6', contacto: 'a@b.co' }); assert.deepStrictEqual(sug.errs, []);
  assert(L.validate({ tipo: 'sug', ref: 'x', texto: 'ab' }).errs.includes('texto'));

  /* ---- firma de enlaces ---- */
  const now = 1790000000;
  const key = { pk: 's#evento:megaflat', sk: '2026-10-26T20:00:00.000Z#abc' };
  const url = L.modLink('https://mod.test/', 'S', key, 'ok', now); const p = qs(url);
  assert.strictEqual(L.verify('S', p, now), 'ok');
  assert.strictEqual(L.verify('OTRO', p, now), 'bad');
  assert.strictEqual(L.verify('S', { ...p, a: 'no' }, now), 'bad');            // no se puede convertir "aprobar" en "rechazar"
  assert.strictEqual(L.verify('S', { ...p, k: 's#evento:otro' }, now), 'bad');
  assert.strictEqual(L.verify('S', { ...p, s: 'x' }, now), 'bad');
  assert.strictEqual(L.verify('S', { ...p, t: p.t.slice(0, -2) + 'zz' }, now), 'bad');
  assert.strictEqual(L.verify('S', { ...p, t: '' }, now), 'bad');
  assert.strictEqual(L.verify('S', {}, now), 'bad');
  assert.strictEqual(L.verify('S', p, now + 14 * 86400 - 5), 'ok');
  assert.strictEqual(L.verify('S', p, now + 14 * 86400 + 5), 'expired');
  const e2 = String(Number(p.e) + 9999999); assert.strictEqual(L.verify('S', { ...p, e: e2 }, now), 'bad');   // no se puede alargar la caducidad

  /* ---- páginas: todo se escapa ---- */
  const xss = { tipo: 'checkin', ref: 'evento:a', estrellas: 3, comentario: '<img src=x onerror=alert(1)>', alias: '"><script>x</script>', social: '@a', link: 'https://x.com/?a=1&b=2', via: 'correo', contacto: 'a@b.co', titulo: '<b>T</b>' };
  const html = L.confirmPage({ item: xss, names: {}, action: 'ok', params: p });
  assert(!/<script>|<img src=x|<b>T<\/b>/.test(html), 'la página debe escapar el contenido');
  assert(/&lt;img src=x onerror/.test(html) && /method="post"/.test(html) && /Abrir esta página no cambia nada/.test(html));
  assert(/frame-ancestors 'none'/.test(L.PAGE_HEADERS['Content-Security-Policy']) && L.PAGE_HEADERS['X-Robots-Tag'].includes('noindex'));
  const em = L.emailPending({ id: '1', item: xss, names: {}, approveUrl: 'https://a/?x=1&y="2', rejectUrl: 'https://b' });
  assert(!/<script>|<img src=x/.test(em.html) && /&amp;y=&quot;2/.test(em.html));

  /* ---- envío ---- */
  r = await m.submit(ev(good()));
  let b = JSON.parse(r.body); assert.strictEqual(r.statusCode, 200); assert.strictEqual(b.pending, true); assert.strictEqual(b.emailed, true);
  assert.strictEqual(outbox.length, 1); assert(/Muy buena expo/.test(outbox[0].text) && /Flux Forma MEGAFLAT/.test(outbox[0].subject));
  const lk = linksOf(outbox[0]); assert(lk.ok.startsWith('https://mod.test/?')); assert.strictEqual(qs(lk.ok).a, 'ok'); assert.strictEqual(qs(lk.no).a, 'no');
  // pendiente: no se ve ni cuenta
  r = await m.publicList({ queryStringParameters: { ref: 'evento:megaflat' } }); assert.deepStrictEqual(JSON.parse(r.body).items, []);
  r = await m.publicList({ queryStringParameters: {} }); assert.deepStrictEqual(JSON.parse(r.body).agg, {});

  // trampa de bots, cuerpo enorme, mal formados
  const before = st.rows.size;
  r = await m.submit(ev({ ...good(), website: 'http://spam' })); assert.strictEqual(r.statusCode, 200); assert.strictEqual(st.rows.size, before);
  r = await m.submit({ body: 'x'.repeat(11000), requestContext: {} }); assert.strictEqual(r.statusCode, 413);
  r = await m.submit({ body: '{no json', requestContext: {} }); assert.strictEqual(r.statusCode, 400);
  r = await m.submit(ev({ ...good(), estrellas: 9 })); assert.strictEqual(r.statusCode, 400); assert.deepStrictEqual(JSON.parse(r.body).fields, ['estrellas']);

  // voto repetido (mismo correo en otra capitalización) y WhatsApp con formato distinto
  r = await m.submit(ev({ ...good(), contacto: 'ana@correo.COM' })); assert.strictEqual(r.statusCode, 409);
  r = await m.submit(ev({ ...good(), via: 'whatsapp', contacto: '81 1234 5678' })); assert.strictEqual(r.statusCode, 200);
  r = await m.submit(ev({ ...good(), via: 'whatsapp', contacto: '(81) 1234-5678' })); assert.strictEqual(r.statusCode, 409);
  r = await m.submit(ev({ ...good(), ref: 'evento:otro-evento' })); assert.strictEqual(r.statusCode, 200);   // otro evento: sí se permite

  /* ---- moderación ---- */
  const mod = (method, u) => { const q = qs(u); return method === 'GET' ? { httpMethod: 'GET', queryStringParameters: q } : { httpMethod: 'POST', body: new URLSearchParams(q).toString() }; };
  // abrir el enlace NO cambia nada
  r = await m.moderate(mod('GET', lk.ok)); assert.strictEqual(r.statusCode, 200); assert(/Sí, aprobar/.test(r.body) && /method="post"/.test(r.body));
  assert.strictEqual(st.agg['evento:megaflat'], undefined);
  r = await m.moderate(mod('GET', lk.ok)); assert.strictEqual(st.rows.get(qs(lk.ok).k + '|' + qs(lk.ok).s).estado, 'pendiente');
  // aprobar
  r = await m.moderate(mod('POST', lk.ok)); assert.strictEqual(r.statusCode, 200); assert(/Aprobado/.test(r.body));
  assert.deepStrictEqual(st.agg['evento:megaflat'], { n: 1, sum: 4 });
  // segunda vez (o el enlace de rechazar después): no cambia nada
  r = await m.moderate(mod('POST', lk.ok)); assert(/Ya decidido/.test(r.body)); assert.strictEqual(st.agg['evento:megaflat'].n, 1);
  r = await m.moderate(mod('POST', lk.no)); assert(/Ya decidido/.test(r.body)); assert.strictEqual(st.rows.get(qs(lk.ok).k + '|' + qs(lk.ok).s).estado, 'aprobado');
  // público: solo lo aprobado y nunca el contacto
  r = await m.publicList({ queryStringParameters: { ref: 'evento:megaflat' } }); b = JSON.parse(r.body);
  assert.strictEqual(b.items.length, 1); assert.strictEqual(b.items[0].alias, 'Ana'); assert.strictEqual(b.items[0].social, '@ana.arte');
  assert(!/contacto|correo|Correo|via|81 1234|@correo/i.test(r.body.replace(/"alias":"Ana"/, '')), 'la lectura pública no debe incluir el contacto: ' + r.body);
  r = await m.publicList({ queryStringParameters: {} }); assert.deepStrictEqual(JSON.parse(r.body).agg, { 'evento:megaflat': { n: 1, sum: 4 } });
  r = await m.publicList({ queryStringParameters: { ref: 'lugar:../../x' } }); assert.strictEqual(r.statusCode, 400);
  // rechazar
  const lk2 = linksOf(outbox[outbox.length - 1]);
  r = await m.moderate(mod('POST', lk2.no)); assert(/Rechazado/.test(r.body));
  r = await m.publicList({ queryStringParameters: { ref: 'evento:otro-evento' } }); assert.deepStrictEqual(JSON.parse(r.body).items, []);
  assert.strictEqual(st.agg['evento:otro-evento'], undefined);
  // formato de la URL de función (v2): el método viene en requestContext.http y el formulario puede llegar en base64
  const lkv2 = linksOf(outbox.find((o) => /Ana/.test(o.text) === false) || outbox[0]);
  r = await m.moderate({ requestContext: { http: { method: 'GET' } }, queryStringParameters: qs(lkv2.ok) }); assert.strictEqual(r.statusCode, 200);
  r = await m.moderate({ requestContext: { http: { method: 'POST' } }, isBase64Encoded: true, body: Buffer.from(new URLSearchParams(qs(lkv2.ok)).toString()).toString('base64') }); assert(/Ya decidido|Aprobado/.test(r.body));
  // enlaces malos
  const q0 = qs(lk.ok);
  r = await m.moderate({ httpMethod: 'POST', body: new URLSearchParams({ ...q0, a: 'no' }).toString() }); assert.strictEqual(r.statusCode, 400);
  r = await m.moderate({ httpMethod: 'GET', queryStringParameters: { ...q0, t: 'x' } }); assert.strictEqual(r.statusCode, 400);
  r = await m.moderate({ httpMethod: 'GET', queryStringParameters: {} }); assert.strictEqual(r.statusCode, 400);
  r = await m.moderate({ ...mod('GET', lk.ok), now: new Date(Date.now() + 15 * 86400e3) }, { now: new Date(Date.now() + 15 * 86400e3) }); assert.strictEqual(r.statusCode, 410);
  // un enlace firmado para otra fila que no existe
  const ghost = L.modLink('https://mod.test/', 'secreto-de-prueba', { pk: 's#evento:nada', sk: 'x' }, 'ok');
  r = await m.moderate(mod('GET', ghost)); assert.strictEqual(r.statusCode, 404);
  // no se pueden firmar filas que no sean envíos (promedios, huellas): la función las rechaza aunque estén firmadas
  const agg = L.modLink('https://mod.test/', 'secreto-de-prueba', { pk: 'agg', sk: 'evento:megaflat' }, 'ok');
  r = await m.moderate(mod('GET', agg)); assert.strictEqual(r.statusCode, 404);

  /* ---- recomendaciones y sugerencias ---- */
  r = await m.submit(ev({ tipo: 'reco', nombre: 'Colectivo X', disciplina: 'urbano', link: '@colectivox', zona: 'norte', porque: 'Pintan los muros del barrio', consent: 'on' }));
  assert.strictEqual(r.statusCode, 200); const lkr = linksOf(outbox[outbox.length - 1]); assert(/RECOMENDACIÓN PENDIENTE/.test(outbox[outbox.length - 1].text));
  r = await m.submit(ev({ tipo: 'reco', nombre: 'colectivo x', disciplina: 'urbano', link: '@COLECTIVOX', porque: 'Pintan los muros del barrio', consent: 'on' })); assert.strictEqual(r.statusCode, 409);
  r = await m.publicList({ queryStringParameters: { ref: 'reco' } }); assert.deepStrictEqual(JSON.parse(r.body).items, []);
  await m.moderate(mod('POST', lkr.ok)); r = await m.publicList({ queryStringParameters: { ref: 'reco' } }); b = JSON.parse(r.body);
  assert.strictEqual(b.items[0].nombre, 'Colectivo X'); assert.strictEqual(st.agg.reco, undefined);
  const n0 = outbox.length;
  r = await m.submit(ev({ tipo: 'sug', ref: 'Evento: X', motivo: 'fecha', texto: 'Cambia la hora a las 6', contacto: 'a@b.co' })); assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(JSON.parse(r.body).pending, false); assert(!/APROBAR/.test(outbox[n0].text) && /SUGERENCIA/.test(outbox[n0].text));
  r = await m.submit(ev({ tipo: 'sug', ref: 'Evento: X', motivo: 'fecha', texto: 'Otra vez lo mismo', contacto: 'a@b.co' })); assert.strictEqual(r.statusCode, 200);   // las sugerencias no se bloquean

  /* ---- tope diario de correos: se sigue guardando, deja de avisar ---- */
  const st2 = memStore(); m._test.setStore(st2); outbox.length = 0;
  let last;
  for (let i = 0; i < 33; i++) last = await m.submit(ev({ ...good(), ref: 'evento:e' + i, contacto: 'p' + i + '@x.co' }));
  assert.strictEqual(outbox.length, 30); assert.strictEqual(JSON.parse(last.body).emailed, false); assert.strictEqual(st2.rows.size, 33);

  /* ---- comandos reales a DynamoDB (con SDK simulado) ---- */
  const calls = [];
  const fakeDdb = { async send(c) {
    calls.push(c);
    if (c.__cmd === 'GetItemCommand') return { Item: { pk: { S: c.Key.pk.S }, sk: { S: c.Key.sk.S }, estado: { S: 'pendiente' }, tipo: { S: 'checkin' }, ref: { S: 'evento:a' }, estrellas: { N: '5' } } };
    if (c.__cmd === 'PutItemCommand' && String(c.Item.pk.S).startsWith('d#') && c.__dup) { const e = new Error('x'); e.name = 'ConditionalCheckFailedException'; throw e; }
    if (c.__cmd === 'UpdateItemCommand') return { Attributes: { n: { N: '7' } } };
    return {};
  } };
  const C = new Proxy({}, { get: (t, k) => class { constructor(i) { Object.assign(this, i, { __cmd: String(k) }); } } });
  const real = makeStore({ ddb: fakeDdb, table: 'tbl', C });
  assert.strictEqual(await real.reserveDedupe('evento:a', 'h', 1000), true);
  assert.strictEqual(calls[0].ConditionExpression, 'attribute_not_exists(pk)'); assert.strictEqual(calls[0].Item.expira.N, String(1000 + 365 * 86400));
  const dupDdb = { async send() { const e = new Error('x'); e.name = 'ConditionalCheckFailedException'; throw e; } };
  assert.strictEqual(await makeStore({ ddb: dupDdb, table: 't', C }).reserveDedupe('a', 'h', 1), false);
  assert.strictEqual(await real.bumpMail('2026-10-26', 1000), 7);
  calls.length = 0; const dres = await real.decide('s#evento:a', 'sk1', true, '2026-10-26T00:00:00Z', 1000);
  assert.strictEqual(dres.status, 'ok'); const tx = calls.find((c) => c.__cmd === 'TransactWriteItemsCommand').TransactItems;
  assert.strictEqual(tx.length, 3); assert.strictEqual(tx[0].Update.ConditionExpression, '#e = :p'); assert(/REMOVE expira/.test(tx[0].Update.UpdateExpression));
  assert.strictEqual(tx[1].Put.Item.pk.S, 'p#evento:a'); assert(!('contacto' in tx[1].Put.Item) && !('via' in tx[1].Put.Item), 'la copia pública no lleva contacto');
  assert.strictEqual(tx[2].Update.Key.pk.S, 'agg'); assert.strictEqual(tx[2].Update.ExpressionAttributeValues[':st'].N, '5');
  calls.length = 0; await real.decide('s#evento:a', 'sk1', false, '2026-10-26T00:00:00Z', 1000);
  const rej = calls.find((c) => c.__cmd === 'UpdateItemCommand'); assert.strictEqual(rej.ConditionExpression, '#e = :p'); assert.strictEqual(rej.ExpressionAttributeValues[':t'].N, String(1000 + 30 * 86400));
  assert.strictEqual((await real.decide('agg', 'x', true, 'i', 1)).status, 'missing');
  // ninguna expresión usa palabras reservadas sin alias (ttl, status...)
  calls.forEach((c) => { const e = (c.UpdateExpression || '') + ' ' + (c.FilterExpression || '') + ' ' + (c.ConditionExpression || ''); assert(!/\b(ttl|status|name|timestamp)\b/i.test(e), e); });
  assert.deepStrictEqual(plain({ a: { S: 'x' }, n: { N: '3' } }), { a: 'x', n: 3 });

  console.log('OK  todas las pruebas de /mty pasan');
})().catch((e) => { console.error('FALLÓ:', e); process.exit(1); });

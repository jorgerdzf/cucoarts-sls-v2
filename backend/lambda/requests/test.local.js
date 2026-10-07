'use strict';
// Prueba local sin AWS: node backend/lambda/requests/test.local.js
// Sustituye los clientes del SDK por simulaciones y revisa validación, URLs firmadas, guardado y correo.
const Module = require('module');
const assert = require('assert');

const sent = { ddb: [], ses: [], s3: [] };
const fake = {
  '@aws-sdk/client-dynamodb': { DynamoDBClient: class { send(c) { sent.ddb.push(c); return {}; } }, PutItemCommand: class { constructor(i) { Object.assign(this, i); } } },
  '@aws-sdk/client-s3': {
    S3Client: class { send(c) { sent.s3.push(c); if (c.kind === 'head') { if (c.Key.includes('missing')) throw new Error('404'); return { ContentLength: c.Key.includes('big') ? 9e6 : 1234, ContentType: 'application/pdf' }; }
      return { Body: (async function* () { yield Buffer.from('%PDF-fake'); })() }; } },
    HeadObjectCommand: class { constructor(i) { Object.assign(this, i, { kind: 'head' }); } },
    GetObjectCommand: class { constructor(i) { Object.assign(this, i, { kind: 'get' }); } },
  },
  '@aws-sdk/client-sesv2': { SESv2Client: class { send(c) { sent.ses.push(c); return {}; } }, SendEmailCommand: class { constructor(i) { Object.assign(this, i); } } },
};
const orig = Module.prototype.require;
Module.prototype.require = function (id) { return fake[id] || orig.apply(this, arguments); };

Object.assign(process.env, { REQUESTS_TABLE: 't', UPLOADS_BUCKET: 'bkt', NOTIFY_TO: 'to@x.mx', NOTIFY_FROM: 'from@x.mx', AWS_ACCESS_KEY_ID: 'AKIAEXAMPLE', AWS_SECRET_ACCESS_KEY: 'secret', AWS_SESSION_TOKEN: 'tok', AWS_REGION: 'us-east-2' });
const m = require('./index.js');
const ev = (b) => ({ body: JSON.stringify(b) });

(async () => {
  // URL firmada: estructura
  const u = m._test.presignPut({ bucket: 'bkt', key: 'uploads/abc/1-cv.pdf', contentType: 'application/pdf', now: new Date('2026-10-05T12:00:00Z') });
  assert(u.startsWith('https://bkt.s3.us-east-2.amazonaws.com/uploads/abc/1-cv.pdf?'));
  assert(/X-Amz-Date=20261005T120000Z/.test(u) && /X-Amz-SignedHeaders=content-type%3Bhost/.test(u) && /X-Amz-Signature=[0-9a-f]{64}$/.test(u) && /X-Amz-Security-Token=tok/.test(u));

  // upload-url
  let r = await m.uploadUrl(ev({ files: [{ name: 'Mi CV (final).pdf', size: 1000 }, { name: 'foto.JPG', size: 2e6 }] }));
  let b = JSON.parse(r.body); assert.strictEqual(r.statusCode, 200); assert.strictEqual(b.uploads.length, 2);
  assert(/^uploads\/[0-9a-f-]{36}\/1-Mi_CV_final_.pdf$/.test(b.uploads[0].key), b.uploads[0].key);
  r = await m.uploadUrl(ev({ files: [{ name: 'virus.exe', size: 10 }] })); assert.strictEqual(r.statusCode, 400);
  r = await m.uploadUrl(ev({ files: [{ name: 'a.pdf', size: 6e6 }] })); assert.strictEqual(JSON.parse(r.body).error, 'file_size');
  r = await m.uploadUrl(ev({ files: [{ name: 'a.pdf', size: 4e6 }, { name: 'b.pdf', size: 4e6 }] })); assert.strictEqual(JSON.parse(r.body).error, 'total_size');
  r = await m.uploadUrl(ev({ files: Array(5).fill({ name: 'a.pdf', size: 1 }) })); assert.strictEqual(JSON.parse(r.body).error, 'too_many_files');

  // solicitud de artista inválida
  r = await m.submit(ev({ type: 'sell', values: { nombre: '', correo: 'mal', ig: '', portafolio: '' } }));
  b = JSON.parse(r.body); assert.strictEqual(r.statusCode, 400); assert.deepStrictEqual(b.fields.sort(), ['consent', 'correo', 'ig', 'nombre', 'opcion', 'portafolio'].sort());

  // bots
  r = await m.submit(ev({ type: 'sell', website: 'http://spam', values: {} })); assert.strictEqual(r.statusCode, 200); assert.strictEqual(sent.ddb.length, 0);

  // solicitud de artista válida con archivos (uno existe, uno falta, uno es muy grande, uno con llave falsa)
  const batch = '123e4567-e89b-12d3-a456-426614174000';
  r = await m.submit(ev({ type: 'sell', lang: 'es', summary: 'Hola\nresumen', website: '',
    values: { nombre: 'Ana\r\nBcc: x@y.z', correo: 'ana@correo.com', ig: '@ana', portafolio: 'https://drive/x', opcion: 'condonacion', colab: 'difusión', extras: 'CV', consent: 'on', novedades: 'on' },
    files: [{ key: `uploads/${batch}/1-cv.pdf` }, { key: `uploads/${batch}/2-missing.pdf` }, { key: `uploads/${batch}/3-big.pdf` }, { key: '../../etc/passwd' }] }));
  b = JSON.parse(r.body); assert.strictEqual(r.statusCode, 200, r.body); assert.strictEqual(b.emailed, true);
  assert.strictEqual(sent.ddb.length, 1);
  const item = sent.ddb[0].Item; assert.strictEqual(item.type.S, 'sell'); assert.strictEqual(JSON.parse(item.files.S).length, 1);
  assert.strictEqual(JSON.parse(item.values.S).nombre, 'Ana Bcc: x@y.z');          // sin saltos de línea: no hay inyección de cabeceras
  const raw = sent.ses[0].Content.Raw.Data.toString('utf8');
  assert(raw.includes('To: to@x.mx') && raw.includes('Reply-To: ana@correo.com') && /Content-Disposition: attachment; filename="cv.pdf"/.test(raw));
  assert(!/\r\nBcc:/.test(raw));
  const text = Buffer.from(raw.split('Content-Transfer-Encoding: base64\r\n\r\n')[1].split('\r\n--')[0].replace(/\r\n/g, ''), 'base64').toString('utf8');
  assert(/Opción: Solicita condonación/.test(text) && /cv\.pdf/.test(text), text);

  // cotización
  r = await m.submit(ev({ type: 'quote', lang: 'en', summary: 'x', values: { nombre: 'Luis', tel: '81 1234 5678', tipo: 'mural', idea: 'gato' } }));
  assert.strictEqual(JSON.parse(r.body).ok, true);
  r = await m.submit(ev({ type: 'quote', values: { nombre: 'Luis', tel: '123' } })); assert.deepStrictEqual(JSON.parse(r.body).fields, ['tel']);
  // cotización de /rob
  r = await m.submit(ev({ type: 'rob', values: { nombre: 'Marca', tel: '81 1234 5678', servicio: 'inexistente' } })); assert.deepStrictEqual(JSON.parse(r.body).fields, ['servicio']);
  const antes = sent.ses.length;
  r = await m.submit(ev({ type: 'rob', lang: 'es', summary: 'Hola Rob, quiero cotizar: Cobertura de un evento\nLugar: MARCO', values: { servicio: 'evento', nombre: 'Marca MX', tel: '81 1234 5678', correo: 'hola@marca.mx', fecha: '2026-11-20', presupuesto: '$5,000 – $10,000', factura: 'Sí', idea: 'Inauguración', novedades: 'on' } }));
  b = JSON.parse(r.body); assert.strictEqual(r.statusCode, 200, r.body); assert.strictEqual(b.emailed, true); assert.strictEqual(sent.ses.length, antes + 1);
  const rawRob = sent.ses[antes].Content.Raw.Data.toString('utf8');
  assert(rawRob.includes('Reply-To: hola@marca.mx'));
  const subj = Buffer.from(rawRob.match(/Subject: =\?UTF-8\?B\?([^?]+)\?=/)[1], 'base64').toString('utf8'); assert.strictEqual(subj, 'Rob: Cobertura de un evento — Marca MX');
  const textRob = Buffer.from(rawRob.split('Content-Transfer-Encoding: base64\r\n\r\n')[1].split('\r\n--')[0].replace(/\r\n/g, ''), 'base64').toString('utf8');
  assert(/Servicio: Cobertura de un evento/.test(textRob) && /cucoarts\.com\/rob/.test(textRob) && /Quiere recibir noticias: Sí/.test(textRob), textRob);
  r = await m.submit({ body: 'no es json' }); assert.strictEqual(r.statusCode, 400);
  console.log('OK: todas las pruebas pasaron');
})().catch((e) => { console.error('FALLÓ:', e.message); process.exit(1); });

/* Instala la regla de CloudFront (viewer-request.js) en la distribución de cucoarts.com.
   Uso (desde la raíz del repo, con NODE_OPTIONS vacío):
     node infra/cloudfront/apply.js prepare    Crea/actualiza la función en etapa DEVELOPMENT y la prueba contra la nube.
                                                NO toca el tráfico real.
     node infra/cloudfront/apply.js activate   Publica la función, guarda un RESPALDO de la distribución, la asocia, activa la
                                                compresión y las páginas 404 reales, y limpia la caché.
     node infra/cloudfront/apply.js rollback <archivo-de-respaldo.json>
                                                Restaura la configuración guardada (quita la regla y deja todo como estaba).
   Requiere el perfil de AWS "cucoarts". ORDEN: primero publicar el sitio nuevo (serverless s3sync), después "activate". */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const AWS = process.env.AWS_BIN || 'C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe';
const PROFILE = 'cucoarts';
const DIST = 'E3G9CP7MGP91LC';
const FN = 'cucoarts-viewer-request';
const CODE = path.join(__dirname, 'viewer-request.js');
const BACKUPS = 'G:\\Dev\\respaldos';

const aws = (args, json = true) => {
  const out = execFileSync(AWS, [...args, '--profile', PROFILE, ...(json ? ['--output', 'json'] : [])], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return json && out.trim() ? JSON.parse(out) : out;
};
const tmp = (name, data) => { const p = path.join(os.tmpdir(), name); fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data)); return p; };
const fileb = (p) => 'fileb://' + p.replace(/\\/g, '/');
const file = (p) => 'file://' + p.replace(/\\/g, '/');

function ensureFunction() {
  const config = file(tmp('cf-fn-config.json', { Comment: 'Redirecciones (www, paginas retiradas) y rutas prerenderizadas de cucoarts.com', Runtime: 'cloudfront-js-2.0' }));
  let etag;
  try {
    const d = aws(['cloudfront', 'describe-function', '--name', FN, '--stage', 'DEVELOPMENT']);
    const u = aws(['cloudfront', 'update-function', '--name', FN, '--if-match', d.ETag, '--function-config', config, '--function-code', fileb(CODE)]);
    etag = u.ETag; console.log('Función actualizada (DEVELOPMENT).');
  } catch (e) {
    if (!/NoSuchFunctionExists|does not exist/i.test(String(e.stderr || e.message))) throw e;
    const c = aws(['cloudfront', 'create-function', '--name', FN, '--function-config', config, '--function-code', fileb(CODE)]);
    etag = c.ETag; console.log('Función creada (DEVELOPMENT).');
  }
  return etag;
}

function testFunction(etag) {
  const cases = [
    ['cucoarts.com', '/husky', 'reescribe a /husky/index.html'],
    ['www.cucoarts.com', '/husky', 'redirige a cucoarts.com'],
    ['cucoarts.com', '/Services', 'redirige a la portada'],
    ['cucoarts.com', '/rob', 'pasa sin cambios'],
    ['cucoarts.com', '/static/js/main.js', 'pasa sin cambios'],
  ];
  for (const [host, uri, expect] of cases) {
    const ev = { version: '1.0', context: { eventType: 'viewer-request' }, viewer: { ip: '1.2.3.4' }, request: { method: 'GET', uri, querystring: {}, headers: { host: { value: host } }, cookies: {} } };
    const r = aws(['cloudfront', 'test-function', '--name', FN, '--if-match', etag, '--stage', 'DEVELOPMENT', '--event-object', fileb(tmp('cf-event.json', ev))]);
    const res = JSON.parse(r.TestResult.FunctionOutput);
    const what = res.response ? `${res.response.statusCode} → ${res.response.headers.location.value}` : `uri final ${res.request.uri}`;
    console.log(`  ${host.padEnd(17)}${uri.padEnd(22)} ${what.padEnd(48)} (esperado: ${expect}; error: ${r.TestResult.FunctionErrorMessage || 'ninguno'})`);
  }
}

function backup(cfgResponse) {
  fs.mkdirSync(BACKUPS, { recursive: true });
  const p = path.join(BACKUPS, `cloudfront-${DIST}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(p, JSON.stringify(cfgResponse, null, 2));
  return p;
}

const mode = process.argv[2];
if (mode === 'prepare') {
  const etag = ensureFunction();
  console.log('Pruebas contra la nube (etapa DEVELOPMENT):');
  testFunction(etag);
  console.log('\nListo. La función existe pero NO está asociada a la distribución: el tráfico real no cambió.');
} else if (mode === 'activate') {
  const d = aws(['cloudfront', 'describe-function', '--name', FN, '--stage', 'DEVELOPMENT']);
  const pub = aws(['cloudfront', 'publish-function', '--name', FN, '--if-match', d.ETag]);
  const arn = pub.FunctionSummary.FunctionMetadata.FunctionARN;
  console.log('Función publicada:', arn);

  const cur = aws(['cloudfront', 'get-distribution-config', '--id', DIST]);
  const saved = backup(cur);
  console.log('RESPALDO de la distribución guardado en:', saved);

  const cfg = JSON.parse(JSON.stringify(cur.DistributionConfig));
  cfg.DefaultCacheBehavior.Compress = true;
  cfg.DefaultCacheBehavior.FunctionAssociations = { Quantity: 1, Items: [{ EventType: 'viewer-request', FunctionARN: arn }] };
  cfg.CustomErrorResponses = { Quantity: 2, Items: [
    { ErrorCode: 403, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 30 },
    { ErrorCode: 404, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 30 },
  ] };
  cfg.HttpVersion = 'http2and3';
  const upd = aws(['cloudfront', 'update-distribution', '--id', DIST, '--if-match', cur.ETag, '--distribution-config', file(tmp('cf-dist.json', cfg))]);
  console.log('Distribución actualizada. Estado:', upd.Distribution.Status, '(tarda unos minutos en propagarse)');

  const inv = aws(['cloudfront', 'create-invalidation', '--distribution-id', DIST, '--paths', '/*']);
  console.log('Invalidación creada:', inv.Invalidation.Id);
  console.log('\nPara volver atrás:  node infra/cloudfront/apply.js rollback "' + saved + '"');
} else if (mode === 'rollback') {
  const src = process.argv[3];
  if (!src || !fs.existsSync(src)) { console.error('Indica el archivo de respaldo.'); process.exit(1); }
  const saved = JSON.parse(fs.readFileSync(src, 'utf8'));
  const cur = aws(['cloudfront', 'get-distribution-config', '--id', DIST]);
  const upd = aws(['cloudfront', 'update-distribution', '--id', DIST, '--if-match', cur.ETag, '--distribution-config', file(tmp('cf-dist.json', saved.DistributionConfig))]);
  console.log('Distribución restaurada. Estado:', upd.Distribution.Status);
  const inv = aws(['cloudfront', 'create-invalidation', '--distribution-id', DIST, '--paths', '/*']);
  console.log('Invalidación creada:', inv.Invalidation.Id);
} else {
  console.log('Uso: node infra/cloudfront/apply.js prepare | activate | rollback <respaldo.json>');
  process.exit(1);
}

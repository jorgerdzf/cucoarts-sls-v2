// Prueba local de viewer-request.js (sin tocar AWS): node infra/cloudfront/test-local.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, 'viewer-request.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code, ctx);

const ev = (uri, host = 'cucoarts.com', qs = {}) => ({ request: { uri, method: 'GET', querystring: qs, headers: { host: { value: host } }, cookies: {} } });
const cases = [
  // [uri, host, query, esperado]
  ['/', 'cucoarts.com', {}, { pass: '/' }],
  ['/index.html', 'cucoarts.com', {}, { pass: '/index.html' }],
  ['/husky', 'cucoarts.com', {}, { uri: '/husky/index.html' }],
  ['/husky/', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/husky' }],
  ['/Husky', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/husky' }],
  ['/en', 'cucoarts.com', {}, { uri: '/en/index.html' }],
  ['/en/', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/en' }],
  ['/en/husky', 'cucoarts.com', {}, { uri: '/en/husky/index.html' }],
  ['/privacidad', 'cucoarts.com', {}, { uri: '/privacidad/index.html' }],
  ['/privacy', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/privacidad' }],
  ['/PrivacyNotice', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/privacidad' }],
  ['/Cities', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/' }],
  ['/Services', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/' }],
  ['/Faq', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/#faq' }],
  ['/Connect', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/' }],
  ['/rob', 'cucoarts.com', {}, { pass: '/rob' }],
  ['/rob/', 'cucoarts.com', {}, { redirect: 'https://cucoarts.com/rob' }],
  ['/static/js/main.abc.js', 'cucoarts.com', {}, { pass: '/static/js/main.abc.js' }],
  ['/sitemap.xml', 'cucoarts.com', {}, { pass: '/sitemap.xml' }],
  ['/404.html', 'cucoarts.com', {}, { pass: '/404.html' }],
  ['/rob-galeria/foto.jpg', 'cucoarts.com', {}, { pass: '/rob-galeria/foto.jpg' }],
  ['/no-existe-xyz', 'cucoarts.com', {}, { pass: '/no-existe-xyz' }],
  ['/', 'www.cucoarts.com', {}, { redirect: 'https://cucoarts.com/' }],
  ['/husky', 'www.cucoarts.com', { utm_source: { value: 'ig' } }, { redirect: 'https://cucoarts.com/husky?utm_source=ig' }],
  ['/rob', 'www.cucoarts.com', {}, { redirect: 'https://cucoarts.com/rob' }],
];
let bad = 0;
for (const [uri, host, qs, exp] of cases) {
  const r = ctx.handler(ev(uri, host, qs));
  let got, ok;
  if (r.statusCode) { got = '301 → ' + r.headers.location.value; ok = r.statusCode === 301 && r.headers.location.value === exp.redirect; }
  else { got = (r.uri === uri ? 'pasa ' : 'reescribe → ') + r.uri; ok = exp.uri ? r.uri === exp.uri : r.uri === exp.pass; }
  if (!ok) bad++;
  console.log((ok ? 'OK   ' : 'FALLA') + '  ' + host.padEnd(17) + uri.padEnd(26) + got);
}
console.log(bad ? `\n${bad} caso(s) fallaron` : '\nTodos los casos pasan (' + cases.length + ')');
process.exit(bad ? 1 : 0);

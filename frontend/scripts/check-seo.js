/* Revisa el HTML generado en build/ después de `npm run build`: node scripts/check-seo.js
   Muestra, por ruta, el título, las descripciones (larga para Google, corta para redes), la canónica y los datos estructurados. */
const fs = require('fs');
const path = require('path');
const BUILD = path.join(__dirname, '..', 'build');
const files = ['index.html', 'en/index.html', 'husky/index.html', 'en/husky/index.html', 'privacidad/index.html', '404.html'];
let bad = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(BUILD, f), 'utf8');
  const g = (re) => (h.match(re) || [])[1] || '';
  const title = g(/<title>([\s\S]*?)<\/title>/);
  const desc = g(/name="description" content="([^"]+)"/);
  const og = g(/property="og:description" content="([^"]+)"/);
  const tw = g(/name="twitter:description" content="([^"]+)"/);
  const img = g(/property="og:image" content="([^"]+)"/);
  const card = g(/name="twitter:card" content="([^"]+)"/);
  const canon = g(/rel="canonical" href="([^"]+)"/);
  let ldOk = true;
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch (e) { ldOk = false; } }
  const problems = [];
  if (!title) problems.push('sin título');
  if (!desc) problems.push('sin descripción');
  if (!og || og !== tw) problems.push('og/twitter descripción distinta o vacía');
  if (!img.startsWith('https://')) problems.push('og:image no absoluta');
  if (card !== 'summary_large_image') problems.push('twitter:card');
  if (!ldOk) problems.push('JSON-LD inválido');
  if (og.length > 120) problems.push('descripción corta > 120');
  bad += problems.length;
  console.log(`\n${f}\n  título        (${title.length}): ${title}\n  descripción   (${desc.length}): ${desc}\n  og/twitter    (${og.length}): ${og}\n  imagen: ${img} | tarjeta: ${card} | canónica: ${canon || '—'}${problems.length ? '\n  PROBLEMAS: ' + problems.join(', ') : ''}`);
}
console.log(bad ? `\n${bad} problema(s)` : '\nTodo en orden');
process.exit(bad ? 1 : 0);

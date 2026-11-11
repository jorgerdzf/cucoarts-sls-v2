// CloudFront Function (runtime cloudfront-js-2.0), evento "viewer-request" de la distribución E3G9CP7MGP91LC (cucoarts.com).
// Hace cuatro cosas, en este orden:
//   1. www.cucoarts.com  → 301 a https://cucoarts.com (una sola dirección por página, sin contenido duplicado).
//   2a. Rutas renombradas (/mty_vs_art → /ripple/mty, con sus archivos y la consulta ?utm_…) → 301 a la nueva.
//   2. Páginas retiradas (/Cities, /Services, /Faq…) → 301 a la portada (o a /privacidad).
//   3. Rutas del sitio (/en, /husky, /en/husky, /murales, /en/murals, /arte-por-encargo, /en/custom-art, /privacidad, /mty) → sirve el HTML prerenderizado de esa ruta
//      (build/<ruta>/index.html, generado por frontend/scripts/prerender.js). Mayúsculas o barra final → 301 a la forma canónica.
//   4. Todo lo demás pasa tal cual: archivos con extensión (js, css, imágenes…), /rob (archivo sin extensión en el bucket) y la
//      raíz. Una dirección que no existe llega a S3 sin archivo y CloudFront responde con /404.html y estado 404 real.
// Si agregas una ruta nueva a la app: agrégala en KNOWN, en frontend/scripts/prerender.js y en seoShared.js.

var APEX = 'https://cucoarts.com';

var KNOWN = {
  '/en': '/en/index.html',
  '/husky': '/husky/index.html',
  '/en/husky': '/en/husky/index.html',
  '/murales': '/murales/index.html',
  '/en/murals': '/en/murals/index.html',
  '/arte-por-encargo': '/arte-por-encargo/index.html',
  '/en/custom-art': '/en/custom-art/index.html',
  '/privacidad': '/privacidad/index.html',
  '/mty': '/mty/index.html',
  '/ripple': '/ripple/index.html',
  '/ripple/mty': '/ripple/mty/index.html'
};

// Rutas que cambiaron de nombre: 301 a la nueva conservando el resto de la ruta y la consulta (los enlaces ya compartidos siguen funcionando).
var RENAMED = {
  '/mty_vs_art': '/ripple/mty'
};

var LEGACY = {
  '/cities': '/',
  '/connect': '/',
  '/contact': '/',
  '/experiences': '/',
  '/services': '/',
  '/faq': '/#faq',
  '/privacynotice': '/privacidad',
  '/privacy': '/privacidad'
};

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
      'cache-control': { value: 'public, max-age=3600' }
    }
  };
}

function toQuery(q) {
  var parts = [];
  for (var k in q) {
    var item = q[k];
    if (item.multiValue) {
      for (var i = 0; i < item.multiValue.length; i++) {
        var m = item.multiValue[i].value;
        parts.push(m === '' ? k : k + '=' + m);
      }
    } else {
      parts.push(item.value === '' ? k : k + '=' + item.value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : '';
  var query = toQuery(request.querystring);

  // 1. www → dominio principal
  if (host.indexOf('www.') === 0) {
    return redirect(APEX + uri + query);
  }

  // forma normalizada: minúsculas y sin barra final
  var base = uri.length > 1 ? uri.replace(/\/+$/, '') : uri;
  var key = base.toLowerCase();

  // 2a. rutas renombradas (también sus archivos: /mty_vs_art/img/…)
  for (var old in RENAMED) {
    if (Object.prototype.hasOwnProperty.call(RENAMED, old) && (key === old || key.indexOf(old + '/') === 0)) {
      return redirect(APEX + RENAMED[old] + base.slice(old.length) + query);
    }
  }

  // 2. páginas retiradas
  if (Object.prototype.hasOwnProperty.call(LEGACY, key)) {
    return redirect(APEX + LEGACY[key]);
  }

  // archivos con extensión (assets, imágenes, sitemap, robots, 404.html…): sin cambios
  var last = base.split('/').pop();
  if (last.indexOf('.') !== -1) {
    return request;
  }

  // 3. rutas del sitio
  if (Object.prototype.hasOwnProperty.call(KNOWN, key)) {
    if (uri !== key) {
      return redirect(APEX + key + query);
    }
    request.uri = KNOWN[key];
    return request;
  }

  // /rob es un archivo sin extensión en el bucket: solo se normaliza la forma
  if (key === '/rob') {
    if (uri !== '/rob') {
      return redirect(APEX + '/rob' + query);
    }
    return request;
  }

  // 4. raíz y cualquier otra dirección: pasa; si no existe en S3, CloudFront entrega /404.html con estado 404
  return request;
}

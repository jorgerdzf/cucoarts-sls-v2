/* Selector MXN / USD para páginas con precios (prototipo de perfiles y directorio).
   El tipo de cambio es de REFERENCIA (open.er-api.com, se guarda 12 h en el navegador). No se inventa una tasa:
   si no se puede obtener, el botón USD queda desactivado. El cobro real lo define la tienda. */
(function () {
  const KEY = 'cuco_moneda', RK = 'cuco_tc', TTL = 12 * 3600 * 1000;
  let cur = 'MXN', rate = null, fecha = '';
  const subs = [];
  try { cur = localStorage.getItem(KEY) || 'MXN'; } catch (e) {}
  try { const c = JSON.parse(localStorage.getItem(RK) || 'null'); if (c && Date.now() - c.t < TTL) { rate = c.r; fecha = c.f; } } catch (e) {}
  const M = {
    get cur() { return rate ? cur : 'MXN'; },
    get rate() { return rate; },
    get fecha() { return fecha; },
    fmt(n) {
      n = Number(n);
      if (M.cur === 'USD' && rate) return 'US$ ' + Math.round(n * rate).toLocaleString('en-US') + ' aprox.';
      return '$' + n.toLocaleString('es-MX') + ' MXN';
    },
    fmtCorto(n) { n = Number(n); return (M.cur === 'USD' && rate) ? 'US$ ' + Math.round(n * rate).toLocaleString('en-US') : '$' + n.toLocaleString('es-MX'); },
    set(c) { cur = c; try { localStorage.setItem(KEY, c); } catch (e) {} paint(); subs.forEach(f => f()); },
    onChange(f) { subs.push(f); },
    mount(el) { M._el = el; paint(); }
  };
  function paint() {
    const el = M._el; if (!el) return;
    el.innerHTML = '<button type="button" data-c="MXN" aria-pressed="' + (M.cur === 'MXN') + '">MXN</button><button type="button" data-c="USD" aria-pressed="' + (M.cur === 'USD') + '"' + (rate ? '' : ' disabled') + ' title="' + (rate ? 'Tipo de cambio de referencia (' + fecha + '); el cobro real lo define la tienda' : 'No se pudo obtener el tipo de cambio') + '">USD</button>';
    el.onclick = e => { const b = e.target.closest('button'); if (b && !b.disabled) M.set(b.dataset.c); };
  }
  if (!rate) {
    fetch('https://open.er-api.com/v6/latest/MXN').then(r => r.json()).then(j => {
      if (j && j.rates && j.rates.USD) {
        rate = j.rates.USD; fecha = (j.time_last_update_utc || '').slice(5, 16) || new Date().toLocaleDateString('es-MX');
        try { localStorage.setItem(RK, JSON.stringify({ r: rate, f: fecha, t: Date.now() })); } catch (e) {}
        paint(); if (cur === 'USD') subs.forEach(f => f());
      }
    }).catch(() => {});
  }
  window.CUCO_MONEDA = M;
})();

'use strict';

/* Funciones puras de /mty (sin AWS): validación, firma de enlaces, textos del correo y páginas de moderación.
 * Se prueban en test.local.js. */

const crypto = require('crypto');

const CATS = ['pintura', 'escultura', 'foto', 'grafica', 'urbano', 'instalacion', 'digital', 'popular', 'multi', 'letras', 'pendiente'];
const ZONAS = ['centro', 'norte', 'oriente', 'sur', 'poniente'];
const SUG_TIPOS = ['fecha', 'direccion', 'categoria', 'imagen', 'enlace', 'cancelado', 'otra'];
const LINK_TTL_DAYS = 14;

/* ---------- limpieza ---------- */
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ');
const emailOk = (s) => s.length <= 200 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s);
const phoneDigits = (s) => String(s).replace(/\D/g, '').slice(-10);
const phoneOk = (s) => String(s).replace(/\D/g, '').length >= 10 && String(s).replace(/\D/g, '').length <= 15;
const urlOk = (s) => s.length <= 300 && /^https?:\/\/[^\s<>"'\\]+\.[^\s<>"'\\]{2,}$/i.test(s);
const handleOk = (s) => /^@?[A-Za-z0-9._]{2,30}$/.test(s);

/* red social: @usuario o liga http(s); se guarda como se escribió, limpio */
function normSocial(raw) {
  const s = oneLine(raw, 120);
  if (!s) return { ok: true, value: '' };
  if (urlOk(s)) return { ok: true, value: s };
  if (handleOk(s)) return { ok: true, value: '@' + s.replace(/^@/, '') };
  return { ok: false, value: '' };
}

const targetOk = (ref) => /^(evento|lugar):[a-z0-9-]{1,60}$/.test(ref);

/* ---------- validación de envíos ---------- */
/* Devuelve { errs, item } con los campos ya limpios. tipo: 'checkin' | 'reco' | 'sug'. */
function validate(body) {
  const errs = [];
  const v = body || {};
  const tipo = ['checkin', 'reco', 'sug'].includes(v.tipo) ? v.tipo : null;
  if (!tipo) return { errs: ['tipo'], item: null };
  const item = { tipo, lang: v.lang === 'en' ? 'en' : 'es' };

  if (tipo === 'checkin') {
    item.ref = oneLine(v.ref, 80); if (!targetOk(item.ref)) errs.push('ref');
    item.titulo = oneLine(v.titulo, 160);
    const st = parseInt(v.estrellas, 10); if (!(st >= 1 && st <= 5)) errs.push('estrellas'); else item.estrellas = st;
    item.comentario = clean(v.comentario, 600); if (item.comentario.length < 5) errs.push('comentario');
    item.alias = oneLine(v.alias, 30);
    item.via = v.via === 'whatsapp' ? 'whatsapp' : 'correo';
    const c = oneLine(v.contacto, 200);
    if (item.via === 'correo' ? !emailOk(c) : !phoneOk(c)) errs.push('contacto'); else item.contacto = c;
    const link = oneLine(v.link, 300); if (link && !urlOk(link)) errs.push('link'); else item.link = link;
    const so = normSocial(v.social); if (!so.ok) errs.push('social'); else item.social = so.value;
    if (v.consent !== 'on' && v.consent !== true) errs.push('consent');
  } else if (tipo === 'reco') {
    item.ref = 'reco';
    item.nombre = oneLine(v.nombre, 80); if (item.nombre.length < 2) errs.push('nombre');
    item.disciplina = CATS.includes(v.disciplina) ? v.disciplina : ''; if (!item.disciplina) errs.push('disciplina');
    const so = normSocial(v.link); if (!so.ok || !so.value) errs.push('link'); else item.link = so.value;
    item.zona = ZONAS.includes(v.zona) ? v.zona : '';
    item.porque = clean(v.porque, 600); if (item.porque.length < 10) errs.push('porque');
    item.alias = oneLine(v.alias, 30);
    if (v.consent !== 'on' && v.consent !== true) errs.push('consent');
  } else {
    item.ref = oneLine(v.ref, 120);
    item.motivo = SUG_TIPOS.includes(v.motivo) ? v.motivo : 'otra';
    item.texto = clean(v.texto, 600); if (item.texto.length < 5) errs.push('texto');
    item.titulo = oneLine(v.titulo, 160);
    const link = oneLine(v.link, 300); if (link && !urlOk(link)) errs.push('link'); else item.link = link;
    item.contacto = oneLine(v.contacto, 200);
  }
  return { errs, item };
}

/* clave de destino: de qué evento/lugar es el envío; la usan la tabla y los promedios */
const targetOf = (item) => (item.tipo === 'checkin' ? item.ref : item.tipo === 'reco' ? 'reco' : 'sug');

/* huella de quien participa (no se guarda el contacto en claro en el aviso de "ya participaste") */
const contactHash = (secret, item) => {
  const basis = item.tipo === 'reco'
    ? 'r|' + (item.nombre + '|' + item.link).toLowerCase()
    : 'c|' + (item.via === 'whatsapp' ? phoneDigits(item.contacto) : item.contacto.toLowerCase());
  return crypto.createHmac('sha256', secret).update(basis).digest('hex').slice(0, 32);
};

/* ---------- enlaces firmados de moderación ---------- */
const b64u = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function sign(secret, { k, s, a, e }) {
  return b64u(crypto.createHmac('sha256', secret).update(JSON.stringify([k, s, a, e])).digest());
}
function verify(secret, p, nowSec = Math.floor(Date.now() / 1000)) {
  if (!p || !p.k || !p.s || !['ok', 'no'].includes(p.a) || !/^\d{9,12}$/.test(String(p.e)) || !p.t) return 'bad';
  const good = Buffer.from(sign(secret, { k: p.k, s: p.s, a: p.a, e: String(p.e) }));
  const got = Buffer.from(String(p.t));
  if (good.length !== got.length || !crypto.timingSafeEqual(good, got)) return 'bad';
  if (Number(p.e) < nowSec) return 'expired';
  return 'ok';
}
function modLink(base, secret, key, action, nowSec = Math.floor(Date.now() / 1000)) {
  const e = String(nowSec + LINK_TTL_DAYS * 86400);
  const t = sign(secret, { k: key.pk, s: key.sk, a: action, e });
  return `${base}?${new URLSearchParams({ k: key.pk, s: key.sk, a: action, e, t }).toString()}`;
}

/* ---------- HTML ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

function describe(item, names = {}) {
  const dest = item.tipo === 'checkin' ? (names[item.ref] || item.titulo || item.ref) : item.tipo === 'reco' ? `Recomendación: ${item.nombre}` : `Sugerencia: ${item.ref}`;
  return dest;
}

const PAGE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
const shell = (title, inner) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title>
<style>body{font:16px/1.5 system-ui,-apple-system,Segoe UI,Arial,sans-serif;background:#F5F1F1;color:#232322;margin:0;padding:24px 16px}main{max-width:560px;margin:0 auto;background:#fff;border:3px solid #232322;border-radius:18px;padding:22px 20px;box-shadow:8px 8px 0 #EA663D}
h1{margin:0 0 6px;font-size:26px;letter-spacing:-.03em}.k{font:700 12px monospace;letter-spacing:.1em;text-transform:uppercase;color:#5B5F49}.box{border:2px solid #232322;border-radius:12px;padding:12px 14px;margin:14px 0;background:#FFE7CF}
.st{font-size:20px;letter-spacing:2px}button{font:700 16px system-ui,Arial;border:3px solid #232322;border-radius:999px;padding:12px 24px;cursor:pointer;background:#232322;color:#FFE7CF;margin-top:6px}button.ok{background:#C7F74E;color:#232322}button.no{background:#FA2713;color:#fff}small{color:#5B5F49}</style></head><body><main>${inner}</main></body></html>`;

function confirmPage({ item, names, action, params }) {
  const ok = action === 'ok';
  const rows = [
    `<div class="k">${esc(describe(item, names))}</div>`,
    item.tipo === 'checkin' ? `<div class="st">${stars(item.estrellas)}</div>` : '',
    `<div class="box">${esc(item.tipo === 'reco' ? item.porque : item.tipo === 'checkin' ? item.comentario : item.texto)}</div>`,
    item.alias ? `<small>Alias: ${esc(item.alias)}</small><br>` : '',
    item.social ? `<small>Red social: ${esc(item.social)}</small><br>` : '',
    item.link ? `<small>Liga: ${esc(item.link)}</small><br>` : '',
    item.tipo === 'checkin' ? `<small>Contacto (no se publica): ${esc(item.via)} · ${esc(item.contacto)}</small>` : '',
  ].join('');
  const hidden = ['k', 's', 'a', 'e', 't'].map((n) => `<input type="hidden" name="${n}" value="${esc(params[n])}">`).join('');
  return shell(ok ? 'Aprobar' : 'Rechazar',
    `<div class="k">/mty · moderación</div><h1>${ok ? '¿Aprobar y publicar?' : '¿Rechazar este envío?'}</h1>${rows}
<form method="post">${hidden}<button class="${ok ? 'ok' : 'no'}" type="submit">${ok ? 'Sí, aprobar' : 'Sí, rechazar'}</button></form>
<p><small>${ok ? 'Se publicará con el alias y la red social de arriba (nunca el contacto).' : 'No se publicará.'} Abrir esta página no cambia nada; solo el botón.</small></p>`);
}
const messagePage = (title, text) => shell(title, `<div class="k">/mty · moderación</div><h1>${esc(title)}</h1><p>${esc(text)}</p>`);

/* ---------- correo ---------- */
function emailPending({ id, item, names, approveUrl, rejectUrl }) {
  const dest = describe(item, names);
  const kind = item.tipo === 'reco' ? 'RECOMENDACIÓN' : 'CHECK-IN';
  const body = item.tipo === 'reco' ? item.porque : item.comentario;
  const lines = [
    `${kind} PENDIENTE · ${dest}`, `Folio: ${id}`, '',
    item.tipo === 'checkin' ? `Estrellas: ${item.estrellas}/5` : `Disciplina: ${item.disciplina}${item.zona ? ' · zona ' + item.zona : ''}`,
    `Comentario: ${body}`,
    `Alias: ${item.alias || '(Visitante)'}`,
    item.social ? `Red social: ${item.social}` : null,
    item.link ? `Liga: ${item.link}` : null,
    item.tipo === 'checkin' ? `Contacto (no se publica): ${item.via === 'whatsapp' ? 'WhatsApp' : 'correo'} ${item.contacto}` : null,
    '', `APROBAR: ${approveUrl}`, `RECHAZAR: ${rejectUrl}`, '',
    '(Cada enlace abre una página de confirmación; no cambia nada hasta que pulses el botón. Caducan a los 14 días.)',
  ].filter((x) => x !== null);
  const btn = (href, label, bg, fg) => `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-weight:700;border:3px solid #232322;border-radius:999px;padding:12px 22px;margin:4px 6px 4px 0">${label}</a>`;
  const html = `<div style="font:15px/1.5 Arial,sans-serif;color:#232322;max-width:560px"><div style="font:700 12px monospace;letter-spacing:.1em;color:#5B5F49">${esc(kind)} PENDIENTE</div><h2 style="margin:4px 0 8px">${esc(dest)}</h2>
${item.tipo === 'checkin' ? `<div style="font-size:20px;letter-spacing:2px">${stars(item.estrellas)}</div>` : `<div><b>${esc(item.disciplina)}</b>${item.zona ? ' · ' + esc(item.zona) : ''}</div>`}
<div style="border:2px solid #232322;border-radius:12px;padding:10px 12px;margin:10px 0;background:#FFE7CF">${esc(body)}</div>
<div style="color:#5B5F49;font-size:13px">Alias: ${esc(item.alias || '(Visitante)')}${item.social ? ' · Red: ' + esc(item.social) : ''}${item.link ? '<br>Liga: ' + esc(item.link) : ''}${item.tipo === 'checkin' ? '<br>Contacto (no se publica): ' + esc(item.contacto) : ''}</div>
<p>${btn(approveUrl, 'Aprobar', '#C7F74E', '#232322')}${btn(rejectUrl, 'Rechazar', '#FA2713', '#ffffff')}</p>
<p style="color:#5B5F49;font-size:12px">Cada botón abre una página de confirmación; no cambia nada hasta que pulses el botón de esa página. Caducan a los 14 días. Folio ${esc(id)}.</p></div>`;
  return { subject: `/mty pendiente: ${item.tipo === 'checkin' ? item.estrellas + '★ ' : ''}${dest}`.slice(0, 200), text: lines.join('\n'), html };
}

function emailSuggestion({ id, item }) {
  const lines = [
    `SUGERENCIA DE EDICIÓN · ${item.ref}${item.titulo ? ' · ' + item.titulo : ''}`, `Folio: ${id}`, '',
    `Qué: ${item.motivo}`, `Texto: ${item.texto}`, item.link ? `Fuente: ${item.link}` : null, item.contacto ? `Contacto: ${item.contacto}` : null,
    '', '(Solo informativa: corrige la agenda si procede.)',
  ].filter((x) => x !== null);
  return { subject: `/mty sugerencia: ${item.titulo || item.ref}`.slice(0, 200), text: lines.join('\n'), html: `<pre style="font:14px/1.5 Arial,sans-serif;white-space:pre-wrap">${esc(lines.join('\n'))}</pre>` };
}

module.exports = {
  CATS, ZONAS, LINK_TTL_DAYS, clean, oneLine, emailOk, phoneOk, urlOk, handleOk, normSocial, targetOk, validate, targetOf, contactHash,
  sign, verify, modLink, esc, confirmPage, messagePage, PAGE_HEADERS, emailPending, emailSuggestion, describe,
};

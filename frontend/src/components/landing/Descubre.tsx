import React, { useEffect, useRef, useState } from 'react';
import { COPY } from './copy';
import { Icon, STORE, useTheme } from './Landing';
import { useLang, lp } from './lang';
import { Cycler } from './Cycler';
import { POOL, PoolItem } from './pool';
import { PERFIL_POR_NOMBRE } from './perfiles';
import { applySeo } from './seo';
import SiteMenu, { buildMenu, buildFoot } from './SiteMenu';
import './assets/styles/landing2.css';
import './assets/styles/murales.css';
import './assets/styles/descubre.css';

/* cucoarts.com/descubre-monterrey (y /en/discover-monterrey) — la puerta de entrada de "Descubre MTY" (primer pilar del menú).
   Reúne en una sola página las cuatro formas de acercarse al arte de la ciudad: tienda, artistas, arte urbano y exposiciones (con RIPPLE).
   Solo enlaza a lo que ya existe; el texto no promete nada que esas páginas no ofrezcan. Prefijo de clases: dm-. */

const TXT = {
  es: {
    label: 'Descubre MTY',
    title: 'Descubre el arte de Monterrey',
    lede: 'CUCO ARTS es una galería de arte en línea de Monterrey. Aquí el arte se descubre de cuatro maneras: llévate obra original, conoce a quien la crea, recorre los murales de la ciudad y visita las exposiciones.',
    pillarsLabel: 'Cuatro formas de descubrir',
    zonesLabel: 'Cinco zonas, una ciudad', zonesHint: 'Toca una zona: ver mapa', zonesGo: 'Ver zona en el mapa',
    artistsLabel: 'Artistas de CUCO ARTS', artistsCredit: 'CUCO ARTS · Smuter: su Instagram', portrait: 'Retrato de',
    credits: { title: 'Créditos', zones: 'Fotografía de zonas', portraits: 'Retratos de artistas', works: 'Obra', murals: 'Murales', expo: 'Exposición', agenda: 'Exposiciones', origin: 'Origen' },
    items: [
      { k: 'Tienda de arte', t: 'Arte original en venta', d: 'Obra original de artistas de Monterrey —pintura, grabado, ilustración y escultura— con envíos a todo México y al mundo.', c: 'Ir a la tienda', href: STORE, ext: true, img: '/landing-pool/ahedo-49.jpg', alt: 'Dragón naranja sobre una montaña nevada, obra de Ana Ahedo', col: '#F7D649' },
      { k: 'Artistas', t: 'Conoce a quien lo crea', d: 'Perfiles con su historia, su técnica, su taller y dónde ver su obra. Detrás de cada pieza hay una persona.', c: 'Ver los perfiles', href: '/artistas', img: '/landing-pool/chema-09.jpg', alt: 'Obra de Chema Chapa, artista de Monterrey', col: '#EA663D' },
      { k: 'Arte urbano', t: 'Los murales de la ciudad', d: 'Recorre los murales de San Nicolás zona por zona: quién los pintó, con qué estilo y dónde encontrar su obra.', c: 'Recorrer murales', href: '/mty/arte-urbano', img: '/mty/img/murales/greometria-puente-sn-b1-2.jpg', alt: 'Mural de Greometría en San Nicolás de los Garza', col: '#067DFF' },
      { k: 'Exposiciones', t: 'Qué pasa hoy en el arte', d: 'La agenda de artes visuales de Monterrey: exposiciones, inauguraciones y eventos, por zona cultural.', c: 'Ver la agenda', href: '/mty', img: '/mty/img/husky-expo.jpg', alt: 'Exposición de arte local en HUSKY Coffee Shop, Santiago, Nuevo León', col: '#C7F74E' },
    ],
    ripple: { k: 'RIPPLE', t: 'Visita, descubre y suma puntos', d: 'El juego del arte local: cada exposición que visitas suma puntos para ti y para Monterrey.', c: 'Jugar RIPPLE', href: '/ripple/mty' },
    more: { t: '¿Quieres algo hecho para ti?', d: 'También conectamos tu idea con artistas locales para un mural o una obra a tu medida.', c1: 'Crear un mural', c2: 'Arte por encargo' },
  },
  en: {
    label: 'Discover MTY',
    title: 'Discover the art of Monterrey',
    lede: 'CUCO ARTS is an online art gallery from Monterrey. Here art is discovered in four ways: take original work home, meet the people who make it, explore the city’s murals, and visit the exhibitions.',
    pillarsLabel: 'Four ways to discover',
    zonesLabel: 'Five zones, one city', zonesHint: 'Tap a zone: see map', zonesGo: 'See zone on the map',
    artistsLabel: 'CUCO ARTS artists', artistsCredit: 'CUCO ARTS · Smuter: his Instagram', portrait: 'Portrait of',
    credits: { title: 'Credits', zones: 'Zone photography', portraits: 'Artist portraits', works: 'Artwork', murals: 'Murals', expo: 'Exhibition', agenda: 'Exhibitions', origin: 'Source' },
    items: [
      { k: 'Art store', t: 'Original art for sale', d: 'Original work by Monterrey artists —painting, printmaking, illustration, and sculpture— shipped across Mexico and worldwide.', c: 'Go to the store', href: STORE, ext: true, img: '/landing-pool/ahedo-49.jpg', alt: 'Orange dragon on a snowy mountain, artwork by Ana Ahedo', col: '#F7D649' },
      { k: 'Artists', t: 'Meet the people who make it', d: 'Profiles with their story, their technique, their studio, and where to see their work. Behind every piece there is a person.', c: 'See the profiles', href: '/artistas', img: '/landing-pool/chema-09.jpg', alt: 'Artwork by Chema Chapa, a Monterrey artist', col: '#EA663D' },
      { k: 'Street art', t: 'The city’s murals', d: 'Explore the murals of San Nicolás zone by zone: who painted them, in what style, and where to find their work.', c: 'Explore murals', href: '/mty/arte-urbano', img: '/mty/img/murales/greometria-puente-sn-b1-2.jpg', alt: 'Mural by Greometría in San Nicolás de los Garza', col: '#067DFF' },
      { k: 'Exhibitions', t: 'What is happening in art today', d: 'Monterrey’s visual arts agenda: exhibitions, openings, and events, by cultural zone.', c: 'See the agenda', href: '/mty', img: '/mty/img/husky-expo.jpg', alt: 'Local art exhibition at HUSKY Coffee Shop, Santiago, Nuevo León', col: '#C7F74E' },
    ],
    ripple: { k: 'RIPPLE', t: 'Visit, discover, and earn points', d: 'The local art game: every exhibition you visit earns points for you and for Monterrey.', c: 'Play RIPPLE', href: '/ripple/mty' },
    more: { t: 'Want something made for you?', d: 'We also connect your idea with local artists for a mural or a custom artwork.', c1: 'Create a mural', c2: 'Custom art' },
  },
};

/* Cinco zonas culturales (clave = ruta de /mty#/zona/<clave>, color = el de artistas/datos/zonas.json). 'first' = foto con la que arranca cada cuadro; las demás rotan. */
const ZONAS = [
  { k: 'norte', area: 'Zona Norte', col: '#C7F74E', first: 'foto-faty-reyes-1' },
  { k: 'sur', area: 'Zona Sur', col: '#B7A8FF', first: 'foto-andres-tsez-2' },
  { k: 'oriente', area: 'Zona Oriente', col: '#EA663D', first: 'foto-yahel-2' },
  { k: 'centro', area: 'Zona Centro', col: '#ABCFDD', first: 'foto-palmira-del-rio-1' },
  { k: 'poniente', area: 'Zona Poniente', col: '#FFE7CF', first: 'foto-abner-fabian-2' },
].map(z => {
  const l = POOL.filter(p => p.kind === 'foto' && p.area === z.area);
  const i = l.findIndex(p => p.id === z.first);
  return { ...z, fotos: i > 0 ? [l[i], ...l.filter((_, j) => j !== i)] : l };
});
/* Retratos publicados en cada perfil (copias de 160 px en landing-pool/retratos). Smuter: crédito propio (ver artistsCredit). */
const RETRATOS = Object.entries(PERFIL_POR_NOMBRE).map(([name, slug]) => ({ name, slug }));
/* Imágenes que rotan en las cuatro tarjetas (se barajan en cada visita, ya en el navegador: el HTML prerenderizado solo lleva el <head>).
   Los artistas se reparten en dos grupos por orden alfabético: uno para "Tienda" (solo obra) y otro para "Artistas" (retrato, obra, retrato, obra… del MISMO artista),
   así ninguna obra se repite entre tarjetas. Murales: fotos de /mty/arte-urbano. Expo: fotos de HUSKY + exposiciones de la agenda /mty. El crédito de todo va en la sección final. */
type Shot = { src: string; es: string; en: string; who: string; pos?: string };
const porArtista = new Map<string, PoolItem[]>();
POOL.filter(p => p.kind === 'obra').forEach(p => porArtista.set(p.who, [...(porArtista.get(p.who) || []), p]));
const nombres = Array.from(porArtista.keys()).sort();
const shuffle = <T,>(a: T[]): T[] => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const obraShot = (p: PoolItem): Shot => ({ src: `/landing-pool/${p.id}.jpg`, es: p.es, en: p.en, who: p.who });
const tiendaShots = (): Shot[] => shuffle(nombres.filter((_, i) => i % 2 === 0).flatMap(n => porArtista.get(n)!.map(obraShot)));
/* retrato (copia de 400 px de su perfil) y una obra suya, juntos; se salta a quien no tenga retrato */
const artistasShots = (): Shot[] => shuffle(nombres.filter((_, i) => i % 2 === 1)).flatMap(n => {
  const slug = PERFIL_POR_NOMBRE[n];
  const obra = shuffle(porArtista.get(n)!)[0];
  const ret: Shot[] = slug ? [{ src: `/artistas/img/${slug}-perfil-400.jpg`, es: `Retrato de ${n}`, en: `Portrait of ${n}`, who: n, pos: 'center 25%' }] : [];
  return [...ret, obraShot(obra)];
});
const mural = (f: string, who: string, es: string, en: string): Shot => ({ src: `/mty/img/murales/${f}.jpg`, who, es, en });
const MURALES: Shot[] = [
  mural('greometria-puente-sn-b1-2', 'Greometría', 'Mural de Greometría en San Nicolás de los Garza', 'Mural by Greometría in San Nicolás de los Garza'),
  mural('belinda-salazar-vaquero-sn-b1-1', 'Belinda Salazar', 'Mural de Belinda Salazar en San Nicolás de los Garza', 'Mural by Belinda Salazar in San Nicolás de los Garza'),
  mural('ezkor-snap-angeles-sn-b1-1', 'Ezkor', 'Mural de Ezkor en un puente de San Nicolás de los Garza', 'Mural by Ezkor on a bridge in San Nicolás de los Garza'),
  mural('greometria-puente-sn-b1-1', 'Greometría', 'Mural de Greometría en San Nicolás de los Garza', 'Mural by Greometría in San Nicolás de los Garza'),
  mural('belinda-salazar-vaquero-sn-b1-3', 'Belinda Salazar', 'Mural de Belinda Salazar en San Nicolás de los Garza', 'Mural by Belinda Salazar in San Nicolás de los Garza'),
  mural('ezkor-snap-angeles-sn-b1-3', 'Ezkor', 'Mural de Ezkor en un puente de San Nicolás de los Garza', 'Mural by Ezkor on a bridge in San Nicolás de los Garza'),
];
/* Exposiciones: la expo en HUSKY (CUCO ARTS) y cuatro de la agenda /mty (zonas Sur, Poniente, Centro y Norte). Títulos tal como están en la agenda; fuente: "Origen: CUCO ARTS". */
const HUSKY_WHO = 'CUCO ARTS · HUSKY Coffee Shop';
const HUSKY_SHOTS: Shot[] = ['/mty/img/husky-expo.jpg', '/husky/husky-1.jpg', '/husky/husky-2.jpg', '/husky/husky-3.jpg'].map(src => ({ src, who: HUSKY_WHO, es: 'Exposición de arte local en HUSKY Coffee Shop, Santiago, Nuevo León', en: 'Local art exhibition at HUSKY Coffee Shop, Santiago, Nuevo León' }));
const AGENDA_WHO = 'CUCO ARTS';
const ev = (f: string, es: string, en: string, pos?: string): Shot => ({ src: `/mty/img/${f}.jpg`, who: AGENDA_WHO, es: `Exposición «${es}»`, en: `Exhibition “${en}”`, pos });
const AGENDA_SHOTS: Shot[] = [
  ev('ev-capas', 'Capas · exposición de procesos pictóricos', 'Capas · exhibition of painting processes'),
  ev('ecos-de-un-camino', 'Ecos de un camino', 'Echoes of a path'),
  ev('ev-escultores-en-nuevo-leon', 'Escultores en Nuevo León, 1945–1995', 'Sculptors in Nuevo León, 1945–1995', 'center 30%'),
  ev('ev-delirio-diario-2026', 'Delirio', 'Delirio', 'center 30%'),
];
const buildShots = (): Shot[][] => [tiendaShots(), artistasShots(), shuffle(MURALES), shuffle([...HUSKY_SHOTS, ...AGENDA_SHOTS])];
const uniq = (a: string[]) => Array.from(new Set(a));
const emojiOf = (z: string) => z.split(' ')[0];
const nameOf = (z: string) => z.split(' ').slice(1).join(' ');

/* Insignia de RIPPLE: la misma letra de pixeles (5×7), la misma sombra naranja, el pin que cae y los anillos de la página /ripple/mty (copiado de su animación oficial,
   sin sonido). Al pulsar se ve la animación y luego navega (~420 ms; sin demora si el visitante pidió reducir movimiento). */
const GLYPHS: Record<string, number[]> = { R: [0x1E,0x11,0x11,0x1E,0x14,0x12,0x11], I: [0x0E,0x04,0x04,0x04,0x04,0x04,0x0E], P: [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10], L: [0x10,0x10,0x10,0x10,0x10,0x10,0x1F], E: [0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F] };
const PIN = Array.from({ length: 13 }, (_, y) => Array.from({ length: 9 }, (_, x) => (Math.hypot(x - 4, y - 4) <= 4.25 || (y >= 5 && Math.abs(x - 4) <= (12.6 - y) * 0.6)) ? 1 : 0));
function RippleBadge({ href, label }: { href: string; label: string }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const t0 = useRef<number | null>(null);
  const [s, setS] = useState(4);
  useEffect(() => {
    const f = () => setS(window.innerWidth < 520 ? 3 : 4);
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, []);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const g = c.getContext('2d'); if (!g) return;
    const pad = 11 * s, W = 35 * s + 2 * pad, H = 15 * s;
    c.width = W; c.height = H;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = 0, vis = true;
    const ring = (cx: number, cy: number, rx: number, col: string, al: number) => {
      const seen = new Set<string>(), ry = Math.max(s * 1.5, rx * 0.3), q = Math.max(1, Math.round(s / 2));
      g.fillStyle = col; g.globalAlpha = al;
      for (let d = 0; d < 360; d += 1.2) { const x = Math.round((cx + rx * Math.cos(d * Math.PI / 180)) / q) * q, y = Math.round((cy + ry * Math.sin(d * Math.PI / 180)) / q) * q, k = x + ',' + y; if (seen.has(k)) continue; seen.add(k); g.fillRect(x, y, q, q); }
      g.globalAlpha = 1;
    };
    const draw = (now: number) => {
      g.clearRect(0, 0, W, H); g.imageSmoothingEnabled = false;
      const t = t0.current === null ? -1 : now / 1000 - t0.current, dys = [0, 0, 0, 0, 0, 0], cx = W / 2, cy = 4 * s + 3.5 * s;
      if (t >= 0) {
        if (t < 0.10) for (let i = 0; i < 6; i++) dys[i] = -2 * s * (t / 0.10);
        else for (let i = 0; i < 6; i++) { const u = t - 0.10 - Math.abs(i - 2.5) * 0.06; if (u >= 0) dys[i] = -2.6 * s * Math.exp(-u * 2.6) * Math.sin(u * 13); }
        ([[0.10, '#EA663D'], [0.22, '#067DFF'], [0.34, '#ABCFDD'], [0.46, '#067DFF']] as [number, string][]).forEach(([b, col]) => { const u = t - b; if (u >= 0 && u < 0.95) { const q = Math.floor(u / 0.05) / 19; ring(cx, cy, s * 3 + q * (W / 2 - s * 2), col, Math.max(0.12, 1 - q)); } });
        if (t < 0.34) {
          const p = Math.max(2, Math.round(s * 0.55)), dy = t < 0.04 ? -40 : t < 0.08 ? -20 : t < 0.10 ? -8 : 0;
          g.globalAlpha = t < 0.24 ? 1 : Math.max(0, 1 - (t - 0.24) / 0.10);
          for (let y = 0; y < 13; y++) for (let x = 0; x < 9; x++) {
            if (!PIN[y][x]) continue;
            const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !(PIN[y + b] && PIN[y + b][x + a]));
            g.fillStyle = edge ? '#232322' : Math.hypot(x - 4, y - 4) < 1.6 ? '#FFE7CF' : '#EA663D';
            g.fillRect(Math.round(cx - 4.5 * p + x * p), Math.round(cy + s * 1.2 - 13 * p + y * p + dy), p, p);
          }
          g.globalAlpha = 1;
        }
        if (t > 1.5) t0.current = null;
      } else if (!rm.matches) for (let i = 0; i < 6; i++) dys[i] = Math.round(Math.sin(now / 1000 * 2.4 - i * 0.85) * 1.4) * s;
      g.fillStyle = '#232322';
      'RIPPLE'.split('').forEach((ch, i) => GLYPHS[ch].forEach((b, r) => { for (let k = 0; k < 5; k++) if (b & (16 >> k)) g.fillRect(pad + i * 6 * s + k * s, 4 * s + r * s + Math.round(dys[i] / s) * s, s, s); }));
    };
    const loop = (now: number) => { if (vis && !document.hidden && now - last > 33) { last = now; draw(now); } raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; });
    io.observe(c);
    draw(performance.now());
    if (!rm.matches) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [s]);
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    t0.current = performance.now() / 1000 + 0.006;
    window.setTimeout(() => window.location.assign(href), 420);
  };
  return (
    <a className="dm-rbadge" href={href} onClick={go} aria-label={label} style={{ marginInline: -11 * s }}>
      <canvas ref={cv} aria-hidden="true" />
    </a>
  );
}

export default function Descubre() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const c = COPY[lang];
  const t = TXT[lang];
  const dark = theme === 'dark';
  const [shots] = useState<Shot[][]>(buildShots);   // se baraja una vez por visita, antes del primer render
  const [who, setWho] = useState('');   // nombre del artista bajo el cursor o el foco (cinta fija bajo los retratos: nada se corta)

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  useEffect(() => applySeo('descubre', lang), [lang]);

  return (
    <div className="cl mp dm">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <div className="cl-tools">
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
          <SiteMenu lang={lang} items={buildMenu(lang, c, 'descubre')} foot={buildFoot(lang)} />
        </div>
      </header>

      <section className="cl-band dm-intro">
        <div className="cl-in dm-hero">
          <div className="dm-intro-t">
            <span className="cl-label">{t.label}</span>
            <h1>{t.title}</h1>
            <p className="cl-lede">{t.lede}</p>
          </div>
          <div className="dm-who">
            <ul className="dm-faces" aria-label={t.artistsLabel}>
              {RETRATOS.map((r, i) => (
                <li key={r.slug} style={{ ['--i' as string]: i }}>
                  <a href={`/artistas/${r.slug}?ref=descubre`} className="dm-face" aria-label={r.name}
                    onMouseEnter={() => setWho(r.name)} onFocus={() => setWho(r.name)} onMouseLeave={() => setWho('')} onBlur={() => setWho('')}>
                    <img src={`/landing-pool/retratos/${r.slug}.jpg`} width={160} height={160} alt={`${t.portrait} ${r.name}`} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" />
                  </a>
                </li>
              ))}
            </ul>
            <span className="dm-name" aria-hidden="true">{who && <b>{who}</b>}</span>
          </div>
        </div>
      </section>

      <section className="cl-band dm-zones" aria-label={t.zonesLabel}>
        <div className="cl-in">
          <p className="dm-zh"><b>{t.zonesLabel}</b><span>{t.zonesHint}</span></p>
          <ul className="dm-zgrid">
            {ZONAS.map((z, zi) => (
              <li key={z.k} style={{ ['--c' as string]: z.col, ['--i' as string]: zi }}>
                <a className="dm-zt" href={lp(lang, '/mty') + '#/zona/' + z.k}>
                  <span className="dm-zchip"><i aria-hidden="true">{emojiOf(c.about.zones[zi])}</i>{nameOf(c.about.zones[zi])}</span>
                  <Cycler<PoolItem> items={z.fotos} offset={zi * 1100} ms={6400} src={p => `/landing-pool/${p.id}.jpg`}
                    render={p => (
                      <span className="dm-zpic">
                        <img src={`/landing-pool/${p.id}.jpg`} width={p.w} height={p.h} alt={lang === 'en' ? p.en : p.es} loading="lazy" decoding="async" />
                      </span>
                    )} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cl-band dm-pillars" aria-label={t.pillarsLabel}>
        <div className="cl-in">
          <div className="dm-grid">
            {t.items.map((it, ix) => (
              <a key={it.k} className="dm-card" href={it.ext ? it.href : lp(lang, it.href)} style={{ ['--c' as string]: it.col }} {...(it.ext ? { rel: 'noopener' } : {})}>
                <span className="dm-img">
                  <Cycler<Shot> items={shots[ix]} offset={ix * 1300} ms={6200} src={s => s.src}
                    render={s => <img src={s.src} alt={lang === 'en' ? s.en : s.es} loading="lazy" decoding="async"{...(s.pos ? { style: { objectPosition: s.pos } } : {})} />} />
                </span>
                <span className="dm-body">
                  <span className="dm-k">{it.k}</span>
                  <h2>{it.t}</h2>
                  <span className="dm-d">{it.d}</span>
                  <span className="dm-go">{it.c} <i aria-hidden="true">→</i></span>
                </span>
              </a>
            ))}
          </div>
          <div className="dm-ripple">
            <RippleBadge href={lp(lang, t.ripple.href)} label={t.ripple.c} />
            <div className="dm-rtxt">
              <b>{t.ripple.t}</b>
              <span>{t.ripple.d}</span>
              <a className="dm-go" href={lp(lang, t.ripple.href)}>{t.ripple.c} <i aria-hidden="true">→</i></a>
            </div>
          </div>
        </div>
      </section>

      <section className="cl-band dm-more">
        <div className="cl-in">
          <h2>{t.more.t}</h2>
          <p className="mp-lead">{t.more.d}</p>
          <div className="cl-actions">
            <a className="cl-fun" href={lp(lang, '/murales')}><span>{t.more.c1}</span><i aria-hidden="true">→</i></a>
            <a className="cl-textlink" href={lp(lang, '/arte-por-encargo')}>{t.more.c2} →</a>
          </div>
        </div>
      </section>

      <section className="cl-band dm-credits" aria-label={t.credits.title}>
        <div className="cl-in">
          <p><b>{t.credits.title}</b></p>
          <p>{t.credits.zones}: {uniq(ZONAS.flatMap(z => z.fotos.map(p => p.who))).join(', ')}</p>
          <p>{t.credits.portraits}: {t.artistsCredit}</p>
          <p>{t.credits.works}: {nombres.join(', ')}</p>
          <p>{t.credits.murals}: {uniq(MURALES.map(s => s.who)).join(', ')}</p>
          <p>{t.credits.expo}: {HUSKY_WHO}</p>
          <p>{t.credits.agenda}: {t.credits.origin}: {AGENDA_WHO}</p>
        </div>
      </section>
    </div>
  );
}

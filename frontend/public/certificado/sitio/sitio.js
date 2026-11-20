/* Encabezado y pie HOMOLOGADOS con el resto de cucoarts.com para las páginas de artistas (prototipo).
   Se incluye con UNA línea:  <script src="sitio/sitio.js" data-tag="/artistas" data-tag-href="./" defer></script>
   (rutas relativas a la página; en certificado/: src="../sitio/sitio.js"). Atributos: data-tag = etiqueta amarilla rotada,
   data-tag-href = a dónde lleva, data-default-theme = "dark" para fijar el modo noche si la persona no ha elegido.
   Hace: (1) oculta el encabezado viejo de la página (queda en el DOM para que su JS no falle), (2) pinta el encabezado igual al de la
   landing y /mty: logo con máscara, etiqueta, pastilla sol/luna y botón Menú (sitemenu.js), (3) reemplaza el pie por el pie global.
   Para revertir: quitar la línea de inclusión de la página. */
(function(){
 const me=document.currentScript;
 const base=me.src.replace(/[^/]*$/,"");
 const TAG=me.dataset.tag||"/artistas",TAGHREF=me.dataset.tagHref||"./",DEF=me.dataset.defaultTheme||"";
 const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const r=document.documentElement;
 {const st=document.createElement("style");st.textContent="html.sh-on .sh-old{display:none!important}";document.head.appendChild(st);
  const lk=document.createElement("link");lk.rel="stylesheet";lk.href=base+"sitio.css";document.head.appendChild(lk)}
 const LANG=(()=>{try{return localStorage.getItem("cucoarts-lang")==="en"?"en":"es"}catch(e){return "es"}})();
 const T={es:{day:"Modo día",night:"Modo noche",toDay:"Cambiar a modo día",toNight:"Cambiar a modo noche",
   tag:"Del norte con amor",about:"Plataforma de descubrimiento artístico y cultural de Monterrey.",contact:"Contacto",links:"Enlaces",home:"Inicio",store:"Tienda",priv:"Aviso de privacidad",rights:"Todos los derechos reservados."},
  en:{day:"Day mode",night:"Night mode",toDay:"Switch to day mode",toNight:"Switch to night mode",
   tag:"From the north, with love",about:"Art and culture discovery platform from Monterrey.",contact:"Contact",links:"Links",home:"Home",store:"Store",priv:"Privacy notice",rights:"All rights reserved."}}[LANG];
 const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
 const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';

 /* tema: misma llave que todo cucoarts.com */
 const stored=()=>{try{return localStorage.getItem("cucoarts-theme")}catch(e){return null}};
 const eff=()=>r.dataset.theme||DEF||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
 if(!r.dataset.theme){const s=stored();if(s)r.dataset.theme=s;else if(DEF)r.dataset.theme=DEF}

 /* encabezado */
 const hd=document.createElement("header");hd.className="sh-top";
 hd.innerHTML=`<div class="sh-wrap"><a class="cl-logo" href="/" aria-label="CUCO ARTS · cucoarts.com"><span class="cl-sr">CUCO ARTS</span></a><a class="mtytag" href="${esc(TAGHREF)}" aria-label="${esc(TAG)}">${esc(TAG)}</a><nav class="nav sh-nav" aria-label="Cucoarts.com"><button class="pill sh-theme" type="button" id="shTheme"></button></nav></div>`;
 const old=document.querySelector("body > header.top:not(.sh-top)");
 if(old){old.before(hd);old.classList.add("sh-old")}else document.body.insertBefore(hd,document.body.firstChild);
 r.classList.add("sh-on");
 /* barra de herramientas (opcional): data-move="#cur,#lang" mueve controles del encabezado viejo (su JS sigue funcionando);
    data-links="Texto|ruta,Texto|ruta" agrega enlaces. Sin ninguno, no se crea. */
 {const mv=(me.dataset.move||"").split(",").map(x=>x.trim()).filter(Boolean),lk=(me.dataset.links||"").split(",").map(x=>x.trim()).filter(Boolean);
  if(mv.length||lk.length){const bar=document.createElement("div");bar.className="sh-bar";const w=document.createElement("div");w.className="sh-bar-in";
   lk.forEach(x=>{const [t,h]=x.split("|");const a=document.createElement("a");a.className="mono sh-link";a.href=h;a.textContent=t;w.appendChild(a)});
   mv.forEach(sel=>{const el=document.querySelector(sel);if(el)w.appendChild(el)});
   bar.appendChild(w);hd.after(bar)}}
 const tb=hd.querySelector("#shTheme");
 function paintTheme(){const d=eff()==="dark";tb.innerHTML=(d?SUN:MOON)+'<span class="cl-hide-s">'+(d?T.day:T.night)+"</span>";tb.setAttribute("aria-label",d?T.toDay:T.toNight);tb.setAttribute("aria-pressed",String(d));
  const m=document.querySelector("meta[name=theme-color]");if(m)m.content=d?"#161616":"#F5F1F1";
  const o=document.getElementById("theme");if(o)o.textContent=d?"Modo día":"Modo noche"}
 tb.onclick=()=>{const n=eff()==="dark"?"light":"dark";r.dataset.theme=n;try{localStorage.setItem("cucoarts-theme",n)}catch(e){}paintTheme()};
 window.addEventListener("storage",e=>{if(e.key==="cucoarts-theme"&&e.newValue){r.dataset.theme=e.newValue;paintTheme()}});
 paintTheme();

 /* menú del sitio (copia de sitemenu.js de /mty) */
 const l=document.createElement("link");l.rel="stylesheet";l.href=base+"sitemenu.css";document.head.appendChild(l);
 const sc=document.createElement("script");sc.src=base+"sitemenu.js";document.body.appendChild(sc);

 /* pie global (mismo que Footer.tsx de cucoarts.com) */
 function footerHTML(){const y=new Date().getFullYear(),h=LANG==="en"?"/en":"/";
  return `<footer class="cf" lang="${LANG}"><div class="cf-in"><div class="cf-grid"><div class="cf-brand"><a class="cf-logo" href="${h}" aria-label="CUCO ARTS"></a><p class="cf-tag">${esc(T.tag)}</p><p class="cf-about">${esc(T.about)}</p></div><div class="cf-col"><h2 class="cf-h">${esc(T.contact)}</h2><a href="mailto:hello@cucoarts.com">hello@cucoarts.com</a><span>Monterrey, N.L., México</span></div><div class="cf-col"><h2 class="cf-h">${esc(T.links)}</h2><a href="${h}">${esc(T.home)}</a><a href="https://store.cucoarts.com">${esc(T.store)}</a><a href="/privacidad">${esc(T.priv)}</a></div></div><div class="cf-legal"><span>© ${y} CUCO Cultural Collective México, S. de R.L. de C.V.</span><span>${esc(T.rights)}</span></div></div></footer>`}
 function ensureFooter(){
  if(document.querySelector("footer.cf"))return;
  const oldf=[...document.querySelectorAll("footer:not(.cf)")].filter(f=>!f.closest(".modal,.fpop")).pop();
  if(oldf){oldf.insertAdjacentHTML("afterend",footerHTML());oldf.classList.add("sh-old")}
  else document.body.insertAdjacentHTML("beforeend",footerHTML());
 }
 ensureFooter();
 const app=document.getElementById("app");
 if(app)new MutationObserver(ensureFooter).observe(app,{childList:true});
 window.SITIO={ensureFooter,paintTheme};
})();

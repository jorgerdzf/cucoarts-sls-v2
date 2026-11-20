/* Sección «Obra certificada» del perfil de artista (prototipo). Se incluye con UNA línea en index.html:
   <script src="certificados-perfil.js" defer></script>   (para revertir: quitar esa línea; este archivo y su .css no tocan nada más)
   Lee datos/certificados/indice.json (artista -> ids) y datos/certificados/<id>.json (públicos: sin precio ni comprador).
   Si el artista no tiene certificados no hace nada. El enlace «Certificado» vive en la barra interna (sitio/perfil.js). Corrige la pregunta frecuente de certificados. */
(function(){
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const slug=((location.pathname.match(/^\/artistas\/([a-z0-9-]+)/i)||[])[1]||new URLSearchParams(location.search).get("a")||"eliezer-blanco").replace(/[^a-z0-9-]/gi,"").toLowerCase();
 const base=new URL("/certificado/",location.origin);
 let certs=[];
 async function carga(){
  let ids=[];
  try{ids=({"romualdo-castaneda":["CA-2026-001"]})[slug]||[]}catch(e){return}
  if(!ids.length)return;
  certs=(await Promise.all(ids.map(id=>fetch(`/certificado/datos/${encodeURIComponent(id)}.json`).then(r=>r.json()).catch(()=>null)))).filter(Boolean);
  if(!certs.length)return;
  const l=document.createElement("link");l.rel="stylesheet";l.href="/artistas/certificados-perfil.css";document.head.appendChild(l);
  const app=$("#app");if(!app)return;
  new MutationObserver(ensure).observe(app,{childList:true});
  ensure();
 }
 const fv=(c,k)=>((c.ficha||[]).find(f=>f.k===k)||{}).v||"";
 function card(c){
  const src=new URL(c.imagen_principal.src,base).href,meta=[fv(c,"Técnica"),fv(c,"Medidas")].filter(Boolean).join(" · ");
  const href=`/certificado/${encodeURIComponent(c.id)}`;
  return `<article class="cc2"><a class="cc2-i" href="${esc(href)}" tabindex="-1" aria-hidden="true"><img src="${esc(src)}" alt="" loading="lazy"></a>
   <div class="cc2-b"><span class="mono">N.º ${esc(c.id)}</span><h3>${esc(c.titulo)}</h3>
   <span class="cc2-s"><i aria-hidden="true">✓</i>CUCO ARTS · ${esc(c.emitido_txt)}</span>
   ${meta?`<p class="cc2-m">${esc(meta)}</p>`:""}
   <a class="btn pri" href="${esc(href)}" aria-label="Ver certificado de ${esc(c.titulo)}, número ${esc(c.id)}">Ver certificado</a></div></article>`;
 }
 function ensure(){
  const obra=$("#obra");
  if(obra&&!$("#certificados")){
   const first=(($("h1")||{}).textContent||"").trim().split(" ")[0]||"el artista";
   obra.insertAdjacentHTML("afterend",`<section class="certs" id="certificados"><div class="w"><div class="sec-h"><div><span class="mono">Registro de CUCO ARTS</span><h2>Obra certificada</h2><p class="sub">Obras de ${esc(first)} ya registradas con certificado digital: ficha, historia y fechas, con su código QR de verificación.</p></div></div><div class="cc2-g">${certs.map(card).join("")}</div></div></section>`);
  }
  /* pregunta frecuente: veraz con lo que existe hoy */
  $$("#faq details:not([data-cert])").forEach(d=>{
   const s=$("summary",d);if(!s||!/certificado de autenticidad/i.test(s.textContent))return;
   d.dataset.cert="1";$$(".chip",s).forEach(x=>x.remove());
   const n=certs.map(c=>`«${c.titulo}» (${c.id})`);
   const p=$("p",d);if(p)p.innerHTML=`Las obras vendidas en la tienda se están registrando con un certificado digital con código QR. ${n.length===1?`${esc(n[0])} ya cuenta con el suyo`:`${esc(n.join(", "))} ya cuentan con el suyo`}; las demás se irán sumando. <a href="#certificados">Ver obra certificada</a>. Cada obra es original y viene firmada por el artista.`;
  });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",carga);else carga();
})();

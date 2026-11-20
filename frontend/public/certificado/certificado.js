/* Certificado de autenticidad CUCO ARTS (versión pública). Lee solo datos públicos: /certificado/datos/<id>.json (sin precio, comprador ni compra).
   Ruta pública: cucoarts.com/certificado/<id> (CloudFront la sirve con este mismo index.html). La capa del propietario no está en esta versión. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>window.CUCO_MONEDA?CUCO_MONEDA.fmt(n):"$"+Number(n).toLocaleString("es-MX")+" MXN";
const moneyC=n=>window.CUCO_MONEDA?CUCO_MONEDA.fmtCorto(n):"$"+Number(n).toLocaleString("es-MX");
const _m=location.pathname.match(/\/certificado\/(CA-\d{4}-\d{3})\/?$/i);
const id=((new URLSearchParams(location.search).get("c"))||(_m&&_m[1])||"").replace(/[^A-Za-z0-9-]/g,"").toUpperCase();
const cdn=(u,w)=>u+(u.includes("?")?"&":"?")+"width="+w;
let C,OBRAS=[],lastFocus=null;

/* tema: lo maneja el encabezado compartido (sitio/sitio.js) con la llave cucoarts-theme; aquí solo el color de la barra del navegador */
if(window.CUCO_MONEDA)CUCO_MONEDA.onChange(()=>renderObras());

async function boot(){
 try{
  C=await (await fetch(`/certificado/datos/${id}.json`)).json();
 }catch(e){$("#app").innerHTML='<div class="w" style="padding:60px 20px"><h1 style="font-size:48px">No encontramos este certificado</h1><p>Revisa el enlace o el código QR.</p></div>';return}
 try{OBRAS=(await (await fetch(`/certificado/datos/${C.artista.slug}-obras.json`)).json()).obras.filter(o=>o.estado==="active"&&o.titulo!==C.titulo).sort((a,b)=>b.precio-a.precio).slice(0,4)}catch(e){OBRAS=[]}
  if(window.SITIO_ACENTO)SITIO_ACENTO.desde(`/certificado/datos/${C.artista.slug}.json`);
 document.title=`Certificado ${C.id} · ${C.titulo} · ${C.artista.nombre} · CUCO ARTS`;
 $("#mbPerfil").href=C.artista.perfil;
 render();
 if(/[#&]k=/.test(location.hash))history.replaceState(null,"",location.pathname+location.search);
}

/* acordeón accesible: botón con aria-expanded + región */
function acc(items,pref,cls){
 return `<ul class="acc ${cls||""}">${items.map((x,i)=>`<li class="acc-i"><h3><button class="acc-b" type="button" aria-expanded="false" aria-controls="${pref}-p${i}" id="${pref}-b${i}"><span class="em" aria-hidden="true">${x.e}</span><span class="acc-t">${x.cuando?`<span class="mono yr">${esc(x.cuando)}</span>`:""}<span class="tt">${esc(x.t)}</span>${x.pre?`<span class="pre">${esc(x.pre)}</span>`:""}</span><span class="pm" aria-hidden="true"></span></button></h3><div class="acc-p" id="${pref}-p${i}" role="region" aria-labelledby="${pref}-b${i}" hidden>${x.html}</div></li>`).join("")}</ul>`;
}
function bindAcc(root){
 $$(".acc-b",root).forEach(b=>b.onclick=()=>{const o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!o));$("#"+b.getAttribute("aria-controls")).hidden=o});
}

function render(){
 const A=C.artista,im=C.imagen_principal,first=A.nombre.split(" ")[0];
 const g=k=>(C.ficha.find(f=>f.k===k)||{}).v||"";
 C.evidencia=C.evidencia||[];C.historia=C.historia||[];C.fechas=C.fechas||[];
 const hf=C.historia_foto||(C.evidencia[4]?{src:C.evidencia[4].src,c:C.evidencia[4].c,cap:A.nombre+" con "+C.titulo+"."}:null);
 const aEd=C.edicion?`<div class="edi"><span class="mono">Edición</span><h3>${esc(C.edicion.titulo)}</h3><p>${esc(C.edicion.texto)}</p><ul class="eje">${C.edicion.ejemplares.map(e=>`<li><b class="mono">${esc(e.n)}</b><span>${esc(e.propietario)}</span></li>`).join("")}</ul></div>`:"";
 const ficha=C.ficha.map(f=>`<div class="r"><dt class="mono">${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join("");
 const ev=C.evidencia.map((e,i)=>`<figure class="evf"><button class="evc" type="button" data-i="${i}" aria-label="Ampliar: ${esc(e.t)}"><img class="d" src="${esc(e.src)}" alt="${esc(e.c)}" loading="lazy"></button><figcaption>${esc(e.t)}</figcaption></figure>`).join("");
 const hist=acc(C.historia.map(h=>({e:h.e,t:h.t,pre:h.p[0],html:h.p.map(p=>`<p>${esc(p)}</p>`).join("")})),"h");
 const fechas=acc(C.fechas.map(f=>({e:f.e,t:f.t,cuando:f.cuando,html:`<p>${esc(f.d)}</p>`})),"f","acc-3");
 $("#app").innerHTML=`
 <section class="hero" id="inicio"><div class="w">
  <div>
   <div class="eyebrow mono">Certificado de autenticidad · <span class="nw">N.º ${esc(C.id)}</span></div>
   <h1>${esc(C.titulo)}</h1>
   <div class="tag-line mono">${esc(A.nombre)}</div>
   <div class="sello"><span class="ic" aria-hidden="true">${C.estado==="Registrado"?"✓":"…"}</span><b>CUCO ARTS · ${esc(C.emitido_txt)}</b></div>
   <p class="lead">${C.lead?esc(C.lead):`Obra original de <a href="${esc(A.perfil)}">${esc(A.nombre)}</a>, hecha en Monterrey. Aquí están sus características, su historia y las fechas que la acompañan.`}</p>
   <div class="cta"><a class="btn pri" href="#verificar">Verificar este certificado</a><button class="yel" type="button" id="shareBtn">Compartir</button></div>
   <div class="facts"><div><span class="mono">Técnica</span><b>${esc(g("Técnica"))}</b></div><div><span class="mono">Medidas</span><b>${esc(g("Medidas"))}</b></div><div><span class="mono">Hecho en</span><b>${esc(g("Hecho en").replace(", México",""))}</b></div></div>
  </div>
  <div class="portrait">
   <div class="frw">
    <button class="fr" type="button" id="heroImg" aria-label="Ampliar la foto de ${esc(C.titulo)}"><img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}"></button>
    <div class="stamp mono">${esc(C.sello_txt||"Obra original firmada")}</div>
   </div>
  </div>
 </div></section>

 <section id="obra"><div class="w">
  <div class="sec-h"><div><span class="mono">La obra</span><h2>Características</h2></div></div>
  <div class="ficha-g">
   <dl class="dl">${ficha}</dl>
   <div>${ev.length?`<div class="ev">${ev}</div>`:""}${aEd}</div>
  </div>
 </div></section>

 ${C.historia.length?`<section class="story" id="historia"><div class="w">
  <aside>
   <span class="mono">Historia</span><h2>${esc(C.historia_titulo)}</h2>
   ${hf?`<figure class="ph"><img src="${esc(hf.src)}" alt="${esc(hf.c)}" loading="lazy"><figcaption>${esc(hf.cap||"")}</figcaption></figure>`:""}
  </aside>
  <div class="acc-col">${hist}</div>
 </div></section>`:""}

 ${C.fechas.length?`<section class="fechas" id="fechas"><div class="w">
  <div class="sec-h"><div><span class="mono">Línea de tiempo</span><h2>Fechas importantes</h2></div></div>
  ${fechas}
 </div></section>`:""}



 <section class="ver fechas" id="verificar"><div class="w">
  <div>
   <span class="mono">Verificar</span><h2>¿Qué se verifica?</h2>
   <ul>
    <li>Que el número <b>${esc(C.id)}</b> existe en el registro de CUCO ARTS.</li>
    <li>Que la obra, el artista, las medidas y las fotos coinciden con la ficha registrada.</li>
    <li>Que el estado del certificado es «${esc(C.estado)}».</li>
    <li class="no">No es un avalúo ni una garantía de valor.</li>
   </ul>
   <div class="cta"><button class="pri" type="button" id="verBtn">Verificar ahora</button><a class="btn" href="/certificado/pdf.html?c=${esc(C.id)}&imprimir=1" target="_blank" rel="noopener">Guardar como PDF</a></div>
   <div class="res" id="verRes" role="status" hidden></div>
  </div>
  <div class="qrb">
   <span class="mono">Código QR</span>
   <img src="/certificado/img/qr-${esc(C.id)}.svg" width="240" height="240" alt="Código QR del certificado ${esc(C.id)}">
   <div class="u">${esc(C.url_futura.replace("https://",""))}</div>
   <div class="acts"><a class="btn" href="/certificado/etiqueta.html?c=${esc(C.id)}" target="_blank" rel="noopener">Etiqueta para pegar en la obra</a><button type="button" id="shareBtn2">Compartir o guardar en el teléfono</button></div>
   
  </div>
 </div></section>

 <section id="obras"><div class="w">
  <div class="sec-h"><div><span class="mono">Más de ${esc(first)}</span><h2>Más obra de ${esc(first)}</h2></div><span class="cur" id="cur" role="group" aria-label="Moneda"></span></div>
  <div class="grid" id="obrasG"></div>
  <div class="more"><a class="btn pri" href="${esc(A.perfil)}">Ver obra de ${esc(first)}</a><a class="btn" href="${esc(A.tienda)}" target="_blank" rel="noopener">Ver «${esc(C.titulo)}» en la tienda</a></div>
 </div></section>`;
 $("body").insertAdjacentHTML("beforeend",`<footer><div class="w"><div class="fl"><img class="lg lg-t" src="/certificado/img/logo-cuco-tinta.png" alt="CUCO ARTS"><img class="lg lg-w" src="/certificado/img/logo-cuco-blanco.png" alt="CUCO ARTS"></div><div><p class="mono">Documentación de procedencia</p><p>Este certificado registra la obra, su autor y su historia con la información disponible a la fecha de emisión (${esc(C.emitido_txt)}). No es un avalúo y no promete valor, inversión ni plusvalía.</p><p class="src">${esc(C.id)} · CUCO ARTS</p></div></div></footer>`);
 if(window.CUCO_MONEDA)CUCO_MONEDA.mount($("#cur"));
 initSubnav();
 renderObras();if($("#historia"))bindAcc($("#historia"));if($("#fechas"))bindAcc($("#fechas"));
 $("#heroImg").onclick=e=>lightbox({src:im.src,c:im.alt,t:C.titulo},e.currentTarget);
 $$(".evc").forEach(b=>b.onclick=()=>lightbox(C.evidencia[+b.dataset.i],b));
 $("#shareBtn").onclick=$("#shareBtn2").onclick=compartir;
 $("#verBtn").onclick=verificar;
}

/* barra interna: secciones del certificado y regreso al perfil */
function initSubnav(){
 const go=()=>{if(!window.SITIO_SUBNAV||go.done)return;go.done=1;SITIO_SUBNAV.init({label:"Secciones del certificado",back:{label:"← Obra de "+C.artista.nombre.split(" ")[0],href:C.artista.perfil},items:()=>[{id:"obra",label:"Obra"},{id:"historia",label:"Historia"},{id:"fechas",label:"Fechas"},{id:"propietario",label:"Propietario"},{id:"verificar",label:"Verificar"}].filter(x=>$("#"+x.id)),watch:$("#app")})};
 go();if(!go.done)addEventListener("load",go);
}
function renderObras(){
 const g=$("#obrasG");if(!g)return;
 g.innerHTML=OBRAS.map(o=>`<a class="card" href="${esc(o.url)}" target="_blank" rel="noopener"><div class="im"><img src="${esc(cdn(o.imgs[0],500))}" alt="" loading="lazy"></div><div class="bd"><h3>${esc(o.titulo)}</h3><span class="mt">${esc(o.tecnica||"")}${o.medidas?" · "+esc(o.medidas):""}</span><span class="pr">${moneyC(o.precio)}</span></div></a>`).join("");
 if(!OBRAS.length)$("#obras").hidden=true;
}

async function verificar(){
 const r=$("#verRes");r.hidden=false;r.textContent="Consultando el registro…";
 try{
  const d=await (await fetch(`/certificado/datos/${id}.json`,{cache:"no-store"})).json();
  r.innerHTML=`✓ <b>${esc(d.id)}</b> existe en el registro. Obra: «${esc(d.titulo)}», de ${esc(d.artista.nombre)}. Estado: ${esc(d.estado)}. Emitido el ${esc(d.emitido_txt)}.`;
 }catch(e){r.textContent="No pudimos consultar el registro. Intenta de nuevo."}
}

async function compartir(){
 const url=location.href.split("#")[0],data={title:`Certificado ${C.id} · ${C.titulo}`,text:`Certificado de autenticidad de «${C.titulo}», de ${C.artista.nombre}`,url};
 try{if(navigator.share){await navigator.share(data);return}}catch(e){if(e&&e.name==="AbortError")return}
 try{await navigator.clipboard.writeText(url);toast("Enlace copiado")}catch(e){prompt("Copia este enlace:",url)}
}
function toast(t){const n=document.createElement("div");n.setAttribute("role","status");n.textContent=t;n.style.cssText="position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:#F7D649;color:#232322;border:2.5px solid #232322;padding:8px 16px;z-index:60;font-weight:500";document.body.appendChild(n);setTimeout(()=>n.remove(),2200)}

/* lightbox con foco y Esc */
function lightbox(e,from){
 lastFocus=from||document.activeElement;
 const m=$("#modal");
 m.innerHTML=`<div class="lb"><button class="x" type="button" aria-label="Cerrar">✕</button><div class="im"><img src="${esc(e.src)}" alt="${esc(e.c||e.t)}"></div><div class="cp"><b>${esc(e.t||"")}</b>${e.c&&e.t?"<br>":""}${e.t?esc(e.c||""):""}</div></div>`;
 m.classList.add("on");document.body.style.overflow="hidden";
 const x=$(".x",m);x.focus();x.onclick=cerrar;
}
function cerrar(){const m=$("#modal");m.classList.remove("on");m.innerHTML="";document.body.style.overflow="";if(lastFocus)lastFocus.focus()}
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")cerrar()});
document.addEventListener("keydown",e=>{
 const m=$("#modal");if(!m.classList.contains("on"))return;
 if(e.key==="Escape")cerrar();
 if(e.key==="Tab"){const x=$(".x",m);e.preventDefault();x.focus()}
});
boot();

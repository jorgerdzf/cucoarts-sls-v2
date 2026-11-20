/* Aplica el color temático del artista: lee "acento" ({hex, tinta}) del JSON del artista y fija --acento / --acento-tinta.
   Uso: SITIO_ACENTO.desde("datos/<slug>.json") o SITIO_ACENTO.aplica({hex,tinta}). Para revertir: quitar acento.js de las páginas. */
(function(){
 const base=document.currentScript.src.replace(/[^/]*$/,"");
 const lk=document.createElement("link");lk.rel="stylesheet";lk.href=base+"acento.css";document.head.appendChild(lk);
 const ok=v=>/^#[0-9a-f]{6}$/i.test(v||"");
 function aplica(a){
  if(!a||!ok(a.hex))return;
  const s=document.documentElement.style;
  s.setProperty("--acento",a.hex);s.setProperty("--acento-tinta",ok(a.tinta)?a.tinta:"#232322");
  document.documentElement.dataset.acento=a.nombre||"";
 }
 async function desde(url){try{const j=await (await fetch(url)).json();aplica(j.acento);return j.acento||null}catch(e){return null}}
 window.SITIO_ACENTO={aplica,desde};
})();

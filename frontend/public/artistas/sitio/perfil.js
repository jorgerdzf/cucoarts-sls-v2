/* Integración del perfil de artista con el encabezado/pie homologados (prototipo). Se incluye con las líneas de sitio/ en index.html.
   - Barra interna de secciones (las que el perfil tenía en su menú + las nuevas), pegajosa, con scroll-spy.
   - El selector de moneda MXN/USD pasa a la franja de la obra (donde están los precios) y el CTA «Contratar» queda en la barra interna
     (en móvil siguen la barra inferior «Encargar» y el botón del héroe). Se vuelve a poner tras cada redibujado del perfil. */
(function(){
 const $=(s,r=document)=>r.querySelector(s);
 const slug=((location.pathname.match(/^\/artistas\/([a-z0-9-]+)/i)||[])[1]||new URLSearchParams(location.search).get("a")||"eliezer-blanco").replace(/[^a-z0-9-]/gi,"").toLowerCase();
 if(window.SITIO_ACENTO)SITIO_ACENTO.desde("/artistas/datos/"+slug+".json");
 const app=$("#app");if(!app||!window.SITIO_SUBNAV)return;
 SITIO_SUBNAV.init({
  label:"Secciones del perfil",
  items:()=>[{id:"historia",label:"Historia"},{id:"obra",label:"Obra"},{id:"certificados",label:"Certificado"},{id:"encargo",label:"Encargos"},{id:"taller",label:"Taller"},{id:"trayectoria",label:"Trayectoria"},{id:"faq",label:"Preguntas"}],
  cta:{label:"Contratar",href:"#encargo"},
  watch:app
 });
 function ajusta(){
  const f=$("#obra .filters");
  if(f&&window.CUCO_MONEDA&&!$("#cur2")){
   const s=document.createElement("span");s.className="cur";s.id="cur2";s.setAttribute("role","group");s.setAttribute("aria-label","Moneda");
   f.prepend(s);CUCO_MONEDA.mount(s);
  }
  const end=$(".sn-end");if(end)end.hidden=!$("#encargo");
 }
 new MutationObserver(ajusta).observe(app,{childList:true});
 ajusta();
})();

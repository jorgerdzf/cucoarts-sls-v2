/* «Dónde verlo»: eventos de la agenda /mty y murales donde participa el artista. GENERADO por build_donde_verlo.js. Solo aparece si hay datos. */
(function(){
 var slug=((location.pathname.match(/^\/artistas\/([a-z0-9-]+)/i)||[])[1]||'').toLowerCase();if(!slug)return;
 var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 var MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
 var fecha=function(d){if(!d)return'';var p=d.split('-');return (+p[2])+' '+MES[+p[1]-1]+' '+p[0]};
 var hoy=function(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
 function estado(e,h){var f=e.fin||e.inicio;if(e.inicio&&e.inicio>h)return['Próximo','p'];if(f&&f<h)return['Ya pasó','x'];return['En curso','c']}
 function pinta(D){
  var A=(D.artistas||{})[slug];if(!A)return;
  var main=document.getElementById('app');if(!main)return;
  var h=hoy(),ev=(A.eventos||[]).map(function(e){return{e:e,s:estado(e,h)}});
  ev.sort(function(a,b){var o={p:0,c:1,x:2};return o[a.s[1]]-o[b.s[1]]||String(b.e.inicio).localeCompare(String(a.e.inicio))});
  var hayVivo=ev.some(function(x){return x.s[1]!=='x'});
  var li=ev.map(function(x){var e=x.e,rango=e.fin&&e.fin!==e.inicio?fecha(e.inicio)+' – '+fecha(e.fin):fecha(e.inicio);
   return '<li><a href="/mty/e/'+esc(e.id)+'.html?ref=perfil"><span class="dv-st dv-'+x.s[1]+' mono">'+x.s[0]+'</span><b>'+esc(e.titulo)+'</b><span class="dv-m">'+esc(rango)+(e.lugar?' · '+esc(e.lugar):'')+(e.zona?' · Zona '+esc(e.zona):'')+'</span><span class="dv-go" aria-hidden="true">→</span></a></li>'}).join('');
  var mu=(A.murales||[]).map(function(m){return '<li><a href="/mty/arte-urbano?ref=perfil"><span class="dv-st dv-m2 mono">Mural</span><b>'+esc(m.titulo||'Mural en San Nicolás de los Garza')+'</b><span class="dv-m">'+esc(m.donde||'')+(m.zona?' · Zona '+esc(m.zona):'')+'</span><span class="dv-go" aria-hidden="true">→</span></a></li>'}).join('');
  var sec=document.createElement('section');sec.id='donde-verlo';
  sec.innerHTML='<div class="w"><div class="sec-h"><div><span class="mono">Dónde verlo</span><h2>En la ciudad</h2></div></div>'+
   (ev.length&&!hayVivo?'<p class="dv-n">Por ahora no hay fechas próximas. Estas son sus apariciones más recientes en la agenda de /mty.</p>':'')+
   '<ul class="dv">'+li+mu+'</ul><p class="dv-f"><a class="btn" href="/mty?ref=perfil">Ver toda la agenda de arte en Monterrey →</a></p></div>';
  if(!document.getElementById('dv-css')){var st=document.createElement('style');st.id='dv-css';st.textContent=
   '#donde-verlo .dv{list-style:none;margin:0;padding:0;display:grid;gap:12px}#donde-verlo .dv a{display:grid;grid-template-columns:auto 1fr auto;gap:4px 14px;align-items:center;border:2.5px solid var(--ink);background:var(--card);padding:14px 16px;text-decoration:none;box-shadow:5px 5px 0 var(--acento,#F7D649)}'+
   '#donde-verlo .dv a:hover{transform:translate(-1px,-1px);box-shadow:7px 7px 0 var(--acento,#F7D649)}#donde-verlo .dv b{font-size:19px;line-height:1.2;grid-column:2}#donde-verlo .dv-m{grid-column:2;color:var(--mut);font-size:14px}'+
   '#donde-verlo .dv-st{grid-row:1/3;grid-column:1;border:2px solid var(--ink);border-radius:999px;padding:1px 10px;font-size:11px;white-space:nowrap;background:var(--card)}'+
   '#donde-verlo .dv-p,#donde-verlo .dv-c{background:var(--acento,#F7D649);color:var(--acento-tinta,#232322)}#donde-verlo .dv-m2{background:var(--ink);color:var(--bg)}#donde-verlo .dv-go{grid-row:1/3;grid-column:3;font-size:22px}'+
   '#donde-verlo .dv-n{color:var(--mut);margin:0 0 16px;max-width:60ch}#donde-verlo .dv-f{margin:22px 0 0}'+
   '@media(max-width:560px){#donde-verlo .dv a{grid-template-columns:1fr auto}#donde-verlo .dv-st{grid-row:auto;grid-column:1;justify-self:start}#donde-verlo .dv b,#donde-verlo .dv-m{grid-column:1}#donde-verlo .dv-go{grid-row:1/4;grid-column:2}}';document.head.appendChild(st)}
  var put=function(){if(document.getElementById('donde-verlo'))return true;var enc=document.getElementById('encargo');if(!enc)return false;enc.parentNode.insertBefore(sec,enc);return true};
  if(!put())new MutationObserver(function(m,o){if(put())o.disconnect()}).observe(main,{childList:true,subtree:true});
  new MutationObserver(function(){if(!document.getElementById('donde-verlo'))put()}).observe(main,{childList:true});
 }
 fetch('/artistas/datos/donde-verlo.json').then(function(r){return r.ok?r.json():null}).then(function(D){if(D)pinta(D)}).catch(function(){});
})();

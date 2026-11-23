/* «Más artistas»: puente de cada perfil de regreso al directorio /artistas. Muestra 3 artistas al azar (distintos del actual) y el botón al directorio. */
(function(){
 var slug=((location.pathname.match(/^\/artistas\/([a-z0-9-]+)/i)||[])[1]||'').toLowerCase();if(!slug)return;
 var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 function pinta(I){
  var L=(I.artistas||I||[]).filter(function(a){return a&&a.slug&&a.slug!==slug});if(L.length<3)return;
  var n=L.length+1,i,j,t;for(i=L.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=L[i];L[i]=L[j];L[j]=t}
  var tres=L.slice(0,3);
  var cards=tres.map(function(a){var z=(a.zonas||[])[0],mun=String(a.municipio||'').split(' · ')[0].replace('San Pedro Garza García','San Pedro');
   return '<li><a class="ma-c" href="/artistas/'+esc(a.slug)+'?ref=perfil_mas"><img src="'+esc(a.foto_mini||a.foto)+'" alt="" width="400" height="400" loading="lazy" decoding="async"><span class="ma-n">'+esc(a.nombre)+'</span><span class="ma-m mono">'+esc(mun)+(z?' · '+esc(z):'')+'</span></a></li>'}).join('');
  var sec=document.createElement('section');sec.id='mas-artistas';
  sec.innerHTML='<div class="w"><div class="sec-h"><div><span class="mono">Más artistas</span><h2>Conoce a otros autores de Monterrey</h2></div></div><ul class="ma">'+cards+'</ul><p class="ma-f"><a class="btn" href="/artistas?ref=perfil">Ver a los '+n+' artistas <b aria-hidden="true">→</b></a></p></div>';
  if(!document.getElementById('ma-css')){var st=document.createElement('style');st.id='ma-css';st.textContent=
   '#mas-artistas{padding:34px 0 10px}#mas-artistas .ma{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}'+
   '#mas-artistas .ma-c{display:flex;flex-direction:column;gap:4px;text-decoration:none;color:inherit;border:2.5px solid var(--ink);background:var(--card);padding:0 0 10px;box-shadow:5px 5px 0 var(--acento,#F7D649);transition:transform .18s,box-shadow .18s}'+
   '#mas-artistas .ma-c:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--acento,#F7D649)}'+
   '#mas-artistas .ma-c img{width:100%;aspect-ratio:1;object-fit:cover;object-position:50% 25%;border-bottom:2.5px solid var(--ink);display:block}'+
   '#mas-artistas .ma-n{font-weight:700;font-size:17px;line-height:1.15;padding:6px 10px 0}#mas-artistas .ma-m{padding:0 10px;color:var(--mut);font-size:12px}'+
   '#mas-artistas .ma-f{margin:22px 0 0;text-align:center}'+
   '@media(max-width:560px){#mas-artistas .ma{grid-template-columns:repeat(2,minmax(0,1fr))}#mas-artistas .ma li:nth-child(3){display:none}}';document.head.appendChild(st)}
  var main=document.getElementById('app');if(!main)return;
  var put=function(){if(document.getElementById('mas-artistas'))return true;var f=document.getElementById('faq');if(!f)return false;f.parentNode.insertBefore(sec,f.nextSibling);return true};
  if(!put())new MutationObserver(function(m,o){if(put())o.disconnect()}).observe(main,{childList:true,subtree:true});
 }
 fetch('/artistas/indice.json').then(function(r){return r.ok?r.json():null}).then(function(I){if(I)pinta(I)}).catch(function(){});
})();

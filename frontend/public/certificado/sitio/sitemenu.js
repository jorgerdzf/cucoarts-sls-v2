/* Copia de MTY_PROTOTIPO/src/sitemenu.js (menú de cucoarts.com) adaptada al encabezado compartido de los perfiles: se dibuja en .sh-top .nav; el idioma sale de cucoarts-lang. */
/* Recorrido curatorial en 5 pilares: Descubre MTY → Catálogo → Eventos y Expos → Proyectos → RIPPLE.
   Mismas secciones, orden y etiquetas que SiteMenu.tsx de la landing (si cambias una, cambia la otra). */
(function(){
  const LANG=(function(){try{return localStorage.getItem('cucoarts-lang')==='en'?'en':'es'}catch(e){return 'es'}})();
  const TXT={
    es:{menu:'Menú',close:'Cerrar menú',here:'estás aquí',label:'Menú principal',city:'Ciudad',cityMore:'Más ciudades pronto',
      guide:'Guía',live:'Activa',sell:'¿Eres artista? Vende tu obra',quote:'Cotizador rápido',connect:'Escríbenos',copy:'Copiar enlace',copied:'¡Enlace copiado!',
      i1:'Descubre MTY',s1:'Murales y artistas, zona por zona',iA:'Artistas',sA:'Quiénes son y cómo trabajan',i2:'Catálogo',s2:'Obra original y ediciones',i3:'Exposiciones',s3:'Agenda de artes visuales de MTY',
      i4:'Proyectos',s4:'Murales, comisiones y cotizador',i5:'RIPPLE',s5:'Gana puntos por descubrir arte local',
      p1k:'Arte urbano',p1t:'Los murales de San Nicolás, zona por zona',p1d:'Quién los pintó, con qué estilo y dónde encontrar su obra en la tienda.',p1c:'Recorrer murales',
      p3k:'En curso',p3t:'Expo en Santiago',p3d:'Arte local en HUSKY Coffee Shop. Pasa, toma un café y mira la obra en persona.',p3c:'Ver la expo'},
    en:{menu:'Menu',close:'Close menu',here:'you are here',label:'Main menu',city:'City',cityMore:'More cities soon',
      guide:'Guide',live:'Live',sell:'Are you an artist? Sell your art',quote:'Quick quote',connect:'Write to us',copy:'Copy link',copied:'Link copied!',
      i1:'Discover MTY',s1:'Murals and artists, zone by zone',iA:'Artists',sA:'Who they are and how they work',i2:'Catalog',s2:'Original work and editions',i3:'Exhibitions',s3:'Visual arts agenda of MTY',
      i4:'Projects',s4:'Murals, commissions and quotes',i5:'RIPPLE',s5:'Earn points for discovering local art',
      p1k:'Street art',p1t:'San Nicolás murals, zone by zone',p1d:'Who painted them, in what style, and where to find their work in the store.',p1c:'Explore murals',
      p3k:'On now',p3t:'Expo in Santiago',p3d:'Local art at HUSKY Coffee Shop. Drop by, grab a coffee and see the work in person.',p3c:'See the expo'}
  };
  /* ruta en inglés de las páginas que la tienen; el resto se queda igual */
  const lp=(en,p)=>en?(p==='/'?'/en':'/en'+({'/murales':'/murals','/arte-por-encargo':'/custom-art'}[p]||p)):p;
  const path=(location.pathname.replace(/\/+$/,'')||'/').replace(/^\/en(?=\/)/,'');
  const curId=path.indexOf('/artistas')===0?'artists':path.indexOf('/mty/arte-urbano')===0?'discover':path.indexOf('/ripple')===0?'ripple':path==='/mty'||path.indexOf('/mty/')===0?'events':'';
  function items(){
    const en=LANG==='en', t=TXT[LANG];
    return [
      {id:'discover',label:t.i1,sub:t.s1,href:lp(en,'/mty/arte-urbano'),badge:t.guide,prev:{img:'/mty/img/murales/greometria-puente-sn-b1-2.jpg',k:t.p1k,t:t.p1t,d:t.p1d,c:t.p1c,href:lp(en,'/mty/arte-urbano')}},
      {id:'artists',label:t.iA,sub:t.sA,href:'/artistas'},
      {id:'catalog',label:t.i2,sub:t.s2,href:'https://store.cucoarts.com',ext:true},
      {id:'events',label:t.i3,sub:t.s3,href:'/mty',badge:t.live,prev:{img:'/mty/img/husky-expo.jpg',k:t.p3k,t:t.p3t,d:t.p3d,c:t.p3c,href:lp(en,'/husky')}},
      {id:'projects',label:t.i4,sub:t.s4,href:lp(en,'/murales')},
      {id:'ripple',label:t.i5,sub:t.s5,href:'/ripple/mty'}
    ].map(it=>Object.assign(it,{current:it.id===curId}));
  }
  const PIN='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
  const CHEV='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const nav=document.querySelector('.sh-top .nav'); if(!nav)return;
  const btn=document.createElement('button'); btn.type='button'; btn.className='cl-menubtn'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','site-menu');
  btn.innerHTML='<span class="cl-menuicon" aria-hidden="true"><i></i><i></i><i></i></span><span class="cl-menutxt"></span>';
  nav.appendChild(btn);
  const panel=document.createElement('div'); panel.id='site-menu'; panel.className='cl-menu'; panel.tabIndex=-1; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-hidden','true');
  document.body.appendChild(panel);
  let open=false, lastFocus=null, rt=null;
  const esc2=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function label(){btn.querySelector('.cl-menutxt').textContent=open?TXT[LANG].close:TXT[LANG].menu}
  function render(){
    const t=TXT[LANG], its=items(), tab=open?0:-1;
    panel.setAttribute('aria-label',t.label);
    const list=its.map((it,i)=>'<li style="--i:'+i+'"><a class="cl-mi'+(it.current?' is-current':'')+'" data-id="'+it.id+'" href="'+esc2(it.href)+'"'+(it.ext?' rel="noopener"':'')+(it.current?' aria-current="page" title="'+esc2(t.here)+'"':'')+' tabindex="'+tab+'">'+
      '<span class="cl-mi-n">'+(it.current?'●':String(i+1).padStart(2,'0'))+'</span>'+
      '<span class="cl-mi-tx"><span class="cl-mi-t">'+esc2(it.label)+'</span><span class="cl-mi-s">'+esc2(it.sub)+'</span></span>'+
      (it.badge?'<span class="cl-live cl-mi-b">'+esc2(it.badge)+'</span>':'')+'<span class="cl-mi-go" aria-hidden="true">'+(it.ext?'↗':'→')+'</span></a></li>').join('');
    const cards=its.filter(it=>it.prev).map(it=>'<a class="cl-card" data-for="'+it.id+'" href="'+esc2(it.prev.href)+'" tabindex="-1" aria-hidden="true"><span class="cl-card-img"><img src="'+esc2(it.prev.img)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'is-empty\');this.remove()"></span>'+
      '<span class="cl-card-b"><span class="cl-card-k">'+esc2(it.prev.k)+'</span><span class="cl-card-t">'+esc2(it.prev.t)+'</span><span class="cl-card-d">'+esc2(it.prev.d)+'</span><span class="cl-card-c">'+esc2(it.prev.c)+' →</span></span></a>').join('');
    panel.innerHTML='<div class="cl-menu-in"><div class="cl-menu-top"><span class="cl-menu-logo" aria-hidden="true"></span>'+
      '<span class="cl-city-w"><button type="button" class="cl-city" aria-haspopup="true" aria-expanded="false" aria-label="'+esc2(t.city)+': Monterrey">'+PIN+'<span>MONTERREY</span>'+CHEV+'</button>'+
      '<span class="cl-city-pop" role="menu" hidden><span class="cl-city-it is-on" role="menuitem" aria-current="true">'+PIN+' Monterrey</span><span class="cl-city-it is-off" aria-disabled="true">'+esc2(t.cityMore)+'</span></span></span>'+
      '<button type="button" class="cl-menu-x" aria-label="'+esc2(t.close)+'"><span aria-hidden="true">✕</span></button></div>'+
      '<div class="cl-menu-body"><ol class="cl-menu-list">'+list+'</ol><div class="cl-menu-side" aria-hidden="true">'+cards+'</div></div>'+
      '<div class="cl-menu-foot"><div class="cl-foot-main"><a href="'+esc2(lp(LANG==='en','/')+'#vende')+'" tabindex="'+tab+'">'+esc2(t.sell)+' →</a><a href="'+esc2(lp(LANG==='en','/murales'))+'" tabindex="'+tab+'">'+esc2(t.quote)+' →</a></div>'+
      '<div class="cl-foot-sub"><span>'+esc2(t.connect)+'</span><a href="mailto:hello@cucoarts.com" tabindex="'+tab+'">hello@cucoarts.com</a><a href="https://www.instagram.com/cucoarts/" target="_blank" rel="noopener noreferrer" tabindex="'+tab+'">Instagram ↗</a><button type="button" class="cl-copy" aria-live="polite" tabindex="'+tab+'">'+esc2(t.copy)+'</button></div></div></div>';
    panel.querySelector('.cl-menu-x').onclick=close;
    /* selector de ciudad: por ahora solo Monterrey; deja ver que habrá más */
    const cb=panel.querySelector('.cl-city'), cp2=panel.querySelector('.cl-city-pop');
    cb.onclick=e=>{e.stopPropagation();const o=cp2.hidden;cp2.hidden=!o;cb.setAttribute('aria-expanded',String(o))};
    panel.addEventListener('click',e=>{if(!e.target.closest('.cl-city-w')){cp2.hidden=true;cb.setAttribute('aria-expanded','false')}});
    /* vista previa en escritorio: al pasar o enfocar un pilar con tarjeta, se muestra a la derecha (el resto deja la de Descubre) */
    const side=panel.querySelector('.cl-menu-side');
    function show(id){const has=side.querySelector('[data-for="'+id+'"]');side.querySelectorAll('.cl-card').forEach(c=>c.classList.toggle('is-on',!!has&&c.dataset.for===id));side.classList.toggle('is-none',!has)}
    panel.querySelectorAll('a.cl-mi').forEach(a=>{const id=a.dataset.id;a.addEventListener('mouseenter',()=>show(id));a.addEventListener('focus',()=>show(id))});
    show('discover');
    /* copia la dirección completa de esta página (con https://) para pegarla en WhatsApp y que salga la vista previa */
    const cp=panel.querySelector('.cl-copy'); if(cp)cp.onclick=async()=>{
      const link=location.origin+location.pathname;
      try{await navigator.clipboard.writeText(link)}catch(e){const ta=document.createElement('textarea');ta.value=link;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e2){}document.body.removeChild(ta)}
      cp.textContent=t.copied; setTimeout(()=>{cp.textContent=t.copy},1800);
    };
    panel.querySelectorAll('a').forEach(a=>a.onclick=()=>{if(a.getAttribute('aria-current')==='page')close()});
  }
  function setOpen(o){
    open=o; btn.classList.toggle('is-open',o); btn.setAttribute('aria-expanded',String(o)); panel.classList.toggle('is-open',o); panel.setAttribute('aria-hidden',String(!o)); label();
    panel.querySelectorAll('a.cl-mi,.cl-foot-main a,.cl-foot-sub a,.cl-foot-sub button,.cl-city,.cl-menu-x').forEach(el=>el.tabIndex=o?0:-1);
    document.body.style.overflow=o?'hidden':'';
    clearTimeout(rt); panel.classList.remove('is-ready');
    if(o){rt=setTimeout(()=>panel.classList.add('is-ready'),1000);setTimeout(()=>panel.focus({preventScroll:true}),120)}
  }
  function close(){setOpen(false);if(lastFocus)btn.focus()}
  btn.onclick=()=>{
    if(!open){
      render(); lastFocus=btn;
      const r=btn.getBoundingClientRect();
      panel.style.setProperty('--ox',(r.left+r.width/2)+'px'); panel.style.setProperty('--oy',(r.top+r.height/2)+'px');
      requestAnimationFrame(()=>setOpen(true));
    } else close();
  };
  document.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){e.preventDefault();close()}});
  window.addEventListener('orientationchange',()=>{if(open)close()});
  label();
  /* el botón sigue el idioma: se actualiza cuando cambia (el menú se vuelve a dibujar al abrir) */
  const langBtn=document.getElementById('langBtn'); if(langBtn)langBtn.addEventListener('click',()=>setTimeout(label,0));
})();

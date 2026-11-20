/* Barra interna de secciones, pegajosa, con scroll suave y scroll-spy. Uso:
   SITIO_SUBNAV.init({items:()=>[{id:"obra",label:"Obra"},{label:"Blog",href:"blog/"}], back:{label:"← Perfil de X",href:"../?a=x"}, cta:{label:"Contratar",href:"#encargo"}, watch:document.getElementById("app")})
   items() se vuelve a evaluar cuando cambia el contenido observado (los perfiles se redibujan). Solo se muestran las secciones que existen.
   En móvil la barra es una fila con scroll horizontal propio (la página no se desplaza) y bordes difuminados. */
(function(){
 const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 let nav,sc,opts,links=[],raf=0,tm=0;
 function visible(el){return el&&!el.hidden&&el.getClientRects().length>0}
 function build(){
  const its=(opts.items()||[]).filter(it=>it.href||visible(document.getElementById(it.id)));
  const key=JSON.stringify(its.map(i=>i.id||i.href));
  if(nav.dataset.key===key)return;nav.dataset.key=key;
  sc.innerHTML=(opts.back?`<a class="sn-back" href="${esc(opts.back.href)}">${esc(opts.back.label)}</a>`:"")+its.map(it=>`<a href="${esc(it.href||"#"+it.id)}"${it.id?` data-id="${esc(it.id)}"`:""}>${esc(it.label)}</a>`).join("");
  links=[...sc.querySelectorAll("a[data-id]")];
  fades();altura();spy();
 }
 function fades(){
  const m=sc.scrollWidth-sc.clientWidth;
  nav.querySelector(".sn-l").classList.toggle("on",m>2&&sc.scrollLeft>2);
  nav.querySelector(".sn-r").classList.toggle("on",m>2&&sc.scrollLeft<m-2);
 }
 function altura(){document.documentElement.style.setProperty("--sn-h",Math.ceil(nav.getBoundingClientRect().height)+"px")}
 function spy(){
  raf=0;if(!links.length)return;
  const top=nav.getBoundingClientRect().height+Math.min(120,innerHeight*.2);
  let cur=null;
  for(const a of links){const e=document.getElementById(a.dataset.id);if(!e||!visible(e))continue;if(e.getBoundingClientRect().top<=top)cur=a}
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4){const l=links[links.length-1];if(l&&visible(document.getElementById(l.dataset.id)))cur=l}
  links.forEach(a=>{if(a===cur)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});
  if(cur){const mx=sc.scrollWidth-sc.clientWidth,x=Math.max(0,Math.min(mx,cur.offsetLeft-(sc.clientWidth-cur.offsetWidth)/2));if(Math.abs(sc.scrollLeft-x)>8&&mx>0){sc.scrollTo({left:x,behavior:"smooth"})}}
 }
 const onScroll=()=>{if(!raf)raf=requestAnimationFrame(spy)};
 window.SITIO_SUBNAV={init(o){
  opts=o;
  nav=document.createElement("nav");nav.className="sn";nav.setAttribute("aria-label",o.label||"Secciones");
  nav.innerHTML=`<div class="sn-in"><div class="sn-wrap"><button type="button" class="sn-ar sn-l" aria-hidden="true" tabindex="-1"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><div class="sn-scroll" id="snScroll"></div><button type="button" class="sn-ar sn-r" aria-hidden="true" tabindex="-1"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>${o.cta?`<div class="sn-end"><a class="btn pri sm" href="${esc(o.cta.href)}">${esc(o.cta.label)}</a></div>`:""}</div>`;
  sc=nav.querySelector(".sn-scroll");
  nav.querySelector(".sn-l").onclick=()=>sc.scrollBy({left:-sc.clientWidth*.6,behavior:"smooth"});
  nav.querySelector(".sn-r").onclick=()=>sc.scrollBy({left:sc.clientWidth*.6,behavior:"smooth"});
  const hd=document.querySelector(".sh-top");
  if(hd)hd.after(nav);else document.body.insertBefore(nav,document.body.firstChild);
  sc.addEventListener("scroll",fades,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",()=>{fades();altura();onScroll()});window.addEventListener("orientationchange",()=>setTimeout(()=>{fades();altura();onScroll()},250));
  const w=o.watch||document.body;
  new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(()=>{build();onScroll()},120)}).observe(w,{childList:true,subtree:!o.watch});
  build();setTimeout(()=>{build();onScroll()},600);
 },rebuild(){if(nav){nav.dataset.key="";build();onScroll()}}};
})();

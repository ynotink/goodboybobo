/* Good Boy Bobo — UI life: smooth screen-to-screen fades and real button presses for buttons painted into the page art.
   Every painted button was cut out ahead of time (ui3/press/*.webp, each checked by eye) together with a clean patch of
   the panel that sits under it. On touch the button pops up off the panel and settles back on release, so it moves like
   a separate piece with nothing showing behind it. Respects reduced motion. */
(function(){
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
const me=document.currentScript,root=me.src.replace(/ui_life\.js.*$/,''),PR=root+'ui3/press/',V='?v=13';
const css=document.createElement('style');css.textContent=`
.mk-z::after,#gbnav .it::after{display:none!important}
.ul-pc,.ul-pt{position:absolute;pointer-events:none;display:block;-webkit-user-drag:none}
.ul-pc{transform-origin:50% 55%;will-change:transform}
#ulFade{position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:#fff1df;opacity:0}`;document.head.appendChild(css);

/* screen changes are instant (no fades) */
if(!window.FX)window.FX={out(){}};else FX.out=function(){};

/* ---------- which pre-cut piece belongs to each tap area ---------- */
const PAGE=(location.pathname.match(/(shop|toys|friends|settings)\.html/)||[])[1];
const navPage=()=>{const n=document.querySelector('script[src*="nav/nav.js"]');return n?n.dataset.page:''};
let META=null;fetch(PR+'meta.json'+V).then(r=>r.json()).then(m=>{META=m;preload()}).catch(()=>{});
const NV2={home:1,map:1},PRN=()=>NV2[navPage()]?root+'ui3/v2/press/':PR,VN=()=>NV2[navPage()]?'?v=1':V;
function keyFor(z){
 if(z.classList.contains('it')){const its=[...document.querySelectorAll('#gbnav .it')];const art=['home','map','toys','friends','shop'].includes(navPage())?navPage():'none';return 'nav_'+art+'_'+its.indexOf(z)}
 if(!PAGE)return null;return PAGE+'_'+[...document.querySelectorAll('.mk-z')].indexOf(z)}
function preload(){for(const k in META){if(PAGE&&k.startsWith(PAGE+'_')){new Image().src=PR+k+'.webp'+V;new Image().src=PR+k+'_p.webp'+V}
 if(k.startsWith('nav_')&&k.startsWith('nav_'+(['home','map','toys','friends','shop'].includes(navPage())?navPage():'none')+'_')){new Image().src=PRN()+k+'.webp'+VN();new Image().src=PRN()+k+'_p.webp'+VN()}}}
// tap-area corner in mockup px (pieces were cut in mockup coordinates; the zone's own on-screen spot gives the row offset)
const ZONES={};
[['shop',[[472,578],[78,912],[360,912],[637,912],[93,1250],[357,1250],[626,1250]]],
 ['toys',[[120,583],[724,583],[118,700],[474,700],[118,855],[474,855],[118,1010],[474,1010],[110,1250]]],
 ['friends',[[356,400],[612,400],[612,628],[612,745],[612,862],[94,975],[478,975],[266,1212],[650,1338]]],
 ['settings',[null,[590,962]]]].forEach(([p,a])=>a.forEach((xy,i)=>{if(xy)ZONES[p+'_'+i]=xy}));
function place(z,k){const m=META&&META[k];if(!m)return null;
 if(k.startsWith('nav_')){const bar=document.querySelector('#gbnav .barframe')||document.querySelector('#gbnav .barimg');if(!bar)return null;const br=bar.getBoundingClientRect(),s=br.width/840,host=bar.parentNode,hr=host.getBoundingClientRect();
  return{host,left:br.left-hr.left+m[0]*s,top:br.top-hr.top+m[1]*s,w:m[2]*s,h:m[3]*s}}
 const Z=ZONES[k];if(!Z)return null;const box=z.parentNode,s=parseFloat(box.style.getPropertyValue('--s'))||1;
 return{host:box,left:parseFloat(z.style.left)+(m[0]-Z[0])*s,top:parseFloat(z.style.top)+(m[1]-Z[1])*s,w:m[2]*s,h:m[3]*s}}
function lift(z){const k=keyFor(z);if(!k)return null;const P=place(z,k);if(!P)return null;
 const nv=k.startsWith('nav_'),mk=(src,c)=>{const i=new Image();i.src=(nv?PRN():PR)+src+(nv?VN():V);i.className=c;i.alt='';i.draggable=false;Object.assign(i.style,{left:P.left+'px',top:P.top+'px',width:P.w+'px',height:P.h+'px'});return i};
 const pt=mk(k+'_p.webp','ul-pt'),pc=mk(k+'.webp','ul-pc');P.host.insertBefore(pt,z);P.host.insertBefore(pc,z);return{pt,pc,nav:k.startsWith('nav_'),dn:/^toys_[2-7]$/.test(k)}}
// buttons that are their own picture (e.g. Restore Purchases): spring the picture itself
function ownPart(z){const r=z.getBoundingClientRect();for(const p of z.parentNode.querySelectorAll('.mk-p')){const q=p.getBoundingClientRect();
 if(Math.abs(q.left-r.left)<3&&Math.abs(q.top-r.top)<3&&Math.abs(q.width-r.width)<4)return p}return null}

function wire(z){if(z._ul)return;z._ul=1;let L=null,t=0,own=null;
 const down=()=>{if(RM)return;t=performance.now();own=z.classList.contains('mk-z')?ownPart(z):null;
  if(own){own.getAnimations().forEach(a=>a.cancel());own.animate([{scale:1},{scale:.95}],{duration:110,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});return}
  if(L){L.pc.remove();L.pt.remove()}L=lift(z);if(!L)return;
  {const zr=z.getBoundingClientRect(),cx=zr.left+zr.width/2,cy=zr.top+zr.height*.55;L.ov=[...z.parentNode.querySelectorAll('.ck3,.tb3')].filter(e=>{const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;return x>zr.left&&x<zr.right&&y>zr.top&&y<zr.bottom});
   const ty=L.dn?0:-parseFloat(L.pc.style.height)*(L.nav?.05:.03);L.ty=ty;L.s=L.dn?.955:(L.nav?1.08:1.05);
   for(const e of L.ov){const r=e.getBoundingClientRect();e.style.transformOrigin=(cx-r.left)+'px '+(cy-r.top)+'px';e.getAnimations().forEach(a=>a.cancel());
    e.animate([{scale:1,translate:'0 0'},{scale:L.s,translate:'0 '+ty+'px'}],{duration:120,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'})}}
  L.pc.animate([{scale:1,translate:'0 0',filter:'brightness(1)'},{scale:L.s,translate:L.dn?'0 0':(L.nav?'0 -5%':'0 -3%'),filter:L.dn?'brightness(.95)':'brightness(1.03)'}],{duration:120,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'})};
 const up=()=>{const wait=Math.max(0,90-(performance.now()-t));
  if(own){const o=own;own=null;setTimeout(()=>{o.getAnimations().forEach(a=>a.cancel());o.animate([{scale:.95},{scale:1.03,offset:.5},{scale:1}],{duration:320,easing:'ease-out'})},wait);return}
  if(!L)return;const m=L;L=null;
  setTimeout(()=>{const s=m.s,y=m.dn?'0 0':(m.nav?'0 -5%':'0 -3%');
   const a=m.pc.animate(m.dn?[{scale:s,translate:'0 0',filter:'brightness(.95)'},{scale:1.015,translate:'0 0',filter:'brightness(1)',offset:.5},{scale:.997,translate:'0 0',offset:.8},{scale:1,translate:'0 0'}]:[{scale:s,translate:y},{scale:.985,translate:'0 0',offset:.55},{scale:1.006,translate:'0 0',offset:.8},{scale:1,translate:'0 0'}],{duration:360,easing:'ease-out',fill:'forwards'});
   for(const e of (m.ov||[]))e.animate([{scale:s,translate:'0 '+m.ty+'px'},{scale:m.dn?1.015:.985,translate:'0 0',offset:.55},{scale:1.006,translate:'0 0',offset:.8},{scale:1,translate:'0 0'}],{duration:360,easing:'ease-out',fill:'forwards'});
   a.onfinish=()=>{m.pc.remove();m.pt.remove()}},wait)};
 z.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(e=>z.addEventListener(e,up))}
const scan=()=>document.querySelectorAll('.mk-z,#gbnav .it').forEach(wire);
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',scan);scan();

/* ---------- arrival: the lit tab in the bottom menu gives one small hop ---------- */
addEventListener('load',()=>{if(RM)return;const go=()=>{const it=document.querySelector('#gbnav .it[aria-current="page"]');if(!it||!META)return;const L=lift(it);if(!L)return;
 const a=L.pc.animate([{scale:1,translate:'0 0'},{scale:1.07,translate:'0 -6%',offset:.4},{scale:.99,translate:'0 0',offset:.72},{scale:1,translate:'0 0'}],{duration:540,easing:'ease-out'});a.onfinish=()=>{L.pc.remove();L.pt.remove()}};
 setTimeout(()=>META?go():setTimeout(go,500),420)});
})();

/* Good Boy Bobo — one shared bottom menu for every page (Home, Map, Toys, Friends, Shop, Settings).
   The bar is ChatGPT's approved Home menu art, one picture per page with that page's tile lit. */
(function(){
const me=document.currentScript,page=me.dataset.page||'',base=me.src.replace(/nav\.js.*$/,'');
const root=base.replace(/nav\/$/,'');
const V='?v=4';
// centres of each item inside the 840x191 bar art
const ITEMS=[['home','Home',91,'bovo11/index.html'],['map','Map',260,'bovo10/index.html'],['toys','Toys',421,'bovo11/toys.html'],['friends','Friends',588,'bovo11/friends.html'],['shop','Shop',751,'bovo11/shop.html']];
const art=ITEMS.some(i=>i[0]===page)?page:'none';
const css=document.createElement('style');css.textContent=`@font-face{font-family:KNun;src:url(${root}a/home/Nunito-Black.ttf)}
#gbnav{position:fixed;left:0;right:0;bottom:0;z-index:60;pointer-events:none;-webkit-user-select:none;user-select:none;font-family:KNun,system-ui}
#gbnav .bar{position:absolute;border-radius:calc(var(--k)*44px);background:linear-gradient(#fffaf0,#fff2d8 55%,#f6dfba);
 box-shadow:inset 0 0 0 calc(var(--k)*3.2px) #ffffffd0,inset 0 calc(var(--k)*5px) 0 #ffffff80,0 calc(var(--k)*8px) 0 #c9a271,0 calc(var(--k)*14px) calc(var(--k)*24px) rgba(50,25,5,.42)}
#gbnav .it{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:calc(var(--k)*34px);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform 90ms}
#gbnav .it img{width:calc(var(--k)*100px);height:calc(var(--k)*100px);object-fit:contain;-webkit-user-drag:none;filter:drop-shadow(0 calc(var(--k)*4px) calc(var(--k)*3px) rgba(80,40,0,.28))}
#gbnav .it span{font-size:calc(var(--k)*31px);line-height:1;color:#224946;margin-top:calc(var(--k)*6px);white-space:nowrap}
#gbnav .it.on{background:linear-gradient(#ff946d,#fe6f46 71%,#fd5f37);box-shadow:inset 0 0 0 calc(var(--k)*3.2px) #ffffffc8,0 calc(var(--k)*6px) 0 #b8422a,0 calc(var(--k)*8px) calc(var(--k)*14px) rgba(98,57,30,.33)}
#gbnav .it.on span{color:#fff;text-shadow:0 calc(var(--k)*3px) 0 #c2481d}
#gbnav .it.dn{transform:scale(.93)}`;
document.head.appendChild(css);
const ICON=k=>root+'v2/a/nav_'+k+'.webp?v=1';
ITEMS.forEach(i=>{const im=new Image();im.src=ICON(i[0])});
const nav=document.createElement('div');nav.id='gbnav';
const bar=document.createElement('div');bar.className='bar';nav.appendChild(bar);
function build(){const W=window.GBB_COL?GBB_COL():innerWidth,u=W/852;
 nav.style.left=(innerWidth-W)/2+'px';nav.style.right='auto';nav.style.width=W+'px';nav.style.height=(191+32+6)*u+'px';nav.style.setProperty('--k',u);
 const bx=6*u,bb=32*u;Object.assign(bar.style,{left:bx+'px',bottom:bb+'px',width:840*u+'px',height:191*u+'px'});
 nav.querySelectorAll('.it').forEach(e=>e.remove());
 ITEMS.forEach(([key,label,cx,url])=>{const on=key===page;const it=document.createElement('div');it.className='it'+(on?' on':'');it.setAttribute('role','link');it.setAttribute('aria-label',label);if(on)it.setAttribute('aria-current','page');
  Object.assign(it.style,{left:bx+(cx-78)*u+'px',width:156*u+'px',bottom:bb+16*u+'px',height:159*u+'px'});
  const im=document.createElement('img');im.src=ICON(key);im.alt='';im.draggable=false;it.appendChild(im);
  const sp=document.createElement('span');sp.textContent=label;it.appendChild(sp);
  it.addEventListener('pointerdown',()=>it.classList.add('dn'));
  ['pointerleave','pointercancel','pointerup'].forEach(e=>it.addEventListener(e,()=>it.classList.remove('dn')));
  it.addEventListener('click',()=>{if(on||nav.dataset.go)return;nav.dataset.go=1;try{window.BA&&BA.play&&BA.play('tap',{gap:60})}catch(e){}
   (window.BA&&BA.nav?BA.nav(root+url):location.href=root+url)});
  nav.appendChild(it)})}
const go=()=>{document.body.appendChild(nav);build()};
if(document.body)go();else addEventListener('DOMContentLoaded',go);
addEventListener('resize',build);addEventListener('pageshow',()=>{delete nav.dataset.go});
/* thumb swipe left/right moves between Home, Map, Toys, Friends and Shop (the app shell slides the screens) */
(function(){const idx=ITEMS.findIndex(i=>i[0]===page);if(idx<0)return;
 const css2=document.createElement('style');css2.textContent=':where(html,body,body *){touch-action:pan-y}';document.head.appendChild(css2);
 const SH=()=>{try{return parent!==window&&parent.GBB_SHELL&&parent.GBB_SHELL.swipe||null}catch(e){return null}};
 const blocked=t=>{if(window.GBB_NOSWIPE)return true;for(let e=t;e&&e.nodeType===1&&e!==document.body;e=e.parentElement){if(e.id==='gbnav')return false;
  if(e.hasAttribute('data-noswipe'))return true;const cs=getComputedStyle(e);if(cs.position==='fixed'&&(parseInt(cs.zIndex)||0)>60)return true;
  if(/(auto|scroll)/.test(cs.overflowX)&&e.scrollWidth>e.clientWidth+2)return true}return false};
 let s=null;
 const fx=()=>{try{return window.frameElement?frameElement.getBoundingClientRect().left:0}catch(e){return 0}}; // screen x of this page while it slides
 addEventListener('touchstart',e=>{s=null;if(e.touches.length!==1||window.GBB_HIDDEN||blocked(e.target))return;const t=e.touches[0];s={x:t.clientX+fx(),y:t.clientY,lock:0,tg:e.target,h:[],dx:0}},{passive:true});
 addEventListener('touchmove',e=>{if(!s)return;if(e.touches.length!==1){s=null;return}const t=e.touches[0],X=t.clientX+fx(),dx=X-s.x,dy=t.clientY-s.y;
  if(!s.lock){if(Math.abs(dx)<10&&Math.abs(dy)<10)return;if(Math.abs(dx)>Math.abs(dy)*1.2){s.lock=1;cancelTap(s.tg);s.api=SH();if(s.api&&!s.api.start(window,idx))s.api=null}else{s=null;return}}
  if(e.cancelable)e.preventDefault();const now=performance.now();s.h.push([now,X]);while(s.h.length>2&&now-s.h[0][0]>90)s.h.shift();
  s.dx=dx;if(s.api)s.api.move(dx)},{passive:false});
 const end=()=>{const c=s;s=null;if(!c||!c.lock)return;const h=c.h,v=h.length>1?(h[h.length-1][1]-h[0][1])/Math.max(1,h[h.length-1][0]-h[0][0]):0;blockClick();
  if(c.api)return c.api.end(c.dx,v);
  const W=innerWidth,dir=(c.dx<-W*.22||v<-.35)?1:(c.dx>W*.22||v>.35)?-1:0,j=ITEMS[idx+dir];
  if(dir&&j){const url=root+j[3];(window.BA&&BA.nav?BA.nav(url):location.href=url)}};
 addEventListener('touchend',end);addEventListener('touchcancel',end);
 function cancelTap(t){try{t.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true}))}catch(e){}document.querySelectorAll('.dn').forEach(x=>x.classList.remove('dn'))}
 function blockClick(){const k=e=>{e.stopPropagation();e.preventDefault()};addEventListener('click',k,true);setTimeout(()=>removeEventListener('click',k,true),350)}
})();
})();

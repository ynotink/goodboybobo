/* Good Boy Bobo — one shared bottom menu for every page (Home, Map, Toys, Friends, Shop, Settings).
   The bar is ChatGPT's approved Home menu art, one picture per page with that page's tile lit. */
(function(){
const me=document.currentScript,page=me.dataset.page||'',base=me.src.replace(/nav\.js.*$/,'');
const root=base.replace(/nav\/$/,'');
const V='?v=1';
// centres of each item inside the 840x191 bar art
const ITEMS=[['home','Home',91,'bovo11/index.html'],['map','Map',260,'bovo10/index.html'],['toys','Toys',421,'bovo11/toys.html'],['friends','Friends',588,'bovo11/friends.html'],['shop','Shop',751,'bovo11/shop.html']];
const art=ITEMS.some(i=>i[0]===page)?page:'none';
const css=document.createElement('style');css.textContent=`
#gbnav{position:fixed;left:0;right:0;bottom:0;z-index:60;pointer-events:none;-webkit-user-select:none;user-select:none}
#gbnav .barimg{position:absolute;display:block;-webkit-user-drag:none;filter:drop-shadow(0 calc(var(--k)*7px) calc(var(--k)*5px) rgba(30,16,2,.62)) drop-shadow(0 calc(var(--k)*16px) calc(var(--k)*20px) rgba(25,14,0,.38))}
#gbnav .it{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:calc(var(--k)*30px)}
#gbnav .it::after{content:'';position:absolute;inset:0;border-radius:inherit;background:rgba(60,30,0,.12);opacity:0;transition:opacity 90ms}
#gbnav .it.dn::after{opacity:1}`;
document.head.appendChild(css);
// preload every page's bar so switching pages never flashes
ITEMS.forEach(i=>{const p=new Image();p.src=root+'ui3/nav_'+i[0]+'.webp'+V});
const nav=document.createElement('div');nav.id='gbnav';
const img=new Image();img.className='barimg';img.alt='';img.draggable=false;img.src=root+'ui3/nav_'+art+'.webp'+V;nav.appendChild(img);
function build(){const W=window.GBB_COL?GBB_COL():innerWidth,u=W/852;
 nav.style.left=(innerWidth-W)/2+'px';nav.style.right='auto';nav.style.width=W+'px';nav.style.height=(191+32+6)*u+'px';nav.style.setProperty('--k',u);
 const bx=6*u,bb=32*u;Object.assign(img.style,{left:bx+'px',bottom:bb+'px',width:840*u+'px',height:191*u+'px'});
 nav.querySelectorAll('.it').forEach(e=>e.remove());
 ITEMS.forEach(([key,label,cx,url])=>{const on=key===page;const it=document.createElement('div');it.className='it';it.setAttribute('role','link');it.setAttribute('aria-label',label);if(on)it.setAttribute('aria-current','page');
  Object.assign(it.style,{left:bx+(cx-80)*u+'px',width:160*u+'px',bottom:bb+16*u+'px',height:163*u+'px'});
  it.addEventListener('pointerdown',()=>it.classList.add('dn'));
  ['pointerleave','pointercancel','pointerup'].forEach(e=>it.addEventListener(e,()=>it.classList.remove('dn')));
  it.addEventListener('click',()=>{if(on||nav.dataset.go)return;nav.dataset.go=1;try{window.BA&&BA.play&&BA.play('tap',{gap:60})}catch(e){}
   setTimeout(()=>(window.BA&&BA.nav?BA.nav(root+url):location.href=root+url),120)});
  nav.appendChild(it)})}
const go=()=>{document.body.appendChild(nav);build()};
if(document.body)go();else addEventListener('DOMContentLoaded',go);
addEventListener('resize',build);addEventListener('pageshow',()=>{delete nav.dataset.go});
})();

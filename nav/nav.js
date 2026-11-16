/* Good Boy Bobo — one shared bottom menu for every page (Home, Map, Toys, Friends, Shop, Settings). */
(function(){
const me=document.currentScript,page=me.dataset.page||'',base=me.src.replace(/nav\.js.*$/,'');
const root=base.replace(/nav\/$/,'');
const ITEMS=[['home','Home',43,171,'bovo11/index.html'],['map','Map',302,169,'bovo10/index.html'],['toys','Toys',562,166,'bovo11/toys.html'],['friends','Friends',800,205,'bovo11/friends.html'],['shop','Shop',1082,158,'bovo11/shop.html']];
const css=document.createElement('style');css.textContent=`
@font-face{font-family:NavNun;src:url(${root}a/home/Nunito-Black.ttf)}
#gbnav{position:fixed;left:0;right:0;bottom:0;z-index:60;pointer-events:none;-webkit-user-select:none;user-select:none}
#gbnav .bar{position:absolute;left:0;bottom:0;width:100%;display:block}
#gbnav .it{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}
#gbnav .ic{position:absolute;display:block;transform-origin:50% 80%;transition:transform 90ms ease-out}
#gbnav .tile{position:absolute;display:block}
#gbnav .lb{position:absolute;left:-30%;right:-30%;text-align:center;font-family:NavNun,system-ui;font-weight:900;color:#fff;line-height:1;white-space:nowrap;
 text-shadow:0 .08em 0 #0b3536,.05em 0 0 #0b3536,-.05em 0 0 #0b3536,0 -.05em 0 #0b3536,.04em .04em 0 #0b3536,-.04em .04em 0 #0b3536}
#gbnav .on .lb{color:#14605f;text-shadow:0 .06em 0 #fff6e2,.04em 0 0 #fff6e2,-.04em 0 0 #fff6e2,0 -.04em 0 #fff6e2}
#gbnav .it.dn .ic{transform:scale(.94)}
#gbnav .it.lift .ic{animation:gbLift 260ms ease-out forwards}
@keyframes gbLift{45%{transform:translateY(-10%) scale(1.07)}100%{transform:translateY(-4%) scale(1.03)}}
@media (prefers-reduced-motion: reduce){#gbnav .it.lift .ic{animation:none}}`;
document.head.appendChild(css);
const nav=document.createElement('div');nav.id='gbnav';
const bar=new Image();bar.className='bar';bar.src=base+'bar.webp?v=1';nav.appendChild(bar);
function build(){const W=innerWidth,k=W/1290;nav.style.height=346*k+'px';
 nav.querySelectorAll('.it').forEach(e=>e.remove());
 for(const [key,label,x,w,url] of ITEMS){const on=key===page;const it=document.createElement('div');it.className='it'+(on?' on':'');
  const cx=(x+w/2)*k;Object.assign(it.style,{left:(cx-129*k)+'px',width:258*k+'px',top:0,height:240*k+'px'});
  if(on){const t=new Image();t.className='tile';t.src=base+'tile.webp?v=1';Object.assign(t.style,{left:(129-113)*k+'px',top:0,width:226*k+'px',height:225*k+'px'});it.appendChild(t)}
  const ic=new Image();ic.className='ic';ic.src=base+key+'.webp?v=3';const h={home:152,map:142,toys:144,friends:142,shop:144}[key];
  Object.assign(ic.style,{left:(129-w/2)*k+'px',top:0,width:w*k+'px',height:(h+1)*k+'px'});it.appendChild(ic);
  const lb=document.createElement('div');lb.className='lb';lb.textContent=label;Object.assign(lb.style,{top:158*k+'px',fontSize:(key==='friends'?47:50)*k+'px'});it.appendChild(lb);
  let down=false;
  it.addEventListener('pointerdown',()=>{down=true;it.classList.add('dn')});
  ['pointerleave','pointercancel'].forEach(e=>it.addEventListener(e,()=>{down=false;it.classList.remove('dn')}));
  it.addEventListener('pointerup',()=>{it.classList.remove('dn')});
  it.addEventListener('click',()=>{if(on||nav.dataset.go)return;nav.dataset.go=1;it.classList.add('lift');try{window.BA&&BA.play&&BA.play('tap',{gap:60})}catch(e){}
   setTimeout(()=>location.href=root+url,140)});
  nav.appendChild(it)}}
const go=()=>{document.body.appendChild(nav);build()};
if(document.body)go();else addEventListener('DOMContentLoaded',go);
addEventListener('resize',build);addEventListener('pageshow',()=>{delete nav.dataset.go;nav.querySelectorAll('.lift').forEach(e=>e.classList.remove('lift'))});
})();

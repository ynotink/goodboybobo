/* Good Boy Bobo — lays out ChatGPT mockup pieces (cut straight from the approved mockups) on a page.
   Coordinates are in the mockup's own pixels; the block is scaled to the phone column and centred
   between the top counters and the bottom menu (scaled down if a short phone needs it). */
(function(){
const K=window.K;
K.mock=(ui,o)=>{
 const box=K.h('div','mk-box',ui);const MW=o.MW,y0=o.y0,y1=o.y1;const els=[];
 for(const p of o.parts){const im=K.h('img','mk-p'+(p.cls?' '+p.cls:''),box);im.src=o.base+p.n+'.webp?v='+(o.v||1);im.alt='';im.draggable=false;
  if(p.i!=null){im.classList.add('k-pop');im.style.setProperty('--i',p.i)}els.push([im,p])}
 const zs=[];
 for(const z of (o.zones||[])){const d=K.h('div','mk-z',box);d.setAttribute('role','button');if(z.aria)d.setAttribute('aria-label',z.aria);
  d.addEventListener('pointerdown',()=>{d.classList.add('dn');if(z.part)z.part.classList.add('dn')});
  ['pointerup','pointerleave','pointercancel'].forEach(e=>d.addEventListener(e,()=>{d.classList.remove('dn');if(z.part)z.part.classList.remove('dn')}));
  d.addEventListener('click',e=>{e.stopPropagation();try{window.BA&&BA.play&&BA.play('tap',{gap:60})}catch(_){}z.fn&&z.fn(d)});zs.push([d,z])}
 const extra=[];  // live overlays: {el,x,y,w,h}
 const lay=info=>{const CW=info.cw||innerWidth;let s=CW/MW;const top=info.top0,bot=info.navTop-8*info.wu;let H=(y1-y0)*s;
  if(H>bot-top){s*=(bot-top)/H;H=bot-top}
  const left=(CW-MW*s)/2,spare=Math.max(0,bot-top-H);
  // taller phones: share the spare room between the rows (ChatGPT drew a shorter phone)
  const rows=[...new Set(o.parts.map(p=>p.row||0))].sort((a,b)=>a-b),nr=rows.length,gap=Math.min(spare/(nr+1),(o.maxGap||28)*info.wu);
  const t=top+(spare-gap*(nr-1))/2;const off=y=>{let r=0;for(const p of o.parts)if((p.row||0)>r&&y>=p.y-2)r=Math.max(r,rows.indexOf(p.row||0));return r*gap};
  const rowOf=y=>{let best=0;for(const p of o.parts)if(y>=p.y-4)best=Math.max(best,rows.indexOf(p.row||0));return best};
  const Y=(y,row)=>(y-y0)*s+(row!=null?row:rowOf(y))*gap;
  Object.assign(box.style,{left:left+'px',top:t+'px',width:MW*s+'px',height:H+gap*(nr-1)+'px'});box.style.setProperty('--s',s);
  for(const [im,p] of els)Object.assign(im.style,{left:p.x*s+'px',top:Y(p.y,rows.indexOf(p.row||0))+'px',width:p.w*s+'px',height:p.h*s+'px'});
  for(const [d,z] of zs)Object.assign(d.style,{left:z.x*s+'px',top:Y(z.y)+'px',width:z.w*s+'px',height:z.h*s+'px',borderRadius:(z.r||20)*s+'px'});
  for(const e of extra)Object.assign(e.el.style,{left:e.x*s+'px',top:Y(e.y)+'px',width:e.w*s+'px',height:e.h*s+'px',fontSize:(e.fs||30)*s+'px'});
 };
 return {box,lay,parts:els,zones:zs,add:(el,x,y,w,h,fs)=>{box.appendChild(el);extra.push({el,x,y,w,h,fs});return el}};
};
const css=document.createElement('style');css.textContent=`
.mk-box{position:absolute;pointer-events:none}
.mk-p{position:absolute;display:block;-webkit-user-drag:none;pointer-events:none;filter:drop-shadow(0 calc(var(--s)*7px) calc(var(--s)*5px) rgba(30,16,2,.62)) drop-shadow(0 calc(var(--s)*16px) calc(var(--s)*20px) rgba(25,14,0,.38));transition:transform 90ms ease-out}
.mk-p.dn{transform:scale(.97)}
.mk-z{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mk-z::after{content:'';position:absolute;inset:0;border-radius:inherit;background:rgba(60,25,0,.14);opacity:0;transition:opacity 90ms}
.mk-z.dn::after{opacity:1}
.mk-tg{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:2}
.mk-tg img{width:100%;height:100%;display:block;-webkit-user-drag:none}
.mk-tg.nope{animation:mkNope .3s}@keyframes mkNope{25%{transform:translateX(-4%)}75%{transform:translateX(4%)}}`;
document.head.appendChild(css);
})();

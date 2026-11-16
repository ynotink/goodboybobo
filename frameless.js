/* Good Boy Bobo — frameless gameplay look: plain chapter background, code-drawn HUD and board tiles. */
(function(){
const KC=390/1290,K=1290/852,u=v=>v*K*KC+'px',p=v=>v*KC+'px';
const css=document.createElement('style');css.textContent=`
#app #tiles .tile{background:none!important;border-radius:0!important}
#app #tiles .tile::before{content:'';position:absolute;inset:3.5%;border-radius:22%;background:rgba(7,46,50,.74);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.10),inset 0 -2px 0 rgba(0,0,0,.18)}
#app #tiles .tile.a::before{background:rgba(16,70,74,.74)}
#app #tiles{filter:drop-shadow(0 6px 10px rgba(0,25,30,.35))}
.flp{position:absolute;pointer-events:none;box-sizing:border-box}
.flp.cream{background:linear-gradient(180deg,#fffaf0 0%,#fbefd6 55%,#f2e0bc 100%);border:2px solid rgba(255,255,255,.85);box-shadow:0 6px 14px rgba(0,30,35,.32),inset 0 -3px 0 rgba(170,120,60,.22)}
.flp.teal{background:linear-gradient(180deg,#1d7672 0%,#11524f 100%);border:2px solid rgba(255,246,226,.9);box-shadow:inset 0 2px 0 rgba(255,255,255,.18),0 2px 4px rgba(0,30,35,.25)}
#g2hud .pl{filter:drop-shadow(0 4px 6px rgba(0,25,30,.35))}
#plRam{filter:drop-shadow(0 5px 7px rgba(0,25,30,.35))!important}`;
document.head.appendChild(css);
function build(){const h=document.getElementById('g2hud');if(!h||!document.getElementById('plRam'))return setTimeout(build,60);if(h.dataset.fl)return;h.dataset.fl=1;
 const cv=h.querySelector('canvas'),ram=document.getElementById('plRam');
 const box=(cls,x0,y0,x1,y1,rad,before)=>{const d=document.createElement('div');d.className='flp '+cls;Object.assign(d.style,{left:u(x0),top:u(y0),width:u(x1-x0),height:u(y1-y0),borderRadius:u(rad)});h.insertBefore(d,before);return d};
 // main goals bar, moves pill, level tag (852-unit layout of the approved mockup)
 box('cream',9,213,577,393,52,h.firstChild);
 box('teal',394,230,552,352,26,ram);
 const mv=document.createElement('div');mv.className='flp';mv.textContent='Moves';Object.assign(mv.style,{left:u(394),top:u(318),width:u(158),height:u(30),display:'flex',alignItems:'center',justifyContent:'center',font:`900 ${21*K*KC}px BoboNunito,Nunito,system-ui`,color:'#fdf1d6',zIndex:2});h.appendChild(mv);
 box('teal',58,166,240,226,30,ram);
 // little ledge Rambo peeks over
 const L=box('cream',583,336,848,393,24,cv);
}
build();
// plain chapter background
const fix=()=>{const a=document.getElementById('g2skin'),b=document.getElementById('g2top');if(!a)return setTimeout(fix,50);
 const s=(a.style.backgroundImage||'').match(/bgs\/(\w+)\.webp/);const k=s?s[1]:'s02';const src=`url(bovo11/play2/plain/${k}.webp?v=1)`;a.style.backgroundImage=src;if(b)b.style.backgroundImage=src};

})();

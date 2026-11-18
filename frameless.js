/* Good Boy Bobo — frameless gameplay look: plain chapter background, code-drawn HUD and board tiles. */
(function(){
const KC=390/1290,K=1290/852,u=v=>v*K*KC+'px',p=v=>v*KC+'px';
const css=document.createElement('style');css.textContent=`
#app #tiles .tile{background:rgba(9,52,56,.80)!important;background-image:none!important}
#app #tiles .tile.a{background:rgba(17,68,72,.80)!important}
#app #tiles{filter:drop-shadow(0 0 1.5px rgba(255,246,226,.55)) drop-shadow(0 6px 10px rgba(0,25,30,.35))}
.flp{position:absolute;pointer-events:none;box-sizing:border-box}
.flp.cream{background:linear-gradient(180deg,#fffaf0 0%,#fbefd6 55%,#f2e0bc 100%);border:2px solid rgba(255,255,255,.85);box-shadow:0 6px 14px rgba(0,30,35,.32),inset 0 -3px 0 rgba(170,120,60,.22)}
.flp.teal{background:linear-gradient(180deg,#1d7672 0%,#11524f 100%);border:2px solid rgba(255,246,226,.9);box-shadow:inset 0 2px 0 rgba(255,255,255,.18),0 2px 4px rgba(0,30,35,.25)}
#g2hud .pl{filter:drop-shadow(0 4px 3px rgba(0,14,18,.6)) drop-shadow(0 9px 12px rgba(0,14,18,.4))}
#plRam{filter:drop-shadow(0 5px 7px rgba(0,25,30,.35))!important}
#rambo4{animation:r4Idle 2.6s ease-in-out infinite}
#rambo4.hop{animation:r4Hop .7s cubic-bezier(.3,1.5,.5,1)}
@keyframes r4Idle{0%,100%{transform:translateY(0) rotate(0) scale(1)}45%{transform:translateY(-1.5%) rotate(-1.2deg) scale(1.012)}}
@keyframes r4Hop{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-12%) rotate(-4deg) scale(1.06)}60%{transform:translateY(0) scale(1.04,.96)}100%{transform:translateY(0) scale(1)}}
@media (prefers-reduced-motion:reduce){#rambo4{animation:none}}`;
document.head.appendChild(css);
function build(){const h=document.getElementById('g2hud');if(!h||!document.getElementById('plRam'))return setTimeout(build,60);if(h.dataset.fl)return;h.dataset.fl=1;
 const cv=h.querySelector('canvas'),ram=document.getElementById('plRam');
 const box=(cls,x0,y0,x1,y1,rad,before)=>{const d=document.createElement('div');d.className='flp '+cls;Object.assign(d.style,{left:u(x0),top:u(y0),width:u(x1-x0),height:u(y1-y0),borderRadius:u(rad)});h.insertBefore(d,before);return d};
 // main goals bar, moves pill, level tag (852-unit layout of the approved mockup)
 const RV=new URLSearchParams(location.search).get('rv')||'art';ram.dataset.ar=0.744;
 if(RV=='art'){
  // ChatGPT raised-paw HUD (360-px reference layout, scaled to the 390-px app, lifted 12px to keep the board clear)
  const L=390/360,LY=-12,px=v=>v+'px';
  const t=new Image();t.className='flp';t.id='hud4';t.src='bovo11/play2/hud4.webp?v=1';Object.assign(t.style,{left:px(16*L),top:px(101*L+LY),width:px(328*L),height:px(328*L*724/2172),filter:'drop-shadow(0 4px 3px rgba(0,18,22,.5)) drop-shadow(0 10px 12px rgba(0,18,22,.3))'});h.insertBefore(t,h.firstChild);
  const r4=new Image();r4.className='flp';r4.id='rambo4';r4.src='bovo11/play2/rambo4.webp?v=1';Object.assign(r4.style,{left:px(237*L),top:px(76*L+LY),width:px(108*L),height:px(108*L*1190/1322),zIndex:5,transformOrigin:'72% 92%',filter:'drop-shadow(0 4px 4px rgba(0,18,22,.4))'});h.appendChild(r4);
  window.NO_RREACT=true;
  ram.style.display='none';h.dataset.art=1;
 }else if(RV=='peek'){
  // Rambo peeks over the top of one full-width bar (bar in front of him)
  const bar=box('cream',9,213,843,393,52,h.firstChild);
  h.insertBefore(ram,bar);h.insertBefore(bar,ram.nextSibling);const S=.78,bw=399*S,bh=461*S;
  Object.assign(ram.style,{left:p(1085-bw/2),top:p(352-bh+50),width:p(bw),height:p(bh),zIndex:0});bar.style.zIndex=1;
 }else if(RV=='badge'){
  box('cream',9,213,600,393,52,h.firstChild);
  const c=box('cream',606,150,846,400,120,ram);c.style.borderRadius='50%';c.style.background='radial-gradient(circle at 50% 40%,#2a8a85,#11524f)';c.style.border='5px solid #fff6e2';
  const w=document.createElement('div');w.className='flp';Object.assign(w.style,{left:u(616),top:u(160),width:u(220),height:u(220),borderRadius:'50%',overflow:'hidden'});c.after(w);
  w.appendChild(ram);const S=.82,bw=399*S;Object.assign(ram.style,{left:p(110*K-bw/2-4),top:p(-4),width:p(bw),height:p(461*S),webkitMaskImage:'none',maskImage:'none'});
 }else if(RV=='lean'){
  box('cream',9,213,843,393,52,h.firstChild);
  ram.src='bovo11/play2/rambo_lean.webp?v=2';const ww=262,hh=ww*461/399;
  Object.assign(ram.style,{left:u(722-ww/2),top:u(318-hh+44),width:u(ww),height:u(hh)});ram.style.transformOrigin='50% 90%';
 }else if(RV=='sit'){
  box('cream',9,213,612,393,52,h.firstChild);
  ram.src='bovo11/play2/rambo_sit.webp?v=1';const hh=300,ww=hh*ram.dataset.ar;
  Object.assign(ram.style,{left:u(730-ww/2),top:u(404-hh),width:u(ww),height:u(hh)});ram.style.transformOrigin='50% 100%';
  const sh=document.createElement('div');sh.className='flp';Object.assign(sh.style,{left:u(660),top:u(380),width:u(150),height:u(22),borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,20,25,.45),rgba(0,20,25,0) 70%)'});h.insertBefore(sh,ram);
 }else box('cream',9,213,577,393,52,h.firstChild);
 if(RV!='art')box('teal',394,230,552,352,26,cv);
 const mv=document.createElement('div');mv.className='flp';mv.textContent='Moves';Object.assign(mv.style,{left:u(394),top:u(318),width:u(158),height:u(30),display:'flex',alignItems:'center',justifyContent:'center',font:`900 ${21*K*KC}px BoboNunito,Nunito,system-ui`,color:'#fdf1d6',zIndex:2});if(RV!='art')h.appendChild(mv);
 if(RV!='art')box('teal',58,166,240,226,30,cv);
 // little ledge Rambo peeks over
 if(RV=='ledge')box('cream',583,336,848,393,24,cv);
 cv.style.zIndex=3;h.querySelectorAll('.flp.teal').forEach(e=>e.style.zIndex=2);mv.style.zIndex=4;
}
build();
addEventListener('gbbPraise',()=>{const r=document.getElementById('rambo4');if(!r)return;r.classList.remove('hop');void r.offsetWidth;r.classList.add('hop');setTimeout(()=>r.classList.remove('hop'),720)});
// plain chapter background
const fix=()=>{const a=document.getElementById('g2skin'),b=document.getElementById('g2top');if(!a)return setTimeout(fix,50);
 const s=(a.style.backgroundImage||'').match(/bgs\/(\w+)\.webp/);const k=s?s[1]:'s02';const src=`url(bovo11/play2/plain/${k}.webp?v=1)`;a.style.backgroundImage=src;if(b)b.style.backgroundImage=src};

})();

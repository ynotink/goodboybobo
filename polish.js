/* Good Boy Bobo — feel pass: touchable buttons, Rambo reactions, goal flights, haptics. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KC=390/1290,P='bovo11/play2/';
const ST=()=>{try{return Object.assign({vib:1},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{vib:1}}};
window.buzz=ms=>{try{if(ST().vib&&navigator.vibrate)navigator.vibrate(ms)}catch(e){}};
const snd=(n,o)=>{try{typeof fx=='function'?fx(n,o||{gap:60}):(window.BA&&BA.play(n,o||{gap:60}))}catch(e){}};
const css=document.createElement('style');css.textContent=`
.pl{position:absolute;pointer-events:none;transform-origin:50% 50%;will-change:transform}
.pl.dn{transform:scale(.97);filter:brightness(.96) drop-shadow(0 0 0 rgba(0,0,0,0));transition:transform 80ms ease-out,filter 80ms}
.pl.up{animation:plUp 180ms ease-out}
@keyframes plUp{0%{transform:scale(.97)}60%{transform:scale(1.012)}100%{transform:scale(1)}}
#plRam{transform-origin:52% 92%}
#plRam.happy{animation:rHappy .75s ease-out}
#plRam.big{animation:rBig 1.1s ease-out}
#plRam.worry{transform:rotate(-3deg);transition:transform .6s ease}
@keyframes rHappy{0%{transform:rotate(0)}25%{transform:rotate(-3deg) scale(1.02)}55%{transform:rotate(2.5deg) scale(1.02)}80%{transform:rotate(-1deg)}100%{transform:none}}
@keyframes rBig{0%{transform:none}12%{transform:scale(1.05) rotate(-4deg)}30%{transform:scale(1.06) rotate(4deg)}48%{transform:scale(1.05) rotate(-3.5deg)}66%{transform:scale(1.03) rotate(2deg)}85%{transform:rotate(-.6deg)}100%{transform:none}}
.plgfly{position:absolute;z-index:40;pointer-events:none;width:40px;height:40px;object-fit:contain}
.plbump{position:absolute;z-index:6;pointer-events:none;object-fit:contain;animation:gBump .32s ease-out forwards}
@keyframes gBump{0%{transform:scale(1)}45%{transform:scale(1.28)}100%{transform:scale(1);opacity:0}}
.plspark{position:absolute;z-index:41;pointer-events:none;width:7px;height:7px;border-radius:50%;background:#fff6c4;box-shadow:0 0 6px 2px rgba(255,220,120,.9)}
${RM?'.pl.up,#plRam.happy,#plRam.big{animation:none!important}#plRam.worry{transform:none}':''}`;
document.head.appendChild(css);
let LY=null;const hb=()=>document.getElementById('g2hud');
fetch(P+'layers.json?v=3').then(r=>r.json()).then(j=>{LY=j;build()});
const els={};
function mk(k,src,id){const b=LY[k],i=new Image();i.src=P+src+'.webp?v=6';i.className='pl';if(id)i.id=id;
 Object.assign(i.style,{left:b[0]*KC+'px',top:b[1]*KC+'px',width:b[2]*KC+'px',height:b[3]*KC+'px'});return i}
function build(){const h=hb();if(!h)return setTimeout(build,60);const cv=h.querySelector('canvas');
 els.ram=mk('rambo','rambo','plRam');h.insertBefore(els.ram,cv);
 for(let k=0;k<4;k++){els['b'+k]=mk('boost'+k,'boost'+k);h.insertBefore(els['b'+k],cv)}
 els.pause=mk('pausebtn','pausebtn');h.insertBefore(els.pause,cv);
 // press feedback on the existing tap areas (boosters are .bh in order, pause is last .h)
 const ui=document.getElementById('g2ui');const hs=[...ui.querySelectorAll('.h')];
 hs.forEach((d,i)=>{const el=i<4?els['b'+i]:els.pause;if(!el)return;press(d,el,()=>{snd('tap');buzz(8)})})}
function press(d,el,onTap){let on=false;
 const dn=()=>{on=true;el.classList.remove('up');el.classList.add('dn')};
 const up=ok=>{if(!on)return;on=false;el.classList.remove('dn');void el.offsetWidth;el.classList.add('up');if(ok&&onTap)onTap()};
 d.addEventListener('pointerdown',dn);d.addEventListener('pointerup',()=>up(true));
 ['pointerleave','pointercancel'].forEach(e=>d.addEventListener(e,()=>up(false)))}
window.plPress=press;
// ---- Rambo reactions
let busyR=0;
window.ramboReact=function(kind){const r=els.ram;if(!r||RM)return;const now=performance.now();if(kind=='happy'&&now<busyR)return;
 r.classList.remove('happy','big');void r.offsetWidth;r.classList.add(kind);busyR=now+(kind=='big'?1100:750);
 if(kind=='big'){sparkAt(1075*KC+(window.G2OFF||0)*0,300*KC,14);buzz([12,40,18])}
 setTimeout(()=>r.classList.remove(kind),kind=='big'?1150:800)};
function worry(){const r=els.ram;if(!r||typeof S=='undefined'||!S)return;r.classList.toggle('worry',S.moves>0&&S.moves<=5&&!S.over)}
const _dm=window.drawMoves;window.drawMoves=function(){_dm&&_dm.apply(this,arguments);worry()};
// ---- sparkles (cheap DOM dots)
function sparkAt(x,y,n){const app=document.getElementById('app'),off=window.G2OFF||0;
 for(let i=0;i<n;i++){const s=document.createElement('div');s.className='plspark';s.style.left=x+'px';s.style.top=(y+off)+'px';app.appendChild(s);
  const a=Math.random()*6.28,d=18+Math.random()*30;s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.2)`,opacity:0}],{duration:420+Math.random()*200,easing:'ease-out'}).onfinish=()=>s.remove()}}
// ---- goal pieces fly to the new goal icons, icon bumps on arrival
const _gh=window.goalHit;
window.goalHit=goalHit=function(k,t,cell){const g=S.goals.find(g=>g.k==k&&(k!='piece'||g.t==t)&&g.left>0);if(!g)return;
 const i=S.goals.indexOf(g);g.left--;const done=g.left==0;
 const B=window.G_BOX&&G_BOX[i];
 const arrive=()=>{drawGoals(i);if(B){bump(i,B)}if(done){ramboReact('happy');snd('star');buzz(15)}};
 if(FAST||!cell||!B||RM){arrive();return}
 const [x,y]=center(cell),off=window.G2OFF||0,tx=(B[0]+B[2]/2)*KC,ty=(B[1]+B[3]/2)*KC+off;
 const im=document.createElement('img');im.className='plgfly';im.src='a/'+goalImg(g)+'.webp';im.style.left=(x-20)+'px';im.style.top=(y-20)+'px';document.getElementById('app').appendChild(im);
 const dx=tx-x,dy=ty-y;
 im.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.45}px,${dy*.45-40}px) scale(1.1)`,offset:.45},{transform:`translate(${dx}px,${dy}px) scale(.75)`}],{duration:520,easing:'cubic-bezier(.4,0,.6,1)'}).onfinish=()=>{im.remove();arrive()};
 setTimeout(()=>{if(im.isConnected){im.remove();arrive()}},900)};
function bump(i,B){const h=hb();if(!h)return;const g=S.goals[i];const im=new Image();im.className='plbump';im.src='a/'+goalImg(g)+'.webp';
 Object.assign(im.style,{left:B[0]*KC+'px',top:B[1]*KC+'px',width:B[2]*KC+'px',height:B[3]*KC+'px'});h.appendChild(im);setTimeout(()=>im.remove(),340)}
// ---- special combinations: brief anticipation, then a bigger Rambo reaction
if(typeof special2=='function'){const _s2=special2;window.special2=special2=async function(ca,cb,pa,pb){
 if(pa&&pb&&pa.sp&&pb.sp&&!FAST&&!RM){[pa,pb].forEach(p=>p.el&&p.el.animate([{filter:'brightness(1)',scale:'1'},{filter:'brightness(1.6)',scale:'1.15'}],{duration:170,fill:'forwards'}));buzz(10);await new Promise(r=>setTimeout(r,170));ramboReact('big')}
 return _s2.apply(this,arguments)}}
if(typeof fire=='function'){const _f=fire;window.fire=fire=async function(p,cell,o){if(p&&p.sp=='rainbow')ramboReact('big');else if(p&&p.sp=='bomb')buzz(14);return _f.apply(this,arguments)}}
// stop when hidden
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('hid',document.hidden)});
})();

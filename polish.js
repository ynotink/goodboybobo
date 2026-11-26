/* Good Boy Bobo — feel pass: touchable buttons, Rambo reactions, goal flights, haptics. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KC=390/1290,P='bovo11/play2/';
const ST=()=>{try{return Object.assign({vib:1},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{vib:1}}};
const BZ=ms=>Array.isArray(ms)?ms.map((v,i)=>i%2?v:Math.min(60,v*2)):Math.min(60,ms*2);   // phone haptics: short taps were too faint
window.buzz=ms=>{try{if(ST().vib&&navigator.vibrate)navigator.vibrate(BZ(ms))}catch(e){}};
// gameplay haptics: each kind of moment has its own feel, stronger for the more dramatic ones.
// On the iPhone app with rich haptics: real textured feels. Elsewhere: simple buzz patterns.
const RICH=()=>!!(window.webkit&&webkit.messageHandlers&&webkit.messageHandlers.haptic2);
const HT=(at,i,s)=>({at,i,s}),HC=(at,dur,i,s)=>({at,dur,i,s}),HP=(...e)=>({t:'pattern',events:e});
const HF={
 swap:[{t:'impact',style:'light'},6],                                        // moving a piece: small tap
 bad:[HP(HT(0,.5,.3),HT(.09,.5,.3)),[6,70,6]],                               // no match: two soft bumps
 match:[HP(HT(0,1,.45),HC(0,.07,.85,.3)),30],                                  // a match: crisp strong pop
 crate:[HP(HT(0,1,.8),HT(.035,.85,.8),HT(.07,.7,.8),HC(0,.09,.6,.6)),[10,15,10]],               // crate breaking: crunch
 dirt:[{t:'impact',style:'soft',i:.9},12],                                   // mud/dirt: soft thud
 leash:[{t:'impact',style:'rigid',i:.8},10],                                 // leash snap
 striped:[HP(HT(0,1,.7),HC(0,.25,1,.55)),60],                             // row/column blast: zip
 flyer:[HP(HC(0,.2,.6,.8),HT(.22,1,.5),HC(.22,.1,.9,.3)),[30,60,30]],                        // flyer: whoosh then hit
 bomb:[HP(HT(0,1,.1),HC(0,.35,1,.08),HT(.12,1,.2),HC(.35,.2,.6,.05)),[120,30,60]],                                 // bomb: deep thump
 rainbow:[HP(HC(0,.15,.5,.3),HC(.15,.15,.85,.4),HC(.3,.3,1,.5),HT(.6,1,.6),HC(.6,.2,1,.3)),[80,20,100,20,200]],   // rainbow ball: swell
 mega:[HP(HT(0,1,.3),HC(0,.5,1,.15),HT(.25,1,.5),HT(.5,1,.6),HC(.5,.25,.8,.1)),[150,30,150]],             // two specials together: big rumble
 goal:[{t:'note',kind:'success'},[15,60,25]],                                // a goal finished
 lowmoves:[{t:'note',kind:'warning'},[25,80,25]],                            // 5 moves left
 win:[HP(HT(0,.6,.8),HT(.1,.7,.8),HT(.2,.8,.8),HC(.3,.35,1,.3)),[10,80,12,80,15,80,300]],          // level clear
 lose:[HP(HC(0,.25,.6,.1),HC(.3,.4,.3,.05)),[200,80,300]]};                  // out of moves: sad droop
const hLast={};
window.hap=function(k,combo){try{if(!ST().vib)return;const f=HF[k];if(!f)return;const now=performance.now();if(now-(hLast[k]||0)<70)return;hLast[k]=now;
 let r=f[0];
 if(k=='match'&&combo>=2){const n=Math.min(5,combo);r=HP(...Array.from({length:n},(_,j)=>HT(j*.06,1,.4+j*.1)),HC(0,.06*n,.9,.3))}   // cascades climb
 if(RICH())webkit.messageHandlers.haptic2.postMessage(r);else if(navigator.vibrate)navigator.vibrate(f[1])}catch(e){}};
if(typeof window.snd=='function'){const _snd=window.snd;window.snd=function(kind,v){try{
 if(kind=='swap')hap('swap');else if(kind=='bad')hap('bad');else if(kind=='pop')hap('match',v|0);else if(kind=='boom')hap('bomb');else if(kind=='tap')buzz(6)}catch(e){}
 return _snd.apply(this,arguments)}}
if(typeof window.fx=='function'){const _fx=window.fx;const FM={bomb:'bomb',rainbow:'rainbow',striped:'striped',swap:'flyer',crate:'crate',dirt:'dirt',leash:'leash',mega:'mega',win:'win',lose:'lose',lowmoves:'lowmoves'};
 window.fx=function(name){try{if(FM[name])hap(FM[name])}catch(e){}return _fx.apply(this,arguments)}}
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
function mk(k,src,id){const b=LY[k],i=new Image();i.src=P+src+'.webp?v=7';i.className='pl';if(id)i.id=id;
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
 if(kind=='big'){sparkAt(1075*KC+(window.G2OFF||0)*0,300*KC,14);}
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
 const arrive=()=>{drawGoals(i);if(B){bump(i,B)}if(done){ramboReact('happy');snd('star');hap('goal')}};
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
if(typeof fire=='function'){const _f=fire;window.fire=fire=async function(p,cell,o){if(p&&p.sp=='rainbow')ramboReact('big');return _f.apply(this,arguments)}}
// stop when hidden
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('hid',document.hidden)});
})();

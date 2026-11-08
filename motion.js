/* Good Boy Bobo — app-wide motion (Phase 1): screen in/out transitions, springy button presses,
   PLAY breathing + light sweep, counters/panels popping in, springy pop-ups, idle bob on shortcut buttons.
   Pure CSS/Web Animations: sharp at any size. Respects reduced motion. Turn off with ?fx=0. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('fx')==='0')RM=true;
const css=`
html.fx-pre #app{opacity:0}
html.fx-in #app{animation:fxAppIn .42s cubic-bezier(.2,.8,.2,1) both}
@keyframes fxAppIn{from{opacity:0;filter:brightness(1.08)}to{opacity:1;filter:none}}
.fx-rise{animation:fxRise .55s cubic-bezier(.2,1.25,.35,1) both}
@keyframes fxRise{from{opacity:0;translate:0 18px;scale:.94}to{opacity:1;translate:0 0;scale:1}}
.fx-drop{animation:fxDrop .6s cubic-bezier(.2,1.3,.35,1) both}
@keyframes fxDrop{from{opacity:0;translate:0 -22px;scale:.9}to{opacity:1;translate:0 0;scale:1}}
.fx-pop{animation:fxPop .5s cubic-bezier(.2,1.5,.4,1) both}
@keyframes fxPop{from{opacity:0;scale:.6}to{opacity:1;scale:1}}
html.fx-out #app{animation:fxAppOut .3s ease-in both}
@keyframes fxAppOut{to{opacity:0;scale:.985;filter:brightness(1.06)}}
.fx-press{transition:scale .09s ease-out!important;scale:.93}
.fx-breathe{animation:fxBreathe 2.6s ease-in-out infinite}
@keyframes fxBreathe{0%,100%{scale:1}50%{scale:1.035}}
.fx-shine{position:absolute;pointer-events:none;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;z-index:6}
.fx-shine::after{content:'';position:absolute;top:-10%;bottom:-10%;width:38%;left:-60%;
 background:linear-gradient(100deg,transparent 0,rgba(255,255,255,.0) 20%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 80%,transparent);
 animation:fxSweep 3.6s ease-in-out infinite;animation-delay:var(--d,1.2s)}
@keyframes fxSweep{0%{left:-60%}35%{left:130%}100%{left:130%}}
.fx-bob{animation:fxBob 3.2s ease-in-out infinite}
@keyframes fxBob{0%,100%{translate:0 0}50%{translate:0 -4px}}
.gnav .it.on img{animation:fxTab 2.4s ease-in-out infinite}
@keyframes fxTab{0%,100%{translate:0 0;rotate:0deg}30%{translate:0 -3px;rotate:-4deg}60%{translate:0 0;rotate:3deg}}
.gtoast{transition:opacity .25s,scale .35s cubic-bezier(.2,1.5,.4,1)!important;scale:.85}.gtoast.on{scale:1}
`;
if(RM){/* keep only the gentle press so taps still feel responsive */}
const st=document.createElement('style');st.textContent=RM?'.fx-press{scale:.95}':css;document.head.appendChild(st);
if(!RM&&!document.body)document.documentElement.classList.add('fx-pre');
function stagger(list,cls,start,step){list.forEach((el,i)=>{if(!el)return;el.style.animationDelay=(start+i*step)+'ms';el.classList.add(cls);
  el.addEventListener('animationend',function f(e){if(e.target===el&&e.animationName.startsWith('fx')&&cls!=='fx-breathe'){el.classList.remove(cls);el.style.animationDelay='';el.removeEventListener('animationend',f)}})})}
function enter(){
 const H=document.documentElement;H.classList.remove('fx-pre');if(RM)return;H.classList.add('fx-in');
 const A=document.getElementById('app');if(!A||getComputedStyle(A).display==='contents')document.body.animate([{opacity:0},{opacity:1}],{duration:420,easing:'ease-out'});
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 stagger($$('.ghud .cnt, .ghud .gear'),'fx-drop',80,60);
 const RF=window.ROOMFX;
 if(!RF)stagger([$('.ttlimg'),$('#logo')].filter((x,i,a)=>x&&a.indexOf(x)===i),'fx-pop',140,0);
 if(!RF)stagger($$('#app > .gl, #hero, #pn, .card.gl, #bnd, #bones .row').slice(0,10),'fx-rise',200,55);
 stagger($$('.qb'),'fx-pop',300,80);
 stagger([$('#lv')],'fx-pop',420,0);
 stagger([$('.gnav')],'fx-rise',160,0);
 const play=$('#play');if(play){play.style.opacity=0;setTimeout(()=>{play.style.opacity='';play.animate([{scale:.6,opacity:0},{scale:1.08,opacity:1,offset:.6},{scale:1}],{duration:520,easing:'cubic-bezier(.2,1,.4,1)'}).onfinish=()=>{
   play.classList.add('fx-breathe');addShine(play)}},460)}
 $$('.qb').forEach((q,i)=>setTimeout(()=>{q.classList.add('fx-bob');q.style.animationDelay=(i*.45)+'s'},1200));
 // the big green buy buttons in the Shop get the light sweep too
 if(!RF)$$('#bnd .buy').forEach(b=>setTimeout(()=>addShine(b,'2.2s'),900));
}
function addShine(img,delay){if(RM||!img.complete){img.addEventListener('load',()=>addShine(img,delay),{once:true});return}
 const s=document.createElement('div');s.className='fx-shine';const r=img.getBoundingClientRect(),p=img.offsetParent;if(!p)return;
 const sync=()=>{s.style.left=img.offsetLeft+'px';s.style.top=img.offsetTop+'px';s.style.width=img.offsetWidth+'px';s.style.height=img.offsetHeight+'px';
  const cs=getComputedStyle(img);s.style.transform=cs.transform==='none'?'':cs.transform;s.style.translate=cs.translate;s.style.scale=cs.scale};
 s.style.webkitMaskImage=s.style.maskImage=`url(${img.getAttribute('src')})`;if(delay)s.style.setProperty('--d',delay);
 img.after(s);sync();(function loop(){sync();requestAnimationFrame(loop)})()}
// springy press on every button
const PRESS='.tap,.imgbtn,.bimg,.bst,#pz,.qb,.gnav .it,.cnt';
addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest(PRESS);if(!el)return;el.classList.add('fx-press');
 const up=()=>{el.classList.remove('fx-press');if(!RM)el.animate([{scale:.93},{scale:1.06},{scale:.99},{scale:1}],{duration:340,easing:'ease-out'});removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
 addEventListener('pointerup',up);addEventListener('pointercancel',up)},true);
// leaving a screen: quick fade (works with the audio fade in BA.nav)
window.FX={out(){if(RM)return;document.documentElement.classList.add('fx-out');const A=document.getElementById('app');if(!A||getComputedStyle(A).display==='contents')document.body.animate([{opacity:1},{opacity:0}],{duration:280,fill:'forwards'})},addShine};
addEventListener('pageshow',e=>{if(e.persisted){document.documentElement.classList.remove('fx-out')}});
if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>requestAnimationFrame(enter));else requestAnimationFrame(enter);
})();

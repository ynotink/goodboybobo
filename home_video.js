/* Good Boy Bobo — Home motion via a looping painted video layer (Seedance 2.5, from the approved Home art).
   Layer order: static painting (.gbg) -> looping video (backyard + Rambo) -> logo (+ paw blink) -> live UI.
   The video is aligned to the painting so the scene doesn't jump; the static Rambo image stays as the fallback.
   Off: ?motion=0. Reduced motion (system or gbb_settings.motion===0) keeps the still screen. */
(function(){
const Q=new URLSearchParams(location.search);
const reduced=()=>{try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return true;return JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){return false}};
// alignment of the 720x1280 video to the 390x844 Home layout (measured from the source art)
const V={left:-0.61,top:4.95,w:392,h:696.9};
function init(){
 if(Q.get('motion')==='0'||reduced())return;
 const app=document.getElementById('app'),gbg=app.querySelector('.gbg'),rambo=document.getElementById('rambo'),logo=document.getElementById('logo');
 const v=document.createElement('video');
 Object.assign(v,{muted:true,loop:true,playsInline:true,autoplay:true,preload:'auto'});
 v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('disablepictureinpicture','');
 v.src='a/motion/home_seam.mp4?v=6';
 v.style.cssText=`position:absolute;left:${V.left}px;top:${V.top}px;width:${V.w}px;height:${V.h}px;object-fit:fill;pointer-events:none;opacity:0;transition:opacity .35s;
  -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 6px,#000 calc(100% - 40px),transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 6px,#000 calc(100% - 40px),transparent 100%)`;
 v.className='hm_video';gbg.after(v);const L=window.SeamLoop?SeamLoop(v):null;
 const show=()=>{v.style.opacity=1;rambo.style.visibility='hidden'};
 v.addEventListener('playing',show,{once:true});
 const tryPlay=()=>{if(L){L.play();return}const p=v.play();if(p&&p.catch)p.catch(()=>{})};const stop=()=>L?L.pause():v.pause();
 tryPlay();addEventListener('pointerdown',tryPlay,{once:true,capture:true});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():tryPlay());
 addEventListener('pagehide',stop);addEventListener('pageshow',e=>{if(e.persisted)tryPlay()});
 // logo paw blink (separate overlay; the logo itself is never altered)
 const lw=216,ls=lw/765,lx=195-lw/2,ly=112;
 const ov=document.createElement('img');ov.src='a/motion/logo_blink.webp';ov.className='hm_logoblink';
 ov.style.cssText=`position:absolute;left:${lx+222*ls}px;top:${ly+142*ls}px;width:${130*ls}px;height:${126*ls}px;pointer-events:none;clip-path:inset(0 0 100% 0)`;
 logo.after(ov);
 const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
 let next=performance.now()+3000+Math.random()*1500,start=-1;
 (function tick(now){if(!document.hidden){if(start<0&&now>next)start=now;
   if(start>=0){const u=(now-start)/220;const lb=u<.38?ss(0,.38,u):u<.55?1:1-ss(.55,1,u);ov.style.clipPath=`inset(0 0 ${(100-lb*100).toFixed(1)}% 0)`;
    if(u>1){start=-1;ov.style.clipPath='inset(0 0 100% 0)';next=now+5000+Math.random()*5000}}}
  requestAnimationFrame(tick)})(performance.now());
 window.HOME_VIDEO={video:v,align:V};
}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',init);else init();
})();

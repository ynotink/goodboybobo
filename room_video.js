/* Good Boy Bobo — living room backgrounds: a seamless painted video loop (Seedance 2.5, made from the
   room's own art) laid exactly over the still painting, behind all the UI. The still stays as the fallback.
   Off: ?motion=0. Reduced motion (system or gbb_settings.motion===0) keeps the still room. */
(function(){
const Q=new URLSearchParams(location.search);
const reduced=()=>{try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return true;return JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){return false}};
// room art is 1170x2884 drawn at 390 wide from the top; the loop covers its top 1170x2080 (9:16)
const V={left:0,top:0,w:390,h:693.33};
function init(){
 const room=document.body.dataset.room;if(!room||Q.get('motion')==='0'||reduced())return;
 const gbg=document.querySelector('#app .gbg');if(!gbg)return;
 const v=document.createElement('video');
 Object.assign(v,{muted:true,loop:true,playsInline:true,autoplay:true,preload:'auto'});
 v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('disablepictureinpicture','');
 v.src=`a/motion/${room}_seam.mp4`;
 v.style.cssText=`position:absolute;left:${V.left}px;top:${V.top}px;width:${V.w}px;height:${V.h}px;object-fit:fill;pointer-events:none;opacity:0;transition:opacity .4s;
  -webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 70px),transparent 100%);mask-image:linear-gradient(to bottom,#000 calc(100% - 70px),transparent 100%)`;
 v.className='room_video';gbg.after(v);const L=window.SeamLoop?SeamLoop(v):null;
 v.addEventListener('playing',()=>v.style.opacity=1,{once:true});
 const tryPlay=()=>{if(L){L.play();return}const p=v.play();if(p&&p.catch)p.catch(()=>{})};const stop=()=>L?L.pause():v.pause();
 tryPlay();addEventListener('pointerdown',tryPlay,{once:true,capture:true});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():tryPlay());
 addEventListener('pagehide',stop);addEventListener('pageshow',e=>{if(e.persisted)tryPlay()});
}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',init);else init();
})();

/* Good Boy Bobo — Home: one living video of the whole approved scene (Higgsfield Kling 3.0 4K, first frame = last frame = the
   approved painting, so it starts exactly like the still and loops seamlessly). Everyone stays in place; nothing is cut out.
   The approved painting shows underneath until the video is playing, and stays if a phone can't play it. */
(function(){
const DIR='live/',V='?v=8';
const stage=document.getElementById('stage');if(!stage)return;
const root=document.createElement('div');root.style.cssText='position:absolute;inset:0;overflow:hidden;pointer-events:none';stage.insertBefore(root,stage.firstChild);
const still=new Image();still.decoding='async';still.src=DIR+'home_still.jpg'+V;still.alt='';still.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block';root.appendChild(still);
const oldCv=document.getElementById('gl');if(oldCv)oldCv.style.display='none';
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(RM)return;
const v=document.createElement('video');v.src=DIR+'home_scene.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.autoplay=true;v.preload='auto';v.className='scene';
for(const a of ['muted','playsinline','webkit-playsinline','autoplay','loop'])v.setAttribute(a,'');
v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;opacity:0';root.appendChild(v);
const on=()=>{v.style.opacity=1};v.addEventListener('playing',on);v.addEventListener('loadeddata',on);
const kick=()=>{if(v.paused&&!document.hidden&&!window.GBB_HIDDEN){const p=v.play();p&&p.catch&&p.catch(()=>{})}};
kick();v.addEventListener('canplay',kick);setInterval(kick,250);addEventListener('pointerdown',kick,{passive:true});document.addEventListener('visibilitychange',kick);
window.GBB_HOME_VIDEO=v;
})();

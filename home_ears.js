/* Good Boy Bobo — Rambo's ears pass in front of the "BOBO" logo on the Home screen.
   A small canvas above the logo redraws just Rambo's head/ears straight from the playing video, every frame,
   cut out with a per-frame mask (a/motion/home_ears_mask.png). Pixels come from the video itself,
   so color and motion match exactly; only the stacking order changes. */
(function(){
function start(){
 const HV=window.HOME_VIDEO;if(!HV||!HV.loop)return;
 fetch('a/motion/home_ears.json?v='+(window.GBB_BUILD||0)).then(r=>r.json()).then(J=>{
  const mask=new Image();mask.src='a/motion/home_ears_mask.png?v='+(window.GBB_BUILD||0);
  mask.onload=()=>go(HV,J,mask)}).catch(()=>{})}
function go(HV,J,mask){
 const V=HV.align,s=V.w/1080,app=document.getElementById('app');
 const cv=document.createElement('canvas'),dpr=Math.min(3,(window.devicePixelRatio||2))*1.0;
 const cw=Math.round(J.w*s*dpr),ch=Math.round(J.h*s*dpr);cv.width=cw;cv.height=ch;
 cv.style.cssText=`position:absolute;left:${V.left+J.x0*s}px;top:${V.top+J.y0*s}px;width:${J.w*s}px;height:${J.h*s}px;pointer-events:none;opacity:0;transition:opacity .3s`;
 cv.className='hm_ears';(HV.logoOverlay||document.getElementById('logo')).after(cv);
 const g=cv.getContext('2d');
 function draw(v,t){
  if(v.style.opacity==='0'||v.readyState<2)return;
  const f=Math.max(0,Math.min(J.n-1,Math.round(t*J.fps))),col=f%J.cols,row=(f/J.cols)|0;
  g.globalCompositeOperation='source-over';g.clearRect(0,0,cw,ch);
  g.drawImage(v,J.x0,J.y0,J.w,J.h,0,0,cw,ch);
  g.globalCompositeOperation='destination-in';
  g.drawImage(mask,col*J.hw,row*J.hh,J.hw,J.hh,0,0,cw,ch);
  cv.style.marginTop=v.style.marginTop;
  if(cv.style.opacity!=='1')cv.style.opacity='1'}
 const els=HV.loop.els;
 if(typeof els[0].requestVideoFrameCallback==='function'){
  els.forEach(v=>{const cb=(now,meta)=>{draw(v,meta.mediaTime);v.requestVideoFrameCallback(cb)};v.requestVideoFrameCallback(cb)})}
 else{(function tick(){const v=HV.loop.current;draw(v,v.currentTime);requestAnimationFrame(tick)})()}
}
if(document.readyState==='complete')setTimeout(start,50);else addEventListener('load',()=>setTimeout(start,50));
})();

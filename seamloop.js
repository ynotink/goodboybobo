/* Good Boy Bobo — truly seamless video loops on iPhone.
   iPhones freeze for a moment whenever a video restarts (both with <video loop> and when a second video
   is told to start), which shows as a jump. Fix:
   - each clip file is [last 1.5 s of the loop] + [the full loop], so it has a "run-up";
   - two copies take turns. 1.5 s before the visible one ends, the hidden one starts its run-up, which
     shows the very same frames. Any startup delay happens while it is still hidden;
   - the hidden one quietly speeds up or slows down a touch until it is exactly in step,
     then they swap with a short soft fade. The restart is never on screen.
   - iPhones start the hidden copy late (often 0.3-1 s). The loop measures that delay, starts the copy that far
     in next time, and remembers it on the phone, so the hand-off lands on the same frame. */
window.SeamLoop=function(a,opt){
 opt=opt||{};const L=opt.lead||1.5;          // run-up length in seconds (36 frames at 24fps)
 a.loop=false;a.removeAttribute('loop');
 const b=a.cloneNode(true);b.autoplay=false;b.removeAttribute('autoplay');b.muted=true;b.loop=false;
 b.style.opacity='0';b.style.transition='none';a.after(b);
 let cur=a,nxt=b,playing=false,phase='solo',raf=0,D=0,lat=0;   // lat: how late this phone starts the hidden copy (learned each loop, remembered on the phone)
 try{lat=Math.max(0,Math.min(L*.9,+localStorage.getItem('gbb_vlat')||0))}catch(e){}
 a.style.zIndex='1';b.style.zIndex='2';
 const play=v=>{try{const p=v.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}};
 const park=v=>{v.pause();v.playbackRate=1;v._m=0;try{v.currentTime=0}catch(e){}};
 // where in the loop a copy is (0..D), from its file time
 const pos=v=>{let p=v.currentTime-L;return((p%D)+D)%D};
 const diff=(x,y)=>{let d=x-y;if(d>D/2)d-=D;if(d<-D/2)d+=D;return d};
 function swap(){const o=cur,n=nxt;
  n.playbackRate=1;o.style.transition='none';n.style.transition='opacity .25s linear';   // soft hand-off: any tiny gap is hidden
  n.style.zIndex='2';o.style.zIndex='1';n.style.opacity=o.style.opacity||'1';
  cur=n;nxt=o;phase='solo';setTimeout(()=>{o.style.opacity='0';park(o)},300)}
 function tick(){raf=requestAnimationFrame(tick);if(!playing)return;
  if(!(cur.duration>L))return;D=cur.duration-L;
  const t=cur.currentTime,end=cur.duration;
  if(phase==='solo'&&t>=end-L+0.02&&nxt.readyState>=2){phase='lead';nxt.playbackRate=1;try{nxt.currentTime=Math.min(L*.9,lat)}catch(e){}play(nxt)}   // start ahead by the phone's usual delay
  else if(phase==='lead'){
   if(nxt.paused||nxt.currentTime<0.02){                                 // still starting up (hidden)
    if(cur.ended){park(nxt);phase='solo';try{cur.currentTime=L}catch(e){}play(cur)}   // never started: keep looping the visible one
    return}
   const d=diff(pos(cur),pos(nxt));                                       // >0: hidden copy is behind
   if(!nxt._m){nxt._m=1;lat=Math.max(0,Math.min(L*.9,lat+d));try{localStorage.setItem('gbb_vlat',lat.toFixed(3))}catch(e){}}             // learn this phone's start delay for next time
   if(Math.abs(d)<0.04||cur.ended||t>=end-0.12){nxt._m=0;swap();return}
   nxt.playbackRate=Math.max(.75,Math.min(1.35,1+d*2))}
  else if(cur.ended){try{cur.currentTime=L}catch(e){}play(cur)}             // safety
  else if(cur.paused&&!document.hidden&&!window.GBB_HIDDEN)play(cur);       // stalled (e.g. iPhone dropped it): start it again
 }
 b.addEventListener('loadeddata',()=>{try{b.currentTime=0}catch(e){}},{once:true});
 return{
  play(){playing=true;play(cur);if(!raf)raf=requestAnimationFrame(tick)},
  pause(){playing=false;a.pause();b.pause()},
  get current(){return cur},get lat(){return lat},els:[a,b]};
};

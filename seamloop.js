/* Good Boy Bobo — truly seamless video loops on iPhone.
   iPhones freeze for a moment whenever a video restarts (both with <video loop> and when a second video
   is told to start), which shows as a jump. Fix:
   - each clip file is [last 1.5 s of the loop] + [the full loop], so it has a "run-up";
   - two copies take turns. 1.5 s before the visible one ends, the hidden one starts its run-up, which
     shows the very same frames. Any startup delay happens while it is still hidden;
   - the hidden one quietly speeds up or slows down a touch until it is exactly in step,
     then they swap on the same frame. The restart is never on screen. */
window.SeamLoop=function(a,opt){
 opt=opt||{};const L=opt.lead||1.5;          // run-up length in seconds (36 frames at 24fps)
 a.loop=false;a.removeAttribute('loop');
 const b=a.cloneNode(true);b.autoplay=false;b.removeAttribute('autoplay');b.muted=true;b.loop=false;
 b.style.opacity='0';b.style.transition='none';a.after(b);
 let cur=a,nxt=b,playing=false,phase='solo',raf=0,D=0;
 const play=v=>{try{const p=v.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}};
 const park=v=>{v.pause();v.playbackRate=1;try{v.currentTime=0}catch(e){}};
 // where in the loop a copy is (0..D), from its file time
 const pos=v=>{let p=v.currentTime-L;return((p%D)+D)%D};
 const diff=(x,y)=>{let d=x-y;if(d>D/2)d-=D;if(d<-D/2)d+=D;return d};
 function swap(){const o=cur,n=nxt;
  n.playbackRate=1;n.style.transition=o.style.transition='none';
  n.style.opacity=o.style.opacity||'1';o.style.opacity='0';
  cur=n;nxt=o;phase='solo';setTimeout(()=>park(o),120)}
 function tick(){raf=requestAnimationFrame(tick);if(!playing)return;
  if(!(cur.duration>L))return;D=cur.duration-L;
  const t=cur.currentTime,end=cur.duration;
  if(phase==='solo'&&t>=end-L+0.02&&nxt.readyState>=2){phase='lead';nxt.playbackRate=1;play(nxt)}
  else if(phase==='lead'){
   if(nxt.paused||nxt.currentTime<0.05){if(cur.ended)swap();return}      // still starting up (hidden)
   const d=diff(pos(cur),pos(nxt));                                       // >0: hidden copy is behind
   if(Math.abs(d)<0.03||cur.ended||t>=end-0.06){swap();return}
   nxt.playbackRate=Math.max(.8,Math.min(1.25,1+d*1.5))}
  else if(cur.ended){try{cur.currentTime=L}catch(e){}play(cur)}             // safety
 }
 b.addEventListener('loadeddata',()=>{try{b.currentTime=0}catch(e){}},{once:true});
 return{
  play(){playing=true;play(cur);if(!raf)raf=requestAnimationFrame(tick)},
  pause(){playing=false;a.pause();b.pause()},
  get current(){return cur},els:[a,b]};
};

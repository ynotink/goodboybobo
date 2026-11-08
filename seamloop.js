/* Good Boy Bobo — truly seamless video loops on iPhone.
   iPhones pause for a split second when a <video loop> restarts, which shows as a jump.
   Fix: two copies of the same video. While one plays, the other waits on frame 1; just before the
   end, the waiting one starts and takes over on the exact frame, so the restart is never seen. */
window.SeamLoop=function(a,fps){
 fps=fps||24;const LEAD=1.5/fps;
 a.loop=false;a.removeAttribute('loop');
 const b=a.cloneNode(true);b.autoplay=false;b.removeAttribute('autoplay');b.muted=true;b.loop=false;b.style.opacity='0';b.style.transition='none';
 a.after(b);
 let cur=a,nxt=b,playing=false,swapping=false,gen=0;
 const rvfc=v=>typeof v.requestVideoFrameCallback==='function';
 const play=v=>{try{const p=v.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}};
 function watch(){const g=++gen;
  const tick=(now,meta)=>{if(g!==gen||!playing)return;
   const t=meta&&meta.mediaTime!=null?meta.mediaTime:cur.currentTime,d=cur.duration;
   if(d&&!swapping&&t>=d-LEAD){swap();return}
   rvfc(cur)?cur.requestVideoFrameCallback(tick):requestAnimationFrame(()=>tick())};
  rvfc(cur)?cur.requestVideoFrameCallback(tick):requestAnimationFrame(()=>tick())}
 function swap(){swapping=true;const n=nxt,o=cur;let done=false;
  const show=()=>{if(done)return;done=true;
   n.style.transition=o.style.transition='none';n.style.opacity=o.style.opacity||'1';o.style.opacity='0';
   cur=n;nxt=o;swapping=false;
   setTimeout(()=>{o.pause();try{o.currentTime=0}catch(e){}},80);
   watch()};
  if(rvfc(n))n.requestVideoFrameCallback(()=>show());else n.addEventListener('playing',show,{once:true});
  setTimeout(show,250);   // safety: never get stuck
  play(n)}
 // if the end is ever reached without a swap (slow phone), restart instantly
 [a,b].forEach(v=>v.addEventListener('ended',()=>{if(v===cur&&!swapping){if(nxt.readyState>=2)swap();else{v.currentTime=0;play(v)}}}));
 // keep the waiting copy parked on its first frame
 b.addEventListener('loadeddata',()=>{try{b.currentTime=0}catch(e){}},{once:true});
 return{
  play(){playing=true;play(cur);watch()},
  pause(){playing=false;gen++;a.pause();b.pause()},
  get current(){return cur},els:[a,b]};
};

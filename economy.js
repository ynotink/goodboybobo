/* Good Boy Bobo — economy: lives (hearts) and bones.
   5 lives max, one comes back every 30 minutes. Failing or quitting a level costs a life.
   Bones are earned by winning and spent on +5 moves, life refills and boosters. Saved in 'gbb' (and boosters in 'gbb_play'). */
(function(){
const MAX=5,REFILL=30*60*1000,START_BONES=430;
// tester notes (Nov 22): bones should feel valuable. Wins pay 5-10, so refills and boosters cost real saving up.
const PRICE={moves:90,lives:300,boost:[120,150,200,130],win:[5,7,10]};
const rd=()=>{try{return JSON.parse(localStorage.getItem('gbb')||'{}')}catch(e){return{}}};
const wr=g=>{try{localStorage.setItem('gbb',JSON.stringify(g))}catch(e){}};
function state(){const g=rd();if(g.hearts==null)g.hearts=MAX;if(g.bones==null)g.bones=START_BONES;
 // refill lives that have come back while away
 if(g.hearts<MAX){const now=Date.now();if(!g.heartAt)g.heartAt=now;const n=Math.floor((now-g.heartAt)/REFILL);
  if(n>0){g.hearts=Math.min(MAX,g.hearts+n);g.heartAt=g.hearts>=MAX?null:g.heartAt+n*REFILL}}else g.heartAt=null;
 wr(g);return g}
const listeners=[];const changed=()=>{const g=state();listeners.forEach(f=>{try{f(g)}catch(e){}})};
const E=window.Eco={MAX,PRICE,
 movesPrice:n=>PRICE.moves*Math.pow(2,Math.min(n,4)),   // +5 moves: 90, then 180, 360... within one try
 winBones:stars=>PRICE.win[Math.max(1,Math.min(3,stars))-1],
 hearts:()=>state().hearts,bones:()=>state().bones,
 nextIn:()=>{const g=state();return g.hearts>=MAX?0:Math.max(0,g.heartAt+REFILL-Date.now())},
 fmt:ms=>{const s=Math.ceil(ms/1000),m=Math.floor(s/60);return m+':'+String(s%60).padStart(2,'0')},
 loseHeart(){const g=state();if(g.hearts>0){if(g.hearts>=MAX)g.heartAt=Date.now();g.hearts--}wr(g);changed()},
 refillHearts(){const g=state();g.hearts=MAX;g.heartAt=null;wr(g);changed()},
 spend(n){const g=state();if(g.bones<n)return false;g.bones-=n;wr(g);changed();return true},
 addBones(n){const g=state();g.bones+=n;wr(g);changed()},
 boosts(){try{const p=JSON.parse(localStorage.getItem('gbb_play')||'{}');return p.boost||[3,2,1,1]}catch(e){return[3,2,1,1]}},
 addBoost(k,n=1){let p={};try{p=JSON.parse(localStorage.getItem('gbb_play')||'{}')}catch(e){}p.boost=p.boost||[3,2,1,1];p.boost[k]=(p.boost[k]||0)+n;
  localStorage.setItem('gbb_play',JSON.stringify(p));if(window.SAVE&&SAVE.boost)SAVE.boost[k]=p.boost[k];changed()},
 on(f){listeners.push(f)},changed};
// keep every counter on screen current, and tick the refill timer
setInterval(changed,15000);
})();

/* Good Boy Bobo — gameplay action layer (art from the approved effects sheet).
   Praise words on combos, dirt clumps / wood splinters / leash sparkles on obstacles,
   wind, grass bursts and rainbow ribbons on special toys. Short and fast so the board stays readable. */
(function(){
const FXP='fx/',V='?v=1';
const IM={};['w_goodboy','w_pawsome','w_woof','w_fetch','w_topdog','dirt','splinters','puff','grass','sparkle','wind','rainbow','p_leaf0','p_leaf1','p_leaf2']
 .forEach(k=>{const i=new Image();i.src=FXP+k+'.webp'+V;IM[k]=i});
const css=document.createElement('style');css.textContent=`
.gx{position:absolute;pointer-events:none;will-change:transform,opacity;z-index:26}
.gxw{position:absolute;left:50%;pointer-events:none;z-index:36;filter:drop-shadow(0 4px 5px rgba(0,30,30,.45))}`;
document.head.appendChild(css);
const $=id=>document.getElementById(id);
const fast=()=>typeof FAST!=='undefined'&&FAST;
const R=(a,b)=>a+Math.random()*(b-a);
// a sprite in board coordinates, animated with keyframes
function spr(k,x,y,w,frames,dur,ease='cubic-bezier(.2,.7,.3,1)',layer){const L=layer||$('fx');if(!L||fast())return null;
 const i=IM[k].cloneNode();i.className='gx';const h=w*(IM[k].naturalHeight||1)/(IM[k].naturalWidth||1);
 Object.assign(i.style,{left:(x-w/2)+'px',top:(y-h/2)+'px',width:w+'px',height:h+'px'});L.appendChild(i);
 i.animate(frames,{duration:dur,easing:ease,fill:'forwards'}).onfinish=()=>i.remove();return i}
function burst(k,x,y,n,size,dist,dur=520,spin=180){for(let j=0;j<n;j++){const a=R(0,6.283),d=R(dist*.5,dist),s=R(size*.7,size);
 spr(k,x,y,s,[{transform:`translate(0,0) rotate(0deg) scale(.4)`,opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-6}px) rotate(${R(-spin,spin)}deg) scale(1)`,opacity:1,offset:.6},{transform:`translate(${Math.cos(a)*d*1.15}px,${Math.sin(a)*d*1.15+14}px) rotate(${R(-spin,spin)*1.4}deg) scale(.8)`,opacity:0}],dur+R(-80,80))}}
function poof(x,y,size,dur=480){spr('puff',x,y,size,[{transform:'scale(.3)',opacity:.95},{transform:'scale(1)',opacity:.75,offset:.45},{transform:'scale(1.25) translateY(-6px)',opacity:0}],dur,'ease-out')}
function twinkle(x,y,size,delay=0){setTimeout(()=>spr('sparkle',x,y,size,[{transform:'scale(0) rotate(0)',opacity:1},{transform:'scale(1) rotate(45deg)',opacity:1,offset:.4},{transform:'scale(.2) rotate(90deg)',opacity:0}],420,'ease-out'),delay)}
// ---- obstacles: replace the plain coloured dots with real bits of dirt / wood
const _pt=window.particles;
window.particles=particles=function(cell,color,n){if(fast()||typeof center!=='function')return _pt&&_pt.apply(this,arguments);
 const [x,y]=center(cell),cs=typeof CS!=='undefined'?CS:45;
 if(color==='#8a5a2b'){burst('dirt',x,y,3,cs*.55,cs*.9,560,120);poof(x,y+cs*.15,cs*.9);return}
 if(color==='#c8873f'){burst('splinters',x,y,3,cs*.6,cs*.95,560,260);poof(x,y,cs*.8);return}
 if(color==='#e0302a'){twinkle(x-cs*.2,y-cs*.2,cs*.5);twinkle(x+cs*.25,y+cs*.1,cs*.4,90);return _pt&&_pt.apply(this,arguments)}
 return _pt&&_pt.apply(this,arguments)};
// ---- praise words: our own art instead of plain text
const WORD={'GOOD BOY!':'w_goodboy','PAWSOME!':'w_pawsome','BOBO-TASTIC!':'w_topdog','MEGA COMBO!':'w_fetch','WOOF!':'w_woof'};
const _ct=window.comboText;let lastWord=0;
function word(k){if(window.gfx3)return gfx3.word({w_goodboy:'praise_good_boy',w_pawsome:'praise_pawsome',w_woof:'praise_woof',w_fetch:'praise_fetch',w_topdog:'praise_top_dog'}[k]);const app=$('app');if(!app||fast())return;const now=performance.now();if(now-lastWord<650)return;lastWord=now;
 const t=(typeof S!=='undefined'&&S&&S.top)?S.top:300,bh=(typeof S!=='undefined'&&S&&S.R&&typeof CS!=='undefined')?S.R*CS*(typeof SY!=='undefined'?SY:1):360;
 const w=k==='w_woof'?170:k==='w_fetch'?270:240;const i=IM[k].cloneNode();i.className='gxw';Object.assign(i.style,{width:w+'px',marginLeft:(-w/2)+'px',top:(t+bh*.38)+'px'});app.appendChild(i);
 i.animate([{transform:'scale(.2) rotate(-8deg)',opacity:0},{transform:'scale(1.15) rotate(3deg)',opacity:1,offset:.22},{transform:'scale(.96) rotate(-1deg)',opacity:1,offset:.36},{transform:'scale(1) rotate(0)',opacity:1,offset:.7},{transform:'scale(1.04) translateY(-26px)',opacity:0}],{duration:1150,easing:'ease-out',fill:'forwards'}).onfinish=()=>i.remove();
 const cx=195,cy=t+bh*.38;for(let j=0;j<5;j++)twinkle(cx+R(-w*.55,w*.55),cy+R(-30,30),R(14,24),j*60)}
window.comboText=comboText=function(t){const k=WORD[String(t).toUpperCase()];if(k)return word(k);if(/LEVEL CLEAR/i.test(t))return;return _ct&&_ct.apply(this,arguments)};
// "Woof!" on a 3-chain (the game already shows bigger words from 4 up)
let lc=0;setInterval(()=>{if(typeof S==='undefined'||!S)return;const c=S.combo||0;if(c===3&&lc<3)word('w_woof');lc=c},60);
// ---- special toys
const _fire=window.fire;
window.fire=fire=async function(p,cell,o){try{if(!window.GFX3&&!fast()&&p&&cell&&typeof center==='function'){const [x,y]=center(cell),cs=CS,W=COLS*cs,Hh=S.R*cs*(typeof SY!=='undefined'?SY:1);
 if(p.sp==='row'||p.sp==='col'){const row=p.sp==='row';
  for(const dir of [-1,1]){const i=spr('wind',x,y,cs*2.2,row?[{transform:`translateX(0) scaleX(${dir})`,opacity:.95},{transform:`translateX(${dir*W*.55}px) scaleX(${dir})`,opacity:0}]:[{transform:`translateY(0) rotate(90deg) scaleX(${dir})`,opacity:.95},{transform:`translateY(${dir*Hh*.55}px) rotate(90deg) scaleX(${dir})`,opacity:0}],380,'ease-out')}
  poof(x,y,cs*1.1);if(Math.random()<.6)burst(['p_leaf0','p_leaf1','p_leaf2'][Math.floor(Math.random()*3)],x,y,2,cs*.4,cs*1.1,620,200)}
 else if(p.sp==='bomb'){spr('grass',x,y,cs*2.4,[{transform:'scale(.2)',opacity:1},{transform:'scale(1.1)',opacity:1,offset:.4},{transform:'scale(1.3) translateY(-8px)',opacity:0}],620,'ease-out');
  burst('dirt',x,y,4,cs*.6,cs*1.8,640,150);poof(x-cs*.6,y,cs*1.2);poof(x+cs*.6,y,cs*1.2)}
 else if(p.sp==='rainbow'){spr('rainbow',x,y,cs*3.2,[{transform:'scale(.2) rotate(-40deg)',opacity:0},{transform:'scale(1) rotate(0deg)',opacity:1,offset:.35},{transform:'scale(1.4) rotate(30deg)',opacity:0}],820,'ease-out');
  for(let j=0;j<8;j++)twinkle(x+R(-cs*2,cs*2),y+R(-cs*2,cs*2),R(cs*.3,cs*.55),j*45)}
 else if(p.sp==='flyer'){spr('wind',x,y,cs*2.4,[{transform:'scale(.4)',opacity:1},{transform:'scale(1.2) translateX(20px)',opacity:0}],420,'ease-out');poof(x,y,cs)}
}}catch(e){}return _fire.apply(this,arguments)};
window.gfx={word,burst,poof,twinkle};
})();

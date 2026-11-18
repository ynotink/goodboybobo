/* Good Boy Bobo — gameplay effects from ChatGPT's effects pack (fx2/).
   Local, quick and confined to the tiles that clear, per the art handoff:
   match bursts in the toy's own colour, line beams, bomb ring, rainbow burst, dirt/crate/leash breaks,
   goal-fly glints, booster impacts and the new praise words. Sizes are in board pixels (CS = one tile). */
(function(){
window.GFX3=true;
const P='fx2/',V='?v=1';
const NAMES=['match_red','match_blue','match_green','match_yellow','match_purple','match_orange','line_horizontal','line_vertical','bomb_blast','rainbow_blast',
 'dirt_break_full','dirt_break_half','crate_break','leash_snap','sparkle_star','sparkle_cluster','sparkle_glint','goal_fly_trail',
 'booster_paw_tap','booster_free_swap','booster_bomb','booster_shuffle','praise_good_boy','praise_pawsome','praise_woof','praise_fetch','praise_top_dog'];
const IM={};NAMES.forEach(k=>{const i=new Image();i.decoding='async';i.src=P+k+'.webp'+V;IM[k]=i});
const css=document.createElement('style');css.textContent=`
.g3{position:absolute;pointer-events:none;will-change:transform,opacity;z-index:27;-webkit-user-drag:none}
.g3w{position:absolute;left:50%;pointer-events:none;z-index:38;filter:drop-shadow(0 5px 6px rgba(0,30,30,.4))}
#fx .prt{display:none}
#fx .beam,#fx .ring{opacity:0!important}
.pc.pop{animation:g3pop .16s ease-in forwards!important}@keyframes g3pop{35%{transform:var(--t) scale(1.12)}100%{transform:var(--t) scale(.2);opacity:0}}`;
document.head.appendChild(css);
const $=id=>document.getElementById(id);
const fast=()=>typeof FAST!=='undefined'&&FAST;
const RM=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const R=(a,b)=>a+Math.random()*(b-a);
const cs=()=>typeof CS!=='undefined'?CS:45;
const sy=()=>typeof SY!=='undefined'?SY:1;
let live=0;const CAP=70;
function layer(){let L=$('fx3');if(!L){const f=$('fx');L=document.createElement('div');L.id='fx3';const cs_=getComputedStyle(f);Object.assign(L.style,{position:'absolute',left:cs_.left,top:cs_.top,width:cs_.width,height:cs_.height,pointerEvents:'none',zIndex:34});(f.parentNode||$('app')).appendChild(L)}return L}
function spr(k,x,y,w,frames,dur,ease='cubic-bezier(.2,.7,.3,1)',opt={}){const L=layer();if(!L||fast()||live>CAP)return null;
 const src=IM[k];const i=document.createElement('img');i.src=src.src;i.className='g3';const ar=(src.naturalHeight||1)/(src.naturalWidth||1);const h=opt.h||w*ar;
 Object.assign(i.style,{left:(x-w/2)+'px',top:(y-h/2)+'px',width:w+'px',height:h+'px'});if(opt.z)i.style.zIndex=opt.z;if(opt.blend)i.style.mixBlendMode=opt.blend;L.appendChild(i);live++;
 frames=frames.map((f,j)=>j<frames.length-1&&!f.easing?Object.assign({},f,{easing:ease}):f);const a=i.animate(frames,{duration:RM?dur*.6:dur,easing:'linear',fill:'forwards',delay:opt.delay||0});a.onfinish=()=>{i.remove();live--};return i}
function glint(x,y,size,delay=0){if(RM)return;spr(Math.random()<.5?'sparkle_star':'sparkle_glint',x,y,size,[{transform:'scale(0) rotate(0)',opacity:1},{transform:'scale(1) rotate(30deg)',opacity:1,offset:.45},{transform:'scale(.15) rotate(70deg)',opacity:0}],380,'ease-out',{delay,blend:'screen'})}
// ---- which colour is this toy?
const TOYCOL={paw:'orange',tennis:'yellow',rope:'blue',ring:'green',squeaky_bone:'purple',rubber_ball:'red',natural_bone:'yellow'};
function toyColor(p){try{const i=p&&p.el&&p.el.querySelector('img');const n=i?i.src.split('/').pop().replace(/(_s)?\.webp.*$/,''):'';for(const k in TOYCOL)if(n.indexOf(k)===0)return TOYCOL[k]}catch(e){}return ['orange','yellow','blue','green','purple','red'][(p&&p.t)||0]}
// ---- ordinary match burst: about one tile wide, 200 ms
function pop(cell,p){const [x,y]=center(cell),c=cs();const col=toyColor(p);
 spr('match_'+col,x,y,c*1.9,[{transform:'scale(.3) rotate(0deg)',opacity:.9},{transform:'scale(1) rotate(10deg)',opacity:1,offset:.5},{transform:'scale(1.1) rotate(16deg)',opacity:0}],320,'cubic-bezier(.2,.8,.3,1)');
 if(Math.random()<.35)glint(x+R(-c*.35,c*.35),y+R(-c*.35,c*.35),c*.38,60)}
// ---- obstacles
function dirt(cell,gone){const [x,y]=center(cell),c=cs();const k=gone?'dirt_break_full':'dirt_break_half';const w=gone?c*1.5:c*1.05;
 spr(k,x,y,w,[{transform:'scale(.55) translateY(4px)',opacity:1},{transform:'scale(1.05) translateY(-6px) rotate(-6deg)',opacity:1,offset:.4},{transform:'scale(1.12) translateY(16px) rotate(-10deg)',opacity:0}],300,'cubic-bezier(.25,.7,.4,1)')}
function crate(cell){const [x,y]=center(cell),c=cs();
 spr('crate_break',x,y,c*1.5,[{transform:'scale(.6) rotate(0)',opacity:1},{transform:'scale(1.08) rotate(8deg) translateY(-6px)',opacity:1,offset:.38},{transform:'scale(1.18) rotate(14deg) translateY(18px)',opacity:0}],300,'cubic-bezier(.25,.7,.4,1)')}
function leash(cell){const [x,y]=center(cell),c=cs();
 spr('leash_snap',x,y,c*1.45,[{transform:'scaleX(.5) scaleY(.8)',opacity:1},{transform:'scaleX(1.08) scaleY(1)',opacity:1,offset:.35},{transform:'scaleX(1.25) translateY(10px)',opacity:0}],280,'cubic-bezier(.2,.8,.3,1)');glint(x,y-c*.2,c*.45,40)}
// replace the old coloured-dot particles
const _pt=window.particles;
window.particles=particles=function(cell,color,n){if(fast()||!cell||typeof center!=='function')return;
 if(color==='#8a5a2b'){dirt(cell,!cell.b||cell.b.hp<=0);return}
 if(color==='#c8873f'){crate(cell);return}
 if(color==='#e0302a'){leash(cell);return}
 pop(cell,cell.p||cell._lastP)};
// damage() nulls cell.p before particles(); remember the toy so we know its colour
const _dmg=window.damage;
window.damage=damage=function(cell,src){if(cell&&cell.p)cell._lastP=cell.p;return _dmg.apply(this,arguments)};
// ---- line beam: stretched along the row/column, clipped to the board
const sfx=(n,o)=>{try{window.BA&&BA.play(n,o)}catch(e){}};
window.beam=beam=function(cell,dir){if(fast())return;sfx('blast',{gap:80,vol:.85});const [x,y]=center(cell),c=cs();const W=COLS*c,H=S.R*c*sy();
 if(dir=='row'){spr('line_horizontal',S.left+W/2,y,W+c*.4,[{transform:'scaleX(.05)',opacity:1},{transform:'scaleX(1)',opacity:1,offset:.45},{transform:'scaleX(1.02) scaleY(.4)',opacity:0}],280,'cubic-bezier(.2,.8,.3,1)',{h:c*1.25,blend:'screen'})}
 else{spr('line_vertical',x,S.top+H/2,c*1.25,[{transform:'scaleY(.05)',opacity:1},{transform:'scaleY(1)',opacity:1,offset:.45},{transform:'scaleY(1.02) scaleX(.4)',opacity:0}],280,'cubic-bezier(.2,.8,.3,1)',{h:H+c*.4,blend:'screen'})}
 for(let j=0;j<3;j++)glint(x+R(-c,c),y+R(-c*.6,c*.6),c*.4,j*50)};
// ---- ring(): bomb ring (big) or small hit
window.ring=ring=function(cell,size){if(fast())return;if(size>=150)sfx('boom',{gap:120,vol:.9});const [x,y]=center(cell),c=cs();
 if(size>=150){spr('bomb_blast',x,y,c*5.2,[{transform:'scale(.25)',opacity:1},{transform:'scale(.9)',opacity:1,offset:.5},{transform:'scale(1.15)',opacity:0}],340,'cubic-bezier(.15,.8,.3,1)');for(let j=0;j<4;j++)glint(x+R(-c*1.6,c*1.6),y+R(-c*1.6,c*1.6),c*.5,j*40)}
 else spr('sparkle_cluster',x,y,c*1.3,[{transform:'scale(.3)',opacity:1},{transform:'scale(1.1)',opacity:0}],260,'ease-out')};
// ---- specials: rainbow burst, purple pulse for the booster bomb
const _fire=window.fire;
window.fire=fire=async function(p,cell,o){try{if(!fast()&&p&&cell){const [x,y]=center(cell),c=cs();
 if(p.sp==='rainbow'){spr('rainbow_blast',x,y,c*3.4,[{transform:'scale(.2) rotate(-25deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:1,offset:.3},{transform:'scale(1.25) rotate(15deg)',opacity:0}],600,'cubic-bezier(.2,.8,.3,1)')}
 if(p.sp==='bomb'&&o&&o.keepEl){spr('booster_bomb',x,y,c*2.6,[{transform:'scale(.3)',opacity:1},{transform:'scale(1)',opacity:1,offset:.45},{transform:'scale(1.2)',opacity:0}],340,'ease-out',{z:28})}
}}catch(e){}return _fire.apply(this,arguments)};
// rainbow zaps: little glints that travel to each target
const _zap=window.zap;
window.zap=zap=function(a,b){if(fast())return;const [x1,y1]=center(a),[x2,y2]=center(b),c=cs();
 spr('sparkle_star',x1,y1,c*.55,[{transform:'translate(0,0) scale(.5)',opacity:1},{transform:`translate(${x2-x1}px,${y2-y1}px) scale(1)`,opacity:1,offset:.85},{transform:`translate(${x2-x1}px,${y2-y1}px) scale(.2)`,opacity:0}],320,'ease-in',{blend:'screen'})};
// ---- boosters
const _bd=window.boosterDone;
window.boosterDone=boosterDone=function(){try{if(!fast()&&S&&S.booster===1&&S.bsel){const [x,y]=center(S.bsel),c=cs();
 spr('booster_free_swap',x,y,c*1.9,[{transform:'scale(.4) rotate(-30deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:1,offset:.4},{transform:'scale(1.1) rotate(20deg)',opacity:0}],320,'ease-out',{z:29})}}catch(e){}return _bd.apply(this,arguments)};
const _tap=window.tapCell;
window.tapCell=tapCell=async function(cell){try{if(!fast()&&S&&S.booster===0&&cell&&(cell.p||cell.b)){const [x,y]=center(cell),c=cs();
 spr('booster_paw_tap',x,y-c*.1,c*1.7,[{transform:'scale(1.5) translateY(-14px)',opacity:0},{transform:'scale(.92) translateY(0)',opacity:1,offset:.45},{transform:'scale(1.05)',opacity:1,offset:.7},{transform:'scale(1.2)',opacity:0}],260,'cubic-bezier(.3,1.4,.5,1)',{z:29})}}catch(e){}return _tap.apply(this,arguments)};
const _sh=window.shuffle;
window.shuffle=shuffle=async function(){try{if(!fast()&&S){const c=cs(),W=COLS*c,H=S.R*c*sy();
 spr('booster_shuffle',S.left+W/2,S.top+H/2,W*.55,[{transform:'scale(.3) rotate(0)',opacity:0},{transform:'scale(1) rotate(180deg)',opacity:1,offset:.4},{transform:'scale(1.1) rotate(420deg)',opacity:0}],650,'ease-in-out',{z:29})}}catch(e){}return _sh.apply(this,arguments)};
// ---- goal fly: a glinting trail follows the toy up to its goal
const app=$('app');
new MutationObserver(ms=>{if(fast()||RM)return;for(const m of ms)for(const n of m.addedNodes){if(n.classList&&n.classList.contains('fly')){const el=n,t0=performance.now();let last=0;
 (function tick(t){if(!el.isConnected||t-t0>600)return;if(t-last>45){last=t;const r=el.getBoundingClientRect(),ar=app.getBoundingClientRect(),k=ar.width/390;
  const x=(r.left+r.width/2-ar.left)/k,y=(r.top+r.height/2-ar.top)/k;const d=document.createElement('img');d.src=IM.sparkle_glint.src;d.className='g3';const s=R(9,15);
  Object.assign(d.style,{left:x-s/2+'px',top:y-s/2+'px',width:s+'px',height:s+'px',zIndex:31,mixBlendMode:'screen'});app.appendChild(d);
  d.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.2) translateY(6px)'}],{duration:380,easing:'ease-out'}).onfinish=()=>d.remove()}
  requestAnimationFrame(tick)})(t0)}}}).observe(app,{childList:true});
// ---- praise words: the new art (one at a time)
const WORD={'GOOD BOY!':'praise_good_boy','PAWSOME!':'praise_pawsome','BOBO-TASTIC!':'praise_top_dog','MEGA COMBO!':'praise_fetch','WOOF!':'praise_woof'};
let lastW=0;
function word(k){if(!app||fast())return;const now=performance.now();if(now-lastW<800)return;lastW=now;try{dispatchEvent(new Event('gbbPraise'))}catch(e){}sfx('popper',{gap:300,vol:.7});
 const t=(S&&S.top)||300,bh=(S&&S.R)?S.R*cs()*sy():360;const w=k==='praise_woof'?190:k==='praise_pawsome'?280:260;
 const i=document.createElement('img');i.src=IM[k].src;i.className='g3w';Object.assign(i.style,{width:w+'px',marginLeft:(-w/2)+'px',top:(t+bh*.36)+'px'});app.appendChild(i);
 i.animate([{transform:'translateX(-60px) scale(.6) rotate(-6deg)',opacity:0},{transform:'translateX(6px) scale(1.08) rotate(2deg)',opacity:1,offset:.2},{transform:'translateX(0) scale(.98) rotate(0)',opacity:1,offset:.32},{transform:'scale(1)',opacity:1,offset:.72},{transform:'translateY(-22px) scale(1.03)',opacity:0}],{duration:RM?600:880,easing:'ease-out',fill:'forwards'}).onfinish=()=>i.remove();
 if(!RM){const cx=195,cy=t+bh*.36+w*.2;for(let j=0;j<4;j++){const d=document.createElement('img');d.src=IM.sparkle_star.src;d.className='g3';const s=R(14,22);Object.assign(d.style,{left:cx+R(-w*.5,w*.5)-s/2+'px',top:cy+R(-40,10)-s/2+'px',width:s+'px',height:s+'px',zIndex:39});app.appendChild(d);
  d.animate([{transform:'scale(0) rotate(0)',opacity:1},{transform:'scale(1) rotate(40deg)',opacity:1,offset:.4},{transform:'scale(.2) rotate(80deg)',opacity:0}],{duration:420,delay:120+j*70,easing:'ease-out',fill:'both'}).onfinish=()=>d.remove()}}}
const _ct=window.comboText;
window.comboText=comboText=function(t){const k=WORD[String(t).toUpperCase()];if(k)return word(k);if(/LEVEL CLEAR/i.test(t))return;return _ct&&_ct.apply(this,arguments)};
// old text pop-ups off: Rambo's speech bubble, "+180" score numbers and the "Bobo Bonus!" toast.
// Praise in the bubble becomes the new 3D word art; everything else is dropped.
const SAYW={'GOOD BOY!':'praise_good_boy','WOOF!':'praise_woof','PAWSOME!':'praise_pawsome'};
window.say=say=function(t){const k=SAYW[String(t).toUpperCase()];if(k)word(k)};
window.floater=floater=function(){};
const _toast=window.toast;window.toast=toast=function(t){if(/bonus/i.test(t))return;return _toast&&_toast.apply(this,arguments)};
{const b=document.getElementById('bub');if(b)b.style.display='none'}
window.gfx3={word,pop,spr};
})();

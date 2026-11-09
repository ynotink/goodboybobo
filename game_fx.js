/* Good Boy Bobo — gameplay juice: pieces burst into colored shards + sparkles on every match,
   glow when a special is made, sparkle streaks on line blasts, light bursts on bombs, confetti on big moments.
   One canvas over the board (fast). Off with ?fx=0 or reduced motion. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('fx')==='0'||RM)return;
const app=document.getElementById('app'),host=document.getElementById('fx');if(!app||!host)return;
// piece colors (main, shade) per piece type: bone, tennis ball, paw, rope, red ball
const COLX={w:['#e7a64a','#8a4f1a'],d:['#a46a3c','#5e3a1c']};
const COL=[['#fae3ba','#b67f3b'],['#d2e21c','#8fa106'],['#fab935','#c36204'],['#1f5fd0','#e8891a'],['#f63d32','#b00e06']];
const SPARK=[0,1,2,3,4,5].map(i=>{const m=new Image();m.src='a/fx/tw'+i+'.webp';return m});
const GLINT=new Image();GLINT.src='a/fx/glint.webp';const BURST=new Image();BURST.src='a/fx/burst.webp';
const BONES=['a/ic1.webp','a/i_bone1.webp'].map(u=>{const m=new Image();m.src=u;return m});
const CONF=['#ff5a6e','#ffc93c','#4fc3f7','#7ed957','#b388ff','#ff8a3d'];
const cv=document.createElement('canvas');cv.style.cssText='position:absolute;left:0;top:0;pointer-events:none;z-index:2';host.appendChild(cv);
const g=cv.getContext('2d');let W=390,H=844,dpr=1;
function size(){H=parseFloat(app.style.height)||app.clientHeight||844;const k=parseFloat(getComputedStyle(app).getPropertyValue('--k'))||1;
 dpr=Math.min(3,(window.devicePixelRatio||2))*Math.max(1,k);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.width=W+'px';cv.style.height=H+'px'}
size();addEventListener('resize',()=>setTimeout(size,50));
const R=Math.random,P=[];let running=false,last=0;
function kick(){if(!running){running=true;last=performance.now();requestAnimationFrame(loop)}}
function posOf(el){const a=app.getBoundingClientRect(),r=el.getBoundingClientRect(),k=a.width/W;return[(r.left+r.width/2-a.left)/k,(r.top+r.height/2-a.top)/k,r.width/k]}
// ---- emitters ----
function shatter(x,y,t,s,power){const c=COL[t]||COLX[t]||['#fff6c0','#ffd36b'];const n=Math.round((11+R()*4)*power);
 P.push({k:'glow',x,y,s:s*2.3,life:.3,age:0});
 for(let i=0;i<n;i++){const a=R()*Math.PI*2,v=(2.6+R()*4.2)*Math.min(1.4,power);
  P.push({k:'shard',x:x+(R()-.5)*s*.3,y:y+(R()-.5)*s*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.6,r:R()*6,vr:(R()-.5)*.5,
   s:s*(.2+R()*.18),c:R()<.65?c[0]:c[1],life:.7+R()*.4,age:0,sh:(R()*3)|0})}
 for(let i=0;i<Math.round(3*power+1);i++){const a=R()*Math.PI*2,v=1+R()*2.8;
  P.push({k:'spark',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,s:s*(.35+R()*.3),img:SPARK[(R()*6)|0],life:.45+R()*.3,age:0,r:R()*3})}
 kick()}
function glow(x,y,s){P.push({k:'burst',x,y,s:s*3.2,life:.6,age:0,r:R()*6});P.push({k:'glow',x,y,s:s*2.4,life:.45,age:0});
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;P.push({k:'spark',x,y,vx:Math.cos(a)*3.2,vy:Math.sin(a)*3.2,s:s*.45,img:SPARK[i%6],life:.6,age:0,r:0})}kick()}
function streak(x,y,dir,len){const n=22;for(let i=0;i<n;i++){const u=(i/(n-1)-.5)*len,px=dir==='row'?x+u:x,py=dir==='row'?y:y+u;
  P.push({k:'spark',x:px,y:py,vx:(R()-.5)*1.2,vy:(R()-.5)*1.2,s:14+R()*14,img:SPARK[(R()*6)|0],life:.45+R()*.35,age:-R()*.08,r:R()*3})}
 P.push({k:'flare',x,y,dir,len,life:.35,age:0});kick()}
function bombFx(x,y,size){P.push({k:'burst',x,y,s:size*1.5,life:.75,age:0,r:R()*6});P.push({k:'wave',x,y,s:size,life:.5,age:0});
 for(let i=0;i<16;i++){const a=R()*Math.PI*2,v=3+R()*5;P.push({k:'spark',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,s:16+R()*16,img:SPARK[(R()*6)|0],life:.6+R()*.3,age:0,r:R()*3})}kick()}
function confetti(n,x,y,spread){for(let i=0;i<n;i++){const a=-Math.PI/2+(R()-.5)*spread,v=6+R()*8;
  P.push({k:'conf',x:x+(R()-.5)*40,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:8+R()*4,h:12+R()*6,c:CONF[(R()*6)|0],r:R()*6,vr:(R()-.5)*.4,ph:R()*6,life:2.2+R()*.8,age:0})}kick()}
function bones(n,x,y,spread){for(let i=0;i<n;i++){const a=-Math.PI/2+(R()-.5)*spread,v=7+R()*8;
  P.push({k:'bone',x:x+(R()-.5)*40,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,s:34+R()*18,img:BONES[R()<.85?0:1],r:R()*6,vr:(R()-.5)*.35,life:1.9+R()*.6,age:0,tw:0})}
 for(let i=0;i<12;i++){const a=R()*Math.PI*2,v=2+R()*4;P.push({k:'spark',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,s:20+R()*16,img:SPARK[(R()*6)|0],life:.7,age:0,r:0})}kick()}
// ---- draw loop ----
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;const f=dt*60;
 g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.age+=dt;if(p.age<0)continue;const u=p.age/p.life;if(u>=1){P.splice(i,1);continue}
  const A=1-u*u;
  if(p.k==='shard'){p.vy+=.22*f;p.vx*=.985;p.x+=p.vx*f;p.y+=p.vy*f;p.r+=p.vr*f;
   g.globalCompositeOperation='source-over';g.globalAlpha=A;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.beginPath();const s=p.s;
   if(p.sh===0){g.moveTo(-s,-s*.6);g.lineTo(s,-s*.2);g.lineTo(-s*.2,s)}else if(p.sh===1){g.moveTo(-s,0);g.lineTo(0,-s);g.lineTo(s,0);g.lineTo(0,s*.7)}else{g.arc(0,0,s*.7,0,Math.PI*2)}
   g.closePath();g.fill();g.globalAlpha=A*.35;g.fillStyle='#fff';g.beginPath();g.arc(-s*.2,-s*.2,s*.28,0,Math.PI*2);g.fill();g.restore()}
  else if(p.k==='spark'){p.vx*=.95;p.vy=p.vy*.95+.05*f;p.x+=p.vx*f;p.y+=p.vy*f;const k=Math.sin(Math.PI*Math.min(1,u*1.2));
   g.globalCompositeOperation='lighter';g.globalAlpha=k;const s=p.s*(.6+.5*k);if(p.img.complete)g.drawImage(p.img,p.x-s/2,p.y-s/2,s,s)}
  else if(p.k==='glow'){g.globalCompositeOperation='lighter';const s=p.s*(.6+.6*u),gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,s/2);
   gr.addColorStop(0,`rgba(255,255,235,${.9*(1-u)})`);gr.addColorStop(.4,`rgba(255,230,150,${.5*(1-u)})`);gr.addColorStop(1,'rgba(255,210,90,0)');g.globalAlpha=1;g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,s/2,0,Math.PI*2);g.fill()}
  else if(p.k==='burst'){g.globalCompositeOperation='lighter';g.globalAlpha=Math.sin(Math.PI*u);const s=p.s*(.3+.9*u);g.save();g.translate(p.x,p.y);g.rotate(p.r+u*.6);if(BURST.complete)g.drawImage(BURST,-s/2,-s/2,s,s);g.restore()}
  else if(p.k==='wave'){g.globalCompositeOperation='lighter';g.globalAlpha=(1-u)*.9;g.strokeStyle='#fff3c0';g.lineWidth=8*(1-u)+1;g.beginPath();g.arc(p.x,p.y,p.s*.15+p.s*.6*u,0,Math.PI*2);g.stroke()}
  else if(p.k==='flare'){g.globalCompositeOperation='lighter';g.globalAlpha=1-u;const L=p.len*(.6+.4*u),T=10*(1-u)+2;
   const gr=p.dir==='row'?g.createLinearGradient(p.x-L/2,0,p.x+L/2,0):g.createLinearGradient(0,p.y-L/2,0,p.y+L/2);
   gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,240,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;
   if(p.dir==='row')g.fillRect(p.x-L/2,p.y-T/2,L,T);else g.fillRect(p.x-T/2,p.y-L/2,T,L)}
  else if(p.k==='bone'){p.vy+=.22*f;p.vx*=.99;p.x+=p.vx*f;p.y+=p.vy*f;p.r+=p.vr*f;p.tw+=dt;
   if(p.tw>.07&&u<.6){p.tw=0;P.push({k:'spark',x:p.x,y:p.y,vx:0,vy:0,s:p.s*.5,img:SPARK[(R()*6)|0],life:.35,age:0,r:0})}
   g.globalCompositeOperation='source-over';g.globalAlpha=Math.min(1,(1-u)*6);g.save();g.translate(p.x,p.y);g.rotate(p.r);
   g.shadowColor='rgba(60,30,0,.35)';g.shadowBlur=4;g.shadowOffsetY=3;const a=p.img.naturalWidth?p.img.naturalHeight/p.img.naturalWidth:.85;
   if(p.img.complete)g.drawImage(p.img,-p.s/2,-p.s*a/2,p.s,p.s*a);g.shadowColor='transparent';g.restore()}
  else if(p.k==='conf'){p.vy+=.18*f;p.vx*=.99;p.vy*=.985;p.x+=p.vx*f+Math.sin(p.age*6+p.ph)*.6;p.y+=p.vy*f;p.r+=p.vr*f;
   g.globalCompositeOperation='source-over';g.globalAlpha=Math.min(1,(1-u)*7);g.save();g.translate(p.x,p.y);g.rotate(p.r);const fl=Math.cos(p.age*7+p.ph),sx=Math.max(.35,Math.abs(fl));g.scale(sx,1);g.fillStyle=p.c;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);if(fl<0){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(-p.w/2,-p.h/2,p.w,p.h)}g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-p.w/2,-p.h/2,p.w,p.h*.25);g.restore()}
 }
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
 if(P.length)requestAnimationFrame(loop);else{running=false;g.clearRect(0,0,W,H)}}
// ---- impact sounds (layered under the musical match notes) ----
let lastCr=0,crN=0;
function sfx(n,o){try{window.BA&&BA.play(n,o)}catch(e){}}
function crunch(){const now=performance.now();if(now-lastCr<55)return;lastCr=now;const c=combo();
 sfx('crunch'+(crN++%3),{gap:0,vol:Math.min(1,.55+c*.08),rate:Math.min(1.35,.95+c*.06+(Math.random()-.5)*.06)})}
// ---- hook the game ----
const combo=()=>{try{return Math.max(1,S.combo||1)}catch(e){return 1}};const fast=()=>{try{return FAST}catch(e){return false}};
if(typeof popEl==='function'){const o=popEl;window.popEl=popEl=function(p){try{if(p&&p.el&&!fast()){const [x,y,s]=posOf(p.el);
   crunch();const pw=Math.min(1.8,.85+combo()*.15);shatter(x,y,p.carrot?2:(p.sp?-1:p.t),s,p.sp?1.4:pw)}}catch(e){}return o(p)}}
if(typeof beam==='function'){const o=beam;window.beam=beam=function(cell,dir){o(cell,dir);try{const [x,y]=center(cell);
   sfx('blast',{gap:80,vol:.85});const L=dir==='row'?W:(S.R*CS);const cx=dir==='row'?W/2:x,cy=dir==='row'?y:S.top+S.R*CS/2;streak(cx,cy,dir,L)}catch(e){}}}
if(typeof ring==='function'){const o=ring;window.ring=ring=function(cell,size){o(cell,size);try{sfx('boom',{gap:120,vol:.9});const [x,y]=center(cell);bombFx(x,y,size)}catch(e){}}}
if(typeof comboText==='function'){const o=comboText;window.comboText=comboText=function(t){o(t);try{
   if(/CLEAR/.test(t)){sfx('popper',{gap:300});confetti(42,W*.25,H*.55,1.1);confetti(42,W*.75,H*.55,1.1)}else if(/MEGA|TASTIC/.test(t)){sfx('popper',{gap:300,vol:.85});bones(26,W/2,H*.55,1.4)}else if(/PAWSOME/.test(t)){sfx('popper',{gap:300,vol:.7});bones(14,W/2,H*.55,1.2)}}catch(e){}}}
if(typeof hitBlock==='function'){const o=hitBlock;window.hitBlock=hitBlock=function(cell){try{if(cell&&cell.b&&!fast()){const [x,y]=center(cell);
   const wood=cell.b.k==='crate';shatter(x,y,wood?'w':'d',CS,1.1)}}catch(e){}return o(cell)}}
// glow whenever a special piece appears on the board
const pcs=document.getElementById('pcs');
if(pcs)new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;
  const img=n.tagName==='IMG'?n:n.querySelector&&n.querySelector('img');if(!img||!/sp_/.test(img.getAttribute('src')||''))continue;
  const el=n.classList&&n.classList.contains('pc')?n:n.closest?n.closest('.pc'):null;
  setTimeout(()=>{try{const [x,y,s]=posOf(el||img);glow(x,y,s);sfx('shimmer',{gap:150,vol:.8})}catch(e){}},60)}}).observe(pcs,{childList:true,subtree:true});
window.GFX={shatter,glow,streak,bombFx,confetti,bones};
})();

/* Good Boy Bobo — Toy Box + Settings showcase motion (same standard as the Shop).
   Bold spring entrances, counters/bars filling, collection sparkles, rich toggle + slider feedback,
   real sparkle art from a/fx. ?fx=0 / reduced motion = off. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('fx')==='0')RM=true;
if(RM)return;
window.ROOMFX=true;
const room=document.body.dataset.room;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const R=Math.random,TW=[0,1,2,3,4,5].map(i=>`a/fx/tw${i}.webp`);
['a/fx/glint.webp','a/fx/burst.webp',...TW].forEach(s=>{const i=new Image();i.src=s});
const app=$('#app');let L;
function layer(){if(L)return L;L=document.createElement('div');L.style.cssText='position:absolute;inset:0;z-index:60;pointer-events:none;overflow:hidden';app.appendChild(L);return L}
function pos(el,fx=.5,fy=.5){const a=app.getBoundingClientRect(),k=a.width/390,r=el.getBoundingClientRect();return{x:(r.left-a.left)/k+r.width/k*fx,y:(r.top-a.top)/k+r.height/k*fy}}
function sprite(src,x,y,s){const i=document.createElement('img');i.src=src;i.style.cssText=`position:absolute;left:${x-s/2}px;top:${y-s/2}px;width:${s}px;height:${s}px;object-fit:contain;mix-blend-mode:plus-lighter;will-change:transform,opacity`;layer().appendChild(i);return i}
const done=(a,el)=>a.onfinish=()=>el.remove();
function glint(x,y,s=32,src){const i=sprite(src||(R()<.5?'a/fx/glint.webp':TW[(R()*6)|0]),x,y,s),r0=R()*40-20;
 done(i.animate([{opacity:0,scale:.1,rotate:r0+'deg'},{opacity:1,scale:1,rotate:r0+25+'deg',offset:.4},{opacity:0,scale:.2,rotate:r0+70+'deg'}],{duration:650+R()*350,easing:'cubic-bezier(.3,.7,.4,1)'}),i)}
function burst(x,y,size=200,n=12){const b=sprite('a/fx/burst.webp',x,y,size);
 done(b.animate([{opacity:0,scale:.15,rotate:'0deg'},{opacity:1,scale:1,rotate:'20deg',offset:.22},{opacity:0,scale:1.6,rotate:'55deg'}],{duration:850,easing:'cubic-bezier(.2,.7,.3,1)'}),b);
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R()*.3,d=size*.3+R()*size*.25,sp=sprite(TW[i%6],x,y,18+R()*20);
  done(sp.animate([{opacity:1,translate:'0 0',scale:.3},{opacity:1,translate:`${Math.cos(a)*d*.75}px ${Math.sin(a)*d*.75}px`,scale:1.1,offset:.5},{opacity:0,translate:`${Math.cos(a)*d}px ${Math.sin(a)*d+14}px`,scale:.3}],{duration:650+R()*300,easing:'cubic-bezier(.15,.8,.3,1)'}),sp)}}
function A(el,kf,o){if(!el)return;return el.animate(kf,Object.assign({fill:'backwards',easing:'cubic-bezier(.25,.8,.3,1)'},o))}
const POP=[{opacity:0,scale:.3},{opacity:1,scale:1.12,offset:.55},{scale:.96,offset:.78},{scale:1}];
const TITLE=[{opacity:0,translate:'0 -70px',scale:'1.3'},{opacity:1,translate:'0 6px',scale:'1.06 .9',offset:.55},{translate:'0 -4px',scale:'.97 1.04',offset:.76},{translate:'0 0',scale:'1'}];
const RISE=[{opacity:0,translate:'0 56px',scale:.82},{opacity:1,translate:'0 -6px',scale:1.03,offset:.6},{translate:'0 2px',scale:.995,offset:.82},{translate:'0 0',scale:1}];
const RAMBO=[{opacity:0,translate:'0 40px',scale:.3,rotate:'-10deg'},{opacity:1,translate:'0 -8px',scale:1.1,rotate:'4deg',offset:.55},{translate:'0 2px',scale:.97,rotate:'-1deg',offset:.78},{translate:'0 0',scale:1,rotate:'0deg'}];
function bump(el,k=1.25){el&&el.animate([{scale:1},{scale:k},{scale:.96},{scale:1}],{duration:340,easing:'ease-out'})}
function idle(spots){(function tick(){if(!document.hidden){for(let n=0;n<2;n++){const [sel,fx,fy,s,clip]=spots[(R()*spots.length)|0],els=$$(sel),el=els[(R()*els.length)|0];
   if(el){const r=el.getBoundingClientRect(),c=clip&&$(clip)?.getBoundingClientRect();if(!c||(r.top>c.top+6&&r.bottom<c.bottom-6)){const p=pos(el,fx+(R()-.5)*.15,fy+(R()-.5)*.15);glint(p.x,p.y,s*(.8+R()*.5))}}}}
  setTimeout(tick,450+R()*550)})()}

/* ================= TOY BOX ================= */
function toys(){
 A($('#tt'),TITLE,{duration:780,delay:120});
 A($('#hero'),RISE,{duration:720,delay:230});
 A($('#rb'),RAMBO,{duration:800,delay:430,easing:'cubic-bezier(.3,.8,.3,1)'});
 A($('#tf'),[{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:420,delay:620});
 A($('#pb'),[{opacity:0,scale:'.6 1'},{opacity:1,scale:'1 1'}],{duration:450,delay:640});
 A($('#hint'),[{opacity:0},{opacity:1}],{duration:500,delay:900});
 // the big count rolls up, the bar fills, then a burst on the number
 const big=$('#big'),txt=big.textContent,m=txt.match(/(\d+)\s*\/\s*(\d+)/),f=$('#pb .f');
 if(m){const to=+m[1],tot=m[2];big.textContent='0 / '+tot;A(big,POP,{duration:560,delay:520});
  const fw=f.style.width||getComputedStyle(f).width;f.style.transition='none';const pct=to/+tot*100;f.style.width='0%';f.style.minWidth='0';const lab=f.textContent;f.textContent='';
  setTimeout(()=>{const s0=performance.now(),D=900;(function roll(now){const u=Math.min(1,(now-s0)/D),e=1-Math.pow(1-u,3);
    big.textContent=Math.round(to*e)+' / '+tot;f.style.width=(pct*e)+'%';
    if(u<1)requestAnimationFrame(roll);else{f.style.width='';f.style.minWidth='';f.textContent=lab;bump(big,1.18);const p=pos(big,.35,.5);burst(p.x,p.y,170,10)}})(s0)},900)}
 // chapters + toy cards
 const scr=$('#scr'),sr=scr.getBoundingClientRect();
 $$('.chp').forEach((c,i)=>{if(c.getBoundingClientRect().top<sr.bottom)A(c,[{opacity:0,scale:'.5 1'},{opacity:1,scale:'1.05 1',offset:.6},{scale:'1 1'}],{duration:520,delay:760+i*200})});
 $$('.c').forEach((c,i)=>{if(c.getBoundingClientRect().top>sr.bottom)return;
  A(c,POP,{duration:560,delay:880+i*85});
  const ty=c.querySelector('.ty');ty&&A(ty,[{opacity:0,scale:.2,rotate:'-35deg'},{opacity:1,scale:1.2,rotate:'8deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:600,delay:960+i*85});
  const ck=c.querySelector('.ck');ck&&A(ck,[{opacity:0,scale:2.4,rotate:'-25deg'},{opacity:1,scale:.85,rotate:'5deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:420,delay:1400+i*85,easing:'cubic-bezier(.5,0,.3,1)'});
  const nw=c.querySelector('.nw');nw&&A(nw,[{opacity:0,scale:0,rotate:'-40deg'},{opacity:1,scale:1.35,rotate:'10deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:560,delay:1500+i*85})});
 setTimeout(()=>{
  $$('.c .ty').forEach((t,i)=>t.animate([{translate:'0 0',rotate:'0deg'},{translate:'0 -5px',rotate:(i%2?3:-3)+'deg'},{translate:'0 0',rotate:'0deg'}],{duration:2400,delay:i*260,iterations:Infinity,easing:'ease-in-out'}));
  $$('.c .nw').forEach(n=>n.animate([{scale:1},{scale:1.14},{scale:1}],{duration:1100,iterations:Infinity,easing:'ease-in-out'}));
  window.FX&&FX.addShine&&$('#pb .f')&&shineBar();
  idle([['.c .ty',.7,.25,26,'#scr'],['.c .nw',.7,.3,26,'#scr'],['#rb',.55,.75,30],['#big',.9,.2,28],['#tt',.85,.2,32],['.c .ck',.5,.5,22,'#scr']])},2000);
 // tapping a toy you own: it jumps, spins and sparkles
 $$('.c.tap').forEach(c=>c.addEventListener('click',()=>{const ty=c.querySelector('.ty');
  ty&&ty.animate([{translate:'0 0',rotate:'0deg',scale:1},{translate:'0 -22px',rotate:'-12deg',scale:1.2,offset:.35},{translate:'0 2px',rotate:'360deg',scale:.95,offset:.8},{translate:'0 0',rotate:'360deg',scale:1}],{duration:700,easing:'cubic-bezier(.3,.8,.3,1)',composite:'add'});
  const p=pos(c,.5,.4);burst(p.x,p.y,180,12)}));
}
function shineBar(){const f=$('#pb .f');const s=document.createElement('div');s.style.cssText='position:absolute;inset:0;overflow:hidden;border-radius:10px;pointer-events:none';
 const b=document.createElement('div');b.style.cssText='position:absolute;top:0;bottom:0;width:40%;left:-50%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.65),transparent)';s.appendChild(b);f.appendChild(s);
 b.animate([{left:'-50%'},{left:'130%',offset:.4},{left:'130%'}],{duration:2800,iterations:Infinity,easing:'ease-in-out'})}

/* ================= SETTINGS ================= */
function settings(){
 A($('#tt'),TITLE,{duration:780,delay:120});
 A($('#rb'),RAMBO,{duration:820,delay:300,easing:'cubic-bezier(.3,.8,.3,1)'});
 A($('#pn'),RISE,{duration:720,delay:420});
 $$('#pn .row').forEach((r,i)=>{A(r,[{opacity:0,translate:'70px 0'},{opacity:1,translate:'-6px 0',offset:.65},{translate:'0 0'}],{duration:580,delay:560+i*95});
  A(r.querySelector('.ic'),[{opacity:0,scale:.2,rotate:'-30deg'},{opacity:1,scale:1.22,rotate:'8deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:540,delay:660+i*95});
  const tg=r.querySelector('.tg');tg&&A(tg,POP,{duration:520,delay:760+i*95})});
 // sliders sweep up to their values
 setTimeout(()=>$$('.sld').forEach((s,i)=>{const f=s.querySelector('.f'),k=s.querySelector('.k'),pc=document.getElementById('p_'+s.dataset.k),to=parseFloat(f.dataset.v)||0,s0=performance.now()+i*120;
  (function go(now){const u=Math.max(0,Math.min(1,(now-s0)/800)),e=1-Math.pow(1-u,3);f.style.width=k.style.left=(to*e)+'%';pc&&(pc.textContent=Math.round(to*e)+'%');
   if(u<1)requestAnimationFrame(go);else{bump(k,1.35);const p=pos(k);glint(p.x,p.y,34)}})(performance.now())}),1150);
 $$('.sld').forEach(s=>{const f=s.querySelector('.f'),k=s.querySelector('.k');f.dataset.v=f.style.width;f.style.width=k.style.left='0%'});
 // toggles: springy flip + sparkle when switched on
 $$('.tg').forEach(t=>t.addEventListener('click',()=>{const on=!t.classList.contains('off');
  t.animate([{scale:'1 1'},{scale:'.82 1.12',offset:.3},{scale:'1.12 .92',offset:.6},{scale:'1 1'}],{duration:380,easing:'ease-out'});
  if(on){const p=pos(t,.68,.5);burst(p.x,p.y,120,8)}}));
 // slider knob grows while you drag it and sparkles when you let go
 $$('.sld').forEach(s=>{const k=s.querySelector('.k');
  s.addEventListener('pointerdown',()=>k.animate([{scale:1},{scale:1.3}],{duration:160,fill:'forwards',easing:'cubic-bezier(.3,1.6,.5,1)'}));
  const up=()=>{k.animate([{scale:1.3},{scale:.92},{scale:1}],{duration:280,fill:'forwards',easing:'ease-out'});const p=pos(k);glint(p.x,p.y,30)};
  s.addEventListener('pointerup',up);s.addEventListener('pointercancel',up)});
 setTimeout(()=>{$$('#pn .row .ic').forEach((b,i)=>b.animate([{translate:'0 0'},{translate:'0 -3px'},{translate:'0 0'}],{duration:2400,delay:i*300,iterations:Infinity,easing:'ease-in-out'}));
  idle([['#tt',.85,.2,32],['#pn .row .ic',.75,.25,24],['.tg:not(.off)',.7,.35,24],['#rb',.7,.62,28]])},1900);
}
const go=()=>room==='toys'?toys():room==='settings'?settings():0;
if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>requestAnimationFrame(go));else requestAnimationFrame(go);
})();

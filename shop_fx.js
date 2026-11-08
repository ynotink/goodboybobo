/* Good Boy Bobo — Shop showcase motion.
   Bold spring entrance, idle life on the premium items, real sparkle art (a/fx/*), and the
   purchase celebration (light burst, sparkles, bones flying into the counter, number rolling up).
   SHOPFX.reward(buttonEl, amount) is the hook for real purchases later. ?fx=0 / reduced motion = off. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('fx')==='0')RM=true;
window.ROOMFX=!RM;               // tells motion.js to leave the Shop content to us
const DEMO=Q.get('demo')==='1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const R=Math.random,TW=[0,1,2,3,4,5].map(i=>`a/fx/tw${i}.webp`);
// preload the effect art so nothing pops in late
['a/fx/glint.webp','a/fx/burst.webp','a/i_bone1.webp',...TW].forEach(s=>{const i=new Image();i.src=s});

const app=$('#app');let L;
function layer(){if(L)return L;L=document.createElement('div');L.style.cssText='position:absolute;inset:0;z-index:60;pointer-events:none;overflow:hidden';app.appendChild(L);return L}
function pos(el,fx=.5,fy=.5){const a=app.getBoundingClientRect(),k=a.width/390,r=el.getBoundingClientRect();
 return{x:(r.left-a.left)/k+r.width/k*fx,y:(r.top-a.top)/k+r.height/k*fy,w:r.width/k,h:r.height/k}}
function sprite(src,x,y,s,z){const i=document.createElement('img');i.src=src;i.style.cssText=`position:absolute;left:${x-s/2}px;top:${y-s/2}px;width:${s}px;height:${s}px;object-fit:contain;will-change:transform,opacity;${z?'z-index:'+z:'mix-blend-mode:plus-lighter'}`;layer().appendChild(i);return i}
const done=(a,el)=>a.onfinish=()=>el.remove();

/* ---------- one sparkle glint ---------- */
function glint(x,y,s=34,src){const i=sprite(src||(R()<.5?'a/fx/glint.webp':TW[(R()*6)|0]),x,y,s);const d=650+R()*350,r0=R()*40-20;
 done(i.animate([{opacity:0,scale:.1,rotate:r0+'deg'},{opacity:1,scale:1,rotate:r0+25+'deg',offset:.4},{opacity:0,scale:.2,rotate:r0+70+'deg'}],{duration:d,easing:'cubic-bezier(.3,.7,.4,1)'}),i)}

/* ---------- entrance choreography ---------- */
function A(el,kf,o){if(!el)return;el.animate(kf,Object.assign({fill:'backwards',easing:'cubic-bezier(.25,.8,.3,1)'},o))}
const POP=[{opacity:0,scale:.3},{opacity:1,scale:1.12,offset:.55},{scale:.96,offset:.78},{scale:1}];
function enter(){
 const bnd=$('#bnd');
 A($('#tt'),[{opacity:0,translate:'0 -70px',scale:'1.3'},{opacity:1,translate:'0 6px',scale:'1.06 .9',offset:.55},{translate:'0 -4px',scale:'.97 1.04',offset:.76},{translate:'0 0',scale:'1'}],{duration:780,delay:120});
 A(bnd,[{opacity:0,translate:'0 56px',scale:.82},{opacity:1,translate:'0 -6px',scale:1.03,offset:.6},{translate:'0 2px',scale:.995,offset:.82},{translate:'0 0',scale:1}],{duration:720,delay:230});
 A($('#bnd .rb'),[{opacity:0,scale:.2,rotate:'-18deg'},{opacity:1,scale:1.14,rotate:'6deg',offset:.55},{scale:.96,rotate:'-2deg',offset:.78},{scale:1,rotate:'0deg'}],{duration:780,delay:470});
 A($('#bnd .h'),POP,{duration:560,delay:560});
 A($('#bnd .s'),[{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:420,delay:660});
 $$('#bnd .bs img').forEach((b,i)=>A(b,[{opacity:0,scale:.2,rotate:'-30deg'},{opacity:1,scale:1.25,rotate:'8deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:520,delay:720+i*85}));
 const buy=$('#bnd .buy');A(buy,[{opacity:0,scale:.4},{opacity:1,scale:1.12,offset:.55},{scale:.95,offset:.78},{scale:1}],{duration:600,delay:1040});
 $$('#in > .sec').forEach((s,i)=>A(s,[{opacity:0,translate:'0 -26px',scale:.8},{opacity:1,translate:'0 4px',scale:1.05,offset:.65},{translate:'0 0',scale:1}],{duration:560,delay:760+i*360}));
 A($('#bones'),[{opacity:0,translate:'0 40px',scale:.9},{opacity:1,translate:'0 -4px',scale:1.02,offset:.65},{translate:'0 0',scale:1}],{duration:620,delay:820});
 $$('#bones .row').forEach((r,i)=>{A(r,[{opacity:0,translate:'90px 0'},{opacity:1,translate:'-8px 0',offset:.65},{translate:'0 0'}],{duration:620,delay:930+i*120});
   A(r.querySelector('.ic'),[{opacity:0,scale:.2,rotate:'-25deg'},{opacity:1,scale:1.2,rotate:'6deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:560,delay:1050+i*120})});
 $$('.card.gl').forEach((c,i)=>A(c,POP,{duration:600,delay:1150+i*90}));
 // idle life once everything has landed
 setTimeout(()=>{
  if(buy){buy.classList.add('fx-breathe');window.FX&&FX.addShine(buy,'1s')}
  $$('#bones .imgbtn').forEach((b,i)=>window.FX&&FX.addShine(b,(2.2+i*.9)+'s'));
  $$('#bnd .bs img').forEach((b,i)=>b.animate([{translate:'0 0',rotate:'0deg'},{translate:'0 -5px',rotate:(i%2?4:-4)+'deg'},{translate:'0 0',rotate:'0deg'}],{duration:2200,delay:i*280,iterations:Infinity,easing:'ease-in-out'}));
  $$('.card .ic').forEach((b,i)=>b.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}],{duration:2600,delay:i*350,iterations:Infinity,easing:'ease-in-out'}));
  idleGlints()},1700);
}

/* ---------- idle glints on the premium things ---------- */
function idleGlints(){
 const scr=$('#scr');
 const spots=[['#bnd .rb',.62,.74,40],['#bnd .rb',.48,.62,26],['#bnd .buy',.9,.2,34],['#bnd .buy',.12,.3,24],['#bnd .h',.92,.15,30],
  ...[0,1,2,3].map(i=>[`#bnd .bs img:nth-child(${i+1})`,.75,.25,24]),['#tt',.85,.2,34],
  ...[1,2,3].map(i=>[`#bones .row:nth-child(${i}) .ic`,.7,.3,28]),...[1,2,3,4].map(i=>[`.card:nth-of-type(${i}) .ic`,.75,.25,28])];
 (function tick(){
  if(!document.hidden){const sr=scr.getBoundingClientRect();
   for(let n=0;n<2;n++){const [sel,fx,fy,s]=spots[(R()*spots.length)|0],el=$(sel);
    if(el){const r=el.getBoundingClientRect();if(sel==='#tt'||(r.top>sr.top+8&&r.bottom<sr.bottom-8)){const p=pos(el,fx+(R()-.5)*.15,fy+(R()-.5)*.15);glint(p.x,p.y,s*(.8+R()*.5))}}}}
  setTimeout(tick,420+R()*520)})();
}

/* ---------- purchase celebration ---------- */
function bump(el,k=1.3){el&&el.animate([{scale:1},{scale:k},{scale:.95},{scale:1}],{duration:320,easing:'ease-out'})}
function reward(btn,amount){
 const p=pos(btn),cnt=$$('.ghud .cnt')[1],ic=cnt&&cnt.querySelector('img'),v=cnt&&cnt.querySelector('.v');
 const t=ic?pos(ic):{x:200,y:82};
 // light burst + ring of sparkles
 const fl=document.createElement('div');fl.style.cssText=`position:absolute;left:${p.x-90}px;top:${p.y-90}px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,240,.95),rgba(255,230,150,.55) 35%,rgba(255,200,90,0) 70%);mix-blend-mode:plus-lighter`;layer().appendChild(fl);
 done(fl.animate([{opacity:0,scale:.2},{opacity:1,scale:1.1,offset:.18},{opacity:0,scale:1.8}],{duration:620,easing:'ease-out'}),fl);
 const b=sprite('a/fx/burst.webp',p.x,p.y,340);const b2=sprite('a/fx/glint.webp',p.x,p.y,220);
 done(b2.animate([{opacity:0,scale:.1,rotate:'0deg'},{opacity:1,scale:1.2,rotate:'15deg',offset:.25},{opacity:0,scale:.3,rotate:'60deg'}],{duration:800,easing:'ease-out'}),b2);
 done(b.animate([{opacity:0,scale:.15,rotate:'0deg'},{opacity:1,scale:1,rotate:'20deg',offset:.22},{opacity:0,scale:1.7,rotate:'55deg'}],{duration:950,easing:'cubic-bezier(.2,.7,.3,1)'}),b);
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2+R()*.3,d=90+R()*100,s=26+R()*26,sp=sprite(TW[i%6],p.x,p.y,s);
  done(sp.animate([{opacity:1,translate:'0 0',scale:.3},{opacity:1,translate:`${Math.cos(a)*d*.75}px ${Math.sin(a)*d*.75}px`,scale:1.1,offset:.5},{opacity:0,translate:`${Math.cos(a)*d}px ${Math.sin(a)*d+20}px`,scale:.3}],{duration:700+R()*300,easing:'cubic-bezier(.15,.8,.3,1)'}),sp)}
 // "+100" pop
 const tx=document.createElement('div');tx.textContent='+'+amount.toLocaleString();
 const tcx=Math.max(110,Math.min(280,p.x));tx.style.cssText=`position:absolute;left:${tcx-100}px;top:${p.y-40}px;width:200px;text-align:center;font:900 48px Nun,sans-serif;color:#fff;-webkit-text-stroke:2px #8a4a12;paint-order:stroke fill;text-shadow:0 3px 0 #8a4a12,0 0 18px rgba(255,210,90,.9);z-index:3`;
 layer().appendChild(tx);
 done(tx.animate([{opacity:0,scale:.3,translate:'0 10px'},{opacity:1,scale:1.25,translate:'0 -18px',offset:.25},{opacity:1,scale:1,translate:'0 -30px',offset:.6},{opacity:0,scale:.9,translate:'0 -70px'}],{duration:1500,easing:'cubic-bezier(.2,.8,.3,1)'}),tx);
 // bones fly to the counter
 const N=Math.min(16,8+Math.round(Math.log10(amount)*2.5)),from=G.bones,to=G.bones+amount;let landed=0;
 for(let i=0;i<N;i++){const bone=sprite('a/i_bone1.webp',p.x,p.y,50,2);
  const ex=p.x+(R()-.5)*150,ey=p.y-30-R()*90,cx=(ex+t.x)/2+(R()-.5)*120,cy=Math.min(ey,t.y)-60-R()*80,spin=(R()<.5?-1:1)*(360+R()*360);
  const t0=performance.now()+i*55,D1=260,D2=620+R()*160;
  (function fr(now){const e=now-t0;if(e<0){bone.style.opacity=0;return requestAnimationFrame(fr)}bone.style.opacity=1;
   let x,y,s,r;
   if(e<D1){const u=1-Math.pow(1-e/D1,3);x=p.x+(ex-p.x)*u;y=p.y+(ey-p.y)*u;s=.4+.8*u;r=spin*.15*u}
   else{let u=Math.min(1,(e-D1)/D2);u=u*u*(3-2*u);const q=1-u;x=q*q*ex+2*q*u*cx+u*u*t.x;y=q*q*ey+2*q*u*cy+u*u*t.y;s=1.2-.65*u;r=spin*(.15+.85*u)}
   bone.style.transform=`translate(${x-p.x}px,${y-p.y}px) rotate(${r}deg) scale(${s})`;
   if(e<D1+D2)requestAnimationFrame(fr);
   else{bone.remove();landed++;bump(ic,1.35);glint(t.x+(R()-.5)*20,t.y+(R()-.5)*14,30);
    if(landed===1&&cnt)cnt.animate([{boxShadow:'0 0 0 0 rgba(255,215,110,0)'},{boxShadow:'0 0 22px 6px rgba(255,215,110,.85)',offset:.3},{boxShadow:'0 0 0 0 rgba(255,215,110,0)'}],{duration:1400})}})(performance.now())}
 // number rolls up while the bones arrive
 if(v){const s0=performance.now()+300,D=N*55+900;G.bones=to;
  (function roll(now){const u=Math.max(0,Math.min(1,(now-s0)/D)),e=1-Math.pow(1-u,3);v.textContent=Math.round(from+(to-from)*e).toLocaleString();
   if(u<1)requestAnimationFrame(roll);else{v.textContent=to.toLocaleString();bump(v,1.25)}})(performance.now())}
 if(!DEMO){try{const s=JSON.parse(localStorage.getItem('gbb')||'{}');s.bones=to;localStorage.setItem('gbb',JSON.stringify(s))}catch(e){}}
}
window.SHOPFX={reward,glint};

if(RM)return;
if(DEMO){ // showcase: the bone packs play the full purchase celebration
 const AMT=[100,550,1200];
 $$('#bones .imgbtn').forEach((b,i)=>{b.onclick=null;b.addEventListener('click',()=>reward(b,AMT[i]))})}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>requestAnimationFrame(enter));else requestAnimationFrame(enter);
})();

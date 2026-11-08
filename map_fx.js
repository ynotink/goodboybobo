/* Good Boy Bobo — Map motion (Phase 3).
   Glide to your level, nodes popping in, Rambo dropping in and hopping, a living glow on the current level
   (turning light rays + golden ring ripples + glints), star glints on finished levels, chapter weather (dust, snow, rain,
   leaves, bubbles, fireflies, confetti), shimmering water, paw prints to the next level and soft cloud shadows. Real art from a/fx. ?fx=0 / reduced motion = off. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('fx')==='0'||RM)return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=Math.random;
const TW=[0,1,2,3,4,5].map(i=>`a/fx/tw${i}.webp`);
['a/fx/glint.webp','a/fx/burst.webp','a/fx/ring.webp','a/fx/cloud0.webp','a/fx/cloud1.webp','a/fx/cloud2.webp',...TW].forEach(s=>{const i=new Image();i.src=s});
const app=$('.app'),sc=$('#scroll'),world=$('#world');
const css=`
.mfx-l{position:absolute;pointer-events:none}
.mfx-s{position:absolute;pointer-events:none;mix-blend-mode:plus-lighter;will-change:transform,opacity}
.rbx{overflow:visible!important;border:0!important;background:none!important;box-shadow:none!important}
.rbx .rbin{position:absolute;inset:0;border-radius:50%;overflow:hidden;border:3px solid #fff;background:radial-gradient(#fffaf0,#f0deb2);box-shadow:0 4px 9px rgba(30,40,10,.35);transform-origin:50% 100%}
.rbx .rbin img{width:100%;height:100%}
.rbx .shd{position:absolute;left:12%;right:12%;bottom:-12px;height:12px;border-radius:50%;background:radial-gradient(rgba(25,40,10,.45),rgba(25,40,10,0) 70%)}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* world layer: scrolls with the map, sits under the nodes */
const WL=document.createElement('div');WL.className='mfx-l';WL.style.cssText='left:0;top:0;width:390px;height:100%;z-index:9';world.appendChild(WL);
const FX=document.createElement('div');FX.className='mfx-l';FX.style.cssText='left:0;top:0;width:390px;height:100%;z-index:12';world.appendChild(FX);
function spr(src,x,y,s,parent=FX){const i=document.createElement('img');i.className='mfx-s';i.src=src;i.style.cssText=`left:${x-s/2}px;top:${y-s/2}px;width:${s}px;height:${s}px;object-fit:contain`;parent.appendChild(i);return i}
const done=(a,el)=>a.onfinish=()=>el.remove();
function glint(x,y,s=30){const i=spr(R()<.5?'a/fx/glint.webp':TW[(R()*6)|0],x,y,s),r0=R()*40-20;
 done(i.animate([{opacity:0,scale:.1,rotate:r0+'deg'},{opacity:1,scale:1,rotate:r0+25+'deg',offset:.4},{opacity:0,scale:.2,rotate:r0+70+'deg'}],{duration:650+R()*350,easing:'cubic-bezier(.3,.7,.4,1)'}),i)}
function burst(x,y,size=220,n=12){const b=spr('a/fx/burst.webp',x,y,size);
 done(b.animate([{opacity:0,scale:.15,rotate:'0deg'},{opacity:1,scale:1,rotate:'20deg',offset:.22},{opacity:0,scale:1.6,rotate:'55deg'}],{duration:900,easing:'cubic-bezier(.2,.7,.3,1)'}),b);
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R()*.3,d=size*.3+R()*size*.25,p=spr(TW[i%6],x,y,18+R()*20);
  done(p.animate([{opacity:1,translate:'0 0',scale:.3},{opacity:1,translate:`${Math.cos(a)*d*.75}px ${Math.sin(a)*d*.75}px`,scale:1.1,offset:.5},{opacity:0,translate:`${Math.cos(a)*d}px ${Math.sin(a)*d+14}px`,scale:.3}],{duration:700+R()*300,easing:'cubic-bezier(.15,.8,.3,1)'}),p)}}
const xy=el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)});
const inView=y=>y>sc.scrollTop-40&&y<sc.scrollTop+884;

/* ---------- screen layer: cloud shadows + chapter weather + water shimmer ---------- */
const MHW=typeof MH!=='undefined'?MH:world.scrollHeight;
const BND=['boundary','b3','b4','b5','b6','b7','b8','b9','b10','b11','b12','b13','b14','b15','b16','b17','b18','b19','b20','b21','b22','b23','b24','b25','b26','b27','b28','b29','b30'].map(k=>T[k]*MHW);
const chapAt=y=>{let c=1;for(const b of BND)if(y<=b)c++;return c};
const chapRange=c=>[c>=30?-1e9:BND[c-1],c<=1?1e9:BND[c-2]];        // [top,bottom] in world y
const IMG=n=>{const i=new Image();i.src=`a/fx/${n}.webp`;return i};
const S={mote:IMG('mote'),fly:IMG('firefly'),bub:IMG('bubble'),glint:IMG('glint'),
 snow:[0,1,2,3,4,5].map(i=>IMG('snow'+i)),rain:[0,1,2,3].map(i=>IMG('rain'+i)),leaf:[0,1,2,3,4,5].map(i=>IMG('leaf'+i)),tw:[0,1,2,3,4,5].map(i=>IMG('tw'+i))};
// what lives in each chapter (density = particles per screen)
const EFF={};for(let c=1;c<=30;c++)EFF[c]={t:'dust',n:30};
Object.assign(EFF,{9:{t:'snow',n:60},29:{t:'snow',n:66},16:{t:'rain',n:60},22:{t:'rain',n:34},27:{t:'leaf',n:16},
 11:{t:'bub',n:30},19:{t:'bub',n:24},10:{t:'fly',n:26},26:{t:'fly',n:20},28:{t:'conf',n:50},30:{t:'gold',n:34}});
const CONF=['#ff5a6e','#ffc93c','#4fc3f7','#7ed957','#b388ff','#ff8a3d'];
let WATER=[];fetch('a/fx/water.json').then(r=>r.json()).then(p=>{WATER=p.sort((a,b)=>a[1]-b[1])}).catch(()=>{});
function overlays(){
 // Everything lives ON the map (inside the scrolling world), so it scrolls with the scenery exactly and never hovers.
 // Each particle is its own little element animated by the phone's compositor: smooth, no lag while scrolling.
 const PL=document.createElement('div');PL.className='mfx-l';PL.style.cssText='left:0;top:0;width:390px;height:100%;z-index:13;overflow:hidden';world.appendChild(PL);
 const CL=document.createElement('div');CL.className='mfx-l';CL.style.cssText='left:0;top:0;width:390px;height:100%;z-index:8;overflow:hidden';world.appendChild(CL);
 const live=new Set();
 function el(src,x,y,w,h,blend){const i=document.createElement(src?'img':'div');if(src)i.src=src;
  i.style.cssText=`position:absolute;left:${x-w/2}px;top:${y-h/2}px;width:${w}px;height:${h}px;pointer-events:none;will-change:transform,opacity;${blend?'mix-blend-mode:plus-lighter;':''}`;PL.appendChild(i);return i}
 const fin=(a,i,p)=>{live.add(p);a.onfinish=()=>{i.remove();live.delete(p)}};
 function spawn(c,y0,y1,edge){const t=EFF[c].t,x=R()*390;let y=y0+R()*(y1-y0);const p={c,y};
  if(t==='dust'||t==='gold'){const star=R()<(t==='gold'?.35:.14),s=star?(t==='gold'?14+R()*12:9+R()*7):7+R()*6,i=el(star?TW[[0,3,1][(R()*3)|0]]:'a/fx/mote.webp',x,y,s,s,1),
    dx=(R()-.5)*40,dy=-20-R()*40,d=4000+R()*4000;
   fin(i.animate(star?[{opacity:0,scale:.2,translate:'0 0'},{opacity:0,offset:.3},{opacity:1,scale:1,offset:.45},{opacity:0,scale:.3,offset:.6},{opacity:0,translate:`${dx}px ${dy}px`}]
    :[{opacity:0,translate:'0 0'},{opacity:.9,offset:.2},{opacity:.55,translate:`${dx*.5+(R()-.5)*10}px ${dy*.5}px`,offset:.5},{opacity:.9,offset:.75},{opacity:0,translate:`${dx}px ${dy}px`}],{duration:d,easing:'ease-in-out'}),i,p)}
  else if(t==='snow'){const k=(R()*6)|0,s=(k%3===0?20:k%3===1?16:13)*(.8+R()*.4),i=el(`a/fx/snow${k}.webp`,x,y,s,s);i.style.filter='drop-shadow(0 1px 2px rgba(30,50,100,.75))';
   const fall=220+R()*200,d=fall/(.5+R()*.4)*16.7,sw=(R()-.5)*30;
   fin(i.animate([{opacity:0,translate:'0 0'},{opacity:1,offset:.12},{translate:`${sw}px ${fall*.5}px`,offset:.5},{opacity:1,offset:.85},{opacity:0,translate:`${-sw*.4}px ${fall}px`}],{duration:d,easing:'linear'}),i,p)}
  else if(t==='rain'){const s=30+R()*18,i=el(`a/fx/rain${(R()*4)|0}.webp`,x,y,5,s,1);i.style.rotate='7deg';const d=380+R()*200;
   fin(i.animate([{opacity:0,translate:'0 0'},{opacity:.95,offset:.15},{opacity:.9,offset:.8},{opacity:0,translate:'-22px 170px'}],{duration:d,easing:'linear'}),i,p)}
  else if(t==='leaf'){const s=16+R()*9,i=el(`a/fx/leaf${(R()*6)|0}.webp`,x,y,s,s);i.style.filter='drop-shadow(0 2px 2px rgba(40,25,10,.35))';
   const fall=260+R()*160,d=fall/(.5+R()*.3)*16.7,r=(R()<.5?-1:1)*(200+R()*300),sw=20+R()*30,kf=[];
   for(let k=0;k<=8;k++){const u=k/8;kf.push({offset:u,opacity:u<.1?u*10:u>.88?(1-u)/.12:1,translate:`${Math.sin(u*Math.PI*3)*sw}px ${fall*u}px`,rotate:`${r*u}deg`,scale:`1 ${.35+.65*Math.abs(Math.cos(u*Math.PI*4))}`})}
   fin(i.animate(kf,{duration:d,easing:'linear'}),i,p)}
  else if(t==='bub'){const s=16+R()*22,i=el('a/fx/bubble.webp',x,y,s,s,1),rise=160+R()*160,d=rise/(.35+R()*.3)*16.7,sw=10+R()*14,kf=[];
   for(let k=0;k<=6;k++){const u=k/6;kf.push({offset:u,opacity:u<.12?u/.12:u>.9?(1-u)/.1:.95,translate:`${Math.sin(u*Math.PI*2.5)*sw}px ${-rise*u}px`,scale:u>.92?1.25:1})}
   fin(i.animate(kf,{duration:d,easing:'linear'}),i,p)}
  else if(t==='fly'){const s=18+R()*14,i=el('a/fx/firefly.webp',x,y,s,s,1),kf=[];let px=0,py=0;
   for(let k=0;k<=8;k++){const u=k/8;px+=(R()-.5)*30;py+=(R()-.5)*24;kf.push({offset:u,translate:`${px}px ${py}px`,opacity:u===0||u===1?0:(k%2?1:.25)})}
   fin(i.animate(kf,{duration:6000+R()*3000,easing:'ease-in-out'}),i,p)}
  else if(t==='conf'){const w=7+R()*4,h=12+R()*5,i=el(null,x,y,w,h);i.style.background=CONF[(R()*6)|0];i.style.borderRadius='2px';i.style.boxShadow='0 1.5px 2px rgba(40,25,10,.3)';
   const fall=240+R()*160,d=fall/(.6+R()*.4)*16.7,r=(R()<.5?-1:1)*(300+R()*400),sw=(R()-.5)*50,kf=[];
   for(let k=0;k<=8;k++){const u=k/8;kf.push({offset:u,opacity:u<.08?u/.08:u>.9?(1-u)/.1:1,translate:`${sw*Math.sin(u*Math.PI)}px ${fall*u}px`,rotate:`${r*u}deg`,scale:`${Math.cos(u*Math.PI*6)} 1`})}
   fin(i.animate(kf,{duration:d,easing:'linear'}),i,p)}
 }
 // soft cloud shadows drifting across the yard, also on the map
 function cloud(first){const st=sc.scrollTop,w=440+R()*220,y=st-100+R()*900,c=document.createElement('img');c.src=`a/fx/cloud${(R()*3)|0}.webp`;
  c.style.cssText=`position:absolute;left:0;top:${y}px;width:${w}px;height:auto;pointer-events:none;opacity:.16;filter:brightness(0) saturate(0);mix-blend-mode:multiply`;CL.appendChild(c);
  const d=42000+R()*16000,a=c.animate([{translate:`${-w-20}px 0`},{translate:`410px 30px`}],{duration:d,easing:'linear'});if(first)a.currentTime=d*(.25+.5*R());a.onfinish=()=>{c.remove();cloud()}}
 cloud(true);setTimeout(()=>cloud(true),300);
 // keep each chapter on screen topped up (spawn a few at a time; they fade in, so nothing pops)
 function segs(st){const out=[],top=st-80,bot=st+924;let c=chapAt(bot);
  while(c<=30){const [a,b]=chapRange(c),y0=Math.max(a,top),y1=Math.min(b,bot);if(y1>y0)out.push([c,y0,y1]);if(a<=top)break;c++}return out}
 let first=true;
 (function tick(){if(!document.hidden){const st=sc.scrollTop,top=st-80,bot=st+924;
   for(const [c,y0,y1] of segs(st)){const e=EFF[c],want=Math.round(e.n*(y1-y0)/844);let have=0;for(const p of live)if(p.c===c&&p.y>top&&p.y<bot)have++;
    const deficit=want-have,edge=!first&&deficit<=Math.max(2,want*.25),burst=first?deficit:Math.min(deficit,Math.ceil(want/6));
    for(let i=0;i<burst&&live.size<260;i++)spawn(c,y0,y1,edge)}
   first=false;
   // water shimmer
   if(WATER.length){let lo=0,hi=WATER.length;while(lo<hi){const m=(lo+hi)>>1;WATER[m][1]<st-40?lo=m+1:hi=m}let e=lo;while(e<WATER.length&&WATER[e][1]<st+884)e++;
    const n=e>lo?Math.min(4,1+((e-lo)/120)|0):0;for(let i=0;i<n;i++){const q=WATER[lo+((R()*(e-lo))|0)],s=10+R()*14,
     im=spr(R()<.35?'a/fx/glint.webp':TW[[0,3,1][(R()*3)|0]],q[0]+(R()-.5)*6,q[1],s,WL),dx=(R()-.5)*14;
     done(im.animate([{opacity:0,scale:.3,translate:'0 0'},{opacity:.95,scale:1,offset:.45},{opacity:0,scale:.4,translate:`${dx}px 0`}],{duration:700+R()*600,easing:'ease-in-out'}),im)}}}
  setTimeout(tick,110)})();
}

/* ---------- paw prints walking from your level to the next ---------- */
function paws(){
 const ms=$$('.mk'),ci=ms.findIndex(m=>m.classList.contains('cur'));if(ci<0||ci>=ms.length-1)return;
 const a=xy(ms[ci]),b=xy(ms[ci+1]),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,ang=Math.atan2(dy,dx)*180/Math.PI+90;
 const n=Math.max(3,Math.floor((L-60)/15)),pr=[];
 for(let i=0;i<n;i++){const d=32+i*((L-64)/(n-1||1)),side=i%2?1:-1,x=a.x+ux*d-uy*side*5,y=a.y+uy*d+ux*side*5;
  const im=document.createElement('img');im.src='a/fx/paw.webp';im.className='mfx-s';im.style.cssText=`left:${x-8}px;top:${y-8}px;width:16px;height:16px;object-fit:contain;opacity:0;rotate:${ang}deg`;WL.appendChild(im);pr.push(im)}
 function walk(){if(!document.hidden)pr.forEach((im,i)=>im.animate([{opacity:0,scale:.3},{opacity:.95,scale:1.15,offset:.08},{opacity:.85,scale:1,offset:.16},{opacity:.85,offset:.7},{opacity:0,scale:1}],{duration:3400,delay:i*170,easing:'ease-out'}));
  setTimeout(walk,3400+pr.length*170+600)}
 setTimeout(walk,1900);
}

/* ---------- current level glow + Rambo ---------- */
function curFx(){
 const n=$('.mk.cur');if(!n)return;const p=xy(n);
 const rays=spr('a/fx/burst.webp',p.x,p.y,150,WL);rays.style.opacity=.75;
 rays.animate([{rotate:'0deg'},{rotate:'360deg'}],{duration:16000,iterations:Infinity});
 rays.animate([{scale:.9,opacity:.55},{scale:1.08,opacity:.85},{scale:.9,opacity:.55}],{duration:1600,iterations:Infinity,easing:'ease-in-out',composite:'add'});
 (function ripple(){const r=spr('a/fx/ring.webp',p.x,p.y,80,WL);
  done(r.animate([{opacity:0,scale:.7},{opacity:1,scale:.95,offset:.2},{opacity:0,scale:1.9}],{duration:1500,easing:'cubic-bezier(.2,.6,.4,1)'}),r);setTimeout(ripple,1600)})();
 (function sp(){if(!document.hidden&&inView(p.y)){const a=R()*Math.PI*2,d=26+R()*18;glint(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,22+R()*16)}setTimeout(sp,380+R()*420)})();
 // locked levels shake; the current one bursts as you tap it
 n.addEventListener('pointerdown',()=>burst(p.x,p.y,200,12));
 $$('.mk.lock').forEach(l=>l.addEventListener('click',()=>l.animate([{translate:'0 0'},{translate:'-6px 0'},{translate:'6px 0'},{translate:'-4px 0'},{translate:'3px 0'},{translate:'0 0'}],{duration:380})));
}
function rambo(){
 const rb=$('.rbx');if(!rb)return;const img=rb.querySelector('img');
 const inner=document.createElement('div');inner.className='rbin';img.replaceWith(inner);inner.appendChild(img);
 const sh=document.createElement('div');sh.className='shd';rb.insertBefore(sh,inner);
 // drop in
 inner.animate([{translate:'0 -160px',scale:'.9 1.1',opacity:0},{translate:'0 -160px',opacity:1,offset:.05},{translate:'0 0',scale:'1 1',offset:.55},{translate:'0 0',scale:'1.18 .8',offset:.68},{translate:'0 -14px',scale:'.94 1.06',offset:.84},{translate:'0 0',scale:'1 1'}],{duration:950,delay:650,fill:'backwards',easing:'cubic-bezier(.5,0,.5,1)'});
 sh.animate([{scale:.3,opacity:0},{scale:1,opacity:1}],{duration:600,delay:900,fill:'backwards'});
 // happy hops
 function hop(){if(!document.hidden){
   inner.animate([{translate:'0 0',scale:'1 1'},{translate:'0 0',scale:'1.1 .9',offset:.12},{translate:'0 -22px',scale:'.94 1.07',offset:.4},{translate:'0 -24px',scale:'1 1',offset:.5},{translate:'0 0',scale:'1.12 .88',offset:.8},{translate:'0 0',scale:'1 1'}],{duration:620,easing:'ease-in-out'});
   sh.animate([{scale:1,opacity:1},{scale:.6,opacity:.5,offset:.45},{scale:1,opacity:1,offset:.8},{scale:1,opacity:1}],{duration:620});
   if(R()<.5)setTimeout(()=>inner.animate([{translate:'0 0',scale:'1 1'},{translate:'0 -12px',scale:'.96 1.04',offset:.45},{translate:'0 0',scale:'1.08 .92',offset:.8},{translate:'0 0',scale:'1 1'}],{duration:420,easing:'ease-in-out'}),680)}
  setTimeout(hop,2300+R()*1400)}
 setTimeout(hop,2400);
}

/* ---------- entrance: glide to your level, nodes pop in around it ---------- */
function enter(){
 const cur=$('.mk.cur'),cp=cur?xy(cur):{y:sc.scrollTop+464};
 const target=sc.scrollTop,from=Math.min(world.scrollHeight-844,target+320);
 sc.scrollTop=from;const t0=performance.now(),D=1100;
 (function g(now){const u=Math.min(1,(now-t0)/D),e=1-Math.pow(1-u,3);sc.scrollTop=from+(target-from)*e;if(u<1)requestAnimationFrame(g)})(t0);
 const vis=$$('.mk').filter(m=>inView(xy(m).y)).map(m=>[m,Math.hypot(xy(m).x-cp.x,xy(m).y-cp.y)]).sort((a,b)=>a[1]-b[1]);
 vis.forEach(([m,d],i)=>{m.animate([{opacity:0,scale:.2},{opacity:1,scale:1.18,offset:.6},{scale:.95,offset:.8},{scale:1}],{duration:520,delay:250+i*55,fill:'backwards',easing:'cubic-bezier(.3,.8,.3,1)',composite:'add'});
  m.querySelectorAll('.s img').forEach((s,k)=>s.animate([{opacity:0,scale:0,rotate:'-60deg'},{opacity:1,scale:1.4,rotate:'10deg',offset:.6},{scale:1,rotate:'0deg'}],{duration:420,delay:600+i*55+k*90,fill:'backwards'}))});
 $$('.cplq').filter(c=>inView(parseFloat(c.style.top))).forEach((c,i)=>c.animate([{opacity:0,scale:'.4 1'},{opacity:1,scale:'1.06 1',offset:.6},{scale:'1 1'}],{duration:520,delay:300+i*120,fill:'backwards',composite:'add'}));
 if(cur)setTimeout(()=>burst(cp.x,cp.y,230,14),1050);
 curFx();rambo();overlays();paws();
 // twinkles on stars of finished levels
 (function tw(){if(!document.hidden){const S=$$('.mk.done .s img').filter(s=>inView(xy(s.closest('.mk')).y));
   if(S.length){const s=S[(R()*S.length)|0],m=s.closest('.mk'),p=xy(m),r=s.getBoundingClientRect(),mr=m.getBoundingClientRect(),k=mr.width/m.offsetWidth;
    glint(p.x+(r.left+r.width/2-mr.left-mr.width/2)/k,p.y+(r.top+r.height/2-mr.top-mr.height/2)/k,20+R()*10)}}
  setTimeout(tw,500+R()*600)})();
}
// the map script places the scroll on load; start right after that
let started=false;const go=()=>{if(started)return;started=true;requestAnimationFrame(enter)};
if(document.readyState==='complete')go();else addEventListener('load',()=>setTimeout(go,0));
})();

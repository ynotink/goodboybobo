/* Good Boy Bobo — Candy Crush-style win flow, no pop-up box:
   1) "Good Boy!" moment over the dimmed board, Rambo jumps up cheering, confetti
   2) Zoomies bonus: leftover moves blast across the board (tap to skip)
   3) full-screen "Level Complete!" scene: level badge, paw medals stamp in one by one, bones count up,
      Rambo bouncing, rays + confetti; then the next level drops in on a cloud and we head to the map. */
(function(){
const css=document.createElement('style');css.textContent=`
#wfs{position:fixed;inset:0;z-index:400;pointer-events:none;font-family:KNun,BoboNunito,system-ui;-webkit-user-select:none;user-select:none;overflow:hidden}
#wfs.on{pointer-events:auto}
#wfs .col{position:absolute;top:0;bottom:0;overflow:hidden}
#wfs canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6}
/* phase 1 */
#wfs .dim{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(20,60,70,.55),rgba(6,22,30,.86));opacity:0;transition:opacity .3s}
#wfs .dim.in{opacity:1}
#wfs .word{position:absolute;left:50%;top:24%;width:78%;transform:translate(-50%,-50%) scale(0);filter:drop-shadow(0 6px 8px rgba(0,0,0,.45));z-index:5}
#wfs .word.in{animation:wfWord .55s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .sub1{position:absolute;left:0;right:0;top:32.5%;text-align:center;color:#fff;font-size:calc(var(--k)*22);text-shadow:0 2px 0 rgba(0,40,45,.6),0 0 8px rgba(0,0,0,.35);opacity:0;z-index:5}
#wfs .sub1.in{animation:wfFade .35s ease-out .25s forwards}
#wfs .ram1{position:absolute;left:50%;bottom:-7%;width:80%;filter:drop-shadow(0 0 calc(var(--k)*18) rgba(255,230,150,.55));transform:translate(-50%,105%);z-index:4}
#wfs .ram1.in{animation:wfJump .7s cubic-bezier(.2,1.5,.45,1) forwards,wfHop .9s ease-in-out .75s infinite}
#wfs .ram1.out{animation:wfDive .35s ease-in forwards}
#wfs .skip{position:absolute;left:0;right:0;bottom:calc(var(--k)*92);text-align:center;color:#fff;font-size:calc(var(--k)*17);text-shadow:0 2px 3px rgba(0,0,0,.55);opacity:0;transition:opacity .3s;z-index:7}
#wfs .skip.in{opacity:1;animation:wfPulse 1.6s ease-in-out infinite}
/* phase 3 */
#wfs .scene{position:absolute;inset:0;opacity:0;transition:opacity .35s;background:linear-gradient(180deg,#4fc0ec 0%,#8fd3f2 30%,#ffd3a8 70%,#ffab84 100%)}
#wfs .scene.in{opacity:1}
#wfs .rays{position:absolute;left:50%;top:31%;width:240%;aspect-ratio:1;transform:translate(-50%,-50%);background:repeating-conic-gradient(rgba(255,255,255,.22) 0 9deg,rgba(255,255,255,0) 9deg 22.5deg);-webkit-mask-image:radial-gradient(circle,#000 0,#000 18%,transparent 52%);mask-image:radial-gradient(circle,#000 0,#000 18%,transparent 52%);animation:wfSpin 18s linear infinite}
#wfs .glow{position:absolute;left:50%;top:31%;width:95%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,250,225,.9),rgba(255,240,200,.35) 38%,rgba(255,240,200,0) 66%)}
#wfs .cloud{position:absolute;border-radius:999px;background:#fff;opacity:.85;filter:blur(.5px)}
#wfs .cloud::before,#wfs .cloud::after{content:'';position:absolute;background:#fff;border-radius:50%}
#wfs .cloud::before{width:55%;height:150%;left:12%;bottom:30%}#wfs .cloud::after{width:42%;height:120%;right:12%;bottom:35%}
#wfs .ttl{position:absolute;left:0;right:0;top:9%;text-align:center;color:#fff;font-size:calc(var(--k)*42);line-height:1;-webkit-text-stroke:calc(var(--k)*7) #17606a;paint-order:stroke fill;filter:drop-shadow(0 calc(var(--k)*4) 0 rgba(10,60,66,.55));transform:scale(0);z-index:3}
#wfs .ttl.in{animation:wfPop .5s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .sub{position:absolute;left:0;right:0;top:17%;text-align:center;color:#fff;font-size:calc(var(--k)*17);line-height:1.3;text-shadow:0 2px 0 rgba(23,96,106,.7);opacity:0;z-index:3}
#wfs .sub.in{animation:wfFade .4s ease-out forwards}
#wfs .badge{position:absolute;left:50%;top:31%;width:calc(var(--k)*124);aspect-ratio:320/320;transform:translate(-50%,-62%) scale(0);z-index:3}
#wfs .badge img{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 6px 5px rgba(120,40,0,.45))}
#wfs .badge b{position:absolute;left:0;right:0;top:44%;height:44%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:400;font-size:calc(var(--k)*40);text-shadow:0 3px 2px rgba(150,50,10,.5)}
#wfs .badge.in{animation:wfBadge .55s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .meds{position:absolute;left:50%;top:39.5%;width:calc(var(--k)*290);height:calc(var(--k)*100);transform:translateX(-50%);z-index:4}
#wfs .med{position:absolute;bottom:0;transform:scale(0);filter:drop-shadow(0 5px 4px rgba(20,60,66,.45))}
#wfs .med.off{filter:grayscale(1) brightness(1.25) opacity(.55) drop-shadow(0 3px 3px rgba(20,60,66,.3));transform:scale(1)}
#wfs .med.in{animation:wfStamp .45s cubic-bezier(.3,1.8,.5,1) forwards}
#wfs .bones{position:absolute;left:50%;top:53.5%;transform:translateX(-50%) scale(0);display:flex;align-items:center;gap:calc(var(--k)*8);padding:calc(var(--k)*6) calc(var(--k)*20) calc(var(--k)*6) calc(var(--k)*12);border-radius:999px;background:linear-gradient(#fffaf0,#f6e6c8);box-shadow:0 calc(var(--k)*4) 0 #d9b98a,0 calc(var(--k)*8) calc(var(--k)*12) rgba(90,40,10,.35);color:#17474d;font-size:calc(var(--k)*26);white-space:nowrap;z-index:4}
#wfs .bones img{height:calc(var(--k)*30)}
#wfs .bones.in{animation:wfPopX .45s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .ram3{position:absolute;left:50%;bottom:-3%;width:74%;transform:translate(-50%,110%);z-index:2}
#wfs .ram3.in{animation:wfJump .65s cubic-bezier(.2,1.5,.45,1) forwards,wfHop 1s ease-in-out .7s infinite}
#wfs .next{position:absolute;left:50%;top:-20%;transform:translateX(-50%);z-index:5;display:flex;flex-direction:column;align-items:center}
#wfs .next i{display:block;width:2px;height:calc(var(--k)*70);background:rgba(255,255,255,.85)}
#wfs .next div{position:relative;padding:calc(var(--k)*10) calc(var(--k)*30);border-radius:999px;background:#fff;color:#17606a;font-size:calc(var(--k)*24);box-shadow:0 calc(var(--k)*5) 0 #cfe6ee,0 calc(var(--k)*10) calc(var(--k)*14) rgba(20,70,90,.3)}
#wfs .next div::before{content:'';position:absolute;left:-12%;top:12%;width:42%;height:95%;background:#fff;border-radius:50%;z-index:-1}
#wfs .next div::after{content:'';position:absolute;right:-12%;top:18%;width:38%;height:90%;background:#fff;border-radius:50%;z-index:-1}
#wfs .next.in{animation:wfDrop .7s cubic-bezier(.3,1.4,.5,1) forwards}
#wfs .tap{position:absolute;left:0;right:0;bottom:3.5%;text-align:center;color:#fff;font-size:calc(var(--k)*17);text-shadow:0 2px 2px rgba(120,40,0,.45);opacity:0;z-index:7}
#wfs .tap.in{animation:wfFade .3s forwards,wfPulse 1.6s ease-in-out .3s infinite}
#wfs .front{position:absolute;left:-10%;right:-10%;bottom:-2%;height:12%;z-index:3;pointer-events:none}
#wfs .front .cloud{opacity:1}
#wfs .ttl,#wfs .sub{transition:opacity .35s}#wfs .hideT{opacity:0!important}
#wfs .fadeout{position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .45s;z-index:9}
@keyframes wfWord{0%{transform:translate(-50%,-50%) scale(0) rotate(-8deg)}70%{transform:translate(-50%,-50%) scale(1.12) rotate(2deg)}100%{transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes wfFade{to{opacity:1}}
@keyframes wfPulse{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes wfJump{0%{transform:translate(-50%,105%)}100%{transform:translate(-50%,0)}}
@keyframes wfHop{0%,100%{transform:translate(-50%,0) scale(1,1)}40%{transform:translate(-50%,-6%) scale(.98,1.03)}55%{transform:translate(-50%,-6.5%) scale(.98,1.03)}85%{transform:translate(-50%,0) scale(1.03,.97)}}
@keyframes wfDive{to{transform:translate(-50%,110%)}}
@keyframes wfSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes wfPop{0%{transform:scale(0)}70%{transform:scale(1.1)}100%{transform:scale(1)}}
@keyframes wfPopX{0%{transform:translateX(-50%) scale(0)}70%{transform:translateX(-50%) scale(1.12)}100%{transform:translateX(-50%) scale(1)}}
@keyframes wfBadge{0%{transform:translate(-50%,-62%) scale(0) rotate(-20deg)}70%{transform:translate(-50%,-62%) scale(1.15) rotate(4deg)}100%{transform:translate(-50%,-62%) scale(1) rotate(0)}}
@keyframes wfStamp{0%{transform:scale(2.6) rotate(-25deg);opacity:0}60%{transform:scale(.88) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes wfDrop{0%{top:-20%}100%{top:0}}
@media (prefers-reduced-motion:reduce){#wfs .rays,#wfs .ram1.in,#wfs .ram3.in{animation:none}}`;
document.head.appendChild(css);

const snd=(n,o)=>{try{window.BA&&BA.play&&BA.play(n,o||{})}catch(e){}};
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const el=(t,c,p)=>{const e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e};
const img=(src,c,p)=>{const i=el('img',c,p);i.src=src;i.alt='';i.draggable=false;return i};
// confetti: our own bones, paws, balls, hearts + paper bits
const PI=['p_bone0','p_bone1','p_bone2','p_pawgold0','p_pawgold1','p_pawteal0','p_ball0','p_ball2','p_heart0','p_leaf0'].map(k=>{const i=new Image();i.src='fx/'+k+'.webp?v=1';return i});
const COL=['#ff7a3d','#ffc93c','#2bb3a3','#ff5d8f','#7ad3ff','#ffffff','#a77bff'];
let root,col,cv,g,parts=[],raf=0,K=1;
function mount(){if(root)return;root=el('div','',document.body);root.id='wfs';col=el('div','col',root);cv=el('canvas','',col);g=cv.getContext('2d');size();addEventListener('resize',size)}
function size(){const W=window.GBB_COL?GBB_COL():innerWidth;col.style.left=(innerWidth-W)/2+'px';col.style.width=W+'px';K=W/393;root.style.setProperty('--k',K+'px');const d=Math.min(2,devicePixelRatio||1);cv.width=W*d;cv.height=innerHeight*d}
function loop(){let last=performance.now();cancelAnimationFrame(raf);
 (function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;const W=cv.width,H=cv.height,s=W/393;g.clearRect(0,0,W,H);
  parts=parts.filter(p=>p.life>0&&p.y<1.15);
  for(const p of parts){p.life-=dt/p.dur;p.vy+=p.g*dt;p.vx*=Math.pow(.55,dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.ph+=dt*p.fl;
   g.save();g.translate(p.x*W,p.y*H);g.rotate(p.rot);g.globalAlpha=Math.min(1,p.life*3);
   if(p.k=='i'){if(p.img.complete&&p.img.naturalWidth){const w=s*p.sz,h=w*p.img.naturalHeight/p.img.naturalWidth;g.drawImage(p.img,-w/2,-h/2,w,h)}}
   else if(p.k=='p'){g.scale(1,Math.cos(p.ph));g.fillStyle=p.col;g.fillRect(-4*s,-2.5*s,8*s,5*s)}
   else{const r=s*p.sz*(.55+.45*Math.sin(p.life*10));g.fillStyle=p.col;g.beginPath();g.moveTo(0,-r);g.quadraticCurveTo(0,0,r,0);g.quadraticCurveTo(0,0,0,r);g.quadraticCurveTo(0,0,-r,0);g.quadraticCurveTo(0,0,0,-r);g.fill()}
   g.restore()}
  raf=requestAnimationFrame(f)})(last)}
function burst(x,y,n,spd=1.1){for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=spd*(.5+Math.random()*.8);const pic=Math.random()<.45;
 parts.push({k:pic?'i':'p',img:PI[Math.floor(Math.random()*PI.length)],col:COL[i%COL.length],x,y,vx:Math.cos(a)*v*.45,vy:Math.sin(a)*v*.75,g:.9,rot:Math.random()*6,vr:(Math.random()-.5)*9,ph:Math.random()*6,fl:6+Math.random()*8,sz:15+Math.random()*12,life:1,dur:2.2+Math.random()*1.2})}}
function rain(n){for(let i=0;i<n;i++)parts.push({k:Math.random()<.3?'i':'p',img:PI[Math.floor(Math.random()*PI.length)],col:COL[i%COL.length],x:Math.random(),y:-.05-Math.random()*.4,vx:(Math.random()-.5)*.05,vy:.12+Math.random()*.12,g:.02,rot:Math.random()*6,vr:(Math.random()-.5)*4,ph:Math.random()*6,fl:5+Math.random()*6,sz:13+Math.random()*9,life:1,dur:6+Math.random()*3})}
function sparkle(x,y,n,r=.12){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=r*(1+Math.random()*2.2);parts.push({k:'s',x,y,vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v*.25,g:0,rot:0,vr:0,ph:0,fl:0,sz:5+Math.random()*8,col:i%3?'#fff6c8':'#ffd84a',life:1,dur:.55+Math.random()*.5})}}
const at=e=>{const r=e.getBoundingClientRect(),c=cv.getBoundingClientRect();return[(r.left+r.width/2-c.left)/c.width,(r.top+r.height/2-c.top)/c.height]};

// ---------- 1) "Good Boy!" moment ----------
async function goodBoy(){mount();root.className='on';col.querySelectorAll(':scope>:not(canvas)').forEach(e=>e.remove());parts=[];loop();
 const dim=el('div','dim',col);const word=img('fx/w_goodboy.webp?v=1','word',col);const sub=el('div','sub1',col);sub.textContent='Level complete!';
 const ram=img('bovo11/pop2/win_rambo_cut.webp?v=1','ram1',col);
 requestAnimationFrame(()=>dim.classList.add('in'));snd('win');buzz([30,40,30]);
 await sleep(220);ram.classList.add('in');snd('rambo_double',{delay:.2});
 await sleep(260);word.classList.add('in');sub.classList.add('in');snd('popper');buzz(25);
 await sleep(200);burst(.18,.62,26);burst(.82,.62,26);sparkle(.5,.24,16,.16);
 await sleep(1500);ram.classList.remove('in');ram.classList.add('out');word.style.transition='opacity .3s,transform .3s';word.style.opacity='0';sub.style.transition='opacity .3s';sub.style.opacity='0';
 await sleep(220);dim.classList.remove('in');await sleep(300);[dim,word,sub,ram].forEach(e=>e.remove());root.className=''}

// ---------- 3) full-screen Level Complete ----------
function scene(stars,bones){mount();root.className='on';root.onclick=null;try{FAST=false}catch(e){}col.querySelectorAll(':scope>:not(canvas)').forEach(e=>e.remove());parts=[];loop();
 const sc=el('div','scene',col);el('div','rays',sc);el('div','glow',sc);
 [[-.08,.86,.5,.07],[.62,.9,.5,.08],[.25,.95,.6,.09],[-.15,.12,.34,.05],[.78,.2,.3,.045]].forEach(([x,y,w,h])=>{const c=el('div','cloud',sc);Object.assign(c.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'})});
 const ttl=el('div','ttl',col);ttl.textContent='Level Complete!';
 const sub=el('div','sub',col);sub.innerHTML=['Good boy!','Pawsome!','Top dog!','Woof! Nice job!'][stars%4]+'<br>Rambo is so proud of you.';
 const bd=el('div','badge',col);img('bovo10/mk2_cur.png?v=1','',bd);el('b','',bd).textContent=S.li+1;
 const meds=el('div','meds',col);const MS=[[8,74,'medal0'],[100,92,'medal1'],[208,74,'medal2']];
 const md=MS.map(([x,w,f],i)=>{const m=img('bovo11/pop2/'+f+'.webp?v=2','med'+(i<stars?'':' off'),meds);Object.assign(m.style,{left:x*K+'px',width:w*K+'px',bottom:(i==1?14:0)*K+'px'});if(i>=stars)m.style.opacity='0';return m});
 const bo=el('div','bones',col);img('uikit/ic_bone.webp?v=1','',bo);const bt=el('span','',bo);bt.textContent='+0';
 const ram=img('bovo11/pop2/win_rambo_cut.webp?v=1','ram3',col);
 const fr=el('div','front',col);[[0,.25,.42,.7],[.3,.1,.45,.85],[.62,.3,.42,.7]].forEach(([x,y,w,h])=>{const c=el('div','cloud',fr);Object.assign(c.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'})});
 const tap=el('div','tap',col);tap.textContent='Tap to continue';
 const nextN=S.li+2,hasNext=typeof LEVELS!=='undefined'?S.li+1<LEVELS.length:true;
 const nx=el('div','next',col);el('i','',nx);el('div','',nx).textContent=hasNext?'Level '+nextN:'All done!';
 const fade=el('div','fadeout',col);
 let done=false,T=[];const later=(ms,f)=>T.push(setTimeout(f,ms));
 const go=()=>{if(done)return;done=true;T.forEach(clearTimeout);if(!nx.classList.contains('in')){ttl.classList.add('hideT');sub.classList.add('hideT');nx.classList.add('in');snd('shimmer')}
  setTimeout(()=>{fade.style.opacity='1'},650);setTimeout(()=>{cancelAnimationFrame(raf);window.BA&&BA.nav?BA.nav('map.html'):location.href='map.html'},1150)};
 requestAnimationFrame(()=>sc.classList.add('in'));snd('mega');buzz(40);
 later(150,()=>{ram.classList.add('in');snd('rambo_triple',{delay:.3})});
 later(300,()=>{ttl.classList.add('in');snd('popper');rain(60)});
 later(650,()=>sub.classList.add('in'));
 later(850,()=>{bd.classList.add('in');snd('star');sparkle(...at(bd),18,.18);buzz(20)});
 for(let i=0;i<3;i++)later(1300+i*420,()=>{if(i<stars){md[i].classList.add('in');snd('starland'+i);buzz(35);setTimeout(()=>{sparkle(...at(md[i]),22,.2);burst(at(md[i])[0],at(md[i])[1],10,.7)},260)}else{md[i].style.transition='opacity .3s';md[i].style.opacity='1'}});
 later(2600,()=>{bo.classList.add('in');snd('buy');let n=0;const step=Math.max(1,Math.round(bones/18));const iv=setInterval(()=>{n=Math.min(bones,n+step);bt.textContent='+'+n+' Bones';if(n>=bones){clearInterval(iv)}else snd('tap',{gap:40})},45)});
 later(3100,()=>{tap.classList.add('in');root.onclick=go});
 later(3700,()=>{ttl.classList.add('hideT');sub.classList.add('hideT');nx.classList.add('in');snd('shimmer')});
 later(5600,go);
}

// ---------- hook into the game ----------
const engineWin=window.win;            // engine bonus sequence + old results (results get replaced below)
window.g2results=function(stars,bones){scene(stars,bones)};
window.win=async function(){if(window.__wfsBusy)return;window.__wfsBusy=true;
 try{S.over=true;S.busy=true;
  await goodBoy();
  // 2) Zoomies bonus: leftover moves blast across the board, tap to skip
  if(S.moves>0){mount();root.className='on';const sk=el('div','skip in',col);sk.textContent='Tap to skip';
   const word=img('fx/w_woof.webp?v=1','word',col);word.style.top='16%';word.style.width='56%';word.classList.add('in');snd('rambo_bark');setTimeout(()=>{word.style.transition='opacity .4s';word.style.opacity='0'},900);
   root.onclick=()=>{try{FAST=true}catch(e){}sk.remove()}}
  await engineWin();      // runs the bonus, then calls g2results -> scene()
 }finally{try{FAST=false}catch(e){}window.__wfsBusy=false}};
window.wfsTest=(stars=3,bones=30)=>scene(stars,bones);   // review helper
window.wfsGoodBoy=goodBoy;
})();

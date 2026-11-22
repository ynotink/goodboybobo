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
#wfs .fadeout{position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .45s;z-index:9;pointer-events:none}
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
const PI=['confetti_bone','confetti_bone','confetti_paw_orange','confetti_paw_teal','confetti_tennis_ball','confetti_heart','confetti_twinkle'].map(k=>{const i=new Image();i.src='fx2/'+k+'.webp?v=1';return i});
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

// ---------- 1) "Good Boy!" moment over the board ----------
async function goodBoy(){mount();root.className='on';col.querySelectorAll(':scope>:not(canvas)').forEach(e=>e.remove());parts=[];loop();
 const dim=el('div','dim',col);dim.style.background='radial-gradient(ellipse at 50% 45%,rgba(10,40,45,.25),rgba(6,22,30,.62))';
 const word=img('fx2/praise_good_boy.webp?v=1','word',col);word.style.top='40%';word.style.width='80%';
 requestAnimationFrame(()=>dim.classList.add('in'));snd('win');buzz([30,40,30]);
 await sleep(180);word.classList.add('in');snd('popper');buzz(25);
 await sleep(160);burst(.2,.5,22);burst(.8,.5,22);sparkle(.5,.38,16,.16);
 await sleep(1150);word.style.transition='opacity .3s,transform .3s';word.style.opacity='0';
 await sleep(200);dim.classList.remove('in');await sleep(300);[dim,word].forEach(e=>e.remove());root.className=''}

// ---------- 3) full-screen win: ChatGPT's approved win screen, built live ----------
const W2='win2/',WV='?v=2';
{const st=document.createElement('style');st.textContent=`
@font-face{font-family:WinLil;src:url(a/lilita-one-latin-400-normal.woff2) format('woff2')}
#wfs .w2{position:absolute;inset:0;overflow:hidden;opacity:0;transition:opacity .35s}
#wfs .w2.in{opacity:1}
#wfs .w2 .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 70%}
#wfs .w2 .glow{position:absolute;left:50%;width:150%;aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,244,205,.55),rgba(255,236,180,.18) 40%,rgba(255,236,180,0) 66%);pointer-events:none}
#wfs .w2 .p{position:absolute;display:block;-webkit-user-drag:none;pointer-events:none}
#wfs .w2 .ttl2{transform:scale(0) rotate(-6deg);filter:drop-shadow(0 6px 8px rgba(20,40,10,.45))}
#wfs .w2 .ttl2.in{animation:w2Slam .55s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .w2 .sub2{position:absolute;left:0;right:0;text-align:center;font-family:WinLil,KNun,system-ui;line-height:1;white-space:nowrap;transform:rotate(-2.5deg) scale(0);opacity:0}
#wfs .w2 .sub2 span{position:relative;display:inline-block;color:#fdf1d2}
#wfs .w2 .sub2 span::before{content:attr(data-t);position:absolute;inset:0;z-index:-1;color:#0f4a3e;-webkit-text-stroke:.2em #0f4a3e;text-shadow:0 .09em 0 #0b382f,0 .14em .12em rgba(0,0,0,.35)}
#wfs .w2 .sub2.in{animation:w2Sub .45s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .w2 .med{transform:scale(0);opacity:0;filter:drop-shadow(0 6px 6px rgba(40,20,0,.4))}
#wfs .w2 .med.in{animation:w2Stamp .5s cubic-bezier(.3,1.8,.5,1) forwards}
#wfs .w2 .med.unearn{filter:drop-shadow(0 4px 4px rgba(40,20,0,.25));}
#wfs .w2 .ram{transform-origin:50% 100%;filter:drop-shadow(0 10px 12px rgba(20,30,0,.35));opacity:0}
#wfs .w2 .ram.in{animation:w2Jump .7s cubic-bezier(.2,1.45,.45,1) forwards}
#wfs .w2 .ram.in.cheer{animation:w2Jump .7s cubic-bezier(.2,1.45,.45,1) forwards,w2Bounce 1.15s ease-in-out .75s infinite}
#wfs .w2 .ram.in.leap{animation:w2Jump .7s cubic-bezier(.2,1.45,.45,1) forwards,w2Float 2.2s ease-in-out .75s infinite}
#wfs .w2 .bones2{position:absolute;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:.25em;font-family:WinLil,KNun,system-ui;color:#fdf1d2;opacity:0;transform:scale(.4)}
#wfs .w2 .bones2 img{height:1.15em}
#wfs .w2 .bones2 b{font-weight:400;position:relative}
#wfs .w2 .bones2 b::before{content:attr(data-t);position:absolute;inset:0;z-index:-1;color:#0f4a3e;-webkit-text-stroke:.2em #0f4a3e;text-shadow:0 .08em 0 #0b382f,0 .12em .1em rgba(0,0,0,.35)}
#wfs .w2 .bones2.in{animation:w2Pop .45s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .w2 .cont{position:absolute;cursor:pointer;opacity:0;transform:translateY(60%);-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 6px 5px rgba(120,30,0,.35)) drop-shadow(0 12px 16px rgba(40,20,0,.25))}
#wfs .w2 .cont img{position:absolute;inset:0;width:100%;height:100%}
#wfs .w2 .cont b{position:absolute;left:0;right:0;top:0;bottom:12%;display:flex;align-items:center;justify-content:center;font-family:WinLil,KNun,system-ui;font-weight:400;color:#fff6e4;text-shadow:0 .06em 0 rgba(150,40,10,.65),0 .1em .14em rgba(120,30,0,.35);letter-spacing:.01em}
#wfs .w2 .cont.in{animation:w2Rise .45s cubic-bezier(.25,1.4,.5,1) forwards,w2Pulse 1.8s ease-in-out .6s infinite}
#wfs .w2 .cont.dn{filter:brightness(.92) drop-shadow(0 3px 3px rgba(120,30,0,.35))}
#wfs .w2 .rep{position:absolute;left:0;right:0;text-align:center;cursor:pointer;opacity:0;transition:opacity .35s;-webkit-tap-highlight-color:transparent}
#wfs .w2 .rep span{position:relative;display:inline-block;font-family:WinLil,KNun,system-ui;color:#fdf1d2;padding:.1em .3em}
#wfs .w2 .rep span::before{content:attr(data-t);position:absolute;inset:0;padding:.1em .3em;z-index:-1;color:#0f4a3e;-webkit-text-stroke:.18em #0f4a3e}
#wfs .w2 .rep span::after{content:'';position:absolute;left:12%;right:12%;bottom:-.05em;height:.09em;border-radius:1em;background:#fdf1d2;box-shadow:0 0 0 .05em #0f4a3e}
#wfs .w2 .rep.in{opacity:1}
@keyframes w2Slam{0%{transform:scale(2.2) rotate(-8deg);opacity:0}55%{transform:scale(.92) rotate(1deg);opacity:1}75%{transform:scale(1.05)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes w2Sub{0%{transform:rotate(-2.5deg) scale(0);opacity:0}70%{transform:rotate(-2.5deg) scale(1.1);opacity:1}100%{transform:rotate(-2.5deg) scale(1);opacity:1}}
@keyframes w2Stamp{0%{transform:scale(2.4) rotate(-20deg);opacity:0}60%{transform:scale(.88) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes w2Jump{0%{transform:translateY(40%) scale(.85);opacity:0}60%{opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
@keyframes w2Bounce{0%,100%{transform:translateY(0) scale(1,1)}35%{transform:translateY(-4%) scale(.985,1.02)}70%{transform:translateY(0) scale(1.02,.98)}}
@keyframes w2Float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3.5%) rotate(-2deg)}}
@keyframes w2Pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes w2Rise{0%{transform:translateY(60%);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes w2Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@media (prefers-reduced-motion:reduce){#wfs .w2 .ram.in.cheer,#wfs .w2 .ram.in.leap,#wfs .w2 .cont.in{animation:w2Jump .3s forwards}}`;document.head.appendChild(st)}
/* phase 3: Soft Depth win screen (ChatGPT's exact kit, 1290x2796 art). The picture is scaled as one piece so nothing
   drifts; the forest fills any side bars. Level number and bone count are written live in the game's title lettering
   between the kit's own "Level"/"Complete!" and "+"/"Bones" pieces. */
const W3='win3/',V3='?v=3',WB={"title":[0,157,1290,365],"bobo":[94,912,1031,1246],"rib_left":[179,641,302,359],"rib_left_off":[179,641,302,359],"rib_center":[458,566,374,448],"rib_center_off":[458,566,374,448],"rib_right":[809,641,302,359],"rib_right_off":[809,641,302,359],"bone":[166,2103,335,190],"bt_continue":[0,2296,1290,290],"bt_continue_p":[0,2296,1290,290],"bt_replay":[369,2586,553,150],"bt_replay_p":[369,2586,553,150],"lvl_a":[32,409,500,171],"lvl_b":[532,403,727,167],"bon_a":[138,2130,478,139],"bon_b":[616,2116,674,167]};
const css3=document.createElement('style');css3.textContent=`
#wfs .w3{position:absolute;inset:0;opacity:0;transition:opacity .3s;overflow:hidden}
#wfs .w3.in{opacity:1}
#wfs .w3 .bg{position:absolute;max-width:none;pointer-events:none}
#wfs .w3 .bgb{filter:blur(14px) brightness(.85)}
#wfs .w3 .st{position:absolute}
#wfs .w3 .ly{position:absolute;display:block;pointer-events:none;-webkit-user-drag:none}
#wfs .w3 .pop{transform:scale(0)}#wfs .w3 .pop.in{animation:w3Pop .5s cubic-bezier(.25,1.7,.5,1) forwards}
#wfs .w3 .fade{opacity:0}#wfs .w3 .fade.in{animation:w3Fade .4s ease-out forwards}
#wfs .w3 .rib{transform:scale(0)}#wfs .w3 .rib.off{transform:scale(1)}#wfs .w3 .rib.in{animation:w3Stamp .45s cubic-bezier(.3,1.8,.5,1) forwards}
#wfs .w3 .bob{transform:translateY(110%)}#wfs .w3 .bob.in{animation:w3Jump .65s cubic-bezier(.2,1.5,.45,1) forwards,w3Hop 1.1s ease-in-out .7s infinite}
#wfs .w3 .num{position:absolute;transform:translate(-50%,-50%);pointer-events:none}
#wfs .w3 .bt{position:absolute;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0}
#wfs .w3 .bt.in{animation:w3Up .4s cubic-bezier(.25,1.5,.5,1) forwards}
#wfs .w3 .bt img{position:absolute;pointer-events:none;-webkit-user-drag:none}
#wfs .w3 .bt .pi{opacity:0}#wfs .w3 .bt.dn .pi{opacity:1}#wfs .w3 .bt.dn .ni{opacity:0}
@keyframes w3Pop{0%{transform:scale(0)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes w3Fade{from{opacity:0;transform:translateY(8%)}to{opacity:1;transform:none}}
@keyframes w3Stamp{0%{transform:scale(2.2);opacity:0}60%{transform:scale(.92);opacity:1}100%{transform:scale(1)}}
@keyframes w3Jump{0%{transform:translateY(110%)}100%{transform:translateY(0)}}
@keyframes w3Hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.2%)}}
@keyframes w3Up{0%{opacity:0;transform:translateY(30%)}100%{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){#wfs .w3 *{animation:none!important;transform:none!important;opacity:1!important}}`;document.head.appendChild(css3);
function scene(stars,bones){mount();root.className='on';root.onclick=null;try{FAST=false}catch(e){}
 col.querySelectorAll(':scope>:not(canvas)').forEach(e=>e.remove());parts=[];loop();
 const perfect=stars>=3,DW=1290,DH=2796;
 const sc=el('div','w3',col);const bb=img(W3+'bg.jpg'+V3,'bg bgb',sc),bg=img(W3+'bg.jpg'+V3,'bg',sc);const st=el('div','st',sc);
 const items=[];let s=1;
 const lay=()=>{const W=col.clientWidth||innerWidth,H=innerHeight;s=Math.min(W/DW,H/DH);const sb=Math.max(W/DW,H/DH);
  for(const [e,k] of [[bb,sb],[bg,s]])Object.assign(e.style,{width:DW*k+'px',height:DH*k+'px',left:(W-DW*k)/2+'px',top:(H-DH*k)/2+'px'});
  Object.assign(st.style,{width:DW*s+'px',height:DH*s+'px',left:(W-DW*s)/2+'px',top:(H-DH*s)/2+'px'});items.forEach(f=>f())};
 const put=(n,c,box)=>{const b=box||WB[n],e=img(W3+n+'.webp'+V3,'ly '+(c||''),st);items.push(()=>Object.assign(e.style,{left:b[0]*s+'px',top:b[1]*s+'px',width:b[2]*s+'px',height:b[3]*s+'px'}));return e};
 // title: PAWSOME for a perfect level, otherwise one of the other praise words (old art) in the same spot
 let ttl;if(perfect)ttl=put('title','pop');else{const w=['title_good_boy','title_top_dog','title_woof'][Math.floor(Math.random()*3)],R={title_good_boy:804/220,title_top_dog:806/229,title_woof:710/239}[w];
  const bw=w==='title_woof'?820:1110,bh=bw/R;ttl=img(W2+w+'.webp'+WV,'ly pop',st);items.push(()=>Object.assign(ttl.style,{left:(645-bw/2)*s+'px',top:(345-bh/2)*s+'px',width:bw*s+'px',height:bh*s+'px'}))}
 // "Level N Complete!": the kit's two words with the live number set between them
 const lv=el('div','fade',st);lv.style.position='absolute';lv.style.inset='0';
 const la=put('lvl_a','',WB.lvl_a),lb=put('lvl_b','',WB.lvl_b);lv.appendChild(la);lv.appendChild(lb);
 const ln=el('div','num',lv);
 const N=(t,box,cap,parts)=>{const [a,b]=parts;items.push(()=>{const gap=box[2];if(window.GBBFont){GBBFont.draw(t,t._v,cap*s,{style:'title'});}
   const w=(parseFloat((t.firstChild||{}).style?.width)||0)/s||gap,extra=Math.max(0,w+14-gap)/2;   // wider numbers push the words apart evenly
   const A=WB[a.dataset.n],B=WB[b.dataset.n];a.style.left=(A[0]-extra)*s+'px';b.style.left=(B[0]+extra)*s+'px';
   Object.assign(t.style,{left:(box[0]+box[2]/2)*s+'px',top:(box[1]+box[3]/2)*s+'px'})})};
 la.dataset.n='lvl_a';lb.dataset.n='lvl_b';ln._v=String(S.li+1);N(ln,[494,432,77,111],88,[la,lb]);
 // ribbons (lit or empty)
 const rb=['left','center','right'].map((r,i)=>put('rib_'+r+(i<stars?'':'_off'),'rib'+(i<stars?'':' off')));
 const bob=put('bobo','bob');st.insertBefore(bob,rb[0]);
 // "+N Bones"
 const bo=el('div','pop',st);bo.style.position='absolute';bo.style.inset='0';bo.style.transformOrigin='50% 76.5%';
 bo.appendChild(put('bone'));const ba=put('bon_a'),bn=put('bon_b');ba.dataset.n='bon_a';bn.dataset.n='bon_b';bo.appendChild(ba);bo.appendChild(bn);
 const bt=el('div','num',bo);bt._v='0';N(bt,[527,2121,167,134],112,[ba,bn]);const setB=n=>{bt._v=String(n);lay()};
 // buttons: kit art with pressed art, tap only in the kit's tap box
 const btn=(n,tb,aria)=>{const b=WB['bt_'+n],e=el('div','bt',st);e.setAttribute('role','button');e.setAttribute('aria-label',aria);
  for(const [nn,c] of [['bt_'+n,'ni'],['bt_'+n+'_p','pi']]){const i=img(W3+nn+'.webp'+V3,c,e);Object.assign(i.style,{left:(b[0]-tb[0])/tb[2]*100+'%',top:(b[1]-tb[1])/tb[3]*100+'%',width:b[2]/tb[2]*100+'%',height:b[3]/tb[3]*100+'%'})}
  items.push(()=>Object.assign(e.style,{left:tb[0]*s+'px',top:tb[1]*s+'px',width:tb[2]*s+'px',height:tb[3]*s+'px'}));
  e.addEventListener('pointerdown',()=>e.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(x=>e.addEventListener(x,()=>e.classList.remove('dn')));return e};
 const ct=btn('continue',[163,2313,964,241],'Continue'),rp=btn('replay',[470,2590,350,125],'Replay');
 lay();const onR=()=>lay();addEventListener('resize',onR);
 const fade=el('div','fadeout',col);
 let T=[],done=false,ready=false;const later=(ms,f)=>T.push(setTimeout(f,ms));
 const finish=()=>{T.forEach(clearTimeout);T=[];[ttl,lv,bo,bob,...rb].forEach(e=>e.classList.add('in'));setB(bones);ct.classList.add('in');rp.classList.add('in');ready=true};
 const leave=fn=>{if(done)return;done=true;T.forEach(clearTimeout);snd('tap');cancelAnimationFrame(raf);removeEventListener('resize',onR);fn()};
 ct.addEventListener('click',e=>{e.stopPropagation();if(!ready)return finish();leave(()=>window.BA&&BA.nav?BA.nav('map.html'):location.href='map.html')});
 rp.addEventListener('click',e=>{e.stopPropagation();if(!ready)return finish();leave(()=>{try{root.className='';col.querySelectorAll(':scope>:not(canvas)').forEach(x=>x.remove());parts=[];startLevel(S.li)}catch(_){location.reload()}})});
 sc.addEventListener('click',()=>{if(!ready)finish()});
 requestAnimationFrame(()=>sc.classList.add('in'));snd('mega');buzz(40);
 const at=(x,y)=>{const r=st.getBoundingClientRect(),c=cv.getBoundingClientRect();return [(r.left+x*s-c.left)/c.width,(r.top+y*s-c.top)/c.height]};
 later(250,()=>{ttl.classList.add('in');snd('popper');buzz(25);rain(perfect?45:30);const [x,y]=at(645,330);sparkle(x,y,14,.18)});
 later(500,()=>{bob.classList.add('in');snd(perfect?'rambo_triple':'rambo_double',{delay:.15})});
 later(650,()=>{lv.classList.add('in')});
 rb.forEach((m,i)=>later(1050+i*380,()=>{if(i<stars){m.classList.add('in');snd('starland'+i);buzz(35);const b=WB['rib_'+['left','center','right'][i]];setTimeout(()=>{const [x,y]=at(b[0]+b[2]/2,b[1]+b[3]*.4);sparkle(x,y,20,.2);burst(x,y,8,.6)},230)}}));
 later(2300,()=>{bo.classList.add('in');snd('buy');let n=0;const step=Math.max(1,Math.round(bones/16));const iv=setInterval(()=>{n=Math.min(bones,n+step);setB(n);if(n>=bones)clearInterval(iv);else snd('tap',{gap:40})},50)});
 later(2800,()=>{ct.classList.add('in');snd('shimmer')});
 later(3100,()=>{rp.classList.add('in');ready=true});
}

// ---------- hook into the game ----------
const engineWin=window.win;            // engine bonus sequence + old results (results get replaced below)
window.g2results=function(stars,bones){scene(stars,bones)};
window.win=async function(){if(window.__wfsBusy)return;window.__wfsBusy=true;
 try{S.over=true;S.busy=true;
  await goodBoy();
  // 2) Zoomies bonus: leftover moves blast across the board, tap to skip
  if(S.moves>0){mount();root.className='on';const sk=el('div','skip in',col);sk.textContent='Tap to skip';
   const word=img('fx2/praise_woof.webp?v=1','word',col);word.style.top='44%';word.style.width='60%';word.classList.add('in');snd('rambo_bark');setTimeout(()=>{word.style.transition='opacity .4s';word.style.opacity='0'},900);
   root.onclick=()=>{try{FAST=true}catch(e){}sk.remove()}}
  await engineWin();      // runs the bonus, then calls g2results -> scene()
 }finally{try{FAST=false}catch(e){}window.__wfsBusy=false}};
window.wfsTest=(stars=3,bones=30)=>scene(stars,bones);   // review: wfsTest(2,20)   // review helper
window.wfsGoodBoy=goodBoy;
})();

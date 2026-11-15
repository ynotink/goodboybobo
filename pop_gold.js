/* Good Boy Bobo — gold pop-ups (Ready, Paused, Out of Moves, GOOD BOY!) with animation.
   Art: Antonio's approved ChatGPT cards, text wiped and redrawn live. Coordinates in the 852x1846 card art. */
(function(){
const P='bovo11/pop/',IW=852,IH=1846;
const css=document.createElement('style');css.textContent=`
#gp{position:fixed;inset:0;z-index:200;background:rgba(2,22,24,0);pointer-events:none;transition:background .3s}
#gp.on{background:rgba(2,22,24,.72);pointer-events:auto}
#gp .gpstg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
#gp .gpcard{position:absolute;inset:0;transform-origin:50% 55%}
#gp .gpL{position:absolute;display:block;pointer-events:none;-webkit-user-drag:none;user-select:none}
#gp .gptx{position:absolute;display:flex;align-items:center;justify-content:center;font-family:BoboNunito,'Nunito',system-ui;font-weight:900;white-space:nowrap;pointer-events:none;line-height:1}
#gp .gptx.cr{color:#fdf1d6;text-shadow:0 .06em 0 rgba(0,40,42,.55)}
#gp .gptx.dk{color:#0d4a4b}
#gp .gphb{position:absolute;cursor:pointer;-webkit-tap-highlight-color:transparent}
#gp .gppress{transition:transform .08s}
#gp canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
@keyframes gpIn{0%{transform:scale(.35) translateY(30%);opacity:0}55%{transform:scale(1.06) translateY(-1%);opacity:1}75%{transform:scale(.97)}100%{transform:none}}
@keyframes gpOut{to{transform:scale(.85) translateY(6%);opacity:0}}
@keyframes gpFloat{50%{transform:translateY(-.6%)}}
@keyframes gpPulse{50%{transform:scale(1.045);filter:brightness(1.08) drop-shadow(0 0 1.2vh rgba(150,255,110,.55))}}
@keyframes gpSlam{0%{transform:scale(2.8) rotate(-6deg);opacity:0}60%{transform:scale(.92) rotate(1deg);opacity:1}80%{transform:scale(1.04)}100%{transform:none;opacity:1}}
@keyframes gpStamp{0%{transform:scale(2.4) rotate(-25deg);opacity:0}55%{transform:scale(.88) rotate(4deg);opacity:1}75%{transform:scale(1.08)}100%{transform:none;opacity:1}}
@keyframes gpLeap{0%{transform:translateY(55%) scale(.55,.4);opacity:0}45%{transform:translateY(-9%) scale(.95,1.08);opacity:1}65%{transform:translateY(2%) scale(1.06,.93)}82%{transform:translateY(-2%) scale(.98,1.02)}100%{transform:none;opacity:1}}
@keyframes gpWiggle{0%,100%{transform:rotate(0) translateY(0)}25%{transform:rotate(-2.2deg) translateY(-1.2%)}50%{transform:rotate(0) translateY(0)}75%{transform:rotate(2.2deg) translateY(-1.2%)}}
@keyframes gpPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.14);opacity:1}100%{transform:none;opacity:1}}
@keyframes gpRise{0%{transform:translateY(40%);opacity:0}100%{transform:none;opacity:1}}
@keyframes gpShake{0%,100%{transform:none}20%{transform:translate(-1.2%,.8%)}40%{transform:translate(1.1%,-.6%)}60%{transform:translate(-.7%,.4%)}80%{transform:translate(.4%,-.2%)}}
@keyframes gpSpin{to{transform:rotate(360deg)}}
@keyframes gpBump{40%{transform:scale(1.22)}100%{transform:none}}
#gp .gprays{position:absolute;border-radius:50%;opacity:0;transition:opacity .6s;
 background:repeating-conic-gradient(rgba(255,214,90,.55) 0 9deg,rgba(255,240,180,0) 9deg 22.5deg);
 -webkit-mask-image:radial-gradient(circle,#000 18%,rgba(0,0,0,.6) 40%,transparent 68%);mask-image:radial-gradient(circle,#000 18%,rgba(0,0,0,.6) 40%,transparent 68%);animation:gpSpin 14s linear infinite}
#gp .gpglow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,250,225,.95),rgba(255,232,160,.5) 35%,rgba(255,232,160,0) 70%);opacity:0;transition:opacity .6s}`;
document.head.appendChild(css);
const gp=document.createElement('div');gp.id='gp';document.body.appendChild(gp);
let stg,card,fx,U=1,parts=[],timers=[],raf=0;
const pct=(v,b)=>v/b*100+'%';
function fit(){if(!stg)return;let h=innerHeight*.97,w=h*IW/IH;if(w>innerWidth*.99){w=innerWidth*.99;h=w*IH/IW}
 stg.style.width=w+'px';stg.style.height=h+'px';U=w/IW;stg.querySelectorAll('.gptx').forEach(e=>e.style.fontSize=(+e.dataset.fs*U)+'px');
 if(fx){fx.width=Math.round(w*Math.min(2,devicePixelRatio||1));fx.height=Math.round(h*Math.min(2,devicePixelRatio||1))}}
addEventListener('resize',fit);
const at=(e,[x,y,w,h])=>{e.style.left=pct(x,IW);e.style.top=pct(y,IH);e.style.width=pct(w,IW);e.style.height=pct(h,IH);return e};
function img(src,box,parent=card){const i=new Image();i.className='gpL';i.src=P+src+'?v=2';at(i,box);parent.appendChild(i);return i}
function tx(t,box,fs,cls='dk',parent=card){const d=document.createElement('div');d.className='gptx '+cls;d.textContent=t;d.dataset.fs=fs;at(d,box);d.style.fontSize=fs*U+'px';parent.appendChild(d);return d}
function hit(box,fn,pressEl){const d=document.createElement('div');d.className='gphb';at(d,box);card.appendChild(d);
 const dn=()=>{if(pressEl)pressEl.style.transform='scale(.95)'},up=()=>{if(pressEl)pressEl.style.transform=''};
 d.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(e=>d.addEventListener(e,up));
 d.onclick=()=>{snd('tap');fn()};return d}
function snd(n){try{window.BA&&BA.play&&BA.play(n,{gap:60})}catch(e){}}
const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
function open(base){close(true);gp.innerHTML='';stg=document.createElement('div');stg.className='gpstg';gp.appendChild(stg);
 card=document.createElement('div');card.className='gpcard';stg.appendChild(card);
 fx=document.createElement('canvas');stg.appendChild(fx);fit();img(base,[0,0,IW,IH]);
 card.style.animation='gpIn .55s cubic-bezier(.25,.9,.35,1) both';gp.classList.add('on');parts=[];startFx();snd('popper')}
function close(now){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(raf);
 if(now||!card){gp.classList.remove('on');gp.innerHTML='';stg=card=fx=null;return}
 card.style.animation='gpOut .22s ease-in both';gp.classList.remove('on');const c=card;setTimeout(()=>{if(card===c){gp.innerHTML='';stg=card=fx=null}},230)}
// ---- particles: confetti + sparkle bursts
function startFx(){const g=fx.getContext('2d');let last=performance.now();
 (function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!fx)return;const W=fx.width,H=fx.height;g.clearRect(0,0,W,H);
  parts=parts.filter(p=>p.life>0);for(const p of parts){p.life-=dt/p.dur;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.vx*=Math.pow(.4,dt);p.rot+=p.vr*dt;
   const a=Math.min(1,p.life*2.2);g.save();g.translate(p.x/IW*W,p.y/IH*H);g.rotate(p.rot);g.globalAlpha=a;
   if(p.k=='c'){g.fillStyle=p.col;const s=W/IW;g.fillRect(-9*s,-4*s,18*s,8*s)}
   else{const s=W/IW*p.sz*(.6+.4*Math.sin(p.life*9));g.fillStyle=p.col;g.beginPath();g.moveTo(0,-s);g.quadraticCurveTo(0,0,s,0);g.quadraticCurveTo(0,0,0,s);g.quadraticCurveTo(0,0,-s,0);g.quadraticCurveTo(0,0,0,-s);g.fill()}
   g.restore()}
  raf=requestAnimationFrame(f)})(last)}
const COL=['#ffcc33','#ff5e8a','#36b6ff','#6fdc4a','#a66bff','#ff8a3d','#fff3b0'];
function confetti(x,y,n,spd=900,up=500){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=spd*(.3+Math.random()*.7);parts.push({k:'c',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-up,g:1300,rot:Math.random()*6,vr:(Math.random()-.5)*14,col:COL[i%COL.length],life:1,dur:1.6+Math.random()*1.2})}}
function sparkle(x,y,n,r=90){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=r*(1+Math.random()*2.5);parts.push({k:'s',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:0,rot:0,vr:0,sz:10+Math.random()*16,col:i%3?'#fff6c8':'#ffd84a',life:1,dur:.5+Math.random()*.5})}}
function goalsRow(goals,[x0,y0,x1,y1],isz,fs){const n=goals.length,sw=(x1-x0)/n;
 goals.forEach((go,i)=>{const sx=x0+sw*i,cy=(y0+y1)/2,num=String(go.left??go.n);const tw=fs*.62*num.length,gap=fs*.18,tot=isz+gap+tw,ix=sx+(sw-tot)/2;
  const im=new Image();im.className='gpL';im.src=window.goalImg?('a/'+goalImg(go)+'.webp'):'';at(im,[ix,cy-isz/2,isz,isz]);im.style.objectFit='contain';card.appendChild(im);
  tx(num,[ix+isz+gap-fs*.1,cy-fs*.6,tw+fs*.2,fs*1.2],fs,'dk')})}
// ---------- READY ----------
window.showIntro=function(){open('r_base.webp');
 tx('Level '+(S.li+1),[190,615,470,95],72,'cr');
 const n=S.goals.length;goalsRow(S.goals.map(x=>({...x,left:x.n})),[125,858,730,1005],n>2?110:132,n>2?72:86);
 tx(String(S.moves),[230,1098,380,140],S.moves>99?118:140,'cr');
 const pl=document.createElement('div');pl.className='gpL';at(pl,[118,1342,616,206]);card.appendChild(pl);
 const go=()=>{close();window.say&&say('You got this!');window.hintArm&&hintArm()};
 hit([118,1342,616,206],go);hit([0,0,IW,560],()=>{});
 // play button breathes once the card lands
 later(600,()=>{const b=document.createElement('div');b.className='gpL';at(b,[118,1342,616,206]);b.style.borderRadius='999px';b.style.animation='gpPulse 1.6s ease-in-out infinite';b.style.mixBlendMode='screen';b.style.background='radial-gradient(ellipse at 50% 50%,rgba(170,255,120,.18),rgba(170,255,120,0) 70%)';card.appendChild(b)});
 later(150,()=>sparkle(425,330,10,70))};
// ---------- PAUSED ----------
let TOG=null;fetch(P+'p_tog.json').then(r=>r.json()).then(j=>TOG=j);
const ST=()=>{try{return Object.assign({music:70,sounds:80},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{music:70,sounds:80}}};
window.g2pause=function(){if(typeof S==='undefined'||!S||S.over)return;if(!TOG)return setTimeout(window.g2pause,100);open('p_base.webp');
 const st=ST();
 [['music','music'],['sound','sounds']].forEach(([k,sk])=>{const b=TOG[k];const l=img('p_tog_'+k+'.webp',b);const t=tx('',[b[0],b[1],b[2],b[3]],52,'cr');
  const show=()=>{const on=st[sk]>0;t.textContent=on?'ON':'OFF';l.style.filter=on?'':'grayscale(1) brightness(1.15) contrast(.85)';t.style.color=on?'#fdf1d6':'#f4f1ea'};show();
  hit([80,b[1]-40,690,b[3]+80],()=>{if(st[sk]>0){st['_'+sk]=st[sk];st[sk]=0}else st[sk]=st['_'+sk]||(sk=='music'?70:80);
   try{localStorage.setItem('gbb_settings',JSON.stringify(st))}catch(e){};window.BA&&BA.apply&&BA.apply();show();l.style.animation='none';l.offsetHeight;l.style.animation='gpBump .25s'})});
 hit([82,1072,686,172],()=>close());hit([82,1272,686,162],()=>{close(true);startLevel(S.li)});hit([82,1458,686,166],()=>{close(true);BA.nav('map.html')})};
// ---------- OUT OF MOVES ----------
window.lose=function(){S.over=true;window.fx&&window.fx('lose');open('o_base.webp');
 const left=S.goals.filter(x=>x.left>0);goalsRow(left,[110,895,742,1072],left.length>2?118:150,left.length>2?78:96);
 hit([72,1150,708,232],()=>{close();moreMoves()});hit([150,1485,550,148],()=>{close(true);BA.nav('map.html')});
 later(500,()=>{const r=document.createElement('div');r.className='gpL';at(r,[72,1150,708,232]);r.style.borderRadius='999px';r.style.animation='gpPulse 1.4s ease-in-out infinite';card.appendChild(r)})};
// ---------- GOOD BOY! ----------
let LY=null;fetch(P+'w_layers.json?v=2').then(r=>r.json()).then(j=>LY=j);
window.g2results=function(stars,bones){if(!LY)return setTimeout(()=>g2results(stars,bones),100);open('w_base.webp');
 const L=(k,src)=>{const e=img(src,LY[k]);e.style.opacity=0;return e};
 const glow=document.createElement('div');glow.className='gpglow';at(glow,[136,380,580,580]);card.appendChild(glow);
 const rays=document.createElement('div');rays.className='gprays';at(rays,[46,250,760,760]);card.appendChild(rays);
 const ram=L('rambo','w_rambo.webp');ram.style.transformOrigin='50% 100%';
 const ttl=L('title','w_title.webp');const paws=[0,1,2].map(i=>L('paw'+i,'w_paw'+i+'.webp'));
 const lv=tx('Level '+(S.li+1)+' Complete!',[90,1146,672,80],62,'dk');lv.style.opacity=0;
 const bn=tx('+0 Bones',[352,1262,350,92],62,'dk');bn.style.justifyContent='flex-start';bn.style.opacity=0;
 const cont=L('w_continue','w_continue.webp'),rep=L('w_replay','w_replay.webp');
 let ready=false;const next=S.li+1<(window.LEVELS?LEVELS.length:1e9);
 const finish=()=>{ready=true};
 hit(LY.w_continue,()=>{if(!ready)return;close(true);next?startLevel(S.li+1):BA.nav('map.html')},cont);
 hit(LY.w_replay,()=>{if(!ready)return;close(true);startLevel(S.li)},rep);
 const seq=(e,anim,ms)=>later(ms,()=>{e.style.opacity=1;e.style.animation=anim});
 // 1) title slams down + card shake
 seq(ttl,'gpSlam .45s cubic-bezier(.3,1.4,.5,1) both',380);
 later(560,()=>{card.style.animation='gpShake .32s ease-out';snd('boom');sparkle(425,205,22,140);confetti(425,200,40,700,300)});
 // 2) paws stamp in, one per star
 paws.forEach((p,i)=>later(820+i*260,()=>{if(i<stars){p.style.opacity=1;p.style.animation='gpStamp .42s cubic-bezier(.3,1.4,.5,1) both';
   later(200,()=>{const b=LY['paw'+i];sparkle(b[0]+b[2]/2,b[1]+b[3]/2,16,110);snd('starland'+i)})}}));
 // 3) Rambo leaps up with a glow + rays, then keeps dancing
 later(1550,()=>{glow.style.opacity=1;rays.style.opacity=.9;ram.style.opacity=1;ram.style.animation='gpLeap .7s cubic-bezier(.25,.9,.35,1) both';snd('rambo_double');
  later(260,()=>{confetti(425,700,90,1100,650);confetti(150,600,30,700,500);confetti(700,600,30,700,500)});
  later(720,()=>{ram.style.animation='gpWiggle 1.3s ease-in-out infinite'})});
 // 4) text, bones count-up, buttons pop
 seq(lv,'gpRise .4s ease-out both',2000);
 later(2250,()=>{bn.style.opacity=1;bn.style.animation='gpRise .3s ease-out both';const t0=performance.now(),D=700;
  (function c(now){const u=Math.min(1,(now-t0)/D),v=Math.round(bones*(1-Math.pow(1-u,3)));bn.textContent='+'+v+' Bones';
   if(u<1)requestAnimationFrame(c);else{bn.style.animation='gpBump .3s';sparkle(560,1308,12,90);snd('shimmer')}})(t0)});
 later(3050,()=>{cont.style.opacity=1;cont.style.animation='gpPop .45s cubic-bezier(.3,1.5,.5,1) both';later(450,()=>{cont.style.animation='gpPulse 1.6s ease-in-out infinite'})});
 seq(rep,'gpPop .4s cubic-bezier(.3,1.5,.5,1) both',3250);later(3300,finish);
 // tap the card early to skip ahead
 const skip=document.createElement('div');skip.className='gphb';at(skip,[0,0,IW,1400]);card.appendChild(skip);
 skip.onclick=()=>{if(ready)return;timers.forEach(clearTimeout);timers=[];[ttl,lv,bn,cont,rep,ram].forEach(e=>{e.style.opacity=1;e.style.animation='none'});
  paws.forEach((p,i)=>{p.style.opacity=i<stars?1:0;p.style.animation='none'});glow.style.opacity=1;rays.style.opacity=.9;bn.textContent='+'+bones+' Bones';
  ram.style.animation='gpWiggle 1.3s ease-in-out infinite';cont.style.animation='gpPulse 1.6s ease-in-out infinite';ready=true}};
})();

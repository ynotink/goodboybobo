/* Good Boy Bobo — gameplay pop-ups (Ready, Paused, Out of Moves, GOOD BOY!) built from the UI kit.
   No gold frames: cream kit panel, title plate, kit buttons and toggles; every piece animates on its own.
   Layout units: --pu = 1 design px of a 393-wide phone. */
(function(){
const P='bovo11/pop/',KIT='uikit/';
const css=document.createElement('style');css.textContent=`
#gp{position:fixed;inset:0;z-index:200;background:rgba(2,22,24,0);pointer-events:none;transition:background .3s;font-family:KNun,BoboNunito,system-ui;color:#1b4b50;-webkit-user-select:none;user-select:none;--u:var(--pu)}
#gp.on{background:rgba(2,22,24,.72);pointer-events:auto}
#gp .gst{position:absolute;left:50%;top:50%;width:calc(var(--pu)*310);transform:translate(-50%,-50%)}
#gp .gpc{position:relative;transform-origin:50% 60%}
#gp .gart{position:relative;width:100%;filter:drop-shadow(0 calc(var(--pu)*10) calc(var(--pu)*14) rgba(0,0,0,.45))}
#gp .gart .gbg{position:absolute;inset:0;width:100%;height:100%}
#gp .gart .gpin{position:absolute;left:9%;right:9%;margin:0;justify-content:space-evenly;gap:0}
#gp .gplt{position:absolute;left:12%;right:12%;display:flex;align-items:center;justify-content:center;font-size:calc(var(--pu)*30);color:#163f45;white-space:nowrap}
#gp .gpan{position:relative;border-style:solid;border-width:calc(var(--pu)*34);border-image:url(${KIT}panel_big.webp?v=1) 120 fill/calc(var(--pu)*34) stretch;filter:drop-shadow(0 calc(var(--pu)*10) calc(var(--pu)*14) rgba(0,0,0,.45))}
#gp .gpin{margin:calc(var(--pu)*-14) calc(var(--pu)*-18) calc(var(--pu)*-16);display:flex;flex-direction:column;align-items:center;gap:calc(var(--pu)*10)}
#gp .gttl{position:relative;z-index:3;margin:0 auto calc(var(--pu)*-30);width:fit-content;min-width:calc(var(--pu)*200);height:calc(var(--pu)*62);padding:0 calc(var(--pu)*14);font-size:calc(var(--pu)*31);color:#163f45}
#gp .gttl.inp{margin:0 auto;height:calc(var(--pu)*58);font-size:calc(var(--pu)*29)}
#gp .gpan.pk .gpin{padding-top:calc(var(--pu)*24)}
#gp .gplt.two{flex-direction:column;gap:calc(var(--pu)*2);font-size:calc(var(--pu)*25);line-height:1}
#gp .gplt .tag{font-size:calc(var(--pu)*13);padding:calc(var(--pu)*3) calc(var(--pu)*10);border-radius:999px;color:#fff;background:#e2574c;box-shadow:inset 0 -.15em 0 rgba(0,0,0,.18);letter-spacing:.04em}
#gp .gplt .tag.sh{background:#8e55d6}
#gp .gttl .tag{font-size:.62em;margin-left:.35em;padding:.12em .45em;border-radius:.6em;color:#fff;background:#e2574c;box-shadow:inset 0 -.12em 0 rgba(0,0,0,.18)}
#gp .gttl .tag.sh{background:#8e55d6}
#gp .gsp{height:calc(var(--pu)*18)}
#gp .gplate{position:relative;z-index:2;width:calc(var(--pu)*190);height:calc(var(--pu)*36);font-size:calc(var(--pu)*21);margin-bottom:calc(var(--pu)*-22)}
#gp .gbox{align-self:stretch;border-style:solid;border-width:calc(var(--pu)*20);border-image:url(${KIT}card_small.webp?v=1) 64 fill/calc(var(--pu)*20) stretch}
#gp .ggoals{display:flex;justify-content:center;align-items:center;gap:calc(var(--pu)*20);margin:calc(var(--pu)*-4) calc(var(--pu)*-10) calc(var(--pu)*-10);padding-top:calc(var(--pu)*6);min-height:calc(var(--pu)*58)}
#gp .gpgi{flex:none;white-space:nowrap;display:flex;align-items:center;gap:calc(var(--pu)*5);font-size:calc(var(--pu)*30)}
#gp .ggoals.n3{gap:calc(var(--pu)*11)}#gp .ggoals.n3 .gpgi{font-size:calc(var(--pu)*25);gap:calc(var(--pu)*3)}#gp .ggoals.n3 .gpgi img{width:calc(var(--pu)*36);height:calc(var(--pu)*36)}
#gp .gpgi img{width:calc(var(--pu)*44);height:calc(var(--pu)*44);object-fit:contain}
#gp .gmoves{position:relative;width:calc(var(--pu)*150);height:calc(var(--pu)*80);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;line-height:.95;
 border-style:solid;border-width:calc(var(--pu)*22);border-image:url(${KIT}tag_teal.webp?v=1) 46 50 fill/calc(var(--pu)*22) calc(var(--pu)*24) stretch;filter:drop-shadow(0 calc(var(--pu)*3) calc(var(--pu)*3) rgba(0,40,40,.3))}
#gp .gmoves b{font-weight:400;font-size:calc(var(--pu)*42);margin:calc(var(--pu)*-10) 0 0;line-height:1}
#gp .gmoves i{font-style:normal;font-size:calc(var(--pu)*15);margin:calc(var(--pu)*1) 0 calc(var(--pu)*-10);line-height:1}
#gp .gb{width:calc(var(--pu)*250);height:calc(var(--pu)*68)}
#gp .gb .k-lbl{font-size:calc(var(--pu)*32)}
#gp .cb{width:calc(var(--pu)*236);height:calc(var(--pu)*58)}
#gp .cb .k-lbl,#gp .cs .k-lbl{color:#1b4b50;text-shadow:none;font-size:calc(var(--pu)*25)}
#gp .cs{width:calc(var(--pu)*150);height:calc(var(--pu)*44)}
#gp .cs .k-lbl{font-size:calc(var(--pu)*19)}
#gp .grows{align-self:stretch;margin:calc(var(--pu)*-6) calc(var(--pu)*-8)}
#gp .grow{display:flex;align-items:center;gap:calc(var(--pu)*12);height:calc(var(--pu)*50);cursor:pointer;position:relative}
#gp .grow+.row::before{content:'';position:absolute;left:4%;right:4%;top:0;height:1.5px;background:rgba(150,105,55,.25)}
#gp .grow img.ic{width:calc(var(--pu)*34);height:calc(var(--pu)*34);object-fit:contain}
#gp .grow span{flex:1;font-size:calc(var(--pu)*21)}
#gp .grow .k-tg{width:calc(var(--pu)*64);height:calc(var(--pu)*33)}
#gp .gcost{position:relative;z-index:2;margin-top:calc(var(--pu)*-20);display:flex;align-items:center;gap:calc(var(--pu)*4);height:calc(var(--pu)*30);padding:0 calc(var(--pu)*6);font-size:calc(var(--pu)*19);
 border-style:solid;border-width:calc(var(--pu)*14) calc(var(--pu)*15);border-image:url(${KIT}cream_sm.webp?v=1) 56 60 fill/calc(var(--pu)*14) calc(var(--pu)*15) stretch}
#gp .gcost img,#gp .gcost span{margin:calc(var(--pu)*-14) 0}#gp .gcost img{width:calc(var(--pu)*20);height:calc(var(--pu)*20)}
#gp .ch{position:absolute;pointer-events:none;z-index:4}
#gp .peek{left:50%;width:calc(var(--pu)*178);margin-left:calc(var(--pu)*-89);bottom:calc(100% - var(--pu)*22);transform-origin:50% 100%}
#gp .bird{left:calc(var(--pu)*-6);width:calc(var(--pu)*88);bottom:calc(100% - var(--pu)*44);transform-origin:50% 100%}
#gp .k-btn .k-shine{border-radius:999px}
/* win */
#gp .wtop{position:relative;height:calc(var(--pu)*120);z-index:4}
#gp .wtitle{position:absolute;left:50%;top:0;width:calc(var(--pu)*270);margin-left:calc(var(--pu)*-135);filter:drop-shadow(0 calc(var(--pu)*4) calc(var(--pu)*4) rgba(0,0,0,.35))}
#gp .meds{position:absolute;left:0;right:0;top:calc(var(--pu)*58);display:flex;justify-content:center;gap:calc(var(--pu)*6)}
#gp .meds img{width:calc(var(--pu)*64);height:calc(var(--pu)*66)}#gp .meds img:nth-child(2){width:calc(var(--pu)*76);height:calc(var(--pu)*78);margin-top:calc(var(--pu)*-8)}
#gp .gstage{position:relative;height:calc(var(--pu)*216);align-self:stretch;margin-top:calc(var(--pu)*-12)}
#gp .wram{position:absolute;left:50%;bottom:0;height:100%;transform:translateX(-50%);transform-origin:50% 100%}
#gp .wram img{height:100%;display:block}
#gp .grays{position:absolute;left:50%;top:50%;width:calc(var(--pu)*300);height:calc(var(--pu)*300);margin:calc(var(--pu)*-160) 0 0 calc(var(--pu)*-150);border-radius:50%;opacity:0;transition:opacity .6s;
 background:repeating-conic-gradient(rgba(255,214,90,.5) 0 9deg,rgba(255,240,180,0) 9deg 22.5deg);-webkit-mask-image:radial-gradient(circle,#000 18%,rgba(0,0,0,.6) 40%,transparent 68%);mask-image:radial-gradient(circle,#000 18%,rgba(0,0,0,.6) 40%,transparent 68%);animation:gpSpin 14s linear infinite}
#gp .lvc{font-size:calc(var(--pu)*23)}
#gp .gbones{display:flex;align-items:center;gap:calc(var(--pu)*8);height:calc(var(--pu)*44);min-width:calc(var(--pu)*170);justify-content:center;font-size:calc(var(--pu)*23);
 border-style:solid;border-width:calc(var(--pu)*18) calc(var(--pu)*19);border-image:url(${KIT}cream_big.webp?v=1) 80 84 fill/calc(var(--pu)*18) calc(var(--pu)*19) stretch}
#gp .gbones>*{margin:calc(var(--pu)*-18) 0;position:relative}#gp .gbones img{width:calc(var(--pu)*42);height:calc(var(--pu)*30);object-fit:contain}
#gp canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}
#gp .hid{opacity:0}
@keyframes gpIn{0%{transform:scale(.8) translateY(6%);opacity:0}60%{transform:scale(1.03) translateY(-.5%);opacity:1}100%{transform:none}}
@keyframes gpRiseIn{0%{transform:translateY(5%);opacity:0}70%{transform:translateY(-.5%);opacity:1}100%{transform:none}}
@keyframes gpDrop{to{transform:translateY(4%) scale(.96);opacity:0}}
@keyframes gpPeek{0%{transform:translateY(60%) scale(.9);opacity:0}55%{transform:translateY(-6%) scale(1.02);opacity:1}80%{transform:translateY(2%)}100%{transform:none;opacity:1}}
@keyframes gpPerch{0%{transform:translate(-40%,-60%) rotate(-20deg);opacity:0}60%{transform:translate(0,4%) rotate(4deg) scaleY(.92);opacity:1}100%{transform:none;opacity:1}}
@keyframes gpBob{50%{transform:translateY(-3%) rotate(-1deg)}}
@keyframes gpPulse{50%{transform:scale(1.045)}}
@keyframes gpSlam{0%{transform:scale(2.6) rotate(-6deg);opacity:0}60%{transform:scale(.92) rotate(1deg);opacity:1}80%{transform:scale(1.04)}100%{transform:none;opacity:1}}
@keyframes gpStamp{0%{transform:scale(2.4) rotate(-25deg);opacity:0}55%{transform:scale(.88) rotate(4deg);opacity:1}75%{transform:scale(1.08)}100%{transform:none;opacity:1}}
@keyframes gpLeap{0%{transform:translateX(-50%) translateY(45%) scale(.55,.4);opacity:0}45%{transform:translateX(-50%) translateY(-8%) scale(.95,1.08);opacity:1}65%{transform:translateX(-50%) translateY(2%) scale(1.06,.93)}100%{transform:translateX(-50%);opacity:1}}
@keyframes gpWiggle{0%,100%{transform:translateX(-50%) rotate(0)}25%{transform:translateX(-50%) rotate(-2.2deg) translateY(-1.5%)}75%{transform:translateX(-50%) rotate(2.2deg) translateY(-1.5%)}}
@keyframes gpPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:none;opacity:1}}
@keyframes gpRise{0%{transform:translateY(40%);opacity:0}100%{transform:none;opacity:1}}
@keyframes gpShake{0%,100%{transform:none}20%{transform:translate(-1.2%,.8%)}40%{transform:translate(1.1%,-.6%)}60%{transform:translate(-.7%,.4%)}80%{transform:translate(.4%,-.2%)}}
#gp .gnote{font-size:calc(var(--pu)*13);color:#8a6d4c;text-align:center}
#gp .gtimer{display:flex;flex-direction:column;align-items:center;margin:calc(var(--pu)*-6) 0 calc(var(--pu)*-10);line-height:1.05}
#gp .gtimer b{font-weight:400;font-size:calc(var(--pu)*18);color:#7b6a55}#gp .gtimer span{font-size:calc(var(--pu)*42);color:#1b4b50}
#gp .gbuy{display:flex;align-items:center;gap:calc(var(--pu)*12);margin:calc(var(--pu)*-6) calc(var(--pu)*-4) calc(var(--pu)*-10);font-size:calc(var(--pu)*17)}
#gp .gbuy img{width:calc(var(--pu)*64);height:calc(var(--pu)*64);object-fit:contain}
#gp .gcost span{white-space:nowrap}
#gp .gprice{position:relative;display:flex;align-items:center;gap:calc(var(--pu)*4);margin-left:calc(var(--pu)*12);padding:calc(var(--pu)*4) calc(var(--pu)*12) calc(var(--pu)*4) calc(var(--pu)*8);border-radius:999px;
 background:rgba(18,80,14,.42);box-shadow:inset 0 calc(var(--pu)*2) calc(var(--pu)*3) rgba(0,0,0,.25);color:#fff;font-size:calc(var(--pu)*20);line-height:1;top:calc(var(--pu)*-1)}
#gp .gprice img{width:calc(var(--pu)*26);height:calc(var(--pu)*18);object-fit:contain;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
#gp .gb .k-lbl{font-size:calc(var(--pu)*30)}#gp .gb.pr .k-lbl{font-size:calc(var(--pu)*26)}
@keyframes gpLeap2{0%{transform:translateY(30%) scale(.6,.45);opacity:0}45%{transform:translateY(-7%) scale(.96,1.07);opacity:1}65%{transform:translateY(1.5%) scale(1.05,.94)}100%{transform:none;opacity:1}}
@keyframes gpWiggle2{0%,100%{transform:rotate(0)}25%{transform:rotate(-2deg) translateY(-1.2%)}75%{transform:rotate(2deg) translateY(-1.2%)}}
#gp .gwr{transform-origin:50% 88%}#gp .gmd{z-index:2}#gp .gwt{z-index:1}
#gp .gart.win .gpin{justify-content:flex-start;gap:calc(var(--pu)*9)}
@keyframes gpSpin{to{transform:rotate(360deg)}}
@keyframes gpBump{40%{transform:scale(1.2)}100%{transform:none}}
#gp .sl{animation:kIn 420ms cubic-bezier(.25,1.35,.5,1) both;animation-delay:calc(var(--i,0)*55ms + 140ms)}
@media (prefers-reduced-motion: reduce){#gp *{animation:none!important}}`;
document.head.appendChild(css);
const gp=document.createElement('div');gp.id='gp';gp.className='kui';gp.setAttribute('role','dialog');gp.setAttribute('aria-modal','true');document.body.appendChild(gp);
const h=(t,c,p)=>{const e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e};
const kimg=(n,c,p)=>{const i=h('img',c,p);i.src=KIT+n+'.webp?v=1';i.alt='';return i};
const pimg=(n,c,p)=>{const i=h('img',c,p);i.src=P+n+'.webp?v=1';i.alt='';return i};
const p2=(n,c,p)=>{const i=h('img',c,p);i.src='bovo11/pop2/'+n+'.webp?v=1';i.alt='';return i};
function fit(){const u=Math.min(innerWidth/393,innerHeight/852)*1.0;gp.style.setProperty('--pu',u+'px');if(fx){const d=Math.min(2,devicePixelRatio||1);fx.width=innerWidth*d;fx.height=innerHeight*d}}
addEventListener('resize',fit);
function snd(n){try{window.BA&&BA.play&&BA.play(n,{gap:60})}catch(e){}}
let st,card,fx,parts=[],timers=[],raf=0,once=false;
const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
// kit button that fires once per pop-up (double-tap guard); fn may return false to allow another tap
function btn(art,label,cls,fn,opt={}){const b=K.button(art,label,()=>{if(once)return;once=true;if(fn()===false){once=false;return}snd('tap')},opt);b.classList.add(cls);return b}
function open(mode){close(true);once=false;gp.innerHTML='';fit();
 st=h('div','gst',gp);card=h('div','gpc',st);fx=h('canvas','',gp);fit();
 card.style.animation=mode=='rise'?'gpRiseIn .3s cubic-bezier(.2,.8,.3,1) both':'gpIn .38s cubic-bezier(.2,.8,.3,1) both';
 gp.classList.add('on');parts=[];startFx();snd(mode=='rise'?'tap':'popper');return card}
function close(now){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(raf);
 if(now||!card){gp.classList.remove('on');gp.innerHTML='';st=card=fx=null;return}
 card.style.animation='gpDrop .22s ease-in both';gp.classList.remove('on');const c=card;setTimeout(()=>{if(card===c){gp.innerHTML='';st=card=fx=null}},240)}
window.gpClose=close;
// ChatGPT art cards: [file, width, height, inner box top, inner box bottom] in the card's own pixels
const ART={ready:['ready',823,1460,700,1395,544,686],lose:['lose',828,1424,705,1360,540,696],pause:['pause',790,1345,535,1275,380,512],win:['win_base',780,1337,800,1290,0,0]};
const priced=(b,n)=>{b.classList.add('pr');const ch=h('div','gprice',b);kimg('ic_bone','',ch);h('span','',ch).textContent=n;return b};
const panel=k=>{const A=ART[k],p=h('div','gart '+k,card);p.style.aspectRatio=A[1]+'/'+A[2];const bg=pimg('','gbg',p);bg.src='bovo11/pop2/'+A[0]+'.webp?v=2';
 p.style.setProperty('--sx',100/A[1]+'%');p.style.setProperty('--sy',100/A[2]+'%');
 const pl=h('div','gplt',p);pl.style.top=A[5]/A[2]*100+'%';pl.style.height=(A[6]-A[5])/A[2]*100+'%';
 const c=h('div','gpin',p);c.style.top=A[3]/A[2]*100+'%';c.style.bottom=(A[2]-A[4])/A[2]*100+'%';c.plate=pl;c.art=p;return c};
const title=(t,c)=>{const e=c.plate;e.innerHTML=t;if(e.querySelector('.tag'))e.classList.add('two');requestAnimationFrame(()=>{let f=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+1&&f>10){f-=1;e.style.fontSize=f+'px'}});e.style.animation='kDrop .5s cubic-bezier(.3,1.6,.5,1) .25s both';return e};
const seq=(el,i)=>{el.classList.add('sl');el.style.setProperty('--i',i);return el};
function goals(list,parent){const g=h('div','ggoals n'+list.length,parent);list.forEach((go,i)=>{const d=h('div','gpgi',g);const im=h('img','',d);im.src=window.goalImg?('a/'+goalImg(go)+'.webp'):'';h('span','',d).textContent=go.left??go.n});return g}
function peek(){const r=pimg('ch_rambo_peek','ch peek',card);r.style.animation='gpPeek .6s cubic-bezier(.3,1.3,.5,1) .15s both';later(900,()=>{r.style.animation='gpBob 2.8s ease-in-out infinite'});return r}
// ---- particles
function startFx(){const g=fx.getContext('2d');let last=performance.now();
 (function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!fx)return;const W=fx.width,H=fx.height,s=W/393;g.clearRect(0,0,W,H);
  parts=parts.filter(p=>p.life>0);for(const p of parts){p.life-=dt/p.dur;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.vx*=Math.pow(.4,dt);p.rot+=p.vr*dt;
   g.save();g.translate(p.x*W,p.y*H);g.rotate(p.rot);g.globalAlpha=Math.min(1,p.life*2.2);
   if(p.k=='i'){if(p.img.complete&&p.img.naturalWidth){const w=s*p.sz,h=w*p.img.naturalHeight/p.img.naturalWidth;g.drawImage(p.img,-w/2,-h/2,w,h)}}
   else if(p.k=='c'){g.fillStyle=p.col;g.fillRect(-4*s,-2*s,8*s,4*s)}
   else{const r=s*p.sz*(.6+.4*Math.sin(p.life*9));g.fillStyle=p.col;g.beginPath();g.moveTo(0,-r);g.quadraticCurveTo(0,0,r,0);g.quadraticCurveTo(0,0,0,r);g.quadraticCurveTo(0,0,-r,0);g.quadraticCurveTo(0,0,0,-r);g.fill()}
   g.restore()}
  raf=requestAnimationFrame(f)})(last)}
const at=el=>{const r=el.getBoundingClientRect();return[(r.left+r.width/2)/innerWidth,(r.top+r.height/2)/innerHeight]};
const PIMGS=['p_bone0','p_bone1','p_bone2','p_pawteal0','p_pawteal1','p_pawgold0','p_pawgold2','p_leaf0','p_leaf1','p_leaf2','p_heart0','p_heart1','p_ball0','p_ball2'].map(k=>{const i=new Image();i.src='fx/'+k+'.webp?v=1';return i});
// celebration: bones, paws, leaves, hearts and tennis balls burst out to the SIDES so the centre (Rambo, reward) stays clear
function confetti([x,y],n,spd=.9,up=.5){for(let i=0;i<n;i++){const side=i%2?1:-1,v=spd*(.45+Math.random()*.6);
 const ang=side>0?(-0.95+Math.random()*0.9):(Math.PI+0.05+Math.random()*0.9);
 parts.push({k:'i',img:PIMGS[Math.floor(Math.random()*PIMGS.length)],x:x+side*(.2+Math.random()*.06),y:y+(Math.random()-.5)*.08,vx:Math.cos(ang)*v*.55,vy:(Math.sin(ang)*v-up*.6)*.5,g:.55,rot:Math.random()*6,vr:(Math.random()-.5)*7,sz:15+Math.random()*12,life:1,dur:1.5+Math.random()*1})}}
function sparkle([x,y],n,r=.1){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=r*(1+Math.random()*2.5);parts.push({k:'s',x,y,vx:Math.cos(a)*v*.45,vy:Math.sin(a)*v*.2,g:0,rot:0,vr:0,sz:5+Math.random()*7,col:i%3?'#fff6c8':'#ffd84a',life:1,dur:.5+Math.random()*.5})}}
// ---------- READY ----------
window.showIntro=function(){if(window.Eco&&Eco.hearts()<1&&!window.GBB_REVIEW_FREE)return noLives();open();
 const T=S.lv.tier;const c=panel('ready');title('<span>Level '+(S.li+1)+'</span>'+(T=='H'||T=='SH'?`<span class="tag ${T=='SH'?'sh':''}">${T=='SH'?'SUPER HARD':'HARD'}</span>`:''),c);
 const pl=seq(h('div','k-plate gplate',c),0);pl.textContent='Goals';
 const bx=seq(h('div','gbox',c),1);goals(S.goals.map(x=>({...x,left:x.n})),bx);
 const mv=seq(h('div','gmoves',c),2);h('b','',mv).textContent=S.moves;h('i','',mv).textContent='Moves';
 const go=btn('green_big','Play','gb',()=>{close();window.say&&say('You got this!');window.hintArm&&hintArm()},{shine:1,delay:'1s'});seq(go,3);c.appendChild(go);
 later(1100,()=>{go.style.animation='gpPulse 2.4s ease-in-out infinite'});
 later(400,()=>{const r=c.art.getBoundingClientRect();sparkle([(r.left+r.width/2)/innerWidth,(r.top+r.height*.08)/innerHeight],10,.08)})};
// ---------- PAUSED ----------
const STG=()=>{try{return Object.assign({music:70,sounds:80},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{music:70,sounds:80}}};
window.g2pause=function(){if(typeof S==='undefined'||!S||S.over)return;open('rise');
 const c=panel('pause');title('Paused',c);
 const s=STG();const bx=seq(h('div','gbox',c),0);const rows=h('div','grows',bx);
 [['ic_music','Music','music'],['ic_speaker','Sound','sounds']].forEach(([ic,lb,k])=>{const r=h('div','grow',rows);kimg(ic,'ic',r);h('span','',r).textContent=lb;
  const t=K.toggle(s[k]>0,v=>{if(!v){s['_'+k]=s[k];s[k]=0}else s[k]=s['_'+k]||(k=='music'?70:80);try{localStorage.setItem('gbb_settings',JSON.stringify(s))}catch(e){};window.BA&&BA.apply&&BA.apply()});t.setAttribute('aria-label',lb);r.appendChild(t);r.onclick=()=>t.click()});
 c.appendChild(seq(btn('green_big','Resume','gb',()=>close(),{shine:1,delay:'1.4s'}),1));
 const moved=()=>S&&S.lv&&S.moves<S.lv.moves;
 c.appendChild(seq(btn('cream_big','Restart','cb',()=>{if(moved()&&window.Eco)Eco.loseHeart();close(true);if(window.Eco&&Eco.hearts()<1)return noLives();startLevel(S.li)}),2));
 c.appendChild(seq(btn('cream_big','Quit','cb',()=>{if(moved()&&window.Eco)Eco.loseHeart();close(true);BA.nav('map.html')}),3));
 if(moved()){const n=h('div','gnote',c);n.textContent='Restarting or quitting now uses 1 life';seq(n,4)}};
// ---------- OUT OF MOVES ----------
window.lose=function(){S.over=true;window.fx&&window.fx('lose');open();
 const c=panel('lose');title('Out of Moves',c);
 const pl=seq(h('div','k-plate gplate',c),0);pl.textContent='Still Needed';
 const bx=seq(h('div','gbox',c),1);goals(S.goals.filter(x=>x.left>0),bx);
 const PM=window.Eco?Eco.PRICE.moves:90;
 const p5=btn('green_big','+5 Moves','gb',()=>{if(window.Eco&&!Eco.spend(PM)){cost.classList.add('short');cost.style.animation='none';void cost.offsetWidth;cost.style.animation='kNope .36s';K.toast('You need '+PM+' bones. You have '+Eco.bones()+'.');return false}close();moreMoves()},{shine:1,delay:'.9s',aria:'Get 5 more moves for '+PM+' bones'});priced(p5,PM);seq(p5,2);c.appendChild(p5);const cost=p5.querySelector('.gprice');
 c.appendChild(seq(btn('cream_big','Give Up','cb',()=>{window.Eco&&Eco.loseHeart();close(true);BA.nav('map.html')},{aria:'Give up, costs one life'}),4));
 later(1000,()=>{p5.style.animation='gpPulse 2.2s ease-in-out infinite'})};
// ---------- OUT OF LIVES ----------
function noLives(){if(typeof S!=='undefined'&&S)S.over=true;open();const c=panel('ready');title('Out of Lives',c);
 const bx=seq(h('div','gbox',c),0);const t=h('div','gtimer',bx);
 const tick=()=>{if(!window.Eco)return;if(Eco.hearts()>0){close(true);if(S)S.over=false;showIntro();return}t.innerHTML='<b>Next life in</b><span>'+Eco.fmt(Eco.nextIn())+'</span>';later(1000,tick)};tick();
 const PL=window.Eco?Eco.PRICE.lives:90;
 const go=btn('green_big','Refill Lives','gb',()=>{if(!Eco.spend(PL)){cst.style.animation='none';void cst.offsetWidth;cst.style.animation='kNope .36s';K.toast('You need '+PL+' bones. You have '+Eco.bones()+'.');return false}Eco.refillHearts();close(true);if(S)S.over=false;showIntro()},{shine:1,aria:'Refill lives for '+PL+' bones'});priced(go,PL);seq(go,1);c.appendChild(go);const cst=go.querySelector('.gprice');
 c.appendChild(seq(btn('cream_big','Back to Map','cb',()=>{close(true);BA.nav('map.html')}),3))}
window.gpNoLives=noLives;
// ---------- GET A BOOSTER ----------
const BN=['Paw Tap','Free Swap','Bomb','Shuffle'],BI=['bst_paw','bst_swap','bst_bomb','bst_shuffle'];
window.gpBuy=function(k){open('rise');const c=panel('pause');title(BN[k],c);
 const bx=seq(h('div','gbox',c),0);const r=h('div','gbuy',bx);kimg(BI[k],'',r);h('span','',r).textContent="You're out of this booster";
 const P=window.Eco?Eco.PRICE.boost[k]:50;
 const b=btn('green_big','Buy 1','gb',()=>{if(!Eco.spend(P)){cst.style.animation='none';void cst.offsetWidth;cst.style.animation='kNope .36s';K.toast('You need '+P+' bones. You have '+Eco.bones()+'.');return false}if(typeof SAVE!=='undefined'&&SAVE.boost){SAVE.boost[k]=(SAVE.boost[k]||0)+1;typeof save==='function'&&save()}else Eco.addBoost(k,1);window.drawBoosters&&drawBoosters();close();K.toast(BN[k]+' added!')},{shine:1,aria:'Buy one '+BN[k]+' for '+P+' bones'});priced(b,P);seq(b,1);c.appendChild(b);const cst=b.querySelector('.gprice');
 c.appendChild(seq(btn('cream_big','Not Now','cb',()=>close()),3))};
// ---------- GOOD BOY! ----------
window.g2results=function(stars,bones){open();
 const c=panel('win'),art=c.art;const pos=(el,x,y,w,hh)=>{Object.assign(el.style,{position:'absolute',left:x/780*100+'%',top:y/1337*100+'%',width:w/780*100+'%',height:hh/1337*100+'%'});return el};
 const wr=pos(p2('win_rambo','gwr hid',art),60,300,660,530);
 const tt=pos(p2('win_title','gwt hid',art),40,0,697,315);
 const MD=[[150,162,156],[295,140,176],[472,162,156]];const md=MD.map(([x,y,z],i)=>pos(p2('medal'+i,'gmd hid',art),x,y,z,z));
 const lv=h('div','lvc hid',c);lv.textContent='Level '+(S.li+1)+' Complete!';
 const bn=h('div','gbones hid',c);kimg('ic_bone','',bn);const bt=h('span','',bn);bt.textContent='+0';
 let ready=false;const next=S.li+1<(window.LEVELS?LEVELS.length:1e9);
 const cont=btn('green_big','Continue','gb',()=>{if(!ready)return false;close(true);next?startLevel(S.li+1):BA.nav('map.html')},{shine:1,delay:'.6s'});cont.classList.add('hid');c.appendChild(cont);
 const rep=btn('cream_sm','Replay','cs',()=>{if(!ready)return false;close(true);startLevel(S.li)});rep.classList.add('hid');c.appendChild(rep);
 const show=(e,anim,ms)=>later(ms,()=>{e.classList.remove('hid');e.style.animation=anim});
 show(tt,'gpSlam .45s cubic-bezier(.3,1.4,.5,1) both',300);
 later(480,()=>{card.style.animation='gpShake .32s ease-out';snd('boom');sparkle(at(tt),18,.14);confetti(at(tt),18,.8,.3)});
 md.forEach((m,i)=>{if(i<stars)later(760+i*260,()=>{m.classList.remove('hid');m.style.animation='gpStamp .42s cubic-bezier(.3,1.4,.5,1) both';later(200,()=>{sparkle(at(m),16,.1);snd('starland'+i)})})});
 later(1500,()=>{wr.classList.remove('hid');wr.style.animation='gpLeap2 .7s cubic-bezier(.25,.9,.35,1) both';snd('rambo_double');
  later(260,()=>{confetti(at(wr),34,1.15,.7)});later(720,()=>{wr.style.animation='gpWiggle2 1.3s ease-in-out infinite'})});
 show(lv,'gpRise .4s ease-out both',1950);
 later(2200,()=>{bn.classList.remove('hid');bn.style.animation='gpRise .3s ease-out both';const t0=performance.now(),D=700;
  (function f(now){const u=Math.min(1,(now-t0)/D);bt.textContent='+'+Math.round(bones*(1-Math.pow(1-u,3)))+' Bones';if(u<1)requestAnimationFrame(f);else{bn.style.animation='gpBump .3s';sparkle(at(bn),12,.08);snd('shimmer')}})(t0)});
 show(cont,'gpPop .45s cubic-bezier(.3,1.5,.5,1) both',2900);later(3350,()=>{cont.style.animation='gpPulse 1.6s ease-in-out infinite'});
 show(rep,'gpPop .4s cubic-bezier(.3,1.5,.5,1) both',3100);later(3150,()=>ready=true);
 // tap early to skip ahead
 card.addEventListener('click',e=>{if(ready||e.target.closest('.k-btn'))return;timers.forEach(clearTimeout);timers=[];
  [tt,lv,bn,cont,rep,wr,...md.slice(0,stars)].forEach(x=>{x.classList.remove('hid');x.style.animation='none'});bt.textContent='+'+bones+' Bones';
  wr.style.animation='gpWiggle2 1.3s ease-in-out infinite';cont.style.animation='gpPulse 1.6s ease-in-out infinite';ready=true})};

// ===== ChatGPT peach cards (Level Start, Out of Moves): the approved mockup art, live numbers on top =====
{const css=document.createElement('style');css.textContent=`
#gp .pc3{position:relative;width:100%;filter:drop-shadow(0 calc(var(--pu)*10) calc(var(--pu)*14) rgba(0,0,0,.45))}
#gp .pc3>img.bgc{display:block;width:100%;height:auto;-webkit-user-drag:none}
#gp .pc3 .ov3{position:absolute;display:flex;align-items:center;justify-content:center;pointer-events:none;white-space:nowrap;line-height:1}
#gp .pc3 .lvl3{color:#17474d;font-size:calc(var(--pu)*35)}
#gp .pc3 .lvl3 .tag{margin-left:.35em;font-size:.42em;padding:.28em .55em;border-radius:.8em;background:#e2483a;color:#fff}#gp .pc3 .lvl3 .tag.sh{background:#7d3bd0}
#gp .pc3 .g3{gap:calc(var(--pu)*14)}#gp .pc3 .g3 div{display:flex;align-items:center;gap:calc(var(--pu)*6);font-size:calc(var(--pu)*31);color:#17474d}
#gp .pc3 .g3 img{height:calc(var(--pu)*40);width:auto}
#gp .pc3 .mv3{color:#fff;font-size:calc(var(--pu)*45)}
#gp .pc3 .z3{position:absolute;pointer-events:auto;cursor:pointer;border-radius:calc(var(--pu)*30);-webkit-tap-highlight-color:transparent;transition:transform 90ms}
#gp .pc3 .z3.dn{transform:scale(.95)}
#gp .pc3 .z3::after{content:'';position:absolute;inset:0;border-radius:inherit;background:rgba(60,20,0,.15);opacity:0;transition:opacity 90ms}#gp .pc3 .z3.dn::after{opacity:1}
#gp .pc3 .pulse3{animation:gpPulse 2.2s ease-in-out infinite}`;document.head.appendChild(css)}
const C3={ready:[724,1231,104,304],lose:[737,1182,97,325],blank:[724,1231,104,0]};
function card3(k){const [W,H,ox,oy]=C3[k];const p=h('div','pc3',card);const bg=h('img','bgc',p);bg.src='bovo11/pop3/'+k+'.webp?v=3';bg.alt='';
 const at=(el,x0,y0,x1,y1)=>{Object.assign(el.style,{left:(x0-ox)/W*100+'%',top:(y0-oy)/H*100+'%',width:(x1-x0)/W*100+'%',height:(y1-y0)/H*100+'%'});p.appendChild(el);return el};
 const zone=(x0,y0,x1,y1,label,fn)=>{const z=at(h('div','z3'),x0,y0,x1,y1);z.setAttribute('role','button');z.setAttribute('aria-label',label);
  z.addEventListener('pointerdown',()=>z.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>z.addEventListener(e,()=>z.classList.remove('dn')));
  z.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn()===false){once=false;return}snd('tap')});return z};
 const goals3=(list,y0,y1)=>{const g=at(h('div','ov3 g3'),130,y0,(W+ox)-30,y1);list.forEach(go=>{const d=h('div','',g);const im=h('img','',d);im.src=window.goalImg?('a/'+goalImg(go)+'.webp'):'';h('span','',d).textContent=go.left??go.n});
  requestAnimationFrame(()=>{let f=1;while(g.scrollWidth>g.clientWidth+1&&f>.5){f-=.05;g.style.transform='scale('+f+')'}});return g};
 return {p,at,zone,goals3}}
window.showIntro=function(){if(window.Eco&&Eco.hearts()<1&&!window.GBB_REVIEW_FREE)return noLives();open();
 const T=S.lv.tier;const c=card3('ready');
 const lv=c.at(h('div','ov3 lvl3'),190,760,746,848);lv.innerHTML='Level '+(S.li+1)+(T=='H'||T=='SH'?` <span class="tag ${T=='SH'?'sh':''}">${T=='SH'?'SUPER HARD':'HARD'}</span>`:'');
 requestAnimationFrame(()=>{let f=parseFloat(getComputedStyle(lv).fontSize);while(lv.scrollWidth>lv.clientWidth+1&&f>10){f-=1;lv.style.fontSize=f+'px'}});
 c.goals3(S.goals.map(x=>({...x,left:x.n})),955,1072);
 const mv=c.at(h('div','ov3 mv3'),300,1110,640,1203);mv.textContent=S.moves;
 const go=c.zone(163,1300,767,1471,'Play',()=>{close();window.say&&say('You got this!');window.hintArm&&hintArm()});
 later(1100,()=>go.classList.add('pulse3'))};
window.lose=function(){S.over=true;window.fx&&window.fx('lose');open();
 const c=card3('lose');c.goals3(S.goals.filter(x=>x.left>0),990,1102);
 const PM=window.Eco?Eco.PRICE.moves:90;
 const p5=c.zone(140,1133,784,1269,'Get 5 more moves for '+PM+' bones',()=>{if(window.Eco&&!Eco.spend(PM)){p5.style.animation='none';void p5.offsetWidth;p5.style.animation='kNope .36s';K.toast('You need '+PM+' bones. You have '+Eco.bones()+'.');return false}close();moreMoves()});
 c.zone(163,1304,764,1433,'Give up, costs one life',()=>{window.Eco&&Eco.loseHeart();close(true);BA.nav('map.html')});
 later(1000,()=>p5.classList.add('pulse3'))};

// ===== peach Pause / Out of Lives / Get a Booster, same card as Level Start =====
{const css=document.createElement('style');css.textContent=`
#gp .pc3 .ttl3{color:#17474d;font-size:calc(var(--pu)*36)}
#gp .pc3 .note3{color:#7a3a1e;font-size:calc(var(--pu)*12.5);white-space:normal;text-align:center;line-height:1.15}
#gp .pc3 .box3{position:absolute;border-radius:calc(var(--pu)*20);background:linear-gradient(#ffd7bd,#ffcfae);box-shadow:inset 0 calc(var(--pu)*2) calc(var(--pu)*3) rgba(150,60,20,.22),0 calc(var(--pu)*1) 0 rgba(255,255,255,.6)}
#gp .pc3 .row3{position:absolute;display:flex;align-items:center;gap:calc(var(--pu)*10);color:#17474d;font-size:calc(var(--pu)*21);pointer-events:auto;cursor:pointer}
#gp .pc3 .row3 img.ic{width:calc(var(--pu)*30);height:calc(var(--pu)*30);object-fit:contain}
#gp .pc3 .row3 .tg3{margin-left:auto;width:calc(var(--pu)*62);height:calc(var(--pu)*29)}
#gp .pc3 .btn3{position:absolute;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 calc(var(--pu)*4) calc(var(--pu)*3) rgba(110,40,10,.35));transition:transform 90ms}
#gp .pc3 .btn3.dn{transform:scale(.95)}
#gp .pc3 .btn3 img{position:absolute;inset:0;width:100%;height:100%}
#gp .pc3 .btn3 b{position:absolute;inset:0 0 10% 0;display:flex;align-items:center;justify-content:center;gap:.3em;font-weight:900;font-size:calc(var(--pu)*26)}
#gp .pc3 .btn3.o b{color:#fff;text-shadow:0 calc(var(--pu)*2) 0 rgba(150,50,10,.45)}
#gp .pc3 .btn3.c b{color:#17474d;font-size:calc(var(--pu)*22)}
#gp .pc3 .btn3 .pr3{display:inline-flex;align-items:center;gap:.15em;font-size:.72em;background:rgba(150,40,10,.28);padding:.1em .45em;border-radius:1em}
#gp .pc3 .btn3 .pr3 img{position:static;width:1.1em;height:auto}
#gp .pc3 .big3{color:#fff;font-size:calc(var(--pu)*44);text-shadow:0 2px 0 rgba(0,60,60,.3)}`;document.head.appendChild(css)}
function btn3(c,x0,y0,x1,y1,kind,label,fn,aria){const b=c.at(h('div','btn3 '+kind),x0,y0,x1,y1);const im=h('img','',b);im.src=kind=='o'?'ui2/btn_wide.webp?v=1':'ui2/btn_cream.webp?v=1';im.alt='';
 const t=h('b','',b);t.innerHTML=label;b.setAttribute('role','button');b.setAttribute('aria-label',aria||t.textContent);
 b.addEventListener('pointerdown',()=>b.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>b.addEventListener(e,()=>b.classList.remove('dn')));
 b.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn()===false){once=false;return}snd('tap')});return b}
const bone3=n=>`<span class="pr3"><img src="${KIT}ic_bone.webp?v=1" alt="">${n}</span>`;
window.g2pause=function(){if(typeof S==='undefined'||!S||S.over)return;open('rise');const c=card3('blank');
 c.at(h('div','ov3 ttl3'),190,418,750,488).textContent='Paused';
 const moved=S&&S.lv&&S.moves<S.lv.moves;
 const bx=c.at(h('div','box3'),150,500,780,720);
 const st=STG();
 [['ic_music','Music','music',520],['ic_speaker','Sound','sounds',620]].forEach(([ic,lb,k,y])=>{const r=c.at(h('div','row3'),185,y,745,y+80);kimg(ic,'ic',r);h('span','',r).textContent=lb;
  let on=st[k]>0;const t=h('img','tg3',r);const draw=()=>{t.src='ui3/settings/'+(on?'tog_on':'tog_off')+'.webp?v=2'};draw();
  r.setAttribute('role','switch');r.setAttribute('aria-label',lb);
  r.addEventListener('click',e=>{e.stopPropagation();on=!on;if(!on){st['_'+k]=st[k];st[k]=0}else st[k]=st['_'+k]||(k=='music'?70:80);try{localStorage.setItem('gbb_settings',JSON.stringify(st))}catch(_){}window.BA&&BA.apply&&BA.apply();draw();snd('tap')})});
 btn3(c,170,755,760,905,'o','Resume',()=>close());
 btn3(c,190,925,740,1035,'c','Restart',()=>{if(moved&&window.Eco)Eco.loseHeart();close(true);if(window.Eco&&Eco.hearts()<1)return noLives();startLevel(S.li)});
 btn3(c,190,1050,740,1160,'c','Quit',()=>{if(moved&&window.Eco)Eco.loseHeart();close(true);BA.nav('map.html')});
 if(moved)c.at(h('div','ov3 note3'),170,1160,760,1196).textContent='Restarting or quitting now uses 1 life'};
function noLives3(){if(typeof S!=='undefined'&&S)S.over=true;open();const c=card3('blank');
 c.at(h('div','ov3 ttl3'),190,418,750,488).textContent='Out of Lives';
 const bx=c.at(h('div','box3'),150,500,780,740);const t=c.at(h('div','ov3 ttl3'),150,520,780,600);t.style.fontSize='calc(var(--pu)*20)';t.textContent='Next life in';
 const tm=c.at(h('div','ov3 big3'),150,600,780,720);tm.style.color='#17474d';
 const tick=()=>{if(!window.Eco)return;if(Eco.hearts()>0){close(true);if(S)S.over=false;showIntro();return}tm.textContent=Eco.fmt(Eco.nextIn());later(1000,tick)};tick();
 const PL=window.Eco?Eco.PRICE.lives:90;
 const go=btn3(c,170,780,760,930,'o','Refill Lives '+bone3(PL),()=>{if(!Eco.spend(PL)){go.style.animation='none';void go.offsetWidth;go.style.animation='kNope .36s';K.toast('You need '+PL+' bones. You have '+Eco.bones()+'.');return false}Eco.refillHearts();close(true);if(S)S.over=false;showIntro()},'Refill lives for '+PL+' bones');
 btn3(c,190,960,740,1070,'c','Back to Map',()=>{close(true);BA.nav('map.html')})}
window.gpNoLives=noLives3;
const _intro=window.showIntro;window.showIntro=function(){if(window.Eco&&Eco.hearts()<1&&!window.GBB_REVIEW_FREE)return noLives3();return _intro.apply(this,arguments)};
window.gpBuy=function(k){open('rise');const c=card3('blank');
 c.at(h('div','ov3 ttl3'),190,418,750,488).textContent=BN[k];
 const bx=c.at(h('div','box3'),150,500,780,760);const ic=c.at(h('img','p'),355,515,575,705);ic.src=KIT+BI[k]+'.webp?v=1';Object.assign(ic.style,{position:'absolute',objectFit:'contain'});
 const t=c.at(h('div','ov3 note3'),160,705,770,755);t.style.fontSize='calc(var(--pu)*16)';t.style.color='#17474d';t.textContent="You're out of this booster";
 const P=window.Eco?Eco.PRICE.boost[k]:50;
 const b=btn3(c,170,790,760,940,'o','Buy 1 '+bone3(P),()=>{if(!Eco.spend(P)){b.style.animation='none';void b.offsetWidth;b.style.animation='kNope .36s';K.toast('You need '+P+' bones. You have '+Eco.bones()+'.');return false}if(typeof SAVE!=='undefined'&&SAVE.boost){SAVE.boost[k]=(SAVE.boost[k]||0)+1;typeof save==='function'&&save()}else Eco.addBoost(k,1);window.drawBoosters&&drawBoosters();close();K.toast(BN[k]+' added!')},'Buy one '+BN[k]+' for '+P+' bones');
 btn3(c,190,970,740,1080,'c','Not Now',()=>close())};
})();

/* Good Boy Bobo — living Home scene (ChatGPT's layered painting + motion plan, built exactly to its pivots and timings).
   Every moving piece is its own painted layer turning about its real pivot (branch base, stem bed, wrist, ear root, neck),
   so nothing warps. Particles are ChatGPT's own painted leaves, petals, motes and flip-book butterflies.
   One dial: ?live=calm (the plan as written) or the default "lively" (same motion, bigger and more often). */
(function(){
const B={"sky":[0,0,1290,2796],"rays":[0,207,908,720],"back":[0,0,1290,1045],"branch_right":[919,0,371,244],"branch_mid":[217,0,620,215],"ground":[0,803,1290,1993],"flowers_right":[1094,1770,196,336],"flowers_left":[0,1756,193,328],"buck":[781,626,509,1093],"buck_under":[781,626,509,1093],"buck_part":[781,626,509,1093],"bunny":[6,1002,365,745],"bunny_under":[6,1002,365,745],"bunny_part":[6,1002,365,745],"bobo":[259,696,742,1126],"bobo_under":[259,696,742,1126],"bobo_part":[259,696,742,1126],"cardinal":[188,1382,288,415],"cardinal_under":[188,1382,288,415],"cardinal_part":[188,1382,288,415],"bobo_blink":[259,696,742,1126],"p_butterfly_blue_01":[384,320],"p_butterfly_blue_02":[384,320],"p_butterfly_blue_03":[384,320],"p_butterfly_blue_04":[384,320],"p_butterfly_blue_05":[384,320],"p_butterfly_blue_06":[384,320],"p_butterfly_monarch_01":[384,320],"p_butterfly_monarch_02":[384,320],"p_butterfly_monarch_03":[384,320],"p_butterfly_monarch_04":[384,320],"p_butterfly_monarch_05":[384,320],"p_butterfly_monarch_06":[384,320],"p_leaf_beech":[256,256],"p_leaf_birch":[256,256],"p_leaf_maple":[256,256],"p_leaf_oak":[256,256],"p_mote_amber":[128,128],"p_mote_gold":[128,128],"p_mote_ivory":[128,128],"p_petal_cosmos":[256,256],"p_petal_daisy":[256,256],"p_petal_rose":[256,256]};
const DIR='live/',V='?v=5',W=1290,H=2796;
const Q=new URLSearchParams(location.search);let mode=Q.get('live')||(()=>{try{return localStorage.getItem('gbb_live')}catch(e){}})()||'lively';
const M=mode==='calm'?{amp:1,rate:1,parts:1,size:1,g:1}:{amp:6,rate:.42,parts:3,size:2.4,g:3.2};
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
const stage=document.getElementById('stage');if(!stage)return;if(Q.get('seek'))window.__liveSeek=1;
const css=document.createElement('style');css.textContent=`
#living{position:absolute;inset:0;overflow:hidden;pointer-events:none}
#living img{position:absolute;display:block;max-width:none;-webkit-user-drag:none;will-change:transform}
#living .pt{will-change:transform,opacity}`;document.head.appendChild(css);
const root=document.createElement('div');root.id='living';stage.insertBefore(root,stage.firstChild);
const pc=v=>v*100;
function add(n,ext){const b=B[n],i=new Image();i.decoding='async';i.src=DIR+n+(ext||'.webp')+V;i.alt='';
 Object.assign(i.style,{left:pc(b[0]/W)+'%',top:pc(b[1]/H)+'%',width:pc(b[2]/W)+'%',height:pc(b[3]/H)+'%'});root.appendChild(i);i._b=b;return i}
const piv=(i,x,y)=>{i.style.transformOrigin=pc((x-i._b[0])/i._b[2])+'% '+pc((y-i._b[1])/i._b[3])+'%';i._p=[x,y]};
// ---- the stack, back to front (ChatGPT's neutralOrder)
add('sky','.jpg');const rays=add('rays');add('back');
const brR=add('branch_right'),brM=add('branch_mid');piv(brR,1278,62);piv(brM,285,35);
add('ground');const flR=add('flowers_right'),flL=add('flowers_left');piv(flR,1234,2025);piv(flL,45,2004);
const CH={};
for(const [c,p] of [['buck',[1075,921]],['bunny',[120,1264]],['bobo',[381,1225]],['cardinal',[390,1561]]]){
 const rest=add(c),under=add(c+'_under'),part=add(c+'_part');under.style.opacity=0;part.style.opacity=0;piv(part,p[0],p[1]);
 CH[c]={rest,under,part,last:-99}}
const blink=add('bobo_blink');blink.style.opacity=0;
const ptl=document.createElement('div');ptl.style.cssText='position:absolute;inset:0';root.appendChild(ptl);
// hide the old painted still + video under us
const oldCv=document.getElementById('gl');if(oldCv)oldCv.style.display='none';
// ---- clock: real seconds, paused while Home is hidden (the shell holds animation frames), bounded step
let t=0,last=0;const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,smooth=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
const sway=(el,amp,per,start)=>{const k=t-start;if(k<0){el.style.transform='';return}const ramp=smooth(k/(per/2));el.style.transform='rotate('+(amp*M.amp*ramp*Math.sin(2*Math.PI*k/per)).toFixed(4)+'deg)'};
// key-framed rigid gesture: angles [a0,a1,a2,0] over segment times
function gestureAngle(k,keys,segs){let a=0,s=0;for(let i=0;i<segs.length;i++){if(k<s+segs[i]){const u=ease((k-s)/segs[i]);return keys[i]+(keys[i+1]-keys[i])*u}s+=segs[i]}return null}
const G={bobo:{keys:[0,2,-1,0],segs:[.2,.23,.39],first:9.6,every:19},bunny:{keys:[0,-2.1,.5,0],segs:[.12,.13,.29],first:6.1,every:13.6},
 cardinal:{keys:[0,3,3,0],segs:[.27,.18,.4],first:12.4,every:17.7},buck:{keys:[0,2.3,-.7,0],segs:[.15,.16,.37],first:14.8,every:21.2}};
for(const c in G){G[c].next=G[c].first*M.rate+(M.rate<1?1.5:0);G[c].every*=M.rate}
let active=null;   // only one character gesture at a time
function fire(c){if(c==='bobo'&&boboLive)return false;if(active||t-CH[c].last<3)return false;active={c,t0:t};CH[c].last=t;const C=CH[c];C.under.style.opacity=1;C.part.style.opacity=1;C.rest.style.opacity=0;return true}
function runGesture(){if(!active)return;const g=G[active.c],C=CH[active.c],k=t-active.t0;const amp=M.g*({bobo:.7,bunny:.85,cardinal:.8,buck:.9}[active.c]||1);
 const a=gestureAngle(k,g.keys,g.segs);if(a===null){C.part.style.transform='';C.rest.style.opacity=1;C.under.style.opacity=0;C.part.style.opacity=0;active=null;return}
 C.part.style.transform='rotate('+(a*amp).toFixed(3)+'deg)'}
// blink
let nextBlink=2.8;function runBlink(){const k=t-nextBlink;if(k<0){blink.style.opacity=0;return}
 let o=0;if(k<.065)o=1-Math.pow(1-k/.065,2);else if(k<.109)o=1;else if(k<.2)o=1-ease((k-.109)/.091);else{nextBlink+=6.7*(M.rate<1?.8:1);o=0}
 if(active&&active.c==='bobo')o=0;blink.style.opacity=o.toFixed(3)}

// ---- Bobo, really animated (Higgsfield clip on green, keyed out live; the painted Bobo stays as the fallback)
const BL=[233.35,694.75,793,1128.5];let boboLive=false;
(function(){if(RM)return;const cv=document.createElement('canvas');Object.assign(cv.style,{position:'absolute',left:pc(BL[0]/W)+'%',top:pc(BL[1]/H)+'%',width:pc(BL[2]/W)+'%',height:pc(BL[3]/H)+'%',opacity:0,transition:'opacity .35s',pointerEvents:'none'});
 CH.bobo.rest.after(cv);
 const gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return;
 const vs='attribute vec2 p;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
 const fs='precision mediump float;varying vec2 t;uniform sampler2D v;void main(){vec3 c=texture2D(v,t).rgb;float m=max(c.r,c.b);float g=c.g-m;float a=1.-smoothstep(.08,.30,g);c.g=min(c.g,m+.015);gl_FragColor=vec4(c*a,a);}';
 const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o};const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
 const size=()=>{const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);cv.width=Math.max(2,Math.round(r.width*d));cv.height=Math.max(2,Math.round(r.height*d))};
 const v=document.createElement('video');v.src=DIR+'bobo_live.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.autoplay=true;v.preload='auto';for(const a of ['muted','playsinline','webkit-playsinline','autoplay','loop'])v.setAttribute(a,'');
 let lastT=-1;const draw=()=>{if(v.readyState<2)return false;if(v.currentTime===lastT)return true;lastT=v.currentTime;try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,v)}catch(e){return false}
  gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return true};
 const on=()=>{if(boboLive)return;size();if(!draw())return;boboLive=true;cv.style.opacity=1;setTimeout(()=>{const C=CH.bobo;[C.rest,C.under,C.part].forEach(i=>i.style.visibility='hidden');blink.style.visibility='hidden'},380)};
 v.addEventListener('playing',()=>{on()});addEventListener('resize',()=>{if(boboLive){size();lastT=-1}});
 const tick=()=>{requestAnimationFrame(tick);if(window.__liveSeek)return;if(v.paused&&!document.hidden&&!window.GBB_HIDDEN){const p=v.play();p&&p.catch&&p.catch(()=>{})}if(boboLive)draw();else if(v.readyState>=2&&!v.paused)on()};
 const p=v.play();p&&p.catch&&p.catch(()=>{});addEventListener('pointerdown',()=>{if(v.paused){const q=v.play();q&&q.catch&&q.catch(()=>{})}},{passive:true});tick();
 window.GBB_BOBO_VIDEO=v;window.__boboDraw=()=>{lastT=-1;size();draw();cv.style.opacity=1;const C=CH.bobo;[C.rest,C.under,C.part].forEach(i=>i.style.visibility='hidden');blink.style.visibility='hidden'}})();
// ---- particles (ChatGPT's painted sprites)
const P=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function sprite(n,w){const i=new Image();i.src=DIR+'p_'+n+'.webp'+V;i.className='pt';i.alt='';const r=B['p_'+n][1]/B['p_'+n][0];
 Object.assign(i.style,{width:pc(w/W)+'%',height:pc(w*r/H)+'%',left:0,top:0,opacity:0});ptl.appendChild(i);return i}
const place=(el,x,y,rot,op,sc)=>{el.style.transform=`translate(${(x/el._w*100).toFixed(2)}%,${(y/el._h*100).toFixed(2)}%) rotate(${(rot||0).toFixed(2)}deg) scale(${sc||1})`;el.style.opacity=op.toFixed(3)};
function spawnMote(){const n=['mote_gold','mote_amber','mote_ivory'][Math.floor(rnd()*3)],w=(4+rnd()*5)*M.size*1.6,el=sprite(n,w);el._w=w;el._h=w;
 const x0=60+rnd()*460,y0=330+rnd()*400,dx=(12+rnd()*9)*M.size,dy=-(28+rnd()*18)*M.size,d=4.8+rnd()*1.2;P.push({el,t0:t,d,f:k=>{const u=k/d;place(el,x0+dx*u,y0+dy*u,0,.28*Math.sin(Math.PI*u)*(M.amp>1?1.6:1))}})}
function spawnLeaf(){const n=['leaf_oak','leaf_maple','leaf_birch','leaf_beech','petal_rose','petal_daisy','petal_cosmos'][Math.floor(rnd()*7)],w=(9+rnd()*10)*M.size*1.4,el=sprite(n,w);el._w=w;el._h=w;
 const big=M.amp>1,x0=big?300+rnd()*600:360+rnd()*500,y0=big?150+rnd()*80:200,DX=big?(rnd()<.5?-1:1)*(160+rnd()*200):78,DY=big?650+rnd()*350:48,d=big?7+rnd()*2:5.6,cross=(big?40:12),r0=rnd()*360,rs=(big?140:31)*(rnd()<.5?-1:1);
 P.push({el,t0:t,d,f:k=>{const u=k/d,e=big?u:ease(u);const fade=k>d-.65?(d-k)/.65:Math.min(1,k/.4);place(el,x0+DX*e+cross*Math.sin(u*Math.PI*3),y0+DY*e,r0+rs*u,.95*fade)}})}
let fly=0;function spawnButterfly(){const sp=(fly++%2)?'blue':'monarch',w=(29+rnd()*10)*M.size*1.5;const fr=[1,2,3,4,5,6].map(i=>{const e=sprite('butterfly_'+sp+'_0'+i,w);e._w=w;e._h=w*320/384;return e});
 const left=rnd()<.5,big=M.amp>1,x0=left?(big?-60:60):(big?1350:1210),dir=left?1:-1,y0=left?1690:1700,TX=(big?520+rnd()*260:126)*dir,RY=big?-260-rnd()*200:-36,d=big?8.5:5.2;
 P.push({el:fr[0],all:fr,t0:t,d,f:k=>{const u=k/d,e=big?u:ease(u),fi=Math.floor(k*12)%6,op=Math.min(1,k/.45,(d-k)/.45);
  const x=x0+TX*e+8*Math.sin(u*Math.PI*4),y=y0+RY*e+(big?22*Math.sin(u*Math.PI*6):0);
  fr.forEach((f,i)=>place(f,x,y,dir<0?0:0,i===fi?op:0,dir<0?1:1));fr.forEach(f=>f.style.transform+=dir<0?' scaleX(-1)':'')}})}
let nextMote=2.6,nextLeaf=(M.amp>1?5:14),nextFly=(M.amp>1?8:26);
function runParticles(){
 const motes=P.filter(p=>p.mote).length;if(t>=nextMote){if(motes<3*M.parts){spawnMote();P[P.length-1].mote=1}nextMote=t+1.9/M.parts}
 if(t>=nextLeaf){if(!P.some(p=>p.leaf)||M.amp>1){spawnLeaf();P[P.length-1].leaf=1}nextLeaf=t+(M.amp>1?6+rnd()*5:18+rnd()*8)}
 if(t>=nextFly){if(!P.some(p=>p.fly)&&!active){spawnButterfly();P[P.length-1].fly=1;nextFly=t+(M.amp>1?16:28)}else nextFly=t+2}
 for(let i=P.length-1;i>=0;i--){const p=P[i],k=t-p.t0;if(k>=p.d){(p.all||[p.el]).forEach(e=>e.remove());P.splice(i,1)}else p.f(k)}}
// ---- frame loop
function frame(now){requestAnimationFrame(frame);if(window.__liveSeek)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;t+=dt;try{step()}catch(e){}}
function step(){
 if(!RM){sway(brM,.36,M.amp>1?5.6:7.8,.9);sway(brR,.43,M.amp>1?6.4:9.2,1.6);sway(flL,.26*(M.amp>1?1.4:1),M.amp>1?4.2:5.2,.6);sway(flR,.32*(M.amp>1?1.4:1),M.amp>1?4.8:6.1,1.1);
  rays.style.opacity=t<2.9?1:(.975+.025*Math.cos(2*Math.PI*(t-2.9)/10.8)).toFixed(3);
  for(const c in G)if(t>=G[c].next){if(!fire(c)&&active)G[c].next=t+1.5;else G[c].next=t+G[c].every}
  runGesture();runParticles()}
 runBlink()}
requestAnimationFrame(n=>{last=n;requestAnimationFrame(frame)});
// ---- tap a character: he reacts (the UI keeps its own taps)
const hit={};for(const c of ['cardinal','bobo','bunny','buck']){const im=new Image();im.src=DIR+c+'.webp'+V;im.onload=()=>{const k=.25,cv=document.createElement('canvas');cv.width=Math.ceil(im.width*k);cv.height=Math.ceil(im.height*k);const g=cv.getContext('2d');g.drawImage(im,0,0,cv.width,cv.height);hit[c]={d:g.getImageData(0,0,cv.width,cv.height).data,w:cv.width,h:cv.height,k}}}
let down=null;addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY,e.target]},true);
addEventListener('pointerup',e=>{const d=down;down=null;if(!d||Math.hypot(e.clientX-d[0],e.clientY-d[1])>16||RM)return;
 if(d[2].closest&&d[2].closest('.k-btn,.k-top,#gbnav,.hb3,#logo,[role=button],a,button'))return;
 const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
 for(const c of ['cardinal','bobo','bunny','buck']){const h=hit[c],b=B[c];if(!h)continue;const ix=Math.floor((x-b[0])*h.k),iy=Math.floor((y-b[1])*h.k);
  if(ix<0||iy<0||ix>=h.w||iy>=h.h||h.d[(iy*h.w+ix)*4+3]<100)continue;
  if(active&&active.c!==c)return;if(fire(c)){G[c].next=t+G[c].every;try{window.BA&&BA.play&&BA.play('tap',{gap:200})}catch(_){}}return}},true);
window.GBB_LIVE={seek(sec){window.__liveSeek=1;while(t<sec-1e-6){t=Math.min(sec,t+1/60);step()}},get mode(){return mode},set(m){try{localStorage.setItem('gbb_live',m)}catch(e){}location.reload()}};
})();

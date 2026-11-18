/* Good Boy Bobo — Rambo's live reactions on the gameplay top bar.
   Three MiniMax clips (happy, cheer, worry) on green, keyed live in WebGL. Each clip starts and ends on his normal pose,
   so between reactions he simply holds that pose; the bar art underneath has no Rambo, so nothing doubles up. */
(function(){
const KC=390/1290,K=1290/852,u=v=>v*K*KC;
const BASE='bovo11/play2/react/',V='?v=3';
// video square in 852-units (see topbar2x crop: bar px * .45, video covers bar x 1052..1772, y -80..640)
const FRAME={std:{S:1.6,ox:109,oy:128},low:{S:1.2,ox:226,oy:384}};
const K2=.45*.846;   // new ChatGPT peach bar: video mapped so its ledge (bar Y 560) sits on the new ledge and Rambo matches the mockup size
const box=f=>{const X0=1120-f.ox/f.S,Y0=-f.oy/f.S,size=1152/f.S;return{x:644.8+(X0-1362.8)*K2,y:373.6+(Y0-560)*K2,s:size*K2,f0:(596-Y0)/size,f1:(604-Y0)/size,X0,Y0,size}};
const CLIP={happy:'std',cheer:'low',worry:'std',pant:'std'};
let cv,gl,tex,vids={},cur=null,ready=false,lastAct=performance.now(),worryShown=-1;
function build(){if(window.NO_RREACT)return;const h=document.getElementById('g2hud');const bar=[...document.querySelectorAll('img.flp')].find(i=>/topbar3/.test(i.src));
 if(!h||!bar)return setTimeout(build,80);
 const B=box(FRAME.low);   // the canvas covers the roomier framing; the standard clips are drawn into their own square inside it
 cv=document.createElement('canvas');cv.id='rReact';Object.assign(cv.style,{position:'absolute',left:u(B.x)+'px',top:u(B.y)+'px',width:u(B.s)+'px',height:u(B.s)+'px',pointerEvents:'none',filter:'drop-shadow(0 5px 7px rgba(0,25,30,.35))'});
 bar.after(cv);cv.B=B;
 const DPR=Math.min(2,devicePixelRatio||1);cv.width=cv.height=Math.round(u(B.s)*DPR*(window.G2K||1));
 gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return;
 const vs=`attribute vec2 p;uniform vec4 r;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);vec2 q=r.xy+t*r.zw;gl_Position=vec4(q.x*2.-1.,1.-q.y*2.,0.,1.);}`;
 const fs=`precision mediump float;varying vec2 t;uniform sampler2D v;uniform vec2 fd;uniform vec3 bb;uniform float op;uniform float bx;
 float toe(float X,float Y,float cx,float rx,float ry){float d=length(vec2((X-cx)/rx,(Y-557.)/ry));return 1.-smoothstep(.9,1.04,d);}
 void main(){float Y=bb.y+t.y*bb.z;float w=1.-smoothstep(330.,520.,Y);w*=.55+.45*smoothstep(520.,120.,Y);vec2 q=t+vec2(0.,bb.x*w/bb.z);vec3 c=texture2D(v,q).rgb;float m=max(c.r,c.b);float g=c.g-m;
  float a=1.-smoothstep(.10,.38,g);if(q.y>1.)a=0.;
  c.g=min(c.g,m+.02);                                  // remove green spill on the fur edge
  float X=bx+t.x*bb.z;
  if(Y>390.&&(X<1146.||(X<1172.&&(c.r-c.b)>.085)||(X<1172.&&Y<480.)))a=0.;                              // old cream bar end inside the clip
  if(Y>557.){float k=0.;            // ledge: keep only Rambo's toes (they rest on the new bar), drop the clip's old cream sign
   k=max(k,toe(X,Y,1158.,21.,24.));k=max(k,toe(X,Y,1208.,29.,30.));k=max(k,toe(X,Y,1261.,20.,24.));
   k=max(k,toe(X,Y,1502.,22.,25.));k=max(k,toe(X,Y,1556.,30.,30.));k=max(k,toe(X,Y,1610.,23.,24.));a*=k;}
  a*=1.-smoothstep(fd.x,fd.y,t.y);
  a*=op;gl_FragColor=vec4(c*a,a);}`;
 const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 cv.pr=pr;tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
 for(const k of ['happy','cheer','worry','pant']){const v=document.createElement('video');v.src=BASE+k+'.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.preload='auto';
  for(const a of ['muted','playsinline','webkit-playsinline'])v.setAttribute(a,'');v.crossOrigin='anonymous';vids[k]=v;
  v.kind=k;if(k!=='pant')v.addEventListener('ended',()=>{if(cur===v){fadeFrom=v;fadeT=0;cur=null;resumePant();lastAct=performance.now()}})}
 const h0=vids.pant;
 const first=()=>{if(ready)return;ready=true;resumePant(0);draw(h0);bar.src='bovo11/play2/topbar3_noram.webp?v=1'};   // swap the bar only once live Rambo is on screen
 h0.addEventListener('loadeddata',()=>{h0.currentTime=0;setTimeout(first,60)});h0.load();
 loop()}
function draw(v,op=1,keep=false){if(!gl||v.readyState<2)return;gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1f(gl.getUniformLocation(cv.pr,'op'),op);
 const b=box(FRAME[CLIP[v.kind]]),B=cv.B;gl.uniform4f(gl.getUniformLocation(cv.pr,'r'),(b.x-B.x)/B.s,(b.y-B.y)/B.s,b.s/B.s,b.s/B.s);gl.uniform2f(gl.getUniformLocation(cv.pr,'fd'),b.f0,b.f1);gl.uniform1f(gl.getUniformLocation(cv.pr,'bx'),b.X0);
 const f=FRAME[CLIP[v.kind]];gl.uniform3f(gl.getUniformLocation(cv.pr,'bb'),breath(),-f.oy/f.S,1152/f.S);
 try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,v)}catch(e){return}
 gl.viewport(0,0,cv.width,cv.height);if(!keep){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT)}gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
// breathing: a soft in-out rhythm (about 2.4s a breath); fades out while a reaction plays and back in after
let bAmp=1,bT0=performance.now();
function breath(){const t=(performance.now()-bT0)/1000,ph=(t%2.4)/2.4;const e=ph<.42?Math.sin(ph/.42*Math.PI/2):Math.cos((ph-.42)/.58*Math.PI/2);return 0*e*bAmp}
let lastCombo=0,lastSp=-1,fr=0;
let P={n:138,fps:24,handoff:[113]},pending=null,fadeFrom=null,fadeT=1;fetch(BASE+'pant.json'+V).then(r=>r.json()).then(j=>P=j).catch(()=>{});
const pIdx=()=>Math.round(vids.pant.currentTime*P.fps)%P.n;
function resumePant(at){const v=vids.pant;if(!v)return;v.currentTime=(at!=null?at:P.handoff[0])/P.fps;const p=v.play();p&&p.catch&&p.catch(()=>{})}
function loop(){const pv=vids.pant;
 if(ready&&pv){ if(pv.duration&&pv.currentTime>=pv.duration-0.03){pv.currentTime=0;const p=pv.play();p&&p.catch&&p.catch(()=>{})}
  if(pv.paused&&!cur&&!document.hidden){const p=pv.play();p&&p.catch&&p.catch(()=>{})}
  if(pending&&!cur){const i=pIdx();if(P.handoff.some(h=>Math.abs(h-i)<=0)||performance.now()-pending.t>2200){start(pending.k);pending=null}}}
 if(cur&&!cur.paused){ if(fadeT<1&&fadeFrom){fadeT+=1/5;draw(fadeFrom);draw(cur,Math.min(1,fadeT),true)}else draw(cur)}
 else if(ready&&!cur&&pv){ if(fadeT<1&&fadeFrom){fadeT+=1/5;draw(fadeFrom);draw(pv,Math.min(1,fadeT),true)}else draw(pv)}
 if(typeof S!=='undefined'&&S){const c=S.combo||0;if(c>=2&&lastCombo<2)play('happy');if(c>=5&&lastCombo<5)play('cheer',true);lastCombo=c;
  if(++fr%10==0&&typeof allCells=='function'){try{const n=allCells().filter(x=>x.p&&x.p.sp).length;if(lastSp>=0&&n>lastSp)play('happy');lastSp=n}catch(e){}}}
 // a little life when nothing has happened for a while
 if(ready&&!cur&&performance.now()-lastAct>26000&&typeof S!=='undefined'&&S&&!S.over&&!document.getElementById('gp')?.classList.contains('on'))play('happy');
 requestAnimationFrame(loop)}
let coolUntil=0;
function play(k,force){const v=vids[k];if(!ready||!v)return;if(cur&&!force)return;if(!force&&performance.now()<coolUntil)return;coolUntil=performance.now()+2500;lastAct=performance.now();
 if(cur){start(k);return}pending={k,t:performance.now()}}
function start(k){const v=vids[k];fadeFrom=cur||vids.pant;fadeT=0;if(cur&&cur!==v)cur.pause();cur=v;v.currentTime=0;const p=v.play();p&&p.catch&&p.catch(()=>{cur=null});setTimeout(()=>{if(cur===v)vids.pant.pause()},250)}
window.rReact=play;window.rVids=vids;window.rDbg=()=>({P,pending,cur:cur&&cur.kind});
// game hooks: good match / goal done -> happy, rainbow / big moments -> cheer, last 5 moves -> worried (once per level)
window.ramboReact=function(kind){if(kind==='big')play('cheer',true);else play('happy')};
const _dm=window.drawMoves;window.drawMoves=function(){_dm&&_dm.apply(this,arguments);
 if(typeof S!=='undefined'&&S&&!S.over&&S.moves<=5&&S.moves>0&&worryShown!==S.li){worryShown=S.li;setTimeout(()=>play('worry',true),350)}};
const _sl=window.startLevel;if(_sl)window.startLevel=function(){worryShown=-1;lastSp=-1;return _sl.apply(this,arguments)};
build();
})();

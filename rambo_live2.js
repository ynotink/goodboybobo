/* Good Boy Bobo — live Rambo (raised-paw pose) on the gameplay top bar.
   Four MiniMax clips on green, keyed live in WebGL, drawn exactly over the Rambo sprite and behind the bar:
   pant (idle loop), happy, cheer, worry. Every clip starts and ends on the sprite's pose, so switching is seamless. */
(function(){
const BASE='bovo11/play2/react2/',V='?v=1';
// where the sprite sits inside the 1280px source frame
const SX=141/1280,SW=998/1280,SY=382/1280,SH=898/1280;
let cv,gl,tex,pr,vids={},cur=null,ready=false,fadeFrom=null,fadeT=1,lastAct=performance.now(),worryShown=-1;
function build(){const r4=document.getElementById('rambo4'),hud=document.getElementById('hud4');if(!r4||!hud||!r4.style.width)return setTimeout(build,80);
 const L=parseFloat(r4.style.left),T=parseFloat(r4.style.top),W=parseFloat(r4.style.width);const size=W/SW;
 cv=document.createElement('canvas');cv.id='rambo4v';cv.className='flp';
 Object.assign(cv.style,{left:(L-SX*size)+'px',top:(T-SY*size)+'px',width:size+'px',height:size+'px',pointerEvents:'none',transformOrigin:`${(SX+SW/2)*100}% ${(SY+SH)*100}%`,filter:'drop-shadow(0 4px 5px rgba(0,18,22,.35))',opacity:0,transition:'opacity .25s'});
 hud.parentNode.insertBefore(cv,hud);
 const DPR=Math.min(3,devicePixelRatio||1),k=(window.G2K||1);cv.width=cv.height=Math.round(size*DPR*k);
 gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return;
 const vs=`attribute vec2 p;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
 const fs=`precision mediump float;varying vec2 t;uniform sampler2D v;uniform float op;
 void main(){vec3 c=texture2D(v,t).rgb;float m=max(c.r,c.b);float g=c.g-m;float a=1.-smoothstep(.10,.36,g);
  c.g=min(c.g,m+.02);a*=op;gl_FragColor=vec4(c*a,a);}`;
 const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o};
 pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
 for(const k of ['pant','happy','cheer','worry']){const v=document.createElement('video');v.src=BASE+k+'.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.preload='auto';
  for(const a of ['muted','playsinline','webkit-playsinline'])v.setAttribute(a,'');v.crossOrigin='anonymous';v.kind=k;vids[k]=v;
  if(k==='pant')v.loop=true;else v.addEventListener('ended',()=>{if(cur===v){fadeFrom=v;fadeT=0;cur=null;lastAct=performance.now()}})}
 const p0=vids.pant;
 p0.addEventListener('loadeddata',()=>{const go=()=>{if(ready)return;ready=true;draw(p0);cv.style.opacity=1;setTimeout(()=>{r4.style.visibility='hidden'},260)};
  const pp=p0.play();pp&&pp.then?pp.then(go).catch(()=>{}):go()});p0.load();
 // iPhone: start on first touch if autoplay was blocked
 addEventListener('pointerdown',()=>{if(!ready||vids.pant.paused){const pp=vids.pant.play();pp&&pp.catch&&pp.catch(()=>{})}},{passive:true});
 loop()}
function draw(v,op=1,keep=false){if(!gl||v.readyState<2)return;gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1f(gl.getUniformLocation(pr,'op'),op);
 try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,v)}catch(e){return}
 gl.viewport(0,0,cv.width,cv.height);if(!keep){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT)}gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
let lastV=null,lastT=-1,lastCombo=0,lastSp=-1,fr=0,coolUntil=0;
function loop(){const pv=vids.pant;
 if(ready&&pv){if(pv.paused&&!cur&&!document.hidden){const p=pv.play();p&&p.catch&&p.catch(()=>{})}
  const v=cur||pv;if(fadeT<1&&fadeFrom){fadeT+=1/6;draw(fadeFrom);draw(v,Math.min(1,fadeT),true);lastV=null}else if(v!==lastV||v.currentTime!==lastT){draw(v);lastV=v;lastT=v.currentTime}}   // only upload a new texture when the clip has a new frame
 if(typeof S!=='undefined'&&S){const c=S.combo||0;if(c>=2&&lastCombo<2)play('happy');if(c>=5&&lastCombo<5)play('cheer',true);lastCombo=c;
  if(++fr%10==0&&typeof allCells=='function'){try{const n=allCells().filter(x=>x.p&&x.p.sp).length;if(lastSp>=0&&n>lastSp)play('happy');lastSp=n}catch(e){}}}
 if(ready&&!cur&&performance.now()-lastAct>24000&&typeof S!=='undefined'&&S&&!S.over&&!document.getElementById('gp')?.classList.contains('on'))play('happy');
 requestAnimationFrame(loop)}
// iPhone Safari ignores preload on videos that aren't playing, so the reaction clips never loaded there:
// warm every clip up on the first touch, and if one still isn't ready, load it and retry.
let warmed=false;function warm(){if(warmed)return;warmed=true;for(const k of ['happy','cheer','worry']){const v=vids[k];if(!v)continue;try{v.load();const p=v.play();p&&p.then&&p.then(()=>{if(cur!==v){v.pause();v.currentTime=0}}).catch(()=>{})}catch(e){}}}
addEventListener('pointerdown',warm,{passive:true});addEventListener('touchstart',warm,{passive:true});
function play(k,force){const v=vids[k];if(!ready||!v)return;
 if(v.readyState<2){if(!v._retry){v._retry=1;try{v.load();const p=v.play();p&&p.then&&p.then(()=>{v.pause();v._retry=0;play(k,force)}).catch(()=>{v._retry=0})}catch(e){v._retry=0}}return}if(cur&&!force)return;if(!force&&performance.now()<coolUntil)return;coolUntil=performance.now()+2500;lastAct=performance.now();
 fadeFrom=cur||vids.pant;fadeT=0;if(cur&&cur!==v)cur.pause();cur=v;v.currentTime=0;const p=v.play();p&&p.catch&&p.catch(()=>{cur=null})}
window.rReact=play;window.rVids=vids;
window.ramboReact=function(kind){if(kind==='big')play('cheer',true);else play('happy')};
addEventListener('gbbPraise',()=>play('cheer',true));
const _dm=window.drawMoves;window.drawMoves=function(){_dm&&_dm.apply(this,arguments);
 if(typeof S!=='undefined'&&S&&!S.over&&S.moves<=5&&S.moves>0&&worryShown!==S.li){worryShown=S.li;setTimeout(()=>play('worry',true),350)}};
const _sl=window.startLevel;if(_sl)window.startLevel=function(){worryShown=-1;lastSp=-1;return _sl.apply(this,arguments)};
build();
})();

/* Good Boy Bobo — Rambo's live reactions on the gameplay top bar.
   Three MiniMax clips (happy, cheer, worry) on green, keyed live in WebGL. Each clip starts and ends on his normal pose,
   so between reactions he simply holds that pose; the bar art underneath has no Rambo, so nothing doubles up. */
(function(){
const KC=390/1290,K=1290/852,u=v=>v*K*KC;
const BASE='bovo11/play2/react/',V='?v=1';
// video square in 852-units (see topbar2x crop: bar px * .45, video covers bar x 1052..1772, y -80..640)
const BOX={x:516.3,y:82,s:324};
// in video UV: below the plaque top, fade the video out so the static plaque and RAMBO text stay crisp
const FADE0=(590+80)/720,FADE1=(616+80)/720;
let cv,gl,tex,vids={},cur=null,ready=false,lastAct=performance.now(),worryShown=-1;
function build(){const h=document.getElementById('g2hud');const bar=[...document.querySelectorAll('img.flp')].find(i=>/topbar2x/.test(i.src));
 if(!h||!bar)return setTimeout(build,80);
 cv=document.createElement('canvas');cv.id='rReact';Object.assign(cv.style,{position:'absolute',left:u(BOX.x)+'px',top:u(BOX.y)+'px',width:u(BOX.s)+'px',height:u(BOX.s)+'px',pointerEvents:'none',filter:'drop-shadow(0 5px 7px rgba(0,25,30,.35))'});
 bar.after(cv);
 const DPR=Math.min(2,devicePixelRatio||1);cv.width=cv.height=Math.round(u(BOX.s)*DPR*(window.G2K||1));
 gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return;
 const vs=`attribute vec2 p;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
 const fs=`precision mediump float;varying vec2 t;uniform sampler2D v;
 void main(){vec3 c=texture2D(v,t).rgb;float m=max(c.r,c.b);float g=c.g-m;
  float a=1.-smoothstep(.10,.38,g);
  c.g=min(c.g,m+.02);                                  // remove green spill on the fur edge
  a*=1.-smoothstep(${FADE0.toFixed(4)},${FADE1.toFixed(4)},t.y);
  gl_FragColor=vec4(c*a,a);}`;
 const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
 for(const k of ['happy','cheer','worry']){const v=document.createElement('video');v.src=BASE+k+'.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.preload='auto';
  for(const a of ['muted','playsinline','webkit-playsinline'])v.setAttribute(a,'');v.crossOrigin='anonymous';vids[k]=v;
  v.addEventListener('ended',()=>{if(cur===v){draw(v);cur=null;lastAct=performance.now()}})}
 const h0=vids.happy;
 const first=()=>{if(ready)return;ready=true;draw(h0);bar.src='bovo11/play2/topbar_noram.webp?v=1'};   // swap the bar only once live Rambo is on screen
 h0.addEventListener('loadeddata',()=>{h0.currentTime=0;setTimeout(first,60)});h0.load();
 loop()}
function draw(v){if(!gl||v.readyState<2)return;gl.bindTexture(gl.TEXTURE_2D,tex);
 try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,v)}catch(e){return}
 gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
let lastCombo=0;
function loop(){if(cur&&!cur.paused)draw(cur);
 if(typeof S!=='undefined'&&S){const c=S.combo||0;if(c>=3&&lastCombo<3)play('happy');lastCombo=c}
 // a little life when nothing has happened for a while
 if(ready&&!cur&&performance.now()-lastAct>26000&&typeof S!=='undefined'&&S&&!S.over&&!document.getElementById('gp')?.classList.contains('on'))play('happy');
 requestAnimationFrame(loop)}
function play(k,force){const v=vids[k];if(!ready||!v)return;if(cur&&!force)return;
 if(cur&&cur!==v){cur.pause()}cur=v;lastAct=performance.now();v.currentTime=0;const p=v.play();p&&p.catch&&p.catch(()=>{cur=null})}
window.rReact=play;
// game hooks: good match / goal done -> happy, rainbow / big moments -> cheer, last 5 moves -> worried (once per level)
window.ramboReact=function(kind){if(kind==='big')play('cheer',true);else play('happy')};
const _dm=window.drawMoves;window.drawMoves=function(){_dm&&_dm.apply(this,arguments);
 if(typeof S!=='undefined'&&S&&!S.over&&S.moves<=5&&S.moves>0&&worryShown!==S.li){worryShown=S.li;setTimeout(()=>play('worry',true),350)}};
const _sl=window.startLevel;if(_sl)window.startLevel=function(){worryShown=-1;return _sl.apply(this,arguments)};
build();
})();

/* Good Boy Bobo — Home: the approved painting, with Bobo really animated (Higgsfield clip, keyed live).
   Backdrop = the yard with Bobo's head/paw area painted clean; his tail stays the painted one (so it never swings over Mr Buck).
   The painted Bobo shows until the clip is playing, and stays if a phone can't play it. */
(function(){
const DIR='live/',V='?v=7',W=1290,H=2796,BS=[296,856,609,940],BL=[262.16,837.2,676.8,971.33];
const stage=document.getElementById('stage');if(!stage)return;
const pc=v=>v*100+'%';
const root=document.createElement('div');root.style.cssText='position:absolute;inset:0;overflow:hidden;pointer-events:none';stage.insertBefore(root,stage.firstChild);
const img=(src,b)=>{const i=new Image();i.decoding='async';i.src=DIR+src+V;i.alt='';Object.assign(i.style,{position:'absolute',display:'block',maxWidth:'none',left:pc(b[0]/W),top:pc(b[1]/H),width:pc(b[2]/W),height:pc(b[3]/H)});root.appendChild(i);return i};
img('home_static2.jpg',[0,0,W,H]);const still=img('rambo_still.webp',BS);
const oldCv=document.getElementById('gl');if(oldCv)oldCv.style.display='none';
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(RM)return;
const cv=document.createElement('canvas');Object.assign(cv.style,{position:'absolute',left:pc(BL[0]/W),top:pc(BL[1]/H),width:pc(BL[2]/W),height:pc(BL[3]/H),opacity:0,transition:'opacity .3s'});root.appendChild(cv);
const gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return;
const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o},pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 p;varying vec2 t;void main(){t=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}'));
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 t;uniform sampler2D v;void main(){vec3 c=texture2D(v,t).rgb;float m=max(c.r,c.b);float a=1.-smoothstep(.08,.30,c.g-m);c.g=min(c.g,m+.015);gl_FragColor=vec4(c*a,a);}'));
gl.linkProgram(pr);gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
const size=()=>{const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);cv.width=Math.max(2,Math.round(r.width*d));cv.height=Math.max(2,Math.round(r.height*d))};
const v=document.createElement('video');v.src=DIR+'rambo_loop.mp4'+V;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.autoplay=true;v.preload='auto';for(const a of ['muted','playsinline','webkit-playsinline','autoplay','loop'])v.setAttribute(a,'');
let live=false,lastT=-1;const draw=()=>{if(v.readyState<2)return false;if(v.currentTime===lastT)return true;lastT=v.currentTime;try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,v)}catch(e){return false}
 gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return true};
const on=()=>{if(live)return;size();if(!draw())return;live=true;cv.style.opacity=1;setTimeout(()=>{still.style.visibility='hidden'},320)};
addEventListener('resize',()=>{if(live){size();lastT=-1}});
const tick=()=>{requestAnimationFrame(tick);try{if(v.paused&&!document.hidden&&!window.GBB_HIDDEN){const p=v.play();p&&p.catch&&p.catch(()=>{})}if(live)draw();else if(v.readyState>=2&&!v.paused)on()}catch(e){}};
const p=v.play();p&&p.catch&&p.catch(()=>{});addEventListener('pointerdown',()=>{if(v.paused){const q=v.play();q&&q.catch&&q.catch(()=>{})}},{passive:true});tick();
window.GBB_BOBO_VIDEO=v;window.__boboDraw=()=>{lastT=-1;size();draw();cv.style.opacity=1;still.style.visibility='hidden'};
})();

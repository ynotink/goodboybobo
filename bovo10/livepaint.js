// LivePaint: the original painting, gently moved by an invisible wind field (no cut-out pieces, no AI video).
// Wind map per scene: R sway (trees, flowers)  G sun-dapple on the ground  B leaf shimmer  A blurred brightness.
// ONE shared WebGL canvas for the whole map. It only ever animates the scene you are looking at, and it never does
// heavy work (loading pictures into the graphics chip, switching scenes) while you are scrolling.
(function(){
const VS='attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const FS=`precision highp float;varying vec2 v;uniform sampler2D tA,tW;uniform float t,k;uniform vec2 px,band;uniform vec4 amp;
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;}vec2 m289(vec2 x){return x-floor(x*(1./289.))*289.;}vec3 perm(vec3 x){return m289(((x*34.)+1.)*x);}
float sn(vec2 q){const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);vec2 i=floor(q+dot(q,C.yy));vec2 x0=q-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=m289(i);
 vec3 pp=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
 vec3 x=2.*fract(pp*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291-.85373473*(a0*a0+h*h);
 vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
void main(){vec4 W=texture2D(tW,v);float kb=k*smoothstep(band.x,band.y,v.y)*smoothstep(1.-band.x,1.-band.y,v.y);
 float sway=W.r*kb,dap=W.g*kb,shim=W.b*kb;
 if(sway<.004&&dap<.004){gl_FragColor=vec4(texture2D(tA,v).rgb,1.);return;}
 vec2 q=v*vec2(1.,2.166);
 float gust=.6+.4*sn(vec2(q.x*.9-t*.45,t*.1));
 float bend=sn(vec2(q.x*2.2-t*1.6,q.y*2.2+t*.3))*.6+sn(vec2(q.x*4.5-t*2.9,q.y*4.5+t*.5))*.4;
 float lift=sn(vec2(q.x*2.6+7.-t*1.4,q.y*2.6-t*.4));
 float fl=sn(vec2(q.x*40.-t*5.2,q.y*40.+t*2.));
 vec2 d=vec2(bend*gust+.25*gust,lift*.45*gust)*amp.x+vec2(fl,fl*.6)*amp.y*(.5+gust);
 vec4 c=texture2D(tA,v-d*sway*px);
 float lum=dot(c.rgb,vec3(.3,.59,.11));
 c.rgb*=1.+shim*amp.z*sn(vec2(q.x*26.-t*2.4,q.y*26.+t*1.1))*smoothstep(.35,.75,lum)*(.6+.6*gust);
 if(dap>.01){vec2 dd=vec2(sn(vec2(q.x*1.6-t*.45,q.y*1.6)),sn(vec2(q.x*1.6+3.,q.y*1.6-t*.38)))*amp.w*gust;
  float l0=W.a,l1=texture2D(tW,v-dd*px).a;c.rgb*=mix(1.,clamp((l1+.02)/(l0+.02),.82,1.22),dap);}
 gl_FragColor=vec4(c.rgb,1.);}`;
const REG=new Map();          // scene -> config (scenes near the screen that can come alive)
let cv=null,gl=null,U=null,dead=false,active=null,want=null,k=0,lastDraw=0,lastPick=0,lastScroll=0,t0=performance.now();
const CACHE=new Map();        // dir -> {tA,tW,IW,IH,used}; at most 2 scenes kept in the graphics chip
const onScroll=()=>{lastScroll=performance.now()};
addEventListener('scroll',onScroll,{capture:true,passive:true});addEventListener('touchmove',onScroll,{capture:true,passive:true});
function setup(){
 cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:1';
 gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false});if(!gl){dead=true;return}
 cv.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;if(cv.parentNode)cv.remove();active=null});
 const sh=(kind,src)=>{const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(s);return s};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 const L={};U=n=>L[n]||(L[n]=gl.getUniformLocation(pr,n));gl.uniform1i(U('tA'),0);gl.uniform1i(U('tW'),1)}
function bitmap(src,w){return fetch(src).then(r=>r.blob()).then(b=>{try{return createImageBitmap(b,w?{resizeWidth:w,resizeQuality:'high'}:undefined)}catch(e){return createImageBitmap(b)}})
 .catch(()=>new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=src}))}
function upload(img){const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
 for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);return tx}
const loading=new Map();
function prepare(S){const c=REG.get(S),key=S.dir;if(!c||CACHE.has(key)||c.imgs||loading.has(key))return;
 const W=Math.min(1180,Math.round((S.art.clientWidth||440)*Math.min(2,devicePixelRatio||1)));
 loading.set(key,Promise.all([bitmap(S.dir+'/'+c.plate+c.v,W),bitmap(S.dir+'/wind.png'+c.v)]).then(([a,w])=>{c.imgs=[a,w];c.IW=a.width;c.IH=a.height}).catch(e=>{console.warn('LivePaint load',e);REG.delete(S)}).finally(()=>loading.delete(key)))}
function upTex(S){const c=REG.get(S);if(!c||!c.imgs)return null;
 if(CACHE.size>=2){let old=null;for(const [d,e] of CACHE)if(!old||e.used<old[1].used)old=[d,e];if(old){gl.deleteTexture(old[1].tA);gl.deleteTexture(old[1].tW);CACHE.delete(old[0])}}
 const e={tA:upload(c.imgs[0]),tW:upload(c.imgs[1]),IW:c.IW,IH:c.IH,used:performance.now()};CACHE.set(S.dir,e);return e}
function visibleArea(S){const r=S.el.getBoundingClientRect(),vh=innerHeight;return Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0))/vh}
function frame(now){requestAnimationFrame(frame);if(dead||!REG.size&&!active)return;
 if(now-lastScroll<260)return;                               // hands off while the finger is moving
 if(now-lastPick>200){lastPick=now;want=null;let ba=.3;for(const S of REG.keys()){const a=visibleArea(S);if(a>ba){ba=a;want=S}}if(want)prepare(want)}
 const dt=Math.min(.1,(now-(lastDraw||now))/1000);
 if(active&&(active!==want||!REG.has(active))){               // leaving: ease the wind out, then rest
  k=Math.max(0,k-dt/.6);draw(now);if(k===0){if(cv.parentNode)cv.remove();active=null}return}
 if(!active&&want){if(!gl)setup();if(dead)return;
  if(!CACHE.get(want.dir)){if(!REG.get(want).imgs)return;upTex(want);lastDraw=now;return}   // one heavy step per frame, only when still
  active=want;k=0;lastDraw=0;want.art.insertBefore(cv,want.fx)}
 if(!active)return;
 k=Math.min(1,k+dt/.7);
 if(lastDraw&&now-lastDraw<31)return;draw(now)}
function draw(now){const S=active;if(!S)return;const e=CACHE.get(S.dir),c=REG.get(S)||{};if(!e)return;e.used=now;lastDraw=now;
 const DPR=Math.min(2,devicePixelRatio||1),w=Math.round(cv.clientWidth*DPR),h=Math.round(cv.clientHeight*DPR);if(!w||!h)return;
 if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h)}
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,e.tA);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,e.tW);
 const a=c.amp||[18,3,.11,14];gl.uniform4f(U('amp'),a[0],a[1],a[2],a[3]);
 gl.uniform1f(U('k'),k*k*(3-2*k));gl.uniform1f(U('t'),window.LP_T!=null?window.LP_T:((now-t0)/1000)%3600);
 gl.uniform2f(U('px'),1/1180,1/(1180*e.IH/e.IW));
 const sh=(S.el.clientHeight||innerHeight)*.09/(cv.clientHeight||1);gl.uniform2f(U('band'),sh*1.05,sh*1.7);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
requestAnimationFrame(frame);
// Scenes register when they come near the screen and unregister when far away. Cheap: no graphics work here.
window.LivePaint=function(S,cfg){const c={plate:cfg.plate||'plate.jpg',v:cfg.v||'',amp:cfg.amp};REG.set(S,c);
 let ch=null;if(cfg.chars){ch=new Image();ch.decoding='async';ch.src=S.dir+'/chars.webp'+c.v;ch.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:3';S.art.insertBefore(ch,S.fx)}
 if(cfg.onFirst)setTimeout(cfg.onFirst,0);
 return {ready:Promise.resolve(),close(){REG.delete(S);if(ch)ch.remove();if(active===S){if(cv&&cv.parentNode)cv.remove();active=null;k=0}}}};
})();

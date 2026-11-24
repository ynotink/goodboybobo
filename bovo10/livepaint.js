// LivePaint: the original painting, gently moved by an invisible wind field (no cut-out pieces, no AI video).
// Each pixel of the art is pulled a few pixels by smooth, travelling wind noise, weighted by a per-scene wind map:
//   R = how much it sways (tree canopies, flower clumps)   G = sun-dapple on the ground (path, lawn)
//   B = leaf shimmer (sunlit canopy)                        A = blurred brightness of the art (for moving the dapple)
// Motion is calculated every frame from the clock, so it never loops, never restarts and never glitches.
(function(){
const VS='attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const FS=`precision highp float;varying vec2 v;uniform sampler2D tA,tW;uniform float t;uniform vec2 px;uniform vec4 amp;
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;}vec2 m289(vec2 x){return x-floor(x*(1./289.))*289.;}vec3 perm(vec3 x){return m289(((x*34.)+1.)*x);}
float sn(vec2 q){const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);vec2 i=floor(q+dot(q,C.yy));vec2 x0=q-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=m289(i);
 vec3 pp=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
 vec3 x=2.*fract(pp*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291-.85373473*(a0*a0+h*h);
 vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
void main(){vec4 W=texture2D(tW,v);float sway=W.r,dap=W.g,shim=W.b;
 vec2 q=v*vec2(1.,2.166);
 // gusts roll across the scene from left to right; leaves bend with them and spring back
 float gust=.6+.4*sn(vec2(q.x*.9-t*.45,t*.1));
 float bend=sn(vec2(q.x*2.2-t*1.6,q.y*2.2+t*.3))*.6+sn(vec2(q.x*4.5-t*2.9,q.y*4.5+t*.5))*.4;
 float lift=sn(vec2(q.x*2.6+7.-t*1.4,q.y*2.6-t*.4));
 float fl=sn(vec2(q.x*34.-t*5.2,q.y*34.+t*2.))*.6+sn(vec2(q.x*62.+t*7.,q.y*62.-t*3.))*.4;
 vec2 d=vec2(bend*gust+.25*gust,lift*.45*gust)*amp.x+vec2(fl,fl*.6)*amp.y*(.5+gust);
 vec2 uv=v-d*sway*px;
 vec4 c=texture2D(tA,uv);
 // sunlit leaves catch the light as they turn
 float lum=dot(c.rgb,vec3(.3,.59,.11));
 c.rgb*=1.+shim*amp.z*sn(vec2(q.x*26.-t*2.4,q.y*26.+t*1.1))*smoothstep(.35,.75,lum)*(.6+.6*gust);
 // leaf shadows drift on the path and lawn: shift the painted light pattern, keep the ground texture still
 if(dap>.01){vec2 dd=vec2(sn(vec2(q.x*1.6-t*.45,q.y*1.6)),sn(vec2(q.x*1.6+3.,q.y*1.6-t*.38)))*amp.w*gust;
  float l0=texture2D(tW,v).a,l1=texture2D(tW,v-dd*px).a;c.rgb*=mix(1.,clamp((l1+.02)/(l0+.02),.82,1.22),dap);}
 gl_FragColor=vec4(c.rgb,1.);}`;
window.LivePaint=function(S,cfg){
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity .5s;z-index:1';
 const gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false});
 if(!gl)return null;
 const sh=(k,src)=>{const s=gl.createShader(k);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(s);return s};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const ap=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pr,n);
 const load=(src,unit,name)=>new Promise((ok,no)=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
  for(const [a,b] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);
  gl.uniform1i(U(name),unit);ok(im)};im.onerror=no;im.src=src});
 const V=cfg.v||'';let raf=0,dead=0,IW=1180;
 S.art.insertBefore(cv,S.fx);
 let ch=null;if(cfg.chars){ch=new Image();ch.src=S.dir+'/chars.webp'+V;ch.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:3';S.art.insertBefore(ch,S.fx)}
 const a=cfg.amp||[18,3.0,.11,14];gl.uniform4f(U('amp'),a[0],a[1],a[2],a[3]);
 const t0=performance.now()-(cfg.offset||0);
 const ready=Promise.all([load(S.dir+'/plate.jpg'+V,0,'tA'),load(S.dir+'/wind.png'+V,1,'tW')]).then(([im])=>{IW=im.naturalWidth;
  const frame=now=>{if(dead)return;raf=requestAnimationFrame(frame);
   const DPR=Math.min(2,devicePixelRatio||1),w=Math.round(cv.clientWidth*DPR),h=Math.round(cv.clientHeight*DPR);
   if(!w||!h)return;if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h)}
   gl.uniform1f(U('t'),window.LP_T!=null?window.LP_T:((now-t0)/1000)%3600);gl.uniform2f(U('px'),1/IW,1/(IW*2556/1180));
   gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(cv.style.opacity!=='1'){cv.style.opacity='1';if(cfg.onFirst)cfg.onFirst()}};
  raf=requestAnimationFrame(frame)});
 return {ready,close(){dead=1;cancelAnimationFrame(raf);cv.remove();if(ch)ch.remove();const e=gl.getExtension('WEBGL_lose_context');if(e)e.loseContext()},cv};
};
})();

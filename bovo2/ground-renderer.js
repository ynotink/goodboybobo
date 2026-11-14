/* Shared drum-ground renderer. No chapter artwork or placements live here. */
'use strict';
// Align painted roads to chapter-authored UV profiles once at load time.
// Both GPU and CPU receive the same full-native-size textures.
function alignDrumTextures(images,profiles){
 const result={};for(const [name,im] of Object.entries(images)){const rows=profiles?.[name];if(!rows){result[name]=im;continue}
  const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{alpha:false});g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,0,0,w,h);
  for(let y=0;y<h;y++){const t=y/Math.max(1,h-1)*(rows.length-1),j=Math.floor(t),f=t-j,a=rows[j],b=rows[Math.min(rows.length-1,j+1)],v=a.map((n,i)=>n+(b[i]-n)*f),src=[0,v[0]*w,v[1]*w,w],dst=[0,v[2]*w,v[3]*w,w];for(let band=0;band<3;band++)g.drawImage(im,src[band],y,src[band+1]-src[band],1,dst[band],y,dst[band+1]-dst[band],1)}
  if(new URLSearchParams(location.search).has('review')){const px=g.getImageData(0,0,w,h).data;let minAlpha=255;for(let i=3;i<px.length;i+=4)minAlpha=Math.min(minAlpha,px[i]);c.textureAlphaAudit={minAlpha,pixels:w*h};}
  result[name]=c;
 }return result;
}
class GLDrumGround {
 constructor(canvas,images){this.canvas=canvas;const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)throw Error('WebGL2 unavailable');this.gl=gl;this.mode='WebGL2';this.images=images;
 const vs=`#version 300 es
 precision highp float;in vec2 p;uniform float R,D,y0,Hv,W,AT,AMIN,cam;out vec2 world;
 void main(){float a=mix(AMIN,AT,p.y);float x=-645.+p.x*2580.;float Y=y0+R*sin(a),Z=-R*(1.-cos(a)),sc=D/(D-Z);gl_Position=vec4((x-645.)*sc/(W*.5),Y*sc/(Hv*.5),0.,1.);world=vec2(p.x,cam+a*R);}`;
 const NCH=Math.max(1,Math.round(Object.keys(images).length/4)),suf=c=>c?'_'+c:'',names=[];for(let c=0;c<NCH;c++)for(const n of ['A','X1','B','X2'])names.push(n+suf(c));this.names=names;this.NCH=NCH;
 let branch='';for(let c=0;c<NCH;c++){branch+=`if(ch==${c}){if(n==0)return texture(tA${suf(c)},vec2(world.x,clamp(1.-s/2600.,0.,1.)));if(n==1)return texture(tX1${suf(c)},vec2(world.x,clamp(1.-(s-2600.)/1100.,0.,1.)));if(n==2)return texture(tB${suf(c)},vec2(world.x,clamp(1.-(s-3700.)/2600.,0.,1.)));return texture(tX2${suf(c)},vec2(world.x,clamp(1.-(s-6300.)/1100.,0.,1.)));}\n`}
 const fs=`#version 300 es
 precision highp float;in vec2 world;uniform sampler2D ${names.map(n=>'t'+n).join(',')};uniform float R,cam,AT;out vec4 o;
 vec4 sec(int ch,int n,float s){${branch}return vec4(0.);}
 int chOf(float k){return int(mod(k,${NCH}.));}
 void main(){float k=floor(world.y/7400.);float s=world.y-k*7400.;int ch=chOf(k),pc=chOf(k-1.);vec4 c;
 if(s<140.)c=mix(sec(pc,3,s+7400.),sec(ch,0,s),smoothstep(-140.,140.,s));
 else if(s>7260.)c=mix(sec(ch,3,s),sec(chOf(k+1.),0,s-7400.),smoothstep(7260.,7540.,s));
 else if(abs(s-2600.)<140.)c=mix(sec(ch,0,s),sec(ch,1,s),smoothstep(2460.,2740.,s));
 else if(abs(s-3700.)<140.)c=mix(sec(ch,1,s),sec(ch,2,s),smoothstep(3560.,3840.,s));
 else if(abs(s-6300.)<140.)c=mix(sec(ch,2,s),sec(ch,3,s),smoothstep(6160.,6440.,s));
 else c=sec(ch,s<2600.?0:s<3700.?1:s<6300.?2:3,s);
 float haze=smoothstep(.72,1.,((world.y-cam)/R)/AT)*.12;c.rgb=mix(c.rgb,vec3(.64,.82,.65),haze);o=vec4(c.rgb,1.);}`;
 const shader=(kind,src)=>{const sh=gl.createShader(kind);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh};
 this.pr=gl.createProgram();gl.attachShader(this.pr,shader(gl.VERTEX_SHADER,vs));gl.attachShader(this.pr,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(this.pr);if(!gl.getProgramParameter(this.pr,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.pr));gl.useProgram(this.pr);
 const data=[],nx=64,ny=320;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=i/nx,b=(i+1)/nx,c=j/ny,d=(j+1)/ny;data.push(a,c,b,c,b,d,a,c,b,d,a,d)}this.count=data.length/2;gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const at=gl.getAttribLocation(this.pr,'p');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
 const an=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');this.anisotropy=an?Math.min(8,gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)):0;this.uploads=[];
 this.names.forEach((name,i)=>{const im=images[name],t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(an)gl.texParameterf(gl.TEXTURE_2D,an.TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropy);gl.uniform1i(gl.getUniformLocation(this.pr,'t'+name),i);this.uploads.push({section:name,width:im.naturalWidth||im.width,height:im.naturalHeight||im.height,uploads:1,minAlpha:im.textureAlphaAudit?.minAlpha??null,alphaCheckedPixels:im.textureAlphaAudit?.pixels??0});});
 this.uniforms=Object.fromEntries(['R','D','y0','Hv','W','AT','AMIN','cam'].map(n=>[n,gl.getUniformLocation(this.pr,n)]));
 }
 resize(){this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}
 draw(g){const gl=this.gl;gl.useProgram(this.pr);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);for(const n in this.uniforms)gl.uniform1f(this.uniforms[n],g[n]);gl.drawArrays(gl.TRIANGLES,0,this.count)}
}
class CPUDrumGround{
 constructor(canvas,images,reason){this.canvas=canvas;this.ctx=canvas.getContext('2d',{willReadFrequently:true});this.mode='CPU fallback';this.reason=reason;this.anisotropy=0;this.uploads=[];this.tex={};
 for(const name in images){const im=images[name],chain=[];let w=im.naturalWidth||im.width,h=im.naturalHeight||im.height,source=im;while(true){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(source,0,0,w,h);chain.push({w,h,px:new Uint32Array(g.getImageData(0,0,w,h).data.buffer)});if(w<=2||h<=2)break;source=c;w=Math.max(1,Math.floor(w/2));h=Math.max(1,Math.floor(h/2));}this.tex[name]=chain;this.uploads.push({section:name,width:im.naturalWidth||im.width,height:im.naturalHeight||im.height,uploads:1,mipLevels:chain.length,minAlpha:im.textureAlphaAudit?.minAlpha??null,alphaCheckedPixels:im.textureAlphaAudit?.pixels??0});}}
 resize(){this.rows=null;this.output=this.ctx.createImageData(this.canvas.width,this.canvas.height);this.out32=new Uint32Array(this.output.data.buffer)}
 draw(g){const {R,D,y0,Hv,W,AT,AMIN,cam,dpr,hy}=g,w=this.canvas.width,h=this.canvas.height;
 if(!this.rows){this.rows=[];for(let y=Math.max(0,Math.floor(hy*dpr));y<h;y++){let lo=AMIN,hi=AT;for(let j=0;j<22;j++){const a=(lo+hi)/2,sc=D/(D+R*(1-Math.cos(a))),py=(Hv/2-(y0+R*Math.sin(a))*sc)*w/W;if(py>y)lo=a;else hi=a}const a=(lo+hi)/2,sc=D/(D+R*(1-Math.cos(a)));this.rows.push({y,a,left:w/2-1290*sc*w/W,width:2580*sc*w/W,haze:Math.max(0,Math.min(1,(a/AT-.72)/.28))*.12});}for(let i=0;i<this.rows.length;i++)this.rows[i].worldDy=Math.abs(R*((this.rows[i+1]||this.rows[i]).a-(this.rows[i-1]||this.rows[i]).a))*.5;}
 const NCH=Math.max(1,Math.round(Object.keys(this.tex).length/4)),suf=c=>c?'_'+c:'',sections=[['A',0,2600],['X1',2600,1100],['B',3700,2600],['X2',6300,1100]],smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 const descriptor=(n,s,row,ch)=>{const [name,start,len]=sections[n],chain=this.tex[name+suf(ch)],top=chain[0],footprint=Math.max(top.w/row.width,row.worldDy*top.h/len),lod=Math.max(0,Math.min(chain.length-1,Math.floor(Math.log2(Math.max(1,footprint))))),t=chain[lod],sy=Math.max(0,Math.min(t.h-1,(1-(s-start)/len)*(t.h-1))),y0=Math.floor(sy);return {t,base0:y0*t.w,base1:Math.min(t.h-1,y0+1)*t.w,fy:sy-y0}};
 const sample=(d,u)=>{const {t,base0,base1,fy}=d,sx=Math.max(0,Math.min(t.w-1,u*(t.w-1))),x0=Math.floor(sx),x1=Math.min(t.w-1,x0+1),fx=sx-x0,a=t.px[base0+x0],b=t.px[base0+x1],c=t.px[base1+x0],e=t.px[base1+x1],v=(1-fx)*(1-fy),w=fx*(1-fy),z=(1-fx)*fy,q=fx*fy;return [(a&255)*v+(b&255)*w+(c&255)*z+(e&255)*q,((a>>>8)&255)*v+((b>>>8)&255)*w+((c>>>8)&255)*z+((e>>>8)&255)*q,((a>>>16)&255)*v+((b>>>16)&255)*w+((c>>>16)&255)*z+((e>>>16)&255)*q]};
 for(const row of this.rows){const wy=cam+row.a*R,kk=Math.floor(wy/7400),s=wy-kk*7400,cm=k=>((k%NCH)+NCH)%NCH,ch=cm(kk);let n=s<2600?0:s<3700?1:s<6300?2:3,d1,d2=null,mix=0;
 if(s<140){d1=descriptor(3,s+7400,row,cm(kk-1));d2=descriptor(0,s,row,ch);mix=smooth((s+140)/280)}
 else if(s>7260){d1=descriptor(3,s,row,ch);d2=descriptor(0,s-7400,row,cm(kk+1));mix=smooth((s-7260)/280)}
 else {for(const [join,l,r] of [[2600,0,1],[3700,1,2],[6300,2,3]])if(Math.abs(s-join)<140){d1=descriptor(l,s,row,ch);d2=descriptor(r,s,row,ch);mix=smooth((s-join+140)/280);break;}if(!d1)d1=descriptor(n,s,row,ch)}
 const fade=row.haze,keep=1-fade;
 for(let x=0;x<w;x++){const u=(x-row.left)/row.width,c=sample(d1,u);if(d2){const b=sample(d2,u);for(let i=0;i<3;i++)c[i]+=mix*(b[i]-c[i])}const rr=c[0]*keep+163*fade,gg=c[1]*keep+209*fade,bb=c[2]*keep+166*fade;this.out32[row.y*w+x]=0xff000000|(Math.round(bb)<<16)|(Math.round(gg)<<8)|Math.round(rr);}}
 this.ctx.putImageData(this.output,0,0)}
}
window.createDrumGround=(canvas,images,forceCPU=false,alignment=null)=>{images=alignDrumTextures(images,alignment);if(!forceCPU){try{return new GLDrumGround(canvas,images)}catch(e){const fresh=canvas.cloneNode();canvas.replaceWith(fresh);return new CPUDrumGround(fresh,images,e.message)}}return new CPUDrumGround(canvas,images,'Explicit fallback test')};

/* Good Boy Bobo — UI life: smooth screen-to-screen fades and real button presses for buttons that are
   painted into the page art (page buttons + bottom menu). The painted button is lifted out as its own copy
   (clipped to the button's shape), squished on touch and springs back on release, while the spot underneath
   is filled with the panel's own colour, so the button moves like a separate piece. Respects reduced motion. */
(function(){
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
const css=document.createElement('style');css.textContent=`
.mk-z::after,#gbnav .it::after{display:none!important}
.ul-cl{position:absolute;overflow:hidden;pointer-events:none;transform-origin:50% 50%;will-change:transform,filter}
.ul-cl>.ul-in{position:absolute;left:0;top:0}
.ul-cl .ul-in>*{filter:none!important;animation:none!important;transition:none!important}
.ul-fill{position:absolute;pointer-events:none}
#ulFade{position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:#fff1df;opacity:0}
`;document.head.appendChild(css);

/* ---------- screen fades ---------- */
const fade=document.createElement('div');fade.id='ulFade';
const addFade=()=>{if(!document.body)return requestAnimationFrame(addFade);document.body.appendChild(fade);
 if(!RM&&sessionStorage.getItem('ul_in')){fade.style.opacity=1;requestAnimationFrame(()=>requestAnimationFrame(()=>fade.animate([{opacity:1},{opacity:0}],{duration:340,easing:'cubic-bezier(.3,.6,.3,1)',fill:'forwards'})))}
 sessionStorage.removeItem('ul_in')};
addFade();
addEventListener('pageshow',e=>{if(e.persisted){fade.getAnimations().forEach(a=>a.cancel());fade.style.opacity=0}});
if(!window.FX)window.FX={out(){if(RM)return;try{sessionStorage.setItem('ul_in','1')}catch(e){}fade.animate([{opacity:0},{opacity:1}],{duration:240,easing:'ease-in',fill:'forwards'})}};
else{const o=FX.out;FX.out=function(){try{sessionStorage.setItem('ul_in','1')}catch(e){}return o.apply(this,arguments)}}

/* ---------- lifted presses for painted buttons ---------- */
const cache=new WeakMap();
function shape(img,zr,ir,inner,sm){ // the panel colour around the button, and a cut-out of just the button (everything that isn't panel)
 try{const key=Math.round(zr.left)+','+Math.round(zr.top)+','+Math.round(zr.width);let m=cache.get(img);if(!m){m={};cache.set(img,m)}if(m[key])return m[key];
  const c=document.createElement('canvas'),nw=img.naturalWidth,nh=img.naturalHeight;c.width=nw;c.height=nh;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const sx=nw/ir.width,sy=nh/ir.height;const x0=(zr.left-ir.left)*sx,y0=(zr.top-ir.top)*sy,x1=(zr.right-ir.left)*sx,y1=(zr.bottom-ir.top)*sy;
  const pad=Math.max(3,(x1-x0)*.03);const S=[];
  const take=(x,y,w,h)=>{x=Math.max(0,Math.round(x));y=Math.max(0,Math.round(y));w=Math.min(nw-x,Math.round(w));h=Math.min(nh-y,Math.round(h));if(w<1||h<1)return;
   const d=g.getImageData(x,y,w,h).data;for(let i=0;i<d.length;i+=4)if(d[i+3]>200)S.push([d[i],d[i+1],d[i+2]])};
  // sample just inside the zone's own edge band (zones are drawn a little larger than the button)
  // panel colour: a thin band just outside the button's own tap area
  const a0=(sm.left-ir.left)*sx,b0=(sm.top-ir.top)*sy,a1=(sm.right-ir.left)*sx,b1=(sm.bottom-ir.top)*sy;const q=Math.max(2,Math.min(a1-a0,b1-b0)*.05);
  take(a0+(a1-a0)*.25,b0-q*1.5,(a1-a0)*.5,q);take(a0+(a1-a0)*.25,b1+q*.5,(a1-a0)*.5,q);take(a0-q*1.5,b0+(b1-b0)*.3,q,(b1-b0)*.4);take(a1+q*.5,b0+(b1-b0)*.3,q,(b1-b0)*.4);
  if(!S.length){m[key]={};return m[key]}
  const med=k=>{const a=S.map(v=>v[k]).sort((p,q)=>p-q);return a[a.length>>1]};const R=med(0),G=med(1),B=med(2);
  const zx=Math.max(0,Math.round(x0)),zy=Math.max(0,Math.round(y0)),zw=Math.min(nw-zx,Math.round(x1-x0)),zh=Math.min(nh-zy,Math.round(y1-y0));
  const d=g.getImageData(zx,zy,zw,zh);const D=d.data;
  const A=new Float32Array(zw*zh);for(let i=0,j=0;i<D.length;i+=4,j++){const e=Math.abs(D[i]-R)+Math.abs(D[i+1]-G)+Math.abs(D[i+2]-B);A[j]=Math.max(0,Math.min(1,(e-22)/26))}
  // keep only the shapes that touch the button's own tap area (drops panel edges, wood, grass caught in the margin)
  const K=new Uint8Array(zw*zh),st=[];const ix0=Math.round((inner.left-zr.left)*sx),iy0=Math.round((inner.top-zr.top)*sy),ix1=Math.round((inner.right-zr.left)*sx),iy1=Math.round((inner.bottom-zr.top)*sy);
  for(let y=Math.max(0,iy0);y<Math.min(zh,iy1);y++)for(let x=Math.max(0,ix0);x<Math.min(zw,ix1);x++){const j=y*zw+x;if(A[j]>.6&&!K[j]){K[j]=1;st.push(j)}}
  while(st.length){const j=st.pop(),x=j%zw,y=(j/zw)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=zw||Y>=zh)continue;const k=Y*zw+X;if(!K[k]&&A[k]>.6){K[k]=1;st.push(k)}}}
  for(let r=0;r<2;r++){const K2=K.slice();for(let y=1;y<zh-1;y++)for(let x=1;x<zw-1;x++){const j=y*zw+x;if(!K[j]&&(K[j-1]||K[j+1]||K[j-zw]||K[j+zw]))K2[j]=1}K.set(K2)}
  for(let i=0,j=0;i<D.length;i+=4,j++){D[i]=D[i+1]=D[i+2]=0;D[i+3]=K[j]?A[j]*255:0}
  const mc=document.createElement('canvas');mc.width=zw;mc.height=zh;mc.getContext('2d').putImageData(d,0,0);
  const bc=document.createElement('canvas');bc.width=zw;bc.height=zh;const bg=bc.getContext('2d');bg.filter='blur(1px)';bg.drawImage(mc,0,0);
  const fc=document.createElement('canvas');fc.width=zw;fc.height=zh;const fg=fc.getContext('2d');const rr=Math.max(3,Math.min(zw,zh)*.07);
  for(let a=0;a<16;a++)fg.drawImage(mc,Math.cos(a/16*6.283)*rr,Math.sin(a/16*6.283)*rr);for(let k=1;k<=4;k++)fg.drawImage(mc,0,rr*.5*k);fg.drawImage(mc,0,0);
  {const fd=fg.getImageData(0,0,zw,zh),F=fd.data;for(let j=0,i=0;j<zw*zh;j++,i+=4){if(!K[j]&&A[j]>.5)F[i+3]=0}fg.putImageData(fd,0,0)}
  m[key]={col:`rgb(${R},${G},${B})`,mask:bc.toDataURL(),fmask:fc.toDataURL()};return m[key]}catch(e){return{}}}
function lift(z){
 const host=z.offsetParent||z.parentNode;if(!host)return null;
 const hr=host.getBoundingClientRect(),z0=z.getBoundingClientRect();if(z0.width<4)return null;
 // painted buttons often reach a little past their tap area (rim, lip, shadow): lift a slightly larger patch; the cut-out keeps only the button
 const g=Math.round(Math.min(z0.width,z0.height)*.14+3);const zr={left:z0.left-g,top:z0.top-g,right:z0.right+g,bottom:z0.bottom+g,width:z0.width+2*g,height:z0.height+2*g};
 const rad='0';
 const L=zr.left-hr.left,T=zr.top-hr.top;
 const cl=document.createElement('div');cl.className='ul-cl';Object.assign(cl.style,{left:L+'px',top:T+'px',width:zr.width+'px',height:zr.height+'px',borderRadius:rad});
 const inn=document.createElement('div');inn.className='ul-in';Object.assign(inn.style,{left:-L+'px',top:-T+'px',width:hr.width+'px',height:hr.height+'px'});cl.appendChild(inn);
 let base=null,best=0;
 for(const el of host.children){if(el===z||el.classList.contains('mk-z')||el.classList.contains('it')||el.classList.contains('ul-cl')||el.classList.contains('ul-fill'))continue;
  const r=el.getBoundingClientRect();if(r.right<=zr.left||r.left>=zr.right||r.bottom<=zr.top||r.top>=zr.bottom)continue;
  const k=el.cloneNode(true);k.removeAttribute('id');inn.appendChild(k);
  if(el.tagName==='IMG'){const a=Math.min(r.right,zr.right)-Math.max(r.left,zr.left),b=Math.min(r.bottom,zr.bottom)-Math.max(r.top,zr.top);if(a*b>best){best=a*b;base=[el,r]}}}
 if(!inn.children.length)return null;
 const fill=document.createElement('div');fill.className='ul-fill';
 const sh=base?shape(base[0],zr,base[1],{left:z0.left+z0.width*.08,top:z0.top+z0.height*.12,right:z0.right-z0.width*.08,bottom:z0.bottom-z0.height*.12},z0):{};
 Object.assign(fill.style,{left:L+'px',top:T+'px',width:zr.width+'px',height:zr.height+'px',borderRadius:rad,background:sh.col||'transparent',filter:'blur(1.2px)'});
 cl._s=z.classList.contains('it')?1.09:Math.max(.93,Math.min(.975,1-8/Math.max(z0.width,z0.height)));if(cl._s>1)fill.style.display='none';
 if(sh.mask){[[cl,sh.mask],[fill,sh.fmask]].forEach(([e,u])=>{e.style.webkitMaskImage=e.style.maskImage=`url(${u})`;e.style.webkitMaskSize=e.style.maskSize='100% 100%'})}
 host.insertBefore(fill,z);host.insertBefore(cl,z);
 return{cl,fill}}

function wire(z){if(z._ul)return;z._ul=1;let L=null,anim=null,t=0;
 const down=()=>{if(RM)return;if(L){L.cl.remove();L.fill.remove()}L=lift(z);if(!L)return;t=performance.now();const k=L.cl._s;anim=L.cl.animate([{scale:1,filter:'brightness(1)'},{scale:k,translate:k>1?'0 -4%':'0 0',filter:k>1?'brightness(1.04)':'brightness(.94)'}],{duration:110,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'})};
 const up=()=>{if(!L)return;const me=L;L=null;const wait=Math.max(0,70-(performance.now()-t));
  setTimeout(()=>{const k=me.cl._s,o=1-k;const a=me.cl.animate(k>1?[{scale:k,translate:'0 -4%'},{scale:.97,translate:'0 0',offset:.5},{scale:1.01,translate:'0 0',offset:.8},{scale:1,translate:'0 0'}]:[{scale:k,filter:'brightness(.94)'},{scale:1+o*.6,filter:'brightness(1.03)',offset:.45},{scale:1-o*.15,filter:'brightness(1)',offset:.75},{scale:1,filter:'brightness(1)'}],{duration:380,easing:'ease-out',fill:'forwards'});
   a.onfinish=()=>{me.cl.remove();me.fill.remove()}},wait)};
 z.addEventListener('pointerdown',down);
 ['pointerup','pointercancel','pointerleave'].forEach(e=>z.addEventListener(e,up))}
const scan=()=>document.querySelectorAll('.mk-z,#gbnav .it').forEach(wire);
new MutationObserver(()=>scan()).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',scan);scan();

/* ---------- arrival: the lit tab in the bottom menu gives one small hop ---------- */
addEventListener('load',()=>{if(RM)return;setTimeout(()=>{const it=document.querySelector('#gbnav .it[aria-current="page"]');if(!it)return;const L=lift(it);if(!L)return;
 const a=L.cl.animate([{translate:'0 0',scale:1},{translate:'0 -6%',scale:1.06,offset:.4},{translate:'0 0',scale:.98,offset:.7},{translate:'0 0',scale:1}],{duration:520,easing:'ease-out'});a.onfinish=()=>{L.cl.remove();L.fill.remove()}},380)});
})();

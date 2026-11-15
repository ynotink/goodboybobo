'use strict';
// Recolors Rambo's painting into a player's buddy: coat, patches, collar. Shared by the builder and the map.
window.BUDDY={
 COATS:{White:[.98,.95,.88],Cream:[.96,.86,.68],Golden:[.93,.72,.38],Red:[.72,.38,.2],Chocolate:[.3,.2,.14],Gray:[.62,.63,.68],Black:[.15,.14,.16]},
 PATCHES:{None:null,Brown:[.45,.28,.15],Black:[.12,.1,.1],White:[.95,.93,.9],Gold:[.85,.62,.3],Gray:[.5,.5,.55]},
 COLLARS:{Red:0,Blue:212,Green:130,Purple:280,Pink:325,Gold:45,Black:-1},
 load(base){const ld=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src});
  return Promise.all([ld(base+'bobo_base.png'),ld(base+'bobo_masks.png')]).then(([b,m])=>{const W=b.width,H=b.height,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(b,0,0);const bd=g.getImageData(0,0,W,H);g.clearRect(0,0,W,H);g.drawImage(m,0,0);const md=g.getImageData(0,0,W,H);this.W=W;this.H=H;this.bd=bd;this.md=md;return this})},
 make(o){const {W,H,bd,md}=this,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),out=g.createImageData(W,H),s=bd.data,m=md.data,d=out.data;
  const C=this.COATS[o.coat]||this.COATS.White,P=o.patch&&o.patch!=='None'?this.PATCHES[o.patch]:null,hueT=this.COLLARS[o.collar]??0;
  for(let i=0;i<s.length;i+=4){let r=s[i]/255,gg=s[i+1]/255,b=s[i+2]/255;const a=s[i+3],v=Math.max(r,gg,b);
   if(m[i]>127){const k=.45+.6*(v/.95),hl=(v-.85)*.2;r=C[0]*k+hl;gg=C[1]*k+hl;b=C[2]*k+hl}
   else if(m[i+1]>127){if(P){const k=.5+.5*(v/.55);r=P[0]*k;gg=P[1]*k;b=P[2]*k}else{const k=.45+.6*(.72+.25*Math.min(1,v/.6));r=C[0]*k;gg=C[1]*k;b=C[2]*k}}
   else if(m[i+2]>127){const [h,l,ss]=hls(r,gg,b);let rr;if(hueT<0)rr=hlsToRgb(h,l*.45,ss*.15);else rr=hlsToRgb(hueT/360,l,ss);r=rr[0];gg=rr[1];b=rr[2]}
   d[i]=Math.max(0,Math.min(255,r*255));d[i+1]=Math.max(0,Math.min(255,gg*255));d[i+2]=Math.max(0,Math.min(255,b*255));d[i+3]=a}
  g.putImageData(out,0,0);return c}
};
function hls(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;if(mx===mn)return[0,l,0];const d=mx-mn,s=l>.5?d/(2-mx-mn):d/(mx+mn);let h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;return[h/6,l,s]}
function hlsToRgb(h,l,s){if(!s)return[l,l,l];const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t%1+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[f(h+1/3),f(h),f(h-1/3)]}

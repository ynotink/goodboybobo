
'use strict';if(new URLSearchParams(location.search).has('debug'))document.body.classList.add('debug');
// =====================================================================
//  GOOD BOY BOBO — MAP MOVEMENT PROTOTYPE (temporary art, not live)
//  World units: 1290 = phone width. s = distance along the world (up).
//  Route repeats: A (right start) → crossing → B (left start) → crossing.
// =====================================================================
const CHS=[window.BOBO_CHAPTER,...(window.BOBO_MORE||[])],NCH=CHS.length,QP=new URLSearchParams(location.search),WV=+QP.get('wv')||1700,MKS=+QP.get('mk')||1.15, SA=2600, SX=1100, L=2*(SA+SX), LOOPS=NCH>1?NCH:3, TOT=L*LOOPS;
const SEC=[{n:'A',len:SA},{n:'X1',len:SX},{n:'B',len:SA},{n:'X2',len:SX}];
const SECBASE=[0,SA,SA+SX,2*SA+SX];
const ss=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function secAt(s){const m=((s%L)+L)%L;let i=3;for(let j=0;j<4;j++)if(m<SECBASE[j]+SEC[j].len){i=j;break}return{i,loc:m-SECBASE[i],loop:Math.floor(s/L)}}
function cross(loc,a,b){const m=(a+b)/2;if(loc<400)return a+(m-a)*ss(loc/400);if(loc<700)return m;return m+(b-m)*ss((loc-700)/400)}
function bpA(l){const t=Math.max(0,Math.min(1,(l-120)/2360));return 900-510*(6*t**5-15*t**4+10*t**3)+160*Math.sin(2*Math.PI*t)*Math.sin(Math.PI*t)}
function routeX(s){const {i,loc}=secAt(s);   // approved fixed blueprint v2
 if(i==0)return bpA(loc);          // A: right(900) -> left(390)
 if(i==1)return 390;               // left crossing, straight
 if(i==2)return 1290-bpA(loc);     // B: left(390) -> right(900), exact mirror
 return 900;}                      // right crossing, straight
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

// ---------------- levels (5 per A/B section) ----------------
const LEVELS=[];
for(let k=0;k<LOOPS;k++)[0,2].forEach((si,h)=>{for(let j=0;j<5;j++){const s=k*L+SECBASE[si]+350+j*500;LEVELS.push({L:k*10+h*5+j+1,s,x:routeX(s)})}});
// Rambo & friends: world anchors for a level (only change when a level is won)
function anchors(lv){if(BOBO_CHAPTER.castAnchors?.[lv])return JSON.parse(JSON.stringify(BOBO_CHAPTER.castAnchors[lv]));const m=LEVELS[lv-1],side=m.x>645?-1:1,out={};for(const [name,p] of Object.entries(BOBO_CHAPTER.castPlacement))out[name]={x:Math.max(p.minX,Math.min(p.maxX,m.x+side*p.xOffset)),s:m.s+p.sOffset};out.face=side;return out}
const SEEN='gbb_bovo2_seen';
const STARS=(()=>{try{return JSON.parse(localStorage.getItem('gbb_play')||'{}').stars||{}}catch(e){return{}}})();
let cur=Math.max(1,Math.min(LEVELS.length,(typeof gbbCur==='function'?gbbCur():1)));
const seenLv=Math.max(1,Math.min(cur,+(localStorage.getItem(SEEN)||cur)));

// ---------------- temporary props (separate upright sprites) ----------------
function sprite(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function ball(g,x,y,r,c1,c2){const gr=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
const SPR={},ART={},GROUND={},IM={},ARTLOAD=[];let ART_READY=false,groundRenderer;
function artImage(path,dict,key){const im=new Image();ARTLOAD.push(new Promise((ok,no)=>{im.onload=ok;im.onerror=()=>no(new Error('Missing art: '+path))}));im.src=path;dict[key]=im;}
CHS.forEach((C,i)=>{const sf=i?'_'+i:'';for(const [id,spec] of Object.entries(C.sprites)){if(i&&BOBO_CHAPTER.sprites[id])continue;if(i)BOBO_CHAPTER.sprites[id]=spec;artImage(spec.src,SPR,id)}
 for(const n of ['A','B'])artImage(C.terrain[n],GROUND,n+sf);for(const n of ['X1','X2'])artImage(C.connectors[n].ground,GROUND,n+sf);});
artImage(BOBO_CHAPTER.sky,ART,'sky');artImage(BOBO_CHAPTER.farStrip,ART,'far');
for(const [id,spec] of Object.entries(BOBO_CHAPTER.characters))artImage(spec.src,IM,id);
for(const [id,path] of Object.entries(BOBO_CHAPTER.markers))artImage(path,IM,'mk_'+id);
artImage(BOBO_CHAPTER.star,IM,'star');
const CHPROPS=CHS.map(C=>{const B=[...C.props];for(const n of ['X1','X2']){const base=n==='X1'?2600:6300;for(const p of (C.connectors[n].parts||[]))B.push({...p,s:p.s+base});}return B});
const PROPS=[];for(let k=0;k<LOOPS;k++)CHPROPS[k%NCH].forEach(p=>PROPS.push({...p,s:p.s+k*L}));

// ---------------- drum camera (curved ground + open sky) ----------------
let k,Hv,y0,D,R,AT,cam=0,DPR=1;const AMIN=-0.25,X0=-645,XW=2580;
function tang(){let a=0,b=Math.PI;for(let i=0;i<60;i++){const m=(a+b)/2,f=y0*Math.sin(m)+R-(R+D)*Math.cos(m);if(f<0)a=m;else b=m}return(a+b)/2}
function projA(x,al){const X=x-645,Y=y0+R*Math.sin(al),Z=-R*(1-Math.cos(al)),sc=D/(D-Z);return{px:innerWidth/2+X*sc*k,py:innerHeight/2-Y*sc*k,sc,al}}
function proj(x,s){return projA(x,(s-cam)/R)}
function geom(){k=innerWidth/WV;Hv=WV*innerHeight/innerWidth;y0=-Hv/2-80;D=(+QP.get('d')||1.15)*Hv;
 const want=Hv/2-Hv*0.30;let lo=Hv*0.2,hi=Hv*60;
 for(let i=0;i<70;i++){R=(lo+hi)/2;AT=tang();const p=projA(645,AT),yw=(innerHeight/2-p.py)/k;if(yw>want)hi=R;else lo=R}
 R=(lo+hi)/2;AT=tang()}
const horizonPx=()=>projA(645,AT).py;

// WebGL2 uploads each section at native resolution once. CPU is fallback only.
let glc=document.getElementById('gl');
Promise.all(ARTLOAD).then(()=>{prepareGrounding();groundRenderer=createDrumGround(glc,GROUND,new URLSearchParams(location.search).has('cpu'),BOBO_CHAPTER.terrainAlignment);glc=groundRenderer.canvas;if(groundRenderer.gl)watchContext(glc);ART_READY=true;resize();cam=startCamera(seenLv);if(seenLv<cur)setTimeout(()=>{setCur(cur,true);glideTo(camFor(LEVELS[cur-1].s))},700);else{try{localStorage.setItem(SEEN,cur)}catch(e){}}document.body.dataset.ready='true';document.getElementById('loading').hidden=true;}).catch(e=>{document.getElementById('loading').textContent=e.message;console.error(e)});
let ctxLost=false,lostTimer=null;
function watchContext(c){c.addEventListener('webglcontextlost',e=>{e.preventDefault();ctxLost=true;clearTimeout(lostTimer);lostTimer=setTimeout(()=>{if(ctxLost)location.reload()},2500)},false);
 c.addEventListener('webglcontextrestored',()=>{try{groundRenderer=createDrumGround(c,GROUND,false,BOBO_CHAPTER.terrainAlignment);glc=groundRenderer.canvas;if(glc!==c)watchContext(glc);ctxLost=false;clearTimeout(lostTimer);resize()}catch(e){location.reload()}},false)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&groundRenderer?.gl?.isContextLost?.())setTimeout(()=>{if(groundRenderer.gl.isContextLost())location.reload()},1500);lastGroundKey=null});
function drawGround(){if(ctxLost)return;groundRenderer.draw({R,D,y0,Hv,W:WV,AT,AMIN,cam,dpr:DPR,hy:horizonPx()})}

// ---------------- sky ----------------
const sky=document.getElementById('sky'),sg=sky.getContext('2d');
function drawSky(){const w=innerWidth,h=innerHeight,hy=horizonPx();sg.setTransform(DPR,0,0,DPR,0,0);sg.fillStyle='#67d2fa';sg.fillRect(0,0,w,h);sg.drawImage(ART.sky,0,0,w,hy+45*k)}

// ---------------- images (approved characters + markers) ----------------
const fontP=new FontFace('BoboNunito','url('+BOBO_CHAPTER.font+')',{weight:'900'}).load().then(f=>{document.fonts.add(f)}).catch(()=>{});

// ---------------- characters (world-anchored) ----------------
const CHAR=BOBO_CHAPTER.characters;
let pos=anchors(seenLv),move=null;
function setCur(n,animate){const from=pos,to=anchors(n);cur=n;try{localStorage.setItem(SEEN,cur)}catch(e){}
 if(!animate){pos=to;return}move={from,to,t0:performance.now(),dur:1500}}
function stepMove(t){if(!move)return;const u=Math.min(1,(t-move.t0)/move.dur),e=ss(u);const p={face:move.to.face};
 for(const n in CHAR){const a=move.from[n],b=move.to[n];if(!a||!b){p[n]=u<.5?a:b;continue}p[n]={x:a.x+(b.x-a.x)*e,s:a.s+(b.s-a.s)*e,hop:n=='rambo'?Math.abs(Math.sin(u*Math.PI*4))*40*(1-u):0};if(a.lift!=null||b.lift!=null)p[n].lift=(a.lift??BOBO_CHAPTER.cardinalPerch)+((b.lift??BOBO_CHAPTER.cardinalPerch)-(a.lift??BOBO_CHAPTER.cardinalPerch))*e}
 pos=p;if(u>=1){pos=move.to;move=null}}

// ---------------- objects pass (depth-sorted, horizon-occluded) ----------------
const obc=document.getElementById('obj'),og=obc.getContext('2d');let HITS=[];
function squash(x,s){const a=proj(x,s),b=proj(x,s+40);return Math.max(0.08,Math.min(1.05,(a.py-b.py)/(40*a.sc*k)))}
function softShadow(x,y,w,sq,a){const rx=w*.37,ry=Math.max(1,rx*sq*.30);og.save();og.translate(x+rx*.08,y+ry*.1);og.scale(rx,ry);const gr=og.createRadialGradient(0,0,0,0,0,1);gr.addColorStop(0,'rgba(22,47,10,'+a+')');gr.addColorStop(.55,'rgba(22,47,10,'+(a*.5)+')');gr.addColorStop(1,'rgba(22,47,10,0)');og.fillStyle=gr;og.beginPath();og.arc(0,0,1,0,Math.PI*2);og.fill();og.restore()}
function contactShadow(x,y,rx,ry,alpha){og.save();og.translate(x,y);og.scale(rx,ry);const g=og.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'rgba(28,48,16,'+alpha+')');g.addColorStop(.5,'rgba(28,48,16,'+(alpha*.55)+')');g.addColorStop(1,'rgba(28,48,16,0)');og.fillStyle=g;og.beginPath();og.arc(0,0,1,0,Math.PI*2);og.fill();og.restore()}
function characterGrounding(c,x,y,w,h,sq,flip){softShadow(x+w*.07,y,w*.9,sq,.14);for(const [cx,cy,r] of c.contact||[])contactShadow(x+cx*w*(flip?-1:1),y+cy*h,w*r,Math.max(1.5,w*r*.25),.32)}
const spriteBuffer=document.createElement('canvas');let visibleAudit=[];
function fadeDraw(img,x,foot,w,h,q,flip=false){const top=foot-h,hz=horizonPx();if(q.al>AT&&top>=hz)return false;
 if(q.al<=AT){og.save();og.translate(x,foot);if(flip)og.scale(-1,1);og.drawImage(img,-w/2,-h,w,h);og.restore();return true;}
 // Terrain occlusion: retain opaque sprite bases up to the crest; antialias only the 1.5 CSS px silhouette edge.
 const bw=Math.max(1,Math.ceil(w*DPR)),bh=Math.max(1,Math.ceil(h*DPR));spriteBuffer.width=bw;spriteBuffer.height=bh;const bg=spriteBuffer.getContext('2d');bg.setTransform(DPR,0,0,DPR,0,0);bg.save();if(flip){bg.translate(w,0);bg.scale(-1,1)}bg.drawImage(img,0,0,w,h);bg.restore();bg.globalCompositeOperation='destination-in';const edge=hz-top,grad=bg.createLinearGradient(0,edge-.75,0,edge+.75);grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(1,'rgba(0,0,0,0)');bg.fillStyle=grad;bg.fillRect(0,0,w,h);og.drawImage(spriteBuffer,x-w/2,top,w,h);return true;
}
// Ground contact profiles keep isometric bases on the projected drum surface.
const GROUND_CONTACTS={};let groundingAudit=[];
function prepareGrounding(){
 for(const [name,spec] of Object.entries(BOBO_CHAPTER.sprites)){
  const rule=spec.grounding;if(!rule)continue;const im=SPR[name],c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const rgba=g.getImageData(0,0,c.width,c.height).data,values=[];
  for(let i=0;i<=64;i++){const x=Math.round(i/64*(c.width-1));let found=-1;for(let y=c.height-1;y>=0;y--)if(rgba[(y*c.width+x)*4+3]>180){found=y;break}values.push(found<0?0:(found+.5)/c.height)}
  const bases=values.map((v,i)=>rule.supportBase||[values[Math.max(0,i-1)],v,values[Math.min(64,i+1)]].sort((a,b)=>a-b)[1]);
  GROUND_CONTACTS[name]={rule,bases};
 }
}
function baseAt(profile,u){const t=Math.max(0,Math.min(64,u*64)),i=Math.floor(t);return profile.bases[i]+(profile.bases[Math.min(64,i+1)]-profile.bases[i])*(t-i)}
function supportAt(rule,u){return !rule.supportRanges||rule.supportRanges.some(([a,b])=>u>=a&&u<=b)}
function contactPoint(p,q,profile,u){const v=baseAt(profile,u),f=q.sc*k,h=p.h*f,w=p.w*f,rule=profile.rule,active=v>=rule.minContact;const x=q.px+(p.flip?.5-u:u-.5)*w;
 if(!active)return {u,v,active,x,y:q.py-(1-v)*h,al:q.al,dx:0,dy:0};
 const depth=rule.supportBase?0:Math.min(p.w*.48,(1-v)*p.h/rule.referenceSlope),worldX=p.x+(p.flip?.5-u:u-.5)*p.w,foot=proj(worldX,p.s+depth),originalY=q.py-(1-v)*h;
 return {u,v,active:supportAt(rule,u),warp:true,x,y:foot.py,al:foot.al,dx:0,dy:foot.py-originalY};
}
const GROUND_SAMPLES=new WeakMap();
function groundSample(p,im,w,h){const width=Math.max(1,Math.ceil(w*DPR)),height=Math.max(1,Math.ceil(h*DPR));let v=GROUND_SAMPLES.get(p);if(!v){v={canvas:document.createElement('canvas')};GROUND_SAMPLES.set(p,v)}if(v.canvas.width!==width||v.canvas.height!==height||v.flip!==!!p.flip){v.canvas.width=width;v.canvas.height=height;v.flip=!!p.flip;const g=v.canvas.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';if(p.flip){g.translate(width,0);g.scale(-1,1)}g.drawImage(im,0,0,width,height)}return v.canvas}
function groundedProp(p,q){const profile=GROUND_CONTACTS[p.type],im=SPR[p.type],rule=profile.rule,f=q.sc*k,w=p.w*f,h=p.h*f,top=q.py-h,hz=horizonPx(),band=rule.bandTop,bandY=top+band*h,sample=groundSample(p,im,w,h),points=Array.from({length:65},(_,i)=>contactPoint(p,q,profile,i/64));
 // Each actual support gets its own shadow on the curved surface, including separated arbor feet.
 og.save();og.beginPath();og.rect(0,hz-.75,innerWidth,innerHeight-hz+1);og.clip();og.lineCap='round';og.lineJoin='round';
 for(const [radius,alpha,blur] of [[Math.max(2.5,w*.032),.16,Math.max(2,w*.025)],[Math.max(1.1,w*rule.contactWidth),rule.contactOpacity,1]]){og.strokeStyle=`rgba(28,43,12,${alpha})`;og.lineWidth=radius;og.shadowColor=`rgba(28,43,12,${alpha*.7})`;og.shadowBlur=blur*DPR;og.beginPath();let drawing=false;for(const a of points){if(a.active&&a.al<=AT){if(drawing)og.lineTo(a.x,a.y+.25);else og.moveTo(a.x,a.y+.25);drawing=true}else drawing=false}og.stroke()}
 og.restore();
 // Keep roofs, flowers, produce and upper woodwork unchanged. Only the lower support band conforms.
 og.save();if(q.al>AT){og.beginPath();og.rect(0,0,innerWidth,hz+.5);og.clip()}og.beginPath();og.rect(q.px-w/2-.5,top-.5,w+1,band*h+1);og.clip();og.drawImage(sample,q.px-w/2,top,w,h);og.restore();
 let correction=0,contacts=0;
 const slices=Math.min(96,Math.max(16,Math.round(w*DPR)));
 for(let i=0;i<slices;i++){const u0=i/slices,u1=(i+1)/slices,u=(u0+u1)/2,a=contactPoint(p,q,profile,p.flip?1-u:u),valid=!!a.warp,end=valid?Math.min(1,Math.max(band+.05,a.v+.012)):1,ratio=valid?(end-band)/Math.max(.06,a.v-band):0,dy=valid?a.dy:0;
  correction=Math.max(correction,Math.abs(dy));const x0=Math.round((q.px-w/2+u0*w)*DPR)/DPR,x1=Math.round((q.px-w/2+u1*w)*DPR)/DPR,height=(end-band)*h+dy*ratio;if(x1<=x0||height<=0)continue;
  og.save();if(q.al>AT||(valid&&a.al>AT)){og.beginPath();og.rect(0,0,innerWidth,hz+.5);og.clip()}og.drawImage(sample,u0*sample.width,band*sample.height,(u1-u0)*sample.width,(end-band)*sample.height,x0,bandY,x1-x0,height);og.restore();if(a.active)contacts++;
 }
 groundingAudit.push({id:p.type,s:p.s,contacts,baseCorrectionMaxCss:+correction.toFixed(3),grounded:true});
}

function drawObjects(){og.setTransform(DPR,0,0,DPR,0,0);og.clearRect(0,0,innerWidth,innerHeight);HITS=[];visibleAudit=[];groundingAudit=[];
 const items=[],hz=horizonPx(),vis=s=>{const al=(s-cam)/R;return al>AMIN-.35&&al<Math.PI};
 PROPS.forEach(p=>{if(vis(p.s))items.push({s:p.s,kind:'prop',p})});LEVELS.forEach(m=>{if(vis(m.s))items.push({s:m.s,kind:'mk',m})});const cr=pos.cardinal,rs=BOBO_CHAPTER.sprites[BOBO_CHAPTER.cardinalRock];if(cr&&cr.lift==null&&vis(cr.s))items.push({s:cr.s,kind:'prop',p:{type:BOBO_CHAPTER.cardinalRock,x:cr.x,s:cr.s,w:rs.w,h:rs.h}});for(const n in CHAR){const a=pos[n];if(a&&vis(a.s))items.push({s:a.s,kind:'ch',n,a})};for(let k=0;k<LOOPS;k++)for(const c of (CHS[k%NCH].cameos||[])){{const a={...c,s:c.s+k*L};if(!vis(a.s))continue;if(c.who==='cardinal'&&c.lift==null){const rs2=BOBO_CHAPTER.sprites[BOBO_CHAPTER.cardinalRock];items.push({s:a.s,kind:'prop',p:{type:BOBO_CHAPTER.cardinalRock,x:a.x,s:a.s,w:rs2.w,h:rs2.h}})}a.cameo=1;items.push({s:a.s,kind:'ch',n:c.who,a})}};items.sort((a,b)=>b.s-a.s);
 for(const it of items){const x=it.kind==='prop'?it.p.x:it.kind==='mk'?it.m.x:it.a.x,q=proj(x,it.s),f=q.sc*k,sq=squash(x,it.s);
  if(it.kind==='prop'){const p=it.p,w=p.w*f,h=p.h*f,top=q.py-h;if(q.al>AT&&top>=hz)continue;if(top>innerHeight||q.px+w/2<0||q.px-w/2>innerWidth)continue;if(GROUND_CONTACTS[p.type])groundedProp(p,q);else if(p.lift)fadeDraw(SPR[p.type],q.px,q.py-p.lift*f,w,h,q,p.flip);else {if(q.al<=AT&&!p.noShadow)softShadow(q.px,q.py,w,sq,.18);fadeDraw(SPR[p.type],q.px,q.py,w,h,q,p.flip);}visibleAudit.push({id:p.type,s:p.s,top,base:q.py,horizon:hz,crest:q.al>AT});}
  else if(it.kind==='ch'){const c=CHAR[it.n],img=IM[it.n],h=c.h*f,w=c.w*f,hop=(it.a.hop||0)*f,perch=it.n==='cardinal'?(it.a.lift??BOBO_CHAPTER.cardinalPerch)*f:0,foot=q.py-hop-perch;if(q.al>AT&&foot-h>=hz)continue;if(it.a.cameo&&q.py>tabTop()-10)continue;const flip=it.a.flip!=null?it.a.flip:it.n==='buck'?it.a.x<routeX(it.s):pos.face<0;if(it.n!=='cardinal'&&q.al<=AT)characterGrounding(c,q.px,foot,w,h,sq,flip);fadeDraw(img,q.px,foot,w,h,q,flip);visibleAudit.push({id:it.n,kind:'character',s:it.s,x:it.a.x,top:foot-h,base:foot,left:q.px-w/2,right:q.px+w/2});}
  else{const m=it.m,kind=m.L<cur?'completed':m.L===cur?'current':'locked',W=BOBO_CHAPTER.markerWidth*MKS*f,img=IM['mk_'+kind],hs=W/512*sq*.8,top=q.py-205*hs;if(q.al>AT&&top>=hz)continue;
   og.save();if(q.al>AT)og.globalAlpha=ss((hz-top)/24);og.translate(q.px,q.py);og.scale(W/512,hs);
   if(kind==='current'){const pulse=.5+.5*Math.sin(performance.now()/260);og.fillStyle=`rgba(190,255,110,${.25+.25*pulse})`;og.beginPath();og.ellipse(0,0,250,200,0,0,7);og.fill()}
   og.drawImage(img,-256,-205,512,512);og.fillStyle='#fff';og.strokeStyle=kind==='locked'?'#1d2a2a':kind==='current'?'#0d5a12':'#063D35';og.lineJoin='round';og.lineWidth=18;og.textAlign='center';og.textBaseline='middle';og.font=`900 ${kind==='locked'?120:150}px BoboNunito,system-ui`;const ty=kind==='completed'?-45:-20;og.strokeText(m.L,0,ty);og.fillText(m.L,0,ty);if(kind==='completed'){const ns=Math.max(1,+STARS[m.L-1]||3);[[-85,85],[0,97],[85,85]].forEach(([a,b],i)=>{og.save();if(i>=ns){og.filter='grayscale(1) brightness(.55)';og.globalAlpha=.85}og.drawImage(IM.star,a-46,b-46,92,92);og.restore()})};og.restore();
   if(q.al<AT&&q.py<tabTop()-14&&q.py>0)HITS.push({L:m.L,kind,x:q.px,y:q.py,r:W*.45});}
 }
}

// ---------------- approved UI overlay (unchanged art) ----------------
const fixed=document.getElementById('fixed');
const put=(src,x,y,w,h)=>{const i=new Image();i.src=src;Object.assign(i.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});fixed.appendChild(i);return i};
function label(txt,st,fs,x,y,w,h){const c=document.createElement('canvas'),r=Math.max(2,devicePixelRatio||1);c.width=w*r;c.height=h*r;Object.assign(c.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});fixed.appendChild(c);
 fontP.then(()=>{const g=c.getContext('2d');g.setTransform(r,0,0,r,0,0);let f=fs;g.font=`900 ${f}px BoboNunito`;while(f>16&&g.measureText(txt).width>w*.86){f--;g.font=`900 ${f}px BoboNunito`}
  const m=g.measureText(txt),by=h/2+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;g.textAlign='center';g.lineJoin='round';g.lineWidth=f*st.ow;g.strokeStyle=st.ol;g.strokeText(txt,w/2,by);g.fillStyle=st.fill;g.fillText(txt,w/2,by)});return c}
Promise.resolve({"ALT_daily_pressed":[188,1818,443,303],"ALT_events_pressed":[664,1816,438,306],"ALT_gear_pressed":[1070,229,106,110],"ALT_play_pressed":[145,2137,1001,314],"L01_background":[0,0,1290,2796],"L02_heart_counter":[70,228,360,111],"L03_bone_counter":[470,222,460,123],"L04_gear":[1070,229,106,110],"L05_logo":[320,395,660,325],"L06_buck":[855,703,370,729],"L07_bunny":[88,864,282,538],"L08_rambo":[337,663,709,1121],"L09_cardinal":[162,1368,250,336],"L10_daily":[188,1817,443,304],"L11_events":[664,1816,438,306],"L12_play":[145,2135,1001,316],"L13_bottom_bar":[0,2450,1290,346],"L14_active_home_tile":[19,2450,226,225],"L15_nav_home":[43,2450,171,208],"L16_nav_map":[302,2450,169,208],"L17_nav_toys":[562,2450,166,208],"L18_nav_friends":[800,2450,205,208],"L19_nav_shop":[1082,2450,158,208]}).then(m=>{
 for(const n of['L02_heart_counter','L03_bone_counter','L04_gear'])put(BOBO_CHAPTER.ui[n],...m[n]);
 put(BOBO_CHAPTER.ui.L13_bottom_bar,...m.L13_bottom_bar);const t=m.L14_active_home_tile;put(BOBO_CHAPTER.ui.L14_active_home_tile,t[0]+258,t[1],t[2],t[3]);
 ['L15_nav_home','L16_nav_map','L17_nav_toys','L18_nav_friends','L19_nav_shop'].forEach(n=>put(BOBO_CHAPTER.ui[n],...m[n]));
 const GG=(typeof G!=='undefined'&&G)||{hearts:5,bones:0};
 label(String(Math.max(0,Math.min(5,Math.floor(+GG.hearts||0)))),{fill:'#006368',ol:'#003E42',ow:.04},84,215,229,86,96);label((+GG.bones||0).toLocaleString('en-US'),{fill:'#006368',ol:'#003E42',ow:.04},84,603,229,237,96);
 const hit=(b,fn)=>{const d=document.createElement('div');Object.assign(d.style,{position:'absolute',left:b[0]+'px',top:b[1]+'px',width:b[2]+'px',height:b[3]+'px',pointerEvents:'auto',cursor:'pointer'});d.dataset.by=b[1];d.onclick=fn;fixed.appendChild(d)};
 const goto=p=>{const u='../'+p;window.BA?BA.nav(u):location.href=u};
 hit(m.L02_heart_counter,()=>goto('shop.html'));hit(m.L03_bone_counter,()=>goto('shop.html'));hit(m.L04_gear,()=>goto('settings.html'));
 ['index.html',null,'toys.html','friends.html','shop.html'].forEach((p,i)=>hit([i*258,2450,258,231],()=>p?goto(p):glideTo(camFor(LEVELS[cur-1].s))));
 fitUI()});
function fitUI(){const S=innerWidth/1290,fh=innerHeight/S;fixed.style.transform=`scale(${S})`;fixed.style.height=fh+'px';const off=fh-2796;
 fixed.querySelectorAll('img,canvas,div').forEach(e=>{if(e.dataset.by===undefined)e.dataset.by=parseFloat(e.style.top);const by=+e.dataset.by;if(by>=2400)e.style.top=(by+off)+'px'})}

// ---------------- camera input (camera only; never moves characters) ----------------
const clampC=s=>Math.max(-1200,Math.min(TOT-2600,s));
function tabTop(){return innerHeight-346*innerWidth/1290}
function cameraForY(s,y){let lo=s-Math.PI*R*.45,hi=s+200;for(let j=0;j<50;j++){const c=(lo+hi)/2,p=projA(645,(s-c)/R);if(p.py<y)lo=c;else hi=c}return clampC((lo+hi)/2)}
function startCamera(n){const m=LEVELS[n-1],bottom=tabTop(),top=horizonPx(),target=bottom-(+QP.get('cy')||.22)*(bottom-top);let c=cameraForY(m.s,target);if(n<=2)c=Math.min(c,cameraForY(LEVELS[0].s,bottom-120*k));return c}

let drag=null,vel=0,glide=null;
function camFor(sTarget){return cameraForY(sTarget,tabTop()-(+QP.get('cy')||.22)*(tabTop()-horizonPx()))}
function glideTo(s){glide={from:cam,to:clampC(s),t0:performance.now(),dur:700};vel=0}
let dragFrames=[],lastDrag=null;
function down(x,y,t){dragFrames=[];drag={x,y,c0:cam,t,moved:0,started:performance.now()};vel=0;glide=null}
function mv(x,y,t){if(!drag)return;drag.moved=Math.max(drag.moved,Math.hypot(x-drag.x,y-drag.y));const nc=clampC(drag.c0+(y-drag.y)/k),dt=Math.max(8,t-(drag.lt||drag.t));vel=0.7*vel+0.3*(nc-cam)/dt;drag.lt=t;cam=nc}
function up(x,y){if(!drag)return;const d=drag;drag=null;lastDrag={durationMs:performance.now()-d.started,samples:dragFrames.slice(),input:'pointer',verifiedOnPhone:false};if(d.moved<10){vel=0;const h=HITS.find(h=>Math.hypot(h.x-x,h.y-y)<h.r);if(h){if(h.kind=='locked')toast(`Level ${h.L} · finish level ${cur} first`);else playLevel(h.L)}}}
let leaving=false;function playLevel(n){if(leaving)return;leaving=true;try{sessionStorage.setItem('gbb_map','bovo2/map.html')}catch(e){}window.BA&&BA.play&&BA.play('tap',{gap:80});const url='../game.html?lv='+n;window.BA?BA.nav(url):location.href=url;setTimeout(()=>leaving=false,1500)}
if(window.PointerEvent){obc.addEventListener('pointerdown',e=>{e.preventDefault();obc.setPointerCapture(e.pointerId);down(e.clientX,e.clientY,e.timeStamp)});
 obc.addEventListener('pointermove',e=>mv(e.clientX,e.clientY,e.timeStamp));obc.addEventListener('pointerup',e=>{e.preventDefault();up(e.clientX,e.clientY)});obc.addEventListener('pointercancel',e=>up(-1e4,-1e4))}
else{obc.addEventListener('touchstart',e=>{const t=e.touches[0];down(t.clientX,t.clientY,e.timeStamp)},{passive:true});
 obc.addEventListener('touchmove',e=>{const t=e.touches[0];mv(t.clientX,t.clientY,e.timeStamp)},{passive:true});obc.addEventListener('touchend',e=>{const t=e.changedTouches[0];up(t.clientX,t.clientY)})}
document.addEventListener('touchmove',e=>{if(!e.target.closest('button'))e.preventDefault()},{passive:false});
addEventListener('wheel',e=>{cam=clampC(cam-e.deltaY);vel=0;e.preventDefault()},{passive:false});
document.getElementById('bFwd').onclick=()=>glideTo(cam+1300);
document.getElementById('bBack').onclick=()=>glideTo(cam-1300);
document.getElementById('bRambo').onclick=()=>glideTo(camFor(pos.rambo.s));
document.getElementById('bWin').onclick=()=>{if(move||cur>=LEVELS.length)return;setCur(cur+1,true);glideTo(camFor(LEVELS[cur-1].s))};
document.getElementById('bReset').onclick=()=>{setCur(2,false);glideTo(startCamera(2))};
let tt;function toast(t){const e=document.getElementById('toast');e.textContent=t;e.style.opacity=1;clearTimeout(tt);tt=setTimeout(()=>e.style.opacity=0,2500)}


let selectedLevel=2;const modal=document.getElementById('levelModal');
function openLevel(n){selectedLevel=n;document.getElementById('levelTitle').textContent='Level '+n;modal.classList.add('open');document.getElementById('previewWin').focus()}
function closeLevel(){modal.classList.remove('open')}
modal.querySelector('.close').onclick=closeLevel;modal.onclick=e=>{if(e.target===modal)closeLevel()};addEventListener('keydown',e=>{if(e.key==='Escape')closeLevel()});
document.getElementById('previewWin').onclick=()=>{closeLevel();if(selectedLevel===cur&&cur<LEVELS.length){setCur(cur+1,true);glideTo(camFor(LEVELS[cur-1].s))}else glideTo(camFor(LEVELS[selectedLevel-1].s))};

const reviewMode=new URLSearchParams(location.search).has('review');
if(reviewMode){document.body.classList.add('review');const panel=document.getElementById('reviewPanel');panel.hidden=false;for(const conn of ['X1','X2'])for(const dir of ['forward','backward'])for(let i=0;i<8;i++){const vals=BOBO_CHAPTER.reviewPositions[conn],idx=dir==='forward'?i:7-i,b=document.createElement('button');b.textContent=conn+' '+dir+' '+String(i+1).padStart(2,'0');b.onclick=()=>{cam=clampC(vals[idx]);vel=0;glide=null;panel.dataset.position=b.textContent;};panel.append(b)}for(const [name,c] of [['Join 1',2600],['Join 2',3700],['Join 3',6300],['Join 4',7400]]){const b=document.createElement('button');b.textContent=name;b.onclick=()=>{cam=c-1100;vel=0;glide=null;panel.dataset.position=name};panel.append(b)}const reset=document.createElement('button');reset.textContent='Review reset';reset.onclick=()=>{setCur(2,false);cam=startCamera(2);vel=0;glide=null;panel.dataset.position='Review reset'};panel.append(reset);for(const n of Array.from({length:30},(_,i)=>i+1)){const b=document.createElement('button');b.textContent='Level '+n+' view';b.onclick=()=>{setCur(n,false);cam=startCamera(n);vel=0;glide=null;panel.dataset.position=b.textContent};panel.append(b)}}
let measures=[];function diagnostics(t,ms){if(drag)dragFrames.push(ms);measures.push(ms);if(measures.length>180)measures.shift();const sorted=measures.slice().sort((a,b)=>a-b),d={renderer:groundRenderer?.mode,reason:groundRenderer?.reason||null,dpr:DPR,anisotropy:groundRenderer?.anisotropy||0,textures:groundRenderer?.uploads||[],camera:cam,current:cur,party:pos,dragging:!!drag,lastDrag,drawMs:ms,medianDrawMs:sorted[Math.floor(sorted.length/2)],p95DrawMs:sorted[Math.floor(sorted.length*.95)],horizon:horizonPx(),tabTop:tabTop(),hits:HITS,visible:visibleAudit,grounding:groundingAudit};d.reviewPosition=document.getElementById('reviewPanel').dataset.position||'start';document.getElementById('diagnostics').textContent=JSON.stringify(d);document.getElementById('diagnostics').dataset.position=d.reviewPosition;document.getElementById('diagnostics').dataset.current=String(cur);}
// ---------------- frame loop ----------------
let lastGroundKey=null;
function resize(){DPR=Math.min(groundRenderer?.mode==='WebGL2'?3:2,devicePixelRatio||1);for(const c of[glc,sky,obc]){c.width=Math.round(innerWidth*DPR);c.height=Math.round(innerHeight*DPR)}geom();groundRenderer?.resize();lastGroundKey=null;fitUI()}
addEventListener('resize',resize);resize();
const secName=s=>({A:'SECTION A',X1:'CROSSING',B:'SECTION B',X2:'CROSSING'})[SEC[secAt(s).i].n];
let lastT=performance.now(),fpsAt=lastT,fpsN=0;
function frame(t){const renderStart=performance.now();fpsN++;if(t-fpsAt>1000){obc.dataset.fps=Math.round(fpsN*1000/(t-fpsAt));fpsN=0;fpsAt=t}if(!ART_READY){requestAnimationFrame(frame);return}const dt=Math.min(50,t-lastT);lastT=t;
 if(glide){const u=Math.min(1,(t-glide.t0)/glide.dur);cam=glide.from+(glide.to-glide.from)*ss(u);if(u>=1)glide=null}
 else if(!drag&&Math.abs(vel)>0.01){cam=clampC(cam+vel*dt);vel*=Math.pow(0.996,dt)}
 stepMove(t);
 const groundKey=[cam,glc.width,glc.height,WV].join(':');if(groundKey!==lastGroundKey){drawGround();drawSky();lastGroundKey=groundKey}drawObjects();
 const mid=cam+0.45*Hv,si=secAt(mid);
 document.getElementById('info').textContent=`camera ${Math.round(cam)} · ${SEC[si.i].n} ${Math.round(si.loc)}/${SEC[si.i].len} · loop ${si.loop+1} · Rambo at level ${cur}`;
 obc.dataset.renderMs=(performance.now()-renderStart).toFixed(1);if(reviewMode)diagnostics(t,performance.now()-renderStart);requestAnimationFrame(frame)}
cam=0;window.PROTO={get cam(){return cam},set cam(v){cam=clampC(v);vel=0;glide=null},proj,get pos(){return pos},LEVELS,L,SECBASE,setCur,get cur(){return cur}};
requestAnimationFrame(frame);

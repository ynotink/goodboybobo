/* Shared runtime for the approved-art menu pages (Toy Box, Shop, Settings, Friends).
   Each page is the approved full-screen picture, shown at one uniform scale on the 1290x2796 phone canvas.
   Only live pieces are layered on top: the locked Home counters (blank) with live numbers, and page widgets. */
(function(){
const HOME='a/home/';
const PAGES=window.PAGE_NAV||{home:'index.html',map:'map.html',toys:'toys.html',shop:'shop.html',settings:'settings.html',friends:'friends.html'};
const stage=document.createElement('div');stage.id='stage';
Object.assign(stage.style,{position:'absolute',left:0,top:0,width:'1290px',height:'2796px',transformOrigin:'0 0'});
document.body.appendChild(stage);
const css=document.createElement('style');css.textContent=`html,body{margin:0;height:100%;overflow:hidden;background:#0b5459;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}
#stage img,#stage canvas{position:absolute;display:block;pointer-events:none}.hit{position:absolute;cursor:pointer}body.dbg .hit{outline:4px dashed #ff00d4;background:rgba(255,0,212,.12)}
#toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 110px);transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;font:600 14px -apple-system,system-ui;padding:8px 14px;border-radius:10px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:9;white-space:nowrap}#toast.on{opacity:1}`;
document.head.appendChild(css);
const T=document.createElement('div');T.id='toast';document.body.appendChild(T);
let tt;function toast(t){T.textContent=t;T.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>T.classList.remove('on'),1200)}
const img=(src,x,y,w,h)=>{const i=new Image();i.src=src;i.alt='';Object.assign(i.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.appendChild(i);return i};
const go=p=>{if(window.BA)BA.nav(PAGES[p]);else location.href=PAGES[p]};
function hit(name,[x,y,w,h],act){const d=document.createElement('div');d.className='hit';Object.assign(d.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.appendChild(d);
 d.addEventListener('click',()=>{window.BA&&BA.play&&BA.play('tap',{gap:80});act?act():toast(name)});return d}
// live numbers: approved Home spec
const SPEC={counter:{fill:'#006368',outline:'#003E42',ow:1,sh:{c:'0,57,59',a:.45,dx:0,dy:3,b:1},hi:{c:'#55AAA5',a:.2}}};
const BOX={hearts:{x:215,y:229,w:86,h:96,fs:84,st:'counter'},bones:{x:603,y:229,w:237,h:96,fs:84,min:70,pad:4,st:'counter'}};
let S=1,VAL={};
function drawText(k){const B=BOX[k],P=SPEC[B.st],txt=VAL[k],r=S*devicePixelRatio,c=B.c,pad=12;
 c.width=Math.round((B.w+2*pad)*r);c.height=Math.round((B.h+2*pad)*r);
 Object.assign(c.style,{left:(B.x-pad)+'px',top:(B.y-pad)+'px',width:(B.w+2*pad)+'px',height:(B.h+2*pad)+'px'});
 const g=c.getContext('2d');g.setTransform(r,0,0,r,0,0);let fs=B.fs;const font=s=>`900 ${s}px BoboNunito`;g.font=font(fs);
 if(B.min){while(fs>B.min&&g.measureText(txt).width+B.pad>B.w){fs--;g.font=font(fs)}}
 const m=g.measureText(txt),x=pad+B.w/2-m.width/2,y=pad+B.h/2+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2-1;g.lineJoin='round';
 g.save();g.filter=`blur(${P.sh.b}px)`;g.fillStyle=g.strokeStyle=`rgba(${P.sh.c},${P.sh.a})`;g.lineWidth=2*P.ow;g.strokeText(txt,x+P.sh.dx,y+P.sh.dy);g.fillText(txt,x+P.sh.dx,y+P.sh.dy);g.restore();
 g.strokeStyle=P.outline;g.lineWidth=2*P.ow;g.strokeText(txt,x,y);g.fillStyle=P.fill;g.fillText(txt,x,y);
 const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const h=o.getContext('2d');h.setTransform(r,0,0,r,0,0);h.font=g.font;
 h.fillStyle='#000';h.fillText(txt,x,y);h.globalCompositeOperation='destination-out';h.fillText(txt,x,y+1);h.globalCompositeOperation='source-in';h.fillStyle=P.hi.c;h.fillRect(0,0,o.width,o.height);
 g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=P.hi.a;g.drawImage(o,0,0);g.restore()}
function fit(){const W=innerWidth,H=innerHeight;S=Math.min(W/1290,H/2796);const x=(W-1290*S)/2,y=H-2796*S;stage.style.transform=`translate(${x}px,${y}px) scale(${S})`;for(const k in BOX)BOX[k].c&&drawText(k)}
window.PAGE={stage,img,hit,toast,go,fit};
window.buildPage=async function(o){
 img('a/pages/'+o.image+'.webp',0,0,1290,2796);
 const meta=await (await fetch(HOME+'layers.json?v=22')).json();
 for(const k of ['L02_heart_counter','L03_bone_counter']){const [x,y,w,h]=meta[k];img(HOME+k+'.webp',x,y,w,h)}
 const ff=new FontFace('BoboNunito',`url(${HOME}Nunito-Black.ttf)`,{weight:'900'});await ff.load();document.fonts.add(ff);
 const G2=(typeof G!=='undefined'?G:null)||{hearts:5,bones:0};VAL={hearts:String(Math.max(0,Math.min(5,Math.floor(+G2.hearts||0)))),bones:Math.max(0,Math.floor(+G2.bones||0)).toLocaleString('en-US')};
 for(const k in BOX){const c=document.createElement('canvas');stage.appendChild(c);BOX[k].c=c}
 hit('Hearts +',meta.L02_heart_counter,()=>o.image=='shop'?toast('Purchases coming soon!'):go('shop'));
 hit('Bones +',meta.L03_bone_counter,()=>o.image=='shop'?toast('Purchases coming soon!'):go('shop'));
 hit('Settings',meta.L04_gear,()=>o.image=='settings'?go('home'):go('settings'));
 ['home','map','toys','friends','shop'].forEach((p,i)=>hit(p,[i*258,2450,258,231],()=>p==o.image?null:go(p)));
 o.extra&&o.extra();
 fit();addEventListener('resize',fit);
};
})();

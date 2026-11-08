/* Good Boy Bobo — living Rambo portrait in gameplay.
   Idle loop (pants, blinks, winks, tilts his head) always plays; a happy bounce plays on combos, mega combos,
   level clear, and when you tap him. Soft-edged cutouts made from Seedance video (a/motion/rb_*.webp).
   The original still (#rb) stays underneath as the fallback and keeps the tap. Off: ?motion=0 / reduced motion. */
(function(){
const Q=new URLSearchParams(location.search);
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches||JSON.parse(localStorage.getItem('gbb_settings')||'{}').motion===0}catch(e){}
if(Q.get('motion')==='0'||RM)return;
const rb=document.getElementById('rb');if(!rb)return;
// placement measured from the source art (ring art 780px wide shown at 136px at left 256, top 40)
const K=136/600,X0=256-60*K,Y0=40-271*K;
const box=(c)=>`left:${X0+c[0]*K}px;top:${Y0+c[1]*K}px;width:${(c[2]-c[0])*K}px;height:auto`;
const IDLE=[54,260,642,996],HAPPY=[48,92,644,996],HAPPY_MS=121*42;
const base='position:absolute;pointer-events:none;z-index:'+(getComputedStyle(rb).zIndex==='auto'?3:getComputedStyle(rb).zIndex)+';filter:drop-shadow(0 5px 6px rgba(20,10,0,.4))';
const idle=new Image();idle.src='a/motion/rb_idle.webp';idle.style.cssText=base+';'+box(IDLE)+';opacity:0;transition:opacity .25s';
rb.after(idle);
let HB=null;fetch('a/motion/rb_happy.webp').then(r=>r.blob()).then(b=>HB=b).catch(()=>{});   // load once; each reaction gets its own copy so it starts from frame 1
idle.onload=()=>{idle.style.opacity=1;rb.style.opacity=0};
let busy=false,lastT=0;
function happy(force){const now=performance.now();if(!HB||busy||(!force&&now-lastT<5500)||idle.style.opacity!=='1')return;busy=true;lastT=now;
 const h=new Image();h.style.cssText=base+';'+box(HAPPY);
 const u=URL.createObjectURL(HB);
 h.onload=()=>{idle.after(h);idle.style.visibility='hidden';
  setTimeout(()=>{idle.style.visibility='';h.remove();URL.revokeObjectURL(u);busy=false},HAPPY_MS-40)};
 h.onerror=()=>{busy=false;URL.revokeObjectURL(u)};
 h.src=u;
}
window.RBLIVE={happy};
// little reactions to everything you do (no extra video needed)
const wrap=document.createElement('div');wrap.style.cssText='position:absolute;inset:0;pointer-events:none';
function react(kind){const t=busy?null:idle;if(!t)return;
 const K={bob:[{translate:'0 0',scale:'1 1'},{translate:'0 -5px',scale:'1.04 .97',offset:.35},{translate:'0 1px',scale:'.98 1.02',offset:.7},{translate:'0 0',scale:'1 1'}],
  nope:[{translate:'0 0',rotate:'0deg'},{translate:'-4px 0',rotate:'-5deg'},{translate:'4px 0',rotate:'5deg'},{translate:'-3px 0',rotate:'-3deg'},{translate:'0 0',rotate:'0deg'}],
  wow:[{scale:'1',rotate:'0deg'},{scale:'1.12',rotate:'-4deg',offset:.3},{scale:'.96',rotate:'3deg',offset:.6},{scale:'1',rotate:'0deg'}],
  worry:[{rotate:'0deg',translate:'0 0'},{rotate:'-7deg',translate:'0 3px',offset:.3},{rotate:'-7deg',translate:'0 3px',offset:.7},{rotate:'0deg',translate:'0 0'}]}[kind];
 t.style.transformOrigin='50% 85%';t.animate(K,{duration:kind==='worry'?1600:kind==='nope'?420:340,easing:'ease-in-out'})}
if(typeof fx==='function'){const of=fx;window.fx=fx=function(n,o){of(n,o);
  if(n==='match'||n==='swap')react('bob');else if(n==='badswap')react('nope');else if(n==='special'||n==='striped'||n==='bomb')react('wow');else if(n==='lowmoves')react('worry');
  else if(n==='rainbow'||n==='mega')happy(true)}}
if(typeof snd==='function'){const os=snd;window.snd=snd=function(k,v){os(k,v);if(k==='pop')react((v||0)>=3?'wow':'bob');else if(k==='bad')react('nope')}}
// every now and then he gets excited on his own
(function rnd(){setTimeout(()=>{if(!document.hidden)happy(false);rnd()},14000+Math.random()*10000)})();
// hook the game's reactions
if(typeof comboText==='function'){const oc=comboText;window.comboText=comboText=function(t){oc(t);happy(/MEGA|CLEAR/.test(t))}}
rb.addEventListener('click',()=>happy(true));
})();

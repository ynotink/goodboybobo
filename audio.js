window.GBB_BUILD=23;
// temporary build tag (bottom-left) so we always know which version the phone is showing
addEventListener('DOMContentLoaded',()=>{if(!window.GBB_REVIEW)return;const t=document.createElement('div');t.textContent='build '+GBB_BUILD+' · '+(location.protocol==='file:'?'built-in copy':'live');t.style.cssText='position:fixed;left:6px;bottom:6px;z-index:99999;font:700 11px system-ui;color:#fff;background:rgba(0,0,0,.55);padding:3px 7px;border-radius:8px;pointer-events:none';document.body.appendChild(t)});
/* Good Boy Bobo — audio engine.
   Music: seamless loops, songs fade in from their start, crossfade when the song changes,
   fade out before leaving a page, and only continue mid-song when hopping straight between screens
   that share the same song. Effects: decoded ahead of time (never late), musical ones pre-rendered
   in the key of the song that is playing. Voice and barks gently dip the music. */
(function(){
/* inside the app shell: every screen shares the shell's one audio engine, so music never restarts and nothing pops between screens */
let SH=null;try{if(window.parent!==window&&window.parent.GBB_SHELL)SH=window.parent.GBB_SHELL}catch(e){}
if(SH){const P=window.parent.BA;let mine=null;window.GBB_FRAMED=true;
 window.BA={music:n=>{mine=n;if(SH.active(window))P.music(n)},play:(n,o)=>P.play(n,o),apply:()=>P.apply(),nav:u=>SH.go(new URL(u,location.href).href,window),MUS:P.MUS,chMusic:c=>P.chMusic(c),unlock:()=>P.unlock(),
  get mine(){return mine},get shift(){return P.shift},get playing(){return P.playing},get state(){return P.state},get ready(){return P.ready}};
 ['pointerdown','touchstart','touchend','keydown'].forEach(e=>addEventListener(e,()=>P.unlock(),{capture:true,passive:true}));
 addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('.tap,.imgbtn,.bimg,.gnav .it,.nav .it,.qb,.btn');if(el&&!el.dataset.nosnd)P.play(el.dataset.snd||'tap',{gap:80})},true);
 // links between screens go through the shell too
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target||e.defaultPrevented)return;const u=new URL(a.getAttribute('href'),location.href);if(u.origin!==location.origin)return;e.preventDefault();BA.nav(u.href)});
 // while this screen is hidden behind another one: hold its animation frames and park its videos (so it costs nothing)
 const _raf=window.requestAnimationFrame.bind(window),held=[];window.GBB_HIDDEN=false;
 window.requestAnimationFrame=cb=>{if(window.GBB_HIDDEN){held.push(cb);return 0}return _raf(cb)};
 const MP=HTMLMediaElement.prototype,_play=MP.play,_pause=MP.pause;
 MP.play=function(){this._want=true;if(window.GBB_HIDDEN)return Promise.resolve();return _play.apply(this,arguments)};
 MP.pause=function(){this._want=false;return _pause.apply(this,arguments)};
 document.addEventListener('play',e=>{if(window.GBB_HIDDEN&&e.target.pause){e.target._want=true;_pause.call(e.target)}},true);
 window.GBB_hide=()=>{if(window.GBB_HIDDEN)return;window.GBB_HIDDEN=true;document.querySelectorAll('video,audio').forEach(v=>{v._want=!v.paused;_pause.call(v)});
  try{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))}catch(e){}};
 window.GBB_show=()=>{const was=window.GBB_HIDDEN;window.GBB_HIDDEN=false;if(was){const h=held.splice(0);h.forEach(cb=>_raf(cb));
   document.querySelectorAll('video,audio').forEach(v=>{if(v._want)_play.call(v).catch(()=>{})});
   try{dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))}catch(e){}}
  if(mine)P.music(mine)};
 if(SH.startHidden&&SH.startHidden(window))window.GBB_HIDDEN=true;
 const sa=()=>{const r=document.documentElement.style;r.setProperty('--sat',SH.sat+'px');r.setProperty('--sab',SH.sab+'px')};sa();
 const rd=()=>SH.ready(window);addEventListener('load',()=>_raf(()=>_raf(rd)));document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>_raf(()=>_raf(rd)),/game_new/.test(location.pathname)?2500:350));
 return}
const AB=(document.currentScript&&document.currentScript.src||'').replace(/audio\.js.*$/,'');
// opened on its own (not inside the app shell)? hop into the shell so the whole app shares one engine
if(!window.GBB_SHELL_HOST&&window.parent===window&&!/[?&]solo=1/.test(location.search)&&!window.GBB_REVIEW&&location.protocol!=='file:'){
 const rel=location.href.slice(AB.length);if(/^(bovo11\/(index|shop|toys|friends|settings)|bovo10\/index|game_new)\.html/.test(rel)){location.replace(AB+'index.html?start='+encodeURIComponent(rel.replace(/([?&])b=\d+&?/,'$1').replace(/[?&]$/,'')));return}}
const MUS={home:'Theme',rooms:'inside_myself',
 ch:['Backyard_Groove','Things_to_Do','On_My_Mind','Breezy_Love','Groove','Rainy_Day_Love','Groove_2','Find_a_Way','Love_on_the_Way','Always_with_You']};
const TONAL=['swap','match','special','rainbow','star','win','lose','buy','combo0','combo1','combo2','combo3','combo4','combo5','combo6','combo7','starland0','starland1','starland2'];
const PLAIN=['tap','badswap','striped','bomb','mega','crate','dirt','leash','lowmoves','crunch0','crunch1','crunch2','blast','boom','shimmer','popper'];
const VOICE=['voice_m6','voice_m9'],BARK=['rambo_bark','rambo_bark2','rambo_double','rambo_triple'];
const LV={music:.42,sfx:1,voice:.5,bark:.48,tap:.55};
const FADE_IN=1.8,XFADE=1.6,RESUME_WINDOW=25;
const lastPos={};let AC=null,bus={},META=null,buf={},loading={},cur=null,shift=0,unlocked=false,want=null,last={},leaving=false;
const ST=()=>{let s={music:70,sounds:80,barks:1};try{Object.assign(s,JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){}return s};
const muted=()=>{try{const p=JSON.parse(localStorage.getItem('gbb_play')||'{}');return p.sound===0||p.sound===false}catch(e){return false}};
function ctx(){if(AC)return AC;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 try{AC=new C({latencyHint:'interactive'})}catch(e){AC=new C()}
 bus.master=AC.createGain();
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-6;comp.knee.value=6;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.15; // safety glue, never clips
 bus.master.connect(comp);comp.connect(AC.destination);
 for(const k of ['music','sfx','voice']){bus[k]=AC.createGain();bus[k].connect(bus.master)}
 bus.duck=AC.createGain();bus.duck.connect(bus.music);apply();return AC}
function apply(){if(!AC)return;const s=ST(),m=muted()?0:1,t=AC.currentTime;
 bus.music.gain.setTargetAtTime(LV.music*(s.music/100)*m,t,.08);
 bus.sfx.gain.setTargetAtTime(LV.sfx*(s.sounds/100)*m,t,.08);
 bus.voice.gain.setTargetAtTime((s.sounds/100)*m,t,.08)}
function load(path){if(buf[path])return Promise.resolve(buf[path]);if(loading[path])return loading[path];
 loading[path]=fetch(path).then(r=>r.arrayBuffer()).then(a=>new Promise((res,rej)=>ctx().decodeAudioData(a,res,rej))).then(b=>(buf[path]=b)).catch(()=>null);return loading[path]}
const pathOf=n=>TONAL.includes(n)?`${AB}au/k${shift}/${n}.mp3`:`${AB}au/${n}.mp3`;
async function meta(){if(META)return META;try{META=await (await fetch(AB+'au/mus/music.json?v='+window.GBB_BUILD)).json()}catch(e){META={}}return META}
// decode everything ahead of time, a few at a time so gameplay never stutters
let qBusy=false;const queue=[];
function preloadAll(){const list=[...PLAIN,...TONAL,...VOICE,...BARK].map(pathOf);list.forEach(p=>{if(!buf[p]&&!queue.includes(p))queue.push(p)});pump()}
async function pump(){if(qBusy)return;qBusy=true;while(queue.length){const p=queue.shift();await load(p);await new Promise(r=>setTimeout(r,25))}qBusy=false}
// ---------- music ----------
function ramp(g,to,dur){const t=AC.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(to,t+dur)}
// blend the end of the loop into the audio just before the loop start (equal-power), so the jump back is seamless
function bake(b,m){if(b._baked)return;b._baked=1;const sr=b.sampleRate,N=Math.round((m.xf||.05)*sr),e=Math.round(m.loopEnd*sr),s0=Math.round(m.loopStart*sr);
 const e2=Math.min(e,b.length);if(e2!==e){m.loopEnd=e2/sr}
 if(s0<N||e2<N)return;for(let c=0;c<b.numberOfChannels;c++){const d=b.getChannelData(c);
  for(let i=0;i<N;i++){const t=(i+.5)/N,g1=Math.cos(t*Math.PI/2),g2=Math.sin(t*Math.PI/2);d[e2-N+i]=d[e2-N+i]*g1+d[s0-N+i]*g2}}}
async function music(name){want=name;if(!unlocked)return;const ac=ctx();if(!ac)return;const M=await meta();const m=M[name];if(!m)return;
 if(cur&&cur.name==name)return;
 const b=await load(AB+'au/mus/'+m.file+'?v='+window.GBB_BUILD);if(!b||want!==name||leaving)return;bake(b,m);
 const newShift=m.shift||0;if(newShift!==shift){shift=newShift;preloadAll()}
 let pos=0,fade=FADE_IN;
 try{const r=JSON.parse(sessionStorage.getItem('gbb_mus')||'null');
  if(r&&r.name==name&&(Date.now()-r.at)/1000<RESUME_WINDOW){pos=r.pos;fade=0.7}}catch(e){}
 if(pos>=m.loopEnd)pos=m.loopStart+((pos-m.loopStart)%(m.loopEnd-m.loopStart));
 const src=ac.createBufferSource();src.buffer=b;src.loop=true;src.loopStart=m.loopStart;src.loopEnd=m.loopEnd;
 const g=ac.createGain();g.gain.value=0;src.connect(g);g.connect(bus.duck);const t=ac.currentTime+.05;
 if(!pos){const lp=lastPos[name];if(lp&&(Date.now()-lp.at)/1000<RESUME_WINDOW*4){pos=lp.pos;fade=Math.max(.7,fade*.5)}}
 if(pos>=m.loopEnd)pos=m.loopStart+((pos-m.loopStart)%(m.loopEnd-m.loopStart));
 if(cur){const o=cur;lastPos[o.name]={pos:musPos(),at:Date.now()};ramp(o.g,0,XFADE);setTimeout(()=>{try{o.src.stop()}catch(e){}},XFADE*1000+200);fade=Math.max(fade,XFADE)}
 src.start(t,pos);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+fade);
 cur={name,src,g,m,t0:t-pos}}
function musPos(){if(!cur||!AC)return 0;let p=AC.currentTime-cur.t0;const m=cur.m;if(p>m.loopEnd)p=m.loopStart+((p-m.loopStart)%(m.loopEnd-m.loopStart));return Math.max(0,p)}
function remember(){if(cur)try{sessionStorage.setItem('gbb_mus',JSON.stringify({name:cur.name,pos:musPos(),at:Date.now()}))}catch(e){}}
// leave a page smoothly: short fade, then go
function nav(url){if(leaving)return;try{const m=sessionStorage.getItem('gbb_map');if(m&&/^map\.html/.test(url))url=m+url.slice(8)}catch(e){}url=url.replace(/([?&])b=\d+&?/,'$1').replace(/[?&]$/,'');url+=(url.includes('?')?'&':'?')+'b='+window.GBB_BUILD;leaving=true;remember();
 if(AC&&AC.state==='running'){const t=AC.currentTime;bus.master.gain.cancelScheduledValues(t);bus.master.gain.setValueAtTime(bus.master.gain.value,t);bus.master.gain.linearRampToValueAtTime(0,t+.035);setTimeout(()=>{location.href=url},40)}else location.href=url}
addEventListener('pagehide',remember);
addEventListener('pageshow',e=>{if(e.persisted&&AC){leaving=false;ramp(bus.master,1,.4)}});
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden){remember();const t=AC.currentTime;bus.master.gain.cancelScheduledValues(t);bus.master.gain.setValueAtTime(bus.master.gain.value,t);bus.master.gain.linearRampToValueAtTime(0,t+.04);setTimeout(()=>{if(document.hidden)AC.suspend()},60)}else if(unlocked){AC.resume();ramp(bus.master,1,.25)}});
// ---------- one-shots ----------
function play(name,opt={}){if(!unlocked||muted()||leaving||!AC)return;const s=ST();
 const isB=BARK.includes(name),isV=VOICE.includes(name);if(isB&&!s.barks)return;
 const p=pathOf(name),b=buf[p];if(!b){load(p);return}           // not ready yet: skip rather than play late
 const now=performance.now();if(last[name]&&now-last[name]<(opt.gap??45))return;last[name]=now;
 const src=AC.createBufferSource();src.buffer=b;if(opt.rate)src.playbackRate.value=opt.rate;
 const g=AC.createGain(),vol=(opt.vol??1)*(isB?LV.bark:isV?LV.voice:name=='tap'?LV.tap:1);
 src.connect(g);g.connect(isB||isV?bus.voice:bus.sfx);const t=AC.currentTime+(opt.delay||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.004);src.start(t);
 if(isB||isV){bus.duck.gain.cancelScheduledValues(t);bus.duck.gain.setValueAtTime(bus.duck.gain.value,t);bus.duck.gain.linearRampToValueAtTime(.72,t+.08);
  bus.duck.gain.setValueAtTime(.72,t+b.duration*.85);bus.duck.gain.linearRampToValueAtTime(1,t+b.duration*.85+.5)}}
function unlock(){if(unlocked)return;const ac=ctx();if(!ac)return;
 // iOS: play a silent buffer inside the gesture so the context truly starts
 try{const s=ac.createBufferSource();s.buffer=ac.createBuffer(1,1,22050);s.connect(ac.destination);s.start(0)}catch(e){}
 ac.resume();unlocked=true;meta().then(()=>{if(want)music(want)});preloadAll()}
['pointerdown','touchstart','touchend','keydown'].forEach(e=>addEventListener(e,unlock,{capture:true,passive:true}));
// start the music as soon as the game opens (the iPhone app allows sound without a tap; a plain browser may still wait for the first tap)
function autoStart(){if(unlocked)return;const ac=ctx();if(!ac)return;
 const go=()=>{if(unlocked||ac.state!=='running')return;unlocked=true;meta().then(()=>{if(want)music(want)});preloadAll()};
 if(ac.state==='running')go();else{const p=ac.resume();p&&p.then&&p.then(go).catch(()=>{});setTimeout(go,300)}}
autoStart();addEventListener('load',autoStart);addEventListener('pageshow',autoStart);
// soft tap on buttons (only real buttons, never the game board)
addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('.tap,.imgbtn,.bimg,.gnav .it,.nav .it,.qb,.btn');if(el&&!el.dataset.nosnd)play(el.dataset.snd||'tap',{gap:80})},true);
window.BA={music,play,apply,nav:u=>window.GBB_SHELL?GBB_SHELL.go(new URL(u,location.href).href):nav(u),unlock,MUS,get shift(){return shift},get playing(){return cur?cur.name+'@'+musPos().toFixed(1):null},get state(){return AC?AC.state:'none'},
 get ready(){return Object.keys(buf).length},chMusic:ci=>MUS.ch[Math.min(9,Math.floor(ci/3))]};
})();

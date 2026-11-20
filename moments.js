/* Good Boy Bobo — full-screen "moment" screens (ChatGPT movie-poster art) that replace the old pop-up cards:
   Ready (level start), Paused, Out of Moves. Art is 1290 × 2796 layers; the scene fills the phone, the title,
   characters and buttons keep the art's own layout (scaled as one piece so nothing drifts), and every word or
   number is written live in the game's rounded lettering. */
(function(){
// preview switch: ?mom=1 turns the new screens on for this phone/browser, ?mom=0 turns them off (until approved)
try{const q=new URLSearchParams(location.search);if(q.get('mom')==='1')localStorage.setItem('gbb_mom','1');if(q.get('mom')==='0')localStorage.removeItem('gbb_mom');if(localStorage.getItem('gbb_mom')!=='1')return}catch(e){return}
const R='bovo11/mom/',V='?v=1',DW=1290,DH=2796;
const L={"ready":{"10_rambo":[63,1009,974,898],"11_mr_bunny":[853,1201,392,416],"20_title_accents":[102,178,1081,434],"21_title":[268,253,754,278],"30_primary_button_blank":[221,2348,848,246],"31_hard_blank":[483,665,324,110],"32_super_hard_blank":[483,666,324,109]},
 "pause":{"10_rambo":[535,857,706,765],"11_mr_bunny":[46,1246,514,376],"20_title_accents":[102,178,1081,434],"21_title":[206,244,876,289],"30_primary_button_blank":[98,2112,1094,211],"31_restart_button_blank":[82,2376,541,170],"32_quit_button_blank":[668,2377,537,170],"40_music_toggle_on_blank":[778,1729,326,106],"41_sound_toggle_on_blank":[778,1894,326,106],"42_music_toggle_off_blank":[778,1730,326,106],"43_sound_toggle_off_blank":[778,1895,326,106],"50_music_icon":[200,1729,114,107],"51_sound_icon":[189,1895,137,104],"52_restart_icon":[133,2416,90,90],"53_quit_icon":[723,2417,96,87]},
 "lose":{"10_rambo":[108,582,764,1125],"11_mr_cardinal":[826,1136,376,376],"20_title_accents":[102,178,1081,434],"21_title":[61,198,1169,297],"22_still_needed_title":[375,1741,540,128],"30_primary_button_blank":[82,2145,1129,234],"31_give_up_button_blank":[301,2426,688,158],"50_bone_icon":[838,2212,119,95]}};
const css=document.createElement('style');css.textContent=`
#gm{position:fixed;inset:0;z-index:300;display:none;overflow:hidden;font-family:KNun,BoboNunito,system-ui;-webkit-user-select:none;user-select:none;touch-action:none;background:#2d5a20}
#gm.on{display:block}
#gm .bg{position:absolute;max-width:none;pointer-events:none}
#gm .st{position:absolute;left:0;top:0}
#gm .ly{position:absolute;display:block;pointer-events:none;-webkit-user-drag:none}
#gm .tx{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;line-height:1;color:#fff1cb;pointer-events:none;font-weight:900}
#gm .bt{position:absolute;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform 90ms ease-out}
#gm .bt img{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;-webkit-user-drag:none}
#gm .bt.dn{transform:scale(.95)}
#gm .bt .lb{position:absolute;left:0;right:0;top:46%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;gap:.25em;white-space:nowrap;line-height:1;color:#fff1cb;font-weight:900;pointer-events:none}
#gm .gr{position:absolute;display:flex;align-items:center;transform:translate(-50%,-50%);pointer-events:none}
#gm .gr img{display:block;object-fit:contain}
#gm .ttl{transform-origin:50% 60%}
#gm .ttl.in{animation:gmTitle .42s cubic-bezier(.25,1.5,.5,1) both}
#gm .pulse{animation:gmPulse 2.2s ease-in-out infinite}
#gm .nope{animation:gmNope .36s}
@keyframes gmTitle{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.05);opacity:1}100%{transform:none}}
@keyframes gmPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes gmNope{20%,60%{transform:translateX(-3%)}40%,80%{transform:translateX(3%)}}
@media (prefers-reduced-motion: reduce){#gm *{animation:none!important}}`;
document.head.appendChild(css);
const gm=document.createElement('div');gm.id='gm';gm.setAttribute('role','dialog');gm.setAttribute('aria-modal','true');
(document.body?Promise.resolve():new Promise(r=>addEventListener('DOMContentLoaded',r))).then(()=>document.body.appendChild(gm));
const h=(t,c,p)=>{const e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e};
const snd=n=>{try{window.BA&&BA.play&&BA.play(n,{gap:60})}catch(e){}};
// teal outline + soft drop shadow, the same on every live word (built from shadows so it renders identically everywhere)
function outline(px,col='#06454a',drop='#03383c'){const r=Math.max(1,px),a=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2;a.push(`${(Math.cos(t)*r).toFixed(2)}px ${(Math.sin(t)*r).toFixed(2)}px 0 ${col}`)}
 a.push(`0 ${(r*.9).toFixed(2)}px 0 ${col}`,`0 ${(r*1.6).toFixed(2)}px 0 ${drop}`);return a.join(',')}
// ---------- preload: every layer decoded before its screen is shown ----------
const IM={},done={};
function want(k){if(done[k])return done[k];const names=['bg',...Object.keys(L[k])];
 done[k]=Promise.all(names.map(n=>{const src=R+k+'_'+(n=='bg'?'bg':n)+'.webp'+V;const i=new Image();i.decoding='async';i.src=src;IM[k+'/'+n]=i;return (i.decode?i.decode():new Promise(r=>i.onload=r)).catch(()=>{})}));return done[k]}
want('ready');addEventListener('load',()=>setTimeout(()=>{want('pause');want('lose')},1200));
// ---------- layout ----------
let s=1,stage=null,items=[],timers=[],once=false,kind=null;
function fit(){if(!stage)return;const W=innerWidth,H=innerHeight;s=Math.min(W/DW,H/DH);const sb=Math.max(W/DW,H/DH);
 const bg=gm.querySelector('.bg');if(bg)Object.assign(bg.style,{width:DW*sb+'px',height:DH*sb+'px',left:(W-DW*sb)/2+'px',top:(H-DH*sb)/2+'px'});
 Object.assign(stage.style,{width:DW*s+'px',height:DH*s+'px',left:(W-DW*s)/2+'px',top:(H-DH*s)/2+'px'});
 for(const f of items)f()}
addEventListener('resize',fit);
const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
function layer(k,n,cls){const b=L[k][n],im=h('img','ly'+(cls?' '+cls:''),stage);im.src=IM[k+'/'+n]?IM[k+'/'+n].src:R+k+'_'+n+'.webp'+V;im.alt='';im.draggable=false;
 items.push(()=>Object.assign(im.style,{left:b[0]*s+'px',top:b[1]*s+'px',width:b[2]*s+'px',height:b[3]*s+'px'}));return im}
function text(str,x,y,size,o={}){const t=h('div','tx',stage);t.textContent=str;
 items.push(()=>{Object.assign(t.style,{left:x*s+'px',top:y*s+'px',fontSize:size*s+'px',textShadow:outline(size*s*(o.ol||.085),o.col,o.drop)});if(o.color)t.style.color=o.color});return t}
function button(k,n,label,size,fn,o={}){const b=L[k][n],el=h('div','bt',stage);el.setAttribute('role','button');el.setAttribute('aria-label',o.aria||label);
 const im=h('img','',el);im.src=IM[k+'/'+n]?IM[k+'/'+n].src:R+k+'_'+n+'.webp'+V;im.alt='';const lb=h('div','lb',el);
 if(o.html)lb.innerHTML=o.html;else lb.textContent=label;
 for(const n2 of (o.inner||[])){const c=L[k][n2],ii=h('img','',el);ii.src=IM[k+'/'+n2]?IM[k+'/'+n2].src:R+k+'_'+n2+'.webp'+V;ii.alt='';   // icons ride along with their button
  Object.assign(ii.style,{left:(c[0]-b[0])/b[2]*100+'%',top:(c[1]-b[1])/b[3]*100+'%',width:c[2]/b[2]*100+'%',height:c[3]/b[3]*100+'%',right:'auto',bottom:'auto'})}
 items.push(()=>{Object.assign(el.style,{left:b[0]*s+'px',top:b[1]*s+'px',width:b[2]*s+'px',height:b[3]*s+'px'});
  Object.assign(lb.style,{fontSize:size*s+'px',textShadow:outline(size*s*.085),paddingLeft:(o.padL||0)*s+'px',paddingRight:(o.padR||0)*s+'px'})});
 el.addEventListener('pointerdown',()=>el.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,()=>el.classList.remove('dn')));
 el.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn(el)===false){once=false;return}snd('tap')});return el}
function goals(list,cy){const n=list.length,sp=n>2?380:400;list.forEach((go,i)=>{const cx=645+(i-(n-1)/2)*sp;const g=h('div','gr',stage);
  const im=h('img','',g);im.src=window.goalImg?('a/'+goalImg(go)+'.webp'):'';im.alt='';const t=h('div','',g);t.textContent=go.left??go.n;t.style.color='#fff1cb';t.style.lineHeight='1';
  items.push(()=>{Object.assign(g.style,{left:cx*s+'px',top:cy*s+'px',gap:14*s+'px'});Object.assign(im.style,{width:170*s+'px',height:170*s+'px',filter:`drop-shadow(0 ${8*s}px ${8*s}px rgba(30,20,0,.45))`});
   Object.assign(t.style,{fontSize:104*s+'px',textShadow:outline(104*s*.085)})})})}
function open(k,sound){close();once=false;kind=k;gm.innerHTML='';items=[];
 const bg=h('img','bg',gm);bg.src=IM[k+'/bg']?IM[k+'/bg'].src:R+k+'_bg.webp'+V;bg.alt='';stage=h('div','st',gm);
 gm.classList.add('on');snd(sound);return stage}
function show(){fit();const t=gm.querySelector('.ttl');if(t)t.classList.add('in')}
function close(){timers.forEach(clearTimeout);timers=[];gm.classList.remove('on');gm.innerHTML='';stage=null;items=[];kind=null}
// keep the old helpers in step (tests and other code call gpClose)
const oldClose=window.gpClose;window.gpClose=n=>{close();oldClose&&oldClose(n)};
window.GM={close,get kind(){return kind}};
// ---------- READY ----------
window.showIntro=function(){if(window.Eco&&Eco.hearts()<1&&!window.GBB_REVIEW_FREE)return window.gpNoLives&&gpNoLives();
 want('ready').then(()=>{if(typeof S==='undefined'||!S||S.over)return;
  open('ready','popper');const T=S.lv.tier;
  layer('ready','10_rambo');layer('ready','11_mr_bunny');layer('ready','20_title_accents','ttl');layer('ready','21_title','ttl');
  text('Level '+(S.li+1),645,590,104);
  if(T=='H'||T=='SH'){const n=T=='SH'?'32_super_hard_blank':'31_hard_blank';layer('ready',n);
   text(T=='SH'?'SUPER HARD':'HARD',645,720,T=='SH'?44:56,{ol:.07,col:T=='SH'?'#3c1670':'#7a1d12',drop:T=='SH'?'#2a0e50':'#5a140c'})}
  goals(S.goals.map(x=>({...x,left:x.n})),2080);
  text(S.moves+' Moves',645,2250,96);
  const go=button('ready','30_primary_button_blank','PLAY',120,()=>{close();window.say&&say('You got this!');window.hintArm&&hintArm()},{aria:'Play'});
  later(1100,()=>go.classList.add('pulse'));show()})};
// ---------- PAUSED ----------
const STG=()=>{try{return Object.assign({music:70,sounds:80},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{music:70,sounds:80}}};
window.g2pause=function(){if(typeof S==='undefined'||!S||S.over)return;
 want('pause').then(()=>{open('pause','tap');const k='pause';
  layer(k,'11_mr_bunny');layer(k,'10_rambo');layer(k,'20_title_accents','ttl');layer(k,'21_title','ttl');
  const st=STG();
  [['music','Music','50_music_icon','40_music_toggle_on_blank','42_music_toggle_off_blank',1783],['sounds','Sound','51_sound_icon','41_sound_toggle_on_blank','43_sound_toggle_off_blank',1948]].forEach(([key,lab,ic,on,off,y])=>{
   layer(k,ic);text(lab,445,y,80);const a=layer(k,on),b=layer(k,off);let v=st[key]>0;
   const draw=()=>{a.style.visibility=v?'visible':'hidden';b.style.visibility=v?'hidden':'visible'};draw();
   const z=h('div','bt',stage);z.setAttribute('role','switch');z.setAttribute('aria-label',lab);
   items.push(()=>Object.assign(z.style,{left:170*s+'px',top:(y-80)*s+'px',width:960*s+'px',height:160*s+'px'}));
   z.addEventListener('click',e=>{e.stopPropagation();v=!v;if(!v){st['_'+key]=st[key];st[key]=0}else st[key]=st['_'+key]||(key=='music'?70:80);
    try{localStorage.setItem('gbb_settings',JSON.stringify(st))}catch(_){}window.BA&&BA.apply&&BA.apply();draw();z.setAttribute('aria-checked',v);snd('tap')})});
  const moved=S&&S.lv&&S.moves<S.lv.moves;
  button(k,'30_primary_button_blank','RESUME',112,()=>{close()});
  button(k,'31_restart_button_blank','RESTART',66,()=>{if(moved&&window.Eco)Eco.loseHeart();close();if(window.Eco&&Eco.hearts()<1)return window.gpNoLives&&gpNoLives();startLevel(S.li)},{padL:110,inner:['52_restart_icon']});
  button(k,'32_quit_button_blank','QUIT',66,()=>{if(moved&&window.Eco)Eco.loseHeart();close();BA.nav('map.html')},{padL:108,inner:['53_quit_icon']});
  if(moved)text('Restarting or quitting now uses 1 life.',645,2625,40,{ol:.1});
  show()})};
// ---------- OUT OF MOVES ----------
window.lose=function(){S.over=true;window.fx&&window.fx('lose');
 want('lose').then(()=>{open('lose','tap');const k='lose';
  layer(k,'10_rambo');layer(k,'11_mr_cardinal');layer(k,'20_title_accents','ttl');layer(k,'21_title','ttl');layer(k,'22_still_needed_title');
  goals(S.goals.filter(x=>x.left>0),1990);
  const PM=window.Eco?Eco.PRICE.moves:90;
  const p5=button(k,'30_primary_button_blank','',84,el=>{if(window.Eco&&!Eco.spend(PM)){el.classList.remove('pulse','nope');void el.offsetWidth;el.classList.add('nope');window.K&&K.toast&&K.toast('You need '+PM+' bones. You have '+Eco.bones()+'.');return false}close();moreMoves()},
   {aria:'Get 5 more moves for '+PM+' bones',inner:['50_bone_icon'],html:'<span style="position:absolute;left:33.7%;transform:translateX(-50%)">+5 MOVES</span><span style="position:absolute;left:84.5%;transform:translateX(-50%)">'+PM+'</span>'});
  button(k,'31_give_up_button_blank','GIVE UP',70,()=>{window.Eco&&Eco.loseHeart();close();BA.nav('map.html')},{aria:'Give up, costs one life'});
  later(1000,()=>p5.classList.add('pulse'));show()})};
})();

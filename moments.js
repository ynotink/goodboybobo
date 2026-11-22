/* Good Boy Bobo — full-screen "moment" screens (ChatGPT movie-poster art) that replace the old pop-up cards:
   Ready (level start), Paused, Out of Moves. Art is 1290 × 2796 layers; the scene fills the phone, the title,
   characters and buttons keep the art's own layout (scaled as one piece so nothing drifts), and every word or
   number is written live in the game's rounded lettering. */
(function(){
try{const q=new URLSearchParams(location.search);}catch(e){}   // approved: on for everyone
const R='bovo11/mom/',V='?v=16',DW=1290,DH=2796;
const L={"ready":{"10_rambo":[0,1011,1237,902],"11_mr_bunny":[971,1200,274,410],"21_title":[247,252,777,279],"30_primary_button_blank":[6,2325,1284,283],"31_hard_blank":[501,647,287,109],"32_super_hard_blank":[427,647,435,109]},
 "pause":{"10_rambo":[321,844,969,785],"11_mr_bunny":[0,1229,661,404],"21_title":[0,157,1290,471],"52_labels":[179,1719,398,288],"60_warning":[161,2616,968,46],"sw_music_on":[629,1723,631,137],"sw_music_off":[629,1723,631,137],"sw_sound_on":[629,1888,631,136],"sw_sound_off":[629,1888,631,136],"bt_resume":[0,2080,1290,296],"bt_resume_p":[0,2080,1290,296],"bt_restart":[0,2357,822,223],"bt_restart_p":[0,2357,822,223],"bt_quit":[495,2356,795,224],"bt_quit_p":[495,2356,795,224]},
 "fail":{"10_rambo":[0,794,1048,1250],"11_mr_cardinal":[693,1419,517,512],"21_title":[0,234,1290,477],"22_life":[362,623,571,149],"bt_try_again":[0,2029,1290,329],"bt_try_again_p":[0,2029,1290,329],"bt_back_to_map":[8,2336,1275,269],"bt_back_to_map_p":[8,2336,1275,269]},
 "lives":{"10_cuddle":[0,721,1290,1259],"21_title":[0,167,1290,389],"30_timer_panel":[0,1908,1290,245],"bt_refill_lives":[0,2140,1290,289],"bt_refill_lives_p":[0,2140,1290,289],"bt_back_to_map":[2,2409,1287,214],"bt_back_to_map_p":[2,2409,1287,214]},
 "boost":{"10_rambo":[0,580,1209,1550],"21_title":[0,134,1290,546],"22_notice":[187,2124,913,78],"40_paw":[953,594,317,298],"bt_buy":[0,2190,1290,305],"bt_buy_p":[0,2190,1290,305],"bt_not_now":[101,2483,1089,222],"bt_not_now_p":[101,2483,1089,222]},
 "bones":{"10_dig":[0,763,1290,1167],"21_title":[7,319,1277,482],"30_panel":[0,1887,1290,212],"bt_go_to_shop":[0,2091,1290,256],"bt_go_to_shop_p":[0,2091,1290,256],"bt_not_now":[27,2336,1241,216],"bt_not_now_p":[27,2336,1241,216]},
 "lose":{"10_rambo":[0,567,1096,1140],"11_mr_cardinal":[772,1127,443,391],"21_title":[0,146,1290,487],"22_still_needed_title":[250,1728,791,153],"bt_buy_moves":[0,2127,1290,286],"bt_buy_moves_p":[0,2127,1290,286],"bt_give_up":[134,2407,1013,213],"bt_give_up_p":[134,2407,1013,213]}};
const SD={ready_play:1};   // buttons from the Soft Depth kits (pressed art supplied)
const ART={ready_play:[1284,283],_:[1,1]};
const css=document.createElement('style');css.textContent=`
#gm{position:fixed;inset:0;z-index:300;display:none;overflow:hidden;font-family:KNun,BoboNunito,system-ui;-webkit-user-select:none;user-select:none;touch-action:none;background:#2d5a20}
#gm.on{display:block}
#gm .bg{position:absolute;max-width:none;pointer-events:none}
#gm .st{position:absolute;left:0;top:0}
#gm .ly{position:absolute;display:block;pointer-events:none;-webkit-user-drag:none}
#gm .tx{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;line-height:1;color:#fff1cb;pointer-events:none;font-weight:900}
#gm .bt{position:absolute;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform 90ms ease-out}
#gm .bt img{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;-webkit-user-drag:none}
#gm .bt.art img{filter:drop-shadow(0 calc(var(--s)*14px) calc(var(--s)*12px) rgba(40,25,0,.38))}
#gm .tg{position:absolute;pointer-events:none;filter:drop-shadow(0 calc(var(--s)*8px) calc(var(--s)*8px) rgba(30,40,0,.35))}
#gm .bt.dn{transform:scale(.95)}
#gm .bt.sd img{filter:none}#gm .bt.sd2 img{inset:auto;filter:none}#gm .bt.sd2.dn{transform:none}#gm .bt.sd2 .pi{opacity:0}#gm .bt.sd2.dn .pi{opacity:1}#gm .bt.sd2.dn .ni{opacity:0}#gm .bt.sd2.dn .bp{margin-top:calc(var(--s,1)*2px)}#gm .bt.sd.dn{transform:none}#gm .bt.sd .pi{opacity:0}#gm .bt.sd.dn .pi{opacity:1}#gm .bt.sd.dn .ni{opacity:0}
#gm .zn.dn{transform:none;background:rgba(60,20,0,.18)}
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
function want(k){if(done[k])return done[k];const names=['bg',...Object.keys(L[k]),...Object.keys(ART).filter(a=>a.startsWith(k+'_')).map(a=>'btn_'+a)];
 done[k]=Promise.all([window.GBBFont?GBBFont.ready:0].concat(names.map(n=>{const src=(n.startsWith('btn_')?R+n:R+k+'_'+n)+'.webp'+V;const i=new Image();i.decoding='async';i.src=src;IM[k+'/'+n]=i;return (i.decode?i.decode():new Promise(r=>i.onload=r)).catch(()=>{})})));return done[k]}
want('ready');addEventListener('load',()=>setTimeout(()=>{want('pause');want('lose')},1200));
// ---------- layout ----------
let s=1,stage=null,items=[],timers=[],once=false,kind=null;
const FLAT={lives:1,bones:1,boost:1,fail:1,ready:1,pause:1,lose:1};   // scenes painted as one picture: keep the whole picture in view, blurred copy fills any side bars
function fit(){if(!stage)return;const W=innerWidth,H=innerHeight;s=Math.min(W/DW,H/DH);const sb=Math.max(W/DW,H/DH);
 const bg=gm.querySelector('.bg:not(.bgb)'),bb=gm.querySelector('.bgb');const sc=FLAT[kind]?s:sb;
 if(bg)Object.assign(bg.style,{width:DW*sc+'px',height:DH*sc+'px',left:(W-DW*sc)/2+'px',top:(H-DH*sc)/2+'px'});
 if(bb)Object.assign(bb.style,{width:DW*sb+'px',height:DH*sb+'px',left:(W-DW*sb)/2+'px',top:(H-DH*sb)/2+'px'});
 Object.assign(stage.style,{width:DW*s+'px',height:DH*s+'px',left:(W-DW*s)/2+'px',top:(H-DH*s)/2+'px'});
 for(const f of items)f()}
addEventListener('resize',fit);
const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
function layer(k,n,cls){const b=L[k][n],im=h('img','ly'+(cls?' '+cls:''),stage);im.src=IM[k+'/'+n]?IM[k+'/'+n].src:R+k+'_'+n+'.webp'+V;im.alt='';im.draggable=false;
 items.push(()=>Object.assign(im.style,{left:b[0]*s+'px',top:b[1]*s+'px',width:b[2]*s+'px',height:b[3]*s+'px'}));return im}
function text(str,x,y,size,o={}){const t=h('div','tx',stage);
 if(window.GBBFont&&!o.plain){items.push(()=>{Object.assign(t.style,{left:x*s+'px',top:y*s+'px'});let c=size*s*.86;const cv=GBBFont.draw(t,str,c,{style:o.style});if(o.maxW){const w=parseFloat(cv.style.width);if(w>o.maxW*s)GBBFont.draw(t,str,c*o.maxW*s/w,{style:o.style})}});t.set=v=>{str=v;fit()};return t}   // painted lettering
 t.textContent=str;
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
function artButton(k,n,a,fn,aria){const b=L[k][n],[aw,ah]=ART[a],cx=b[0]+b[2]/2,cy=b[1]+b[3]/2,el=h('div','bt art',stage);el.setAttribute('role','button');el.setAttribute('aria-label',aria);
 const im=h('img','',el);im.src=IM[k+'/btn_'+a]?IM[k+'/btn_'+a].src:R+'btn_'+a+'.webp'+V;im.alt='';
 if(SD[a]){el.classList.add('sd');im.classList.add('ni');const pi=h('img','pi',el);pi.src=R+'btn_'+a+'_p.webp'+V;pi.alt=''}
 items.push(()=>{Object.assign(el.style,{left:(cx-aw/2)*s+'px',top:(cy-ah/2)*s+'px',width:aw*s+'px',height:ah*s+'px'});gm.style.setProperty('--s',s)});
 el.addEventListener('pointerdown',()=>el.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,()=>el.classList.remove('dn')));
 el.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn(el)===false){once=false;return}snd('tap')});return el}
function artAt(k,n,a){const b=L[k][n],[aw,ah]=ART[a],cx=b[0]+b[2]/2,cy=b[1]+b[3]/2,im=h('img','tg',stage);im.src=IM[k+'/btn_'+a]?IM[k+'/btn_'+a].src:R+'btn_'+a+'.webp'+V;im.alt='';
 items.push(()=>Object.assign(im.style,{left:(cx-aw/2)*s+'px',top:(cy-ah/2)*s+'px',width:aw*s+'px',height:ah*s+'px'}));return im}
function goals(list,cy){const n=list.length,sp=n>2?380:400;list.forEach((go,i)=>{const cx=645+(i-(n-1)/2)*sp;const g=h('div','gr',stage);
  const im=h('img','',g);im.src=window.goalImg?('a/'+goalImg(go)+'.webp'):'';im.alt='';const t=h('div','',g);const num=String(go.left??go.n);
  if(!window.GBBFont){t.textContent=num;t.style.color='#fff1cb';t.style.lineHeight='1'}
  items.push(()=>{Object.assign(g.style,{left:cx*s+'px',top:cy*s+'px',gap:14*s+'px'});Object.assign(im.style,{width:170*s+'px',height:170*s+'px',filter:`drop-shadow(0 ${8*s}px ${8*s}px rgba(30,20,0,.45))`});
   if(window.GBBFont)GBBFont.draw(t,num,104*s*.9);else Object.assign(t.style,{fontSize:104*s+'px',textShadow:outline(104*s*.085)})})})}
function open(k,sound){close();once=false;kind=k;gm.innerHTML='';items=[];
 const src=IM[k+'/bg']?IM[k+'/bg'].src:R+k+'_bg.webp'+V;if(FLAT[k]){const bb=h('img','bg bgb',gm);bb.src=src;bb.alt='';bb.style.filter='blur(14px) brightness(.85)'}
 const bg=h('img','bg',gm);bg.src=src;bg.alt='';stage=h('div','st',gm);
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
  layer('ready','10_rambo');layer('ready','11_mr_bunny');layer('ready','21_title','ttl');
  text('Level '+(S.li+1),645,590,104);
  if(T=='H'||T=='SH')layer('ready',T=='SH'?'32_super_hard_blank':'31_hard_blank');   // badge lettering is part of the Soft Depth art)}
  goals(S.goals.map(x=>({...x,left:x.n})),2080);
  text(S.moves+' Moves',645,2250,96);
  const go=artButton('ready','30_primary_button_blank','ready_play',()=>{close();window.say&&say('You got this!');window.hintArm&&hintArm()},'Play');
  later(1100,()=>go.classList.add('pulse'));show()})};
// ---------- PAUSED ----------
const STG=()=>{try{return Object.assign({music:70,sounds:80},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{music:70,sounds:80}}};
window.g2pause=function(){if(typeof S==='undefined'||!S||S.over)return;
 want('pause').then(()=>{open('pause','tap');const k='pause';
  layer(k,'11_mr_bunny');layer(k,'10_rambo');layer(k,'21_title','ttl');layer(k,'52_labels');
  const st=STG();
  [['music','sw_music','Music',[778,1734,326,98]],['sounds','sw_sound','Sound',[778,1899,326,97]]].forEach(([key,n,lab,tb])=>{
   const a=layer(k,n+'_on'),b=layer(k,n+'_off');let v=st[key]>0;
   const draw=()=>{a.style.visibility=v?'visible':'hidden';b.style.visibility=v?'hidden':'visible';z.setAttribute('aria-checked',v)};
   const z=h('div','bt',stage);z.setAttribute('role','switch');z.setAttribute('aria-label',lab);draw();
   items.push(()=>Object.assign(z.style,{left:170*s+'px',top:(tb[1]-30)*s+'px',width:(tb[0]+tb[2]-170)*s+'px',height:(tb[3]+60)*s+'px'}));   // the whole row flips it
   z.addEventListener('click',e=>{e.stopPropagation();v=!v;if(!v){st['_'+key]=st[key];st[key]=0}else st[key]=st['_'+key]||(key=='music'?70:80);
    try{localStorage.setItem('gbb_settings',JSON.stringify(st))}catch(_){}window.BA&&BA.apply&&BA.apply();draw();snd('tap')})});
  const moved=S&&S.lv&&S.moves<S.lv.moves;
  sdBtn(k,'bt_resume',[87,2094,1116,249],()=>{close()},'Resume');
  sdBtn(k,'bt_restart',[64,2371,577,179],()=>{if(moved&&window.Eco)Eco.loseHeart();close();if(window.Eco&&Eco.hearts()<1)return window.gpNoLives&&gpNoLives();startLevel(S.li)},'Restart');
  sdBtn(k,'bt_quit',[663,2370,546,182],()=>{if(moved&&window.Eco)Eco.loseHeart();close();BA.nav('map.html')},'Quit');
  if(moved)layer(k,'60_warning');
  show()})};
// Soft Depth kit button: art (shadow baked in) at its own box, taps only inside the kit's tap box, pressed art swaps in
function sdBtn(k,n,tb,fn,aria){const b=L[k][n],el=h('div','bt sd2',stage);el.setAttribute('role','button');el.setAttribute('aria-label',aria);
 const mk=(nn,c)=>{const i=h('img',c,el);i.src=IM[k+'/'+nn]?IM[k+'/'+nn].src:R+k+'_'+nn+'.webp'+V;i.alt='';
  Object.assign(i.style,{left:(b[0]-tb[0])/tb[2]*100+'%',top:(b[1]-tb[1])/tb[3]*100+'%',width:b[2]/tb[2]*100+'%',height:b[3]/tb[3]*100+'%'});return i};
 mk(n,'ni');mk(n+'_p','pi');
 items.push(()=>Object.assign(el.style,{left:tb[0]*s+'px',top:tb[1]*s+'px',width:tb[2]*s+'px',height:tb[3]*s+'px'}));
 el.addEventListener('pointerdown',()=>el.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,()=>el.classList.remove('dn')));
 el.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn(el)===false){once=false;return}snd('tap')});return el}
// ---------- OUT OF MOVES ----------
window.lose=function(again){S.over=true;if(!again)window.fx&&window.fx('lose');
 want('lose').then(()=>{open('lose','tap');const k='lose';
  layer(k,'10_rambo');layer(k,'11_mr_cardinal');layer(k,'21_title','ttl');layer(k,'22_still_needed_title');
  goals(S.goals.filter(x=>x.left>0),1994);
  const PM=window.Eco?Eco.PRICE.moves:90;   // the 90 is painted on the Soft Depth button (matches Eco.PRICE.moves)
  const buy=el=>{if(window.Eco&&!Eco.spend(PM)){el.classList.remove('pulse','nope');void el.offsetWidth;close();needBones(PM,()=>lose(1));return}close();moreMoves()};
  const p5=sdBtn(k,'bt_buy_moves',[75,2142,1144,240],buy,'Get 5 more moves for '+PM+' bones');
  sdBtn(k,'bt_give_up',[301,2422,688,167],()=>{window.Eco&&Eco.loseHeart();showFail()},'Give up, costs one life');
  later(1000,()=>p5.classList.add('pulse'));show()})};

// ---------- painted-word buttons (words are part of the art) ----------
function imgButton(k,n,fn,aria){const b=L[k][n],el=h('div','bt art',stage);el.setAttribute('role','button');el.setAttribute('aria-label',aria);
 const im=h('img','',el);im.src=IM[k+'/'+n]?IM[k+'/'+n].src:R+k+'_'+n+'.webp'+V;im.alt='';
 items.push(()=>{Object.assign(el.style,{left:b[0]*s+'px',top:b[1]*s+'px',width:b[2]*s+'px',height:b[3]*s+'px'});gm.style.setProperty('--s',s)});
 el.addEventListener('pointerdown',()=>el.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,()=>el.classList.remove('dn')));
 el.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn(el)===false){once=false;return}snd('tap')});return el}
// a live word painted ON a button (price), centred at x,y in art pixels, riding along with the button when pressed
function onButton(el,k,n,str,x,y,cap){const b=L[k][n],t=h('div','tx',el);items.push(()=>{Object.assign(t.style,{left:(x-b[0])*s+'px',top:(y-b[1])*s+'px'});GBBFont&&GBBFont.draw(t,str,cap*s,{style:'button'})});return t}
// ---------- LEVEL FAILED ("So Close!") ----------
window.showFail=function(){if(typeof S!=='undefined'&&S)S.over=true;
 want('fail').then(()=>{open('fail','tap');const k='fail';
  layer(k,'10_rambo');layer(k,'11_mr_cardinal');layer(k,'21_title','ttl');layer(k,'22_life');
  const t=sdBtn(k,'bt_try_again',[153,2045,979,284],()=>{close();if(window.Eco&&Eco.hearts()<1)return gpNoLives();startLevel(S.li)},'Try again');
  sdBtn(k,'bt_back_to_map',[205,2352,878,230],()=>{close();BA.nav('map.html')},'Back to map');
  later(1000,()=>t.classList.add('pulse'));show()})};
// ---------- OUT OF LIVES ----------
window.gpNoLives=function(){if(typeof S!=='undefined'&&S)S.over=true;
 want('lives').then(()=>{open('lives','tap');const k='lives',PL=window.Eco?Eco.PRICE.lives:90;   // the 90 is painted on the Soft Depth button (matches Eco.PRICE.lives)
  layer(k,'10_cuddle');layer(k,'21_title','ttl');layer(k,'30_timer_panel');
  const tm=text('Next life in --:--',641,2032,104,{maxW:860,style:'ink'});
  const tick=()=>{if(kind!=='lives'||!window.Eco)return;if(Eco.hearts()>0){close();if(S)S.over=false;showIntro();return}tm.set('Next life in '+Eco.fmt(Eco.nextIn()));later(1000,tick)};
  const p=sdBtn(k,'bt_refill_lives',[62,2156,1165,250],()=>{if(!Eco.spend(PL)){close();needBones(PL,()=>gpNoLives());return}Eco.refillHearts();close();if(S)S.over=false;showIntro()},'Refill lives for '+PL+' bones');
  sdBtn(k,'bt_back_to_map',[239,2425,812,175],()=>{close();BA.nav('map.html')},'Back to map');
  later(1000,()=>p.classList.add('pulse'));show();tick()})};
// ---------- GET A BOOSTER ----------
const BN=['Paw Tap','Free Swap','Bomb','Shuffle'],BI=['bst_paw','bst_swap','bst_bomb','bst_shuffle'];
function zoneAt(x,y,w,hh,fn,aria){const el=h('div','bt zn',stage);el.addEventListener('pointerdown',()=>el.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(e=>el.addEventListener(e,()=>el.classList.remove('dn')));el.setAttribute('role','button');el.setAttribute('aria-label',aria);
 items.push(()=>Object.assign(el.style,{left:x*s+'px',top:y*s+'px',width:w*s+'px',height:hh*s+'px',borderRadius:hh*s/2+'px'}));
 el.addEventListener('click',e=>{e.stopPropagation();if(once)return;once=true;if(fn(el)===false){once=false;return}snd('tap')});return el}
window.gpBuy=function(bk){want('boost').then(()=>{open('boost','tap');const k='boost',P=window.Eco?Eco.PRICE.boost[bk]:50;
  layer(k,'10_rambo');layer(k,'21_title','ttl');layer(k,'22_notice');
  // the booster beside Bobo's raised paw (Paw Tap uses ChatGPT's own art), its name under it
  if(bk===0)layer(k,'40_paw');else{const ic=h('img','ly',stage);ic.src='uikit/'+BI[bk]+'.webp?v=1';ic.alt='';
   items.push(()=>Object.assign(ic.style,{left:959*s+'px',top:600*s+'px',width:305*s+'px',height:286*s+'px',objectFit:'contain',filter:`drop-shadow(0 ${10*s}px ${10*s}px rgba(30,20,0,.4))`}))}
  text(BN[bk],1102,971,96,{maxW:370});
  const b=sdBtn(k,'bt_buy',[111,2209,1069,261],()=>{if(!Eco.spend(P)){close();needBones(P,()=>gpBuy(bk));return}
    if(typeof SAVE!=='undefined'&&SAVE.boost){SAVE.boost[bk]=(SAVE.boost[bk]||0)+1;typeof save==='function'&&save()}else Eco.addBoost(bk,1);window.drawBoosters&&drawBoosters();close()},'Buy one '+BN[bk]+' for '+P+' bones');
  const pr=h('div','tx bp',b);items.push(()=>{Object.assign(pr.style,{left:(955-111)/1069*100+'%',top:(2324-2209)/261*100+'%'});GBBFont&&GBBFont.draw(pr,String(P),104*s,{style:'button'})});   // live price rides with the button
  sdBtn(k,'bt_not_now',[302,2502,686,166],()=>{close()},'Not now');
  later(1000,()=>b.classList.add('pulse'));show()})};
// ---------- NOT ENOUGH BONES ----------
window.needBones=function(need,back){want('bones').then(()=>{open('bones','tap');const k='bones',have=window.Eco?Eco.bones():0;
  layer(k,'10_dig');layer(k,'21_title','ttl');layer(k,'30_panel');
  text('You have '+have+' / need '+need,645,1998,92,{maxW:860,style:'ink'});
  const g=sdBtn(k,'bt_go_to_shop',[191,2109,909,217],()=>{close();BA.nav('bovo11/shop.html')},'Go to shop');
  sdBtn(k,'bt_not_now',[261,2354,770,159],()=>{close();back&&back()},'Not now');
  later(1000,()=>g.classList.add('pulse'));show()})};
// ---------- BANNERS over the board ----------
const bcss=document.createElement('style');bcss.textContent=`#gmb{position:fixed;left:50%;top:40%;z-index:250;pointer-events:none;transform:translate(-50%,-50%);width:min(88vw,430px);opacity:0}
#gmb img{display:block;width:100%;height:auto}
#gmb.on{animation:gmBan 1.5s cubic-bezier(.25,1.4,.5,1) both}
@keyframes gmBan{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}14%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}22%{transform:translate(-50%,-50%) scale(1)}82%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-60%) scale(.96)}}`;document.head.appendChild(bcss);
const BAN={shuffle:'08a',bonus:'08b',tap:'08c'};Object.values(BAN).forEach(n=>{const i=new Image();i.src=R+'banner_'+n+'.webp'+V});
window.gmBanner=function(n){let b=document.getElementById('gmb');if(!b){b=document.createElement('div');b.id='gmb';document.body.appendChild(b)}
 b.innerHTML='<img alt="" src="'+R+'banner_'+BAN[n]+'.webp'+V+'">';b.classList.remove('on');void b.offsetWidth;b.classList.add('on')};
const _toast=window.toast;window.toast=function(t){if(/^No moves/i.test(t))return gmBanner('shuffle');if(/^Bobo Bonus/i.test(t))return gmBanner('bonus');return _toast&&_toast(t)};
{let last=-1;setInterval(()=>{const k=(typeof S!=='undefined'&&S)?(S.booster??-1):-1;if(k!==last){if(k>=0&&k<3)gmBanner('tap');last=k}},120)}
})();

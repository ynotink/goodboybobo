/* Good Boy Bobo — approved gameplay skin (8x8) + approved pop-ups.
   All art is the approved ChatGPT delivery; this file only places it and draws the live values. */
(function(){
const A='a/g2/',W=1290,H=2796,KC=390/1290;
const $=id=>document.getElementById(id),app=$('app');
let POP=null,PM=null;fetch(A+'popups.json').then(r=>r.json()).then(j=>POP=j);fetch(A+'panels.json').then(r=>r.json()).then(j=>PM=j);
const font=new FontFace('BoboNunito','url(a/home/Nunito-Black.ttf)',{weight:'900'});font.load().then(f=>{document.fonts.add(f);hud&&drawHud()});

// ---- styles: hide the old HUD, keep the engine
const css=document.createElement('style');css.textContent=`
#bgA,#bgB,#tint,#calm,#topw,#lvs,#pz,#bsts,#brks,#bub,#btip,#sb{display:none!important}
#tiles,#tiles .tile{background:none!important;filter:none!important;box-shadow:none!important}
#g2top{position:absolute;left:0;width:390px;background:url(${A}game_empty.webp) center top/390px ${H*KC}px;transform:scaleY(-1);z-index:0}
#g2skin{position:absolute;left:0;width:390px;height:${H*KC}px;background:url(${A}game_empty.webp) 0 0/100% 100%;z-index:0}
#board{z-index:2}
#g2hud,#g2ui{position:absolute;left:0;width:390px;height:${H*KC}px;z-index:4;pointer-events:none}
#g2ui .h{position:absolute;pointer-events:auto;cursor:pointer;border-radius:12px}
#g2ui .h.sel{box-shadow:0 0 0 3px #fff6b0,0 0 14px 6px rgba(255,230,90,.9);background:rgba(255,240,150,.18)}
.pc>img:first-child{width:105.7%!important;height:105.7%!important;max-width:none!important;flex:none;filter:none!important;rotate:0deg!important}
.pc.blk>img{width:100%!important;height:100%!important}
.pc{scale:1 ${136/142}}
.pc .lsh{inset:0!important;width:100%!important;height:100%!important;opacity:.95}
.pc.sp>img:first-child{animation:g2sp 1.6s ease-in-out infinite}
@keyframes g2sp{50%{filter:drop-shadow(0 0 4px #fff6b0) brightness(1.08)}}
#g2pop{position:absolute;left:0;top:0;width:390px;z-index:60;background:rgba(0,18,24,.69);opacity:0;pointer-events:none;transition:opacity .22s}
#g2pop.on{opacity:1;pointer-events:auto}
#g2pop .st{position:absolute;left:0;width:390px;height:${H*KC}px}
#g2pop img,#g2pop canvas{position:absolute;display:block}
#g2pop .b{cursor:pointer;transition:transform .08s}
#g2pop .card{position:absolute;inset:0;transform:scale(.85);opacity:0;transition:transform .32s cubic-bezier(.3,1.5,.5,1),opacity .2s}
#g2pop.on .card{transform:none;opacity:1}
#g2cel{position:absolute;left:0;top:0;width:390px;z-index:61;background:url(${A}celebrate.webp) center bottom/390px ${H*KC}px no-repeat,#0a86f7;opacity:0;pointer-events:none;transition:opacity .35s}
#g2cel.on{opacity:1;pointer-events:auto}`;
document.head.appendChild(css);
const mk=(id,cls)=>{const d=document.createElement('div');d.id=id;if(cls)d.className=cls;return d};
const top=mk('g2top'),skin=mk('g2skin'),hudBox=mk('g2hud'),ui=mk('g2ui'),pop=mk('g2pop'),cel=mk('g2cel');
app.prepend(skin);app.prepend(top);app.appendChild(hudBox);app.appendChild(ui);app.appendChild(pop);app.appendChild(cel);
const hud=document.createElement('canvas');hudBox.appendChild(hud);Object.assign(hud.style,{position:'absolute',left:0,top:0,width:'390px',height:H*KC+'px'});

// ---- toys per chapter (5 per board; every toy rotates in)
const SETS=[['paw','tennis','rope','ring','squeaky_bone'],['paw','rubber_ball','natural_bone','tennis','rope'],['rubber_ball','tennis','rope','ring','squeaky_bone']];
let TOYS=SETS[0];
window.g2level=()=>{TOYS=SETS[(S.lv.ch||0)%SETS.length];drawHud();allCells().forEach(c=>{if(c.p&&c.p.el)drawPiece(c.p)})};
const toySrc=t=>A+(TOYS[t]||'tennis')+'.webp';
window.drawPiece=function(p){const el=p.el;
 if(p.blk){el.className='pc blk';const b=p.blk;el.innerHTML=`<img src="${A}${b.k=='crate'?(b.hp>1?'crate_full':'crate_cracked'):(b.hp>1?'mud_full':'mud_partial')}.webp">`;return}
 el.className='pc'+(p.sp?' sp':'');let src;
 if(p.carrot)src=A+'carrot.webp';
 else if(p.sp=='row'||p.sp=='col')src=A+(TOYS[p.dc]||TOYS[0])+(p.sp=='row'?'_row_blast':'_column_blast')+'.webp';
 else if(p.sp)src=A+{bomb:'bomb',flyer:'flyer',rainbow:'rainbow'}[p.sp]+'.webp';
 else src=toySrc(p.t);
 el.innerHTML=`<img src="${src}">`+(p.tied?`<img class="lsh" src="${A}leash.webp">`:'')};
window.goalImg=g=>g.k=='piece'?'g2/'+(TOYS[g.t]||'tennis'):g.k=='crate'?'g2/crate_full':g.k=='dirt'?'g2/mud_full':g.k=='tied'?'g2/leash':'g2/carrot';
const goalSrc=g=>'a/'+goalImg(g)+'.webp';

// ---- live gameplay values (approved spec: Nunito Black, #005156)
const IMG={};const img=s=>{if(!IMG[s]){IMG[s]=new Image();IMG[s].onload=()=>drawHud();IMG[s].src=s}return IMG[s]};
function txt(g,t,[x,y,w,h],fs,align='center',fill='#005156'){g.font=`900 ${fs}px BoboNunito`;g.fillStyle=fill;g.textBaseline='alphabetic';
 const m=g.measureText(t);const by=y+h/2+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;
 if(align=='left'){g.textAlign='left';g.fillText(t,x,by)}else{g.textAlign='center';g.fillText(t,x+w/2,by)}}
function check(g,cx,cy,s){g.save();g.lineCap=g.lineJoin='round';g.strokeStyle='#1f9a2a';g.lineWidth=s*.22;g.beginPath();g.moveTo(cx-s*.35,cy);g.lineTo(cx-s*.08,cy+s*.28);g.lineTo(cx+s*.4,cy-s*.3);g.stroke();g.restore()}
function contain(g,im,x,y,w,h){if(!im.complete||!im.naturalWidth)return;const k=Math.min(w/im.naturalWidth,h/im.naturalHeight);const iw=im.naturalWidth*k,ih=im.naturalHeight*k;g.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih)}
let lastSel=-2;
function drawHud(){if(typeof S==='undefined'||!S||!S.goals)return;const r=(window.G2K||1)*KC*devicePixelRatio;
 hud.width=Math.round(W*r);hud.height=Math.round(H*r);const g=hud.getContext('2d');g.setTransform(r,0,0,r,0,0);
 txt(g,String(S.li+1),[687,362,112,61],57,'left');
 txt(g,String(Math.max(0,S.moves)),[548,501,203,139],S.moves>99?120:154,'center',S.moves<=5?'#c0392b':'#005156');
 const n=S.goals.length,x0=140,x1=488,sw=(x1-x0)/n;
 S.goals.forEach((go,i)=>{const cx=x0+sw*i+sw/2,isz=Math.min(128,sw-14);contain(g,img(goalSrc(go)),cx-isz/2,580-isz/2,isz,isz);
  if(go.left>0)txt(g,String(go.left),[cx-sw/2,663,sw,71],n>2?60:74);else check(g,cx,698,52)});
 [[192,2335],[458,2335],[719,2335],[982,2335]].forEach(([x,y],k)=>{const v=SAVE.boost[k];txt(g,v?String(v):'+',[x,y,120,67],69)});
 const sel=S.booster??-1;if(sel!==lastSel){lastSel=sel;ui.querySelectorAll('.bh').forEach((e,k)=>e.classList.toggle('sel',k===sel))}}
const _dm=window.drawMoves,_dg=window.drawGoals,_db=window.drawBoosters;
window.drawMoves=function(){_dm&&_dm.apply(this,arguments);drawHud()};
window.drawGoals=function(){_dg&&_dg.apply(this,arguments);drawHud()};
window.drawBoosters=function(){_db&&_db.apply(this,arguments);drawHud()};
setInterval(()=>{if(typeof S!=='undefined'&&S&&(S.booster??-1)!==lastSel)drawHud()},150);
// tap areas (approved pixel boxes)
const hit=(b,fn,cls='h')=>{const d=document.createElement('div');d.className=cls;Object.assign(d.style,{left:b[0]*KC+'px',top:b[1]*KC+'px',width:b[2]*KC+'px',height:b[3]*KC+'px'});d.onclick=fn;ui.appendChild(d);return d};
[[126,2162,263,259],[391,2162,265,259],[656,2162,266,259],[922,2162,265,259]].forEach((b,k)=>hit(b,()=>useBooster(k),'h bh'));
hit([98,2481,125,121],()=>showPause());hit([1073,220,125,123],()=>showPause());

window.g2fit=()=>{const off=window.G2OFF||0;top.style.top='0px';top.style.height=off+'px';
 [skin,hudBox,ui].forEach(e=>e.style.top=off+'px');pop.style.height=app.style.height;cel.style.height=app.style.height;
 pop.querySelectorAll('.st').forEach(e=>e.style.top=off+'px');drawHud()};
g2fit();

// ---- pop-ups (approved v4 runtime pieces)
const ST=(()=>{try{return Object.assign({music:70,sounds:80},JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){return{music:70,sounds:80}}})();
const saveST=()=>{try{localStorage.setItem('gbb_settings',JSON.stringify(ST))}catch(e){};window.BA&&BA.apply()};
function paintField(g,f,text){const F=POP.font;g.save();g.font=`900 ${f.font_size}px BoboNunito`;g.textBaseline='alphabetic';g.lineJoin='round';
 const cx=f.box[0]+f.box[2]/2,y=f.alphabetic_baseline_y??(f.box[1]+f.box[3]*.75);
 const chars=Array.from(text),gap=f.font_size*(f.letter_spacing_em||0);let offs,start;
 if(!f.letter_spacing_em){g.textAlign='center';offs=[0];start=cx;chars.splice(0,chars.length,text)}
 else{g.textAlign='left';offs=chars.map((c,i)=>{let o=0;for(let j=1;j<=i;j++)o+=((f.optical_pair_spacing_em||{})[chars[j-1]+chars[j]]||0)*f.font_size;return g.measureText(chars.slice(0,i+1).join('')).width-g.measureText(c).width+i*gap+o});
  let l=1e9,r=-1e9;chars.forEach((c,i)=>{if(!c.trim())return;const m=g.measureText(c);l=Math.min(l,offs[i]-m.actualBoundingBoxLeft-1);r=Math.max(r,offs[i]+m.actualBoundingBoxRight+3)});start=cx-(l+r)/2}
 const pass=(fill,stroke,lw,dx,dy)=>{g.fillStyle=fill;g.strokeStyle=stroke;g.lineWidth=lw*2;chars.forEach((c,i)=>{g.strokeText(c,start+offs[i]+dx,y+dy);g.fillText(c,start+offs[i]+dx,y+dy)})};
 pass(F.shadow.fill,F.shadow.fill,F.shadow.stroke_width,1,4);pass(F.fill,F.main_stroke.color,F.main_stroke.width,0,0);g.restore()}
function openPop(name,build){if(!POP||!PM){setTimeout(()=>openPop(name,build),120);return}
 pop.innerHTML='';const st=document.createElement('div');st.className='st';st.style.top=(window.G2OFF||0)+'px';pop.appendChild(st);
 const card=document.createElement('div');card.className='card';st.appendChild(card);
 const put=(src,[x,y,w,h])=>{const i=new Image();i.src=src;Object.assign(i.style,{left:x*KC+'px',top:y*KC+'px',width:w*KC+'px',height:h*KC+'px'});card.appendChild(i);return i};
 put(A+'P_'+name+'.webp',PM['P_'+name]);
 const P=POP.popups[name],cv=document.createElement('canvas'),r=(window.G2K||1)*KC*devicePixelRatio;
 cv.width=Math.round(W*r);cv.height=Math.round(H*r);Object.assign(cv.style,{left:0,top:0,width:'390px',height:H*KC+'px',pointerEvents:'none'});
 const g=cv.getContext('2d');g.setTransform(r,0,0,r,0,0);
 const btn=(key,fn)=>{const b=P.button_specs[key];const n=put(A+key+'_normal.webp',b.normal.asset_box),p=put(A+key+'_pressed.webp',b.pressed.asset_box);p.style.visibility='hidden';
  const hb=document.createElement('div');hb.className='b';Object.assign(hb.style,{position:'absolute',left:b.hit_box[0]*KC+'px',top:b.hit_box[1]*KC+'px',width:b.hit_box[2]*KC+'px',height:b.hit_box[3]*KC+'px'});
  const dn=()=>{n.style.visibility='hidden';p.style.visibility='visible'},up=()=>{n.style.visibility='visible';p.style.visibility='hidden'};
  hb.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(e=>hb.addEventListener(e,up));
  hb.onclick=()=>{window.BA&&BA.play&&BA.play('tap',{gap:80});fn()};card.appendChild(hb)};
 build({P,g,put,btn,card});card.appendChild(cv);requestAnimationFrame(()=>pop.classList.add('on'))}
function closePop(){pop.classList.remove('on');setTimeout(()=>{if(!pop.classList.contains('on'))pop.innerHTML=''},250)}
function goalSlots(P,goals,g,put,yIcon,yText,fs){const n=goals.length;
 const xs=n==2?P.goal_slots.map(s=>s.box[0]):n==1?[517]:goals.map((_,i)=>345+i*300-128);
 goals.forEach((go,i)=>{const sz=n>2?220:256,x=xs[i]+(256-sz)/2;put(goalSrc(go),[x,yIcon+(256-sz)/2,sz,sz]);
  const f=Object.assign({},P.fields.goal_1,{box:[x+sz/2-135,yText,270,130],alphabetic_baseline_y:yText+104});paintField(g,f,String(go.left??go.n))})}
window.showIntro=function(){openPop('Ready_to_Play',({P,g,put,btn})=>{
 paintField(g,P.fields.level,'Level '+(S.li+1));goalSlots(P,S.goals.map(x=>({...x,left:x.n})),g,put,1130,1400);
 paintField(g,P.fields.moves,String(S.moves));btn('play',()=>{closePop();window.say&&say('You got this!');hintArm()})})};
function showPause(){if(typeof S==='undefined'||!S||S.over)return;openPop('Pause',({P,g,put,btn,card})=>{
 btn('resume',closePop);btn('restart',()=>{closePop();startLevel(S.li)});btn('quit_map',()=>BA.nav('map.html'));
 [['music','music'],['sound','sounds']].forEach(([k,sk])=>{const t=P.toggles[k];const on=put(A+'Settings_Toggle_on.webp',t.box),off=put(A+'Settings_Toggle_off.webp',t.box);
  const show=()=>{on.style.visibility=ST[sk]>0?'visible':'hidden';off.style.visibility=ST[sk]>0?'hidden':'visible'};show();
  const hb=document.createElement('div');hb.className='b';Object.assign(hb.style,{position:'absolute',left:(t.box[0]-40)*KC+'px',top:(t.box[1]-30)*KC+'px',width:(t.box[2]+80)*KC+'px',height:(t.box[3]+60)*KC+'px'});
  hb.onclick=()=>{if(ST[sk]>0){ST['_'+sk]=ST[sk];ST[sk]=0}else ST[sk]=ST['_'+sk]||(sk=='music'?70:80);saveST();show()};card.appendChild(hb)})})}
window.g2pause=showPause;
window.lose=function(){S.over=true;clearTimeout(hintT);window.fx&&fx('lose');
 openPop('Out_of_Moves',({P,g,put,btn})=>{goalSlots(P,S.goals.filter(x=>x.left>0),g,put,920,1190);paintField(g,P.fields.moves,'0 Moves Left');
  btn('plus5',()=>{closePop();moreMoves()});btn('quit',()=>BA.nav('map.html'))})};
window.moreMoves=function(){S.over=false;S.busy=false;S.moves+=5;drawMoves();hintArm()};
const _win=window.win;
window.win=async function(){
 // reuse the engine's bonus sequence, then the approved celebration + results
 const _show=window.showOv;window.showOv=()=>{};await _win();window.showOv=_show;
 const kk=S.score/target3(),stars=kk>=1?3:kk>=.65?2:1;
 const bones=10*stars;try{const G0=JSON.parse(localStorage.getItem('gbb')||'{}');const GG=typeof G!=='undefined'?G:{};G0.bones=(G0.bones!=null?+G0.bones:(+GG.bones||430))+bones;G0.hearts=G0.hearts??(GG.hearts??3);localStorage.setItem('gbb',JSON.stringify(G0));GG.bones=G0.bones}catch(e){}
 cel.classList.add('on');let done=false;const go=()=>{if(done)return;done=true;cel.classList.remove('on');results(stars,bones)};cel.onclick=go;setTimeout(go,2400)};
function results(stars,bones){openPop('Win_Results',({P,g,put,btn})=>{
 put(A+'P_Win_Rambo.webp',PM.P_Win_Rambo);
 P.medals.forEach((m,i)=>put(A+(i<stars?'medal_on_Display':'medal_off_Display')+'.webp',m.box));
 paintField(g,P.fields.level,'Level '+(S.li+1)+' Complete!');
 const t='+'+bones.toLocaleString('en-US');g.font='900 105px BoboNunito';const adv=g.measureText(t).width;const ix=Math.round(645-(172+28+adv)/2);
 put(A+'bone_icon_Display.webp',[ix,1955,172,160]);paintField(g,Object.assign({},P.fields.bones,{box:[ix+200,1955,adv,160]}),t);
 const next=S.li+1<LEVELS.length;btn('continue',()=>{closePop();next?startLevel(S.li+1):BA.nav('map.html')});btn('replay',()=>{closePop();startLevel(S.li)})})}
})();

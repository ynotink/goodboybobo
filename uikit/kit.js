/* Good Boy Bobo — shared UI kit helpers (buttons, toggles, counters, toast, haptics). */
(function(){
const base=document.currentScript.src.replace(/kit\.js.*$/,'');
const K=window.K={base};
const h=(tag,cls,parent)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(parent)parent.appendChild(e);return e};
K.h=h;
K.img=(name,cls,parent)=>{const i=h('img',cls,parent);i.src=base+name+'.webp?v=1';i.alt='';return i};
K.settings=()=>{let s={music:70,sounds:80,barks:1,vib:1,hints:1};try{Object.assign(s,JSON.parse(localStorage.getItem('gbb_settings')||'{}'))}catch(e){}return s};
K.buzz=(ms=12)=>{if(window.buzz)return window.buzz(ms);if(K.settings().vib&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}};
K.toast=m=>{let t=document.getElementById('ktoast');if(!t){t=h('div','',document.body);t.id='ktoast'}t.textContent=m;t.classList.add('on');clearTimeout(K.toast.t);K.toast.t=setTimeout(()=>t.classList.remove('on'),1600)};
// press feel for any element: squash while held, springy bounce on release, then fn
K.press=(el,fn)=>{let down=false;if(!el.classList.contains('k-btn'))el.classList.add('k-pr');
 el.addEventListener('pointerdown',e=>{down=true;el.classList.remove('up');el.classList.add('dn');K.buzz(8)});
 const end=go=>{if(!down)return;down=false;el.classList.remove('dn');void el.offsetWidth;el.classList.add('up');if(go&&fn)setTimeout(fn,go===2?0:110)};
 el.addEventListener('pointerup',()=>end(1));el.addEventListener('pointerleave',()=>end(0));el.addEventListener('pointercancel',()=>end(0));
 el.addEventListener('animationend',()=>el.classList.remove('up'));return el};
// a kit button: art = 'green_sm' etc. (has a pressed _p twin), label text, shine on/off
// new modern parts (ui2): old art names map onto them. s = source slice px, r = corner as share of the button height
const U2=base.replace(/uikit\/$/,'ui2/');
const MAP={green_big:['btn_wide',70,.5],green_med:['btn_pill',50,.5],green_sm:['btn_pill',50,.5],cream_big:['btn_cream',70,.5],cream_sm:['btn_cream',70,.5],booster:['sq_cream',44,.3],round:['round_cream',0,0]};
K.MAP=MAP;K.U2=U2;
const s9=(b,src,sl,r)=>{const d=h('div','k-art',b);if(!sl){d.style.background=`url(${U2}${src}.webp?v=1) center/100% 100% no-repeat`;return d}
 d.style.borderStyle='solid';d.style.borderImage=`url(${U2}${src}.webp?v=1) ${sl} fill / var(--bh) stretch`;d.style.boxSizing='border-box';return d};
const fitR=(b,r)=>{const f=()=>{const hh=b.offsetHeight||40;b.style.setProperty('--bh',Math.max(4,Math.min(hh*r,(b.offsetWidth||hh)*.5)-.5)+'px')};f();try{new ResizeObserver(f).observe(b)}catch(e){addEventListener('resize',f)}requestAnimationFrame(f)};
K.s9=(el,art)=>{const m=MAP[art]||[art,44,.3];const d=s9(el,m[0],m[1],m[2]);fitR(el,m[2]||.3);return d};
K.button=(art,label,fn,opt={})=>{const b=h('div','k-btn');const m=MAP[art];
 if(m){const n=s9(b,m[0],m[1],m[2]);n.classList.add('n');const pp=s9(b,m[0]+'_p',m[1],m[2]);pp.classList.add('p');b.classList.add('u2',/^cream|booster|round/.test(art)?'u2c':'u2o');fitR(b,m[2]||.5)}
 else{K.img(art,'k-art n',b);K.img(art+'_p','k-art p',b)}
 if(opt.shine){const s=h('div','k-shine',b);const m=`url(${MAP[art]?U2+MAP[art][0]:base+art}.webp?v=1)`;s.style.webkitMaskImage=m;s.style.maskImage=m;if(opt.delay)s.style.setProperty('--sd',opt.delay)}
 if(label){const l=h('div','k-lbl',b);l.textContent=label}
 b.setAttribute('role','button');b.tabIndex=0;if(opt.aria||label)b.setAttribute('aria-label',opt.aria||label);
 b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn&&fn()}});
 return K.press(b,fn)};
// a toggle: get() -> bool, set(bool)
K.toggle=(on,onChange)=>{const t=h('div','k-tg'+(on?'':' is-off'));K.img('toggle_on','on',t);K.img('toggle_off','off',t);K.img('toggle_knob','knob',t);
 t.setAttribute('role','switch');t.tabIndex=0;t.set=v=>{t.classList.toggle('is-off',!v);t.setAttribute('aria-checked',v?'true':'false')};t.setAttribute('aria-checked',on?'true':'false');t.get=()=>!t.classList.contains('is-off');
 t.addEventListener('pointerdown',()=>t.classList.add('dn'));['pointerup','pointerleave','pointercancel'].forEach(ev=>t.addEventListener(ev,()=>t.classList.remove('dn')));
 t.addEventListener('click',e=>{e.stopPropagation();const r=onChange?onChange(!t.get()):true;if(r===false){t.classList.remove('nope');void t.offsetWidth;t.classList.add('nope');K.buzz(20);return}t.set(!t.get());K.buzz(10)});t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t.click()}});
 return t};
// top bar: hearts, bones, gear (cream round button)
K.topbar=(parent,gearHref)=>{let g={};try{g=JSON.parse(localStorage.getItem('gbb')||'{}')}catch(e){}
 const bar=h('div','k-top',parent),U3=base.replace(/uikit\/$/,'ui3/');
 const mk=(cls,art,i)=>{const c=h('div','k-counter3 '+cls+' k-drop',bar);c.setAttribute('role','button');c.style.setProperty('--i',i);const im=h('img','k-art',c);im.src=U3+art+'.webp?v=4';im.alt='';im.draggable=false;return c};
 const c1=mk('heart','cnt_heart',0);const n1=h('div','k-num3',c1);n1.textContent=window.Eco?Eco.hearts():(g.hearts!=null?g.hearts:5);const tm=h('div','k-timer',c1);
 const c2=mk('bone','cnt_bone',1);const n2=h('div','k-num3',c2);n2.textContent=window.Eco?Eco.bones():(g.bones!=null?g.bones:430);
 if(window.GBBFont){GBBFont.bind(n1,'ink');GBBFont.bind(n2,'ink');GBBFont.bind(tm,'badge',.9)}   // painted Ink lettering on the counters
 const gear=h('div','k-gear3 k-drop',bar);gear.style.setProperty('--i',2);gear.setAttribute('role','button');gear.setAttribute('aria-label','Settings');{const im=h('img','k-art',gear);im.src=U3+'gear.webp?v=4';im.alt='';im.draggable=false}
 K.press(gear,()=>{(window.BA&&BA.nav?BA.nav(gearHref):location.href=gearHref)});
 c1.setAttribute('aria-label',n1.textContent+' lives');c2.setAttribute('aria-label',n2.textContent+' bones');
 const upd=()=>{if(!window.Eco)return;const H=Eco.hearts();n1.textContent=H;n2.textContent=Eco.bones();tm.textContent=H<Eco.MAX?Eco.fmt(Eco.nextIn()):'';c1.setAttribute('aria-label',H+' lives');c2.setAttribute('aria-label',n2.textContent+' bones')};
 if(window.Eco){Eco.on(upd);upd();setInterval(upd,1000)}
 K.press(c1,()=>{if(!window.Eco)return;const H=Eco.hearts();K.toast(H>=Eco.MAX?'Your lives are full!':'Next life in '+Eco.fmt(Eco.nextIn()))});
 K.press(c2,()=>{if(!/shop\.html/.test(location.pathname))(window.BA&&BA.nav?BA.nav('shop.html'):location.href='shop.html')});
 return bar};
// the scene: bottom-anchored painted background with drifting light motes; calls onSize(info) on every resize
K.scene=(bg,IW,IH,onSize)=>{document.documentElement.classList.add('kpage');
 const bgb=h('div','',document.body);bgb.id='kbgb';bgb.style.backgroundImage=`url(${bg})`;
 const st=h('div','',document.body);st.id='kstage';const bi=h('img','',st);bi.src=bg;const fx=h('canvas','',st);fx.id='kfx';
 let ui=document.getElementById('ui');if(!ui){ui=h('div','kui',document.body);ui.id='ui'}document.body.appendChild(ui);
 const R=document.documentElement.style;let started=false;
 function size(){const DPR=Math.min(2,devicePixelRatio||1);const CW=window.GBB_COL?GBB_COL():innerWidth,CX=(innerWidth-CW)/2;ui.style.left=CX+'px';ui.style.width=CW+'px';ui.style.right='auto';let w=innerWidth,hh=w*IH/IW;if(hh<innerHeight){hh=innerHeight;w=hh*IW/IH}else if(hh>innerHeight*1.04){hh=innerHeight;w=hh*IW/IH}
  st.classList.toggle('fit',w<innerWidth-2);st.style.width=w+'px';st.style.height=hh+'px';const top=innerHeight-hh;st.style.top=top+'px';
  fx.width=Math.round(w*DPR);fx.height=Math.round(hh*DPR);const wu=Math.min(CW,w)/393;R.setProperty('--w',wu+'px');R.setProperty('--u',wu+'px');
  if(started&&onSize)onSize({top,h:hh,w,wu,navTop:innerHeight-223/852*CW,cw:CW,cx:CX,sy:y=>top+y/IH*hh})}
 size();addEventListener('resize',size);
 document.addEventListener('animationend',e=>{if(/^k(In|Drop|Pop)$/.test(e.animationName))e.target.classList.add('k-done')});
 K.start=()=>{started=true;size();requestAnimationFrame(()=>requestAnimationFrame(()=>ui.classList.add('k-go')))};
 const g=fx.getContext('2d');const M=[...Array(46)].map(()=>({x:Math.random()*.6,y:.05+Math.random()*.75,r:.6+Math.random()*1.6,vx:.004+Math.random()*.01,vy:(Math.random()-.5)*.006,ph:Math.random()*6.3}));
 let t0=performance.now(),last=t0;
 (function f(now){const t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000);last=now;const W=fx.width,H=fx.height;g.clearRect(0,0,W,H);
  const gl=.10+.05*Math.sin(t*.6);const rg=g.createRadialGradient(W*.05,H*.12,0,W*.05,H*.12,W*.9);rg.addColorStop(0,`rgba(255,214,140,${gl})`);rg.addColorStop(1,'rgba(255,214,140,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
  for(const m of M){m.x+=m.vx*dt+Math.sin(t*.7+m.ph)*.0002;m.y+=m.vy*dt+Math.cos(t*.5+m.ph)*.0002;if(m.x>.75||m.y<0||m.y>.85){m.x=Math.random()*.2;m.y=.05+Math.random()*.7}
   const beam=Math.max(0,1-Math.abs((m.y*H*.55)-(m.x*W))/(W*.35));const a=(.25+.35*Math.sin(t*1.7+m.ph))*(.3+.7*beam);if(a<=0)continue;
   g.fillStyle=`rgba(255,240,200,${a})`;g.beginPath();g.arc(m.x*W,m.y*H,m.r*W/700,0,7);g.fill()}
  requestAnimationFrame(f)})(t0);
 return ui};
// fit a panel between y0 and the menu: scales --u down if its content is too tall
K.fitPanel=(panel,title,info,y0,titleY)=>{const R=document.documentElement.style,wu=info.wu;R.setProperty('--u',wu+'px');
 const avail=info.navTop-12*wu-y0;const need=panel.offsetHeight/wu;const u=Math.min(wu,avail/need);R.setProperty('--u',u+'px');
 panel.style.top=y0+Math.max(0,avail-panel.offsetHeight)*.3+'px';if(title)title.style.top=Math.max(110*wu,titleY-30*u)+'px';return u};
})();

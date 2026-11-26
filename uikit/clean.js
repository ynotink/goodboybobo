/* Good Boy Bobo — helpers for the clean page style (uikit/clean.css). Needs kit.js (K). */
(function(){
const K=window.K,h=K.h;
const C=window.CL={};
C.img=(src,p,cls)=>{const i=h('img',cls||'',p);i.src=src;i.alt='';i.draggable=false;return i};
// press feel: sink while held, act on release, light tap haptic + tap sound
C.tap=(el,fn)=>{el.setAttribute('role','button');el.tabIndex=0;let d=false;
 el.addEventListener('pointerdown',()=>{d=true;el.classList.add('dn');K.buzz(8)});
 const up=go=>{if(!d)return;d=false;el.classList.remove('dn');if(go){try{BA.play('tap',{gap:60})}catch(e){}fn&&fn(el)}};
 el.addEventListener('pointerup',()=>up(true));el.addEventListener('pointerleave',()=>up(false));el.addEventListener('pointercancel',()=>up(false));
 el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn&&fn(el)}});return el};
C.btn=(p,label,fn,kind,icon)=>{const b=h('div','cl-btn'+(kind?' '+kind:''),p);if(icon)C.img(icon,b);const s=h('span','',b);s.textContent=label;C.tap(b,fn);return b};
C.title=(p,t)=>{const d=h('div','cl-title cl-pop',p);d.textContent=t;return d};
C.card=(p,tone,i)=>{const c=h('div','cl-card cl-pop t-'+(tone||'cream'),p);c.style.setProperty('--i',i||0);return c};
C.head=(card,title,tag)=>{const d=h('div','cl-head',card);h('h3','',d).textContent=title;if(tag){const t=h('span','cl-tag',d);t.textContent=tag}return d};
C.toggle=(p,on,fn,label)=>{const t=h('div','cl-tog'+(on?' on':''),p);t.setAttribute('role','switch');t.setAttribute('aria-label',label||'');t.setAttribute('aria-checked',on?'true':'false');
 t.addEventListener('click',e=>{e.stopPropagation();const r=fn(!t.classList.contains('on'));if(r===false){t.classList.remove('nope');void t.offsetWidth;t.classList.add('nope');return}
  t.classList.toggle('on');t.setAttribute('aria-checked',t.classList.contains('on')?'true':'false');K.buzz(10)});return t};
// scroll area between the top counters and the bottom menu
C.scroll=ui=>{const sc=h('div','cl-scroll',ui);const col=h('div','cl-col',sc);
 C.layout=I=>{const top=I.wu*112,bot=I.navTop-4*I.wu;Object.assign(sc.style,{top:top+'px',height:Math.max(100,bot-top)+'px'})};return {sc,col}};
})();

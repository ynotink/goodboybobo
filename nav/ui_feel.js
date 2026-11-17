/* Good Boy Bobo — shared "alive" layer for the menu pages (Toys, Friends, Shop, Settings, Home).
   Panel entrance, touch feedback on every tap area, counters and gear that press, quiet idle twinkles. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const css=document.createElement('style');css.textContent=`
#panel{animation:uiIn .42s cubic-bezier(.2,.8,.3,1) both}
#title{animation:uiDrop .5s .08s cubic-bezier(.3,1.4,.5,1) both}
#title.br{animation:uiBreath 1.6s ease-in-out}
@keyframes uiIn{0%{opacity:0;transform:translateY(5%) scale(.98)}100%{opacity:1;transform:none}}
@keyframes uiDrop{0%{opacity:0;transform:translateY(-35%) scale(.9)}100%{opacity:1;transform:none}}
@keyframes uiBreath{50%{transform:translateY(-4%) scale(1.03)}}
.hit{-webkit-tap-highlight-color:transparent}
.uiDip{position:absolute;pointer-events:none;border-radius:14px;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.28),rgba(120,80,30,.12) 70%);opacity:0;transition:opacity 90ms}
.uiDip.on{opacity:1}
.uiPress{transition:transform 90ms ease-out}
.uiPress.dn{transform:scale(.93)}
.uiPress.up{animation:uiUp 200ms ease-out}
@keyframes uiUp{0%{transform:scale(.93)}60%{transform:scale(1.04)}100%{transform:none}}
.uiSpark{position:fixed;pointer-events:none;z-index:70;width:6px;height:6px;border-radius:50%;background:#fff6c4;box-shadow:0 0 6px 2px rgba(255,220,120,.85)}
.uiTw{position:absolute;pointer-events:none;width:18px;height:18px;margin:-9px;opacity:0;
 background:radial-gradient(circle,rgba(255,255,240,1) 0 12%,rgba(255,240,190,.0) 60%),linear-gradient(90deg,transparent 46%,rgba(255,255,235,.95) 50%,transparent 54%),linear-gradient(0deg,transparent 46%,rgba(255,255,235,.95) 50%,transparent 54%);
 animation:uiTw 2.4s ease-in-out}
@keyframes uiTw{40%{opacity:1;transform:scale(1) rotate(20deg)}100%{opacity:0;transform:scale(.3) rotate(60deg)}}
${RM?'#panel,#title,.uiPress.up,#title.br{animation:none!important}.uiTw{display:none}':''}`;
document.head.appendChild(css);
function sparks(x,y,n){if(RM)return;for(let i=0;i<n;i++){const s=document.createElement('div');s.className='uiSpark';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
 const a=Math.random()*6.28,d=14+Math.random()*24;s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d-3}px,${Math.sin(a)*d-3}px) scale(.2)`,opacity:0}],{duration:380+Math.random()*180,easing:'ease-out'}).onfinish=()=>s.remove()}}
function wire(){
 // every tap area: soft glow dip while pressed, sparkle + click on release
 document.querySelectorAll('.hit').forEach(h=>{if(h.dataset.ui)return;h.dataset.ui=1;
  const isImg=h.tagName==='IMG';if(isImg)h.classList.add('uiPress');
  let dip=null,on=false;
  const dn=()=>{on=true;if(isImg){h.classList.remove('up');h.classList.add('dn');return}
   if(!dip){dip=document.createElement('div');dip.className='uiDip';h.parentNode.insertBefore(dip,h)}
   Object.assign(dip.style,{left:h.style.left,top:h.style.top,width:h.style.width,height:h.style.height,right:h.style.right,bottom:h.style.bottom});dip.classList.add('on')};
  const up=ok=>{if(!on)return;on=false;if(isImg){h.classList.remove('dn');void h.offsetWidth;h.classList.add('up')}else if(dip)dip.classList.remove('on');
   if(ok){const r=h.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,isImg?6:5);try{window.BA&&BA.play&&BA.play('tap',{gap:60})}catch(e){}}};
  h.addEventListener('pointerdown',dn);h.addEventListener('pointerup',()=>up(true));
  ['pointerleave','pointercancel'].forEach(e=>h.addEventListener(e,()=>up(false)))});
 // counters: little hop when tapped
 document.querySelectorAll('img').forEach(i=>{if(/L0[23]_/.test(i.src)&&!i.dataset.ui){i.dataset.ui=1;i.classList.add('uiPress');i.style.pointerEvents='auto';
  i.addEventListener('pointerdown',()=>{i.classList.remove('up');i.classList.add('dn')});i.addEventListener('pointerup',()=>{i.classList.remove('dn');void i.offsetWidth;i.classList.add('up')});i.addEventListener('pointerleave',()=>i.classList.remove('dn'))}})}
wire();setTimeout(wire,400);setTimeout(wire,1200);
// quiet idle rhythm: title breathes now and then, a twinkle on the panel every few seconds
if(!RM){const t=document.getElementById('title');
 if(t){const br=()=>{if(!document.hidden){t.style.animation='none';t.classList.remove('br');void t.offsetWidth;t.style.animation='';t.classList.add('br')}setTimeout(br,8000+Math.random()*4000)};setTimeout(br,5000)}
 const p=document.getElementById('panel'),st=document.getElementById('stage');
 if(p&&st){const tw=()=>{if(!document.hidden){const r=p.getBoundingClientRect(),s=st.getBoundingClientRect();const d=document.createElement('div');d.className='uiTw';
   const edge=Math.random()<.5;d.style.left=(r.left-s.left+(edge?(Math.random()<.5?.04:.96):.1+Math.random()*.8)*r.width)+'px';d.style.top=(r.top-s.top+(edge?.1+Math.random()*.8:(Math.random()<.5?.02:.98))*r.height)+'px';
   st.appendChild(d);setTimeout(()=>d.remove(),2500)}setTimeout(tw,2600+Math.random()*2400)};setTimeout(tw,1500)}}
})();

// shared top HUD + bottom nav
const G={hearts:3,bones:430};
try{const s=JSON.parse(localStorage.getItem('gbb')||'{}');Object.assign(G,s)}catch(e){}
function hud(){
  return `<div class="hud">
  <div class="wpill" style="left:50px;top:64px;width:76px;height:35px;padding-left:18px"><span class="num cream">${G.hearts}</span></div>
  <img class="ico" src="a/ic0.webp" style="left:15px;top:54px;width:54px">
  <div class="wpill" style="left:146px;top:64px;width:146px;height:35px;padding-left:22px;padding-right:30px"><span class="num cream">${G.bones}</span></div>
  <img class="ico" src="a/ic1.webp" style="left:139px;top:56px;width:60px;transform:rotate(-8deg)">
  <img class="ico tap" src="a/rb2.webp" style="left:255px;top:62px;width:40px;pointer-events:auto" onclick="go('shop')">
  <img class="ico tap" src="a/rb0.webp" style="left:319px;top:52px;width:54px;pointer-events:auto" onclick="go('settings')">
  </div>`}
function nav(cur,bot){
  const it=[['home','Home','nav0',58],['map','Map','nav1',155],['toys','Toys','nav2',242],['shop','Shop','nav3',331]];
  return `<div class="nav" ${bot!=null?`style="bottom:${bot}px"`:""}><img class="bar" src="a/navbar.webp" style="object-fit:fill">`+
   it.map(([k,l,i,x])=>`<div class="it tap ${k==cur?'on':''}" style="left:${x-42}px" onclick="go('${k}')"><img class="i" src="a/${i}.webp"><div class="wpill dk lb"><span class="cream" style="font-size:16px">${l}</span></div></div>`).join('')+`</div>`}
function go(p){if(p=='index')p='home';const m={home:'index.html',map:'map.html',toys:'toys.html',shop:'shop.html',settings:'settings.html',game:'game.html'};window.BA?BA.nav(m[p]):location.href=m[p]}
// Fill the phone: full width; the screen stretches/shrinks to the phone's height. Top stays at top, bottom menu at
// the bottom. Each page says how short it may get (body data-hmin) and which pieces slide up on short phones (data-sy="max").
function fit(){const app=document.getElementById('app'),B=document.body,hmin=+(B&&B.dataset.hmin)||844;
 const k=Math.min(innerWidth/390,innerHeight/hmin),H=Math.max(hmin,innerHeight/k),ex=H-844;
 app.style.setProperty('--k',k);app.style.height=H+'px';app.style.setProperty('--H',H+'px');
 document.querySelectorAll('[data-sy]').forEach(e=>{const m=+e.dataset.sy;e.style.marginTop=`${Math.max(-m,Math.min(0,ex))}px`});
 window.FITCB&&FITCB(H)}
addEventListener('resize',fit);addEventListener('DOMContentLoaded',fit);

// ===== calm glass UI helpers =====
const GEAR='<svg viewBox="0 0 24 24" width="30" height="30"><path fill="#fff" d="M19.4 13c.04-.33.06-.66.06-1s-.02-.67-.06-1l2.1-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.48 1a7.3 7.3 0 0 0-1.73-1l-.37-2.65A.5.5 0 0 0 13.94 2h-4a.5.5 0 0 0-.5.42l-.37 2.65c-.62.25-1.2.59-1.73 1l-2.48-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64L4.5 11c-.04.33-.06.67-.06 1s.02.67.06 1l-2.1 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.22.39.3.6.22l2.48-1c.52.4 1.1.74 1.73 1l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.62-.26 1.2-.6 1.73-1l2.48 1c.22.08.48 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64L19.4 13zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" stroke="rgba(40,60,25,.35)" stroke-width=".6"/></svg>';
function ghud(){return `<div class="ghud">
 <div class="cnt gl tap" style="left:22px;width:122px;padding-left:56px" onclick="gtoast('Lives refill over time')"><img src="a/ic0.webp" style="left:6px;top:1px;width:44px"><span class="v">${G.hearts}</span><span class="p">+</span></div>
 <div class="cnt gl tap" style="left:154px;width:150px;padding-left:58px" onclick="go('shop')"><img src="a/ic1.webp" style="left:9px;top:3px;width:44px;transform:rotate(-14deg)"><span class="v">${G.bones}</span><span class="p">+</span></div>
 <div class="gear tap" onclick="go('settings')"><img src="a/P_gear${({shop:"_brown",toys:"_navy",settings:"_teal"})[document.body.dataset.room]||""}.webp"></div></div>`}
function gnav(cur){const it=[['home','Home','nav0'],['map','Map','nav1'],['toys','Toys','nav2'],['shop','Shop','nav3']];
 return `<div class="gnav gl">`+it.map(([k,l,i])=>`<div class="it tap ${k==cur?'on':''}" onclick="go('${k}')"><img src="a/${i}.webp"><span>${l}</span></div>`).join('')+`</div>`}
function gtoast(t){let e=document.querySelector('.gtoast');if(!e){e=document.createElement('div');e.className='gtoast';document.getElementById('app').appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800)}
function gbbCur(){try{const s=JSON.parse(localStorage.getItem('gbb_play')||'{}').stars||{};let m=0;for(const k in s)m=Math.max(m,+k+1);return Math.min(300,m+1)}catch(e){return 1}}

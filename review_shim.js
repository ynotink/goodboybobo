/* Good Boy Bobo — REVIEW MODE.
   Opened from review.html. While on, every saved value (progress, bones, settings) is kept under its own
   "rv_" names, so nothing here touches the real game's save. Purchases never run in review mode. */
(function(){
const q=new URLSearchParams(location.search);
try{if(q.get('review')==='1')sessionStorage.setItem('gbbReview','1');if(q.get('review')==='0')sessionStorage.removeItem('gbbReview')}catch(e){}
let on=false;try{on=sessionStorage.getItem('gbbReview')==='1'}catch(e){}
window.GBB_REVIEW=on;if(!on)return;
const P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem;
const k=(st,key)=>st===window.localStorage?'rv_'+key:key;
P.getItem=function(key){return g.call(this,k(this,key))};
P.setItem=function(key,v){return s.call(this,k(this,key),v)};
P.removeItem=function(key){return r.call(this,k(this,key))};
const root=(document.currentScript&&document.currentScript.src||'').replace(/review_shim\.js.*$/,'');
addEventListener('DOMContentLoaded',()=>{
 const css=document.createElement('style');css.textContent=`
 #rvTag{position:fixed;right:8px;top:calc(env(safe-area-inset-top) + 6px);z-index:100000;font:900 12px system-ui;color:#fff;background:#c0392b;padding:6px 10px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:pointer}
 #rvPanel{position:fixed;left:8px;right:8px;bottom:8px;z-index:100001;max-height:70vh;overflow:auto;background:rgba(12,40,44,.96);color:#fff;font:700 13px system-ui;border-radius:16px;padding:12px;display:none;box-shadow:0 6px 20px rgba(0,0,0,.5)}
 #rvPanel.on{display:block}#rvPanel h4{margin:8px 0 6px;font-size:12px;color:#9fe3d6;text-transform:uppercase;letter-spacing:.05em}
 #rvPanel button{font:800 12px system-ui;margin:3px;padding:8px 10px;border:0;border-radius:10px;background:#f6ead1;color:#123;cursor:pointer}
 #rvPanel input{width:64px;padding:7px;border-radius:8px;border:0;font:800 13px system-ui}`;
 document.head.appendChild(css);
 const tag=document.createElement('div');tag.id='rvTag';tag.textContent='REVIEW ▾';document.body.appendChild(tag);
 const pn=document.createElement('div');pn.id='rvPanel';document.body.appendChild(pn);tag.onclick=()=>pn.classList.toggle('on');
 const go=u=>location.href=root+u;
 const inGame=/game_new\.html/.test(location.pathname);
 const b=(label,fn)=>{const x=document.createElement('button');x.textContent=label;x.onclick=e=>{e.stopPropagation();fn()};return x};
 const sec=(t,items)=>{const h=document.createElement('h4');h.textContent=t;pn.appendChild(h);const d=document.createElement('div');items.forEach(i=>d.appendChild(i));pn.appendChild(d)};
 const lvl=document.createElement('input');lvl.type='number';lvl.min=1;lvl.max=100;lvl.placeholder='Lv';
 sec('Go to',[b('Review menu',()=>go('review.html')),b('Home',()=>go('bovo11/index.html')),b('Map',()=>go('bovo10/index.html')),b('Toys',()=>go('bovo11/toys.html')),b('Friends',()=>go('bovo11/friends.html')),b('Shop',()=>go('bovo11/shop.html')),b('Settings',()=>go('bovo11/settings.html'))]);
 sec('Play a level',[lvl,b('Play',()=>{const n=Math.max(1,Math.min(100,+lvl.value||1));go('game_new.html?lv='+n)}),...[1,11,21,31,41,51,61,71,81,91].map((n,i)=>b('Ch '+(i+1),()=>go('game_new.html?lv='+n)))]);
 if(inGame){const G=f=>()=>{try{f()}catch(e){alert('Not ready yet: '+e.message)}pn.classList.remove('on')};
  sec('Pop-ups',[b('Level start',G(()=>{gpClose&&gpClose(true);showIntro()})),b('Paused',G(()=>{gpClose&&gpClose(true);S.over=false;g2pause()})),
   b('Out of moves',G(()=>{gpClose&&gpClose(true);S.moves=0;lose()})),b('Win 1★',G(()=>{gpClose&&gpClose(true);g2results(1,15)})),b('Win 2★',G(()=>{gpClose&&gpClose(true);g2results(2,30)})),b('Win 3★',G(()=>{gpClose&&gpClose(true);g2results(3,45)})),b('Close pop-up',G(()=>gpClose(true)))]);
  sec('Boosters & moves',[b('Fill boosters (9 each)',G(()=>{SAVE.boost=[9,9,9,9];save();drawBoosters()})),b('Moves = 5',G(()=>{S.moves=5;drawMoves()})),b('Moves = 1',G(()=>{S.moves=1;drawMoves()})),b('+10 moves',G(()=>{S.moves+=10;drawMoves()})),b('Goals almost done',G(()=>{S.goals.forEach(g=>g.left=Math.min(g.left,1));drawGoals()}))]);
  sec('Rambo',[b('Happy',G(()=>rReact('happy',true))),b('Cheer',G(()=>rReact('cheer',true))),b('Worried',G(()=>rReact('worry',true)))]);}
 sec('Lives & bones',[b('+1000 bones',()=>{Eco.addBones(1000)}),b('Bones = 0',()=>{Eco.spend(Eco.bones())}),b('Lives = 0',()=>{for(let i=0;i<5;i++)Eco.loseHeart()}),b('Lives full',()=>Eco.refillHearts())]);
 sec('Review save',[b('Unlock all levels',()=>{localStorage.setItem('gbb_play',JSON.stringify({stars:Object.fromEntries([...Array(100)].map((_,i)=>[i,3])),boost:[9,9,9,9],sound:1}));alert('All 100 levels unlocked (review save only).')}),
  b('Reset review save',()=>{['gbb','gbb_play','gbb_settings'].forEach(x=>localStorage.removeItem(x));alert('Review save cleared.')}),
  b('Exit review mode',()=>{sessionStorage.removeItem('gbbReview');location.href=root+'review.html?review=0'})]);
});
// purchases are never real in review mode
window.GBB_NO_PURCHASES=true;
})();

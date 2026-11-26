/* Good Boy Bobo — real-money store catalog and purchases.
   Every item is an Apple in-app purchase (consumable). Product IDs must match App Store Connect exactly.
   In the iPhone app, buying goes through the native StoreKit bridge:
     web -> native : window.webkit.messageHandlers.iap.postMessage({buy: productId})   (and {restore:true})
     native -> web : GBBStore.purchased(productId)   when Apple confirms a purchase
                     GBBStore.failed(productId, message)   when it was cancelled or failed
                     GBBStore.prices({productId: '$0.99', ...})   localized prices from Apple (optional)
   Boosters index: 0 Paw Tap, 1 Free Swap, 2 Bomb, 3 (fourth booster). */
(function(){
const H=3600e3,M=60e3;
const P=[
 // deals
 {id:'gbb.deal.weekly', kind:'weekly',name:'Weekly Deal',price:'$0.99',bones:200,tag:'-50%'},
 {id:'gbb.deal.daily',  kind:'daily', name:'Daily Deal', price:'$2.99',bones:300,boost:1,hearts:30*M,tag:'Popular'},
 // bundles
 {id:'gbb.bundle.starter',   kind:'bundle',name:'Starter Bundle',    price:'$4.99', bones:500, boost:1, hearts:1*H, card:'mint'},
 {id:'gbb.bundle.goodboy',   kind:'bundle',name:'Good Boy Bundle',   price:'$9.99', bones:1100,boost:2, hearts:3*H, card:'blue'},
 {id:'gbb.bundle.bestfriend',kind:'bundle',name:'Best Friend Bundle',price:'$19.99',bones:2400,boost:4, hearts:12*H,card:'lilac'},
 {id:'gbb.bundle.topdog',    kind:'bundle',name:'Top Dog Bundle',    price:'$49.99',bones:6500,boost:10,hearts:48*H,card:'peach'},
 // bone packs
 {id:'gbb.bones.100', kind:'bones',price:'$0.99', bones:100, art:1},
 {id:'gbb.bones.330', kind:'bones',price:'$2.99', bones:330, art:2},
 {id:'gbb.bones.600', kind:'bones',price:'$4.99', bones:600, art:3},
 {id:'gbb.bones.1300',kind:'bones',price:'$9.99', bones:1300,art:4},
 {id:'gbb.bones.2800',kind:'bones',price:'$19.99',bones:2800,art:5},
 {id:'gbb.bones.7500',kind:'bones',price:'$49.99',bones:7500,art:6}];
const KEY='gbb_shop';
const rd=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}};
const wr=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
const dayId=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const weekStart=(d=new Date())=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x};   // Monday
const S=window.GBBStore={products:P,
 byId:id=>P.find(p=>p.id===id),
 native:()=>!!(window.webkit&&webkit.messageHandlers&&webkit.messageHandlers.iap),
 // time left until the daily deal changes (local midnight) / the weekly deal comes back (next Monday)
 dailyLeft:()=>{const n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1);return m-n},
 weeklyLeft:()=>{const w=weekStart();w.setDate(w.getDate()+7);return w-new Date()},
 bought:id=>{const o=rd(),p=S.byId(id);if(!p)return false;if(p.kind==='daily')return o.daily===dayId();if(p.kind==='weekly')return o.weekly===weekStart().getTime();return false},
 buy(id,cb){const p=S.byId(id);if(!p||S.bought(id))return;S._cb=cb;
  if(S.native()){try{webkit.messageHandlers.iap.postMessage({buy:id})}catch(e){S.failed(id,'Purchase could not start.')}return}
  S.failed(id,'Purchases work in the App Store version of Good Boy Bobo.')},
 restore(){if(S.native()){try{webkit.messageHandlers.iap.postMessage({restore:true})}catch(e){}}else S.failed(null,'Nothing to restore yet.')},
 // called by the native app once Apple confirms payment: hand over everything in the item
 purchased(id){const p=S.byId(id);if(!p)return;const E=window.Eco;
  if(E){if(p.bones)E.addBones(p.bones);if(p.boost)for(let k=0;k<4;k++)E.addBoost(k,p.boost);if(p.hearts)E.addUnlimited(p.hearts)}
  const o=rd();if(p.kind==='daily')o.daily=dayId();if(p.kind==='weekly')o.weekly=weekStart().getTime();wr(o);
  const cb=S._cb;S._cb=null;if(cb)cb(true,p);if(S.onChange)S.onChange()},
 failed(id,msg){const cb=S._cb;S._cb=null;if(cb)cb(false,null,msg);else if(window.K&&K.toast&&msg)K.toast(msg)},
 prices(map){for(const p of P)if(map&&map[p.id])p.price=map[p.id];if(S.onChange)S.onChange()},
 fmt(ms){const m=Math.floor(ms/M),h=Math.floor(m/60),d=Math.floor(h/24);return d>=1?d+'d '+(h%24)+'h':h>=1?h+'h '+String(m%60).padStart(2,'0')+'m':Math.max(1,m)+'m'},
 dur(ms){const h=ms/H;return h>=24?(h/24)+'d':h>=1?h+'h':(ms/M)+'m'}};
})();

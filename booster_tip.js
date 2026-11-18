/* Good Boy Bobo — booster instructions: a cream kit pill above the booster bar while a booster is armed. */
(function(){
const TIPS=['Tap a toy to clear it','Tap two toys to swap them','Tap where to drop the bomb'];
const css=document.createElement('style');css.textContent=`
#btip2{position:fixed;z-index:58;left:50%;transform:translate(-50%,8px) scale(.9);opacity:0;pointer-events:none;transition:opacity .18s,transform .25s cubic-bezier(.3,1.5,.5,1);
 font-family:KNun,BoboNunito,system-ui;color:#1b4b50;text-align:center;white-space:nowrap;line-height:1.1;
 border-style:solid;border-width:16px 17px;border-image:url(uikit/cream_big.webp?v=1) 80 84 fill/16px 17px stretch;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}
#btip2.on{opacity:1;transform:translate(-50%,0) scale(1)}
#btip2 b{display:block;font-weight:400;font-size:17px;margin:-8px 4px 0}#btip2 i{display:block;font-style:normal;font-size:12px;color:#7b6a55;margin:2px 4px -8px}`;
document.head.appendChild(css);
const t=document.createElement('div');t.id='btip2';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t);
let last=-2;
function place(){const bs=[...document.querySelectorAll('#g2ui .bh')];if(!bs.length)return;const r0=bs[0].getBoundingClientRect(),r1=bs[bs.length-1].getBoundingClientRect();
 const hs=[...document.querySelectorAll('#g2ui .h')],pz=hs[hs.length-1].getBoundingClientRect(),w=t.offsetWidth||250;
 t.style.left=Math.max((r0.left+r1.right)/2,pz.right+8+w/2)+'px';t.style.top=Math.min(innerHeight-52,r0.bottom+6)+'px'}
setInterval(()=>{const k=(typeof S!=='undefined'&&S)?(S.booster??-1):-1;if(k===last)return;last=k;
 if(k>=0&&k<3){t.innerHTML=`<b>${TIPS[k]}</b><i>Tap the booster again to cancel</i>`;requestAnimationFrame(place);t.classList.add('on')}else t.classList.remove('on')},100);
addEventListener('resize',place);
// accessible names for the gameplay buttons
const lab=()=>{const hs=[...document.querySelectorAll('#g2ui .h')];if(hs.length<5)return setTimeout(lab,200);
 ['Paw Tap booster','Free Swap booster','Bomb booster','Shuffle booster'].forEach((n,i)=>{hs[i].setAttribute('role','button');hs[i].setAttribute('aria-label',n)});
 hs[hs.length-1].setAttribute('role','button');hs[hs.length-1].setAttribute('aria-label','Pause')};lab();
})();

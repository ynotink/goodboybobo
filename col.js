/* Good Boy Bobo — phone column. On a phone the game fills the screen; on an iPad or a desktop browser
   every screen keeps phone proportions in a centred column, with the scene blurred out to the sides. */
(function(){
const col=()=>{const W=innerWidth,H=innerHeight;return W/H>0.62?Math.round(Math.min(W,H*852/1846)):W};
window.GBB_COL=col;window.GBB_COLX=()=>Math.round((innerWidth-col())/2);
})();

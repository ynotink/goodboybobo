/* Good Boy Bobo — painted lettering (ChatGPT's TITLE style: cream letters, deep teal outline, drop shadow).
   GBBFont.draw(el, text, capPx) fills el with a canvas that spells the text from the painted glyph sheet;
   capPx is the height of a capital letter in CSS pixels. The text's capital-letter middle sits at el's middle. */
(function(){
const M={"h": 162, "top": 14, "base": 140, "sp": 42, "gap": -6, "g": {"0": [0, 0, 91], "1": [93, 0, 76], "2": [171, 0, 91], "3": [264, 0, 90], "4": [356, 0, 96], "5": [454, 0, 88], "6": [544, 0, 91], "7": [637, 0, 91], "8": [730, 0, 91], "9": [823, 0, 92], ".": [917, 0, 47], ",": [966, 0, 49], "!": [1017, 0, 48], "?": [1067, 0, 86], "'": [1155, 0, 43], ":": [1200, 0, 47], "-": [0, 164, 58], "+": [60, 164, 88], "/": [150, 164, 77], "%": [229, 164, 145], "$": [376, 164, 83], "&": [461, 164, 123], "(": [586, 164, 55], ")": [643, 164, 55], "#": [700, 164, 106], "×": [808, 164, 79], "A": [889, 164, 118], "B": [1009, 164, 96], "C": [1107, 164, 97], "D": [0, 328, 104], "E": [106, 328, 79], "F": [187, 328, 78], "G": [267, 328, 106], "H": [375, 328, 104], "I": [481, 328, 47], "J": [530, 328, 70], "K": [602, 328, 103], "L": [707, 328, 85], "M": [794, 328, 128], "N": [924, 328, 114], "O": [1040, 328, 116], "P": [1158, 328, 92], "Q": [0, 492, 116], "R": [118, 492, 103], "S": [223, 492, 89], "T": [314, 492, 95], "U": [411, 492, 104], "V": [517, 492, 113], "W": [632, 492, 143], "X": [777, 492, 115], "Y": [894, 492, 108], "Z": [1004, 492, 97], "a": [1103, 492, 92], "b": [0, 656, 94], "c": [96, 656, 84], "d": [182, 656, 94], "e": [278, 656, 94], "f": [374, 656, 76], "g": [452, 656, 99], "h": [553, 656, 95], "i": [650, 656, 48], "j": [700, 656, 64], "k": [766, 656, 100], "l": [868, 656, 47], "m": [917, 656, 132], "n": [1051, 656, 95], "o": [1148, 656, 96], "p": [0, 820, 94], "q": [96, 820, 94], "r": [192, 820, 74], "s": [268, 820, 80], "t": [350, 820, 76], "u": [428, 820, 95], "v": [525, 820, 101], "w": [628, 820, 139], "x": [769, 820, 101], "y": [872, 820, 101], "z": [975, 820, 83]}};
const root=(document.currentScript&&document.currentScript.src||'').replace(/fontA\.js.*$/,'');
const atlas=new Image();atlas.decoding='async';atlas.src=root+'a/fontA/atlas.webp?v=1';
const ready=(atlas.decode?atlas.decode():new Promise(r=>atlas.onload=r)).catch(()=>{});
const KERN={"'":-4};
function layout(t){let w=0;const out=[];for(const c of t){const g=M.g[c];if(c===' '){w+=M.sp;continue}if(!g)continue;if(out.length)w+=M.gap+(KERN[c]||0);out.push([g,w]);w+=g[2]}return{w,out}}
function draw(el,text,cap,o={}){const s=cap/(M.base-M.top),dpr=Math.min(3,devicePixelRatio||1),L=layout(String(text));
 let cv=el.querySelector('canvas.gf');if(!cv){el.textContent='';cv=document.createElement('canvas');cv.className='gf';cv.style.display='block';el.appendChild(cv)}
 const W=Math.max(1,L.w*s),H=M.h*s;cv.style.width=W+'px';cv.style.height=H+'px';
 // shift so the middle of the capitals (not the middle of the box) sits on the element's middle
 cv.style.position='relative';cv.style.top=((M.h/2-(M.top+M.base)/2)*s)+'px';
 cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);el.setAttribute('aria-label',text);
 const paint=()=>{const g=cv.getContext('2d');g.setTransform(dpr*s,0,0,dpr*s,0,0);g.imageSmoothingQuality='high';g.clearRect(0,0,L.w,M.h);
  for(const [gl,x] of L.out)g.drawImage(atlas,gl[0],gl[1],gl[2],M.h,x,0,gl[2],M.h)};
 if(atlas.complete&&atlas.naturalWidth)paint();else ready.then(paint);return cv}
window.GBBFont={draw,ready,has:c=>!!M.g[c]};
})();

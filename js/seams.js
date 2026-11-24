/* seams: the matrix runs from one section into the next. In the gap between two blocks, pink
   glyph columns pour down from the bottom edge of the block above toward the top of the block
   below; how far they have run follows the scroll (a gap entering at the bottom of the screen
   is barely touched, one passing the middle is fully joined). Drawn only inside the gaps, never
   over content; nothing runs while no gap is on screen. Reduced motion: nothing. */
(function(){var st=document.querySelector('main .stack');if(!st||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cv=document.createElement('canvas'),x=cv.getContext('2d'),DPR=Math.min(2,devicePixelRatio||1),W=0,H=0,gaps=[],raf=0,CELL=14,GL='.:-=+*#%';
cv.className='seams';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
function hash(k){var h=(k*374761393)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function measure(){W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);CELL=W<810?12:14;gaps=[];
 var ks=[].slice.call(st.children).filter(function(e){return e.offsetHeight>0&&getComputedStyle(e).position!=='fixed'}),sy=scrollY;
 for(var i=1;i<ks.length;i++){var a=ks[i-1].getBoundingClientRect(),b=ks[i].getBoundingClientRect(),g=b.top-a.bottom;
  if(g>40)gaps.push({y0:a.bottom+sy,y1:b.top+sy,x0:Math.max(a.left,b.left),x1:Math.min(a.right,b.right),k:i})}}
function frame(now){raf=0;x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);var sy=scrollY,any=false;
 x.font="500 "+(CELL-2)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='top';x.fillStyle='#FFB3AD';
 for(var q=0;q<gaps.length;q++){var g=gaps[q],t=g.y0-sy,b=g.y1-sy;if(b<0||t>H)continue;any=true;
  /* 0 when the gap is at the bottom of the screen, 1 once it reaches 40% from the top */
  var p=Math.max(0,Math.min(1,(H-t)/(H*.6))),gh=b-t,rows=Math.floor(gh/CELL),cols=Math.floor((g.x1-g.x0)/CELL),ox=g.x0+((g.x1-g.x0)-cols*CELL)/2;
  for(var c=0;c<cols;c++){var h=hash(c+g.k*1013),len=Math.round(rows*p*(.15+.85*h*h)),drift=(now/(600+h*900)+h*10)|0;
   for(var r=0;r<len;r++){var f=1-r/Math.max(1,rows);x.globalAlpha=.42*f*f*(.6+.4*h);
    x.fillText(GL[(c*7+r*3+drift)%GL.length],ox+(c+.5)*CELL,t+r*CELL+2)}
   /* the block below answers: a few glyphs rise from its top edge */
   var up=Math.round(rows*.35*p*hash(c*3+g.k));for(var r2=0;r2<up;r2++){var f2=1-r2/Math.max(1,up);x.globalAlpha=.22*f2;
    x.fillText(GL[(c+r2+drift)%GL.length],ox+(c+.5)*CELL,b-(r2+1)*CELL)}}}
 x.globalAlpha=1;if(any)raf=requestAnimationFrame(frame)}
function go(){if(!raf)raf=requestAnimationFrame(frame)}
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){measure();go()},150)});
addEventListener('scroll',go,{passive:true});
addEventListener('load',function(){measure();go()});(document.fonts&&document.fonts.ready||Promise.resolve()).then(function(){measure();go()});
setTimeout(function(){measure();go()},1500)})();

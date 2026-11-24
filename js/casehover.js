/* case cards on hover (desktop): covers stay in colour; when one card is under the cursor,
   the other cards in the same grid break into ascii glyphs, the hovered one stays a photo. */
(function(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cards=[].slice.call(document.querySelectorAll('.dg-card,.cs-card:not(.cs-full)'));if(cards.length<2)return;
var RAMP=' .:-=+*#%@',DPR=Math.min(2,devicePixelRatio||1),CELL=8;
function boxOf(c){return c.querySelector('.cs-img')||c}
function imgOf(c){return boxOf(c).querySelector('img')}
function render(c){var box=boxOf(c),im=imgOf(c);if(!im||!im.complete||!im.naturalWidth)return null;
 var W=box.clientWidth,H=box.clientHeight;if(c.__cv&&c.__w===W&&c.__h===H)return c.__cv;
 var cv=c.__cv||document.createElement('canvas');cv.className='ch-asc';cv.setAttribute('aria-hidden','true');
 if(getComputedStyle(box).position==='static')box.style.position='relative';
 cv.width=W*DPR;cv.height=H*DPR;var x=cv.getContext('2d'),cw=CELL,ch=CELL*1.4,cols=Math.ceil(W/cw),rows=Math.ceil(H/ch);
 var s=document.createElement('canvas');s.width=cols;s.height=rows;var q=s.getContext('2d',{willReadFrequently:true});
 var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc;
 q.drawImage(im,(W-dw)/2/cw,(H-dh)/2/ch,dw/cw,dh/ch);var d=q.getImageData(0,0,cols,rows).data,L=new Float32Array(cols*rows),lo=1,hi=0,k;
 for(k=0;k<L.length;k++){L[k]=(d[k*4]*.299+d[k*4+1]*.587+d[k*4+2]*.114)/255;if(L[k]<lo)lo=L[k];if(L[k]>hi)hi=L[k]}
 var span=Math.max(.1,hi-lo);
 x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle='#141414';x.fillRect(0,0,W,H);x.font=Math.round(ch*.95)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){k=j*cols+i;var l=(L[k]-lo)/span,g=RAMP[Math.min(RAMP.length-1,Math.floor(l*RAMP.length))];if(g===' ')continue;
  x.fillStyle='rgba(242,231,220,'+(.18+l*.7).toFixed(2)+')';x.fillText(g,i*cw+cw/2,j*ch+ch/2)}
 if(!c.__cv){box.appendChild(cv);c.__cv=cv}c.__w=W;c.__h=H;return cv}
var cur=null,tm=0;
function set(on){clearTimeout(tm);cur=on;cards.forEach(function(c){var other=on&&c!==on&&c.parentNode===on.parentNode;if(other){var cv=render(c);if(cv){cv.offsetWidth;cv.classList.add('on')}}else if(c.__cv)c.__cv.classList.remove('on')})}
cards.forEach(function(c){c.addEventListener('mouseenter',function(){set(c)});c.addEventListener('mouseleave',function(){tm=setTimeout(function(){set(null)},90)})});
addEventListener('resize',function(){cards.forEach(function(c){c.__w=0})});
})();

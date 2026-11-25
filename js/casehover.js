/* case cards on hover (desktop): covers stay in colour until the cursor comes onto the grid; then every cover
   breaks into ascii glyphs and a lens follows the cursor: inside it the real cover shows through, its edge
   breaks into pixels. Leaving the grid brings the colour back. */
(function(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cards=[].slice.call(document.querySelectorAll('.dg-card,.cs-card:not(.cs-full)'));if(cards.length<2)return;
var RAMP=' .:-=+*#%@',DPR=Math.min(2,devicePixelRatio||1),CELL=8,CH=11,R=160;
function boxOf(c){return c.querySelector('.cs-img')||c}
function imgOf(c){return boxOf(c).querySelector('img')}
function prep(c){var box=boxOf(c),im=imgOf(c);if(!im||!im.complete||!im.naturalWidth)return null;
 var W=box.clientWidth,H=box.clientHeight;if(c.__k&&c.__k.W===W&&c.__k.H===H)return c.__k;
 if(getComputedStyle(box).position==='static')box.style.position='relative';
 var cv=c.__k?c.__k.cv:document.createElement('canvas');cv.className='ch-asc';cv.setAttribute('aria-hidden','true');cv.width=W*DPR;cv.height=H*DPR;
 var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc,ox=(W-dw)/2,oy=(H-dh)/2;
 var ph=document.createElement('canvas');ph.width=W*DPR;ph.height=H*DPR;var p=ph.getContext('2d');p.setTransform(DPR,0,0,DPR,0,0);p.drawImage(im,ox,oy,dw,dh);
 var cols=Math.ceil(W/CELL),rows=Math.ceil(H/CH),s=document.createElement('canvas');s.width=cols;s.height=rows;var q=s.getContext('2d',{willReadFrequently:true});
 q.drawImage(im,ox/CELL,oy/CH,dw/CELL,dh/CH);var d=q.getImageData(0,0,cols,rows).data,L=new Float32Array(cols*rows),lo=1,hi=0,k;
 for(k=0;k<L.length;k++){L[k]=(d[k*4]*.299+d[k*4+1]*.587+d[k*4+2]*.114)/255;if(L[k]<lo)lo=L[k];if(L[k]>hi)hi=L[k]}
 var span=Math.max(.1,hi-lo),mean=0;for(k=0;k<L.length;k++)mean+=L[k];var inv=mean/L.length>.55,as=document.createElement('canvas');as.width=W*DPR;as.height=H*DPR;var a=as.getContext('2d');
 a.setTransform(DPR,0,0,DPR,0,0);a.fillStyle='#141414';a.fillRect(0,0,W,H);a.font=Math.round(CH*.95)+"px 'Sometype Mono',monospace";a.textAlign='center';a.textBaseline='middle';
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){k=j*cols+i;var l=(L[k]-lo)/span;if(inv)l=1-l;var g=RAMP[Math.min(RAMP.length-1,Math.floor(l*RAMP.length))];if(g===' ')continue;
  a.fillStyle='rgba(242,231,220,'+(.18+l*.7).toFixed(2)+')';a.fillText(g,i*CELL+CELL/2,j*CH+CH/2)}
 if(!c.__k)box.appendChild(cv);
 c.__k={cv:cv,x:cv.getContext('2d'),as:as,ph:ph,d:d,cols:cols,rows:rows,W:W,H:H,box:box,lensOn:true};return c.__k}
function draw(c,lx,ly,t){var K=c.__k,x=K.x,W=K.W,H=K.H;x.setTransform(1,0,0,1,0,0);x.drawImage(K.as,0,0);
 var b=K.box.getBoundingClientRect(),cx=lx-b.left,cy=ly-b.top;
 if(cx<-R-20||cy<-R-20||cx>W+R+20||cy>H+R+20){K.lensOn=false;return}K.lensOn=true;
 var inner=R-18;x.save();x.beginPath();x.arc(cx*DPR,cy*DPR,inner*DPR,0,Math.PI*2);x.clip();x.drawImage(K.ph,0,0);x.restore();
 x.setTransform(DPR,0,0,DPR,0,0);var d=K.d,tt=t/220,c0=Math.max(0,((cx-R-14)/CELL)|0),c1=Math.min(K.cols-1,((cx+R+14)/CELL)|0),r0=Math.max(0,((cy-R-14)/CH)|0),r1=Math.min(K.rows-1,((cy+R+14)/CH)|0);
 for(var r=r0;r<=r1;r++)for(var cc=c0;cc<=c1;cc++){var px=cc*CELL+CELL/2,py=r*CH+CH/2,dist=Math.hypot(px-cx,py-cy);if(dist<inner-CELL||dist>R+12)continue;
  var edge=1-(dist-(inner-CELL))/(R+12-(inner-CELL)),nz=Math.abs((Math.sin(cc*12.9898+r*78.233+tt)*43758.5453)%1);if(edge+nz*.5-.35<.3)continue;
  var o=(r*K.cols+cc)*4;x.fillStyle=edge<.35&&nz>.7?'rgba(255,179,173,.6)':'rgb('+d[o]+','+d[o+1]+','+d[o+2]+')';x.fillRect(cc*CELL,r*CH,CELL-1,CH-1)}}
var cur=null,tm=0,mx=-999,my=-999,lx=-999,ly=-999,raf=0;
function others(){return cur?cards.filter(function(c){return c.parentNode===cur.parentNode}):[]}
function loop(t){raf=0;if(!cur)return;lx+=(mx-lx)*.22;ly+=(my-ly)*.22;others().forEach(function(c){if(c.__k&&(c.__k.lensOn||true))draw(c,lx,ly,t)});raf=requestAnimationFrame(loop)}
function set(on){clearTimeout(tm);if(on&&!cur){lx=mx;ly=my}cur=on;
 cards.forEach(function(c){var other=on&&c.parentNode===on.parentNode;if(other){var K=prep(c);if(K){K.cv.offsetWidth;K.cv.classList.add('on')}}else if(c.__k)c.__k.cv.classList.remove('on')});
 if(on&&!raf)raf=requestAnimationFrame(loop)}
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
cards.forEach(function(c){c.addEventListener('mouseenter',function(){set(c)});c.addEventListener('mouseleave',function(){tm=setTimeout(function(){set(null)},90)})});
addEventListener('resize',function(){cards.forEach(function(c){if(c.__k)c.__k.W=0})});
})();

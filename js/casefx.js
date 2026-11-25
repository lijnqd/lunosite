/* case pages: the cover develops out of ascii on open (24 -> 15 -> 9 -> 5 -> photo), result numbers are
   pink ascii glyphs counting up from zero, page screenshots dissolve in column by column. */
(function(){var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;if(RM)return;
var DPR=Math.min(2,devicePixelRatio||1),RAMP=' .:-=+*#%@',PINK='#FFB3AD',MONO="'Sometype Mono',monospace";
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
/* 1. cover */
var fig=document.querySelector('.cx-cover'),im=fig&&fig.querySelector('img');
if(im){var cv=document.createElement('canvas'),x=cv.getContext('2d');cv.className='cx-dev';cv.setAttribute('aria-hidden','true');fig.appendChild(cv);
 function paint(cell){var W=fig.clientWidth,H=fig.clientHeight;if(cv.width!==Math.round(W*DPR)){cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR)}
  var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc,ox=(W-dw)/2,oy=(H-dh)/2,ch=cell<=5?cell:cell*1.3,c=Math.ceil(W/cell),r=Math.ceil(H/ch);
  var s=document.createElement('canvas');s.width=c;s.height=r;var q=s.getContext('2d',{willReadFrequently:true});q.drawImage(im,ox/cell,oy/ch,dw/cell,dh/ch);var d=q.getImageData(0,0,c,r).data;
  x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle='#141414';x.fillRect(0,0,W,H);x.font=Math.round(ch*.95)+'px '+MONO;x.textAlign='center';x.textBaseline='middle';
  for(var j=0;j<r;j++)for(var i=0;i<c;i++){var o=(j*c+i)*4,col='rgb('+d[o]+','+d[o+1]+','+d[o+2]+')';
   if(cell<=5){x.fillStyle=col;x.fillRect(i*cell,j*ch,cell,ch);continue}
   var L=(d[o]*.299+d[o+1]*.587+d[o+2]*.114)/255,g=RAMP[Math.min(9,Math.floor(L*10))];if(g===' ')continue;
   x.fillStyle=cell<15?col:'rgba(242,231,220,'+(.25+L*.7).toFixed(2)+')';x.fillText(g,i*cell+cell/2,j*ch+ch/2)}}
 var dec=im.decode?im.decode().catch(function(){}):Promise.resolve(),fnt=document.fonts&&document.fonts.load?document.fonts.load('12px '+MONO).catch(function(){}):Promise.resolve();
 Promise.all([dec,fnt]).then(async function(){if(!im.naturalWidth){cv.remove();return}
  for(var s of [24,15,9,5]){paint(s);await wait(170)}cv.classList.add('out');setTimeout(function(){cv.remove()},500)});
 setTimeout(function(){if(cv.isConnected&&!cv.classList.contains('out')){cv.classList.add('out');setTimeout(function(){cv.remove()},500)}},4000)}
/* 2. result numbers */
[].slice.call(document.querySelectorAll('.cx-num b')).forEach(function(b){var t=b.textContent.trim(),m=t.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);if(!m)return;
 var pre=m[1],end=parseFloat(m[2]),suf=m[3],c=document.createElement('canvas'),g=c.getContext('2d');c.className='cx-numcv';c.setAttribute('aria-hidden','true');b.classList.add('asc');b.appendChild(c);
 function draw(txt){var fs=parseFloat(getComputedStyle(b).fontSize),ff=getComputedStyle(b).fontFamily,W=Math.ceil(b.offsetWidth),H=Math.ceil(b.offsetHeight*1.15),cell=Math.max(5,Math.round(fs/14)),chh=Math.round(cell*1.45);
  if(c.width!==W*DPR){c.width=W*DPR;c.height=H*DPR;c.style.width=W+'px';c.style.height=H+'px'}
  var o=document.createElement('canvas');o.width=W;o.height=H;var p=o.getContext('2d',{willReadFrequently:true});p.font='400 '+fs+'px '+ff;p.textBaseline='alphabetic';p.fillStyle='#000';p.fillText(txt,0,fs*.82);
  var d=p.getImageData(0,0,W,H).data;g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,W,H);g.font=Math.round(chh*1.05)+'px '+MONO;g.textAlign='center';g.textBaseline='middle';g.fillStyle=PINK;
  for(var y=0;y<H;y+=chh)for(var xx=0;xx<W;xx+=cell){var s=0,n=0;for(var yy=y;yy<y+chh&&yy<H;yy+=2)for(var x2=xx;x2<xx+cell&&x2<W;x2+=2){s+=d[(yy*W+x2)*4+3];n++}var a=s/n/255;if(a<.12)continue;
   g.fillText(RAMP[Math.min(9,3+Math.round(a*6))],xx+cell/2,y+chh/2)}}
 var done=false;function run(){if(done)return;done=true;var t0=performance.now(),dec=(m[2].split('.')[1]||'').length;
  (function f(now){var k=Math.min(1,(now-t0)/1300),e=1-Math.pow(1-k,3);draw(pre+(end*e).toFixed(dec)+suf);if(k<1)requestAnimationFrame(f)})(t0)}
 (document.fonts?document.fonts.ready:Promise.resolve()).then(function(){draw(pre+(0).toFixed((m[2].split('.')[1]||'').length)+suf);
  new IntersectionObserver(function(es,io){if(es[0].isIntersecting){io.disconnect();setTimeout(run,250)}},{threshold:.4}).observe(b)});
 addEventListener('resize',function(){if(done)draw(t)})});
/* 3. screenshots: columns dissolve in one after another */
var pgs=[].slice.call(document.querySelectorAll('.cx-pg.rv'));pgs.forEach(function(f){f.__px=1});
if(pgs.length&&'IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var f=e.target;
  if(window.pxPix)[].slice.call(f.querySelectorAll('.pg-c')).forEach(function(c,i){window.pxPix(c,620,i*220)});f.classList.add('px-in','in')})},{rootMargin:'0px 0px 8% 0px'});
 pgs.forEach(function(f){io.observe(f)})}else pgs.forEach(function(f){f.classList.add('px-in','in')});
})();

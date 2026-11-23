/* home works: hover a name on the left square, its cover reveals in the right square; on touch screens it cycles by itself */
(function(){var w=document.getElementById('wk');if(!w)return;
var as=[].slice.call(w.querySelectorAll('.wk-list a[data-i]')),ims=[].slice.call(w.querySelectorAll('.wk-media img')),
 media=w.querySelector('.wk-media'),dd=w.querySelector('.wk-d'),tt=w.querySelector('.wk-t'),cc=w.querySelector('.wk-c'),
 list=w.querySelector('.wk-list'),cur=-1,z=1;
function pad(i){return(i<9?'0':'')+(i+1)}
function set(i){if(i===cur)return;var prev=cur;cur=i;var a=as[i];
 as.forEach(function(x,k){x.classList.toggle('on',k===i)});
 media.href=a.getAttribute('href');media.setAttribute('aria-label',a.textContent.trim()+' case study');dd.textContent=a.dataset.d;tt.textContent=a.dataset.t;cc.textContent=pad(i)+' / '+pad(as.length-1);
 var im=ims[i];if(im.loading==='lazy')im.loading='eager';
 ims.forEach(function(x,k){if(k!==i&&k!==prev)x.classList.remove('on','top')});
 if(prev>=0)ims[prev].classList.remove('top');
 im.classList.remove('on');im.style.zIndex=++z;im.offsetWidth;im.classList.add('on','top');
 if(prev>=0)ascii(im);
}
/* the new cover resolves out of ASCII: it is drawn in glyphs (the site's ramp, blocks for
   the brightest cells) that get finer and finer until they give way to the photo */
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,cv=null,raf=0;
var RAMP=' .:-=+*/%#',DPR=Math.min(2,window.devicePixelRatio||1),smp=document.createElement('canvas'),sx=smp.getContext('2d',{willReadFrequently:true});
function ascii(im){if(RM)return;cancelAnimationFrame(raf);
 if(!im.complete||!im.naturalWidth){im.addEventListener('load',function(){if(im.classList.contains('top'))ascii(im)},{once:true});return}
 if(!cv){cv=document.createElement('canvas');cv.className='wk-ascii';cv.setAttribute('aria-hidden','true');media.appendChild(cv)}
 var W=media.clientWidth,H=media.clientHeight;cv.width=W*DPR;cv.height=H*DPR;var x=cv.getContext('2d');x.setTransform(DPR,0,0,DPR,0,0);
 cv.style.opacity=1;var t0=performance.now(),D=620;
 (function f(now){var p=Math.min(1,(now-t0)/D),e=1-Math.pow(1-p,2);
  var cw=Math.max(5,28-23*e),ch=cw*1.45,cols=Math.ceil(W/cw),rows=Math.ceil(H/ch);
  smp.width=cols;smp.height=rows;sx.drawImage(im,0,0,cols,rows);var px=sx.getImageData(0,0,cols,rows).data;
  x.fillStyle='#141414';x.fillRect(0,0,W,H);x.fillStyle='#F2E7DC';x.font=Math.round(ch*.92)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';
  for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=(j*cols+i)*4,L=(px[k]*.299+px[k+1]*.587+px[k+2]*.114)/255;
   if(L>.82){x.globalAlpha=.55+.45*(L-.82)/.18;x.fillRect(i*cw+.5,j*ch+.5,cw-1,ch-1);x.globalAlpha=1;continue}
   var g=RAMP[Math.min(RAMP.length-1,Math.floor(L/.82*RAMP.length))];if(g!==' ')x.fillText(g,i*cw+cw/2,j*ch+ch/2)}
  cv.style.opacity=p<.7?1:Math.max(0,1-(p-.7)/.3);
  if(p<1)raf=requestAnimationFrame(f);else cv.style.opacity=0})(t0)}
as.forEach(function(a,k){a.addEventListener('mouseenter',function(){set(k)});a.addEventListener('focus',function(){set(k)})});
ims[0].classList.remove('on');set(0);
// touch screens: no hover, so the list steps through on its own while visible
if(!matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){var vis=false,t;
 if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(w);
 t=setInterval(function(){if(vis)set((cur+1)%as.length)},2800)}
})();

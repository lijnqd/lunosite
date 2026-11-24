/* cases page: cards ride a diagonal with the scroll, up from the bottom right corner to the top left.
   Card i sits at offset (i - progress) along the line: 0 is the middle of the screen, -1 a step up and
   left, +1 a step down and right; the travel is eased so the cards settle softly. */
(function(){var sec=document.getElementById('dg');if(!sec||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cs=[].slice.call(sec.querySelectorAll('.dg-card')),n=cs.length,ep=0,raf=0,vis=true;
function frame(){raf=0;if(innerWidth<810){cs.forEach(function(c){c.style.transform='';c.style.opacity=''});return}
 var r=sec.getBoundingClientRect(),z=r.height/(sec.offsetHeight||1)||1,st=sec.firstElementChild.offsetHeight*z,span=Math.max(1,r.height-st);
 var tp=Math.max(0,Math.min(1,-r.top/span))*(n-1);ep+=(tp-ep)*.12;if(Math.abs(tp-ep)<.001)ep=tp;
 var W=sec.firstElementChild.offsetWidth,H=sec.firstElementChild.offsetHeight,cw=cs[0].offsetWidth,chh=cs[0].offsetHeight,dx=cw+10,dy=chh+10;
 for(var i=0;i<n;i++){var o=i-ep,a=Math.abs(o);
  cs[i].style.transform='translate('+(o*dx).toFixed(1)+'px,'+(o*dy).toFixed(1)+'px)';
  cs[i].style.opacity=a>1.5?0:Math.min(1,1.5-a*.55).toFixed(3);cs[i].style.zIndex=10-Math.round(a*2);cs[i].style.visibility=a>1.6?'hidden':'visible'}
 if(ep!==tp&&vis)raf=requestAnimationFrame(frame)}
function go(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('scroll',go,{passive:true});addEventListener('resize',go);go();
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(sec)})();

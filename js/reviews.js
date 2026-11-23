/* reviews: a stack of paper notes — drag the top note away (or use the arrows) and it goes to the back */
(function(){var d=document.getElementById('ntDeck');if(!d)return;
var cs=[].slice.call(d.querySelectorAll('.nt-card')),n=cs.length,ord=cs.map(function(_,i){return i}),busy=false;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var tilt=[0,-3,2.4,-1.6,3];
function pose(c,k){c.style.zIndex=n-k;
 c.style.transform=k===0?'none':'translate3d('+(k*10)+'px,'+(k*12)+'px,0) rotate('+tilt[k%tilt.length]+'deg) scale('+(1-k*.025)+')';
 c.style.setProperty('--sh',k===0?1:0);c.style.setProperty('--k',k);c.setAttribute('aria-hidden',k===0?'false':'true');c.tabIndex=k===0?0:-1}
function lay(){ord.forEach(function(ci,k){var c=cs[ci];c.classList.remove('drag');c.style.transition='';pose(c,k)})}
function fly(dir){if(busy)return;busy=true;var c=cs[ord[0]],w=d.clientWidth;
 c.style.transition=RM?'none':'transform .5s cubic-bezier(.4,0,.2,1)';
 c.style.transform='translate3d('+(dir*w*1.15)+'px,'+(-40)+'px,0) rotate('+(dir*14)+'deg)';
 setTimeout(function(){ord.push(ord.shift());c.style.transition='none';c.style.zIndex=0;
  c.style.transform='translate3d('+(dir*w*1.15)+'px,-40px,0) rotate('+(dir*14)+'deg)';c.offsetWidth;
  lay();busy=false},RM?0:420)}
function back(){if(busy)return;busy=true;var ci=ord.pop(),c=cs[ci];ord.unshift(ci);
 c.style.transition='none';c.style.zIndex=n+1;c.style.transform='translate3d('+(-d.clientWidth*1.15)+'px,-40px,0) rotate(-14deg)';c.offsetWidth;
 lay();c.style.zIndex=n+1;setTimeout(function(){c.style.zIndex=n;busy=false},RM?0:500)}
document.querySelectorAll('.nt-b').forEach(function(b){b.addEventListener('click',function(){+b.dataset.d>0?fly(1):back()})});
d.addEventListener('keydown',function(e){if(e.key==='ArrowRight')fly(1);if(e.key==='ArrowLeft')back()});
// drag
var sx=0,sy=0,dx=0,dy=0,on=null,t0=0,pid=null;
d.addEventListener('pointerdown',function(e){var c=e.target.closest('.nt-card');if(!c||c!==cs[ord[0]]||busy||e.button>0)return;
 on=c;pid=e.pointerId;sx=e.clientX;sy=e.clientY;dx=dy=0;t0=performance.now();c.classList.add('drag');c.style.transition='none';c.setPointerCapture(pid)});
d.addEventListener('pointermove',function(e){if(!on||e.pointerId!==pid)return;dx=e.clientX-sx;dy=e.clientY-sy;
 on.style.transform='translate3d('+dx+'px,'+dy+'px,0) rotate('+(dx*.04)+'deg)'});
function up(e){if(!on||e.pointerId!==pid)return;var c=on;on=null;c.classList.remove('drag');
 var v=Math.abs(dx)/Math.max(1,performance.now()-t0);
 if(Math.abs(dx)>110||v>.6&&Math.abs(dx)>30)fly(dx>0?1:-1);
 else{c.style.transition='transform .45s cubic-bezier(.34,1.4,.64,1)';pose(c,0)}}
d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);
lay();})();

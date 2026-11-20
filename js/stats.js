/* stats: numbers count up from 1 to their final value when the block comes into view */
(function(){
var els=[].slice.call(document.querySelectorAll('.stats .st b'));if(!els.length)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;if(RM)return;
els.forEach(function(b){var t=b.firstChild;if(!t||t.nodeType!==3)return;var m=t.textContent.match(/^(\d+)(.*)$/);if(!m)return;
 b.__n=+m[1];b.__s=m[2];b.__t=t;t.textContent='1'+b.__s});
function run(b){if(!b.__t)return;var n=b.__n,d=Math.min(1600,500+n*25),t0=performance.now();
 (function f(now){var p=Math.min(1,(now-t0)/d),e=1-Math.pow(1-p,3);b.__t.textContent=Math.max(1,Math.round(1+(n-1)*e))+b.__s;if(p<1)requestAnimationFrame(f)})(t0)}
if(!('IntersectionObserver'in window)){els.forEach(run);return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);setTimeout(function(){run(e.target)},200)}})},{threshold:.6});
els.forEach(function(b){io.observe(b)});
})();

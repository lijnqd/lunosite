/* stats: the real numbers stay in the html (for search, previews and no-js); when the block scrolls in they count up from 0 */
(function(){
var els=[].slice.call(document.querySelectorAll('.stats .st b'));if(!els.length)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;if(RM)return;
els.forEach(function(b){var t=b.firstChild;if(!t||t.nodeType!==3)return;var m=t.textContent.match(/^(\d+)(.*)$/);if(!m)return;
 b.__n=+m[1];b.__s=m[2];b.__t=t});
function run(b){if(!b.__t)return;var n=b.__n,d=Math.min(1600,500+n*25),t0=performance.now();
 (function f(now){var p=Math.min(1,(now-t0)/d),e=1-Math.pow(1-p,3);b.__t.textContent=Math.round(n*e)+b.__s;if(p<1)requestAnimationFrame(f)})(t0)}
if(!('IntersectionObserver'in window)){els.forEach(run);return}
/* start as soon as the block's top enters the screen (checked on scroll; IO thresholds missed it under the zoomed layout) */
var sec=document.querySelector('.stats'),done=false;
function chk(){if(done)return;var r=sec.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){done=true;removeEventListener('scroll',chk);els.forEach(function(b,i){b.__t.textContent='0'+b.__s;setTimeout(function(){run(b)},i*90)})}}
addEventListener('scroll',chk,{passive:true});chk();
})();

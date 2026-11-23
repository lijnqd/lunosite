/* smooth scroll (Lenis, MIT) and page transitions.
   - wheel and trackpad scrolling eases; touch keeps the phone's own native scroll
   - links to #anchors on the same page glide there, under the fixed header
   - moving between pages: browsers with cross-document view transitions use the css ones
     (style.css, @view-transition); everywhere else a dark curtain with a pink edge rises
     over the page, the next page loads behind it, and the curtain lifts off
   reduced motion: none of this runs */
(function(){
var d=document,h=d.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(RM)return;
var lenis=null;
if(window.Lenis&&matchMedia('(hover:hover) and (pointer:fine)').matches){
 lenis=new Lenis({lerp:.11,wheelMultiplier:1,smoothWheel:true,syncTouch:false});
 window.lenis=lenis;
 (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
 /* the preloader locks the page; keep the smooth scroll still until it is gone */
 if(h.classList.contains('pre-lock')){lenis.stop();new MutationObserver(function(_,o){if(!h.classList.contains('pre-lock')){lenis.start();o.disconnect()}}).observe(h,{attributes:true,attributeFilter:['class']})}
}
/* same-page anchors */
d.addEventListener('click',function(e){
 var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
 var u;try{u=new URL(a.getAttribute('href'),location.href)}catch(err){return}
 if(u.origin!==location.origin)return;
 if(u.pathname===location.pathname&&u.hash){
  var t=d.getElementById(decodeURIComponent(u.hash.slice(1)));if(!t)return;
  e.preventDefault();history.pushState(null,'',u.hash);
  if(lenis)lenis.scrollTo(t,{offset:-70,duration:1.1});else t.scrollIntoView({behavior:'smooth'});
  return}
 /* another page of the site */
 if(u.pathname===location.pathname||'onpagereveal'in window)return;
 if(/\.(pdf|png|jpe?g|webp|zip)$/i.test(u.pathname))return;
 e.preventDefault();cover(function(){location.href=u.href})
},false);
/* the curtain */
function curtain(){var c=d.createElement('div');c.className='pt-curtain';d.body.appendChild(c);return c}
function cover(go){var c=curtain();c.offsetWidth;c.classList.add('in');try{sessionStorage.setItem('luno_pt','1')}catch(e){}setTimeout(go,520)}
function reveal(){var came=false;try{came=sessionStorage.getItem('luno_pt')==='1';sessionStorage.removeItem('luno_pt')}catch(e){}
 if(!came||'onpagereveal'in window)return;var c=curtain();c.classList.add('in','now');c.offsetWidth;c.classList.remove('now');
 requestAnimationFrame(function(){c.classList.add('out');setTimeout(function(){c.remove()},700)})}
reveal();
/* coming back with the back button from a page that was covered */
addEventListener('pageshow',function(e){if(e.persisted)d.querySelectorAll('.pt-curtain').forEach(function(c){c.remove()})});
})();

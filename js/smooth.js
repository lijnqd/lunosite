/* smooth scroll (Lenis, MIT) and page transitions.
   - wheel and trackpad scrolling eases; touch keeps the phone's own native scroll
   - links to #anchors on the same page glide there, under the fixed header
   - moving between pages: browsers with cross-document view transitions use the css ones
     (style.css, @view-transition); everywhere else a dark curtain with a pink edge rises
     over the page, the next page loads behind it, and the curtain lifts off
   reduced motion: none of this runs */
(function(){
var d=document,h=d.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* a dark fade under the fixed header once the page has moved, so text never runs into the logo and menu */
var fade=d.createElement('div');fade.className='hdr-fade';fade.setAttribute('aria-hidden','true');d.body.appendChild(fade);
function sc(){h.classList.toggle('scrolled',scrollY>40)}addEventListener('scroll',sc,{passive:true});sc();
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
/* menu items scramble into place on hover, the same glyphs as everywhere else */
if(matchMedia('(hover:hover) and (pointer:fine)').matches)d.querySelectorAll('.nav a,.f-cols a').forEach(function(a){a.addEventListener('mouseenter',function(){window.pxScramble&&pxScramble(a,360)})});
/* magnetic main buttons: they lean a few pixels toward the pointer and settle back */
if(matchMedia('(hover:hover) and (pointer:fine)').matches)d.querySelectorAll('.btn-pink,.btn-dark').forEach(function(b){
 b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform='translate('+(x*10).toFixed(1)+'px,'+(y*8).toFixed(1)+'px)'});
 b.addEventListener('mouseleave',function(){b.style.transform=''})});
/* back to top, at the end of every footer */
var ft=d.querySelector('.footer');if(ft&&!ft.querySelector('.to-top')){var tt=d.createElement('button');tt.type='button';tt.className='to-top';tt.textContent='[^] top';tt.setAttribute('aria-label','back to top');
 tt.addEventListener('click',function(){if(lenis)lenis.scrollTo(0,{duration:1.4});else scrollTo({top:0,behavior:'smooth'});var f=d.querySelector('a,button');f&&f.focus({preventScroll:true})});ft.appendChild(tt)}
/* a case cover flies into the case page (cross-document view transition, chrome and safari) */
d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="/cases/"],a[href^="cases/"]');if(!a)return;
 var im=a.matches('.wk-media')?a.querySelector('img.top')||a.querySelector('img.on'):a.querySelector('img');
 d.querySelectorAll('[style*="view-transition-name"]').forEach(function(x){x.style.viewTransitionName=''});
 if(im)im.style.viewTransitionName='case-cover'},true);
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

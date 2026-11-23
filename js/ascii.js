/* ascii art blocks run inline on a canvas (no iframes: Safari painted white boxes behind them).
   Each block's drawing code lives in /embeds/*.html; we fetch it once, pull out the canvas script
   and run it against our own canvas when the block comes near the viewport. */
(function(){
var els=[].slice.call(document.querySelectorAll('.ascii[data-src]'));if(!els.length)return;
var cache={};
function load(url){if(!cache[url])cache[url]=fetch(url).then(function(r){return r.text()}).then(function(h){
  var ss=h.match(/<script>([\s\S]*?)<\/script>/g)||[];
  for(var i=0;i<ss.length;i++){if(ss[i].indexOf("getElementById('canvas')")>-1)return ss[i].replace(/^<script>|<\/script>$/g,'')}
  return ''});return cache[url]}
function run(el){var src=el.getAttribute('data-src'),q=(src.split('?')[1]||'');
  if(el.hasAttribute('data-mobile')&&innerWidth<810)q+=(q?'&':'')+el.getAttribute('data-mobile');
  load(src.split('?')[0]+'?v=26').then(function(code){if(!code)return;
    var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');el.appendChild(cv);
    code=code.replace("document.getElementById('canvas')","__cv").replace("document.getElementById('container')","__cv.parentElement").replace(/location\.search/g,'__qs').replace(/parent\.innerWidth/g,'window.innerWidth');
    code+="\n;if(typeof checkContainer==='function')checkContainer();";var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,n=0,raf=RM?function(f){return ++n<40?requestAnimationFrame(f):0}:requestAnimationFrame.bind(window);try{new Function('__cv','__qs','requestAnimationFrame',code)(cv,'?'+q,raf)}catch(e){console.warn('ascii',e)}
    /* a block that was hidden (size 0) re-measures when it appears */
    if('ResizeObserver'in window){var w0=el.clientWidth;new ResizeObserver(function(){var w=el.clientWidth;if(w&&w!==w0){w0=w;dispatchEvent(new Event('resize'))}}).observe(el)}})}
var go=function(el){if(el.__on)return;el.__on=1;run(el)};
if('IntersectionObserver'in window){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){o.unobserve(e.target);go(e.target)}})},{rootMargin:'400px'});els.forEach(function(e){o.observe(e)})}
else els.forEach(go);
})();

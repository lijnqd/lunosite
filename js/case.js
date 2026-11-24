/* case pages: title letters rise in, sections reveal, cover settles on scroll, tall screenshots scroll inside their window */
(function(){
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var t=document.querySelector('.cx-title');
if(t&&!RM){var s=t.textContent;t.setAttribute('aria-label',s);t.textContent='';
 s.split('').forEach(function(c,i){var e=document.createElement('span');e.className='ch';e.setAttribute('aria-hidden','true');e.style.setProperty('--d',i);e.textContent=c===' '?' ':c;t.appendChild(e)});
 requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add('in')})})}
var rv=[].slice.call(document.querySelectorAll('.rv'));
if(RM||!('IntersectionObserver'in window))rv.forEach(function(e){e.classList.add('in')});
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});rv.forEach(function(e){io.observe(e)})}
/* before / after: a range input drives the split; works with mouse, touch and keyboard */
[].forEach.call(document.querySelectorAll('.cx-ba input'),function(i){var b=i.closest('.cx-ba');function u(){b.style.setProperty('--x',i.value+'%')}i.addEventListener('input',u);u()});
if(RM)return;
var cover=document.querySelector('.cx-cover'),talls=[].slice.call(document.querySelectorAll('.cx-tall'));
function cl(v){return v<0?0:v>1?1:v}
function frame(){var vh=innerHeight;
 if(cover){var r=cover.getBoundingClientRect(),p=cl((vh-r.top)/(vh+r.height*.5));cover.style.setProperty('--cs',(1.12-0.12*p).toFixed(4))}
 talls.forEach(function(f){var r=f.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;var w=f.querySelector('.cx-win'),im=w.firstElementChild,ov=im.offsetHeight-w.clientHeight;if(ov<=0)return;
  var p=cl((vh-r.top)/(vh+r.height));im.style.transform='translate3d(0,'+(-ov*p).toFixed(1)+'px,0)'})}
var tk=false;function req(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;frame()})}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('load',req);frame();
})();

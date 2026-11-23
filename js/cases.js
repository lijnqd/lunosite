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
 
}
as.forEach(function(a,k){a.addEventListener('mouseenter',function(){set(k)});a.addEventListener('focus',function(){set(k)})});
ims[0].classList.remove('on');set(0);
// touch screens: no hover, so the list steps through on its own while visible
if(!matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){var vis=false,t;
 if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(w);
 t=setInterval(function(){if(vis)set((cur+1)%as.length)},2800)}
})();

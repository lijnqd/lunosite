/* header nav: a beige plate slides to the hovered link (spring), rests on the current page */
(function(){
var n=document.querySelector('.header .nav');if(!n)return;
var ind=document.createElement('i');ind.className='nav-ind';n.insertBefore(ind,n.firstChild);
var links=[].slice.call(n.querySelectorAll('a')),p=location.pathname,cur=null;
links.forEach(function(a){var h=a.getAttribute('href')||'';if(h.charAt(0)==='/'&&h.indexOf('#')<0&&h.length>1&&p.indexOf(h)===0)cur=a});
function to(a,instant){links.forEach(function(l){l.classList.toggle('on',l===a)});
 if(!a){ind.classList.remove('go');return}
 if(instant||!ind.classList.contains('go')){ind.style.transition='none';}
 ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';
 ind.offsetWidth;ind.style.transition='';ind.classList.add('go')}
links.forEach(function(a){a.addEventListener('mouseenter',function(){to(a)});a.addEventListener('focus',function(){to(a)})});
n.addEventListener('mouseleave',function(){to(cur)});
function init(){to(cur,true)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(init);else init();
addEventListener('resize',function(){to(cur,true)});
})();

/* awards: hovering a row brings its certificate along with the cursor (desktop with a mouse only) */
(function(){var l=document.querySelector('.aw-list'),pv=document.querySelector('.aw-prev');if(!l||!pv||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,x=0,y=0,cx=0,cy=0,raf=0,on=false,cur=null;
[].forEach.call(l.querySelectorAll('.aw-row'),function(r){var im=new Image();im.decoding='async';im.alt='';im.src=r.dataset.img;pv.appendChild(im);
 r.addEventListener('mouseenter',function(){if(cur)cur.classList.remove('on');cur=im;im.classList.add('on');on=true;pv.classList.add('on');go()})});
l.addEventListener('mouseleave',function(){on=false;pv.classList.remove('on')});
addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;if(!cx&&!cy){cx=x;cy=y}if(on)go()},{passive:true});
function f(){raf=0;var k=RM?1:.16;cx+=(x-cx)*k;cy+=(y-cy)*k;var r=Math.max(-6,Math.min(6,(x-cx)*.04));
 pv.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0) translate(32px,-50%) rotate('+r.toFixed(2)+'deg)';if(on&&(Math.abs(x-cx)>.3||Math.abs(y-cy)>.3))go()}
function go(){if(!raf)raf=requestAnimationFrame(f)}})();

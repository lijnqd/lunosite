/* luna, the hero cat: her eyes follow the cursor, her head sways after it, she breathes;
   left alone for a while she dozes off ("zzz…") until the pointer moves again.
   Runs only while the hero is on screen. Reduced motion: eyes only, no sway. */
(function(){var w=document.querySelector('.hero-c .cat');if(!w)return;
var pet=w.querySelector('.cat-pet'),ir=w.querySelectorAll('.cat-iris'),say=w.querySelector('.cat-say'),txt=say.firstChild;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,ACTIVE='Luna, head of the studio',IDLE='zzz…';
var mx=0,my=0,has=false,px=0,py=0,vx=0,vy=0,ex=0,ey=0,last=performance.now(),asleep=false,vis=true,raf=0,t0=performance.now();
function setSay(a){if(asleep===a)return;asleep=a;say.classList.add('pop');setTimeout(function(){txt.textContent=a?IDLE:ACTIVE;say.classList.remove('pop')},120)}
function wake(x,y){mx=x;my=y;has=true;last=performance.now();setSay(false);go()}
addEventListener('pointermove',function(e){wake(e.clientX,e.clientY)},{passive:true});
addEventListener('pointerdown',function(e){wake(e.clientX,e.clientY)},{passive:true});
function frame(now){raf=0;if(!vis)return;
 if(now-last>7000)setSay(true);
 var r=w.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.58,tx=0,ty=0,lx=0,ly=0;
 if(has&&!asleep){var dx=mx-cx,dy=my-cy,d=Math.sqrt(dx*dx+dy*dy)||1,k=Math.min(1,d/(r.width*.45));lx=dx/d*k;ly=dy/d*k;
  var R=r.width*.06,f=Math.min(1,d/(r.width*1.6));tx=dx/d*f*R;ty=dy/d*f*R*.5}
 if(RM){tx=0;ty=0}
 vx+=(tx-px)*.045;vy+=(ty-py)*.045;vx*=.86;vy*=.86;px+=vx;py+=vy;
 var br=RM?0:Math.sin((now-t0)/(asleep?1500:900)),rot=Math.max(-6,Math.min(6,px/r.width*30+vx*.6));
 pet.style.transform='translate('+px.toFixed(2)+'px,'+(py+br*(asleep?2.5:1.2)).toFixed(2)+'px) rotate('+rot.toFixed(2)+'deg) scale('+(1+br*.006).toFixed(4)+','+(1-br*.006).toFixed(4)+')';
 /* asleep: the eyes drift down and in, as if half shut */
 var gx=asleep?0:lx*13,gy=asleep?6:ly*7;ex+=(gx-ex)*.2;ey+=(gy-ey)*.2;
 for(var i=0;i<ir.length;i++)ir[i].setAttribute('transform','translate('+ex.toFixed(2)+' '+ey.toFixed(2)+')');
 raf=requestAnimationFrame(frame)}
function go(){if(!raf&&vis)raf=requestAnimationFrame(frame)}
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(w);
document.addEventListener('visibilitychange',function(){if(!document.hidden)go()});go()})();

/* lunö cursor: a 10px beige dot that trails the pointer; over links/buttons it swells into a 48px frosted lens */
(function(){
if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
var d=document,c=d.createElement('div');c.id='cur';c.className='hide';d.body.appendChild(c);d.documentElement.classList.add('cur-on');
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var tx=-100,ty=-100,x=-100,y=-100,s=.2,ts=.2,seen=false;
var SEL='a,button,[role=button],label,select,summary,.folder,input[type=checkbox],input[type=submit]';
function look(t){
 var txt=t.closest&&t.closest('input:not([type=checkbox]):not([type=radio]):not([type=submit]),textarea');
 var lab=!txt&&t.closest&&t.closest('[data-cursor]'),big=!txt&&t.closest&&(lab||t.closest(SEL));ts=lab?1.5:big?1:.2;c.classList.toggle('big',!!big);c.classList.toggle('lab',!!lab);c.setAttribute('data-label',lab?lab.getAttribute('data-cursor'):'');c.classList.toggle('hide',!!txt)}
d.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(!seen){x=tx;y=ty;seen=true}look(e.target)},{passive:true});
/* the page can scroll under a still pointer: re-read what is under it */
addEventListener('scroll',function(){if(!seen)return;var t=d.elementFromPoint(tx,ty);if(t)look(t)},{passive:true});
addEventListener('message',function(e){var m=e.data;if(!m||m.luno!=='cur')return;
 var fr=[].filter.call(d.querySelectorAll('iframe'),function(f){return f.contentWindow===e.source})[0];if(!fr)return;
 var r=fr.getBoundingClientRect(),k=m.w?r.width/m.w:1;tx=r.left+m.x*k;ty=r.top+m.y*k;if(!seen){x=tx;y=ty;seen=true}
 ts=.2;c.classList.remove('big');c.classList.remove('hide')});
d.addEventListener('mouseleave',function(){c.classList.add('hide')});
d.documentElement.addEventListener('mouseenter',function(){c.classList.remove('hide')});
d.addEventListener('mousedown',function(){ts*=.8});
d.addEventListener('mouseup',function(){ts=ts<.5?.2:1});
var run=0;function loop(){var k=RM?1:.28;x+=(tx-x)*k;y+=(ty-y)*k;s+=(ts-s)*(RM?1:.18);
 c.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) scale('+s.toFixed(3)+')';
 if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(ts-s)*40>.15)run=requestAnimationFrame(loop);else run=0}
function kick(){if(!run)run=requestAnimationFrame(loop)}
['mousemove','mousedown','mouseup','message'].forEach(function(ev){addEventListener(ev,kick,{passive:true})});kick();
})();

/* services: ascii-art numerals; on desktop the block pins and steps 01 -> 03 with scroll */
(function(){
var sec=document.getElementById('services'),tr=document.getElementById('svcTrack');if(!sec||!tr)return;
var items=[].slice.call(sec.querySelectorAll('.svc-item')),cur=0;
var CH='01$#%&*+=<>/?ABCDEFGHJKLMNPQRSTUVWXYZ@';
/* ascii numerals */
var nums=[].slice.call(sec.querySelectorAll('.svc-num')).map(function(cv){
 var o={cv:cv,x:cv.getContext('2d'),t:cv.getAttribute('data-n'),cells:[]};return o});
function build(o){var cv=o.cv,w=cv.clientWidth,h=cv.clientHeight;if(!w)return;var dpr=Math.min(2,devicePixelRatio||1);
 cv.width=w*dpr;cv.height=h*dpr;o.w=w;o.h=h;o.dpr=dpr;
 var fs=Math.max(6,Math.round(h/15)),cw=fs*.6,lh=fs*.95;o.fs=fs;
 var m=document.createElement('canvas');m.width=w;m.height=h;var mx=m.getContext('2d');
 mx.fillStyle='#000';mx.font='italic 700 '+Math.round(h*1.18)+'px Inter, sans-serif';mx.textBaseline='alphabetic';
 mx.fillText(o.t,2,h*.97);mx.lineWidth=h*.07;mx.strokeStyle='#000';mx.lineJoin='round';mx.strokeText(o.t,2,h*.97);var d=mx.getImageData(0,0,w,h).data;o.cells=[];
 for(var y=0;y+lh<=h+1;y+=lh)for(var x=0;x+cw<=w;x+=cw){var px=Math.floor(x+cw/2),py=Math.floor(y+lh/2);
  if(d[(py*w+px)*4+3]>60)o.cells.push([x,y+lh*.82,CH[Math.random()*CH.length|0]])}}
function draw(o,shuffle){var x=o.x;if(!o.w)return;x.setTransform(o.dpr,0,0,o.dpr,0,0);x.clearRect(0,0,o.w,o.h);
 x.font='700 '+o.fs+'px "Sometype Mono", ui-monospace, monospace';x.fillStyle='#FFB3AD';
 for(var i=0;i<o.cells.length;i++){var c=o.cells[i];if(shuffle&&Math.random()<.06)c[2]=CH[Math.random()*CH.length|0];x.fillText(c[2],c[0],c[1])}}
function all(){nums.forEach(function(o){build(o);draw(o)})}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(all);
addEventListener('resize',function(){clearTimeout(all.t);all.t=setTimeout(function(){all();size();step()},150)});
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,vis=false;
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(sec);
if(!RM)setInterval(function(){if(vis)nums.forEach(function(o,i){if(i===cur||innerWidth<810)draw(o,true)})},140);
/* pinned stepping (desktop/tablet) */
function set(i){if(i===cur)return;cur=i;items.forEach(function(it,k){it.classList.toggle('on',k===i)})}
function z(){var r=parseFloat(getComputedStyle(document.querySelector('main')).zoom);return r>0?r:1}
var stick=sec.querySelector('.svc-stick'),STEP=.55;
function size(){if(innerWidth<810){tr.style.height='';return}
 var zz=z();tr.style.height=(stick.offsetHeight+2*STEP*innerHeight/zz)+'px'}
function step(){if(innerWidth<810){items.forEach(function(it){it.classList.add('on')});return}
 var r=tr.getBoundingClientRect(),sh=stick.getBoundingClientRect().height,run=r.height-sh;
 var pinTop=parseFloat(getComputedStyle(stick).top)*z(),p=run>0?(pinTop-r.top)/run:0;
 p=Math.max(0,Math.min(.999,p));set(Math.floor(p*3));
 if(cur>=0)items.forEach(function(it,k){it.classList.toggle('on',k===cur)})}
addEventListener('scroll',step,{passive:true});
items.forEach(function(it,k){it.querySelector('.svc-row').addEventListener('click',function(){if(innerWidth<810)return;
 var r=tr.getBoundingClientRect(),sh=stick.getBoundingClientRect().height,pinTop=parseFloat(getComputedStyle(stick).top)*z();
 scrollTo({top:scrollY+r.top-pinTop+(r.height-sh)*(k+.5)/3,behavior:'smooth'})})});
cur=-1;size();step();addEventListener('load',function(){size();step()});
})();

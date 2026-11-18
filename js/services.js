/* services: ascii-art numerals; on desktop the block pins and steps 01 -> 03 with scroll */
(function(){
var sec=document.getElementById('services'),tr=document.getElementById('svcTrack');if(!sec||!tr)return;
var items=[].slice.call(sec.querySelectorAll('.svc-item')),cur=0;
var CH='01$#%&*+=<>/?ABCDEFGHJKLMNPQRSTUVWXYZ@';
/* ascii numerals: sampled from an italic glyph, chars flicker and scatter away from the cursor */
var nums=[].slice.call(sec.querySelectorAll('.svc-num')).map(function(cv){return {cv:cv,x:cv.getContext('2d'),t:cv.getAttribute('data-n'),cells:[]}});
function build(o){var cv=o.cv,h=cv.clientHeight;if(!h)return;var dpr=Math.min(2,devicePixelRatio||1);
 var m=document.createElement('canvas'),mx=m.getContext('2d'),F='italic 700 '+Math.round(h*1.25)+'px Inter, sans-serif';
 mx.font=F;var pad=Math.round(h*.03),w=Math.ceil(mx.measureText(o.t).width+pad+h*.24);
 cv.style.width=w+'px';cv.width=w*dpr;cv.height=h*dpr;o.w=w;o.h=h;o.dpr=dpr;
 m.width=w;m.height=h;mx.font=F;mx.fillStyle='#000';mx.strokeStyle='#000';mx.lineJoin='round';mx.lineWidth=h*.06;
 var base=h*.94;mx.fillText(o.t,pad,base);mx.strokeText(o.t,pad,base);
 var d=mx.getImageData(0,0,w,h).data,fs=Math.max(6,Math.round(h/13)),cw=fs*.6,lh=fs*.95;o.fs=fs;o.cells=[];
 for(var y=0;y+lh<=h;y+=lh)for(var x=0;x+cw<=w;x+=cw){var px=Math.floor(x+cw/2),py=Math.floor(y+lh/2);
  if(d[(py*w+px)*4+3]>60)o.cells.push({x:x,y:y+lh*.82,dx:0,dy:0,vx:0,vy:0,c:CH[Math.random()*CH.length|0]})}
 var mn=1e9,mxx=0;o.cells.forEach(function(c){mn=Math.min(mn,c.x);mxx=Math.max(mxx,c.x+cw)});if(o.cells.length&&mn>0){o.cells.forEach(function(c){c.x-=mn});var nw=Math.ceil(mxx-mn+2);cv.style.width=nw+'px';cv.width=nw*dpr;o.w=nw}}
var mxp=-1e4,myp=-1e4;document.addEventListener('mousemove',function(e){mxp=e.clientX;myp=e.clientY},{passive:true});
function draw(o,t){var x=o.x;if(!o.w)return;var r=o.cv.getBoundingClientRect(),k=r.width/o.w||1,lx=(mxp-r.left)/k,ly=(myp-r.top)/k,R=o.h*.45,moving=false;
 x.setTransform(o.dpr,0,0,o.dpr,0,0);x.clearRect(0,0,o.w,o.h);x.font='700 '+o.fs+'px "Sometype Mono", ui-monospace, monospace';x.fillStyle='#FFB3AD';
 for(var i=0;i<o.cells.length;i++){var c=o.cells[i],ex=c.x+c.dx-lx,ey=c.y+c.dy-ly,dd=Math.sqrt(ex*ex+ey*ey);
  if(dd<R&&dd>0.1){var f=(1-dd/R)*2.2;c.vx+=ex/dd*f;c.vy+=ey/dd*f}
  c.vx+=-c.dx*.06;c.vy+=-c.dy*.06;c.vx*=.82;c.vy*=.82;c.dx+=c.vx;c.dy+=c.vy;
  if(Math.abs(c.dx)>.3||Math.abs(c.dy)>.3)moving=true;
  if(t&&Math.random()<.02)c.c=CH[Math.random()*CH.length|0];
  x.fillText(c.c,c.x+c.dx,c.y+c.dy)}return moving}
function all(){nums.forEach(function(o){build(o);draw(o)})}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(all);
addEventListener('resize',function(){clearTimeout(all.t);all.t=setTimeout(function(){all();size();step()},150)});
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,vis=false,last=0;
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(sec);else vis=true;
(function loop(now){requestAnimationFrame(loop);if(!vis||RM)return;var fl=now-last>120;if(fl)last=now;
 nums.forEach(function(o){draw(o,fl)})})(0);
/* pinned stepping (desktop/tablet) */
function set(i){if(i===cur)return;cur=i;items.forEach(function(it,k){it.classList.toggle('on',k===i)})}
function z(){var r=parseFloat(getComputedStyle(document.querySelector('main')).zoom);return r>0?r:1}
var stick=sec.querySelector('.svc-stick'),STEP=.8;
function size(){if(innerWidth<810){tr.style.height='';return}
 var zz=z();tr.style.height=(stick.offsetHeight+3*STEP*innerHeight/zz)+'px'}
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

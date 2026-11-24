/* about: Yana's face as a halftone of round dots, the same style as the hero cat (on the dark
   card the dots are beige and grow with how light the drawing is, so her lines read as gaps).
   The svg (eye whites, irises that follow the cursor, lids that blink, the drawing on top) stays
   the source: each time an iris or lid moves, its layers are drawn into a small canvas in the svg's
   own coordinates, and every grid cell gets one dot sized by how dark it is. Under the cursor the
   dots make way. The svg stays as the no-js / reduced-motion picture. */
(function(){var w=document.querySelector('.ab-face');if(!w)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;if(RM)return;
var svg=w.querySelector('.pet-svg'),pet=w.querySelector('.pet'),VW=1110,VH=1125,INK='#F2E7DC';
var cv=document.createElement('canvas');cv.className='face-cv';cv.setAttribute('aria-hidden','true');pet.insertBefore(cv,pet.firstChild);
var x=cv.getContext('2d'),sm=document.createElement('canvas'),sx=sm.getContext('2d',{willReadFrequently:true}),DPR=Math.min(2,devicePixelRatio||1);
var W=0,H=0,cell=8,cols=0,rows=0,SS=3,imgs={},ready=false,key='',lx=-1e4,ly=-1e4,hv=0,hvT=0,raf=0,vis=true,lo=0,hi=1;
function num(e,a){return +e.getAttribute(a)||0}
function tr(e){var t=e.getAttribute('transform')||'',m=t.match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/);return m?[+m[1],+m[2]]:[0,0]}
function pts(s){return s.trim().split(/\s+/).map(function(p){return p.split(',').map(Number)})}
function poly(g,a,close){g.beginPath();a.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});if(close)g.closePath()}
/* draw the svg's layers into the sampling canvas, in viewBox units */
function layers(g){[].forEach.call(svg.children,function(e){var t=e.tagName.toLowerCase();
 if(t==='image'){var im=imgs[e.getAttribute('href')];if(!im)return;var o=tr(e);g.drawImage(im,num(e,'x')+o[0],num(e,'y')+o[1],num(e,'width'),num(e,'height'))}
 else if(t==='g'){var cp=(e.getAttribute('clip-path')||'').match(/#([^)]+)/),pl=cp&&svg.querySelector('#'+cp[1]+' polygon');g.save();
  if(pl){poly(g,pts(pl.getAttribute('points')),true);g.clip()}
  [].forEach.call(e.querySelectorAll('.lid'),function(l){var o=tr(l);g.save();g.translate(o[0],o[1]);
   [].forEach.call(l.children,function(c){var n=c.tagName.toLowerCase(),f=c.getAttribute('fill'),s=c.getAttribute('stroke');
    if(n==='rect'){g.fillStyle=f;g.fillRect(num(c,'x'),num(c,'y'),num(c,'width'),num(c,'height'))}
    else{poly(g,pts(c.getAttribute('points')),n==='polygon');if(f&&f!=='none'){g.fillStyle=f;g.fill()}if(s){g.strokeStyle=s;g.lineWidth=num(c,'stroke-width');g.lineJoin='round';g.stroke()}}});g.restore()});
  g.restore()}})}
function size(){var r=svg.getBoundingClientRect(),z=r.width/(svg.clientWidth||r.width)||1;W=svg.clientWidth||r.width;H=svg.clientHeight||r.height;if(!W)return;
 cell=Math.max(5,Math.round(W/78));cols=Math.floor(W/cell);rows=Math.floor(H/cell);
 cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cv.style.width=W+'px';cv.style.height=H+'px';sm.width=cols*SS;sm.height=rows*SS;key='';lo=-1}
function render(){var k=[].map.call(svg.querySelectorAll('.iris,.lid'),function(e){return e.getAttribute('transform')||''}).join('|')+'|'+hv.toFixed(2)+'|'+lx.toFixed(0)+','+ly.toFixed(0);
 if(k===key)return;key=k;
 sx.setTransform(1,0,0,1,0,0);sx.clearRect(0,0,sm.width,sm.height);sx.setTransform(sm.width/VW,0,0,sm.height/VH,0,0);layers(sx);
 var d=sx.getImageData(0,0,sm.width,sm.height).data,N=SS*SS,D=new Float32Array(cols*rows).fill(-1);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var a=0,l=0;for(var v=0;v<SS;v++)for(var u=0;u<SS;u++){var o=((j*SS+v)*sm.width+i*SS+u)*4,al=d[o+3]/255;a+=al;l+=al*(d[o]*.3+d[o+1]*.59+d[o+2]*.11)/255}
  a/=N;if(a<.35)continue;D[j*cols+i]=l/(a*N)}
 /* contrast set once, from the drawing's own range */
 if(lo<0){var vs=[].slice.call(D).filter(function(v){return v>=0}).sort(function(p,q){return p-q});lo=vs[Math.floor(vs.length*.06)]||0;hi=vs[Math.floor(vs.length*.9)]||1}
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);x.fillStyle=INK;x.beginPath();
 for(j=0;j<rows;j++)for(i=0;i<cols;i++){var E=D[j*cols+i];if(E<0)continue;var tn=(E-lo)/(hi-lo);tn=tn<0?0:tn>1?1:tn;
  var rr=cell*.5*1.22*Math.pow(tn,.62);if(rr<cell*.12)continue;var cx=(i+.5)*cell,cy=(j+.5)*cell;
  if(hv>.01){var dx=cx-lx,dy=cy-ly,dd=Math.sqrt(dx*dx+dy*dy)||1,RR=W*.18;if(dd<RR){var ff=Math.pow(1-dd/RR,2)*hv;cx+=dx/dd*ff*cell*3;cy+=dy/dd*ff*cell*3}}
  x.moveTo(cx+rr,cy);x.arc(cx,cy,rr,0,6.2832)}
 x.fill()}
addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),z=r.width/W||1;lx=(e.clientX-r.left)/z;ly=(e.clientY-r.top)/z;hvT=(lx>-20&&ly>-20&&lx<W+20&&ly<H+20)?1:0},{passive:true});
function frame(){raf=0;if(!vis)return;hv+=(hvT-hv)*.15;if(hv<.005)hv=0;if(ready)render();raf=requestAnimationFrame(frame)}
function go(){if(!raf&&vis)raf=requestAnimationFrame(frame)}
var hrefs=[].map.call(svg.querySelectorAll('image'),function(e){return e.getAttribute('href')});
Promise.all(hrefs.map(function(h){return new Promise(function(res){var i=new Image();i.onload=function(){imgs[h]=i;res()};i.onerror=res;i.src=h})})).then(function(){
 size();ready=true;w.classList.add('ht');go()});
addEventListener('resize',function(){size();go()});
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(w);
})();

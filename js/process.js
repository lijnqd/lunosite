/* process: a drum of steps turned by the scroll. The page progress through the pinned block picks
   the step on the centre line; the drum eases toward it, so it settles softly. The active number is
   drawn in pink glyphs: when the step changes the glyphs scatter and re-form into the new number,
   and while it rests a few glyphs keep flickering. Paused off screen. Reduced motion: a plain list. */
(function(){var sec=document.querySelector('.process.pw');if(!sec)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;if(RM)return;
var st=[].slice.call(sec.querySelectorAll('.pw-step')),n=st.length,drum=sec.querySelector('.pw-drum'),cv=sec.querySelector('.pw-asc'),x=cv.getContext('2d');
var cur=0,shown=-1,raf=0,vis=false,row=150,DPR=Math.min(2,devicePixelRatio||1),W=0,H=0,cell=6,cols=0,rows=0,from=null,to=null,t0=0,last=0;
var GL='#%*+=:.',SC='#%&*+=<>/\\|~^01';
function hash(k){var h=(k*374761393)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cell=W<80?4:W<130?5:6;cols=Math.ceil(W/cell);rows=Math.ceil(H/(cell*1.4));
 row=parseFloat(getComputedStyle(drum).getPropertyValue('--row'))||150;if(shown>=0){to=grid(st[shown].querySelector('.pw-n').textContent);from=null}}
/* the number as coverage per cell, from the serif at the number's size */
function grid(txt){var o=document.createElement('canvas'),g=o.getContext('2d');o.width=cols*4;o.height=rows*4;
 var fs=parseFloat(getComputedStyle(st[0].querySelector('.pw-n')).fontSize)||64;g.scale(o.width/W,o.height/H);
 var F=fs*1.45;g.fillStyle='#000';g.strokeStyle='#000';g.lineWidth=F*.05;g.lineJoin='round';g.font=F+'px "Instrument Serif", serif';g.textBaseline='alphabetic';g.fillText(txt,4,H*.5+F*.34);g.strokeText(txt,4,H*.5+F*.34);
 var d=g.getImageData(0,0,o.width,o.height).data,out=new Float32Array(cols*rows);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var s=0;for(var v=0;v<4;v++)for(var u=0;u<4;u++)s+=d[((j*4+v)*o.width+i*4+u)*4+3];out[j*cols+i]=s/(16*255)}
 return out}
function paint(now){var ch=cell*1.4,p=from?Math.min(1,(now-t0)/520):1;
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);x.fillStyle='#FFB3AD';x.textAlign='center';x.textBaseline='middle';x.font='600 '+Math.round(ch*.95)+"px 'Sometype Mono',monospace";
 for(var k=0;k<cols*rows;k++){var h=hash(k),c=to[k],moving=false;
  if(from){var sw=h*.6;if(p<sw+.4){c=p<sw?from[k]:Math.max(from[k],to[k]);moving=p>=sw-.15&&p<sw+.4&&(from[k]>.2||to[k]>.2)}}
  if(c<.18&&!moving)continue;
  var g=moving||hash(k+Math.floor(now/140)*7919)>.985?SC[(k+(now/60|0))%SC.length]:GL[Math.max(0,Math.min(GL.length-1,Math.floor((1-c)*GL.length)))];
  x.globalAlpha=moving?.75:c>.55?1:.6;x.fillText(g,(k%cols+.5)*cell,(Math.floor(k/cols)+.5)*ch)}
 x.globalAlpha=1;if(p>=1)from=null}
var ep=0,tp=0;
function frame(now){raf=0;if(!vis)return;
 var r=sec.getBoundingClientRect(),span=Math.max(1,r.height-innerHeight);tp=Math.max(0,Math.min(1,-r.top/span))*(n-1);
 ep+=(tp-ep)*.14;if(Math.abs(tp-ep)<.001)ep=tp;
 var a=Math.round(ep);if(a!==cur||shown<0){if(shown>=0)st[shown].classList.remove('on');st[a].classList.add('on');
  var nt=grid(st[a].querySelector('.pw-n').textContent);from=to||nt.map(function(){return 0});to=nt;t0=now;cur=a;shown=a}
 for(var i=0;i<n;i++){var off=i-ep,ao=Math.abs(off);
  st[i].style.transform='translate3d(0,'+(off*row*(1-.08*Math.min(ao,3))).toFixed(1)+'px,0) rotateX('+(-off*30).toFixed(2)+'deg)';
  st[i].style.opacity=Math.max(0,1-ao*.62).toFixed(3);st[i].style.setProperty('--po',Math.max(0,1-ao*2.2).toFixed(3))}
 if(now-last>60||from){paint(now);last=now}
 raf=requestAnimationFrame(frame)}
function go(){if(!raf&&vis)raf=requestAnimationFrame(frame)}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){size();
 if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(sec);else{vis=true;go()}});
addEventListener('resize',function(){size();go()})})();

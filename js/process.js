/* process: the steps sit around a wheel that the scroll turns all the way round (after the last
   step the first comes back up from below). The front step is lit; its neighbours tilt away and fade;
   the rest are behind the wheel. Every number is drawn in pink glyphs; the front number keeps a few
   glyphs flickering. Paused off screen. Reduced motion: a plain list, numbers still in glyphs. */
(function(){var sec=document.querySelector('.process.pw');if(!sec)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var st=[].slice.call(sec.querySelectorAll('.pw-step')),n=st.length,drum=sec.querySelector('.pw-drum'),DPR=Math.min(2,devicePixelRatio||1);
var nums=st.map(function(s){return{cv:s.querySelector('.pw-num'),g:null,cols:0,rows:0,cell:6,W:0,H:0}}),R=190,raf=0,vis=false,act=-1,last=0,ep=0;
var GL='#%*+=:.',SC='#%&*+=/\\|~^01';
function hash(k){var h=(k*374761393)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
/* a number as glyph coverage per cell, from the serif, slightly thickened so thin strokes survive */
function build(o){var cv=o.cv,r=cv.getBoundingClientRect();o.W=r.width;o.H=r.height;if(!o.W)return;cv.width=Math.round(o.W*DPR);cv.height=Math.round(o.H*DPR);
 o.cell=o.W<80?4:o.W<130?5:6;o.cols=Math.ceil(o.W/o.cell);o.rows=Math.ceil(o.H/(o.cell*1.4));
 var c=document.createElement('canvas'),g=c.getContext('2d');c.width=o.cols*4;c.height=o.rows*4;g.scale(c.width/o.W,c.height/o.H);
 var F=o.H*1.02;g.fillStyle=g.strokeStyle='#000';g.lineWidth=F*.05;g.lineJoin='round';g.font=F+'px "Instrument Serif", serif';g.textBaseline='alphabetic';
 g.fillText(cv.dataset.n,2,o.H*.86);g.strokeText(cv.dataset.n,2,o.H*.86);
 var d=g.getImageData(0,0,c.width,c.height).data;o.g=new Float32Array(o.cols*o.rows);
 for(var j=0;j<o.rows;j++)for(var i=0;i<o.cols;i++){var s=0;for(var v=0;v<4;v++)for(var u=0;u<4;u++)s+=d[((j*4+v)*c.width+i*4+u)*4+3];o.g[j*o.cols+i]=s/(16*255)}}
function paint(o,on,now){if(!o.g)return;var x=o.cv.getContext('2d'),ch=o.cell*1.4;x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,o.W,o.H);
 x.fillStyle='#FFB3AD';x.textAlign='center';x.textBaseline='middle';x.font='600 '+Math.round(ch*.95)+"px 'Sometype Mono',monospace";
 var tick=Math.floor(now/120);
 for(var k=0;k<o.g.length;k++){var c=o.g[k];if(c<.18)continue;
  var fl=on&&!RM&&hash(k*31+tick*7919)>.96;
  x.globalAlpha=c>.55?1:.65;x.fillText(fl?SC[(k+tick)%SC.length]:GL[Math.max(0,Math.min(GL.length-1,Math.floor((1-c)*GL.length)))],(k%o.cols+.5)*o.cell,(Math.floor(k/o.cols)+.5)*ch)}}
function size(){R=parseFloat(getComputedStyle(drum).getPropertyValue('--r'))||190;nums.forEach(build);var now=performance.now();nums.forEach(function(o,i){paint(o,i===act,now)})}
function frame(now){raf=0;if(!vis)return;
 var r=sec.getBoundingClientRect(),z=r.height/(sec.offsetHeight||1)||1,sh=sec.querySelector('.pw-stage').offsetHeight*z,span=Math.max(1,r.height-sh),top=(innerHeight-sh)/2;
 var tp=Math.max(0,Math.min(1,(top-r.top)/span))*(n-1);ep+=(tp-ep)*.14;if(Math.abs(tp-ep)<.001)ep=tp;
 var a=((Math.round(ep)%n)+n)%n;
 if(a!==act){if(act>=0){st[act].classList.remove('on');paint(nums[act],false,now)}act=a;st[a].classList.add('on')}
 /* the steps ride a big dial whose centre is far to the left: the front step sits furthest right
    and level; the ones above and below swing left along the arc and tilt with it (top one leans up,
    bottom one leans down). The order wraps, so after the last step the first comes round again */
 var Rd=innerWidth<810?760:1150,stepA=10;
 for(var i=0;i<n;i++){var off=i-ep;var ang=off*stepA,rad=ang*Math.PI/180,ao=Math.abs(off);
  st[i].style.transform='translate('+((Math.cos(rad)-1)*Rd*(innerWidth<810?.6:3)).toFixed(1)+'px,'+(Math.sin(rad)*Rd).toFixed(1)+'px) rotate('+ang.toFixed(2)+'deg)';
  st[i].style.opacity=ao>1.5?0:Math.max(0,1-ao*.58).toFixed(3);st[i].style.visibility=ao>1.5?'hidden':'visible';st[i].style.setProperty('--po',Math.max(.35,1-ao*.65).toFixed(3))}
 if(now-last>120){paint(nums[act],true,now);last=now}
 raf=requestAnimationFrame(frame)}
function go(){if(!raf&&vis)raf=requestAnimationFrame(frame)}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){size();
 if(RM){nums.forEach(function(o){paint(o,false,0)});return}
 if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(sec);else{vis=true;go()}});
addEventListener('resize',function(){size();go()})})();

/* case cards on hover (desktop): the cover breaks into ascii on a grid that steps finer, then comes back. */
(function(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var V={set:'set',midas:'midas',beeyawn:'beeyawn',orta:'orta','project-54':'p54',form:'form'};
var cards=[].slice.call(document.querySelectorAll('.dg-card,.cs-card,.cs-full'));if(!cards.length)return;
var RAMP=' .:-=+*/%#',DPR=Math.min(2,devicePixelRatio||1),STEPS=[22,13,7];
cards.forEach(function(c){var m=(c.getAttribute('href')||'').match(/cases\/([a-z0-9-]+)\//),key=m&&V[m[1]];if(!key)return;
 var box=c.querySelector('.cs-img')||c,im=box.querySelector('img');if(!im)return;
 var cv=null,t=[],on=false;
 if(getComputedStyle(box).position==='static')box.style.position='relative';
 function clear(){t.forEach(clearTimeout);t=[]}
 function ascii(cell){var W=box.clientWidth,H=box.clientHeight;if(!cv){cv=document.createElement('canvas');cv.className='ch-asc';cv.setAttribute('aria-hidden','true');box.appendChild(cv)}
  cv.width=W*DPR;cv.height=H*DPR;var x=cv.getContext('2d'),s=document.createElement('canvas'),q=s.getContext('2d',{willReadFrequently:true});
  var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc,ox=(W-dw)/2,oy=(H-dh)/2,cw=cell,ch=cell*1.5,cols=Math.ceil(W/cw),rows=Math.ceil(H/ch);
  s.width=cols;s.height=rows;q.drawImage(im,ox/cw,oy/ch,dw/cw,dh/ch);var px=q.getImageData(0,0,cols,rows).data;
  x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle='#141414';x.fillRect(0,0,W,H);x.fillStyle='#FFB3AD';x.font=Math.round(ch*.9)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';
  for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=(j*cols+i)*4,L=(px[k]*.299+px[k+1]*.587+px[k+2]*.114)/255;var g=RAMP[Math.min(RAMP.length-1,Math.floor(L*RAMP.length))];if(g!==' ')x.fillText(g,i*cw+cw/2,j*ch+ch/2)}
  cv.style.opacity=1}
 c.addEventListener('mouseenter',function(){on=true;clear();if(!im.complete)return;
  STEPS.forEach(function(s,i){t.push(setTimeout(function(){if(on)ascii(s)},i*130))});
  t.push(setTimeout(function(){if(on&&cv)cv.style.opacity=0},STEPS.length*130))});
 c.addEventListener('mouseleave',function(){on=false;clear();if(cv)cv.style.opacity=0;});
});})();

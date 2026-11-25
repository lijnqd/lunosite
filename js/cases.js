/* home cases: one full screen per case. Each card sticks and the next slides over it;
   a covered card shrinks a little and dims. The first time a cover comes into view it
   develops out of ascii: the photo is drawn in glyphs on a coarse grid that steps finer
   (24 → 15 → 9 → 5 px cells), then the real photo fades in over it. The steps are
   deliberate, like a picture resolving, not noise. Reduced motion: plain photo. */
(function(){var st=document.getElementById('csStack');if(!st)return;
var cs=[].slice.call(st.querySelectorAll('.cs-card')),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,tick=0;
function f(){tick=0;var R=st.getBoundingClientRect();if(R.bottom<0||R.top>innerHeight)return;
 for(var i=0;i<cs.length-1;i++){var a=cs[i].getBoundingClientRect(),b=cs[i+1].getBoundingClientRect(),p=1-Math.max(0,Math.min(1,(b.top-a.top)/(a.height||1)));
  if(!RM){cs[i].style.transform='scale('+(1-p*.06).toFixed(4)+')';cs[i].style.setProperty('--dim',(p*.55).toFixed(3))}}}
function req(){if(!tick)tick=requestAnimationFrame(f)}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);f();
if(RM||!('IntersectionObserver'in window))return;
var RAMP=' .:-=+*/%#',DPR=Math.min(2,devicePixelRatio||1),STEPS=[24,15,9,5],STEP_MS=130;
function develop(card){var box=card.querySelector('.cs-img'),im=box.querySelector('img');
 function go(){var W=box.clientWidth,H=box.clientHeight;if(!W||!H)return;
  var cv=document.createElement('canvas');cv.className='cs-asc';cv.setAttribute('aria-hidden','true');cv.width=W*DPR;cv.height=H*DPR;box.appendChild(cv);
  var x=cv.getContext('2d'),smp=document.createElement('canvas'),sx=smp.getContext('2d',{willReadFrequently:true});
  /* the photo's own crop (object-fit:cover), sampled once per step */
  var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc,ox=(W-dw)/2,oy=(H-dh)/2;
  function draw(cell){var cw=cell,ch=cell*1.5,cols=Math.ceil(W/cw),rows=Math.ceil(H/ch);smp.width=cols;smp.height=rows;
   sx.drawImage(im,ox/cw,oy/ch,dw/cw,dh/ch);var px=sx.getImageData(0,0,cols,rows).data;
   x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle='#141414';x.fillRect(0,0,W,H);x.fillStyle='#F2E7DC';
   x.font=Math.round(ch*.9)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';
   for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=(j*cols+i)*4,L=(px[k]*.299+px[k+1]*.587+px[k+2]*.114)/255;
    if(L>.86){x.fillRect(i*cw+.5,j*ch+.5,cw-1,ch-1);continue}
    var g=RAMP[Math.min(RAMP.length-1,Math.floor(L/.86*RAMP.length))];if(g!==' ')x.fillText(g,i*cw+cw/2,j*ch+ch/2)}}
  im.style.opacity=0;var n=0;
  (function next(){if(n<STEPS.length){draw(STEPS[n++]);setTimeout(next,STEP_MS);return}
   im.style.transition='opacity .4s cubic-bezier(.2,.7,.2,1)';im.style.opacity=1;cv.style.transition='opacity .4s';cv.style.opacity=0;
   setTimeout(function(){cv.remove();im.style.transition=''},450)})()}
 if(im.complete&&im.naturalWidth)go();else{im.loading='eager';im.addEventListener('load',go,{once:true})}}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);develop(e.target)}})},{threshold:.35});
/* the first cover is developed by the page flow (js/flow.js) instead */
cs.forEach(function(c){if(!c.hasAttribute('data-flow'))io.observe(c)});
})();

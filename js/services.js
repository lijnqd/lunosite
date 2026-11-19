/* services (desktop/tablet): the block pins; a huge serif "#our services" drifts sideways behind,
   its letters rise in on entry, and the three glass cards slide up from below one after another */
(function(){
var sec=document.getElementById('services'),tr=document.getElementById('svTrack'),mq=document.getElementById('svMq');if(!sec||!tr||!mq)return;
var stage=sec.querySelector('.sv-stage'),cards=[].slice.call(sec.querySelectorAll('.sv-card'));
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* split marquee words into letters */
var letters=[];[].forEach.call(mq.children,function(w){if(!w.classList.contains('sv-w')){letters.push(w);return}var t=w.textContent;w.textContent='';
 t.split('').forEach(function(ch){var s=document.createElement('span');s.textContent=ch;if(ch===' ')s.style.width='.25em';w.appendChild(s);letters.push(s)})});
function z(){var r=parseFloat(getComputedStyle(document.querySelector('main')).zoom);return r>0?r:1}
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return 1-Math.pow(1-v,3)}
var RUN=1.7,lx=[];
function measure(){var b=mq.getBoundingClientRect().left;lx=letters.map(function(l){var t=l.style.transform;l.style.transform='';var r=l.getBoundingClientRect().left-b;l.style.transform=t;return r/z()})}
function size(){measure();if(innerWidth<810){tr.style.height='';return}tr.style.height=(innerHeight/z()*(1+RUN))+'px'}
function frame(){
 if(innerWidth<810){cards.forEach(function(c){c.style.transform=''});letters.forEach(function(l){l.style.transform=''});mq.style.transform='';return}
 var r=tr.getBoundingClientRect(),vh=innerHeight,run=r.height-vh;
 var p=run>0?cl(-r.top/run):0,q=cl((vh-r.top)/vh);
 var mw=mq.scrollWidth*z();
 mq.style.transform='translate3d('+(-(p*0.55+q*0.08)*mw/3).toFixed(1)+'px,0,0)';
 var LH=mq.offsetHeight*0.95,tx=-(p*0.55+q*0.08)*mw/3,vw=innerWidth,zz=z(),amp=1-ease(cl((p-0.04)/0.32));
 letters.forEach(function(l,k){var x=(lx[k]||0)*zz+tx,u=cl((x-vw*.18)/(vw*.8));if(RM)u=0;
  var y=(Math.pow(u,1.35)*1.7+Math.sin(u*Math.PI)*.18*u)*amp*LH;l.style.transform='translate3d(0,'+y.toFixed(1)+'px,0)'});
 cards.forEach(function(c,i){var t=RM?1:ease(cl((p-0.05-i*0.13)/0.42));c.style.transform='translate3d(0,'+((1-t)*vh/z()*0.95).toFixed(1)+'px,0)'});
}
var tick=false;function req(){if(!tick){tick=true;requestAnimationFrame(function(){tick=false;frame()})}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){size();req()});
size();frame();addEventListener('load',function(){size();frame()});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){size();frame()});
})();

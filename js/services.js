/* services (desktop/tablet): the block pins; a huge serif "#our services" drifts sideways behind,
   its letters rise in on entry, and the three glass cards slide up from below one after another */
(function(){
var sec=document.getElementById('services'),tr=document.getElementById('svTrack'),mq=document.getElementById('svMq');if(!sec||!tr||!mq)return;
var stage=sec.querySelector('.sv-stage'),cards=[].slice.call(sec.querySelectorAll('.sv-card'));
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* split marquee words into letters */
var letters=[];[].forEach.call(mq.querySelectorAll('.sv-w'),function(w){var t=w.textContent;w.textContent='';
 t.split('').forEach(function(ch){var s=document.createElement('span');s.textContent=ch;if(ch===' ')s.style.width='.25em';w.appendChild(s);letters.push(s)})});
function z(){var r=parseFloat(getComputedStyle(document.querySelector('main')).zoom);return r>0?r:1}
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return 1-Math.pow(1-v,3)}
var RUN=1.7;
function size(){if(innerWidth<810){tr.style.height='';return}tr.style.height=(innerHeight/z()*(1+RUN))+'px'}
function frame(){
 if(innerWidth<810){cards.forEach(function(c){c.style.transform=''});letters.forEach(function(l){l.style.transform=''});mq.style.transform='';return}
 var r=tr.getBoundingClientRect(),vh=innerHeight,run=r.height-vh;
 var p=run>0?cl(-r.top/run):0,q=cl((vh-r.top)/vh);
 var mw=mq.scrollWidth*z();
 mq.style.transform='translate3d('+(-(p*0.55+q*0.08)*mw/3).toFixed(1)+'px,0,0)';
 letters.forEach(function(l,k){var t=RM?1:ease(cl(q*1.8-(k%15)*0.045));l.style.transform='translate3d(0,'+((1-t)*110).toFixed(1)+'%,0)';l.style.opacity=t.toFixed(2)});
 cards.forEach(function(c,i){var t=RM?1:ease(cl((p-0.05-i*0.13)/0.42));c.style.transform='translate3d(0,'+((1-t)*vh/z()*0.95).toFixed(1)+'px,0)'});
}
var tick=false;function req(){if(!tick){tick=true;requestAnimationFrame(function(){tick=false;frame()})}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){size();req()});
size();frame();addEventListener('load',function(){size();frame()});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(frame);
})();

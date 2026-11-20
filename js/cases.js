/* cases: each card sticks and the next one slides over it; covered cards shrink a little and dim */
(function(){var st=document.getElementById('csStack');if(!st)return;var cs=[].slice.call(st.querySelectorAll('.cs-card'));
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,tick=0;
function f(){tick=0;var vh=innerHeight;
 for(var i=0;i<cs.length;i++){var nx=cs[i+1],p=0;
  if(nx){var a=cs[i].getBoundingClientRect(),b=nx.getBoundingClientRect();p=1-Math.max(0,Math.min(1,(b.top-a.top)/(a.height||1)))}
  if(i<cs.length-1&&!RM){cs[i].style.transform='scale('+(1-p*.06).toFixed(4)+')';cs[i].style.setProperty('--dim',(p*.55).toFixed(3))}}}
function req(){if(!tick)tick=requestAnimationFrame(f)}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);f();})();

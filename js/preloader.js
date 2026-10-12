(function(){var p=document.getElementById('pre');if(!p)return;var r=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
if(r){p.remove();return}
var h=document.documentElement,c=p.querySelector('.pc'),b=p.querySelector('.pl i'),t0=Date.now(),MIN=1100,loaded=document.readyState==='complete',done=false;
h.classList.add('pre-lock');
addEventListener('load',function(){loaded=true});
function fin(){if(done)return;done=true;c.textContent='100';b.style.width='100%';setTimeout(function(){p.classList.add('out');setTimeout(function(){h.classList.remove('pre-lock');p.remove()},850)},150)}
(function tick(){var e=Date.now()-t0,v=Math.min(1,e/MIN);if(!loaded)v=Math.min(v,.92);var n=Math.round(v*100);c.textContent=(n<10?'0':'')+n;b.style.width=n+'%';
if(e>=MIN&&loaded||e>5000){fin();return}requestAnimationFrame(tick)})();
})();

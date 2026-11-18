/* reviews accordion: narrow tabs (number, name, avatar) and one open card; autoplay pauses on hover/focus */
(function(){var w=document.getElementById('txw');if(!w)return;var c=[].slice.call(w.querySelectorAll('.tx')),cur=0,t=null,hold=false;
function set(i){cur=(i+c.length)%c.length;c.forEach(function(x,k){x.classList.toggle('on',k===cur);x.querySelector('.tx-tab').setAttribute('aria-expanded',k===cur?'true':'false')})}
c.forEach(function(x,k){x.querySelector('.tx-tab').addEventListener('click',function(){set(k);restart()});
 x.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover) and (pointer:fine)').matches&&k!==cur){set(k);restart()}})});
function restart(){clearInterval(t);if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;t=setInterval(function(){if(!hold&&vis)set(cur+1)},7000)}
var vis=false;if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(w);else vis=true;
w.addEventListener('mouseenter',function(){hold=true});w.addEventListener('mouseleave',function(){hold=false});
w.addEventListener('focusin',function(){hold=true});w.addEventListener('focusout',function(){hold=false});
function fit(){var o=c[cur===0?1:0];w.style.setProperty("--txw",(w.clientWidth-(c.length-1)*(o.offsetWidth+10))+"px")}
addEventListener("resize",fit);fit();restart();})();

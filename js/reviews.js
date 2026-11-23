/* reviews: a row of quote cards that scrolls sideways; arrows step one card, mouse can drag the row */
(function(){var row=document.getElementById('rqRow');if(!row)return;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
function step(){var c=row.querySelector('.rq');return c?c.offsetWidth+10:400}
document.querySelectorAll('.rq-wrap .nt-b').forEach(function(b){b.addEventListener('click',function(){row.scrollBy({left:+b.dataset.d*step(),behavior:RM?'auto':'smooth'})})});
function upd(){var m=row.scrollWidth-row.clientWidth-2;document.querySelectorAll('.rq-wrap .nt-b').forEach(function(b){b.disabled=+b.dataset.d<0?row.scrollLeft<=2:row.scrollLeft>=m})}
row.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
/* drag to scroll with a mouse (touch scrolls natively) */
var on=false,sx=0,sl=0,moved=false;
row.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button)return;on=true;moved=false;sx=e.clientX;sl=row.scrollLeft;row.classList.add('drag')});
addEventListener('pointermove',function(e){if(!on)return;var d=e.clientX-sx;if(Math.abs(d)>4)moved=true;row.scrollLeft=sl-d});
addEventListener('pointerup',function(){if(!on)return;on=false;row.classList.remove('drag')});
row.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation()}},true);
row.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();row.scrollBy({left:(e.key==='ArrowRight'?1:-1)*step(),behavior:RM?'auto':'smooth'})}});
})();

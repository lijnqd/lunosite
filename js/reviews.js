/* inline reviews: hover (or tap) a quote — the rest blur, the author's name and role appear above the avatar */
(function(){var w=document.getElementById('ilr');if(!w)return;var qs=[].slice.call(w.querySelectorAll('.ilq'));
function on(q){if(q){var m=q.querySelector(".ilm");m.classList.remove("r");var a=m.getBoundingClientRect(),c=w.getBoundingClientRect();if(a.right>c.right-2)m.classList.add("r")}w.classList.toggle('focus',!!q);qs.forEach(function(x){x.classList.toggle('on',x===q)})}
qs.forEach(function(q){q.addEventListener('mouseenter',function(){on(q)});q.addEventListener('focus',function(){on(q)});
 q.addEventListener('click',function(e){if(matchMedia('(hover:none)').matches){e.stopPropagation();on(q.classList.contains('on')?null:q)}})});
w.addEventListener('mouseleave',function(){on(null)});document.addEventListener('click',function(e){if(!w.contains(e.target))on(null)});
})();

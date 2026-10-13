/* FAQ reveal cards: first card open by default; hover switches on desktop, tap toggles on touch */
(function(){
var g=document.querySelector('.fq-grid');if(!g)return;
var cards=[].slice.call(g.querySelectorAll('.fq')),hov=window.matchMedia('(hover:hover) and (min-width:1200px)');
function set(c,o){c.classList.toggle('open',o);c.querySelector('button').setAttribute('aria-expanded',o?'true':'false')}
function only(c){cards.forEach(function(x){set(x,x===c)})}
function rows(c){return c.parentNode}
cards.forEach(function(c){
  c.querySelector('button').addEventListener('click',function(){var o=!c.classList.contains('open');cards.forEach(function(x){set(x,false)});set(c,o)});
  c.addEventListener('mouseenter',function(){if(hov.matches)only(c)});
});
g.addEventListener('mouseleave',function(){if(hov.matches)only(cards[0])});
})();

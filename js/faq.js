/* FAQ reveal cards: one open at a time, click again to close */
(function(){
var g=document.querySelector('.fq-grid');if(!g)return;
var cards=[].slice.call(g.querySelectorAll('.fq'));
function set(c,o){c.classList.toggle('open',o);c.querySelector('button').setAttribute('aria-expanded',o?'true':'false')}
cards.forEach(function(c){c.querySelector('button').addEventListener('click',function(){var o=!c.classList.contains('open');cards.forEach(function(x){set(x,false)});set(c,o)})});
})();

/* header nav: a beige plate slides to the hovered link (spring), rests on the current page */
(function(){
var n=document.querySelector('.header .nav');if(!n)return;
var ind=document.createElement('i');ind.className='nav-ind';n.insertBefore(ind,n.firstChild);
var links=[].slice.call(n.querySelectorAll('a')),p=location.pathname,cur=null;
links.forEach(function(a){var h=a.getAttribute('href')||'';if(h.charAt(0)==='/'&&h.indexOf('#')<0&&h.length>1&&p.indexOf(h)===0)cur=a});
function to(a,instant){links.forEach(function(l){l.classList.toggle('on',l===a)});
 if(!a){ind.classList.remove('go');return}
 if(instant||!ind.classList.contains('go')){ind.style.transition='none';}
 ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';
 ind.offsetWidth;ind.style.transition='';ind.classList.add('go')}
links.forEach(function(a){a.addEventListener('mouseenter',function(){to(a)});a.addEventListener('focus',function(){to(a)})});
n.addEventListener('mouseleave',function(){to(cur)});
function init(){to(cur,true)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(init);else init();
addEventListener('resize',function(){to(cur,true)});

/* mobile menu: a "menu" button next to the cta opens a stack of glass cards */
(function(){var h=document.querySelector('.header');if(!h||!n)return;var d=document,root=d.documentElement;
 var b=d.createElement('button');b.type='button';b.className='menu-btn';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','menu');
 b.innerHTML='<i></i><span>menu</span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l12 12M15 3L3 15"/></svg>';
 h.appendChild(b);
 var m=d.createElement('nav');m.className='mmenu';m.setAttribute('aria-label','menu');
 var home=location.pathname==='/'||location.pathname==='/index.html';
 var list=[[home?'#top':'/','home']].concat(links.map(function(a){return [a.getAttribute('href'),a.textContent.replace('#','')]}));
 /* a pink sheet like the hero: big serif items, then the contacts and the main button */
 m.innerHTML='<div class="mm-list">'+list.map(function(l,i){return '<a class="mm-i" href="'+l[0]+'" style="transition-delay:'+(60+i*40)+'ms"><span>'+l[1]+'</span><em>'+('0'+(i+1)).slice(-2)+'</em></a>'}).join('')+'</div>'+
  '<div class="mm-foot" style="transition-delay:'+(60+list.length*40)+'ms"><a class="btn btn-dark" href="'+(home?'#contacts':'/#contacts')+'"><i></i>discuss a project</a>'+
  '<div class="mm-c"><a href="mailto:hey.lunostudio@gmail.com">hey.lunostudio@gmail.com</a><a href="https://wa.me/995599906542" target="_blank" rel="noopener">whatsapp</a><a href="https://t.me/dsgn_luno" target="_blank" rel="noopener">telegram</a><a href="https://www.instagram.com/dsgn.luno/" target="_blank" rel="noopener">instagram</a><a href="https://www.behance.net/dsgn_luno" target="_blank" rel="noopener">behance</a></div></div>';
 var items=m.querySelectorAll('.mm-i');
 if(cur){var ci=links.indexOf(cur)+1;items[ci]&&items[ci].classList.add('cur')}else if(home)items[0].classList.add('cur');
 d.body.appendChild(m);
 function tg(o){root.classList.toggle('menu-open',o);b.setAttribute('aria-expanded',o?'true':'false')}
 b.addEventListener('click',function(){tg(!root.classList.contains('menu-open'))});
 m.addEventListener('click',function(e){if(e.target.closest('a'))tg(false);else if(e.target===m)tg(false)});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')tg(false)});
 addEventListener('resize',function(){if(innerWidth>809)tg(false)});
})();
})();

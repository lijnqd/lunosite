/* reviews chat (same as the home page) */
(function(){
// reviews
var R=[
 {n:'Sveta',d:'Sun',r:'CEO of "SET"',a:'/assets/img/review-sveta.webp',t:"it's easy and pleasant to work with yana! the result exceeded expectations, all wishes were taken into account, and all the details were worked out"},
 {n:'Danil',d:'Mon',r:'founder of "Midas & Media brothers"',a:'/assets/img/review-danil.webp',t:"Yana, thank you so much for your work!🌟 The sites turned out to be stylish, thoughtful and fully meet our expectations. It is pleasant and easy to cooperate with you — your professionalism and attention to detail are felt at every stage of the work. 🙌😊"},
 {n:'Altynai',d:'Fri',r:'SMM of "Orta"',a:'/assets/img/review-altynai.webp',t:"Hi! I wanted to say thank you so much for your work — the design turned out to be very creative and stylish, just what we need! We may have clarifying questions about the layouts during the layout process, so it would be great if you could stay in touch. Thank you again for your contribution!"},
 {n:'Alexandra',d:'Thu',r:'lawyer of "Ruskapital"',a:'/assets/img/review-alexandra.webp',t:"I would like to express my sincere gratitude to the designer, Yana, for her exceptional work in creating a website for our consulting company. From the very beginning of our cooperation, Yana demonstrated a high level of professionalism and creativity. She listened carefully to our wishes and ideas while suggesting many insightful solutions that significantly enhanced the final result."}
];
var cur=0,timer=null,th=document.getElementById('threads');
R.forEach(function(x,i){
  var b=document.createElement('button');b.className='th';
  b.innerHTML='<span class="av"><img src="'+x.a+'" alt=""><u></u></span><span class="tx"><span class="top"><b>'+x.n+'</b><span>'+x.d+'</span></span><div class="pv"></div></span>';
  b.querySelector('.pv').textContent=x.t;
  b.addEventListener('click',function(){show(i)});th.appendChild(b);
});
function $(id){return document.getElementById(id)}
function show(i){
  cur=(i+R.length)%R.length;var x=R[cur];
  document.querySelectorAll('.th').forEach(function(b,k){b.classList.toggle('on',k===cur);b.setAttribute('aria-pressed',k===cur?'true':'false');if(k===cur)b.classList.add('read')});
  $('pAva').src=x.a;$('pAva2').src=x.a;$('pAva').alt=$('pAva2').alt=x.n+', '+x.r;$('pName').textContent=x.n;$('pRole').textContent=x.r;$('pDay').textContent=x.d;
  $('count').textContent='0'+(cur+1)+' / 0'+R.length;
  type(x.t);
}
function type(t){
  clearInterval(timer);var m=$('pMsg'),i=0;m.innerHTML='<span class="caret"></span>';
  var rows=document.querySelector('.bubble-row');rows.style.visibility='visible';
  timer=setInterval(function(){i+=2;if(i>=t.length){i=t.length;clearInterval(timer);m.textContent=t;return}m.textContent=t.slice(0,i);m.appendChild(Object.assign(document.createElement('span'),{className:'caret'}))},22);
}
var rp=$('replay');if(rp)rp.addEventListener('click',function(){type(R[cur].t)});
$('prev').addEventListener('click',function(){show(cur-1)});
$('next').addEventListener('click',function(){show(cur+1)});
show(0);
})();

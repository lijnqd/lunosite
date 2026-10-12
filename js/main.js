(function(){
// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

// about: word-by-word highlight on scroll
var at=document.getElementById('aboutText');
(function(){
  var nodes=[];
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p))}else{var s=document.createElement('span');s.className='w';s.textContent=p;f.appendChild(s)}});n.replaceChild(f,c)}
    else if(c.nodeType===1&&c.tagName!=='IMG'){walk(c)}
  })})(at);
  var ws=at.querySelectorAll('.w');
  function upd(){var r=at.getBoundingClientRect(),vh=innerHeight;var p=(vh*.85-r.top)/(r.height+vh*.25);p=Math.max(0,Math.min(1,p));var k=Math.round(p*ws.length*1.05);ws.forEach(function(w,i){w.classList.toggle('on',i<k)})}
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();

// reviews
var R=[
 {n:'Sveta',d:'Sun',r:'CEO of "SET"',a:'assets/img/review-sveta.jpg',t:"it's easy and pleasant to work with yana! the result exceeded expectations, all wishes were taken into account, and all the details were worked out"},
 {n:'Danil',d:'Mon',r:'founder of "Midas & Media brothers"',a:'assets/img/review-danil.jpg',t:"Yana, thank you so much for your work!🌟 The sites turned out to be stylish, thoughtful and fully meet our expectations. It is pleasant and easy to cooperate with you — your professionalism and attention to detail are felt at every stage of the work. 🙌😊"},
 {n:'Altynai',d:'Fri',r:'SMM of "Orta"',a:'assets/img/review-altynai.png',t:"Hi! I wanted to say thank you so much for your work — the design turned out to be very creative and stylish, just what we need! We may have clarifying questions about the layouts during the layout process, so it would be great if you could stay in touch. Thank you again for your contribution!"},
 {n:'Alexandra',d:'Thu',r:'lawyer of "Ruskapital"',a:'assets/img/review-alexandra.jpg',t:"I would like to express my sincere gratitude to the designer, Yana, for her exceptional work in creating a website for our consulting company. From the very beginning of our cooperation, Yana demonstrated a high level of professionalism and creativity. She listened carefully to our wishes and ideas while suggesting many insightful solutions that significantly enhanced the final result."}
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
  document.querySelectorAll('.th').forEach(function(b,k){b.classList.toggle('on',k===cur);if(k===cur)b.classList.add('read')});
  $('pAva').src=x.a;$('pAva2').src=x.a;$('pName').textContent=x.n;$('pRole').textContent=x.r;$('pDay').textContent=x.d;
  $('count').textContent='0'+(cur+1)+' / 0'+R.length;
  type(x.t);
}
function type(t){
  clearInterval(timer);var m=$('pMsg'),i=0;m.innerHTML='<span class="caret"></span>';
  var rows=document.querySelector('.bubble-row');rows.style.visibility='visible';
  timer=setInterval(function(){i+=2;if(i>=t.length){i=t.length;clearInterval(timer);m.textContent=t;return}m.textContent=t.slice(0,i);m.appendChild(Object.assign(document.createElement('span'),{className:'caret'}))},22);
}
$('replay').addEventListener('click',function(){type(R[cur].t)});
$('prev').addEventListener('click',function(){show(cur-1)});
$('next').addEventListener('click',function(){show(cur+1)});
show(0);

// clock
var tk=$('ticks');for(var i=0;i<12;i++){var a=i*30*Math.PI/180,l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',50+Math.sin(a)*45);l.setAttribute('y1',50-Math.cos(a)*45);l.setAttribute('x2',50+Math.sin(a)*(i%3?45.2:45.2));l.setAttribute('y2',50-Math.cos(a)*45.2);tk.appendChild(l)}
var D=['SUN','MON','TUE','WED','THU','FRI','SAT'],M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function tick(){var n=new Date(),h=n.getHours(),m=n.getMinutes(),s=n.getSeconds();
  function p(v){return(v<10?'0':'')+v}
  $('time').textContent=p(h)+':'+p(m);$('date').textContent=n.getDate()+' '+M[n.getMonth()]+' '+n.getFullYear()+' | '+D[n.getDay()];
  $('hh').setAttribute('transform','rotate('+((h%12)*30+m/2)+' 50 50)');$('mm').setAttribute('transform','rotate('+(m*6+s/10)+' 50 50)');$('ss').setAttribute('transform','rotate('+(s*6)+' 50 50)')}
tick();setInterval(tick,1000);

// contact form (backend key will be added later)
var FORM_ENDPOINT='';
$('form').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,note=$('formNote');note.hidden=false;
  if(!FORM_ENDPOINT){note.textContent='form is being connected — please write to hey.lunostudio@gmail.com';return}
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)}).then(function(r){if(!r.ok)throw 0;note.textContent='thank you! we’ll get back to you within two business days';f.reset()}).catch(function(){note.textContent='something went wrong — please write to hey.lunostudio@gmail.com'});
});
})();

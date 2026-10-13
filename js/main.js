(function(){
// desktop design is 1470 wide: on narrower desktops scale it down proportionally
function dz(){var w=innerWidth;document.documentElement.style.setProperty("--dz",w>=1200&&w<1470?(w/1470).toFixed(4):1)}dz();addEventListener("resize",dz);
// mouse glow over the dot grid (base dots are plain CSS, so they never lag on scroll)
(function(){var c=document.getElementById('dots'),x=c.getContext('2d'),mx=-999,my=-999,dpr=window.devicePixelRatio||1,W,H,raf=0;
function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;draw()}
function draw(){raf=0;x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);if(mx<0)return;var sy=scrollY,y0=30-(sy%60);for(var y=y0;y<H+4;y+=60){for(var px=30;px<W+4;px+=60){var d=Math.hypot(px-mx,y-my);if(d>170)continue;var t=1-d/170,a=.75*t*t;x.fillStyle='rgba(255,179,173,'+(.4*a).toFixed(3)+')';x.beginPath();x.arc(px,y,2+t*1.2,0,7);x.fill()}}}
function req(){if(!raf)raf=requestAnimationFrame(draw)}
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;req()});
addEventListener('scroll',draw,{passive:true});addEventListener('resize',size);size()})();

// process: line draws on scroll, steps appear
(function(){var st=document.querySelector('.steps'),ss=st.querySelectorAll('.step');var mx=0;
function u(){var r=st.getBoundingClientRect(),p=innerWidth<1200?(innerHeight*.8-r.top)/(r.height+20):(innerHeight*.85-r.top)/(innerHeight*.45);p=Math.max(mx,Math.min(1,p));mx=p;st.style.setProperty('--p',p);ss.forEach(function(s,i){if(p>=i/ss.length+.02)s.classList.add('in')})}
addEventListener('scroll',u,{passive:true});u()})();

// cases scale on tablet
(function(){var c=document.getElementById('cases');function f(){var w=innerWidth;if(w>=810&&w<1200){c.style.setProperty('--s',Math.min(1,c.clientWidth/1400))}else{c.style.removeProperty('--s')}
  if(w<810){c.style.setProperty('--fs',Math.min(1,(c.clientWidth-40)/332))}else{c.style.removeProperty('--fs')}}
addEventListener('resize',f);f();var again=function(){f()};setTimeout(again,100)})();
// vertical markers for process (tablet/phone)
document.querySelectorAll('.step').forEach(function(s,i){var m=document.createElement('div');m.className='mkv';if(i===0){m.appendChild(document.createElement('i'))}else{var im=document.createElement('img');im.src='assets/img/marker-'+(i+1)+'.png';im.alt='';im.style.width=[0,28,45,62][i]+'px';m.style.height=[11,28,45,62][i]+'px';m.appendChild(im)}s.insertBefore(m,s.firstChild)});
// footer art: word-only variant on phones
document.getElementById('fArt').src='embeds/footer-art.html'+(innerWidth<810?'?w=1':'');

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
 {n:'Sveta',d:'Sun',r:'CEO of "SET"',a:'assets/img/review-sveta.webp',t:"it's easy and pleasant to work with yana! the result exceeded expectations, all wishes were taken into account, and all the details were worked out"},
 {n:'Danil',d:'Mon',r:'founder of "Midas & Media brothers"',a:'assets/img/review-danil.webp',t:"Yana, thank you so much for your work!🌟 The sites turned out to be stylish, thoughtful and fully meet our expectations. It is pleasant and easy to cooperate with you — your professionalism and attention to detail are felt at every stage of the work. 🙌😊"},
 {n:'Altynai',d:'Fri',r:'SMM of "Orta"',a:'assets/img/review-altynai.webp',t:"Hi! I wanted to say thank you so much for your work — the design turned out to be very creative and stylish, just what we need! We may have clarifying questions about the layouts during the layout process, so it would be great if you could stay in touch. Thank you again for your contribution!"},
 {n:'Alexandra',d:'Thu',r:'lawyer of "Ruskapital"',a:'assets/img/review-alexandra.webp',t:"I would like to express my sincere gratitude to the designer, Yana, for her exceptional work in creating a website for our consulting company. From the very beginning of our cooperation, Yana demonstrated a high level of professionalism and creativity. She listened carefully to our wishes and ideas while suggesting many insightful solutions that significantly enhanced the final result."}
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

// clock
var D=['SUN','MON','TUE','WED','THU','FRI','SAT'],M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var G={'0':'01110 10001 10011 10101 11001 10001 01110','1':'00100 01100 00100 00100 00100 00100 01110','2':'01110 10001 00001 00010 00100 01000 11111','3':'11110 00001 00001 01110 00001 00001 11110','4':'00010 00110 01010 10010 11111 00010 00010','5':'11111 10000 11110 00001 00001 10001 01110','6':'00110 01000 10000 11110 10001 10001 01110','7':'11111 00001 00010 00100 01000 01000 01000','8':'01110 10001 10001 01110 10001 10001 01110','9':'01110 10001 10001 01111 00001 00010 01100'};
function drawTime(hh,mm){var c=$('time'),x=c.getContext('2d');x.clearRect(0,0,200,56);var pitch=8,r=2.8,ox=3,oy=3;
  function dg(ch,col,cx){G[ch].split(' ').forEach(function(row,ry){for(var k=0;k<5;k++){if(row[k]==='1'){x.fillStyle=col;x.beginPath();x.arc(cx+k*pitch+r,oy+ry*pitch+r,r,0,7);x.fill()}}})}
  var pk='#FFB3AD',wh='#ffffff';
  dg(hh[0],pk,ox);dg(hh[1],pk,ox+44);
  x.fillStyle=pk;[2,4].forEach(function(ry){x.beginPath();x.arc(ox+93,oy+ry*pitch+r,r,0,7);x.fill()});
  dg(mm[0],wh,ox+104);dg(mm[1],wh,ox+148)}
function tick(){var n=new Date(),h=n.getHours(),m=n.getMinutes(),s=n.getSeconds();
  function p(v){return(v<10?'0':'')+v}
  drawTime(p(h),p(m));$('date').textContent=n.getDate()+' '+M[n.getMonth()]+' '+n.getFullYear()+' | '+D[n.getDay()];
  $('hh').setAttribute('transform','rotate('+((h%12)*30+m/2)+' 50 50)');$('mm').setAttribute('transform','rotate('+(m*6+s/10)+' 50 50)');$('ss').setAttribute('transform','rotate('+(s*6)+' 50 50)')}
tick();setInterval(tick,1000);

// contact form (backend key will be added later)
var FORM_ENDPOINT='https://luno-form.dsgn-ys.workers.dev';
$('form').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,note=$('formNote');note.hidden=false;
  if(!FORM_ENDPOINT){note.textContent='form is being connected — please write to hey.lunostudio@gmail.com';return}
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)}).then(function(r){if(!r.ok)throw 0;note.textContent='thank you! we’ll get back to you within 24 hours';f.reset()}).catch(function(){note.textContent='something went wrong — please write to hey.lunostudio@gmail.com'});
});
})();

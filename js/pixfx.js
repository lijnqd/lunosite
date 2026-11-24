/* pixel fx: blocks dissolve in through a pixel grid, headings and labels scramble into place,
   blog cards fill with pink pixels on hover. reduced motion: nothing moves, everything is shown */
(function(){
var d=document,h=d.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(RM)return;
h.classList.add('pxfx');
var DPR=Math.min(2,window.devicePixelRatio||1),PINK='#FFB3AD',BEIGE='#F2E7DC';
var BG=getComputedStyle(d.body).backgroundColor||'#141414';
var GL='#%&*+=<>/\\|_~^$@!?01';
function rg(){return GL[(Math.random()*GL.length)|0]}

/* ---- text scramble ---- */
function scr(el,dur,delay){if(!el||el.__sc)return;el.__sc=1;dur=dur||900;delay=delay||0;
 /* screen readers and search see the real words: they sit in a visually hidden copy,
    and only an aria-hidden twin of the text is scrambled on screen */
 if(!el.querySelector(':scope>.scr-v')){var real=el.textContent.replace(/\s+/g,' ').trim(),sr=d.createElement('span'),v=d.createElement('span');
  sr.className='sr';sr.textContent=real;v.className='scr-v';v.setAttribute('aria-hidden','true');
  while(el.firstChild)v.appendChild(el.firstChild);el.appendChild(sr);el.appendChild(v)}
 var w=d.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return n.nodeValue.trim()&&!(n.parentNode.closest&&n.parentNode.closest('.ascii,svg,script,style,.sr'))?1:3}}),ns=[],n,tot=0;
 while(n=w.nextNode()){ns.push({n:n,o:n.nodeValue});tot+=n.nodeValue.length}
 if(!tot)return;var k=0;
 ns.forEach(function(x){x.t=[];for(var i=0;i<x.o.length;i++,k++)x.t.push(delay+(k/tot)*dur*.55+Math.random()*dur*.45)});
 var t0=performance.now(),last=0;
 (function f(now){var e=now-t0,done=true;if(now-last<32&&e<delay+dur){requestAnimationFrame(f);return}last=now;
  ns.forEach(function(x){var s='';for(var i=0;i<x.o.length;i++){var c=x.o[i];if(e>=x.t[i]||c===' '||c==='\n')s+=c;else{done=false;s+=rg()}}x.n.nodeValue=s});
  if(!done)requestAnimationFrame(f);else ns.forEach(function(x){x.n.nodeValue=x.o})})(t0)}

/* other scripts can scramble a word on demand (menu items on hover) */
window.pxScramble=function(el,dur){if(el.__busy)return;el.__busy=1;el.__sc=0;scr(el,dur||380);setTimeout(function(){el.__busy=0},(dur||380)+60)};

/* ---- pixel dissolve: a canvas in the page colour sits over the block and loses its pixels ---- */
function pix(el,dur,delay,cb){dur=dur||520;delay=delay||0;var r=el.getBoundingClientRect();
 var bg=under(el);if(under.el){var q=under.el.getBoundingClientRect();r={left:Math.max(r.left,q.left),top:Math.max(r.top,q.top),right:Math.min(r.right,q.right),bottom:Math.min(r.bottom,q.bottom)};r.width=r.right-r.left;r.height=r.bottom-r.top}
 el.classList.add('px-in');if(r.width<4||r.height<4||r.bottom<-200||r.top>innerHeight+200){cb&&cb();return}
 var cv=d.createElement('canvas'),x=cv.getContext('2d'),W=r.width,H=r.height,S=W<500?8:10,C=Math.ceil(W/S),R=Math.ceil(H/S),th=new Float32Array(C*R);
 for(var j=0;j<R;j++)for(var i=0;i<C;i++)th[j*C+i]=.42*(j/R)+.58*Math.random();
 cv.width=Math.ceil(W*DPR);cv.height=Math.ceil(H*DPR);cv.className='px-cv';
 cv.style.cssText='left:'+(r.left+scrollX)+'px;top:'+(r.top+scrollY)+'px;width:'+W+'px;height:'+H+'px';
 d.body.appendChild(cv);x.scale(DPR,DPR);x.fillStyle=bg;x.fillRect(0,0,W,H);
 var t0=performance.now()+delay;
 (function f(now){var p=(now-t0)/dur;if(p<0){requestAnimationFrame(f);return}
  if(p>=1){cv.remove();cb&&cb();return}p=1-Math.pow(1-p,2.2);p=p*1.1-.02;
  x.clearRect(0,0,W,H);
  for(var j=0;j<R;j++)for(var i=0;i<C;i++){var t=th[j*C+i];
   if(t>p){x.fillStyle=bg;x.fillRect(i*S,j*S,S,S)}
   else if(t>p-.08){x.fillStyle=(i+j)%3?PINK:BEIGE;x.globalAlpha=.35;x.fillRect(i*S+1,j*S+1,S-2,S-2);x.globalAlpha=1}}
  requestAnimationFrame(f)})(performance.now())}

function under(el){for(var e=el.parentElement;e&&e!==d.documentElement;e=e.parentElement){var c=getComputedStyle(e).backgroundColor;if(c&&c!=='transparent'&&!/rgba\([^)]*,\s*0\)$/.test(c)){var m=c.match(/[\d.]+/g);if(!m||m.length<4||+m[3]>.9){under.el=e===d.body?null:e;return c}}}under.el=null;return BG}
var TXT=/^(H1|H2|H3|P|BLOCKQUOTE|SPAN)$/;
/* a block that is already well on screen when it is reached (the visitor scrolled fast,
   or the page jumped) is shown at once: an effect that starts late reads as an empty screen */
function late(el){var r=el.getBoundingClientRect();return r.top<innerHeight*.55||r.bottom<0}
function go(el){if(el.__px)return;el.__px=1;
 if(late(el)){el.classList.add('px-in');return}
 if(TXT.test(el.tagName)){el.classList.add('px-in');scr(el,450);return}
 pix(el,400,0);[].slice.call(el.querySelectorAll('.label,h2:not(.sr),h3.h40')).forEach(function(t,i){scr(t,450,40+i*50)})}

function hero(){var hr=d.querySelector('.hero');if(!hr)return;
 var t=hr.querySelector('h1');if(t){t.__px=1;scr(t,850,0)}
 [].slice.call(hr.querySelectorAll('.hero-sub')).forEach(function(p){p.__px=1;scr(p,700,150)});
 [].slice.call(hr.querySelectorAll('.hero-art,.hero-btns .btn')).forEach(function(b,i){b.__px=1;pix(b,600,100+i*100)})}

function start(){hero();
 var els=[].slice.call(d.querySelectorAll('.reveal,.rv,.label,h2.h40')).filter(function(e){return !e.closest('.hero')&&!e.closest('.cx-title')});
 // labels/headings inside a revealing block are handled by the block
 els=els.filter(function(e){var p=e.parentElement&&e.parentElement.closest('.reveal,.rv');return !(p&&!TXT.test(p.tagName))});
 if(!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('px-in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);go(e.target)}})},{rootMargin:'0px 0px 12% 0px'});
 els.forEach(function(e){io.observe(e)});
 var tm;addEventListener('scroll',function(){clearTimeout(tm);tm=setTimeout(function(){els.forEach(function(e){if(!e.__px&&e.getBoundingClientRect().top<innerHeight){e.__px=1;io.unobserve(e);e.classList.add('px-in')}})},90)},{passive:true})}

function ready(){if(h.classList.contains('pre-lock')){var mo=new MutationObserver(function(){if(!h.classList.contains('pre-lock')){mo.disconnect();setTimeout(start,150)}});mo.observe(h,{attributes:true,attributeFilter:['class']})}else start()}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready);else ready();

/* ---- pink pixel fill on hover for blog cards ---- */
if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
/* the canvas is made on the first hover, not up front */
function hov(el){el.classList.add('px');var cv,x;function mk(){if(cv)return;cv=d.createElement('canvas');x=cv.getContext('2d');cv.className='px-hv';cv.setAttribute('aria-hidden','true');el.insertBefore(cv,el.firstChild)}
 var p=0,tg=0,raf=0,W,H,S=10,C,R,th,last=0;
 function size(){W=el.offsetWidth;H=el.offsetHeight;cv.width=Math.ceil(W*DPR);cv.height=Math.ceil(H*DPR);C=Math.ceil(W/S);R=Math.ceil(H/S);th=new Float32Array(C*R);
  for(var j=0;j<R;j++)for(var i=0;i<C;i++)th[j*C+i]=.45*(j/R)+.55*Math.random()}
 function draw(){x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);if(p<=0)return;
  if(p>=1){x.fillStyle=PINK;x.fillRect(0,0,W,H);return}
  var q=p*1.12;
  for(var j=0;j<R;j++)for(var i=0;i<C;i++){var t=th[j*C+i];
   if(t<q-.12){x.fillStyle=PINK;x.fillRect(i*S,j*S,S,S)}
   else if(t<q){x.fillStyle=PINK;x.globalAlpha=.45;x.fillRect(i*S+2,j*S+2,S-4,S-4);x.globalAlpha=1}}}
 function f(now){var dt=Math.min(50,now-(last||now));last=now;p+=(tg?1:-1)*dt/(tg?380:300);p=Math.max(0,Math.min(1,p));draw();
  if((tg&&p<1)||(!tg&&p>0))raf=requestAnimationFrame(f);else{raf=0;last=0}}
 function run(v){mk();tg=v;if(v&&p===0)size();if(!raf)raf=requestAnimationFrame(f)}
 el.addEventListener('mouseenter',function(){run(1)});el.addEventListener('mouseleave',function(){run(0)});
 addEventListener('resize',function(){if(cv&&p>0){size();draw()}})}
[].slice.call(d.querySelectorAll('.bc,.aw-row')).forEach(hov);
})();

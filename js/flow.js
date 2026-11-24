/* page flow: the dot matrix runs from one section into the next, so the page reads as one piece.
   Luna's glyphs leave the hero and become the eye in the about text; the about pill dissolves into
   a dot version of the first case cover, which then resolves into the photo top to bottom; the last
   case cover streams into the services marquee, which is dots before it turns solid serif; and the
   faq plus icons gather into Luna in the contact card, who resolves into her photo before her
   speech bubble appears.
   Every transition is scrubbed by the scroll (scrolling up plays it backwards), shapes are sampled
   from the real elements, and the one fixed canvas draws only while a transition is under way.
   Each target is fully shown once its transition ends. Reduced motion: nothing runs. */
(function(){
var d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(RM||!d.querySelector('.hero-c'))return;
var PH=innerWidth<810,DPR=Math.min(2,devicePixelRatio||1),CAP=PH?900:2500;
var cv=d.createElement('canvas'),x=cv.getContext('2d'),W=0,H=0,raf=0,T=[];
cv.className='flow';cv.setAttribute('aria-hidden','true');d.body.appendChild(cv);
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}
function hash(k){var h=(k*374761393)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function sm(a,b,v){return cl((v-a)/(b-a))}

/* ---- samplers: points as fractions of the element's box, with a colour ---- */
function grid(w,h,step,fn){var o=d.createElement('canvas'),g=o.getContext('2d',{willReadFrequently:true});o.width=Math.max(1,Math.round(w));o.height=Math.max(1,Math.round(h));
 fn(g,o.width,o.height);var px=g.getImageData(0,0,o.width,o.height).data,out=[];
 for(var y=step/2;y<o.height;y+=step)for(var xx=step/2;xx<o.width;xx+=step){var k=((y|0)*o.width+(xx|0))*4;if(px[k+3]>110)out.push({u:xx/o.width,v:y/o.height,r:px[k],g:px[k+1],b:px[k+2]})}
 return out}
function sImg(im,el,step,cover){var r=el.getBoundingClientRect();if(!r.width)return[];return grid(r.width,r.height,step,function(g,w,h){
 var iw=im.naturalWidth||w,ih=im.naturalHeight||h,s=cover?Math.max(w/iw,h/ih):Math.min(w/iw,h/ih);g.drawImage(im,(w-iw*s)/2,(h-ih*s)/2,iw*s,ih*s)})}
function sText(el,txt,step){var r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(!r.width)return[];return grid(r.width,r.height,step,function(g,w,h){
 g.fillStyle='#F2E7DC';g.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;g.textBaseline='middle';g.fillText(txt,parseFloat(cs.paddingLeft)||0,h/2)})}
function sCanvas(c,el,step){var r=el.getBoundingClientRect();if(!r.width||!c.width)return[];return grid(r.width,r.height,step,function(g,w,h){g.drawImage(c,0,0,w,h)})}
function sOutline(el,step){var r=el.getBoundingClientRect();if(!r.width)return[];return grid(r.width,r.height,step*.6,function(g,w,h){
 g.strokeStyle='#FFB3AD';g.lineWidth=3;var rr=h/2;g.beginPath();g.moveTo(rr,1.5);g.arcTo(w-1.5,1.5,w-1.5,h-1.5,rr);g.arcTo(w-1.5,h-1.5,1.5,h-1.5,rr);g.arcTo(1.5,h-1.5,1.5,1.5,rr);g.arcTo(1.5,1.5,w-1.5,1.5,rr);g.stroke()})}
function sPlus(el,step){var r=el.getBoundingClientRect();if(!r.width)return[];return grid(Math.max(24,r.width),Math.max(24,r.height),2,function(g,w,h){g.fillStyle='#FFB3AD';g.fillRect(w*.2,h/2-2,w*.6,4);g.fillRect(w/2-2,h*.2,4,h*.6)})}

/* ---- a transition: dots from source boxes to target boxes, scrubbed by one progress value ---- */
function pair(S,Tg,n){var a=S.length,b=Tg.length;if(!a||!b)return[];var N=Math.min(n,Math.max(a,b)),out=[];
 S.sort(function(p,q){return p.v-q.v||p.u-q.u});Tg.sort(function(p,q){return p.v-q.v||p.u-q.u});
 for(var i=0;i<N;i++){var s=S[Math.floor(i*a/N)],t=Tg[Math.floor(i*b/N)];out.push({s:s,t:t,d:hash(i+7),w:hash(i+31)-.5})}
 return out}
/* box: a function giving the element's current screen rect (with an optional box index for groups) */
function mk(o){o.parts=[];o.p=-1;T.push(o);return o}

/* 1. hero -> about: the cat's eye band becomes the eye icon; the rest of her drifts out and fades */
var cat=d.querySelector('.hero-c .cat'),catCv=cat&&cat.querySelector('.cat-cv'),eye=d.querySelector('#aboutText .eye'),about=d.querySelector('#about');
if(cat&&eye&&about)mk({name:'eye',sec:about,
 build:function(){if(!cat.classList.contains('asc'))return false;var step=PH?7:5,S=sCanvas(catCv,catCv,step),E=[],R=[];
  S.forEach(function(p){(p.v>.5&&p.v<.66&&Math.abs(p.u-.5)<.34?E:R).push(p)});
  var tgt=sImg(eye,eye,PH?2:1.6);this.parts=pair(E,tgt,Math.min(CAP,PH?300:700)).map(function(q){q.src=0;q.dst=1;return q});
  var rest=pair(R,R.slice(),Math.min(CAP,PH?400:1200)).map(function(q){q.src=0;q.dst=-1;return q});this.parts=this.parts.concat(rest);return true},
 boxes:function(){return[catCv.getBoundingClientRect(),eye.getBoundingClientRect()]},
 set:function(p){cat.style.opacity=(1-sm(.02,.3,p)).toFixed(3);eye.style.opacity=sm(.86,1,p).toFixed(3)},
 clear:function(){cat.style.opacity='';eye.style.opacity=''}});

/* 2. about pill -> the first case cover as dots, resolving into the photo top to bottom */
var pill=d.querySelector('#aboutText .pill'),c0=d.querySelector('.cs-full[data-flow]'),c0box=c0&&c0.querySelector('.cs-img'),c0im=c0box&&c0box.querySelector('img');
if(pill&&c0&&c0im)mk({name:'cover',sec:c0,
 build:function(){if(!c0im.complete||!c0im.naturalWidth){c0im.loading='eager';return false}var step=PH?9:10;
  this.parts=pair(sOutline(pill,6),sImg(c0im,c0box,step,true),CAP).map(function(q){q.src=0;q.dst=1;q.res=1;return q});return true},
 boxes:function(){return[pill.getBoundingClientRect(),c0box.getBoundingClientRect()]},
 set:function(p){var q=sm(.72,1,p);c0im.style.clipPath=q>=1?'':'inset(0 0 '+((1-q)*100).toFixed(2)+'% 0)';this.rv=q},
 clear:function(){c0im.style.clipPath=''}});

/* 3. the last case cover -> the services marquee, dots first, then solid serif */
var cards=[].slice.call(d.querySelectorAll('.cs-full')),cl1=cards[cards.length-1],clbox=cl1&&cl1.querySelector('.cs-img'),clim=clbox&&clbox.querySelector('img'),
 svs=d.querySelector('#services'),mq=d.querySelector('.sv-mq'),w0=d.querySelector('.sv-w');
if(clim&&svs&&mq&&w0&&getComputedStyle(mq).display!=='none')mk({name:'marquee',sec:svs,
 build:function(){if(!clim.complete||!clim.naturalWidth){clim.loading='eager';return false}var step=PH?9:8;
  this.parts=pair(sImg(clim,clbox,PH?14:16,true),sText(w0,'#our services',step),CAP).map(function(q){q.src=0;q.dst=1;return q});return true},
 boxes:function(){return[clbox.getBoundingClientRect(),w0.getBoundingClientRect()]},
 set:function(p){mq.style.opacity=sm(.82,1,p).toFixed(3)},
 clear:function(){mq.style.opacity=''}});

/* 11. faq plus icons -> Luna in the contact card, then her photo, then her speech bubble */
var pls=[].slice.call(d.querySelectorAll('.fq .pl')),luna=d.querySelector('.luna'),lim=luna&&luna.querySelector('img'),lsay=luna&&luna.querySelector('div'),con=d.querySelector('#contacts');
if(pls.length&&lim&&con)mk({name:'luna',sec:luna,
 build:function(){if(!lim.complete||!lim.naturalWidth){lim.loading='eager';return false}
  var S=[];pls.forEach(function(el,i){sPlus(el).forEach(function(p){p.k=i;S.push(p)})});
  var tg=sImg(lim,lim,PH?2.4:2.2,true).filter(function(p){var a=p.u-.5,b=p.v-.5;return a*a+b*b<.25});
  /* sort sources by icon so each icon sends its own cluster */
  var a=S.length,b=tg.length,N=Math.min(CAP,PH?500:900),out=[];tg.sort(function(p,q){return p.u-q.u||p.v-q.v});
  for(var i=0;i<N;i++){var s=S[Math.floor(i*a/N)],t=tg[Math.floor(hash(i+3)*b)];out.push({s:s,t:t,d:s.k/pls.length*.6+hash(i)*.25,w:hash(i+31)-.5,src:1+s.k,dst:0})}
  this.parts=out;return true},
 boxes:function(){return[lim.getBoundingClientRect()].concat(pls.map(function(e){return e.getBoundingClientRect()}))},
 set:function(p){lim.style.opacity=sm(.8,.95,p).toFixed(3);if(lsay){var q=sm(.92,1,p);lsay.style.opacity=q.toFixed(3);lsay.style.transform=q>=1?'':'translateY('+((1-q)*10).toFixed(1)+'px)'}},
 clear:function(){lim.style.opacity='';if(lsay){lsay.style.opacity='';lsay.style.transform=''}}});

/* progress: 0 when the target block's top is at the bottom of the screen, 1 once it is 30% from the top */
/* b is clamped so every transition can finish even near the end of the page */
function prog(t,r){var top0=r.top+scrollY,maxS=d.documentElement.scrollHeight-H,b=Math.max(H*(t.name==='luna'?.45:.3),top0-maxS+20),a=Math.max(b+H*.25,Math.min(H*.98,top0));return cl((a-r.top)/(a-b))}
function size(){W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);T.forEach(function(t){t.ok=false})}
function frame(now){raf=0;
 /* reads first */
 var act=[];T.forEach(function(t){var r=t.sec.getBoundingClientRect(),p=prog(t,r);t.np=p;if(p>0&&p<1){if(!t.ok)t.ok=t.build();if(t.ok){t.bx=t.boxes();act.push(t)}}});
 /* then writes */
 T.forEach(function(t){if(t.np===t.p)return;t.p=t.np;if(t.p<=0||t.p>=1){t.clear();if(t.p<=0)t.set(0)}else t.set(t.p);if(t.p>=1)t.clear()});
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);
 act.forEach(function(t){var p=t.p,bx=t.bx,R=PH?1.2:1.5,rv=t.rv||0;
  for(var i=0;i<t.parts.length;i++){var q=t.parts[i],sb=bx[q.src],s=q.s,tt=q.t;
   var sx=sb.left+s.u*sb.width,sy=sb.top+s.v*sb.height,ex,ey,al=1;
   if(q.dst<0){/* drift away from the centre and fade */var cx=sb.left+sb.width/2,cy=sb.top+sb.height/2,k=ease(cl(p/.5));ex=sx+(sx-cx)*.6+q.w*80;ey=sy+(sy-cy)*.4+60;al=1-k}
   else{var db=bx[q.dst];ex=db.left+tt.u*db.width;ey=db.top+tt.v*db.height}
   var lp=ease(cl((p-q.d*.35)/.6)),mx=(sx+ex)/2+q.w*Math.min(260,Math.abs(ey-sy)*.4),my=(sy+ey)/2;
   var px=(1-lp)*(1-lp)*sx+2*(1-lp)*lp*mx+lp*lp*ex,py=(1-lp)*(1-lp)*sy+2*(1-lp)*lp*my+lp*lp*ey;
   if(q.dst<0){px=sx+(ex-sx)*lp;py=sy+(ey-sy)*lp}
   if(q.res&&tt.v<rv)continue;/* the photo has already resolved here */
   if(py<-10||py>H+10||al<=.01)continue;
   /* colour: source colour at rest, beige in flight, target colour on landing */
   var f=Math.sin(lp*Math.PI),cr=q.dst>=0?tt:s,c0=s;
   var r=Math.round((c0.r*(1-lp)+cr.r*lp)*(1-f*.6)+242*f*.6),g=Math.round((c0.g*(1-lp)+cr.g*lp)*(1-f*.6)+231*f*.6),b=Math.round((c0.b*(1-lp)+cr.b*lp)*(1-f*.6)+220*f*.6);
   x.globalAlpha=al*(.55+.45*(1-f));x.fillStyle='rgb('+r+','+g+','+b+')';x.fillRect(px-R,py-R,R*2,R*2)}});
 x.globalAlpha=1;
 if(act.length)raf=requestAnimationFrame(frame)}
function go(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('scroll',go,{passive:true});
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();go()},150)});
size();addEventListener('load',function(){T.forEach(function(t){t.ok=false});go()});go();
/* the starting state is set at once, so nothing flashes in before its transition */
T.forEach(function(t){var r=t.sec.getBoundingClientRect(),p=prog(t,r);t.p=p;if(p>0&&p<1)t.set(p);else if(p<=0)t.set(0)});
})();

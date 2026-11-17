window.LUNO_EXP=[["brand identity", ["building a brand people recognize before they read the name", "turning your story into logo, color and type that work together", "giving you clear rules, so the brand stays consistent everywhere"]], ["visual meaning", ["finding the idea behind the brand before choosing how it looks", "making every color, shape and symbol mean something", "designing visuals that explain your product, not just decorate it"]], ["digital ascii", ["building brand graphics out of letters, glyphs and code", "creating interactive ascii art that reacts to people", "making your brand look like nothing else in the feed"]], ["websites", ["designing sites that tell visitors what you do in five seconds", "building clear structure from the first screen to the contact form", "turning visitors into clients, not just impressing them"]], ["ux/ui", ["researching how people really use your product", "simplifying complex flows into clear, calm interfaces", "testing ideas early, before they cost you money"]], ["design systems", ["collecting every button, color and style into one library", "helping your team design faster and stay consistent", "building a system that grows with the product"]], ["development", ["building fast, responsive sites pixel-perfect from the design", "adding micro-interactions that make the site feel alive", "taking care of seo, analytics and launch"]], ["art direction", ["setting one visual direction for photo, type and layout", "keeping campaigns and launches recognizable", "guiding photographers, illustrators and developers"]], ["brand strategy", ["defining who you are for and why they should care", "shaping positioning, tone of voice and key messages", "connecting business goals to design decisions"]]];
(function(){
var S=document.querySelector('.exp');if(!S)return;
var D=window.LUNO_EXP,stage=S.querySelector('.exp-stage'),cv=S.querySelector('.exp-cv'),x=cv.getContext('2d'),cv2=S.querySelector('.exp-cv2'),x2=cv2.getContext('2d'),card=S.querySelector('.exp-card'),T=card.querySelector('.exp-t'),L=card.querySelectorAll('.exp-l span');
var hover=matchMedia('(hover:hover) and (pointer:fine)').matches,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var TOUCH=!matchMedia('(hover:hover) and (pointer:fine)').matches,ROWS=TOUCH?[[0,1,2,3,4,5,6,7,8]]:[[0,1,2],[3,4,5],[6,7,8]],SYM='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/?',PINK='255,179,173';
var W,H,dpr,FS,LH,CW,CHh,rows=[],star=new Image(),ready=false,cur=-1,timers=[],mx=-9999,my=-9999,inside=false,cx=0,cy=0,raf=0;
star.src='/assets/svg/star.svg';
/* glyph atlas: every symbol in 2 pink tones */
var AT,AG;
function atlas(){var g=Math.ceil(CW*dpr),h=Math.ceil(CHh*dpr);AT=document.createElement('canvas');AT.width=g*SYM.length;AT.height=h*2;AG={w:g,h:h};
 var a=AT.getContext('2d');a.scale(dpr,dpr);a.font='500 '+(CHh*1.02)+'px "Sometype Mono", monospace';a.textBaseline='top';
 ['rgba('+PINK+',1)','rgba('+PINK+',.55)'].forEach(function(c,t){a.fillStyle=c;for(var j=0;j<SYM.length;j++)a.fillText(SYM[j],j*CW,t*CHh)})}
function font(){return 'italic 700 '+FS+'px Inter, sans-serif'}
/* lay out one set per row on an offscreen canvas, sample it into ascii cells */
function build(){
 W=cv.parentNode.clientWidth;dpr=Math.min(2,devicePixelRatio||1);FS=W<810?Math.max(38,W*.11):Math.max(72,Math.min(120,W*.072));LH=Math.round(FS*1.4);H=LH*ROWS.length;
 CW=W<810?2.9:3.9;CHh=W<810?4.2:5.6;
 cv.width=cv2.width=W*dpr;cv.height=cv2.height=H*dpr;cv.style.height=cv2.style.height=H+'px';atlas();
 var o=document.createElement('canvas'),ox=o.getContext('2d');rows=[];
 ROWS.forEach(function(ids){
  ox.font=font();var gap=FS*.42,sw=FS*.42,parts=[],w=0;
  ids.forEach(function(i){var tw=ox.measureText(D[i][0]).width;parts.push({i:i,x0:w,x1:w+tw});w+=tw+gap+sw+gap});
  o.width=Math.ceil(w)+4;o.height=LH;ox.font=font();ox.textBaseline='alphabetic';ox.fillStyle='#000';
  parts.forEach(function(p){ox.fillText(D[p.i][0],p.x0,LH*.74);if(star.complete&&star.naturalWidth)ox.drawImage(star,p.x1+gap,LH*.74-sw*1.08,sw,sw)});
  var dat=ox.getImageData(0,0,o.width,o.height).data,cells=[];
  for(var yy=CHh/2;yy<LH;yy+=CHh)for(var xx=CW/2;xx<o.width;xx+=CW){var a=dat[((yy|0)*o.width+(xx|0))*4+3];if(a>120)cells.push({x:xx-CW/2,y:yy-CHh/2,c:Math.random()*SYM.length|0,t:Math.random()<.12?1:0,w:wordAt(parts,xx)})}
  rows.push({w:w,parts:parts,cells:cells,pos:0})});
 if(rows[1])rows[1].pos=-rows[1].w;ready=true}
function wordAt(parts,px){for(var k=0;k<parts.length;k++)if(px>=parts[k].x0-4&&px<=parts[k].x1+4)return parts[k].i;return -1}
/* card */
var G='abcdefghijklmnopqrstuvwxyz0123456789';
function scramble(el,txt,delay){var n=txt.length,st=0;el.textContent='';if(RM){el.textContent=txt;return}
 timers.push(setTimeout(function step(){st+=Math.max(2,n/14|0);var o='';for(var i=0;i<n;i++)o+=i<st?txt[i]:(txt[i]===' '?' ':(i<st+6?G[Math.random()*G.length|0]:''));el.textContent=o;if(st<n)timers.push(setTimeout(step,28))},delay))}
function show(i){if(i===cur)return;cur=i;timers.forEach(clearTimeout);timers=[];
 scramble(T,D[i][0],0);for(var k=0;k<3;k++)scramble(L[k],D[i][1][k],60+k*90);card.classList.add('show')}
function hide(){cur=-1;card.classList.remove('show')}
function hit(px,py){var r=cv.getBoundingClientRect(),lx=px-r.left,ly=py-r.top;if(ly<0||ly>H||lx<0||lx>W)return -1;
 var ri=Math.floor(ly/LH),R=rows[ri];if(!R)return -1;var p=((lx-R.pos)%R.w+R.w)%R.w;return wordAt(R.parts,p)}
function follow(){var r=stage.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight,tx=mx-r.left+24,ty=my-r.top+24;
 if(tx+w>r.width)tx=mx-r.left-w-24;if(my+24+h>innerHeight-16)ty=my-r.top-h-24;
 cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;card.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)'}
/* motion */
var dir=[-1,1,-1],base=[34,28,40],boost=0,lastY=scrollY,vis=true,last=0;
addEventListener('scroll',function(){var dy=Math.abs(scrollY-lastY);lastY=scrollY;boost=Math.min(boost+dy*3.5,700)},{passive:true});
function draw(t){
 x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x2.setTransform(1,0,0,1,0,0);x2.clearRect(0,0,cv2.width,cv2.height);
  var r=cv.getBoundingClientRect(),lx=mx-r.left,ly=my-r.top,RAD=W<810?60:95,act=(inside||TOUCH)?cur:-1,gw=AG.w,gh=AG.h;
 for(var ri=0;ri<rows.length;ri++){var R=rows[ri],oy=ri*LH;
  for(var rep=0;rep<2;rep++){var ox=R.pos+rep*R.w;if(ox>W||ox+R.w<0)continue;
   for(var k=0;k<R.cells.length;k++){var c=R.cells[k],px=c.x+ox,py=c.y+oy;if(px<-CW*4||px>W+CW*4)continue;
    var dx=px-lx,dy=py-ly,d2=dx*dx+dy*dy,near=d2<RAD*RAD,ctx=x;
    /* the hovered word and the symbols right around the cursor run apart and come into focus */
    if(TOUCH&&c.w===act)continue;
    if(near||(act>=0&&c.w===act)){ctx=x2;if(near){var d=Math.sqrt(d2)||1,f=1-d/RAD;f*=f;px+=dx/d*f*RAD*.32;py+=dy/d*f*RAD*.32}}
    if(Math.random()<.004)c.c=Math.random()*SYM.length|0;
    if(ctx===x)continue;
    ctx.drawImage(AT,c.c*gw,c.t*gh,gw,gh,Math.round(px*dpr),Math.round(py*dpr),gw,gh)}}}
 soft(act,inside?lx:-9999,ly,RAD)}
function soft(act,lx,ly,RAD){
 x.setTransform(dpr,0,0,dpr,0,0);x.font=font();x.textBaseline='alphabetic';x.fillStyle='rgba(255,179,173,.85)';
 for(var ri=0;ri<rows.length;ri++){var R=rows[ri],by=ri*LH+LH*.74,sw=FS*.42,gap=FS*.42;
  for(var rep=0;rep<2;rep++){var ox=R.pos+rep*R.w;if(ox>W||ox+R.w<0)continue;
   for(var q=0;q<R.parts.length;q++){var P=R.parts[q],X=ox+P.x0;
    if(X<W&&X+(P.x1-P.x0)>0){if(P.i!==act)x.fillText(D[P.i][0],X,by);else if(TOUCH){x2.setTransform(dpr,0,0,dpr,0,0);x2.font=font();x2.textBaseline='alphabetic';x2.fillStyle='#FFB3AD';x2.fillText(D[P.i][0],X,by)}}
    var sx=ox+P.x1+gap;if(sx<W&&sx+sw>0&&star.naturalWidth)x.drawImage(star,sx,by-sw*1.08,sw,sw)}}}
 if(lx>-999){x.globalCompositeOperation='destination-out';var g=x.createRadialGradient(lx,ly,0,lx,ly,RAD);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.7,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(lx-RAD,ly-RAD,RAD*2,RAD*2);x.globalCompositeOperation='source-over'}}
function tick(t){if(!vis||!ready){last=0;return}var dt=last?Math.min(.05,(t-last)/1000):0;last=t;
 if(!RM){var sp=boost;boost*=Math.pow(.04,dt);for(var i=0;i<rows.length;i++){var R=rows[i];R.pos+=dir[i]*(base[i]+sp)*dt;if(R.pos<=-R.w)R.pos+=R.w;if(R.pos>0)R.pos-=R.w}}
 if(hover&&inside){var h=hit(mx,my);if(h>=0)show(h)}
 if(hover&&cur>=0)follow();
 draw(t);requestAnimationFrame(tick)}
if(hover){
 stage.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(!inside){var r=stage.getBoundingClientRect();cx=mx-r.left+24;cy=my-r.top+24}inside=true;var h=hit(mx,my);if(h>=0)show(h)});
 stage.addEventListener('pointerleave',function(){inside=false;mx=my=-9999;hide()});
}else{
 S.classList.add('touch');
 show(0);
 cv.addEventListener('click',function(e){var h=hit(e.clientX,e.clientY);if(h>=0)show(h)});
}
/* keyboard: hidden buttons, one per direction */
[].forEach.call(S.querySelectorAll('.exp-keys button'),function(b){b.addEventListener('focus',function(){if(!hover)return;var r=stage.getBoundingClientRect();mx=r.left+r.width/2-200;my=r.top+40;cx=mx-r.left;cy=my-r.top+H/2;show(+b.getAttribute('data-i'));follow()});b.addEventListener('blur',function(){if(hover)hide()})});
function start(){build();if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)requestAnimationFrame(tick)}).observe(S);else requestAnimationFrame(tick)}
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});
Promise.all([document.fonts?document.fonts.load('italic 700 80px Inter'):0,document.fonts?document.fonts.load('500 10px "Sometype Mono"'):0,new Promise(function(r){if(star.complete)r();else{star.onload=star.onerror=r}})]).then(start,start);
})();

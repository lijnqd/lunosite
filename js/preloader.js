/* lunö ascii page transition
   - first visit in a session: the screen is covered with ascii, which dissolves in blobs once the page has loaded
   - click on an internal link: ascii grows out of the click point in blobs, covers the screen, then the next page opens
   - arriving from such a click: the next page starts covered and dissolves the same way
   rendering: the glyph layer is painted once (one fillText per row and tone); each frame only a tiny
   cols x rows mask changes and is scaled up with nearest-neighbour, so frames stay cheap on phones */
(function(){
var d=document,h=d.documentElement,w=window,ss;try{ss=w.sessionStorage}catch(e){}
var RM=w.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var SYM='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-=/\\|<>?!@[]{}();:.,~^',BG=[20,20,20];
var TONES=['rgba(242,231,220,.42)','rgba(242,231,220,.56)','rgba(242,231,220,.7)','rgba(242,231,220,.84)','rgba(255,179,173,.6)'];
var FONT=function(){return '500 '+FS+'px "Sometype Mono", ui-monospace, monospace'};
var el=d.getElementById('pre'),cv,x,W,H,dpr,CW,CH,FS,cols,rows,N,nz,ch,tone,LA,MK,mk,MD,ED,raf=0;

/* smooth value noise on a lattice -> organic blobs */
function sm(t){return t*t*(3-2*t)}
function noiseField(scale){
 var gw=Math.ceil(cols/scale)+2,gh=Math.ceil(rows/scale)+2,L=new Float32Array(gw*gh),o=new Float32Array(N),i;
 for(i=0;i<L.length;i++)L[i]=Math.random();
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
  var fx=c/scale,fy=r/scale,ix=fx|0,iy=fy|0,tx=sm(fx-ix),ty=sm(fy-iy),
  a=L[iy*gw+ix],b=L[iy*gw+ix+1],e=L[(iy+1)*gw+ix],f=L[(iy+1)*gw+ix+1],top=a+(b-a)*tx;
  o[r*cols+c]=top+((e+(f-e)*tx)-top)*ty}
 return o}
function canvas(cw,chh){var e=d.createElement('canvas');e.width=cw;e.height=chh;return e}
function setup(){
 if(!el){el=d.createElement('div');el.id='pre';el.setAttribute('aria-hidden','true');d.body.appendChild(el)}
 el.innerHTML='';el.className='on';W=innerWidth;H=innerHeight;dpr=Math.min(2,w.devicePixelRatio||1);
 cv=canvas(Math.round(W*dpr),Math.round(H*dpr));el.appendChild(cv);x=cv.getContext('2d');
 FS=W<810?11:13;x.font=FONT();CW=x.measureText('M').width||FS*.6;CH=Math.round(FS*1.2);
 cols=Math.ceil(W/CW);rows=Math.ceil(H/CH);N=cols*rows;
 var a=noiseField(W<810?7:11),b=noiseField(3.2),i;nz=new Float32Array(N);ch=new Uint8Array(N);tone=new Uint8Array(N);
 for(i=0;i<N;i++){nz[i]=a[i]*.72+b[i]*.28;ch[i]=Math.random()*SYM.length|0;tone[i]=Math.random()<.16?4:Math.min(3,(nz[i]*4)|0)}
 /* glyph layer: dark cells with glyphs in a few tones, painted once */
 LA=canvas(cv.width,cv.height);
 var la=LA.getContext('2d'),r,t,c;la.fillStyle='rgb('+BG+')';la.fillRect(0,0,LA.width,LA.height);
 la.scale(dpr,dpr);la.font=FONT();la.textBaseline='top';
 for(r=0;r<rows;r++){var row=['','','','',''];
  for(c=0;c<cols;c++){i=r*cols+c;var g=SYM.charAt(ch[i]);for(t=0;t<5;t++)row[t]+=t===tone[i]?g:' '}
  for(t=0;t<5;t++){la.fillStyle=TONES[t];la.fillText(row[t],0,r*CH+1)}}
 MK=canvas(cols,rows);mk=MK.getContext('2d');MD=mk.createImageData(cols,rows);ED=mk.createImageData(cols,rows);
 for(i=0;i<N*4;i+=4){ED.data[i]=255;ED.data[i+1]=179;ED.data[i+2]=173}}
function flicker(n){var la=LA.getContext('2d');la.setTransform(dpr,0,0,dpr,0,0);
 for(var j=0;j<n;j++){var i=Math.random()*N|0,c=i%cols,r=(i/cols)|0,X=c*CW,Y=r*CH,g;ch[i]=Math.random()*SYM.length|0;g=SYM.charAt(ch[i]);
  la.fillStyle='rgb('+BG+')';la.fillRect(X,Y,CW,CH);la.fillStyle=TONES[tone[i]];la.fillText(g,X,Y+1)}}
function maskTo(ctx,img){mk.putImageData(img,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(MK,0,0,cols*CW*dpr,rows*CH*dpr)}
/* key[i] < v => cell covered; cells within `band` of the front glow pink */
function draw(k,v,band){
 flicker(Math.max(12,N*.008|0));
 var m=MD.data,e=ED.data,any=0;
 for(var i=0,o=3;i<N;i++,o+=4){var g=v-k[i];m[o]=g>0?255:0;var ed=g>0&&g<band;e[o]=ed?70:0;if(ed)any=1}
 x.globalCompositeOperation='copy';x.drawImage(LA,0,0);x.globalCompositeOperation='destination-in';maskTo(x,MD);
 if(any){x.globalCompositeOperation='source-atop';maskTo(x,ED)}x.globalCompositeOperation='source-over'}
function keys(ox,oy,dirW){
 var k=new Float32Array(N),md=Math.hypot(Math.max(ox,W-ox),Math.max(oy,H-oy))||1;
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var i=r*cols+c;k[i]=Math.hypot(c*CW+CW/2-ox,r*CH+CH/2-oy)/md*dirW+nz[i]*(1-dirW)}
 return k}
function run(dur,fn,done){var t0=0,sk=0;cancelAnimationFrame(raf);
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);if(p<1&&(sk++&1)){raf=requestAnimationFrame(f);return}fn(p);if(p<1)raf=requestAnimationFrame(f);else if(done)done()}
 raf=requestAnimationFrame(f)}
function ease(p){return p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2}
function finish(){h.classList.remove('pre-lock');if(el)el.remove();el=null}
function reveal(ox,oy){
 var k=keys(ox,oy,.32),lo=1e9,hi=-1e9,i;for(i=0;i<N;i++){if(k[i]<lo)lo=k[i];if(k[i]>hi)hi=k[i]}
 run(720,function(p){draw(k,hi+.06-(hi-lo+.12)*ease(p),.022)},finish)}

/* ---------- on arrival ---------- */
var tr=null,first=false;
try{tr=ss&&ss.getItem('luno_tr');if(tr)ss.removeItem('luno_tr');first=ss&&!ss.getItem('luno_pre');ss&&ss.setItem('luno_pre','1')}catch(e){}
if(RM||(!tr&&!first)){if(el)el.remove();el=null}
else{
 h.classList.add('pre-lock');
 var o=tr?tr.split(','):null,started=0,t0=performance.now();
 /* the plain dark #pre covers the page until the mono font is ready, then the ascii is painted once */
 var paint=function(){if(started)return;started=1;setup();draw(new Float32Array(N),1,0);
  var ox=o?+o[0]*innerWidth:innerWidth/2,oy=o?+o[1]*innerHeight:innerHeight/2,MIN=o?80:450,done=0,
  go=function(){if(done)return;done=1;setTimeout(function(){reveal(ox,oy)},Math.max(0,MIN-(performance.now()-t0)))};
  if(o||d.readyState==='complete')go();else{w.addEventListener('load',go);setTimeout(go,2500)}};
 var start=function(){var f=d.fonts&&d.fonts.load?d.fonts.load('500 13px "Sometype Mono"'):null;if(f)f.then(paint,paint);setTimeout(paint,700);if(!f)paint()};
 if(d.body)start();else d.addEventListener('DOMContentLoaded',start)}

/* ---------- on leaving through an internal link ---------- */
var busy=false;
d.addEventListener('click',function(e){
 if(busy||RM||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
 if(a.target&&a.target!=='_self'||a.hasAttribute('download')||a.getAttribute('href').charAt(0)==='#')return;
 var u;try{u=new URL(a.href,location.href)}catch(err){return}
 if(u.origin!==location.origin||!/^https?:$/.test(u.protocol))return;
 if(u.pathname===location.pathname&&u.search===location.search)return; /* same page anchors scroll as usual */
 if(/\.(pdf|zip|png|jpe?g|webp|svg|mp4)$/i.test(u.pathname))return;
 e.preventDefault();busy=true;h.classList.add('pre-lock');
 var ox=e.clientX||innerWidth/2,oy=e.clientY||innerHeight/2;
 try{ss&&ss.setItem('luno_tr',(ox/innerWidth).toFixed(3)+','+(oy/innerHeight).toFixed(3))}catch(err){}
 setup();var k=keys(ox,oy,.62),hi=0;for(var i=0;i<N;i++)if(k[i]>hi)hi=k[i];
 var gone=false,nav=function(){if(gone)return;gone=true;location.href=u.href};
 run(560,function(p){draw(k,(hi+.08)*ease(p),.025)},nav);setTimeout(nav,1200)},false);
/* back/forward cache: never come back to a covered screen */
w.addEventListener('pageshow',function(e){if(e.persisted){busy=false;cancelAnimationFrame(raf);h.classList.remove('pre-lock');var p=d.getElementById('pre');if(p)p.remove();el=null}});
})();

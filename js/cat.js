/* luna, the hero cat, drawn in glyphs. Her picture (fur, eyes, pupils on their own layers) is sampled
   into a grid; each cell gets a glyph by how dark it is: dotted tiles for the darkest parts, then
   # % * + = : . — two tones, one colour, no noise. Her pupils follow the cursor (the grid is redrawn
   only when they move), her head sways after it, she breathes; left alone she dozes ("zzz…").
   Runs only while the hero is on screen. Reduced motion: eyes only. */
(function(){function hsh(k){var h=(k*2654435761)|0;h=Math.imul(h^(h>>>15),2246822519);return((h^(h>>>13))>>>0)/4294967296}
var lsp=-1,SPS=document.querySelector('.hero-c'),sp=0;function scrollP(){var r=SPS.getBoundingClientRect();var v=-r.top/(r.height*.85);sp=v<0?0:v>1?1:v}
var w=document.querySelector('.hero-c .cat');if(!w)return;
var pet=w.querySelector('.cat-pet'),cv=w.querySelector('.cat-cv'),say=w.querySelector('.cat-say'),txt=say.firstChild;
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,ACTIVE='Luna, head of the studio',IDLE='zzz…',INK='#141414';
var SW=780,SH=770,P=[[192,403],[497,403]],PS=103;/* source layout (see the svg in the markup) */
var srcs=['/assets/img/cat/eyes.webp','/assets/img/cat/pupil-0.webp','/assets/img/cat/pupil-1.webp','/assets/img/cat/base.webp'],ims=[];
var mx=0,my=0,has=false,px=0,py=0,vx=0,vy=0,ex=0,ey=0,dex=1e9,dey=1e9,last=performance.now(),asleep=false,vis=true,raf=0,t0=performance.now(),born=0;
var x=cv.getContext('2d'),sm=document.createElement('canvas'),sx=sm.getContext('2d',{willReadFrequently:true}),DPR=Math.min(2,devicePixelRatio||1);
var tlx=-1e4,tly=-1e4,W=0,H=0,cw=0,ch=0,cols=0,rows=0,SS=4,tiles=[],ord=null,TH=null;
var SCR='#%&*+=/\\|~^01',lx=-1e4,ly=-1e4,hv=0,hvT=0,G=['.',':','-','=','+','/','*','%','#'],GA=[.62,.68,.74,.8,.9,.94,1,1,1];
function hash(k){var h=(k*374761393)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function tile(dense){var c=document.createElement('canvas'),q=c.getContext('2d');c.width=Math.ceil(cw*DPR);c.height=Math.ceil(ch*DPR);q.scale(DPR,DPR);
 var ix=cw*.08,iy=ch*.1;q.fillStyle=INK;q.beginPath();q.roundRect?q.roundRect(ix,iy,cw-2*ix,ch-2*iy,1.2):q.rect(ix,iy,cw-2*ix,ch-2*iy);q.fill();
 /* a regular dot pattern punched out of the block, finer in the dense tile */
 q.globalCompositeOperation='destination-out';var st=dense?3:2.4,r=dense?.42:.62;
 for(var yy=iy+st/2;yy<ch-iy;yy+=st)for(var xx=ix+st/2+((Math.round(yy/st)%2)*st/2);xx<cw-ix;xx+=st){q.beginPath();q.arc(xx,yy,r,0,6.283);q.fill()}
 return c}
function size(){var r=w.getBoundingClientRect();W=r.width;H=r.height;if(!W)return;
 ch=Math.max(6,Math.round(W/64));TH=null;cw=ch;cols=Math.floor(W/cw);rows=Math.floor(H/ch);
 cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);sm.width=cols*SS;sm.height=rows*SS;
 tiles=[tile(true),tile(false)];ord=new Float32Array(cols*rows);for(var k=0;k<ord.length;k++)ord[k]=hash(k+7);dex=1e9}
function render(now){
 sx.setTransform(1,0,0,1,0,0);sx.clearRect(0,0,sm.width,sm.height);sx.setTransform(sm.width/SW,0,0,sm.height/SH,0,0);
 sx.drawImage(ims[0],0,0,SW,SH);sx.drawImage(ims[1],P[0][0]+ex,P[0][1]+ey,PS,PS);sx.drawImage(ims[2],P[1][0]+ex,P[1][1]+ey,PS,PS);sx.drawImage(ims[3],0,0,SW,SH);
 var d=sx.getImageData(0,0,sm.width,sm.height).data,N=SS*SS,ox=(W-cols*cw)/2,oy=(H-rows*ch)/2,intro=RM?1:Math.min(1,(now-born)/900);
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);x.fillStyle=INK;x.textAlign='center';x.textBaseline='middle';x.font='600 '+Math.round(ch*.95)+"px 'Sometype Mono',monospace";
 var Ds=new Float32Array(cols*rows).fill(-1);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var a=0,l=0;
  for(var v=0;v<SS;v++)for(var u=0;u<SS;u++){var o=((j*SS+v)*sm.width+i*SS+u)*4,al=d[o+3]/255;a+=al;l+=al*(d[o]*.3+d[o+1]*.59+d[o+2]*.11)/255}
  a/=N;if(a<.4)continue;Ds[j*cols+i]=1-l/(a*N)}
 /* fur glyphs read a smoothed value (each cell blended with its neighbours), so the halftone of
    the drawing does not turn into noise; tiles and the darkest marks keep the raw value, so the
    outline, eyes, nose and mouth stay sharp */
 var Sm=new Float32Array(Ds.length);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=j*cols+i,v=Ds[k];if(v<0){Sm[k]=-1;continue}var s2=v*2,w2=2;
  for(var q=-1;q<=1;q++)for(var r=-1;r<=1;r++){if(!q&&!r)continue;var jj=j+q,ii=i+r;if(jj<0||ii<0||jj>=rows||ii>=cols)continue;var u=Ds[jj*cols+ii];if(u>=0){s2+=u;w2++}}
  Sm[k]=s2/w2}
 /* levels by rank, not by raw value: the fur is mostly mid grey, so raw values would make it all
    blocks. Only the darkest tenth (outline, pupils, nose) becomes tiles; the rest spreads over the glyphs */
 if(!TH){var vs=[].slice.call(Ds).filter(function(v){return v>=0}).sort(function(p,q){return p-q}),Q=function(f){return vs[Math.min(vs.length-1,Math.floor(vs.length*f))]};
  TH={t0:Q(.86),t1:Q(.77),g:[Q(.04),Q(.12),Q(.2),Q(.29),Q(.38),Q(.47),Q(.56),Q(.64),Q(.71)]}}

 /* halftone: one round dot per cell on a square grid; its size follows how dark the cell is,
    so the darkest parts (outline, pupils, nose, mouth) grow into solid shapes where dots touch,
    and the lightest parts of the fur open up to bare pink. One colour, nothing else */
 var lo=TH.g[0],hi=TH.t0,cell=cw,GLS=[];x.globalAlpha=1;x.beginPath();
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var D=Ds[j*cols+i];if(D<0)continue;
  if(intro<1&&ord[j*cols+i]>intro)continue;
  var E=Sm[j*cols+i]+(D-Sm[j*cols+i])*1.6,tn=(E-lo)/(hi-lo);tn=tn<0?0:tn>1?1:tn;
  var rr=cell*.5*1.22*Math.pow(tn,.62);if(rr<cell*.12)continue;
  var cx=ox+(i+.5)*cell,cy=oy+(j+.5)*cell;
  if(hv>.01){var ddx=cx-lx,ddy=cy-ly,dd=Math.sqrt(ddx*ddx+ddy*ddy)||1,RR=W*.3;if(dd<RR){var q0=1-dd/RR,ff=q0*q0*(3-2*q0)*hv;cx+=ddx/dd*ff*cell*5;cy+=ddy/dd*ff*cell*5;rr*=1-ff*.5}}
  /* scroll: as the cover leaves, each dot turns into a character and drifts off, one by one, softly */
  if(sp>0){var hk=(j*cols+i),tk=(sp*1.25-hsh(hk)*.45)/.8;tk=tk<0?0:tk>1?1:tk;tk=tk*tk*(3-2*tk);
   if(tk>0){var gx2=cx+(hsh(hk+7)-.5)*cell*8*tk*tk,gy2=cy+tk*tk*cell*(3+hsh(hk+3)*10);GLS.push(gx2,gy2,tn,tk);rr*=1-tk;if(rr<cell*.05)continue}}
  x.moveTo(cx+rr,cy);x.arc(cx,cy,rr,0,6.2832)}
 x.fill();
 if(GLS.length){x.font='600 '+Math.round(cell*1.35)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';
  for(var q2=0;q2<GLS.length;q2+=4){var t3=GLS[q2+2],a3=GLS[q2+3];x.globalAlpha=Math.min(1,a3*1.6)*(1-Math.max(0,a3-.75)*2.4);
   x.fillText(t3>.8?'@':t3>.62?'#':t3>.46?'%':t3>.32?'*':t3>.2?'+':t3>.1?'=':':',GLS[q2],GLS[q2+1])}x.globalAlpha=1}

 x.globalAlpha=1;return intro<1}
function setSay(a){if(asleep===a)return;asleep=a;say.classList.add('pop');setTimeout(function(){txt.textContent=a?IDLE:ACTIVE;say.classList.remove('pop')},120)}
function wake(cx,cy){mx=cx;my=cy;has=true;last=performance.now();setSay(false);
 var r=cv.getBoundingClientRect();tlx=(cx-r.left)*W/(r.width||1);tly=(cy-r.top)*H/(r.height||1);if(hv<.01){lx=tlx;ly=tly}hvT=(tlx>-20&&tly>-20&&tlx<W+20&&tly<H+20)?1:0;go()}
addEventListener('pointermove',function(e){wake(e.clientX,e.clientY)},{passive:true});
addEventListener('pointerdown',function(e){wake(e.clientX,e.clientY)},{passive:true});
function frame(now){raf=0;if(!vis||!W)return;
 if(now-last>7000)setSay(true);
 var r=w.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.58,tx=0,ty=0,lx=0,ly=0;
 if(has&&!asleep){var dx=mx-cx,dy=my-cy,dd=Math.sqrt(dx*dx+dy*dy)||1,k=Math.min(1,dd/(r.width*.45));lx=dx/dd*k;ly=dy/dd*k;
  var R=r.width*.05,f=Math.min(1,dd/(r.width*1.6));tx=dx/dd*f*R;ty=dy/dd*f*R*.5}
 if(RM){tx=0;ty=0}
 vx+=(tx-px)*.045;vy+=(ty-py)*.045;vx*=.86;vy*=.86;px+=vx;py+=vy;
 var br=RM?0:Math.sin((now-t0)/(asleep?1500:900)),rot=Math.max(-5,Math.min(5,px/r.width*26+vx*.5));
 pet.style.transform='translate('+px.toFixed(2)+'px,'+(py+br*(asleep?2.5:1.2)).toFixed(2)+'px) rotate('+rot.toFixed(2)+'deg)';
 var gx=asleep?0:lx*14,gy=asleep?8:ly*8;ex+=(gx-ex)*.22;ey+=(gy-ey)*.22;
 var busy=false;
 /* redraw the glyphs only when the pupils have moved enough to change a cell */
 follow();scrollP();
 if(Math.abs(ex-dex)>.8||Math.abs(ey-dey)>.8||now-born<950||hv>0||sp!==lsp){lsp=sp;dex=ex;dey=ey;busy=render(now)}
 raf=requestAnimationFrame(frame)}
/* the hover point eases after the cursor (outside frame(), whose own lx/ly are the look direction) */
function follow(){lx+=(tlx-lx)*.12;ly+=(tly-ly)*.12;hv+=(hvT-hv)*.06;if(hv<.005)hv=0}
function go(){if(!raf&&vis&&ims.length===4)raf=requestAnimationFrame(frame)}
Promise.all(srcs.map(function(s){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src=s})})).then(function(a){
 ims=a;return document.fonts&&document.fonts.load?document.fonts.load("500 14px 'Sometype Mono'"):0}).then(function(){
 size();born=performance.now();w.classList.add('asc');go()}).catch(function(){});
addEventListener('resize',function(){size();go()});
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(w);
document.addEventListener('visibilitychange',function(){if(!document.hidden)go()})})();

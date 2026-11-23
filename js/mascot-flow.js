/* the mascot travels down the page, like the reference star:
   as the hero scrolls away its cells break loose into a cloud of dots
   that drifts behind the page, and as the founder quote comes up the
   dots gather again into the mascot, faint, behind the quote card.
   One fixed canvas behind the content (z 0), so glass cards blur it.
   The cells come from the same ascii art as the hero mascot.
   Reduced motion or no quote on the page: nothing runs. */
(function(){
var d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var art=d.querySelector('.hero-art'),quote=d.querySelector('.quote');
if(RM||!art||!quote)return;
var RAMP=[' ','.',':','-','=','+','*','/','%','#','░','▒','▓'];
var cv=d.createElement('canvas'),x=cv.getContext('2d');cv.className='m-flow';cv.setAttribute('aria-hidden','true');d.body.appendChild(cv);
var DPR=Math.min(2,devicePixelRatio||1),W=0,H=0,cols=0,rows=0,cells=[],ready=false,raf=0,t0=performance.now();
function size(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';req()}
function hash(k,n){var h=(k*374761393+n*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
fetch('/embeds/hero-mascot.html?v=31').then(function(r){return r.text()}).then(function(t){
 var m=t.match(/const asciiArt = \[([\s\S]*?)\];/);if(!m)return;
 var rs=(m[1].match(/"([^"]*)"/g)||[]).map(function(q){return q.slice(1,-1)});rows=rs.length;rs.forEach(function(r){cols=Math.max(cols,r.length)});
 var b=new Uint8Array(cols*rows);for(var j=0;j<rows;j++)for(var i=0;i<cols;i++)b[j*cols+i]=(rs[j][i]||' ')!==' '?1:0;
 /* how deep each cell sits: share of filled cells in a 9x5 window */
 for(j=0;j<rows;j++)for(i=0;i<cols;i++){if(!b[j*cols+i])continue;var f=0,n=0;
  for(var dj=-2;dj<=2;dj++)for(var di=-4;di<=4;di++){n++;var jj=j+dj,ii=i+di;if(jj>=0&&jj<rows&&ii>=0&&ii<cols)f+=b[jj*cols+ii]}
  var k=cells.length,dep=Math.max(0,(f/n-.45)/.55);
  cells.push({i:i,j:j,lv:Math.max(4,Math.min(12,Math.round(5.5+dep*7+(hash(k,7)-.5)*2.6))),
   cx:hash(k,1),cy:hash(k,2),ph:hash(k,3)*6.28,sp:.4+hash(k,4)})}
 ready=true;size()});
/* where the art sits inside a box (same fit as the hero mascot) */
function fit(r,k){var fs=Math.min((r.width-40)/cols*1.5,(r.height-40)/rows*1.2)*k,cw=fs*.58,ch=fs*.95;
 return {cw:cw,ch:ch,fs:fs,ox:r.left+(r.width-cols*cw)/2,oy:r.top+(r.height-rows*ch)/2}}
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}
function frame(now){raf=0;if(!ready)return;
 var hr=d.querySelector('.hero').getBoundingClientRect(),ar=art.getBoundingClientRect(),qr=quote.getBoundingClientRect();
 /* a: the hero leaving; b: the quote arriving; c: the quote leaving */
 var a=cl(-hr.top/(hr.height*.7)),b=cl(1-(qr.top+qr.height/2-H/2)/(H*.95)),c=cl(-(qr.top+qr.height*.2)/(H*.6));
 /* the cloud shows near the two ends of the trip and thins out in between */
 var left=cl(1-(-hr.bottom)/(H*.9)),vis=Math.max(a>0?left:0,b>0?Math.min(1,b*1.6):0)*(1-c);
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);
 if(vis<.01||a<=0)return;
 var tm=(now-t0)/1000,hf=fit(ar,1),qf=fit(qr,.82),eb=ease(b),ea=ease(a);
 var cw=hf.cw+(qf.cw-hf.cw)*eb,ch=hf.ch+(qf.ch-hf.ch)*eb;
 x.font='500 '+(hf.fs+(qf.fs-hf.fs)*eb).toFixed(1)+"px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';x.fillStyle='#F2E7DC';
 for(var n=0;n<cells.length;n++){var e=cells[n];
  var hx=hf.ox+(e.i+.5)*hf.cw,hy=hf.oy+(e.j+.5)*hf.ch;
  var qx=qf.ox+(e.i+.5)*qf.cw,qy=qf.oy+(e.j+.5)*qf.ch;
  /* the cloud fills the screen and drifts slowly */
  var gx=e.cx*W+Math.sin(tm*e.sp+e.ph)*18,gy=e.cy*H+Math.cos(tm*e.sp*.8+e.ph)*14;
  var px=hx+(gx-hx)*ea,py=hy+(gy-hy)*ea;
  px+=(qx-px)*eb;py+=(qy-py)*eb;
  if(c>0){px+=(gx-px)*ease(c);py+=(gy-py)*ease(c)}
  /* in flight a cell is a dot; landing, it becomes its glyph again */
  var land=Math.max(eb>.85?(eb-.85)/.15:0,a<.15?1-a/.15:0)*(1-c);
  if(land<=.5){
   /* a dot in the cloud: a small square pixel, a few of them brighter, like the reference */
   var dz=hash(n,9)<.2?3:2;x.globalAlpha=vis*(hash(n,5)<.3?.85:.5);x.fillRect(px-dz/2,py-dz/2,dz,dz);continue}
  x.globalAlpha=vis*.2;var lv=e.lv;
  if(lv>=10){x.fillRect(px-cw/2+.5,py-ch/2+.5,cw-1,ch-1)}else x.fillText(RAMP[lv],px,py)}
 x.globalAlpha=1;
 if(vis>.01)req()}
function req(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('scroll',req,{passive:true});addEventListener('resize',size);
})();

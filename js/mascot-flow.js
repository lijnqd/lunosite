/* the mascot flows down the page into other shapes, like the reference star:
   one set of ascii particles, three forms — the mascot in the hero, the lunö
   star behind the about statement, the mascot again behind the founder quote.
   Between two forms every particle travels on its own from its cell in the
   first shape to its cell in the next, each a little later than the last, so
   the figure pours from one form into the other as a stream of glyphs,
   never a cloud. Away from the forms (services, advantages) nothing is drawn.
   One fixed canvas behind the content (z 0): glass cards soften it, the pink
   hero card hides it while the hero mascot itself is on screen.
   Reduced motion: nothing runs. */
(function(){
var d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var heroArt=d.querySelector('.hero-art'),about=d.querySelector('#about'),quote=d.querySelector('.quote');
if(RM||!heroArt||!about||!quote)return;
var RAMP=[' ','.',':','-','=','+','*','/','%','#','░','▒','▓'];
var STAR='M28.6569 14.0705L18.8811 11.9709L24.5867 5.04269C24.9272 4.62999 24.3777 4.08058 23.965 4.42106L17.0368 10.1267L14.9346 0.348217C14.834 -0.116072 14.1711 -0.116072 14.0705 0.348217L11.9709 10.1241L5.04269 4.41848C4.62999 4.078 4.08058 4.62741 4.42106 5.04011L10.1267 11.9683L0.348217 14.0705C-0.116072 14.1711 -0.116072 14.834 0.348217 14.9346L10.1267 17.0368L4.42106 23.965C4.08058 24.3777 4.62999 24.9272 5.04269 24.5867L11.9709 18.8811L14.0705 28.6569C14.1711 29.1214 14.834 29.1214 14.9346 28.6569L17.0368 18.8811L23.965 24.5867C24.3777 24.9272 24.9272 24.3777 24.5867 23.965L18.8811 17.0368L28.6569 14.9346C29.1214 14.834 29.1214 14.1711 28.6569 14.0705Z';
var cv=d.createElement('canvas'),x=cv.getContext('2d');cv.className='m-flow';cv.setAttribute('aria-hidden','true');d.body.appendChild(cv);
var DPR=Math.min(2,devicePixelRatio||1),W=0,H=0,raf=0,ready=false,N=0,lag;
function hash(k,n){var h=(k*374761393+n*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}
/* a shape = filled cells of a grid, each with its glyph level (blocks in the core, # % * / toward the edge) */
function shape(b,cols,rows){var cells=[];
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){if(!b[j*cols+i])continue;var f=0,n=0;
  for(var dj=-2;dj<=2;dj++)for(var di=-4;di<=4;di++){n++;var jj=j+dj,ii=i+di;if(jj>=0&&jj<rows&&ii>=0&&ii<cols)f+=b[jj*cols+ii]}
  var dep=Math.max(0,(f/n-.45)/.55);cells.push({i:i,j:j,lv:Math.max(4,Math.min(12,Math.round(5.5+dep*7+(hash(cells.length,7)-.5)*2.6)))})}
 return {cols:cols,rows:rows,cells:cells}}
function starShape(){var cols=72,rows=Math.round(72*.58/.95),c=d.createElement('canvas');c.width=cols;c.height=rows;var g=c.getContext('2d');
 g.setTransform(cols/29,0,0,rows/29,0,0);g.fill(new Path2D(STAR));var px=g.getImageData(0,0,cols,rows).data,b=new Uint8Array(cols*rows);
 for(var k=0;k<cols*rows;k++)b[k]=px[k*4+3]>110?1:0;return shape(b,cols,rows)}
var forms=[];
fetch('/embeds/hero-mascot.html?v=32').then(function(r){return r.text()}).then(function(t){
 var m=t.match(/const asciiArt = \[([\s\S]*?)\];/);if(!m)return;
 var rs=(m[1].match(/"([^"]*)"/g)||[]).map(function(q){return q.slice(1,-1)}),rows=rs.length,cols=0;rs.forEach(function(r){cols=Math.max(cols,r.length)});
 var b=new Uint8Array(cols*rows);for(var j=0;j<rows;j++)for(var i=0;i<cols;i++)b[j*cols+i]=(rs[j][i]||' ')!==' '?1:0;
 var masc=shape(b,cols,rows),star=starShape();
 /* each form: its element, its shape, how big it sits in the element, how strong it is drawn */
 forms=[{el:heroArt,s:masc,k:1,fit:'hero',a:.0},{el:about,s:star,k:.78,a:.16},{el:quote,s:masc,k:.82,a:.18}];
 N=Math.max(masc.cells.length,star.cells.length);
 /* every particle sets off a little later than the one above it, so the shape pours */
 lag=new Float32Array(N);for(var k=0;k<N;k++){var c=masc.cells[Math.floor(k*masc.cells.length/N)];lag[k]=.55*(c.j/masc.rows)+.25*hash(k,3)}
 ready=true;size()});
function place(f){var r=f.el.getBoundingClientRect(),S=f.s,fs;
 if(f.fit==='hero')fs=Math.min((r.width-40)/S.cols*1.5,(r.height-40)/S.rows*1.2);
 else fs=Math.min(r.width*f.k/(S.cols*.58),r.height*f.k/(S.rows*.95));
 var cw=fs*.58,ch=fs*.95;return {cw:cw,ch:ch,fs:fs,ox:r.left+(r.width-S.cols*cw)/2,oy:r.top+(r.height-S.rows*ch)/2,mid:r.top+r.height/2,r:r}}
function size(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';req()}
function frame(){raf=0;if(!ready)return;
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);
 var P=forms.map(place),c=H/2;
 /* the two forms around the middle of the screen, and how far we are between them */
 var i=0;while(i<P.length-1&&P[i+1].mid<c)i++;
 if(i>=P.length-1){var last=P[P.length-1];if(last.r.bottom<0)return;i=P.length-2}
 var A=P[i],B=P[i+1],t=cl((c-A.mid)/(B.mid-A.mid));
 /* strength: each form shows while its element is on screen; in the gap, only the stream near the screen */
 var pa=cl(1-Math.abs(A.mid-c)/(H*.75)),pb=cl(1-Math.abs(B.mid-c)/(H*.75));
 var fa=forms[i],fb=forms[i+1];
 if(t<=0&&i===0&&A.r.top>-A.r.height*.15)return;
 x.textAlign='center';x.textBaseline='middle';x.fillStyle='#F2E7DC';
 var SA=fa.s,SB=fb.s;
 for(var k=0;k<N;k++){
  var ca=SA.cells[Math.floor(k*SA.cells.length/N)],cb=SB.cells[Math.floor(k*SB.cells.length/N)];
  var tk=ease(cl((t-lag[k]*.6)/.4));
  var ax=A.ox+(ca.i+.5)*A.cw,ay=A.oy+(ca.j+.5)*A.ch,bx=B.ox+(cb.i+.5)*B.cw,by=B.oy+(cb.j+.5)*B.ch;
  /* the path bows sideways a little, so the stream has a body */
  var sw=Math.sin(tk*Math.PI)*(hash(k,5)-.5)*W*.18;
  var px=ax+(bx-ax)*tk+sw,py=ay+(by-ay)*tk;
  if(py<-20||py>H+20||px<-20||px>W+20)continue;
  var fs=Math.round(A.fs+(B.fs-A.fs)*tk),cw=A.cw+(B.cw-A.cw)*tk,ch=A.ch+(B.ch-A.ch)*tk;
  /* in transit the glyph thins out to + - : . and thickens again on landing */
  var tr=Math.sin(tk*Math.PI),lv=Math.max(1,Math.round((tk<.5?ca.lv:cb.lv)-tr*8));
  var al=tk<.5?(fa.a||.3)*(1-tr)+.42*tr:fb.a*(1-tr)+.42*tr;
  /* the hero form itself is drawn by the hero canvas: only its escaping particles show here */
  if(i===0&&tk<.02)continue;
  al*=Math.max(pa,pb,tr);if(al<.01)continue;x.globalAlpha=al;
  if(lv>=10){x.fillRect(px-cw/2+.5,py-ch/2+.5,cw-1,ch-1);continue}
  if(x.__fs!==fs){x.font='500 '+fs.toFixed(1)+"px 'Sometype Mono',monospace";x.__fs=fs}
  x.fillText(RAMP[lv],px,py)}
 x.globalAlpha=1}
function req(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('scroll',req,{passive:true});addEventListener('resize',size);
})();

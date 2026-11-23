/* the mascot's ascii runs through the whole page: as you scroll, the glyphs
   leave the hero mascot and pour, as a stream, into the next block — the
   about statement, headings, the quote, the numbers — landing on that
   block's own letters, then from there into the next block, and so on.
   Nothing is drawn while you rest on a block: the stream exists only in
   transit, between two blocks, so the page never gets a background pattern.
   One fixed canvas behind the content (z 0); glass cards soften it.
   Reduced motion: nothing runs. */
(function(){
var d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var heroArt=d.querySelector('.hero-art');
if(RM||!heroArt)return;
var GL=['.',':','-','=','+','*','/','%','#','.',':','+'];
var SEL=['#about .about-text','.adv h2','.quote blockquote','#cases .cs-title','.stats','#reviews h2','#process h2','#faq h2','#contacts .luna p'];
var cv=d.createElement('canvas'),x=cv.getContext('2d');cv.className='m-flow';cv.setAttribute('aria-hidden','true');d.body.appendChild(cv);
var DPR=Math.min(2,devicePixelRatio||1),W=0,H=0,raf=0,N=700,anchors=[],masc=null,lag=new Float32Array(N),sm={i:-1,t:0};
function hash(k,n){var h=(k*374761393+n*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
for(var k=0;k<N;k++)lag[k]=hash(k,3);
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}
/* the letters of a block, as page positions (sampled to at most 900) */
function letters(el){var pts=[],w=d.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,all=[];
 while(n=w.nextNode()){if(n.parentNode.closest('.sr,script,style,.ascii'))continue;for(var i=0;i<n.nodeValue.length;i++)if(n.nodeValue[i].trim())all.push([n,i])}
 var step=Math.max(1,Math.ceil(all.length/900)),r=d.createRange(),sy=scrollY,sx=scrollX;
 for(var q=0;q<all.length;q+=step){r.setStart(all[q][0],all[q][1]);r.setEnd(all[q][0],all[q][1]+1);var b=r.getBoundingClientRect();if(b.width)pts.push([b.left+b.width/2+sx,b.top+b.height/2+sy])}
 return pts}
/* the hero mascot's cells, from its ascii art, laid out like the hero canvas */
function mascot(){var r=heroArt.getBoundingClientRect(),S=masc,fs=Math.min((r.width-40)/S.cols*1.5,(r.height-40)/S.rows*1.2),cw=fs*.58,ch=fs*.95,
 ox=r.left+scrollX+(r.width-S.cols*cw)/2,oy=r.top+scrollY+(r.height-S.rows*ch)/2,pts=[];
 S.cells.forEach(function(c){pts.push([ox+(c[0]+.5)*cw,oy+(c[1]+.5)*ch])});return pts}
function build(){if(!masc)return;
 var list=[{el:heroArt,pts:mascot()}];
 SEL.forEach(function(s){var el=d.querySelector(s);if(!el||el.closest('.hero'))return;var p=letters(el);if(p.length>8)list.push({el:el,pts:p})});
 list.forEach(function(a){var ys=a.pts.map(function(p){return p[1]});a.mid=(Math.min.apply(0,ys)+Math.max.apply(0,ys))/2});
 list.sort(function(a,b){return a.mid-b.mid});anchors=list;sm.i=-1;req()}
fetch('/embeds/hero-mascot.html?v=32').then(function(r){return r.text()}).then(function(t){
 var m=t.match(/const asciiArt = \[([\s\S]*?)\];/);if(!m)return;
 var rs=(m[1].match(/"([^"]*)"/g)||[]).map(function(q){return q.slice(1,-1)}),cols=0,cells=[];rs.forEach(function(r){cols=Math.max(cols,r.length)});
 rs.forEach(function(r,j){for(var i=0;i<r.length;i++)if(r[i]!==' ')cells.push([i,j])});
 masc={cols:cols,rows:rs.length,cells:cells};size();
 (d.fonts&&d.fonts.ready?d.fonts.ready:Promise.resolve()).then(function(){setTimeout(build,300)})});
function size(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';build()}
function frame(){raf=0;x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);if(anchors.length<2)return;
 /* the screen line a block "arrives" at: a bit below the middle */
 var line=scrollY+H*.62,i=0;while(i<anchors.length-1&&anchors[i+1].mid<line)i++;
 if(i>=anchors.length-1)return;
 var A=anchors[i],B=anchors[i+1],tt=cl((line-A.mid)/(B.mid-A.mid));
 /* the shown progress trails the scroll a little, so the pour is soft */
 if(sm.i!==i){sm.i=i;sm.t=tt}sm.t+=(tt-sm.t)*.14;var t=sm.t;if(Math.abs(tt-t)>.0006)req();
 if(t<=.001||t>=.999)return;
 var nA=A.pts.length,nB=B.pts.length,sy=scrollY,sx=scrollX;
 x.font="500 13px 'Sometype Mono',monospace";x.textAlign='center';x.textBaseline='middle';x.fillStyle='#F2E7DC';
 for(var k=0;k<N;k++){
  var a=A.pts[Math.floor(k*nA/N)],b=B.pts[Math.floor(k*nB/N)];
  /* the glyphs travel together, each a touch after the last: the source shape
     melts into the target shape as one body, not a scatter */
  var tk=ease(cl((t-lag[k]*.16)/.84));if(tk<=0||tk>=1)continue;
  var sw=Math.sin(tk*Math.PI)*(hash(k,5)-.5)*W*.05;
  var px=a[0]+(b[0]-a[0])*tk+sw-sx,py=a[1]+(b[1]-a[1])*tk-sy;
  if(py<-20||py>H+20)continue;
  x.globalAlpha=Math.min(1,1.6*Math.sin(tk*Math.PI))*.85;
  x.fillText(GL[(k+((tk*6)|0))%GL.length],px,py)}
 x.globalAlpha=1}
function req(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('scroll',req,{passive:true});addEventListener('resize',size);addEventListener('load',function(){setTimeout(build,400)});
})();

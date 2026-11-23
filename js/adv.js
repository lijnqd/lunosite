/* advantages: one pinned screen. Scrolling walks through the points: the active title
   scrambles in, and the ascii icon on the right melts into the next point's icon,
   glyph by glyph (each glyph finds the nearest free cell of the next shape). */
(function(){var sec=document.querySelector('.adv.av'),cv=document.getElementById('avCv');if(!sec||!cv)return;
var items=[].slice.call(sec.querySelectorAll('.av-item')),n=items.length,x=cv.getContext('2d'),
 RM=matchMedia('(prefers-reduced-motion:reduce)').matches,DPR=Math.min(2,devicePixelRatio||1),G=34,
 GL='.:-=+*',shapes=[],mx=-1e4,my=-1e4,hv=0,hvT=0,pairs={},act=0,raf=0,S=0;
function hash(k,m){var h=(k*374761393+m*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function cl(v){return v<0?0:v>1?1:v}function ease(v){return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}
/* an svg icon -> the grid cells it covers, with how much of each cell it covers */
function sample(src){return new Promise(function(res){var im=new Image();im.onload=function(){
 var R=8,c=document.createElement('canvas'),q=c.getContext('2d',{willReadFrequently:true});c.width=c.height=G*R;
 var iw=im.naturalWidth||52,ih=im.naturalHeight||52,k=G*R*.84/Math.max(iw,ih),w=iw*k,h=ih*k;
 q.drawImage(im,(G*R-w)/2,(G*R-h)/2,w,h);var d=q.getImageData(0,0,G*R,G*R).data,out=[];
 for(var j=0;j<G;j++)for(var i=0;i<G;i++){var s=0;for(var v=0;v<R;v++)for(var u=0;u<R;u++){var o=((j*R+v)*G*R+i*R+u)*4;s+=d[o+3]}
  s/=R*R*255;if(s>.12)out.push([i,j,s])}
 res(out)};im.onerror=function(){res([])};im.src=src})}
/* glyph i of shape a travels to cell pair[i] of shape b: greedy nearest, the shorter shape repeats cells */
function pair(a,b){var key=a+'-'+b;if(pairs[key])return pairs[key];var A=shapes[a].slice(),B=shapes[b].slice(),N=Math.max(A.length,B.length),k;
 for(k=0;A.length<N;k++)A.push(A[Math.floor(hash(k,11)*shapes[a].length)]);
 for(k=0;B.length<N;k++)B.push(B[Math.floor(hash(k,12)*shapes[b].length)]);
 var used=new Uint8Array(N),out=[],ord=A.map(function(_,i){return i}).sort(function(p,q){return hash(p,4)-hash(q,4)});
 ord.forEach(function(i){var a0=A[i],best=-1,bd=1e9;for(var j=0;j<N;j++){if(used[j])continue;var dx=B[j][0]-a0[0],dy=B[j][1]-a0[1],dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=j}}used[best]=1;out.push([a0,B[best],i])});
 return pairs[key]=out}
function glyph(c,k){if(c>.88)return'#%@'[Math.floor(hash(k,2)*3)];if(c>.6)return'*+='[Math.floor(hash(k,3)*3)];if(c>.32)return':-'[Math.floor(hash(k,5)*2)];return'.'}
function size(){var r=cv.getBoundingClientRect();S=Math.min(r.width,r.height);cv.width=r.width*DPR;cv.height=r.height*DPR;cv.__w=r.width;cv.__h=r.height}
function draw(){raf=0;if(!shapes.length)return;var r=sec.getBoundingClientRect(),vh=innerHeight,span=Math.max(1,r.height-vh);
 /* nothing to draw while the block is off screen */
 if(r.bottom<0||r.top>vh)return;
 var p=cl(-r.top/span)*(n-1),s=Math.min(n-2,Math.floor(p)),f=p-s,t=RM?(f>.5?1:0):cl((f-.18)/.64);
 if(n<2){s=0;t=0}
 var a=Math.round(p);if(a!==act){items[act].classList.remove('on');items[a].classList.add('on');act=a;
  var h=items[a].querySelector('.av-t');if(window.pxScramble&&!RM)window.pxScramble(h,420)}
 /* the first icon assembles from scattered glyphs as the block comes up */
 var e=RM?1:ease(cl((vh-r.top)/(vh*.9)));
 var W=cv.__w,H=cv.__h,cell=S/G,ox=(W-S)/2,oy=(H-S)/2;
 x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);x.fillStyle='#FFB3AD';x.textAlign='center';x.textBaseline='middle';
 x.font='500 '+Math.round(cell*1.08)+"px 'Sometype Mono',monospace";
 var P=pair(s,s+1),seen={};
 for(var k=0;k<P.length;k++){var A=P[k][0],B=P[k][1],id=P[k][2],lag=hash(id,7)*.35,tk=ease(cl((t-lag)/.65));
  var gx=A[0]+(B[0]-A[0])*tk,gy=A[1]+(B[1]-A[1])*tk,c=A[2]+(B[2]-A[2])*tk;
  var sw=Math.sin(tk*Math.PI);if(e>=1&&(tk<=0||tk>=1)){var ck=Math.round(gx)+','+Math.round(gy);if(seen[ck])continue;seen[ck]=1}gx+=(hash(id,8)-.5)*3*sw;gy+=(hash(id,9)-.5)*3*sw;
  if(e<1){var sx=hash(id,13)*G*1.6-G*.3,sy=hash(id,14)*G*1.6-G*.3,ek=cl((e-hash(id,15)*.4)/.6);gx=sx+(gx-sx)*ek;gy=sy+(gy-sy)*ek;x.globalAlpha=ek}else x.globalAlpha=1;
  if(hv>.01){var px=ox+(gx+.5)*cell,py=oy+(gy+.5)*cell,dx=px-mx,dy=py-my,dd=Math.sqrt(dx*dx+dy*dy)||1,RR=cell*6;
   if(dd<RR){var f2=Math.pow(1-dd/RR,2)*hv;gx+=dx/dd*f2*2.4;gy+=dy/dd*f2*2.4;c*=1-f2*.7;if(f2>.35)sw=1}}
  var g=(sw>.6||(e<1&&x.globalAlpha<.9))?GL[(id+((tk*9+e*9+hv*performance.now()/90)|0))%GL.length]:glyph(c,id+(tk>.5?1e4:0));
  x.fillText(g,ox+(gx+.5)*cell,oy+(gy+.5)*cell)}
 x.globalAlpha=1;
 hv+=(hvT-hv)*.12;if(Math.abs(hvT-hv)>.005||hvT>0&&mv>performance.now()-500)req()}
function req(){if(!raf)raf=requestAnimationFrame(draw)}
Promise.all(items.map(function(it){return sample(it.dataset.icon)})).then(function(sh){shapes=sh;size();
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(req);req()});
var mv=0;/* the glyphs shy away from the pointer and ripple while it moves */
if(!RM&&matchMedia('(hover:hover)').matches){cv.parentNode.addEventListener('pointermove',function(ev){var r=cv.getBoundingClientRect();mx=(ev.clientX-r.left)*cv.__w/r.width;my=(ev.clientY-r.top)*cv.__h/r.height;hvT=1;mv=performance.now();req()});
 cv.parentNode.addEventListener('pointerleave',function(){hvT=0;req()})}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){size();req()});
})();

(function(){var p=document.getElementById('pre');if(!p)return;
try{if(sessionStorage.getItem('luno_pre')){p.remove();return}sessionStorage.setItem('luno_pre','1')}catch(e){}
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches){p.remove();return}
var h=document.documentElement,cv=p.querySelector('canvas'),x=cv.getContext('2d'),pc=p.querySelector('.pc'),W,H,dpr=Math.min(2,window.devicePixelRatio||1),S,G=3,C,cols,rows,jit=[];
var BG='#141414',PINK=[255,179,173],BEIGE=[242,231,220];
h.classList.add('pre-lock');
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;S=W<810?18:26;C=S+G;cols=Math.ceil(W/C);rows=Math.ceil(H/C);jit=[];for(var i=0;i<cols*rows;i++)jit.push(Math.random()*.1)}
size();addEventListener('resize',size);
function cl(v){return v<0?0:v>1?1:v}
function mix(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function rgba(c,a){return'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a.toFixed(3)+')'}
function frame(p,q,t){x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
 if(q===0){x.fillStyle=BG;x.fillRect(0,0,W,H)}
 for(var cy=0;cy<rows;cy++)for(var cx=0;cx<cols;cx++){
  var d=(cx/cols+(rows-1-cy)/rows)/2,j=jit[cy*cols+cx],px=cx*C,py=cy*C;
  var a=cl((p*1.25-d-j)/.14);
  if(q>0){var v=1-cl((q*1.3-d-j)/.14);if(v<=0)continue;x.fillStyle=BG;x.fillRect(px,py,C,C);a=a>0?a:0;x.fillStyle=rgba(PINK,.95*v);x.fillRect(px,py,S,S);continue}
  if(a<=0){x.fillStyle=rgba(BEIGE,.04+.03*Math.sin(t/500+cx*.6+cy*.4));x.fillRect(px,py,S,S)}
  else{var edge=a<1;x.fillStyle=rgba(edge?mix(PINK,[255,255,255],1-a):PINK,edge?.55+.45*a:.95);x.fillRect(px,py,S,S)}}}
var t0=performance.now(),MIN=(innerWidth<810?500:700),loaded=document.readyState==='complete',phase=0,pe=0,pv=0;
addEventListener('load',function(){loaded=true});
function loop(now){var e=now-t0;
 if(phase===0){var v=cl(e/MIN);v=1-Math.pow(1-v,2);if(!loaded)v=Math.min(v,.9);pv=Math.max(pv,v);var n=Math.round(pv*100);pc.innerHTML=(n<10?'0':'')+n+'<b>%</b>';frame(pv,0,now);
  if((e>=MIN&&loaded)||e>3000){phase=1;pv=1;pc.innerHTML='100<b>%</b>';pe=now;p.classList.add('exit');setTimeout(function(){},0)}}
 else{var q=cl((now-pe-100)/550);frame(1,q,now);if(q>=1){h.classList.remove('pre-lock');p.remove();return}}
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();

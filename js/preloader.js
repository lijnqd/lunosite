/* lunö pixel preloader (first visit in a session)
   a dim pixel grid fills from the bottom in uneven columns: beige body, pink leading edge,
   a few dark pixels in the trail; a mono counter shows real progress; at 100% the screen fades out */
(function(){
var d=document,h=d.documentElement,w=window,el=d.getElementById('pre');
var first=true;try{first=!sessionStorage.getItem('luno_pre');sessionStorage.setItem('luno_pre','1')}catch(e){}
var RM=w.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!el)return;if(!first||RM){el.remove();return}
h.classList.add('pre-lock');
var cv=d.createElement('canvas'),x=cv.getContext('2d'),box=d.createElement('div');
box.className='pc';box.innerHTML='<i class="pi"><b></b><b></b><b></b><b></b></i><span>0%</span>';
el.appendChild(cv);el.appendChild(box);var num=box.querySelector('span');
var W,H,dpr,S,G,C,cols,rows,off,sh,trail,ahead;
function size(){W=innerWidth;H=innerHeight;dpr=Math.min(2,w.devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;
 S=W<810?7:9;G=1;C=S+G;cols=Math.ceil(W/C)+1;rows=Math.ceil(H/C)+1;
 off=new Float32Array(cols);sh=new Float32Array(cols*rows);trail=new Uint8Array(cols*rows);ahead=new Float32Array(cols*rows);
 /* column heights: smooth wave + per-column jitter -> jagged skyline like the reference */
 var p1=Math.random()*6,p2=Math.random()*6;
 for(var c=0;c<cols;c++)off[c]=.16*(.5+.5*Math.sin(c*.11+p1))+.1*(.5+.5*Math.sin(c*.37+p2))+Math.random()*.22;
 for(var i=0;i<cols*rows;i++){sh[i]=Math.random();trail[i]=Math.random()<.18?1:0;ahead[i]=Math.random()}}
size();addEventListener('resize',size);
var SPAN=.5;
function frame(p,t){
 x.setTransform(dpr,0,0,dpr,0,0);x.fillStyle='#141414';x.fillRect(0,0,W,H);
 var lv=p*(1+SPAN+.06),band=.09,c,r,i;
 for(c=0;c<cols;c++){var top=lv-off[c],px=c*C;
  for(r=0;r<rows;r++){i=c*rows+r;var y=(r+.5)/rows,py=H-(r+1)*C,g=top-y;
   if(g>band){ /* body */
    var s=.93+.07*Math.sin(t/300+sh[i]*6.28);x.fillStyle=trail[i]&&g<band*3?'rgba(255,179,173,.9)':'rgba(242,231,220,'+s.toFixed(2)+')'}
   else if(g>0){x.fillStyle=trail[i]?'rgba(20,20,20,1)':'rgba(255,179,173,1)'}       /* pink leading edge */
   else if(g>-.05&&ahead[i]<.25){x.fillStyle='rgba(255,179,173,'+(.35*(1+g/.05)).toFixed(2)+')'} /* a few pixels jump ahead */
   else{x.fillStyle='rgba(242,231,220,.035)'}                                         /* dim grid */
   x.fillRect(px,py,S,S)}}}
var t0=performance.now(),loaded=d.readyState==='complete',MIN=innerWidth<810?650:800,pv=0,out=0;
addEventListener('load',function(){loaded=true});
function ease(v){return 1-Math.pow(1-v,2.2)}
function loop(now){var e=now-t0;
 var target=ease(Math.min(1,e/MIN));if(!loaded&&e<6000)target=Math.min(target,.9);
 pv+=(target-pv)*.25;if(target>=1&&pv>.995)pv=1;
 num.textContent=Math.round(pv*100)+'%';box.setAttribute('data-n',Math.floor(e/180)%4);
 frame(pv,now);
 if(pv>=1&&!out){out=1;setTimeout(function(){el.classList.add('done');h.classList.remove('pre-lock');setTimeout(function(){el.remove()},420)},60)}
 if(!out||el.isConnected)requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();

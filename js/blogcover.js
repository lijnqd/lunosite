/* blog covers: the article's icon rebuilt from pink characters, live. The glyphs drift away from the
   cursor and grow denser under it, then settle back. Before it runs (and with reduced motion) the
   static picture stays. One icon per article, named in data-icon. */
(function(){var fs=[].slice.call(document.querySelectorAll('.p-cover[data-icon]'));if(!fs.length)return;
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const ICONS={
 tag(g){/* price tag */g.save();g.translate(600,375);g.rotate(-.5);g.beginPath();g.moveTo(-230,-120);g.lineTo(130,-120);g.lineTo(250,0);g.lineTo(130,120);g.lineTo(-230,120);g.closePath();g.fill();
  g.globalCompositeOperation='destination-out';g.beginPath();g.arc(150,0,34,0,7);g.fill();g.fillRect(-190,-30,250,24);g.fillRect(-190,22,170,24);g.restore()},
 screen(g){/* browser with a hero inside */g.lineWidth=26;g.strokeRect(250,150,700,450);g.fillRect(250,150,700,70);
  g.fillRect(310,290,380,44);g.fillRect(310,356,260,22);g.fillRect(310,450,170,60);g.globalAlpha=.55;g.fillRect(730,280,160,250);g.globalAlpha=1},
 twins(g){/* two identical pages */for(const x of [210,630]){g.lineWidth=20;g.strokeRect(x,190,360,370);g.fillRect(x,190,360,56);g.fillRect(x+40,300,240,34);g.fillRect(x+40,360,180,18);g.fillRect(x+40,450,120,46)}
  g.fillRect(588,360,24,30)},
 leak(g){/* line chart going down with an arrow */g.lineWidth=34;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(240,230);g.lineTo(440,330);g.lineTo(580,290);g.lineTo(800,520);g.stroke();
  g.beginPath();g.moveTo(800,520);g.lineTo(830,400);g.lineTo(940,555);g.lineTo(790,580);g.closePath();g.fill();g.lineWidth=16;g.beginPath();g.moveTo(200,180);g.lineTo(200,600);g.lineTo(1000,600);g.stroke()},
 brief(g){/* a sheet with lines and a pencil */g.fillRect(330,110,420,530);g.globalCompositeOperation='destination-out';for(let i=0;i<7;i++)g.fillRect(380,190+i*58,i%3==2?200:320,20);g.globalCompositeOperation='source-over';
  g.save();g.translate(820,430);g.rotate(.6);g.fillRect(-26,-220,52,330);g.beginPath();g.moveTo(-26,110);g.lineTo(26,110);g.lineTo(0,170);g.fill();g.restore()},
 talk(g){/* two speech bubbles */g.beginPath();g.roundRect(200,160,470,250,60);g.fill();g.beginPath();g.moveTo(300,400);g.lineTo(280,500);g.lineTo(400,405);g.fill();
  g.lineWidth=24;g.beginPath();g.roundRect(530,330,460,230,60);g.stroke();g.beginPath();g.moveTo(880,555);g.lineTo(920,640);g.lineTo(800,560);g.stroke();
  g.globalCompositeOperation='destination-out';for(const x of [330,435,540])g.fillRect(x-25,260,50,50);g.globalCompositeOperation='source-over'},
 spark(g){/* the ai sparkle */function st(cx,cy,r){g.beginPath();g.moveTo(cx,cy-r);g.quadraticCurveTo(cx,cy,cx+r,cy);g.quadraticCurveTo(cx,cy,cx,cy+r);g.quadraticCurveTo(cx,cy,cx-r,cy);g.quadraticCurveTo(cx,cy,cx,cy-r);g.fill()}
  st(560,400,260);st(840,200,110);st(860,560,70)},
 logovs(g){/* one mark vs a whole system */g.beginPath();g.arc(330,375,150,0,7);g.fill();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(330,375,70,0,7);g.fill();g.globalCompositeOperation='source-over';
  const cs=[[640,190,140,140],[800,190,240,140],[640,350,240,90],[900,350,140,240],[640,460,240,130]];g.lineWidth=14;cs.forEach((c,i)=>{if(i%2)g.fillRect(...c);else g.strokeRect(...c)})},
 box(g){/* a package */g.beginPath();g.moveTo(600,130);g.lineTo(880,250);g.lineTo(880,520);g.lineTo(600,640);g.lineTo(320,520);g.lineTo(320,250);g.closePath();g.fill();
  g.globalCompositeOperation='destination-out';g.lineWidth=22;g.beginPath();g.moveTo(320,250);g.lineTo(600,370);g.lineTo(880,250);g.moveTo(600,370);g.lineTo(600,640);g.stroke();g.globalCompositeOperation='source-over'},
 book(g){/* an open guide with swatches */g.beginPath();g.moveTo(600,220);g.quadraticCurveTo(420,150,220,190);g.lineTo(220,580);g.quadraticCurveTo(420,540,600,610);g.quadraticCurveTo(780,540,980,580);g.lineTo(980,190);g.quadraticCurveTo(780,150,600,220);g.fill();
  g.globalCompositeOperation='destination-out';g.fillRect(592,220,16,390);for(let i=0;i<3;i++)g.fillRect(670+i*95,280,70,70);for(let i=0;i<4;i++)g.fillRect(280,280+i*62,250-(i%2)*80,20);g.globalCompositeOperation='source-over'},
 three(g){/* one, a few, many */g.beginPath();g.arc(260,400,90,0,7);g.fill();for(const [x,y] of [[520,330],[640,330],[520,450],[640,450]]){g.beginPath();g.arc(x,y,48,0,7);g.fill()}
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){g.beginPath();g.arc(830+i*90,290+j*100,36,0,7);g.fill()}},
 clock(g){/* hourglass */g.lineWidth=26;g.beginPath();g.moveTo(400,140);g.lineTo(800,140);g.moveTo(400,610);g.lineTo(800,610);g.stroke();
  g.beginPath();g.moveTo(440,160);g.quadraticCurveTo(440,330,590,375);g.quadraticCurveTo(440,420,440,590);g.lineTo(760,590);g.quadraticCurveTo(760,420,610,375);g.quadraticCurveTo(760,330,760,160);g.closePath();g.stroke();
  g.beginPath();g.moveTo(480,250);g.lineTo(720,250);g.lineTo(600,360);g.fill();g.beginPath();g.moveTo(600,470);g.lineTo(720,575);g.lineTo(480,575);g.fill()}
};
var P='#FFB3AD',B='#F2E7DC',RAMP=' .:-=+*#%@',HOT='#%@';
fs.forEach(function(f){var icon=ICONS[f.dataset.icon];if(!icon)return;
 var o=document.createElement('canvas');o.width=1200;o.height=750;var g=o.getContext('2d');g.fillStyle=g.strokeStyle='#000';icon(g);
 var d=g.getImageData(0,0,1200,750).data,C=14,R=21,cols=Math.floor(1200/C),rows=Math.floor(750/R),cov=new Float32Array(cols*rows),near=new Float32Array(cols*rows);
 for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var s=0,n=0;for(var y=j*R;y<(j+1)*R;y+=3)for(var x=i*C;x<(i+1)*C;x+=3){s+=d[(y*1200+x)*4+3];n++}cov[j*cols+i]=s/n/255}
 for(j=0;j<rows;j++)for(i=0;i<cols;i++){var m=0;for(var q=-2;q<=2;q++)for(var r=-2;r<=2;r++){var jj=j+q,ii=i+r;if(jj>=0&&jj<rows&&ii>=0&&ii<cols)m=Math.max(m,cov[jj*cols+ii]*(1-(Math.abs(q)+Math.abs(r))*.2))}near[j*cols+i]=m}
 var cv=document.createElement('canvas'),x=cv.getContext('2d'),DPR=Math.min(2,devicePixelRatio||1);cv.className='pc-cv';cv.setAttribute('aria-hidden','true');f.appendChild(cv);
 var W=0,H=0,mx=-1e4,my=-1e4,tx=-1e4,ty=-1e4,hv=0,ht=0,raf=0,vis=false,dx=new Float32Array(cols*rows),dy=new Float32Array(cols*rows);
 function size(){var rc=f.getBoundingClientRect(),z=rc.width/(f.offsetWidth||rc.width)||1;W=f.offsetWidth;H=f.offsetHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);draw()}
 function hash(k){return Math.abs(Math.sin(k*12.9898)*43758.5453)%1}
 function draw(){var sc=Math.min(W/1200,H/750),sx=sc,sy=sc,OX=(W-1200*sc)/2,OY=(H-750*sc)/2,moving=false;x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,W,H);x.textAlign='center';x.textBaseline='middle';x.font="500 "+Math.max(8,Math.round(17*sx))+"px 'Sometype Mono',monospace";
  mx+=(tx-mx)*.15;my+=(ty-my)*.15;hv+=(ht-hv)*.08;var RR=Math.max(140,H*.42);
  for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=j*cols+i,c=cov[k],nr=near[k],h=hash(i*31+j*17),px=OX+(i+.5)*C*sx,py=OY+(j+.5)*R*sy,heat=0,fx=0,fy=0;
   if(hv>.01){var ex=px-mx,ey=py-my,dd=Math.sqrt(ex*ex+ey*ey)||1;if(dd<RR){var t=1-dd/RR;t=t*t*(3-2*t)*hv;heat=t;fx=ex/dd*t*C*sx*4.2;fy=ey/dd*t*C*sx*4.2}}
   dx[k]+=(fx-dx[k])*.09;dy[k]+=(fy-dy[k])*.09;if(Math.abs(fx-dx[k])>.05||Math.abs(fy-dy[k])>.05)moving=true;
   var X=px+dx[k],Y=py+dy[k];
   if(c>.05){x.fillStyle=P;x.globalAlpha=1;x.fillText(heat>.35?HOT[(i+j+((performance.now()/120)|0))%3]:RAMP[Math.min(9,Math.max(3,Math.round(c*9-h*1.5)))],X,Y)}
   else if(nr>.3||heat>.25){x.fillStyle=heat>.25?P:B;x.globalAlpha=heat>.25?.55*heat:.22;x.fillText(h>.5?'.':':',X,Y)}}
  x.globalAlpha=1;return moving||Math.abs(ht-hv)>.01||Math.abs(tx-mx)>.5}
 function frame(){raf=0;if(!vis)return;if(draw())raf=requestAnimationFrame(frame)}
 function go(){if(!raf&&vis)raf=requestAnimationFrame(frame)}
 f.addEventListener('pointermove',function(e){var rc=f.getBoundingClientRect(),z=rc.width/(W||1)||1;tx=(e.clientX-rc.left)/z;ty=(e.clientY-rc.top)/z;if(hv<.01){mx=tx;my=ty}ht=1;go()});
 f.addEventListener('pointerleave',function(){ht=0;go()});
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;go()}).observe(f);
 (document.fonts&&document.fonts.load?document.fonts.load("500 17px 'Sometype Mono'"):Promise.resolve()).then(function(){size();f.classList.add('live')});
 addEventListener('resize',function(){size()})});
})();

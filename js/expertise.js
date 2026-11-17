window.LUNO_EXP=[["brand identity", ["building a brand people recognize before they read the name", "turning your story into logo, color and type that work together", "giving you clear rules, so the brand stays consistent everywhere"]], ["visual meaning", ["finding the idea behind the brand before choosing how it looks", "making every color, shape and symbol mean something", "designing visuals that explain your product, not just decorate it"]], ["digital ascii", ["building brand graphics out of letters, glyphs and code", "creating interactive ascii art that reacts to people", "making your brand look like nothing else in the feed"]], ["websites", ["designing sites that tell visitors what you do in five seconds", "building clear structure from the first screen to the contact form", "turning visitors into clients, not just impressing them"]], ["ux/ui", ["researching how people really use your product", "simplifying complex flows into clear, calm interfaces", "testing ideas early, before they cost you money"]], ["design systems", ["collecting every button, color and style into one library", "helping your team design faster and stay consistent", "building a system that grows with the product"]], ["development", ["building fast, responsive sites pixel-perfect from the design", "adding micro-interactions that make the site feel alive", "taking care of seo, analytics and launch"]], ["art direction", ["setting one visual direction for photo, type and layout", "keeping campaigns and launches recognizable", "guiding photographers, illustrators and developers"]], ["brand strategy", ["defining who you are for and why they should care", "shaping positioning, tone of voice and key messages", "connecting business goals to design decisions"]]];
(function(){
var S=document.querySelector('.exp');if(!S)return;
var D=window.LUNO_EXP,card=S.querySelector('.exp-card'),stage=S.querySelector('.exp-stage'),T=card.querySelector('.exp-t'),L=card.querySelectorAll('.exp-l span');
var words=S.querySelectorAll('.exp-w'),hover=matchMedia('(hover:hover) and (pointer:fine)').matches,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var G='abcdefghijklmnopqrstuvwxyz0123456789#$%&*+=<>/',cur=-1,raf=0,mx=0,my=0,cx=0,cy=0,run=0,timers=[];
function scramble(el,txt,delay){var n=txt.length,st=0,id;el.textContent='';
 if(RM){el.textContent=txt;return}
 id=setTimeout(function step(){st+=Math.max(2,n/14|0);var o='';for(var i=0;i<n;i++)o+=i<st?txt[i]:(txt[i]===' '?' ':(i<st+6?G[Math.random()*G.length|0]:''));el.textContent=o;if(st<n)timers.push(setTimeout(step,28))},delay);timers.push(id)}
function show(i){if(i===cur)return;cur=i;timers.forEach(clearTimeout);timers=[];
 [].forEach.call(words,function(w){w.classList.toggle('on',+w.getAttribute('data-i')===i)});
 scramble(T,D[i][0],0);for(var k=0;k<3;k++)scramble(L[k],D[i][1][k],60+k*90);
 card.classList.add('show');S.classList.add('active')}
function hide(){cur=-1;card.classList.remove('show');S.classList.remove('active');[].forEach.call(words,function(w){w.classList.remove('on')})}
function follow(){var r=stage.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight,tx=mx-r.left+24,ty=my-r.top+24;
 if(tx+w>r.width)tx=mx-r.left-w-24;if(my+24+h>innerHeight-16)ty=my-r.top-h-24;
 cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;card.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';
 raf=(Math.abs(tx-cx)>.3||Math.abs(ty-cy)>.3)?requestAnimationFrame(follow):0}
if(hover){
 stage.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(!card.classList.contains('show')){var r=stage.getBoundingClientRect();cx=mx-r.left+24;cy=my-r.top+24}if(!raf)raf=requestAnimationFrame(follow);
  var w=e.target.closest&&e.target.closest('.exp-w');if(w)show(+w.getAttribute('data-i'))});
 stage.addEventListener('pointerleave',hide);
 S.addEventListener('focusin',function(e){var w=e.target.closest('.exp-w');if(!w)return;var b=w.getBoundingClientRect();mx=b.left+b.width/2;my=b.bottom;show(+w.getAttribute('data-i'));if(!raf)raf=requestAnimationFrame(follow)});
 S.addEventListener('focusout',function(e){if(!S.contains(e.relatedTarget))hide()});
}else{
 S.classList.add('touch');show(0);
 S.addEventListener('click',function(e){var w=e.target.closest('.exp-w');if(w)show(+w.getAttribute('data-i'))});
}
/* marquee: steady drift, speeds up with scroll velocity, keeps moving on hover */
var rows=S.querySelectorAll('.exp-track'),pos=[0,0,0],dir=[-1,1,-1],base=[34,28,40],boost=0,lastY=scrollY,vis=true,last=0,inside=false;
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)requestAnimationFrame(tick)}).observe(S);
addEventListener('scroll',function(){var dy=Math.abs(scrollY-lastY);lastY=scrollY;boost=Math.min(boost+dy*3.5,700)},{passive:true});
if(hover){stage.addEventListener('pointerenter',function(){inside=true});stage.addEventListener('pointerleave',function(){inside=false})}
function tick(t){if(!vis){last=0;return}var dt=last?Math.min(.05,(t-last)/1000):0;last=t;
 if(!RM){var sp=boost;boost*=Math.pow(.04,dt);
  for(var i=0;i<rows.length;i++){var wd=rows[i].firstElementChild.offsetWidth;if(!wd)continue;
   pos[i]+=dir[i]*(base[i]+sp)*dt;if(pos[i]<=-wd)pos[i]+=wd;if(pos[i]>0)pos[i]-=wd;
   rows[i].style.transform='translate3d('+pos[i].toFixed(1)+'px,0,0)'}}
 /* words slide under a still cursor: keep the active word in sync */
 if(hover&&inside){var el=document.elementFromPoint(mx,my),w=el&&el.closest&&el.closest('.exp-w');if(w)show(+w.getAttribute('data-i'))}
 requestAnimationFrame(tick)}
for(var i=0;i<rows.length;i++)if(dir[i]>0)pos[i]=-(rows[i].firstElementChild.offsetWidth||0);
requestAnimationFrame(tick);
})();

/* Dot Morph Button: the dot in .btn morphs into a 3x3 dot grid on hover; states: idle / loading / success.
   Dots are drawn at 4x inside a wrapper scaled by .25 so they stay a perfectly even grid at any zoom. */
(function(){
var css='.btn i.dm{position:relative;background:none!important;overflow:visible}.btn i.dm b{position:absolute;left:0;top:0;width:36px;height:36px;transform:scale(.25);transform-origin:0 0}'
+'.btn i.dm span{position:absolute;left:0;top:0;width:36px;height:36px;border-radius:50%;background:currentColor;transition:left .35s cubic-bezier(.34,1.56,.64,1),top .35s cubic-bezier(.34,1.56,.64,1),width .3s,height .3s,opacity .2s,transform .3s;transition-delay:calc(var(--i)*14ms)}.btn-dark i.dm span{background:var(--pink)}.btn i.dm span:not(:nth-child(5)){opacity:0}'
+'@media(hover:hover){.btn:not(.is-loading):not(.is-success):hover i.dm span{left:calc(var(--c)*16px - 4px);top:calc(var(--r)*16px - 4px);width:12px;height:12px;opacity:1}}'
+'.btn.is-loading i.dm span{left:calc(var(--c)*16px - 4px);top:calc(var(--r)*16px - 4px);width:12px;height:12px;opacity:1;transition:none}.btn.is-loading i.dm{animation:dmp 1.1s ease-in-out infinite}@keyframes dmp{0%,100%{opacity:.35}50%{opacity:1}}'
+'.btn.is-success i.dm span{opacity:0;transform:scale(0);transition:none}.btn i.dm:after{content:"";position:absolute;left:2.5px;top:-.5px;width:4px;height:8px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s}.btn-dark i.dm:after{border-color:var(--pink)}.btn.is-success i.dm:after{transform:rotate(45deg) scale(1);opacity:1}'
+'@media(prefers-reduced-motion:reduce){.btn i.dm span,.btn i.dm:after{transition:none!important}.btn.is-loading i.dm{animation:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
document.querySelectorAll('.btn i').forEach(function(i){
 var h='<b>';for(var n=0;n<9;n++){h+='<span style="--i:'+n+';--c:'+(n%3)+';--r:'+Math.floor(n/3)+'"></span>'}
 i.classList.add('dm');i.innerHTML=h+'</b>';i.setAttribute('aria-hidden','true')});
/* API: DotMorph.set(button,'idle'|'loading'|'success') */
window.DotMorph={set:function(b,s){b.classList.toggle('is-loading',s==='loading');b.classList.toggle('is-success',s==='success')}};
})();

/* ASCII scramble: on hover the label of any button or link is replaced by random symbols that resolve back into the text (delegated, so it also covers links added later) */
(function(){
if(!window.matchMedia||!matchMedia('(hover:hover)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var CH='!<>-_\\/[]{}=+*^?#&%$@abcdefghijklmnopqrstuvwxyz0123456789';
function rnd(){return CH.charAt(Math.floor(Math.random()*CH.length))}
function prep(el){
 if(el._sc!==undefined)return el._sc;
 el._sc=null;
 var nodes=el.childNodes,tn=null,ok=true;
 for(var k=0;k<nodes.length;k++){var n=nodes[k];
  if(n.nodeType===3){if(n.nodeValue.trim()){if(tn){ok=false;break}tn=n}}
  else if(!(n.nodeType===1&&n.tagName==='I'))ok=false}
 if(!ok||!tn)return null;
 var txt=tn.nodeValue,sp=document.createElement('span');sp.className='bt';sp.textContent=txt;sp.setAttribute('aria-hidden','true');
 if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',txt.trim());
 el.replaceChild(sp,tn);
 el._sc={sp:sp,txt:txt,raf:0};return el._sc}
function reset(o){cancelAnimationFrame(o.raf);o.sp.textContent=o.txt;o.sp.style.width='';o.sp.style.display=''}
function run(el){
 var o=prep(el);if(!o)return;
 if(el.classList.contains('is-loading')||el.classList.contains('is-success'))return;
 cancelAnimationFrame(o.raf);o.sp.textContent=o.txt;o.sp.style.width='';
 var sp=o.sp,txt=o.txt,n=txt.length,w=sp.getBoundingClientRect().width;
 sp.style.display='inline-block';sp.style.width=w+'px';sp.style.whiteSpace='nowrap';
 var t0=performance.now(),D=520;
 (function f(now){
  var p=Math.min(1,(now-t0)/D),done=Math.floor(p*n*1.15),out='';
  for(var i=0;i<n;i++){var c=txt.charAt(i);out+=(c===' '||i<done)?c:rnd()}
  sp.textContent=out;
  if(p<1)o.raf=requestAnimationFrame(f);else reset(o)
 })(t0)}
document.addEventListener('mouseover',function(e){
 var el=e.target.closest&&e.target.closest('a,.btn');if(!el)return;
 if(e.relatedTarget&&el.contains(e.relatedTarget))return;run(el)});
document.addEventListener('mouseout',function(e){
 var el=e.target.closest&&e.target.closest('a,.btn');if(!el||!el._sc)return;
 if(e.relatedTarget&&el.contains(e.relatedTarget))return;reset(el._sc)});
})();

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

/* ASCII scramble: on hover the button label is replaced by random symbols that resolve back into the text */
(function(){
if(!window.matchMedia||!matchMedia('(hover:hover)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var CH='!<>-_\\/[]{}=+*^?#&%$@abcdefghijklmnopqrstuvwxyz0123456789';
document.querySelectorAll('.btn').forEach(function(b){
 var tn=null;for(var k=b.lastChild;k;k=k.previousSibling){if(k.nodeType===3&&k.nodeValue.trim()){tn=k;break}}
 if(!tn)return;
 var txt=tn.nodeValue,sp=document.createElement('span');sp.className='bt';sp.textContent=txt;
 b.setAttribute('aria-label',txt.trim());sp.setAttribute('aria-hidden','true');b.replaceChild(sp,tn);
 var raf=0;
 function rnd(){return CH.charAt(Math.floor(Math.random()*CH.length))}
 function run(){
  cancelAnimationFrame(raf);
  var w=sp.getBoundingClientRect().width;sp.style.display='inline-block';sp.style.width=w+'px';sp.style.whiteSpace='nowrap';sp.style.textAlign='center';
  var t0=performance.now(),D=520,n=txt.length;
  (function f(now){
   var p=Math.min(1,(now-t0)/D),done=Math.floor(p*n*1.15),o='';
   for(var i=0;i<n;i++){var c=txt.charAt(i);o+=(c===' '||i<done)?c:rnd()}
   sp.textContent=o;
   if(p<1)raf=requestAnimationFrame(f);else{sp.textContent=txt;sp.style.width=''}
  })(t0)}
 b.addEventListener('mouseenter',function(){if(!b.classList.contains('is-loading')&&!b.classList.contains('is-success'))run()});
 b.addEventListener('mouseleave',function(){cancelAnimationFrame(raf);sp.textContent=txt;sp.style.width=''});
});
})();

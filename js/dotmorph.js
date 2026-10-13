/* Dot Morph Button: the dot in .btn morphs into a 3x3 dot grid on hover; states: idle / loading / success */
(function(){
var css='.btn i.dm{position:relative;background:none!important;overflow:visible}.btn i.dm span{position:absolute;left:0;top:0;width:9px;height:9px;border-radius:50%;background:currentColor;transition:left .35s cubic-bezier(.34,1.56,.64,1),top .35s cubic-bezier(.34,1.56,.64,1),width .3s,height .3s,opacity .2s,transform .3s;transition-delay:calc(var(--i)*14ms)}.btn-dark i.dm span{background:var(--pink)}.btn i.dm span:not(:nth-child(5)){opacity:0}'
+'@media(hover:hover){.btn:not(.is-loading):not(.is-success):hover i.dm span{left:calc(var(--c)*4px - 1px);top:calc(var(--r)*4px - 1px);width:3px;height:3px;opacity:1}}'
+'.btn.is-loading i.dm span{left:calc(var(--c)*4px - 1px);top:calc(var(--r)*4px - 1px);width:3px;height:3px;opacity:1;animation:dmp .9s ease-in-out infinite;animation-delay:calc(var(--o)*100ms);transition:none}.btn.is-loading i.dm span:nth-child(5){animation:none;transform:scale(0);opacity:0}'
+'@keyframes dmp{0%,100%{transform:scale(.4);opacity:.4}50%{transform:scale(1.3);opacity:1}}'
+'.btn.is-success i.dm span{opacity:0;transform:scale(0);transition:none}.btn i.dm:after{content:"";position:absolute;left:2.5px;top:-.5px;width:4px;height:8px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s}.btn-dark i.dm:after{border-color:var(--pink)}.btn.is-success i.dm:after{transform:rotate(45deg) scale(1);opacity:1}'
+'@media(prefers-reduced-motion:reduce){.btn i.dm span{transition:none!important;animation:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var check=[3,7,5,2],ring=[0,1,2,5,8,7,6,3];/* cells forming a tick in the 3x3 grid */
document.querySelectorAll('.btn i').forEach(function(i){
 var h='';for(var n=0;n<9;n++){h+='<span style="--o:'+Math.max(0,ring.indexOf(n))+';--i:'+n+';--c:'+(n%3)+';--r:'+Math.floor(n/3)+'"'+(check.indexOf(n)>-1?' class="ck"':'')+'></span>'}
 i.classList.add('dm');i.innerHTML=h;i.setAttribute('aria-hidden','true')});
/* API: DotMorph.set(button,'idle'|'loading'|'success') */
window.DotMorph={set:function(b,s){b.classList.toggle('is-loading',s==='loading');b.classList.toggle('is-success',s==='success')}};
})();

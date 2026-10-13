/* Form: field-level validation with animated errors (Smooth UI "Form" behaviour, vanilla JS). Submission itself stays in the existing handler -> Cloudflare Worker -> Telegram. */
(function(){
var form=document.getElementById('form');if(!form)return;
var css='#form .ff{display:flex;flex-direction:column;min-width:0}#form .ff input{width:100%;box-sizing:border-box}#form .err{margin:0;padding:0 4px;font:400 13px/16px Inter,sans-serif;letter-spacing:-.1px;color:var(--pink);max-height:0;opacity:0;overflow:hidden;transform:translateY(-6px);transition:max-height .35s cubic-bezier(.34,1.56,.64,1),opacity .25s,transform .35s cubic-bezier(.34,1.56,.64,1),padding .35s cubic-bezier(.34,1.56,.64,1)}#form .ff.bad .err{max-height:40px;opacity:1;transform:none;padding:6px 4px 0}#form .ff.bad input{box-shadow:0 0 0 1px var(--pink)}@media(prefers-reduced-motion:reduce){#form .err{transition:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
form.setAttribute('novalidate','');
var rules={
 phone:function(v){v=v.trim();if(!v)return'enter a phone number we can reach you on';if((v.match(/\d/g)||[]).length<6||!/^[+\d\s().\-]+$/.test(v))return'that doesn’t look like a phone number';return''},
 email:function(v){v=v.trim();if(!v)return'enter your email';if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))return'check the email address';return''}
};
var fields=[];
Array.prototype.forEach.call(form.querySelectorAll('input'),function(inp){
 if(inp.name==='website')return;
 var w=document.createElement('div');w.className='ff';inp.parentNode.insertBefore(w,inp);w.appendChild(inp);
 var p=document.createElement('p');p.className='err';p.id='err-'+inp.name;p.setAttribute('role','alert');w.appendChild(p);
 inp.removeAttribute('required');
 var f={inp:inp,w:w,p:p,rule:rules[inp.name]};fields.push(f);
 function clear(){w.classList.remove('bad');inp.removeAttribute('aria-invalid');inp.removeAttribute('aria-describedby')}
 inp.addEventListener('input',clear);
 if(f.rule)inp.addEventListener('blur',function(){if(inp.value)check(f)});
});
function check(f){var m=f.rule?f.rule(f.inp.value):'';
 if(m){f.p.textContent=m;f.w.classList.add('bad');f.inp.setAttribute('aria-invalid','true');f.inp.setAttribute('aria-describedby',f.p.id)}
 else{f.w.classList.remove('bad');f.inp.removeAttribute('aria-invalid');f.inp.removeAttribute('aria-describedby')}
 return!m}
var btn=form.querySelector('button[type=submit]'),note=document.getElementById('formNote'),tm;
/* capture on document so invalid submits never reach the existing submit handler */
document.addEventListener('submit',function(e){
 if(e.target!==form)return;
 var first=null;fields.forEach(function(f){if(!check(f)&&!first)first=f});
 if(first){e.preventDefault();e.stopPropagation();first.inp.focus();if(note)note.hidden=true;return}
 if(window.DotMorph&&btn){clearTimeout(tm);DotMorph.set(btn,'loading')}
},true);
if(note&&btn&&window.MutationObserver){new MutationObserver(function(){
 if(!window.DotMorph)return;var ok=/^thank/i.test(note.textContent);DotMorph.set(btn,ok?'success':'idle');
 if(ok){clearTimeout(tm);tm=setTimeout(function(){DotMorph.set(btn,'idle')},3000)}
}).observe(note,{childList:true,characterData:true,subtree:true})}
})();

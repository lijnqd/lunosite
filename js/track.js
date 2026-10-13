/* Analytics events -> dataLayer (GTM sends them to GA4 after cookie consent) */
(function(){
var dl=window.dataLayer=window.dataLayer||[];
function push(name,p){var o={event:name};for(var k in p)o[k]=p[k];dl.push(o)}
function where(el){
  if(el.closest('header'))return'header';
  if(el.closest('.hero'))return'hero';
  if(el.closest('.footer'))return'footer';
  var s=el.closest('section[id]');return s?s.id:'page'
}
function txt(el){return(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase().slice(0,60)}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a');if(!a)return;
  var href=a.getAttribute('href')||'';
  if(a.classList.contains('folder')){push('case_click',{label:txt(a.querySelector('b')||a),link_url:href,location:where(a)});return}
  if(a.classList.contains('btn')){push('cta_click',{label:txt(a),link_url:href,location:where(a)});return}
  if(/^mailto:/.test(href)){push('contact_click',{label:'email',link_url:href,location:where(a)});return}
  var m=href.match(/(t\.me|instagram\.com|behance\.net)/);
  if(m){push('contact_click',{label:m[1]==='t.me'?'telegram':m[1].split('.')[0],link_url:href,location:where(a)})}
},true);
// FAQ: once per card per page view
var seen={};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.fq button');if(b)faq(b)},true);
document.addEventListener('mouseover',function(e){var b=e.target.closest&&e.target.closest('.fq');if(b)faq(b.querySelector('button'))},true);
function faq(b){var q=txt(b.querySelector('.q'));if(!q||seen[q])return;seen[q]=1;push('faq_open',{label:q,location:'faq'})}
// form: start on first focus, submit when the thank-you note appears
var form=document.getElementById('form');
if(form){
  var started=0;form.addEventListener('focusin',function(){if(!started){started=1;push('form_start',{location:'contacts'})}});
  var note=document.getElementById('formNote');
  if(note&&window.MutationObserver)new MutationObserver(function(){var t=(note.textContent||'').toLowerCase();if(/^thank you/.test(t)&&!note._sent){note._sent=1;push('form_submit',{location:'contacts'})}if(!/^thank you/.test(t))note._sent=0}).observe(note,{childList:true,characterData:true,subtree:true,attributes:true});
}
})();

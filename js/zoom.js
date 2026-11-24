/* article pictures open full screen on click; click, Esc or scroll closes */
(function(){var fs=document.querySelectorAll('.p-fig img');if(!fs.length)return;var ov=null;
function close(){if(!ov)return;ov.classList.remove('on');var o=ov;ov=null;setTimeout(function(){o.remove()},250);removeEventListener('keydown',key)}
function key(e){if(e.key==='Escape')close()}
[].forEach.call(fs,function(im){im.style.cursor='zoom-in';im.addEventListener('click',function(){ov=document.createElement('div');ov.className='zoom';
 var c=im.cloneNode();c.removeAttribute('loading');ov.appendChild(c);ov.addEventListener('click',close);document.body.appendChild(ov);requestAnimationFrame(function(){ov&&ov.classList.add('on')});addEventListener('keydown',key)})});
addEventListener('scroll',close,{passive:true})})();

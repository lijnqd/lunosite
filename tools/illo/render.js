/* exports every illustration in illo.html to assets/img/blog/<id>.webp (1800x1125)
   usage: (site served on :8127) node tools/illo/render.js */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execSync}=require('child_process');
(async()=>{const out=path.join(__dirname,'../../assets/img/blog');fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:750},deviceScaleFactor:1.5});
 await p.goto('http://localhost:8127/tools/illo/illo.html');await p.waitForFunction(()=>window.READY);await p.waitForTimeout(300);
 for(const id of await p.evaluate(()=>window.READY)){const png=path.join(out,id+'.png');await p.locator('#'+id).screenshot({path:png});
  execSync(`python3 -c "from PIL import Image;Image.open('${png}').save('${png.replace('.png','.webp')}',quality=86,method=6)"`);fs.unlinkSync(png);console.log(id)}
 await b.close()})();

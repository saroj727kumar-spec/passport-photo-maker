document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-bg]').forEach(b=>b.onclick=()=>{window.PPM.bgColor=b.dataset.bg; const cp=document.getElementById('bgColorPicker'); if(cp)cp.value=b.dataset.bg; if(window.drawEditor)drawEditor(); toast('Background: '+b.dataset.bg)});
 const cp=document.getElementById('bgColorPicker'); if(cp)cp.oninput=e=>{window.PPM.bgColor=e.target.value; if(window.drawEditor)drawEditor()};
 const tol=document.getElementById('keyTolerance');
 const keyBtn=document.getElementById('colorKeyBtn'); if(keyBtn)keyBtn.onclick=()=>{
   // Honest manual color-key: sample top-left corner colour of source image and make similar pixels transparent, then composite over chosen bg.
   if(!window.PPM.currentFile && !ed.img){toast('Load a photo in the editor first');return}
   const src=ed.img; if(!src)return toast('Load a photo first');
   const c=document.createElement('canvas'); c.width=src.naturalWidth; c.height=src.naturalHeight; const ctx=c.getContext('2d'); ctx.drawImage(src,0,0);
   const data=ctx.getImageData(0,0,c.width,c.height); const d=data.data; const br=d[0],bg=d[1],bb=d[2]; const t=(tol?+tol.value:30)*3;
   for(let i=0;i<d.length;i+=4){const dist=Math.abs(d[i]-br)+Math.abs(d[i+1]-bg)+Math.abs(d[i+2]-bb); if(dist<t)d[i+3]=0}
   ctx.putImageData(data,0,0);
   const out=document.createElement('canvas'); out.width=c.width; out.height=c.height; const octx=out.getContext('2d'); octx.fillStyle=window.PPM.bgColor||'#fff'; octx.fillRect(0,0,out.width,out.height); octx.drawImage(c,0,0);
   const prev=document.getElementById('bgPreview'); if(prev){prev.innerHTML='';const im=document.createElement('img');im.src=out.toDataURL('image/png');prev.appendChild(im)}
   window._bgCanvas=out; toast('Manual color-key applied — preview shown. Download from Export section.');
 };
});

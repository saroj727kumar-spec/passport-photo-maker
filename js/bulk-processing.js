document.addEventListener('DOMContentLoaded',()=>{
 const input=document.getElementById('bulkFiles'); const list=document.getElementById('bulkList');
 if(input)input.onchange=()=>{window.PPM.files=[...input.files]; if(list)list.innerHTML=window.PPM.files.map(f=>`<p>⏳ ${f.name} — ready</p>`).join('')};
 const btn=document.getElementById('bulkZipBtn'); if(btn)btn.onclick=async()=>{
  const files=window.PPM.files||[]; if(!files.length)return toast('Upload multiple photos first');
  const zip=new JSZip(); const p=window.PPM.selectedPreset; const px=p?presetPx(p):{w:600,h:750};
  for(let idx=0;idx<files.length;idx++){ if(list)list.children[idx].textContent=`⏳ ${files[idx].name} — processing…`;
   const blob=await new Promise(res=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=px.w;c.height=px.h;const ctx=c.getContext('2d');ctx.fillStyle=window.PPM.bgColor||'#fff';ctx.fillRect(0,0,px.w,px.h);const s=Math.max(px.w/img.naturalWidth,px.h/img.naturalHeight);ctx.drawImage(img, (px.w-img.naturalWidth*s)/2,(px.h-img.naturalHeight*s)/2,img.naturalWidth*s,img.naturalHeight*s);c.toBlob(res,'image/jpeg',0.92)};img.src=URL.createObjectURL(files[idx])});
   zip.file(`photo-${idx+1}.jpg`,blob); if(list)list.children[idx].textContent=`✅ ${files[idx].name} — done`;
  }
  const content=await zip.generateAsync({type:'blob'}); downloadBlob(content,'passport-photos.zip'); toast('ZIP downloaded');
 };
});

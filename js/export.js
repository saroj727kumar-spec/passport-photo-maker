function exportCanvas(){ if(window._bgCanvas) return window._bgCanvas; if(typeof getEditedCanvasWithoutGuides==='function') return getEditedCanvasWithoutGuides(); return document.getElementById('editorCanvas')}
document.addEventListener('DOMContentLoaded',()=>{
 const btn=document.getElementById('exportBtn'); if(btn)btn.onclick=()=>{
  const fmt=document.getElementById('exportFormat').value; const q=(+document.getElementById('exportQuality').value||90)/100;
  const cw=+document.getElementById('exportW').value||0, ch=+document.getElementById('exportH').value||0;
  let src=exportCanvas(); if(!src)return toast('No photo to export');
  let c=src; if(cw&&ch){c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(src,0,0,cw,ch)}
  if(fmt==='pdf'){const {jsPDF}=window.jspdf; const pdf=new jsPDF(); pdf.addImage(c.toDataURL('image/jpeg',q),'JPEG',10,10,80,100); pdf.save('passport-photo.pdf'); return}
  c.toBlob(b=>downloadBlob(b,'passport-photo.'+fmt.split('/')[1]),fmt,q);
 };
 const bgDl=document.getElementById('bgDownload'); if(bgDl)bgDl.onclick=()=>{if(window._bgCanvas)window._bgCanvas.toBlob(b=>downloadBlob(b,'background-changed.png'),'image/png'); else toast('Apply color-key first or use Export')};
});

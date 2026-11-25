function buildSheet(){
 const qty=+document.getElementById('sheetQty').value||8; const paper=document.getElementById('paperSize').value; const orient=document.getElementById('paperOrient').value;
 let pw=794,ph=1123; if(paper==='4x6'){pw=600;ph=400} if(paper==='custom'){pw=+document.getElementById('customPaperW').value||794;ph=+document.getElementById('customPaperH').value||1123}
 if(orient==='landscape'){[pw,ph]=[ph,pw]}
 const margin=+document.getElementById('sheetMargin').value||20, spacing=+document.getElementById('sheetSpacing').value||10, border=document.getElementById('sheetBorder').checked;
 const src=(typeof exportCanvas==='function')?exportCanvas():document.getElementById('editorCanvas'); if(!src){toast('Load a photo first');return null}
 const c=document.createElement('canvas');c.width=pw;c.height=ph;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,pw,ph);
 const cols=Math.ceil(Math.sqrt(qty*pw/ph)); const rows=Math.ceil(qty/cols); const cw=(pw-margin*2-spacing*(cols-1))/cols, ch=(ph-margin*2-spacing*(rows-1))/rows;
 let n=0; for(let r=0;r<rows&&n<qty;r++)for(let col=0;col<cols&&n<qty;col++){const x=margin+col*(cw+spacing),y=margin+r*(ch+spacing);ctx.drawImage(src,x,y,cw,ch);if(border){ctx.strokeStyle='#333';ctx.strokeRect(x,y,cw,ch)}n++}
 return c;
}
document.addEventListener('DOMContentLoaded',()=>{
 const prev=document.getElementById('sheetPreviewBtn'); if(prev)prev.onclick=()=>{const c=buildSheet();if(!c)return;const el=document.getElementById('sheetPreview');el.innerHTML='';const i=document.createElement('img');i.src=c.toDataURL('image/jpeg',0.9);el.appendChild(i);window._sheet=c};
 const jpg=document.getElementById('sheetJpg'); if(jpg)jpg.onclick=()=>{const c=window._sheet||buildSheet();if(c)c.toBlob(b=>downloadBlob(b,'print-sheet.jpg'),'image/jpeg',0.92)};
 const pdf=document.getElementById('sheetPdf'); if(pdf)pdf.onclick=()=>{const c=window._sheet||buildSheet();if(!c)return;const {jsPDF}=window.jspdf;const orient=c.width>c.height?'landscape':'portrait';const doc=new jsPDF({orientation:orient,unit:'mm',format:'a4'});doc.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,orient==='landscape'?297:210,orient==='landscape'?210:297);doc.save('print-sheet.pdf')};
});

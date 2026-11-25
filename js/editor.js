let ed={img:null,scale:1,rot:0,flipH:1,flipV:1,x:0,y:0,bright:100,cont:100,sat:100,history:[],future:[],drag:false,sx:0,sy:0,showGuides:true,showOriginal:false};
function editorCanvas(){return document.getElementById('editorCanvas')}
function pushHistory(){try{ed.history.push(editorCanvas().toDataURL());if(ed.history.length>30)ed.history.shift();ed.future=[]}catch(e){}}
function drawEditor(){
 const c=editorCanvas(); if(!c||!ed.img)return; const ctx=c.getContext('2d');
 const p=window.PPM.selectedPreset; let W=600,H=750; if(p){const px=presetPx(p); const r=px.w/px.h; if(r>=1){W=640;H=Math.round(640/r)}else{H=750;W=Math.round(750*r)}}
 c.width=W;c.height=H; ctx.fillStyle=window.PPM.bgColor||'#fff'; ctx.fillRect(0,0,W,H);
 ctx.save(); ctx.translate(W/2+ed.x,H/2+ed.y); ctx.rotate(ed.rot*Math.PI/180); ctx.scale(ed.flipH*ed.scale,ed.flipV*ed.scale);
 ctx.filter=ed.showOriginal?'none':`brightness(${ed.bright}%) contrast(${ed.cont}%) saturate(${ed.sat}%)`;
 const iw=ed.img.naturalWidth,ih=ed.img.naturalHeight; const s=Math.max(W/iw,H/ih); ctx.drawImage(ed.img,-iw*s/2,-ih*s/2,iw*s,ih*s); ctx.restore(); ctx.filter='none';
 if(ed.showGuides){ctx.strokeStyle='rgba(37,99,235,.8)';ctx.setLineDash([8,6]);ctx.beginPath();ctx.ellipse(W/2,H*0.42,W*0.22,H*0.28,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='rgba(124,58,237,.7)';ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.moveTo(0,H*0.38);ctx.lineTo(W,H*0.38);ctx.moveTo(0,H*0.08);ctx.lineTo(W,H*0.08);ctx.moveTo(0,H*0.78);ctx.lineTo(W,H*0.78);ctx.stroke();}
 window._lastCanvas=c;
}
function loadIntoEditor(file){if(!file)return; const img=new Image(); img.onload=()=>{ed.img=img;ed.scale=1;ed.x=0;ed.y=0;ed.rot=0;drawEditor();pushHistory();toast('Photo loaded in editor')}; img.src=URL.createObjectURL(file)}
function applyPreset(p){drawEditor()}
document.addEventListener('DOMContentLoaded',()=>{
 const input=document.getElementById('editorFile'); const drop=document.getElementById('dropZone');
 if(drop){drop.onclick=()=>input&&input.click(); drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')}; drop.ondragleave=()=>drop.classList.remove('drag'); drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');const f=e.dataTransfer.files[0]; validateAndLoad(f)}}
 if(input)input.onchange=e=>validateAndLoad(e.target.files[0]);
 function validateAndLoad(f){if(!f)return; if(!['image/jpeg','image/png'].includes(f.type)&&!/\.(jpe?g|png)$/i.test(f.name))return toast('Only JPG, JPEG or PNG allowed'); if(f.size>15*1024*1024)return toast('File too large (max 15 MB)'); loadIntoEditor(f); window.PPM.currentFile=f; const prev=document.getElementById('thumbPreview'); if(prev){prev.innerHTML='';const i=document.createElement('img');i.src=URL.createObjectURL(f);prev.appendChild(i)}}
 const c=editorCanvas(); if(c){c.addEventListener('pointerdown',e=>{ed.drag=true;ed.sx=e.offsetX-ed.x;ed.sy=e.offsetY-ed.y}); c.addEventListener('pointermove',e=>{if(ed.drag){ed.x=e.offsetX-ed.sx;ed.y=e.offsetY-ed.sy;drawEditor()}}); c.addEventListener('pointerup',()=>ed.drag=false); c.addEventListener('wheel',e=>{e.preventDefault();ed.scale=Math.max(.2,Math.min(4,ed.scale+(e.deltaY<0?.08:-.08)));drawEditor()},{passive:false})}
 const bind=(id,fn)=>{const el=document.getElementById(id);if(el)el.onclick=()=>{pushHistory();fn();drawEditor()}};
 bind('zoomIn',()=>ed.scale=Math.min(4,ed.scale+.15)); bind('zoomOut',()=>ed.scale=Math.max(.2,ed.scale-.15));
 bind('rotL',()=>ed.rot-=90); bind('rotR',()=>ed.rot+=90); bind('flipH',()=>ed.flipH*=-1); bind('flipV',()=>ed.flipV*=-1);
 bind('resetBtn',()=>{ed={...ed,scale:1,rot:0,flipH:1,flipV:1,x:0,y:0,bright:100,cont:100,sat:100}});
 ['bright','cont','sat'].forEach(k=>{const el=document.getElementById(k);if(el)el.oninput=e=>{ed[k]=+e.target.value;drawEditor()}});
 const guides=document.getElementById('guideToggle'); if(guides)guides.onchange=e=>{ed.showGuides=e.target.checked;drawEditor()};
 const orig=document.getElementById('origToggle'); if(orig){orig.onmousedown=()=>{ed.showOriginal=true;drawEditor()};orig.onmouseup=()=>{ed.showOriginal=false;drawEditor()}}
 const undo=document.getElementById('undoBtn'); if(undo)undo.onclick=()=>{if(!ed.history.length)return;ed.future.push(editorCanvas().toDataURL());restore(ed.history.pop())};
 const redo=document.getElementById('redoBtn'); if(redo)redo.onclick=()=>{if(!ed.future.length)return;ed.history.push(editorCanvas().toDataURL());restore(ed.future.pop())};
 function restore(url){const i=new Image();i.onload=()=>{const ctx=editorCanvas().getContext('2d');ctx.clearRect(0,0,editorCanvas().width,editorCanvas().height);ctx.drawImage(i,0,0)};i.src=url}
 const remove=document.getElementById('removePhoto'); if(remove)remove.onclick=()=>{ed.img=null;const ctx=editorCanvas().getContext('2d');ctx.clearRect(0,0,editorCanvas().width,editorCanvas().height);toast('Photo removed')};
 const aspect=document.getElementById('aspectSelect'); if(aspect)aspect.onchange=e=>{const v=e.target.value; if(v==='free')return; const [w,h]=v.split(':').map(Number); const p={name:'Aspect '+v,w,h,unit:'mm',dpi:300}; window.PPM.selectedPreset=p; drawEditor()};
});
function getEditedCanvasWithoutGuides(){const old=ed.showGuides;ed.showGuides=false;drawEditor();const c=editorCanvas();const copy=document.createElement('canvas');copy.width=c.width;copy.height=c.height;copy.getContext('2d').drawImage(c,0,0);ed.showGuides=old;drawEditor();return copy}

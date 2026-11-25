const PRESETS=[
{id:'in-passport',name:'India Passport Photo',w:51,h:51,unit:'mm',dpi:300},
{id:'us-passport',name:'US Passport Photo',w:51,h:51,unit:'mm',dpi:300},
{id:'uk-passport',name:'UK Passport Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'ca-passport',name:'Canada Passport Photo',w:50,h:70,unit:'mm',dpi:300},
{id:'au-passport',name:'Australia Passport Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'schengen',name:'Schengen Visa Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'oci',name:'OCI Photo',w:51,h:51,unit:'mm',dpi:300},
{id:'pan',name:'PAN Card Photo',w:25,h:35,unit:'mm',dpi:200},
{id:'dl',name:'Driving Licence Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'student',name:'Student ID Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'employee',name:'Employee ID Photo',w:35,h:45,unit:'mm',dpi:300},
{id:'in-2x2',name:'India 2x2 inch',w:2,h:2,unit:'inch',dpi:300},
];
function presetPx(p){const f=p.unit==='inch'?p.dpi:p.dpi/25.4;return{w:Math.round(p.w*f),h:Math.round(p.h*f)}}
function getCustomPresets(){try{return JSON.parse(localStorage.getItem('ppm_custom_presets')||'[]')}catch(e){return[]}}
function allPresets(){return PRESETS.concat(getCustomPresets())}
function renderPresets(filter=''){
 const el=document.getElementById('presetGrid'); if(!el)return;
 el.innerHTML='';
 allPresets().filter(p=>p.name.toLowerCase().includes(filter.toLowerCase())).forEach(p=>{
  const px=presetPx(p); const d=document.createElement('div'); d.className='card preset'; d.tabIndex=0;
  d.innerHTML=`<h3>${p.name}</h3><p>${p.w} × ${p.h} ${p.unit}<br>${px.w} × ${px.h} px @ ${p.dpi} DPI<br>Aspect ${(p.w/p.h).toFixed(2)}:1</p><button class="btn small">Use This Size</button>`;
  d.onclick=()=>{window.PPM.selectedPreset=p; document.querySelectorAll('.preset').forEach(x=>x.classList.remove('active')); d.classList.add('active'); if(window.applyPreset)applyPreset(p); toast('Selected: '+p.name)};
  el.appendChild(d);
 });
}
document.addEventListener('DOMContentLoaded',()=>{
 renderPresets();
 const s=document.getElementById('presetSearch'); if(s)s.addEventListener('input',e=>renderPresets(e.target.value));
 const f=document.getElementById('customPresetForm'); if(f)f.addEventListener('submit',e=>{e.preventDefault();
  const p={id:'custom-'+Date.now(),name:document.getElementById('cpName').value||'Custom Preset',w:+document.getElementById('cpW').value||35,h:+document.getElementById('cpH').value||45,unit:document.getElementById('cpUnit').value,dpi:+document.getElementById('cpDpi').value||300};
  const arr=getCustomPresets(); arr.push(p); localStorage.setItem('ppm_custom_presets',JSON.stringify(arr)); renderPresets(); toast('Custom preset saved');});
});

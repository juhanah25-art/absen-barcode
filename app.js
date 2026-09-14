
const GAS_URL = "https://script.google.com/macros/s/AKfycbwBMa-FK8ZM57wkyR1MXEHnxXoSEk1qFOiU4Zi-fMWSKIXYGByEJWzkxBXBMEbV3yY6yA/exec";

const DB={
  teachersKey:"scb2_teachers",
  attendanceKey:"scb2_attendance",
  get teachers(){return JSON.parse(localStorage.getItem(this.teachersKey)||"[]")},
  set teachers(v){localStorage.setItem(this.teachersKey,JSON.stringify(v))},
  get attendance(){return JSON.parse(localStorage.getItem(this.attendanceKey)||"[]")},
  set attendance(v){localStorage.setItem(this.attendanceKey,JSON.stringify(v))}
};
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function nowTime(){return new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function teacherById(id){return DB.teachers.find(t=>t.id===id)}
function attendanceToday(){return DB.attendance.filter(a=>a.tanggal===today())}
function setClock(){document.querySelectorAll("[data-clock]").forEach(e=>e.textContent=nowTime());document.querySelectorAll("[data-date]").forEach(e=>e.textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))}
setClock();setInterval(setClock,1000);

async function postToGoogle(payload){
  if(!GAS_URL || GAS_URL === "https://script.google.com/macros/s/AKfycbzhjORWsxJ8l_Dy2cCLPcFoW960Kd-FeC89g4GzwrkhFG1AZB5jmmdr5OixZ-rWbYCmrA/exec") return null;
  try{
    const res=await fetch(GAS_URL,{
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
    return await res.json();
  }catch(err){
    console.warn("Sinkronisasi Google Sheets gagal:",err);
    return null;
  }
}

async function loadTeachersFromGoogle(){
  if(!GAS_URL || GAS_URL === "https://script.google.com/macros/s/AKfycbzhjORWsxJ8l_Dy2cCLPcFoW960Kd-FeC89g4GzwrkhFG1AZB5jmmdr5OixZ-rWbYCmrA/exec") return;
  try{
    const res=await fetch(GAS_URL,{
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({action:"getGuru"})
    });
    const data=await res.json();
    if(data && data.success && Array.isArray(data.data)){
      DB.teachers = data.data.map(x=>({id:String(x.id),nama:String(x.nama),jabatan:String(x.jabatan||""),status:String(x.status||"Aktif")}));
      window.dispatchEvent(new Event("teachersUpdated"));
    }
  }catch(err){console.warn("Gagal memuat Data Guru dari Google Sheets:",err);}
}
document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.querySelector(".menu-btn"),side=document.querySelector(".sidebar");
  if(menu&&side)menu.onclick=()=>side.classList.toggle("open");
  const active=document.body.dataset.page;
  document.querySelectorAll(".nav a").forEach(a=>a.classList.toggle("active",a.dataset.page===active));
  loadTeachersFromGoogle();
});
function downloadCSV(filename,rows){
  const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");
  a.href=u;a.download=filename;a.click();URL.revokeObjectURL(u);
}


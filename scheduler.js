"use strict";

const KEY = "iqranix-scheduler-v2";
let reminders = JSON.parse(localStorage.getItem(KEY) || "[]");

const $ = id => document.getElementById(id);
const nameInput=$("nameInput"), timeInput=$("timeInput"), typeInput=$("typeInput");
const saveButton=$("saveButton"), reminderList=$("reminderList");
const permissionButton=$("permissionButton"), permissionStatus=$("permissionStatus");
const testButton=$("testButton"), schedulerStatus=$("schedulerStatus"), nextStatus=$("nextStatus");

function save(){ localStorage.setItem(KEY, JSON.stringify(reminders)); }

function notificationSupported(){
  return "Notification" in window;
}

async function enableNotifications(){
  if(!notificationSupported()){
    permissionStatus.textContent="Notifications are not supported by this browser.";
    return false;
  }
  const result=await Notification.requestPermission();
  updatePermission();
  return result==="granted";
}

function updatePermission(){
  if(!notificationSupported()){
    permissionStatus.textContent="Notifications are not supported.";
    permissionButton.disabled=true;
    return;
  }
  const p=Notification.permission;
  permissionStatus.textContent = p==="granted" ? "✓ Notifications are enabled." :
    p==="denied" ? "Notifications are blocked. Enable them in browser site settings." :
    "Notifications have not been enabled yet.";
  permissionButton.textContent = p==="granted" ? "Enabled" : "Enable";
}

async function showNotification(title, body){
  if(!notificationSupported()){
    alert(title+"\n\n"+body);
    return;
  }
  if(Notification.permission!=="granted"){
    const ok=await enableNotifications();
    if(!ok) return;
  }

  // Visible-page notification. The native Android version will use
  // Android AlarmManager/WorkManager later so it can fire when closed.
  new Notification(title,{body,icon:"icon-192x192.png",tag:"iqranix-scheduler"});
}

function selectedDays(){
  return [...document.querySelectorAll(".days input:checked")].map(x=>Number(x.value));
}

function addReminder(){
  const name=nameInput.value.trim();
  const time=timeInput.value;
  if(!name || !time){ alert("Enter a reminder name and time."); return; }

  const days=selectedDays();
  if(!days.length){ alert("Select at least one day."); return; }

  reminders.push({
    id: Date.now(),
    name,time,type:typeInput.value,days,enabled:true
  });
  save(); render(); clearForm();
}

function clearForm(){
  nameInput.value="";
  timeInput.value="";
  document.querySelectorAll(".days input").forEach(x=>x.checked=false);
}

function render(){
  reminderList.innerHTML="";
  if(!reminders.length){
    reminderList.innerHTML='<p class="empty">No reminders yet.</p>';
    return;
  }

  reminders.forEach(r=>{
    const el=document.createElement("div");
    el.className="reminder";
    const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    el.innerHTML=`
      <strong>${escapeHtml(r.name)}</strong>
      <small>${r.time} • ${r.type} • ${r.days.map(d=>dayNames[d]).join(", ")}</small>
      <div class="reminder-actions">
        <button class="toggle">${r.enabled?"Disable":"Enable"}</button>
        <button class="delete">Delete</button>
      </div>`;
    el.querySelector(".toggle").onclick=()=>{
      r.enabled=!r.enabled; save(); render();
    };
    el.querySelector(".delete").onclick=()=>{
      reminders=reminders.filter(x=>x.id!==r.id); save(); render();
    };
    reminderList.appendChild(el);
  });
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function sameMinute(a,b){
  return a.getHours()===b.getHours() && a.getMinutes()===b.getMinutes();
}

const fired = new Set();

function checkSchedules(){
  const now=new Date();
  const day=now.getDay();

  reminders.forEach(r=>{
    if(!r.enabled || !r.days.includes(day)) return;
    if(!sameMinute(now, parseTime(r.time))) return;

    const key=r.id+"-"+now.toDateString()+"-"+r.time;
    if(fired.has(key)) return;
    fired.add(key);

    showNotification("Iqranix Reminder", r.name+" • "+r.time);
    schedulerStatus.textContent="✓ Fired: "+r.name+" at "+r.time;
  });

  updateNext(now);
}

function parseTime(t){
  const [h,m]=t.split(":").map(Number);
  const d=new Date();
  d.setHours(h,m,0,0);
  return d;
}

function updateNext(now){
  let best=null;
  reminders.filter(r=>r.enabled).forEach(r=>{
    for(let add=0;add<8;add++){
      const d=new Date(now);
      d.setDate(now.getDate()+add);
      d.setHours(...r.time.split(":").map(Number),0,0);
      if(!r.days.includes(d.getDay())) continue;
      if(d<=now) continue;
      if(!best || d<best.date) best={date:d,name:r.name};
      break;
    }
  });
  nextStatus.textContent=best ? "Next: "+best.name+" • "+best.date.toLocaleString() : "Next: none";
}

permissionButton.onclick=enableNotifications;
testButton.onclick=()=>showNotification("Iqranix Test","Your notification system is working.");
saveButton.onclick=addReminder;
$("clearButton").onclick=()=>{
  if(confirm("Delete all reminders?")){ reminders=[]; save(); render(); }
};
$("backButton").onclick=()=>history.length>1?history.back():location.href="index.html";

updatePermission();
render();
schedulerStatus.textContent="✓ Scheduler is running while this page is open.";
checkSchedules();
setInterval(checkSchedules,1000);

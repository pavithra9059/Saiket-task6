<script>
  AOS.init({ duration: 800, once: false, mirror: true });
  // particles generation
  for(let i=0;i<60;i++) {
    let p = document.createElement('div');
    p.classList.add('particle');
    let size = Math.random()*8+2;
    p.style.width = size+'px'; p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.top = Math.random()*100+'%';
    p.style.animationDuration = Math.random()*15+8+'s';
    p.style.animationDelay = Math.random()*5+'s';
    document.body.appendChild(p);
  }

  // Custom cursor
  document.addEventListener('mousemove', (e) => {
    document.querySelector('.custom-cursor').style.transform = `translate(${e.clientX-6}px, ${e.clientY-6}px)`;
  });

  // Typing effect
  const words = ["Neural Interface", "AI Holograms", "Real-time Analytics", "Cyber Fusion"];
  let idx = 0, charIdx=0, isDeleting=false;
  function typeEffect() {
    let current = words[idx];
    let typed = document.getElementById('typingText');
    if(isDeleting) typed.innerText = current.substring(0, charIdx--);
    else typed.innerText = current.substring(0, charIdx++);
    if(!isDeleting && charIdx===current.length) isDeleting=true;
    else if(isDeleting && charIdx===0) { isDeleting=false; idx=(idx+1)%words.length; }
    setTimeout(typeEffect, 150);
  }
  typeEffect();

  // Dashboard live clock & date
  function updateClock() {
    let now = new Date();
    document.getElementById('liveClock').innerText = now.toLocaleTimeString();
    document.getElementById('liveDate').innerText = now.toDateString();
  }
  setInterval(updateClock,1000); updateClock();

  // Progress ring canvas
  let canvas = document.getElementById('progressCanvas');
  let ctx = canvas.getContext('2d');
  function drawProgress(percent) {
    ctx.clearRect(0,0,80,80);
    ctx.beginPath(); ctx.arc(40,40,30,0,2*Math.PI); ctx.strokeStyle = '#333'; ctx.lineWidth=6; ctx.stroke();
    ctx.beginPath(); let angle = (percent/100)*2*Math.PI - Math.PI/2;
    ctx.arc(40,40,30, -Math.PI/2, angle); ctx.strokeStyle = '#0ff'; ctx.stroke();
    document.getElementById('perfPercent').innerText = percent+'%';
  }
  let perf = 76; drawProgress(perf);

  // activity counter
  let actCount = localStorage.getItem('actCount')?parseInt(localStorage.getItem('actCount')):0;
  document.getElementById('activityCount').innerText = actCount;
  document.getElementById('triggerActivity').onclick = () => { actCount++; document.getElementById('activityCount').innerText = actCount; localStorage.setItem('actCount',actCount); showNotif("Activity recorded!"); };

  // Task manager module (drag and drop + local storage)
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  function renderTasks() {
    let container = document.getElementById('taskManagerContainer');
    if(container) container.innerHTML = tasks.map((t,i)=>`<div class="task-item ${t.completed?'completed':''}" draggable="true" data-idx="${i}"><input type="checkbox" ${t.completed?'checked':''} data-idx="${i}" class="taskCheck"><span>${t.text} [${t.priority}]</span><button class="editTask" data-idx="${i}">✏️</button><button class="delTask" data-idx="${i}">🗑️</button></div>`).join('');
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  function addTask(text, priority='Normal') { tasks.push({text, priority, completed:false}); renderTasks(); showNotif('Task added'); }
  // dashboard dynamic DOM: update counters
  let userCount = 1250, taskDone = tasks.filter(t=>t.completed).length;
  document.getElementById('userCounter').innerText = userCount;
  document.getElementById('taskCounter').innerText = taskDone;
  setInterval(()=>{ userCount+=Math.floor(Math.random()*3); document.getElementById('userCounter').innerText=userCount; }, 7000);

  // Form validation & live preview
  document.getElementById('userForm').addEventListener('input', (e)=>{
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    document.getElementById('livePreview').innerHTML = `<strong>Live Preview:</strong> Name: ${name||'—'} <br> Email: ${email||'—'} <br> Phone: ${document.getElementById('phone').value}`;
  });
  document.getElementById('userForm').addEventListener('submit',(e)=>{
    e.preventDefault(); if(!document.getElementById('name').value) showError('name'); else showNotif("Form submitted successfully! ✅");
  });

  function showError(fieldId){ document.getElementById(fieldId).classList.add('error'); setTimeout(()=>document.getElementById(fieldId).classList.remove('error'),1000); }
  function showNotif(msg){ let panel = document.getElementById('notificationPanel'); panel.innerHTML = `<i class="fas fa-bell"></i> ${msg}`; panel.classList.add('show'); setTimeout(()=>panel.classList.remove('show'),2500); }

  // Activity feed dynamic
  let activities = JSON.parse(localStorage.getItem('activities')) || ["System Online", "User Joined Dashboard"];
  function renderActivityFeed(){
    let feedDiv = document.getElementById('activityFeed'); if(feedDiv) feedDiv.innerHTML = activities.map(a=>`<div><i class="fas fa-circle" style="font-size:10px;color:#0ff"></i> ${a}</div>`).join('');
  }
  document.getElementById('addActivityBtn')?.addEventListener('click',()=>{ let newAct = `New interaction at ${new Date().toLocaleTimeString()}`; activities.unshift(newAct); if(activities.length>10) activities.pop(); localStorage.setItem('activities',JSON.stringify(activities)); renderActivityFeed(); showNotif("Activity added");});
  renderActivityFeed();

  // Profile avatar upload
  document.getElementById('avatarUpload')?.addEventListener('change',function(e){ let reader = new FileReader(); reader.onload = (ev)=>{ document.getElementById('avatarPreview').innerHTML = `<img src="${ev.target.result}" style="width:120px;height:120px;border-radius:50%;object-fit:cover">`; }; if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]); });

  // Contact form with success animation
  document.getElementById('contactForm')?.addEventListener('submit',(e)=>{ e.preventDefault(); showNotif("✨ Message transmitted to Nexus Core ✨"); e.target.reset(); });

  // Task manager section injection dynamically (additional)
  let taskSection = document.createElement('section'); taskSection.id = "taskManager"; taskSection.innerHTML = `<h2>📋 Task Manager <i class="fas fa-tasks"></i></h2><div class="glass-card" style="padding:20px"><input type="text" id="newTaskInput" placeholder="Write a task..."><select id="prioritySelect"><option>Low</option><option>Normal</option><option>High</option></select><button id="addTaskBtn" class="holographic-btn">Add Task</button><div id="taskManagerContainer" style="margin-top:20px"></div><input type="text" id="searchTask" placeholder="🔍 Search tasks"></div>`;
  document.getElementById('activity')?.insertAdjacentElement('afterend', taskSection);
  renderTasks();
  document.getElementById('addTaskBtn')?.addEventListener('click',()=>{ let inp=document.getElementById('newTaskInput'); if(inp.value){ addTask(inp.value, document.getElementById('prioritySelect').value); inp.value=''; } });
  document.addEventListener('click',(e)=>{ if(e.target.classList.contains('delTask')){ let idx=e.target.dataset.idx; tasks.splice(idx,1); renderTasks(); } if(e.target.classList.contains('taskCheck')){ let idx=e.target.dataset.idx; tasks[idx].completed=e.target.checked; renderTasks(); } if(e.target.classList.contains('editTask')){ let idx=e.target.dataset.idx; let newText=prompt("Edit task", tasks[idx].text); if(newText) tasks[idx].text=newText; renderTasks(); } });
  document.getElementById('searchTask')?.addEventListener('input',(e)=>{ let val=e.target.value.toLowerCase(); let filtered=tasks.filter(t=>t.text.toLowerCase().includes(val)); document.getElementById('taskManagerContainer').innerHTML = filtered.map((t,i)=>`<div class="task-item ${t.completed?'completed':''}"><input type="checkbox" ${t.completed?'checked':''} disabled><span>${t.text}</span></div>`).join(''); });

  // Navigation highlight + smooth scroll
  let sections = document.querySelectorAll('section');
  window.addEventListener('scroll',()=>{ let current = ''; sections.forEach(sec=>{ let top=sec.offsetTop-150; if(pageYOffset>=top) current=sec.getAttribute('id'); }); document.querySelectorAll('.nav-link').forEach(link=>{ link.classList.remove('active'); if(link.getAttribute('href')===`#${current}`) link.classList.add('active'); }); });
  document.querySelectorAll('.nav-link').forEach(link=>{ link.addEventListener('click',(e)=>{ e.preventDefault(); let target=document.querySelector(link.getAttribute('href')); target.scrollIntoView({behavior:'smooth'}); if(document.getElementById('navLinks').classList.contains('active')) document.getElementById('navLinks').classList.remove('active'); }); });
  document.getElementById('hamburger').onclick = ()=> document.getElementById('navLinks').classList.toggle('active');
  document.getElementById('exploreBtn').onclick = ()=>document.getElementById('dashboard').scrollIntoView({behavior:'smooth'});
  document.getElementById('backToTop').onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});

  // Additional interactivity: dynamic analytics graph update
  setInterval(()=>{ let rand=Math.floor(Math.random()*100); document.getElementById('dynamicChart').innerHTML = `📊 Live Engagement: ${rand}% <progress value="${rand}" max="100"></progress>`; }, 4000);
  // Real-time counters for tasks completed
  setInterval(()=>{ let completed = tasks.filter(t=>t.completed).length; document.getElementById('taskCounter').innerText = completed; }, 1000);
  // password strength
  document.getElementById('password')?.addEventListener('input',function(){ let val=this.value.length; let meter=document.getElementById('passwordStrength'); if(val<4) meter.value=1; else if(val<8) meter.value=2; else if(val<12) meter.value=3; else meter.value=4; });
  showNotif("Welcome to Nexus AI OS | Real-time experience ready");
  // char counter
  document.getElementById('feedback')?.addEventListener('input',function(){ document.getElementById('charCounter').innerText = this.value.length+"/200"; });
</script>

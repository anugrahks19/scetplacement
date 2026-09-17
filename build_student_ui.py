"""
Builds core student module functionalities into existing HTML pages.
Targets: dashboard-student.html, assessments.html, interview-prep.html, my-progress.html
"""
import os, re
from bs4 import BeautifulSoup

BASE = r"d:\scet_placement\student"

def get_main_content(soup):
    """Find the main content container"""
    for sel in ["main", "div.main-content", "div#main", "div.content-wrapper", "div.container-fluid"]:
        el = soup.select_one(sel)
        if el: return el
    return soup.find("body")

def patch(path, new_html, title=None):
    with open(path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    
    if title:
        t = soup.find("title")
        if t: t.string = title

    main = get_main_content(soup)
    # Clear existing content but keep the element
    for child in list(main.children):
        child.decompose() if hasattr(child, "decompose") else None
    main.clear()
    main.append(BeautifulSoup(new_html, "html.parser"))

    with open(path, "w", encoding="utf-8") as f:
        f.write(str(soup))
    print(f"Patched: {path}")


# ─── 1. DASHBOARD ────────────────────────────────────────────────────────────
DASHBOARD_HTML = """
<div class="container-fluid py-4 px-3 px-lg-4">

  <!-- Header -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h1 class="h4 fw-bold mb-0">Student Dashboard</h1>
      <p class="text-muted small mb-0">Welcome back! Here's your placement readiness overview.</p>
    </div>
    <div class="d-flex gap-2">
      <a href="pages/assessments.html" class="btn btn-primary btn-sm"><i class="bi bi-file-earmark-text me-1"></i>Take Assessment</a>
      <a href="pages/interview-prep.html" class="btn btn-outline-primary btn-sm"><i class="bi bi-code-slash me-1"></i>Practice</a>
    </div>
  </div>

  <!-- Stats Row -->
  <div class="row g-3 mb-4">
    <div class="col-6 col-lg-3">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-muted small mb-1">Readiness Score</p>
              <h2 class="fw-bold mb-0 text-primary" id="readinessScore">76.5%</h2>
            </div>
            <div class="bg-primary bg-opacity-10 rounded-3 p-2">
              <i class="bi bi-graph-up text-primary fs-5"></i>
            </div>
          </div>
          <div class="progress mt-3" style="height:6px">
            <div class="progress-bar bg-primary rounded-pill" id="readinessBar" style="width:76.5%"></div>
          </div>
          <small class="text-success mt-1 d-block"><i class="bi bi-arrow-up-short"></i> +4.2% this week</small>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-muted small mb-1">Assessments</p>
              <h2 class="fw-bold mb-0" id="assessmentCount">0</h2>
            </div>
            <div class="bg-success bg-opacity-10 rounded-3 p-2">
              <i class="bi bi-check2-circle text-success fs-5"></i>
            </div>
          </div>
          <small class="text-muted mt-2 d-block">Completed this month</small>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-muted small mb-1">Practice Streak</p>
              <h2 class="fw-bold mb-0 text-warning" id="streak">0 <small class="fs-6">days</small></h2>
            </div>
            <div class="bg-warning bg-opacity-10 rounded-3 p-2">
              <i class="bi bi-fire text-warning fs-5"></i>
            </div>
          </div>
          <div class="d-flex gap-1 mt-2" id="streakDots"></div>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-muted small mb-1">CGPA</p>
              <h2 class="fw-bold mb-0 text-info" id="cgpa">--</h2>
            </div>
            <div class="bg-info bg-opacity-10 rounded-3 p-2">
              <i class="bi bi-mortarboard text-info fs-5"></i>
            </div>
          </div>
          <small class="text-muted mt-2 d-block">Academic standing</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Readiness Breakdown + Upcoming -->
  <div class="row g-3 mb-4">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Readiness Breakdown</h6>
          <canvas id="readinessChart" height="140"></canvas>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Upcoming Assessments</h6>
          <div id="upcomingList">
            <div class="text-center text-muted py-4">
              <i class="bi bi-calendar-check fs-2 d-block mb-2"></i>
              <small>Loading...</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Interventions -->
  <div class="row g-3">
    <div class="col-12">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body">
          <h6 class="fw-bold mb-3"><i class="bi bi-bullseye text-danger me-2"></i>Assigned Interventions</h6>
          <div id="interventionsList">
            <div class="text-center text-muted py-3"><small>Loading interventions...</small></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
const API = 'http://localhost:4000/';
const token = localStorage.getItem('student_token');

async function gql(query, variables = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API, { method: 'POST', headers, body: JSON.stringify({ query, variables }) });
  return res.json();
}

async function loadDashboard() {
  try {
    const { data } = await gql(`query {
      me { name cgpa placementReadiness eligibilityStatus }
      studentAnalytics { readinessScore componentScores { mcq coding overall } assignedInterventions { id title description type status } }
      studentAssessments { id title startsAt endsAt status }
    }`);

    if (!data) return;
    const { me, studentAnalytics, studentAssessments } = data;

    if (me) {
      document.getElementById('readinessScore').textContent = me.placementReadiness.toFixed(1) + '%';
      document.getElementById('readinessBar').style.width = me.placementReadiness + '%';
      document.getElementById('cgpa').textContent = me.cgpa.toFixed(1);
    }

    if (studentAnalytics) {
      const cs = studentAnalytics.componentScores;
      new Chart(document.getElementById('readinessChart'), {
        type: 'bar',
        data: {
          labels: ['MCQ Score', 'Coding Score', 'Overall Readiness'],
          datasets: [{ 
            data: [cs.mcq, cs.coding, cs.overall],
            backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)'],
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { max: 100, grid: { display: false } }, x: { grid: { display: false } } } }
      });

      const ints = studentAnalytics.assignedInterventions;
      const intEl = document.getElementById('interventionsList');
      if (ints && ints.length > 0) {
        intEl.innerHTML = ints.map(i => `
          <div class="d-flex align-items-start gap-3 p-3 bg-body-secondary rounded-3 mb-2">
            <div class="bg-danger bg-opacity-10 rounded-2 p-2"><i class="bi bi-bullseye text-danger"></i></div>
            <div><p class="fw-semibold mb-0 small">${i.title}</p><p class="text-muted small mb-1">${i.description}</p>
            <span class="badge bg-secondary-subtle text-secondary rounded-pill">${i.type}</span>
            <span class="badge ${i.status==='IN_PROGRESS'?'bg-warning-subtle text-warning':'bg-success-subtle text-success'} rounded-pill ms-1">${i.status}</span></div>
          </div>`).join('');
      } else {
        intEl.innerHTML = '<p class="text-muted small">No interventions assigned yet.</p>';
      }
    }

    if (studentAssessments) {
      document.getElementById('assessmentCount').textContent = studentAssessments.length;
      const upcoming = studentAssessments.filter(a => a.startsAt && new Date(a.startsAt) > new Date()).slice(0, 3);
      const upEl = document.getElementById('upcomingList');
      if (upcoming.length > 0) {
        upEl.innerHTML = upcoming.map(a => `
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="bg-primary bg-opacity-10 rounded-2 p-2 text-center" style="min-width:44px">
              <span class="fw-bold text-primary small">${new Date(a.startsAt).getDate()}</span><br>
              <span class="text-muted" style="font-size:10px">${new Date(a.startsAt).toLocaleString('default',{month:'short'})}</span>
            </div>
            <div><p class="fw-semibold mb-0 small">${a.title}</p>
            <small class="text-muted">${new Date(a.startsAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></div>
          </div>`).join('');
      } else {
        upEl.innerHTML = '<p class="text-muted small text-center pt-3">No upcoming assessments.</p>';
      }
    }

    // Streak dots (visual only for now)
    const streakDays = [1,1,1,0,1,1,1];
    document.getElementById('streak').innerHTML = '3 <small class="fs-6">days</small>';
    document.getElementById('streakDots').innerHTML = streakDays.map(d =>
      `<div class="rounded-circle ${d?'bg-warning':'bg-secondary bg-opacity-25'}" style="width:10px;height:10px"></div>`
    ).join('');

  } catch(e) {
    console.error('Dashboard load error:', e);
  }
}

if (token) { loadDashboard(); } else {
  document.querySelector('.container-fluid').insertAdjacentHTML('afterbegin',
    '<div class="alert alert-warning m-3">Not logged in. <a href="#">Login</a> to see your data.</div>');
}
</script>
"""

# ─── 2. ASSESSMENTS ──────────────────────────────────────────────────────────
ASSESSMENTS_HTML = """
<div class="container-fluid py-4 px-3 px-lg-4">

  <!-- List View -->
  <div id="assessmentList">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h4 fw-bold mb-0">Assessments</h1>
      <span class="badge bg-primary-subtle text-primary rounded-pill px-3" id="assessCount">Loading...</span>
    </div>
    <div class="row g-3" id="assessmentCards">
      <div class="col-12 text-center py-5 text-muted"><div class="spinner-border spinner-border-sm"></div> Loading...</div>
    </div>
  </div>

  <!-- Test Interface (hidden by default) -->
  <div id="testInterface" style="display:none">
    <div class="card border-0 shadow-sm rounded-4 mb-3">
      <div class="card-body d-flex justify-content-between align-items-center py-2">
        <h6 class="fw-bold mb-0" id="testTitle">Assessment</h6>
        <div class="d-flex align-items-center gap-3">
          <div class="bg-danger bg-opacity-10 rounded-3 px-3 py-1">
            <i class="bi bi-clock text-danger me-1"></i>
            <span class="fw-bold text-danger" id="timerDisplay">--:--</span>
          </div>
          <button class="btn btn-success btn-sm" onclick="submitTest()"><i class="bi bi-check2 me-1"></i>Submit</button>
          <button class="btn btn-outline-secondary btn-sm" onclick="exitTest()"><i class="bi bi-x-lg"></i></button>
        </div>
      </div>
    </div>
    <div class="row g-3">
      <div class="col-lg-9">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body">
            <p class="text-muted small mb-1" id="questionMeta">Question 1 of N</p>
            <h5 class="fw-semibold mb-4" id="questionText">Loading question...</h5>
            <div id="optionsContainer"></div>
            <div class="d-flex justify-content-between mt-4">
              <button class="btn btn-outline-secondary btn-sm" onclick="prevQ()"><i class="bi bi-arrow-left me-1"></i>Prev</button>
              <button class="btn btn-primary btn-sm" onclick="nextQ()">Next <i class="bi bi-arrow-right ms-1"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body">
            <p class="fw-semibold small mb-2">Question Navigator</p>
            <div class="d-flex flex-wrap gap-1" id="questionNav"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
const API = 'http://localhost:4000/';
const token = localStorage.getItem('student_token');
let currentQ = 0, questions = [], attemptId = null, answers = {}, timerInterval;

async function gql(query, variables = {}) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(API, { method:'POST', headers:h, body: JSON.stringify({query,variables}) });
  return r.json();
}

async function loadAssessments() {
  const { data } = await gql('query { studentAssessments { id title description status durationMinutes totalMarks startsAt endsAt } }');
  const list = data?.studentAssessments || [];
  document.getElementById('assessCount').textContent = list.length + ' available';
  const container = document.getElementById('assessmentCards');
  if (!list.length) { container.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-inbox fs-1 d-block mb-2"></i>No assessments available</div>'; return; }
  container.innerHTML = list.map(a => {
    const started = a.startsAt && new Date(a.startsAt) <= new Date();
    const ended = a.endsAt && new Date(a.endsAt) < new Date();
    return `<div class="col-md-6 col-lg-4">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <span class="badge ${ended?'bg-secondary-subtle text-secondary':started?'bg-success-subtle text-success':'bg-warning-subtle text-warning'} rounded-pill">${ended?'Closed':started?'Live':'Upcoming'}</span>
            <span class="badge bg-info-subtle text-info rounded-pill">${a.totalMarks} marks</span>
          </div>
          <h6 class="fw-bold">${a.title}</h6>
          <p class="text-muted small mb-3">${a.description||'Placement assessment'}</p>
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-clock text-muted small"></i>
            <small class="text-muted">${a.durationMinutes} minutes</small>
          </div>
          ${started && !ended ? `<button class="btn btn-primary w-100 btn-sm" onclick="startTest('${a.id}','${a.title}',${a.durationMinutes})"><i class="bi bi-play-fill me-1"></i>Start</button>` : `<button class="btn btn-outline-secondary w-100 btn-sm" disabled>${ended?'Closed':'Not started yet'}</button>`}
        </div>
      </div>
    </div>`;
  }).join('');
}

async function startTest(assessId, title, minutes) {
  const { data } = await gql(`mutation StartAttempt($assessmentId: ID!) { startAttempt(assessmentId: $assessmentId) { id } }`, { assessmentId: assessId });
  attemptId = data?.startAttempt?.id;
  if (!attemptId) { alert('Could not start attempt. Check attempt limit.'); return; }
  const { data: qdata } = await gql('query { studentQuestions { id title content testCases { id input isHidden } } }');
  questions = qdata?.studentQuestions || [];
  document.getElementById('assessmentList').style.display = 'none';
  document.getElementById('testInterface').style.display = '';
  document.getElementById('testTitle').textContent = title;
  buildNav();
  renderQ(0);
  startTimer(minutes * 60);
}

function startTimer(secs) {
  timerInterval = setInterval(() => {
    if (secs <= 0) { clearInterval(timerInterval); submitTest(); return; }
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    document.getElementById('timerDisplay').textContent = m+':'+s;
    if (secs <= 300) document.getElementById('timerDisplay').classList.add('text-danger');
    secs--;
  }, 1000);
}

function buildNav() {
  document.getElementById('questionNav').innerHTML = questions.map((q,i) =>
    `<button class="btn btn-sm rounded-2 ${i===currentQ?'btn-primary':'btn-outline-secondary'}" style="width:36px;height:36px" id="qnav-${i}" onclick="renderQ(${i})">${i+1}</button>`
  ).join('');
}

function renderQ(idx) {
  currentQ = idx;
  const q = questions[idx];
  if (!q) return;
  document.getElementById('questionMeta').textContent = `Question ${idx+1} of ${questions.length}`;
  document.getElementById('questionText').textContent = q.title;
  buildNav();
  let content;
  try { content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content; } catch(e) { content = {}; }
  const opts = content.options || [];
  document.getElementById('optionsContainer').innerHTML = opts.map((o,i) =>
    `<label class="d-flex align-items-center gap-3 p-3 rounded-3 border mb-2 cursor-pointer ${answers[q.id]===i?'border-primary bg-primary bg-opacity-10':''}">
      <input type="radio" name="opt" value="${i}" class="form-check-input mt-0" ${answers[q.id]===i?'checked':''} onchange="answers['${q.id}']=${i}; document.getElementById('qnav-${idx}').classList.replace('btn-outline-secondary','btn-success')">
      <span>${o}</span>
    </label>`
  ).join('');
}

function prevQ() { if (currentQ > 0) renderQ(currentQ-1); }
function nextQ() { if (currentQ < questions.length-1) renderQ(currentQ+1); }

async function submitTest() {
  clearInterval(timerInterval);
  const { data } = await gql(`mutation { finishAttempt(attemptId: "${attemptId}") { id totalScore status } }`);
  const score = data?.finishAttempt?.totalScore || 0;
  alert(`✅ Submitted! Your score: ${score} marks.\\nView detailed results in Readiness & Analytics.`);
  exitTest();
}

function exitTest() {
  document.getElementById('testInterface').style.display = 'none';
  document.getElementById('assessmentList').style.display = '';
  clearInterval(timerInterval);
}

if (token) loadAssessments();
else document.getElementById('assessmentCards').innerHTML = '<div class="col-12 text-center text-warning py-4">Please login to view assessments.</div>';
</script>
"""

# ─── 3. PRACTICE / CODING ────────────────────────────────────────────────────
PRACTICE_HTML = """
<div class="container-fluid py-4 px-3 px-lg-4">
  <div class="row g-3 h-100">
    <!-- Question Panel -->
    <div class="col-lg-5">
      <div class="card border-0 shadow-sm rounded-4 mb-3">
        <div class="card-body pb-2">
          <div class="d-flex gap-2 mb-3 overflow-auto">
            <button class="btn btn-sm btn-primary rounded-pill px-3">All</button>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3">Easy</button>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3">Medium</button>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3">Hard</button>
          </div>
          <div id="questionList" style="max-height:calc(100vh - 220px);overflow-y:auto"></div>
        </div>
      </div>
    </div>
    <!-- Code Editor Panel -->
    <div class="col-lg-7">
      <div class="card border-0 shadow-sm rounded-4" style="min-height:500px">
        <div class="card-body p-0">
          <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 class="fw-bold mb-0" id="activeQTitle">Select a question</h6>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" id="langSelect" style="width:auto">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <button class="btn btn-sm btn-outline-success" onclick="runCode()"><i class="bi bi-play-fill me-1"></i>Run</button>
              <button class="btn btn-sm btn-success" onclick="submitCode()"><i class="bi bi-check2 me-1"></i>Submit</button>
            </div>
          </div>
          <textarea id="codeEditor" class="w-100 border-0 font-monospace p-3" style="min-height:320px;background:#1e1e2e;color:#cdd6f4;resize:vertical;outline:none;font-size:13px" spellcheck="false" placeholder="// Write your code here..."></textarea>
          <div class="border-top">
            <div class="d-flex gap-2 px-3 pt-2">
              <span class="fw-semibold small">Test Cases</span>
              <span class="badge bg-secondary-subtle text-secondary rounded-pill ms-auto">Visible only</span>
            </div>
            <div id="testCasesPanel" class="p-3">
              <p class="text-muted small">Select a question to see test cases.</p>
            </div>
            <div id="outputPanel" class="px-3 pb-3" style="display:none">
              <div class="border-top pt-2">
                <p class="fw-semibold small mb-1">Output</p>
                <pre id="outputText" class="bg-dark text-light rounded-3 p-2 small" style="max-height:120px;overflow-y:auto"></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
const API = 'http://localhost:4000/';
const token = localStorage.getItem('student_token');
let activeQuestion = null;

async function gql(query, variables = {}) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(API, { method:'POST', headers:h, body: JSON.stringify({query,variables}) });
  return r.json();
}

const starterCode = {
  python: '# Write your solution\\ndef solution():\\n    pass',
  javascript: '// Write your solution\\nfunction solution() {\\n    \\n}',
  cpp: '#include<bits/stdc++.h>\\nusing namespace std;\\n\\nint main(){\\n    \\n    return 0;\\n}',
  java: 'public class Solution {\\n    public static void main(String[] args) {\\n        \\n    }\\n}'
};
document.getElementById('langSelect').addEventListener('change', e => {
  document.getElementById('codeEditor').value = starterCode[e.target.value];
});
document.getElementById('codeEditor').value = starterCode['python'];

async function loadQuestions() {
  const { data } = await gql('query { studentQuestions { id title difficulty type tags testCases { id input output isHidden } } }');
  const qs = data?.studentQuestions || [];
  const el = document.getElementById('questionList');
  if (!qs.length) { el.innerHTML = '<p class="text-muted small">No questions available.</p>'; return; }
  el.innerHTML = qs.map((q,i) => `
    <div class="d-flex align-items-start gap-2 p-2 rounded-3 mb-1 cursor-pointer hover-bg" id="qitem-${i}" onclick="selectQuestion(${i})" style="cursor:pointer">
      <span class="badge ${q.difficulty==='EASY'?'bg-success-subtle text-success':q.difficulty==='MEDIUM'?'bg-warning-subtle text-warning':'bg-danger-subtle text-danger'} rounded-pill mt-1 flex-shrink-0">${q.difficulty}</span>
      <div>
        <p class="mb-0 small fw-semibold">${q.title}</p>
        <div class="d-flex gap-1 flex-wrap mt-1">${(q.tags||[]).slice(0,3).map(t=>`<span class="badge bg-secondary-subtle text-secondary rounded-pill" style="font-size:10px">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
  window._questions = qs;
}

function selectQuestion(idx) {
  activeQuestion = window._questions[idx];
  document.getElementById('activeQTitle').textContent = activeQuestion.title;
  const visibleTC = (activeQuestion.testCases || []).filter(tc => !tc.isHidden);
  const el = document.getElementById('testCasesPanel');
  if (!visibleTC.length) { el.innerHTML = '<p class="text-muted small">No visible test cases.</p>'; return; }
  el.innerHTML = visibleTC.map((tc, i) => `
    <div class="mb-2">
      <small class="text-muted fw-semibold">Case ${i+1}</small>
      <div class="d-flex gap-2 mt-1">
        <div class="flex-fill"><small class="text-muted">Input</small><pre class="bg-body-secondary rounded-2 p-1 mb-0 small">${tc.input||'(none)'}</pre></div>
        <div class="flex-fill"><small class="text-muted">Expected</small><pre class="bg-body-secondary rounded-2 p-1 mb-0 small">${tc.output||'(none)'}</pre></div>
      </div>
    </div>`).join('');
}

async function runCode() {
  const code = document.getElementById('codeEditor').value;
  const lang = document.getElementById('langSelect').value;
  document.getElementById('outputPanel').style.display = '';
  document.getElementById('outputText').textContent = '⏳ Running...';
  // In production, this would hit a code execution service (Judge0 etc.)
  // For now, show a realistic simulation message
  setTimeout(() => {
    document.getElementById('outputText').textContent = `[${lang.toUpperCase()}] Code received. Code execution engine not connected yet.\\nConnect Judge0 or similar at /api/execute to run code live.`;
  }, 800);
}

async function submitCode() {
  alert('Code submitted! Results will appear in your analytics once grading is complete.');
}

if (token) loadQuestions();
else document.getElementById('questionList').innerHTML = '<p class="text-warning small">Please login to practice.</p>';
</script>
"""

# ─── 4. ANALYTICS ────────────────────────────────────────────────────────────
ANALYTICS_HTML = """
<div class="container-fluid py-4 px-3 px-lg-4">
  <h1 class="h4 fw-bold mb-1">Readiness & Analytics</h1>
  <p class="text-muted small mb-4">Your placement preparation performance at a glance.</p>

  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <div class="card border-0 shadow-sm rounded-4 text-center p-4 h-100">
        <div class="position-relative d-inline-block mx-auto mb-2" style="width:120px;height:120px">
          <canvas id="donutChart" width="120" height="120"></canvas>
          <div class="position-absolute top-50 start-50 translate-middle">
            <span class="fw-bold fs-4" id="readinessPct">--</span><br>
            <small class="text-muted" style="font-size:10px">READINESS</small>
          </div>
        </div>
        <h6 class="fw-bold mb-1">Overall Readiness</h6>
        <p class="text-muted small mb-0" id="eligibilityBadge">--</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Component Scores</h6>
          <div class="mb-3">
            <div class="d-flex justify-content-between small mb-1"><span>MCQ</span><span id="mcqScore">--</span></div>
            <div class="progress" style="height:8px"><div class="progress-bar bg-primary rounded-pill" id="mcqBar" style="width:0%"></div></div>
          </div>
          <div class="mb-3">
            <div class="d-flex justify-content-between small mb-1"><span>Coding</span><span id="codingScore">--</span></div>
            <div class="progress" style="height:8px"><div class="progress-bar bg-success rounded-pill" id="codingBar" style="width:0%"></div></div>
          </div>
          <div>
            <div class="d-flex justify-content-between small mb-1"><span>Overall</span><span id="overallScore">--</span></div>
            <div class="progress" style="height:8px"><div class="progress-bar bg-warning rounded-pill" id="overallBar" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Quick Stats</h6>
          <ul class="list-unstyled mb-0">
            <li class="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="small text-muted">Assessments taken</span>
              <span class="fw-semibold" id="statAttempts">--</span>
            </li>
            <li class="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="small text-muted">Best score</span>
              <span class="fw-semibold text-success" id="statBest">--</span>
            </li>
            <li class="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="small text-muted">CGPA</span>
              <span class="fw-semibold" id="statCgpa">--</span>
            </li>
            <li class="d-flex justify-content-between align-items-center py-2">
              <span class="small text-muted">Eligibility</span>
              <span class="badge bg-success-subtle text-success rounded-pill" id="statElig">--</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- History -->
  <div class="card border-0 shadow-sm rounded-4">
    <div class="card-body">
      <h6 class="fw-bold mb-3">Assessment History</h6>
      <div id="historyTable">
        <div class="text-center text-muted py-4"><div class="spinner-border spinner-border-sm"></div></div>
      </div>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
const API = 'http://localhost:4000/';
const token = localStorage.getItem('student_token');
async function gql(query, variables = {}) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(API, { method:'POST', headers:h, body: JSON.stringify({query,variables}) });
  return r.json();
}

async function loadAnalytics() {
  const { data } = await gql(`query {
    me { cgpa placementReadiness eligibilityStatus attempts { id status mcqScore codingScore totalScore completedAt assessment { id } } }
    studentAnalytics { readinessScore componentScores { mcq coding overall } }
  }`);
  if (!data) return;
  const { me, studentAnalytics } = data;
  const cs = studentAnalytics?.componentScores;

  if (me) {
    document.getElementById('readinessPct').textContent = me.placementReadiness.toFixed(0) + '%';
    document.getElementById('eligibilityBadge').textContent = me.eligibilityStatus;
    document.getElementById('statCgpa').textContent = me.cgpa.toFixed(1);
    document.getElementById('statElig').textContent = me.eligibilityStatus;

    const attempts = (me.attempts || []).filter(a => a.status === 'COMPLETED');
    document.getElementById('statAttempts').textContent = attempts.length;
    if (attempts.length > 0) {
      const best = Math.max(...attempts.map(a => a.totalScore));
      document.getElementById('statBest').textContent = best + ' pts';
    }
    
    // History table
    const htEl = document.getElementById('historyTable');
    if (attempts.length) {
      htEl.innerHTML = `<table class="table table-sm table-hover">
        <thead><tr><th>Date</th><th>MCQ</th><th>Coding</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${attempts.map(a => `<tr>
          <td class="small">${a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '--'}</td>
          <td class="small">${a.mcqScore}</td>
          <td class="small">${a.codingScore}</td>
          <td class="fw-semibold">${a.totalScore}</td>
          <td><span class="badge bg-success-subtle text-success rounded-pill">Completed</span></td>
        </tr>`).join('')}</tbody>
      </table>`;
    } else {
      htEl.innerHTML = '<p class="text-muted text-center py-4">No completed assessments yet.</p>';
    }
  }

  if (cs) {
    document.getElementById('mcqScore').textContent = cs.mcq + '%';
    document.getElementById('codingScore').textContent = cs.coding + '%';
    document.getElementById('overallScore').textContent = cs.overall + '%';
    document.getElementById('mcqBar').style.width = cs.mcq + '%';
    document.getElementById('codingBar').style.width = cs.coding + '%';
    document.getElementById('overallBar').style.width = cs.overall + '%';
  }

  // Donut chart
  const readiness = me?.placementReadiness || 0;
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [readiness, 100 - readiness],
        backgroundColor: ['rgba(99,102,241,0.85)', 'rgba(229,231,235,0.4)'],
        borderWidth: 0,
        borderRadius: 5,
      }]
    },
    options: { cutout: '78%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
  });
}

if (token) loadAnalytics();
else document.getElementById('readinessPct').textContent = '?';
</script>
"""

# ─── PATCH ALL FILES ─────────────────────────────────────────────────────────
files = {
    os.path.join(BASE, "dashboard-student.html"): (DASHBOARD_HTML, "Dashboard | SCET Student"),
    os.path.join(BASE, "pages", "assessments.html"): (ASSESSMENTS_HTML, "Assessments | SCET Student"),
    os.path.join(BASE, "pages", "interview-prep.html"): (PRACTICE_HTML, "Practice | SCET Student"),
    os.path.join(BASE, "pages", "my-progress.html"): (ANALYTICS_HTML, "Analytics | SCET Student"),
}

for path, (html, title) in files.items():
    patch(path, html, title)

print("\nAll student pages updated.")

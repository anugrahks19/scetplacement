import os

SHELL_TOP = """<!DOCTYPE html>
<html data-bs-theme="light" data-theme="theme-indigo" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <title>{title} - SCET Placement Cell</title>
    <meta content="SCET Placement Cell Faculty Portal" name="description"/>
    <link href="assets/images/favicon.ico" rel="icon" type="image/png"/>
    <link href="assets/images/apple-icon-180x180.png" rel="apple-touch-icon" sizes="180x180"/>
    <link href="assets/vendor/bootstrap/bootstrap.min.css" rel="stylesheet"/>
    <link href="assets/vendor/bootstrap/bootstrap-icons.css" rel="stylesheet"/>
    <link href="assets/vendor/daterangepicker/daterangepicker.css" rel="stylesheet"/>
    <link href="assets/css/styles.css" rel="stylesheet"/>
    <link href="assets/css/layout-main.css" rel="stylesheet"/>
    <link href="assets/css/vendor/charts.css" rel="stylesheet"/>
    <style>
        .context-selector-card {{
            background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.08), rgba(var(--bs-primary-rgb), 0.02));
            border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
            border-radius: 1rem;
        }}
    </style>
</head>
<body class="layout-main">
<div class="app-wrapper">
    <!-- Header -->
    <header class="sticky-top px-lg-3">
        <div class="container-fluid">
            <div class="d-flex align-items-center justify-content-between py-2">
                <div class="d-flex gap-2 align-items-center flex-fill">
                    <button aria-controls="offcanvasMenu" aria-label="Toggle navigation" class="navbar-toggler d-lg-none" data-bs-target="#offcanvasMenu" data-bs-toggle="offcanvas" type="button">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <a class="brand text-decoration-none d-flex gap-2 align-items-center d-lg-none me-auto" href="faculty-dashboard.html">
                        <span class="fs-5 fw-bold">SCET Placement</span>
                    </a>
                    <div class="d-none d-md-flex align-items-center bg-body-secondary rounded-pill px-3 py-1 flex-grow-1" style="max-width: 320px;">
                        <i class="bi bi-search text-muted me-2"></i>
                        <input type="text" class="form-control border-0 bg-transparent p-0 fs-14 focus-ring-none" placeholder="Quick search in portal...">
                    </div>
                    <button aria-label="Toggle theme" class="btn icon-button border-0" id="themeToggle"><i class="bi bi-sun"></i></button>
                    <button aria-label="Notifications" class="btn icon-button border-0 position-relative" data-bs-target="#notifications_drawer" data-bs-toggle="offcanvas" type="button">
                        <span class="bullet-dot bg-danger"></span>
                        <i class="bi bi-bell"></i>
                    </button>
                    <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 d-none d-sm-inline-block">
                        <i class="bi bi-person-workspace me-1"></i> Faculty Portal
                    </span>
                </div>
                <div class="right-header d-flex align-items-center d-lg-none">
                    <a class="btn btn-sm btn-outline-danger rounded-pill ms-2" href="index.html">Logout</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Sidebar menu (Left Bar) -->
    <aside class="navbar navbar-expand-lg align-items-start px-2 px-lg-3 px-xl-4 py-3">
        <div class="offcanvas offcanvas-start" id="offcanvasSidebar" tabindex="-1">
            <div class="offcanvas-header">
                <h6 class="offcanvas-title">Faculty Menu</h6>
                <button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas" type="button"></button>
            </div>
            <div class="offcanvas-body flex-column align-items-lg-center">
                <a aria-label="SCET Faculty" class="brand text-decoration-none d-none d-lg-flex gap-2 align-items-center mb-2" href="faculty-dashboard.html">
                    <svg fill="none" height="34" viewBox="0 0 32 32" width="34" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 3C0 1.34315 1.34315 0 3 0H19C26.1797 0 32 5.8203 32 13V19C32 26.1797 26.1797 32 19 32H3C1.34315 32 0 30.6569 0 29V3Z" fill="var(--bs-primary)"></path>
                        <path d="M12.4851 18.925C12.4851 20.3456 12.7822 21.5962 13.3762 22.6767C13.9901 23.7572 14.8119 24.5975 15.8416 25.1978C16.8713 25.7981 18.0198 26.0982 19.2871 26.0982C20.5743 26.0982 21.7129 25.8181 22.703 25.2578C23.6931 24.6776 24.4653 23.8772 25.0198 22.8568C25.5743 21.8363 25.8515 20.6558 25.8515 19.3151C25.8515 17.9545 25.5743 16.724 25.0198 15.6235C24.4653 14.523 23.6733 13.6426 22.6436 12.9823C21.6337 12.322 20.4356 11.9918 19.0495 11.9918C17.7624 11.9918 16.6238 12.292 15.6337 12.8922C14.6634 13.4925 13.8911 14.3129 13.3168 15.3533C12.7624 16.3938 12.4851 17.5844 12.4851 18.925ZM8 18.925C8 17.3242 8.27723 15.8636 8.83168 14.543C9.38614 13.2024 10.1683 12.0418 11.1782 11.0614C12.1881 10.0809 13.3564 9.33061 14.6832 8.81037C16.0297 8.27012 17.4851 8 19.0495 8C20.6337 8 22.0891 8.27012 23.4158 8.81037C24.7426 9.33061 25.8911 10.0809 26.8614 11.0614C27.8515 12.0418 28.6139 13.2024 29.1485 14.543C29.703 15.8636 29.9802 17.3242 29.9802 18.925C29.9802 20.5057 29.7129 21.9764 29.1782 23.337C28.6436 24.6776 27.8812 25.8481 26.8911 26.8486C25.9208 27.849 24.7723 28.6294 23.4455 29.1896C22.1188 29.7299 20.6535 30 19.0495 30C17.4653 30 16 29.7299 14.6535 29.1896C13.3069 28.6294 12.1287 27.849 11.1188 26.8486C10.1287 25.8481 9.35644 24.6776 8.80198 23.337C8.26733 21.9764 8 20.5057 8 18.925ZM17.7426 20.4256H22.3465L32 32H29.1782L17.7426 20.4256Z" fill="var(--bs-white)"></path>
                    </svg>
                </a>
                <ul class="list-unstyled d-flex flex-column align-items-lg-center gap-2 rounded-pill mt-lg-3 py-lg-4">
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Dashboard" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_dashboard}" href="faculty-dashboard.html">
                            <i class="bi bi-speedometer fs-4"></i><span class="d-lg-none ms-2">Dashboard</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Question Bank" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_questions}" href="faculty-questions.html">
                            <i class="bi bi-collection fs-4"></i><span class="d-lg-none ms-2">Question Bank</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Question Editor" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_editor}" href="faculty-question-editor.html">
                            <i class="bi bi-pencil-square fs-4"></i><span class="d-lg-none ms-2">Create Question</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="AI Question Review" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_review}" href="faculty-question-review.html">
                            <i class="bi bi-robot fs-4"></i><span class="d-lg-none ms-2">AI Review</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Assessments" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_assessments}" href="faculty-assessments.html">
                            <i class="bi bi-journal-check fs-4"></i><span class="d-lg-none ms-2">Assessments</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Assessment Builder" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_builder}" href="faculty-assessment-builder.html">
                            <i class="bi bi-tools fs-4"></i><span class="d-lg-none ms-2">Builder</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Assessment Results" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_results}" href="faculty-assessment-results.html">
                            <i class="bi bi-bar-chart-fill fs-4"></i><span class="d-lg-none ms-2">Results & Analytics</span>
                        </a>
                    </li>
                    <li data-bs-custom-class="custom-tooltip" data-bs-title="Students Roster" data-bs-toggle="tooltip">
                        <a class="nav-link py-2 px-2 px-lg-4 {active_students}" href="faculty-students.html">
                            <i class="bi bi-people fs-4"></i><span class="d-lg-none ms-2">Students</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>

    <!-- Rightbar (DashQ Skinny 60px Action bar) -->
    <div class="rightbar text-center d-flex flex-lg-column justify-content-between px-3 px-lg-0 py-2 py-lg-3">
        <ul class="list-unstyled d-flex flex-lg-column gap-3 align-items-center mb-0 overflow-x-auto pt-lg-1 me-4 me-lg-0 pb-2 li_animate">
            <li data-bs-custom-class="custom-tooltip" data-bs-placement="left" data-bs-title="Dr. Sharma (HOD CSE)" data-bs-toggle="tooltip">
                <a href="#"><img alt="HOD" class="avatar avatar-sm border border-2 border-primary" loading="lazy" src="assets/images/avatar/avatar-1.png"/></a>
            </li>
            <li data-bs-custom-class="custom-tooltip" data-bs-placement="left" data-bs-title="Prof. Ananya (Placement Officer)" data-bs-toggle="tooltip">
                <a href="#"><img alt="Coordinator" class="avatar avatar-sm border" loading="lazy" src="assets/images/avatar/avatar-2.png"/></a>
            </li>
            <li data-bs-custom-class="custom-tooltip" data-bs-placement="left" data-bs-title="TA Rahul (Lab In-Charge)" data-bs-toggle="tooltip">
                <a href="#"><img alt="TA" class="avatar avatar-sm border" loading="lazy" src="assets/images/avatar/avatar-3.png"/></a>
            </li>
        </ul>
        <div class="d-none d-lg-inline-flex flex-column mt-auto">
            <button aria-label="Template Settings" class="btn icon-button border-0 py-2 px-3" data-bs-target="#setting_drawer" data-bs-toggle="offcanvas" type="button">
                <i class="bi bi-gear"></i>
            </button>
            <div class="dropdown dropup mt-lg-1">
                <button aria-expanded="false" class="btn dropdown-toggle after-none border-0 p-0" data-bs-auto-close="outside" data-bs-toggle="dropdown" type="button">
                    <img alt="Faculty" class="rounded-circle border border-2 border-primary shadow" height="34" loading="lazy" src="assets/images/avatar/avatar-1.png" width="34"/>
                </button>
                <div class="dropdown-menu p-lg-4 p-3 rounded-4 shadow-sm">
                    <h6 class="mb-0 fw-bold">Prof. Advait Patel</h6>
                    <p class="small text-muted mb-2">faculty@scet.ac.in</p>
                    <a class="btn btn-danger btn-sm text-uppercase w-100 rounded-pill" href="index.html">Sign out</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Content (Main Area) -->
    <main class="app-body border">
        <!-- Page Header -->
        <div class="page-header py-3 px-3 px-lg-4 border-bottom bg-body">
            <div class="container-fluid px-0">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2">
                            <h1 class="fs-4 section-title mb-0 fw-bold">{header_title}</h1>
                            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fs-12">{header_badge}</span>
                        </div>
                        <p class="text-muted small mb-0 mt-1">{header_sub}</p>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        {header_actions}
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Body Inner -->
        <div class="py-3 px-3 px-lg-4">
            <div class="container-fluid px-0">
                <!-- TOP SELECTION: SEMESTER & CLASS SELECTOR -->
                <div class="context-selector-card p-3 p-lg-4 mb-4 shadow-sm">
                    <div class="row g-3 align-items-center">
                        <div class="col-12 col-md-auto d-flex align-items-center gap-2">
                            <div class="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;">
                                <i class="bi bi-funnel-fill fs-5"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">Active Scope</h6>
                                <span class="small text-muted">Target Class & Semester</span>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-3">
                            <label class="form-label small text-uppercase text-muted fw-semibold mb-1">Department</label>
                            <select class="form-select form-select-sm rounded-pill border-secondary-subtle">
                                <option selected>Computer Science & Engg (CSE)</option>
                                <option>Information Technology (IT)</option>
                                <option>Electronics & Comm (ECE)</option>
                            </select>
                        </div>
                        <div class="col-12 col-sm-6 col-md-3">
                            <label class="form-label small text-uppercase text-muted fw-semibold mb-1">Semester</label>
                            <select class="form-select form-select-sm rounded-pill border-secondary-subtle">
                                <option selected>Semester 7 (Final Year Placement)</option>
                                <option>Semester 6</option>
                                <option>Semester 5</option>
                                <option>Semester 8</option>
                            </select>
                        </div>
                        <div class="col-12 col-sm-6 col-md-3">
                            <label class="form-label small text-uppercase text-muted fw-semibold mb-1">Class / Division</label>
                            <select class="form-select form-select-sm rounded-pill border-secondary-subtle">
                                <option selected>CSE - Div A (64 Students)</option>
                                <option>CSE - Div B (62 Students)</option>
                                <option>All Divisions (184 Students)</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-auto ms-md-auto d-flex align-items-end">
                            <span class="badge bg-success-subtle text-success rounded-pill px-3 py-2"><i class="bi bi-check2-circle me-1"></i>Active Context</span>
                        </div>
                    </div>
                </div>

                {main_content}

            </div>
        </div>
    </main>
</div>

<!-- Scripts -->
<script src="assets/vendor/jquery/jquery.min.js"></script>
<script src="assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="assets/js/app.js"></script>
<script>
    document.getElementById('themeToggle')?.addEventListener('click', function () {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-bs-theme', newTheme);
    });
</script>
</body>
</html>
"""

# 1. Question Editor
editor_content = """
<div class="row g-4">
    <div class="col-12 col-lg-8">
        <div class="card rounded-4 border shadow-sm p-4">
            <h5 class="fw-bold mb-3">Question Details</h5>
            <form>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Problem Title / Question Name</label>
                    <input type="text" class="form-control rounded-3" placeholder="e.g. Implement LRU Cache with O(1) Operations">
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Question Type</label>
                        <select class="form-select rounded-3">
                            <option>Coding Challenge</option>
                            <option>Technical MCQ</option>
                            <option>Aptitude / Quantitative MCQ</option>
                            <option>Debugging / Bug Hunt</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Difficulty Level</label>
                        <select class="form-select rounded-3">
                            <option>Easy</option>
                            <option selected>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Topic / Domain</label>
                        <select class="form-select rounded-3">
                            <option>Data Structures: Hash & DLL</option>
                            <option>Dynamic Programming</option>
                            <option>Trees & Graphs</option>
                            <option>DBMS & SQL</option>
                            <option>System Design</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Problem Statement / Question Description</label>
                    <textarea class="form-control rounded-3" rows="6" placeholder="Write problem statement in Markdown or plain text. Specify inputs, outputs, and constraints..."></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Starter Code / Boilerplate (Optional)</label>
                    <textarea class="form-control rounded-3 font-monospace" rows="5" placeholder="// C++ / Java / Python starter template
class LRUCache {
public:
    LRUCache(int capacity) { }
    int get(int key) { }
    void put(int key, int value) { }
};"></textarea>
                </div>
                <div class="mb-4">
                    <label class="form-label fw-semibold">Visible & Hidden Test Cases</label>
                    <div class="p-3 bg-body-secondary rounded-3 mb-2">
                        <div class="row g-2">
                            <div class="col-md-6"><input type="text" class="form-control form-control-sm" placeholder="Input (e.g. [[2],[1,1],[2,2],[1]])"></div>
                            <div class="col-md-6"><input type="text" class="form-control form-control-sm" placeholder="Expected Output (e.g. [null,null,null,1])"></div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill"><i class="bi bi-plus me-1"></i>Add Test Case</button>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-primary rounded-pill px-4" onclick="alert('Question saved successfully into College Repository!');"><i class="bi bi-check2-circle me-1"></i>Save to Repository</button>
                    <a href="faculty-questions.html" class="btn btn-outline-secondary rounded-pill px-4">Cancel</a>
                </div>
            </form>
        </div>
    </div>
    <div class="col-12 col-lg-4">
        <div class="card rounded-4 border shadow-sm p-4 mb-4">
            <h6 class="fw-bold mb-2">AI Problem Enhancement</h6>
            <p class="small text-muted mb-3">Generate automated test cases, edge cases, and time/space complexity analysis using the internal LLM.</p>
            <button class="btn btn-outline-primary rounded-pill w-100 btn-sm mb-2"><i class="bi bi-stars me-1"></i>Auto-Generate 5 Edge Cases</button>
            <button class="btn btn-outline-warning rounded-pill w-100 btn-sm"><i class="bi bi-robot me-1"></i>Verify Difficulty Level</button>
        </div>
    </div>
</div>
"""

# 2. AI Question Review
review_content = """
<div class="card rounded-4 border shadow-sm mb-4">
    <div class="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div>
            <h6 class="fw-bold mb-0">AI Generated Question Verification Queue</h6>
            <span class="small text-muted">Review questions suggested by AI before publishing to students</span>
        </div>
        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">18 Pending Approval</span>
    </div>
    <div class="card-body p-4">
        <div class="list-group list-group-flush">
            <!-- Review Item 1 -->
            <div class="list-group-item px-0 py-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-primary-subtle text-primary rounded-pill me-1">DSA</span>
                        <span class="badge bg-danger-subtle text-danger rounded-pill me-1">Hard</span>
                        <span class="badge bg-success-subtle text-success rounded-pill">AI Confidence: 96%</span>
                    </div>
                    <span class="small text-muted">Generated 2 hours ago</span>
                </div>
                <h5 class="fw-bold mb-2">Longest Increasing Path in a Matrix</h5>
                <p class="text-muted small mb-3">Given an m x n integers matrix, return the length of the longest increasing path in matrix. Each step you can move either up, down, left, or right with memoized DFS.</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-success rounded-pill px-3" onclick="this.innerHTML='<i class=bi-check2></i> Approved'; this.disabled=true;"><i class="bi bi-check-lg me-1"></i>Approve Question</button>
                    <a href="faculty-question-editor.html" class="btn btn-sm btn-outline-primary rounded-pill px-3"><i class="bi bi-pencil me-1"></i>Edit Question</a>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="this.closest('.list-group-item').remove();"><i class="bi bi-trash me-1"></i>Reject</button>
                </div>
            </div>
            <!-- Review Item 2 -->
            <div class="list-group-item px-0 py-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-info-subtle text-info rounded-pill me-1">Aptitude</span>
                        <span class="badge bg-warning-subtle text-warning rounded-pill me-1">Medium</span>
                        <span class="badge bg-success-subtle text-success rounded-pill">AI Confidence: 94%</span>
                    </div>
                    <span class="small text-muted">Generated 3 hours ago</span>
                </div>
                <h5 class="fw-bold mb-2">Work and Time: Alternating Hours Calculation</h5>
                <p class="text-muted small mb-3">A can finish a task in 12 days and B in 18 days. If they work alternately starting with A, on which day will the work complete?</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-success rounded-pill px-3" onclick="this.innerHTML='<i class=bi-check2></i> Approved'; this.disabled=true;"><i class="bi bi-check-lg me-1"></i>Approve Question</button>
                    <a href="faculty-question-editor.html" class="btn btn-sm btn-outline-primary rounded-pill px-3"><i class="bi bi-pencil me-1"></i>Edit Question</a>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="this.closest('.list-group-item').remove();"><i class="bi bi-trash me-1"></i>Reject</button>
                </div>
            </div>
            <!-- Review Item 3 -->
            <div class="list-group-item px-0 py-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-secondary-subtle text-secondary rounded-pill me-1">Debugging</span>
                        <span class="badge bg-danger-subtle text-danger rounded-pill me-1">Hard</span>
                        <span class="badge bg-success-subtle text-success rounded-pill">AI Confidence: 91%</span>
                    </div>
                    <span class="small text-muted">Generated 5 hours ago</span>
                </div>
                <h5 class="fw-bold mb-2">Deadlock in Multi-Threaded Bank Transfer</h5>
                <p class="text-muted small mb-3">Java snippet acquires accountA lock then accountB lock in transfer() without sorting account IDs, creating circular wait deadlock condition.</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-success rounded-pill px-3" onclick="this.innerHTML='<i class=bi-check2></i> Approved'; this.disabled=true;"><i class="bi bi-check-lg me-1"></i>Approve Question</button>
                    <a href="faculty-question-editor.html" class="btn btn-sm btn-outline-primary rounded-pill px-3"><i class="bi bi-pencil me-1"></i>Edit Question</a>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="this.closest('.list-group-item').remove();"><i class="bi bi-trash me-1"></i>Reject</button>
                </div>
            </div>
        </div>
    </div>
</div>
"""

# 3. Assessments List
assessments_content = """
<div class="card rounded-4 border shadow-sm">
    <div class="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div>
            <h6 class="fw-bold mb-0">Class Placement Assessments</h6>
            <span class="small text-muted">Mock tests, aptitude series, and coding assessments</span>
        </div>
        <a href="faculty-assessment-builder.html" class="btn btn-sm btn-primary rounded-pill px-3"><i class="bi bi-plus-lg me-1"></i>Create New Assessment</a>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr class="small text-uppercase text-muted">
                        <th class="ps-4">Assessment Name</th>
                        <th>Target Batch</th>
                        <th>Format</th>
                        <th>Duration</th>
                        <th>Submissions</th>
                        <th>Status</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">TCS NQT Full Diagnostic Mock</div>
                            <span class="small text-muted">Created by Prof. Patel</span>
                        </td>
                        <td><span class="badge bg-secondary-subtle text-secondary rounded-pill">CSE Sem 7 (Div A)</span></td>
                        <td>40 MCQs + 2 Coding</td>
                        <td>90 Mins</td>
                        <td><span class="fw-bold">58 / 64</span> (90%)</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill">Live Active</span></td>
                        <td class="text-end pe-4">
                            <a href="faculty-assessment-results.html" class="btn btn-sm btn-primary rounded-pill px-3">View Analytics</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Dynamic Programming Sprint #2</div>
                            <span class="small text-muted">Created by Prof. Patel</span>
                        </td>
                        <td><span class="badge bg-secondary-subtle text-secondary rounded-pill">CSE Sem 7 (Div A & B)</span></td>
                        <td>4 Coding Problems</td>
                        <td>120 Mins</td>
                        <td><span class="fw-bold">42 / 64</span> (65%)</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill">Live Active</span></td>
                        <td class="text-end pe-4">
                            <a href="faculty-assessment-results.html" class="btn btn-sm btn-primary rounded-pill px-3">View Analytics</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Infosys SpringBoard Reasoning Drill</div>
                            <span class="small text-muted">Created by Prof. Rajesh</span>
                        </td>
                        <td><span class="badge bg-secondary-subtle text-secondary rounded-pill">All IT & CSE Sem 7</span></td>
                        <td>30 MCQs</td>
                        <td>45 Mins</td>
                        <td><span class="fw-bold">0 / 184</span> (Scheduled)</td>
                        <td><span class="badge bg-info-subtle text-info rounded-pill">Today 4:00 PM</span></td>
                        <td class="text-end pe-4">
                            <a href="faculty-assessment-builder.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3">Edit Settings</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Core CS Fundamentals: DBMS & OS</div>
                            <span class="small text-muted">Completed on Sep 12</span>
                        </td>
                        <td><span class="badge bg-secondary-subtle text-secondary rounded-pill">CSE Sem 7 (Div A)</span></td>
                        <td>50 MCQs</td>
                        <td>60 Mins</td>
                        <td><span class="fw-bold">64 / 64</span> (100%)</td>
                        <td><span class="badge bg-secondary-subtle text-secondary rounded-pill">Completed</span></td>
                        <td class="text-end pe-4">
                            <a href="faculty-assessment-results.html" class="btn btn-sm btn-outline-primary rounded-pill px-3">Final Report</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
"""

# 4. Assessment Builder
builder_content = """
<div class="card rounded-4 border shadow-sm p-4">
    <h5 class="fw-bold mb-3">Create Placement Assessment</h5>
    <form>
        <div class="row g-3 mb-3">
            <div class="col-md-6">
                <label class="form-label fw-semibold">Assessment Title</label>
                <input type="text" class="form-control rounded-3" placeholder="e.g. Cognizant GenC Next Coding Mock">
            </div>
            <div class="col-md-6">
                <label class="form-label fw-semibold">Target Company Pattern</label>
                <select class="form-select rounded-3">
                    <option>General Tier-1 Product Companies (FAANG / Unicorns)</option>
                    <option>TCS NQT / Digital</option>
                    <option>Infosys Specialist Programmer</option>
                    <option>Cognizant GenC Next</option>
                    <option>Accenture Advanced Technical</option>
                </select>
            </div>
        </div>
        <div class="row g-3 mb-3">
            <div class="col-md-3">
                <label class="form-label fw-semibold">Duration (Minutes)</label>
                <input type="number" class="form-control rounded-3" value="90">
            </div>
            <div class="col-md-3">
                <label class="form-label fw-semibold">Passing Score (%)</label>
                <input type="number" class="form-control rounded-3" value="65">
            </div>
            <div class="col-md-3">
                <label class="form-label fw-semibold">Start Date & Time</label>
                <input type="datetime-local" class="form-control rounded-3">
            </div>
            <div class="col-md-3">
                <label class="form-label fw-semibold">End Date & Time</label>
                <input type="datetime-local" class="form-control rounded-3">
            </div>
        </div>
        <div class="mb-4">
            <label class="form-label fw-semibold">Security & Proctoring Settings</label>
            <div class="d-flex flex-wrap gap-4 p-3 bg-body-secondary rounded-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" checked id="p1">
                    <label class="form-check-label" for="p1">Tab Switching Penalty & Warning</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" checked id="p2">
                    <label class="form-check-label" for="p2">Copy-Paste Prevention</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" checked id="p3">
                    <label class="form-check-label" for="p3">Shuffle Questions</label>
                </div>
            </div>
        </div>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary rounded-pill px-4" onclick="alert('Assessment Created and Scheduled for target batch!');"><i class="bi bi-send me-1"></i>Publish & Schedule</button>
            <a href="faculty-assessments.html" class="btn btn-outline-secondary rounded-pill px-4">Cancel</a>
        </div>
    </form>
</div>
"""

# 5. Assessment Results
results_content = """
<div class="row g-4 mb-4">
    <div class="col-md-4">
        <div class="card p-3 rounded-4 border shadow-sm">
            <span class="text-muted small text-uppercase fw-semibold">Batch Average Score</span>
            <h3 class="fw-bold mb-0 text-primary">78.4%</h3>
            <span class="small text-success"><i class="bi bi-arrow-up"></i> Top score: 98%</span>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card p-3 rounded-4 border shadow-sm">
            <span class="text-muted small text-uppercase fw-semibold">Turnout / Submissions</span>
            <h3 class="fw-bold mb-0 text-success">58 / 64</h3>
            <span class="small text-muted">90.6% attendance</span>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card p-3 rounded-4 border shadow-sm">
            <span class="text-muted small text-uppercase fw-semibold">Placement Qualified (>=70%)</span>
            <h3 class="fw-bold mb-0 text-info">46 Students</h3>
            <span class="small text-muted">Ready for campus round</span>
        </div>
    </div>
</div>

<div class="card rounded-4 border shadow-sm">
    <div class="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <h6 class="fw-bold mb-0">Class Assessment Leaderboard</h6>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3"><i class="bi bi-filetype-pdf me-1"></i>Download Merit List</button>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr class="small text-uppercase text-muted">
                        <th class="ps-4">Rank</th>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>MCQ Score</th>
                        <th>Coding Score</th>
                        <th>Total (%)</th>
                        <th>Integrity Flags</th>
                        <th class="text-end pe-4">Detailed Log</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="ps-4 fw-bold text-primary">#1</td>
                        <td>
                            <div class="fw-semibold">Rohan Mehta</div>
                            <span class="small text-muted">rohan.m@scet.ac.in</span>
                        </td>
                        <td>CSE22001</td>
                        <td>38 / 40</td>
                        <td>60 / 60</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill fw-bold">98%</span></td>
                        <td><span class="badge bg-light text-muted border rounded-pill">0 Flags</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Inspect Code</button></td>
                    </tr>
                    <tr>
                        <td class="ps-4 fw-bold text-primary">#2</td>
                        <td>
                            <div class="fw-semibold">Pooja Sharma</div>
                            <span class="small text-muted">pooja.s@scet.ac.in</span>
                        </td>
                        <td>CSE22014</td>
                        <td>36 / 40</td>
                        <td>55 / 60</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill fw-bold">91%</span></td>
                        <td><span class="badge bg-light text-muted border rounded-pill">0 Flags</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Inspect Code</button></td>
                    </tr>
                    <tr>
                        <td class="ps-4 fw-bold text-primary">#3</td>
                        <td>
                            <div class="fw-semibold">Aniket Desai</div>
                            <span class="small text-muted">aniket.d@scet.ac.in</span>
                        </td>
                        <td>CSE22029</td>
                        <td>34 / 40</td>
                        <td>52 / 60</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill fw-bold">86%</span></td>
                        <td><span class="badge bg-warning-subtle text-warning border rounded-pill">1 Tab Switch</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Inspect Code</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
"""

# 6. Students Roster
students_content = """
<div class="card rounded-4 border shadow-sm">
    <div class="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div>
            <h6 class="fw-bold mb-0">Class Student Roster & Placement Eligibility</h6>
            <span class="small text-muted">Monitoring CSE - Division A (Batch 2026)</span>
        </div>
        <button class="btn btn-sm btn-outline-primary rounded-pill px-3"><i class="bi bi-envelope me-1"></i>Email Batch</button>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr class="small text-uppercase text-muted">
                        <th class="ps-4">Student</th>
                        <th>Roll No</th>
                        <th>CGPA</th>
                        <th>Placement Readiness</th>
                        <th>Tests Attempted</th>
                        <th>Status</th>
                        <th class="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Rohan Mehta</div>
                            <span class="small text-muted">rohan.m@scet.ac.in</span>
                        </td>
                        <td>CSE22001</td>
                        <td>8.92</td>
                        <td>
                            <div class="progress" style="height: 6px; width: 100px;">
                                <div class="progress-bar bg-success" style="width: 92%;"></div>
                            </div>
                            <span class="fs-11 text-muted">92% Ready</span>
                        </td>
                        <td>12 / 12</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill">Eligible</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Profile</button></td>
                    </tr>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Pooja Sharma</div>
                            <span class="small text-muted">pooja.s@scet.ac.in</span>
                        </td>
                        <td>CSE22014</td>
                        <td>8.65</td>
                        <td>
                            <div class="progress" style="height: 6px; width: 100px;">
                                <div class="progress-bar bg-primary" style="width: 86%;"></div>
                            </div>
                            <span class="fs-11 text-muted">86% Ready</span>
                        </td>
                        <td>11 / 12</td>
                        <td><span class="badge bg-success-subtle text-success rounded-pill">Eligible</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Profile</button></td>
                    </tr>
                    <tr>
                        <td class="ps-4">
                            <div class="fw-semibold">Aniket Desai</div>
                            <span class="small text-muted">aniket.d@scet.ac.in</span>
                        </td>
                        <td>CSE22029</td>
                        <td>7.80</td>
                        <td>
                            <div class="progress" style="height: 6px; width: 100px;">
                                <div class="progress-bar bg-warning" style="width: 74%;"></div>
                            </div>
                            <span class="fs-11 text-muted">74% Ready</span>
                        </td>
                        <td>10 / 12</td>
                        <td><span class="badge bg-warning-subtle text-warning rounded-pill">Review</span></td>
                        <td class="text-end pe-4"><button class="btn btn-sm btn-light border rounded-pill px-2">Profile</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
"""

pages = [
    {
        "filename": "faculty-question-editor.html",
        "title": "Question Editor",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "active text-primary",
        "active_review": "",
        "active_assessments": "",
        "active_builder": "",
        "active_results": "",
        "active_students": "",
        "header_title": "Create & Edit Placement Question",
        "header_badge": "Faculty Authoring",
        "header_sub": "Add coding, MCQ, or debugging questions with testcases and AI assistance.",
        "header_actions": '<a href="faculty-questions.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3">Back to Repository</a>',
        "main_content": editor_content
    },
    {
        "filename": "faculty-question-review.html",
        "title": "AI Question Review",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "",
        "active_review": "active text-primary",
        "active_assessments": "",
        "active_builder": "",
        "active_results": "",
        "active_students": "",
        "header_title": "AI Question Verification Queue",
        "header_badge": "18 Awaiting Review",
        "header_sub": "Review, approve, or refine questions auto-generated by the AI generator.",
        "header_actions": '<a href="faculty-questions.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3">View Approved Bank</a>',
        "main_content": review_content
    },
    {
        "filename": "faculty-assessments.html",
        "title": "Assessments",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "",
        "active_review": "",
        "active_assessments": "active text-primary",
        "active_builder": "",
        "active_results": "",
        "active_students": "",
        "header_title": "Assessment Management",
        "header_badge": "3 Live Tests",
        "header_sub": "Schedule, monitor, and configure mock placement assessments for classes.",
        "header_actions": '<a href="faculty-assessment-builder.html" class="btn btn-sm btn-primary rounded-pill px-3"><i class="bi bi-plus-lg me-1"></i>New Assessment</a>',
        "main_content": assessments_content
    },
    {
        "filename": "faculty-assessment-builder.html",
        "title": "Assessment Builder",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "",
        "active_review": "",
        "active_assessments": "",
        "active_builder": "active text-primary",
        "active_results": "",
        "active_students": "",
        "header_title": "Assessment Builder & Scheduler",
        "header_badge": "Configure Test",
        "header_sub": "Define test duration, proctoring controls, and assign questions to selected batches.",
        "header_actions": '<a href="faculty-assessments.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3">View All Tests</a>',
        "main_content": builder_content
    },
    {
        "filename": "faculty-assessment-results.html",
        "title": "Assessment Results",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "",
        "active_review": "",
        "active_assessments": "",
        "active_builder": "",
        "active_results": "active text-primary",
        "active_students": "",
        "header_title": "Assessment Analytics & Class Results",
        "header_badge": "Batch 2026",
        "header_sub": "Inspect leaderboard, code execution traces, and integrity proctoring flags.",
        "header_actions": '<a href="faculty-assessments.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3">Back to Assessments</a>',
        "main_content": results_content
    },
    {
        "filename": "faculty-students.html",
        "title": "Students Roster",
        "active_dashboard": "",
        "active_questions": "",
        "active_editor": "",
        "active_review": "",
        "active_assessments": "",
        "active_builder": "",
        "active_results": "",
        "active_students": "active text-primary",
        "header_title": "Class Student Roster & Tracking",
        "header_badge": "64 Students",
        "header_sub": "Monitor individual student performance, mock test turnout, and placement readiness.",
        "header_actions": '<button class="btn btn-sm btn-primary rounded-pill px-3"><i class="bi bi-download me-1"></i>Export Roster</button>',
        "main_content": students_content
    }
]

for p in pages:
    content = SHELL_TOP
    for k, v in p.items():
        content = content.replace("{" + k + "}", str(v))
    with open(p["filename"], "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {p['filename']}")


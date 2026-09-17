import os

template_file = r"d:\scet_placement\student\pages\assessments.html"
output_file = r"d:\scet_placement\student\apps\app-test-player.html"

with open(template_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract head and scripts
head = content.split('</head>')[0] + '</head>'
scripts = '<script src="../../assets/js/test-player.js"></script>\n</body>\n</html>'

body = """
<body class="bg-light">
    <!-- Top Navbar -->
    <nav class="navbar navbar-light bg-white border-bottom px-4 py-3 position-sticky top-0 z-3">
        <div class="container-fluid px-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
                <a href="../pages/assessments.html" class="btn btn-light border rounded-circle"><i class="bi bi-x-lg"></i></a>
                <h4 class="mb-0 fw-bold" id="assessmentTitle">Loading Assessment...</h4>
            </div>
            <div class="d-flex align-items-center gap-4">
                <div class="d-flex align-items-center gap-2 text-danger fw-bold fs-5 bg-danger-subtle px-3 py-2 rounded-3">
                    <i class="bi bi-clock-history"></i>
                    <span id="countdownTimer">00:00:00</span>
                </div>
                <button class="btn btn-primary fw-bold px-4 rounded-pill" id="finishTestBtn" onclick="finishTest()">Finish Test</button>
            </div>
        </div>
    </nav>

    <div class="container-fluid px-4 py-4" style="max-width: 1400px;">
        <div class="row g-4">
            
            <!-- Left Sidebar: Question Navigator -->
            <div class="col-12 col-lg-3">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-header bg-white border-bottom px-4 py-3">
                        <h6 class="mb-0 fw-bold">Questions Overview</h6>
                    </div>
                    <div class="card-body p-4" id="questionNavigator">
                        <!-- Navigation buttons injected here -->
                    </div>
                </div>
            </div>

            <!-- Right Side: Active Question Player -->
            <div class="col-12 col-lg-9">
                <div class="card border-0 shadow-sm rounded-4 h-100 min-vh-50">
                    <div class="card-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 fw-bold" id="questionTitle">Loading...</h5>
                        <span class="badge bg-primary rounded-pill px-3 py-2" id="questionMarks">0 Marks</span>
                    </div>
                    
                    <div class="card-body p-4 p-lg-5">
                        <div id="questionContent" class="mb-5 fs-5">
                            <!-- Question text injected here -->
                        </div>
                        
                        <div id="optionsContainer" class="d-flex flex-column gap-3">
                            <!-- Options injected here -->
                        </div>
                    </div>
                    
                    <div class="card-footer bg-white border-top px-4 py-3 d-flex justify-content-between">
                        <button class="btn btn-light border rounded-pill px-4 fw-bold" id="prevBtn" onclick="navigateQuestion(-1)"><i class="bi bi-arrow-left me-2"></i>Previous</button>
                        <button class="btn btn-primary rounded-pill px-4 fw-bold" id="nextBtn" onclick="navigateQuestion(1)">Next<i class="bi bi-arrow-right ms-2"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
"""

full_html = head + body + scripts

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(full_html)
print(f"Created {output_file}")

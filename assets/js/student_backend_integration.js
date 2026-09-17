// student_backend_integration.js
// Handles fetching data from the GraphQL backend and populating the template UI

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('student_token');
    if (!token && !window.location.pathname.includes('auth-signin.html')) {
        // Redirect to login if no token
        window.location.href = '../index.html';
        return;
    }

    // GraphQL query to fetch student dashboard data
    const query = `
        query DashboardData {
            me {
                name
                rollNo
            }
            studentAnalytics(studentId: "student_001") {
                readinessScore
                componentScores {
                    component
                    score
                }
            }
            studentAssessments {
                id
                title
                status
                totalMarks
            }
        }
    `;

    try {
        const res = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const { data, errors } = await res.json();
        
        if (errors) {
            console.error("GraphQL Errors:", errors);
            return;
        }

        if (data) {
            populateDashboard(data);
            populateAssessments(data);
        }

    } catch (err) {
        console.error("Failed to fetch backend data:", err);
    }
});

function populateDashboard(data) {
    // Populate Student Name
    const nameElements = document.querySelectorAll('.user-name, h4.h6'); // Template specific classes
    nameElements.forEach(el => {
        if (el.textContent.includes('Student') || el.textContent.includes('Welcome')) {
            el.textContent = `Welcome back, ${data.me?.name || 'Student'}!`;
        }
    });

    // Replace Revenue/Sales with Readiness Score
    const revenueVal = document.getElementById('revenueValue');
    if (revenueVal && data.studentAnalytics) {
        revenueVal.textContent = data.studentAnalytics.readinessScore + '%';
        revenueVal.parentElement.previousElementSibling.textContent = 'Readiness Score'; // Change the label above it
    }

    const revenueGrowth = document.getElementById('revenueGrowth');
    if (revenueGrowth && data.studentAnalytics) {
        revenueGrowth.textContent = 'Based on recent tests';
    }
    
    // Replace "Sales" with Aptitude Component Score
    const salesTab = document.querySelector('[data-revenue-tab="month"]');
    if (salesTab) salesTab.textContent = 'Aptitude';
    const weekTab = document.querySelector('[data-revenue-tab="week"]');
    if (weekTab) weekTab.textContent = 'Coding';
    
    // Populate "Upcoming Assessments" into the project list or todo list
    const todoList = document.querySelector('.day-nav'); // Todo list container
    if (todoList && data.studentAssessments) {
        const publishedAssessments = data.studentAssessments.filter(a => a.status === 'PUBLISHED');
        // We can dynamically add items to the DOM here if needed
        console.log("Published assessments loaded:", publishedAssessments);
    }
}

function populateAssessments(data) {
    if (window.location.pathname.includes('assessments.html')) {
        const grid = document.getElementById('assessmentsGrid');
        if (grid && data.studentAssessments) {
            grid.innerHTML = '';
            const published = data.studentAssessments.filter(a => a.status === 'PUBLISHED');
            
            if (published.length === 0) {
                grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No upcoming assessments available.</div>';
                return;
            }

            published.forEach((a, i) => {
                const colors = ['primary', 'info', 'success', 'warning'];
                const color = colors[i % colors.length];
                const icons = ['code-square', 'layout-wtf', 'diagram-3', 'lightbulb'];
                const icon = icons[i % icons.length];
                
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-lift">
                        <div class="bg-${color} position-absolute top-0 start-0 w-100" style="height: 4px;"></div>
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="bg-light rounded-3 p-3 d-inline-flex align-items-center justify-content-center text-${color}">
                                    <i class="bi bi-${icon} fs-3"></i>
                                </div>
                                <span class="badge bg-secondary rounded-pill px-3 py-2">Required</span>
                            </div>
                            <h5 class="fw-bold mb-2">${a.title}</h5>
                            <p class="text-secondary small mb-4">${a.description || 'Assessment from placement cell.'}</p>
                            
                            <div class="d-flex gap-3 mb-4 small fw-semibold text-secondary">
                                <div><i class="bi bi-clock me-1"></i> ${a.durationMinutes || 60} Mins</div>
                                <div><i class="bi bi-bar-chart-line me-1"></i> ${a.totalMarks} Marks</div>
                            </div>
                            
                            <button class="btn btn-outline-${color} w-100 rounded-pill py-2 fw-bold" onclick="window.location.href='../apps/app-test-player.html?id=${a.id}'">Start Assessment</button>
                        </div>
                    </div>
                `;
                grid.appendChild(col);
            });
        }
    }
}

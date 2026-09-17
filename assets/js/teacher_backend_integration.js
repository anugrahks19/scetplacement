// teacher_backend_integration.js
// Handles fetching data from the GraphQL backend and populating the Faculty template UI

// Unconditionally set dummy token for dev to override any stale cached tokens immediately
const devHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const devPayload = btoa(JSON.stringify({ id: "teacher_001", role: "TEACHER", organizationId: "org_1" }));
const devSignature = "dummy_signature";
const devToken = `${devHeader}.${devPayload}.${devSignature}`;
localStorage.setItem('authToken', devToken);
console.warn("Development mode: Injected dummy teacher token synchronously");

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    // GraphQL query to fetch dashboard data for Teacher
    const query = `
        query TeacherDashboardData {
            questions {
                id
                title
                status
                type
                difficulty
            }
            assessments {
                id
                title
                status
                totalMarks
            }
            students(organizationId: "org_scet_001") {
                id
                name
                rollNo
                email
                cgpa
                placementReadiness
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
            populateFacultyDashboard(data);
            populateQuestionsTable(data);
            populateAssessmentsTable(data);
            populateStudentsTable(data);
        }

        // Initialize write forms
        setupQuestionEditor();
        setupAssessmentBuilder();

    } catch (err) {
        console.error("Failed to fetch backend data:", err);
    }
});

function populateFacultyDashboard(data) {
    if (!window.location.pathname.includes('faculty-dashboard.html')) return;
    
    const questions = data.questions || [];
    const assessments = data.assessments || [];

    // Dashboard stats
    const totalQuestionsEl = document.querySelector('.card:has(.bi-database) h3');
    if (totalQuestionsEl) totalQuestionsEl.textContent = questions.length;

    const activeTestsEl = document.querySelector('.card:has(.bi-play-circle) h3');
    if (activeTestsEl) {
        const activeCount = assessments.filter(a => a.status === 'PUBLISHED').length;
        activeTestsEl.textContent = activeCount;
    }
    
    const pendingReviewEl = document.querySelector('.card:has(.bi-hourglass-split) h3');
    if (pendingReviewEl) {
        const pendingCount = questions.filter(q => q.status === 'PENDING_REVIEW').length;
        pendingReviewEl.textContent = pendingCount;
    }
}

function populateQuestionsTable(data) {
    if (!window.location.pathname.includes('faculty-questions.html')) return;
    
    const tbody = document.querySelector('tbody');
    if (!tbody || !data.questions) return;
    
    tbody.innerHTML = ''; // clear dummy data
    if (data.questions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No questions found</td></tr>';
        return;
    }

    data.questions.forEach(q => {
        let badgeClass = 'bg-secondary-subtle text-secondary';
        if (q.status === 'PUBLISHED') badgeClass = 'bg-success-subtle text-success';
        if (q.status === 'DRAFT') badgeClass = 'bg-warning-subtle text-warning';
        if (q.status === 'PENDING_REVIEW') badgeClass = 'bg-info-subtle text-info';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar bg-primary-subtle text-primary rounded-3"><i class="bi bi-file-code"></i></div>
                    <div>
                        <h6 class="mb-0 fw-semibold">${q.title}</h6>
                        <span class="fs-12 text-muted">ID: ${q.id}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark border">${q.type}</span></td>
            <td><span class="badge ${q.difficulty === 'EASY' ? 'bg-success-subtle text-success' : q.difficulty === 'HARD' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}">${q.difficulty}</span></td>
            <td><span class="badge ${badgeClass}">${q.status}</span></td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm btn-light border" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                        <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Delete</a></li>
                    </ul>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateAssessmentsTable(data) {
    if (!window.location.pathname.includes('faculty-assessments.html')) return;
    
    const tbody = document.querySelector('tbody');
    if (!tbody || !data.assessments) return;
    
    tbody.innerHTML = ''; // clear dummy data
    if (data.assessments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No assessments found</td></tr>';
        return;
    }

    data.assessments.forEach(a => {
        let badgeClass = 'bg-secondary-subtle text-secondary';
        if (a.status === 'PUBLISHED') badgeClass = 'bg-success-subtle text-success';
        if (a.status === 'DRAFT') badgeClass = 'bg-warning-subtle text-warning';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar bg-primary-subtle text-primary rounded-3"><i class="bi bi-card-checklist"></i></div>
                    <div>
                        <h6 class="mb-0 fw-semibold">${a.title}</h6>
                        <span class="fs-12 text-muted">ID: ${a.id}</span>
                    </div>
                </div>
            </td>
            <td>${a.totalMarks}</td>
            <td><span class="badge ${badgeClass}">${a.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary">Manage</button>
                <button class="btn btn-sm btn-outline-secondary ms-2"><i class="bi bi-graph-up"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateStudentsTable(data) {
    if (!window.location.pathname.includes('faculty-students.html')) return;
    
    const tbody = document.querySelector('tbody');
    if (!tbody || !data.students) return;
    
    tbody.innerHTML = ''; // clear dummy data
    if (data.students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No students found</td></tr>';
        return;
    }

    data.students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="../assets/images/avatar/avatar-1.png" class="rounded-circle" width="40" height="40" alt="${s.name}">
                    <div>
                        <h6 class="mb-0 fw-semibold">${s.name}</h6>
                        <span class="fs-12 text-muted">${s.email}</span>
                    </div>
                </div>
            </td>
            <td>${s.rollNo}</td>
            <td>${s.cgpa}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height: 6px;">
                        <div class="progress-bar ${s.placementReadiness > 70 ? 'bg-success' : 'bg-warning'}" style="width: ${s.placementReadiness}%"></div>
                    </div>
                    <span class="fs-12 fw-bold">${s.placementReadiness}%</span>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-light border">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// -----------------------------------------------------------------------------
// Interactive Write Forms
// -----------------------------------------------------------------------------

function setupQuestionEditor() {
    if (!window.location.pathname.includes('faculty-question-editor.html')) return;

    const btnSave = document.getElementById('btnSaveQuestion');
    if (!btnSave) return;

    btnSave.addEventListener('click', async () => {
        const title = document.getElementById('qTitle').value;
        const type = document.getElementById('qType').value.toUpperCase(); // MCQ, CODING
        const difficulty = document.getElementById('qDiff').value.toUpperCase(); // EASY, MEDIUM, HARD
        const topicId = document.getElementById('qTopic').value; // from select
        const rawContent = document.getElementById('qContent').value;
        
        let contentObj = { text: rawContent };
        let testCases = [];

        if (type === 'MCQ') {
            contentObj.options = [
                document.getElementById('qOptionA').value,
                document.getElementById('qOptionB').value,
                document.getElementById('qOptionC').value,
                document.getElementById('qOptionD').value
            ];
            contentObj.correctIndex = parseInt(document.getElementById('qCorrectOption').value);
        } else if (type === 'CODING') {
            contentObj.starterCode = document.getElementById('qStarterCode').value;
            testCases = [{
                input: document.getElementById('qInput').value || '',
                output: document.getElementById('qOutput').value || '',
                isHidden: false
            }];
        }

        const mutation = `
            mutation CreateQuestion($input: CreateQuestionInput!) {
                createQuestion(input: $input) {
                    id
                    title
                    status
                }
            }
        `;

        const variables = {
            input: {
                categoryId: 'cat_dsa', // default category for now
                topicId: topicId || 'topic_arrays',
                type: type || 'MCQ',
                difficulty: difficulty || 'EASY',
                title: title || 'Untitled Question',
                content: JSON.stringify(contentObj),
                testCases: testCases
            }
        };

        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch('http://localhost:4000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: mutation, variables })
            });
            const { data, errors } = await res.json();
            
            if (errors) {
                alert('Failed to save question: ' + errors[0].message);
            } else if (data && data.createQuestion) {
                alert('Question saved successfully! ID: ' + data.createQuestion.id);
                window.location.href = 'faculty-questions.html';
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to backend.');
        }
    });
}

function setupAssessmentBuilder() {
    if (!window.location.pathname.includes('faculty-assessment-builder.html')) return;

    const publishBtn = document.getElementById('publishBtn');
    if (!publishBtn) return;

    publishBtn.addEventListener('click', async () => {
        let title = document.getElementById('assessmentTitle').value.trim();
        if (title.length > 0 && title.length < 5) {
            alert('Please enter a title that is at least 5 characters long.');
            return;
        }
        if (!title) {
            title = 'Mock Assessment';
        }
        
        const durationStr = document.getElementById('assessmentDuration').value;
        const duration = parseInt(durationStr) || 90;
        
        publishBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Publishing...';
        publishBtn.disabled = true;

        try {
            // 1. Create Assessment
            const createQuery = `
                mutation {
                    createAssessment(input: {
                        title: "${title}",
                        durationMinutes: ${duration},
                        totalMarks: 100,
                        negativeMarkingEnabled: false
                    }) { id }
                }
            `;
            const createData = await graphqlRequest(createQuery);
            const assessmentId = createData.createAssessment.id;

            // 2. Fetch all questions and pick some to add
            const qQuery = `query { questions { id status } }`;
            const qData = await graphqlRequest(qQuery);
            const approvedQuestions = qData.questions.filter(q => q.status === 'APPROVED');

            if (approvedQuestions.length > 0) {
                // Create a section
                const sectionQuery = `mutation { addSectionToAssessment(assessmentId: "${assessmentId}", name: "General Aptitude", order: 1) { id } }`;
                const sectionData = await graphqlRequest(sectionQuery);
                const sectionId = sectionData.addSectionToAssessment.id;

                // Add questions to section
                for (let i = 0; i < Math.min(approvedQuestions.length, 10); i++) {
                    const qId = approvedQuestions[i].id;
                    // First ensure the question is published
                    await graphqlRequest(`mutation { publishQuestion(id: "${qId}") { id } }`);
                    // Then add it to the section
                    const addQQuery = `mutation { addQuestionToSection(sectionId: "${sectionId}", questionId: "${qId}", marks: 10, order: ${i+1}) { id } }`;
                    await graphqlRequest(addQQuery);
                }
            }

            // 3. Publish Assessment
            const publishQuery = `mutation { publishAssessment(id: "${assessmentId}") { id status } }`;
            await graphqlRequest(publishQuery);

            alert(`Successfully published "${title}"! Students can now see it in their portal.`);
            window.location.href = 'faculty-assessments.html';
        } catch (error) {
            alert('Failed to publish assessment: ' + error.message);
            publishBtn.innerHTML = '<i class="bi bi-cloud-upload me-1"></i>Publish Assessment';
            publishBtn.disabled = false;
        }
    });
}

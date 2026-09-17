// test-player.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');
    const token = localStorage.getItem('student_token');
    
    if (!token) {
        alert("Please login first.");
        window.location.href = '../index.html';
        return;
    }
    
    if (!assessmentId) {
        alert("Invalid Assessment ID");
        window.location.href = '../pages/assessments.html';
        return;
    }

    // Step 1: Start the attempt and fetch the assessment details
    const initQuery = `
        mutation StartAttempt($assessmentId: ID!) {
            startAttempt(assessmentId: $assessmentId) {
                id
                status
                startedAt
            }
        }
    `;

    const getAssessmentQuery = `
        query GetAssessment($id: ID!) {
            assessment(id: $id) {
                id
                title
                durationMinutes
                totalMarks
                sections {
                    id
                    name
                    items {
                        id
                        marks
                        question {
                            id
                            title
                            content
                            difficulty
                        }
                    }
                }
            }
        }
    `;

    let attemptId = null;
    let assessmentData = null;
    let allQuestions = [];
    let currentQuestionIndex = 0;
    
    // We will track answers locally { itemId: selectedOptionIndex }
    const answers = {};

    try {
        // Start Attempt
        const startRes = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ query: initQuery, variables: { assessmentId } })
        });
        const startData = await startRes.json();
        
        if (startData.errors) {
            console.error("Failed to start attempt:", startData.errors);
            alert("Could not start test. You may have reached the attempt limit.");
            window.location.href = '../pages/assessments.html';
            return;
        }
        attemptId = startData.data.startAttempt.id;

        // Fetch Assessment Data
        const getRes = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ query: getAssessmentQuery, variables: { id: assessmentId } })
        });
        const getData = await getRes.json();
        assessmentData = getData.data.assessment;

        document.getElementById('assessmentTitle').textContent = assessmentData.title;

        // Flatten sections into a single list of questions for the player
        assessmentData.sections.forEach(sec => {
            sec.items.forEach(item => {
                allQuestions.push(item);
            });
        });

        if (allQuestions.length === 0) {
            alert("No questions found in this assessment.");
            return;
        }

        renderQuestionNavigator(allQuestions);
        loadQuestion(0);
        startTimer(assessmentData.durationMinutes);

    } catch (err) {
        console.error("Error initializing test:", err);
    }

    function renderQuestionNavigator(questions) {
        const nav = document.getElementById('questionNavigator');
        nav.innerHTML = '<div class="d-flex flex-wrap gap-2"></div>';
        const container = nav.firstElementChild;
        
        questions.forEach((q, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-secondary rounded-circle';
            btn.style.width = '45px';
            btn.style.height = '45px';
            btn.textContent = idx + 1;
            btn.id = `nav-btn-${idx}`;
            btn.onclick = () => loadQuestion(idx);
            container.appendChild(btn);
        });
    }

    function loadQuestion(index) {
        // Save current selection if any
        saveCurrentAnswer();

        currentQuestionIndex = index;
        const item = allQuestions[index];
        const contentRaw = item.question.content;
        let contentObj;
        
        try {
            contentObj = typeof contentRaw === 'string' ? JSON.parse(contentRaw) : contentRaw;
        } catch(e) {
            contentObj = { text: "Error parsing question content", options: [] };
        }

        document.getElementById('questionTitle').textContent = `Question ${index + 1}`;
        document.getElementById('questionMarks').textContent = `${item.marks} Marks`;
        document.getElementById('questionContent').innerHTML = `<p>${contentObj.text || item.question.title}</p>`;

        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        if (contentObj.options && Array.isArray(contentObj.options)) {
            contentObj.options.forEach((opt, optIdx) => {
                const checked = answers[item.id] === optIdx ? 'checked' : '';
                optionsContainer.innerHTML += `
                    <label class="d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer hover-bg-light">
                        <input type="radio" name="question_option" value="${optIdx}" class="form-check-input mt-0" ${checked}>
                        <span>${opt}</span>
                    </label>
                `;
            });
        } else {
            // Assume subjective or coding
            optionsContainer.innerHTML = `<textarea class="form-control" rows="6" placeholder="Write your answer here..."></textarea>`;
        }

        // Highlight navigator
        document.querySelectorAll('[id^="nav-btn-"]').forEach(b => b.classList.remove('btn-primary', 'text-white'));
        const activeBtn = document.getElementById(`nav-btn-${index}`);
        if(activeBtn) {
            activeBtn.classList.remove('btn-outline-secondary');
            activeBtn.classList.add('btn-primary', 'text-white');
        }
    }

    function saveCurrentAnswer() {
        const item = allQuestions[currentQuestionIndex];
        if (!item) return;
        const selectedRadio = document.querySelector('input[name="question_option"]:checked');
        if (selectedRadio) {
            answers[item.id] = parseInt(selectedRadio.value);
            // Mark nav button green to show answered
            const btn = document.getElementById(`nav-btn-${currentQuestionIndex}`);
            if (btn) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-success', 'text-white');
            }
        }
    }

    window.navigateQuestion = (direction) => {
        const newIndex = currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < allQuestions.length) {
            loadQuestion(newIndex);
        }
    };

    let timerInterval;
    function startTimer(minutes) {
        let seconds = minutes * 60;
        const display = document.getElementById('countdownTimer');
        
        timerInterval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(timerInterval);
                finishTest(); // Auto submit
            } else {
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = seconds % 60;
                display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    window.finishTest = async () => {
        saveCurrentAnswer();
        clearInterval(timerInterval);
        
        const finishBtn = document.getElementById('finishTestBtn');
        finishBtn.disabled = true;
        finishBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        // Process answers (client-side grading mock for MCQ)
        // In a real app, the backend grades it. Our schema takes `submitAnswer(attemptId, itemId, marksAwarded)`
        
        for (let i = 0; i < allQuestions.length; i++) {
            const item = allQuestions[i];
            const selectedOpt = answers[item.id];
            
            let marksAwarded = 0;
            if (selectedOpt !== undefined) {
                try {
                    const contentObj = JSON.parse(item.question.content);
                    if (contentObj.correctIndex === selectedOpt) {
                        marksAwarded = item.marks; // Correct!
                    }
                } catch(e) {}
            }

            // Submit each answer
            const submitQuery = `
                mutation SubmitAnswer($attemptId: ID!, $itemId: ID!, $marksAwarded: Int!) {
                    submitAnswer(attemptId: $attemptId, itemId: $itemId, marksAwarded: $marksAwarded) {
                        id
                    }
                }
            `;
            await fetch('http://localhost:4000/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ query: submitQuery, variables: { attemptId, itemId: item.id, marksAwarded } })
            });
        }

        // Finish the attempt
        const finishQuery = `
            mutation FinishAttempt($attemptId: ID!) {
                finishAttempt(attemptId: $attemptId) {
                    id
                    status
                    totalScore
                }
            }
        `;
        const res = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ query: finishQuery, variables: { attemptId } })
        });
        
        const resData = await res.json();
        
        alert(`Test Submitted Successfully!`);
        window.location.href = '../pages/assessments.html';
    };
});

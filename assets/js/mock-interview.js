/**
 * Mock Interview Simulator JS
 * Handles State, Web Speech, Camera, and LLM API
 */

(function () {
    'use strict';

    // State Variables
    const STATE = {
        SETUP: 'SETUP',
        READY: 'READY',
        ASKING: 'ASKING',
        LISTENING: 'LISTENING',
        ANALYZING: 'ANALYZING',
        REPORT: 'REPORT'
    };

    let currentState = STATE.SETUP;
    let apiKey = '';
    
    // Interview Context & Memory
    let context = {
        candidateName: '',
        targetRole: '',
        difficulty: '',
        skills: []
    };
    
    let memory = {
        conversation: [], // Array of { role: 'interviewer'|'candidate', content: '...' }
        fillerWordsCount: 0,
        evaluations: []
    };

    const fillerWordsList = ['um', 'uh', 'like', 'actually', 'basically', 'you know'];

    // DOM Elements
    const views = {
        setup: document.getElementById('view-setup'),
        live: document.getElementById('view-live'),
        report: document.getElementById('view-report')
    };
    
    const ui = {
        setupForm: document.getElementById('setup-form'),
        statusBadge: document.getElementById('interview-status-badge'),
        aiAvatarContainer: document.querySelector('.avatar-container'),
        aiStatus: document.getElementById('ai-status'),
        aiTranscript: document.getElementById('ai-transcript'),
        userTranscript: document.getElementById('user-transcript'),
        micIndicator: document.getElementById('mic-indicator'),
        btnEnd: document.getElementById('btn-end-interview'),
        btnPushToTalk: document.getElementById('btn-push-to-talk'),
        video: document.getElementById('candidate-video'),
        btnCamera: document.getElementById('toggle-camera')
    };

    // APIs
    let recognition = null;
    let synth = window.speechSynthesis;
    let currentUtterance = null;
    let videoStream = null;

    // --- INITIALIZATION ---
    async function init() {
        await loadEnv();
        initSpeechRecognition();
        bindEvents();
    }

    async function loadEnv() {
        try {
            const res = await fetch('../.env');
            if (res.ok) {
                const text = await res.text();
                const match = text.match(/HUGGINGFACE_API_KEY=(.+)/);
                if (match) apiKey = match[1].trim();
            }
        } catch (e) {
            console.warn("Could not load .env directly. Please ensure API key is available.");
        }
    }

    function bindEvents() {
        ui.setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            startInterview();
        });

        ui.btnEnd.addEventListener('click', () => {
            endInterview();
        });

        ui.btnPushToTalk.addEventListener('click', () => {
            if (currentState !== STATE.LISTENING) {
                startListening();
            }
        });

        ui.btnCamera.addEventListener('click', toggleCamera);
    }

    // --- CAMERA ---
    async function toggleCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            ui.video.srcObject = null;
            videoStream = null;
            ui.btnCamera.innerHTML = '<i class="bi bi-camera-video-off"></i>';
        } else {
            try {
                videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                ui.video.srcObject = videoStream;
                ui.btnCamera.innerHTML = '<i class="bi bi-camera-video"></i>';
            } catch (err) {
                console.error("Camera error:", err);
                alert("Could not access camera.");
            }
        }
    }

    // --- SPEECH RECOGNITION ---
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Please use Chrome.");
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            ui.micIndicator.classList.add('listening');
            ui.userTranscript.innerText = "Listening...";
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            ui.userTranscript.innerText = finalTranscript || interimTranscript;
            
            // If the user stops talking for a bit, we process it.
            // A simple implementation: we wait for continuous recognition to pause, but since continuous=true, we handle end.
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            ui.micIndicator.classList.remove('listening');
        };

        recognition.onend = () => {
            ui.micIndicator.classList.remove('listening');
            if (currentState === STATE.LISTENING) {
                const answer = ui.userTranscript.innerText;
                if (answer && answer !== "Listening...") {
                    processAnswer(answer);
                } else {
                    // Restart listening if they didn't say anything
                    startListening();
                }
            }
        };
    }

    // --- CORE INTERVIEW LOOP ---
    async function startInterview() {
        if (!apiKey) {
            alert("No Hugging Face API Key found in .env. Please configure it.");
            return;
        }

        // Gather Setup Data
        context.candidateName = document.getElementById('candidateName').value;
        context.targetRole = document.getElementById('targetRole').value;
        context.difficulty = document.getElementById('difficulty').value;
        context.skills = document.getElementById('skills').value.split(',').map(s => s.trim());

        // Switch View
        switchView('live');
        setState(STATE.READY);

        // Turn on camera automatically
        await toggleCamera();

        // Start Initial Greeting
        setTimeout(() => {
            generateNextQuestion(true);
        }, 1500);
    }

    function switchView(viewName) {
        views.setup.classList.add('d-none');
        views.live.classList.add('d-none');
        views.report.classList.add('d-none');
        views.setup.classList.remove('active');
        views.live.classList.remove('active');
        views.report.classList.remove('active');
        
        views[viewName].classList.remove('d-none');
        setTimeout(() => views[viewName].classList.add('active'), 50);
    }

    function setState(newState) {
        currentState = newState;
        ui.statusBadge.innerText = newState;
        
        if (newState === STATE.ANALYZING) {
            ui.aiStatus.innerText = "Thinking...";
            ui.aiTranscript.innerText = "...";
            ui.userTranscript.innerText = "";
        } else if (newState === STATE.ASKING) {
            ui.aiStatus.innerText = "Speaking...";
        } else if (newState === STATE.LISTENING) {
            ui.aiStatus.innerText = "Listening to you...";
        }
    }

    async function generateNextQuestion(isInitial = false) {
        setState(STATE.ANALYZING);

        const systemPrompt = `You are a strict, professional technical interviewer conducting a mock interview.
Role: ${context.targetRole}
Difficulty: ${context.difficulty}
Candidate: ${context.candidateName}
Skills: ${context.skills.join(', ')}

Rules:
1. Act naturally like a human interviewer. Start with a greeting if this is the first message.
2. Ask only ONE question at a time. Do not provide a list.
3. If the user previously answered, evaluate their answer silently and adapt your next question based on it. Ask follow-ups if they lack depth.
4. Do not praise every answer. Use phrases like "I see", "Moving on", or "Can you elaborate?".
5. Keep your spoken response brief (max 3 sentences).
6. Output raw JSON format exactly like this:
{
  "spoken_response": "Your question or feedback here",
  "internal_evaluation": "Your secret evaluation of their previous answer (if any)",
  "score_estimate": 0-100 (rate the previous answer, 0 if first question)
}`;

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        // Add history
        memory.conversation.forEach(msg => messages.push(msg));

        if (isInitial) {
            messages.push({ role: "user", content: "The interview has started. Give your opening greeting and first question." });
        }

        try {
            const modelId = "deepseek-ai/DeepSeek-V4.1-Flash";
            const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}/v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 250,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error("API Response Error");
            }

            const data = await response.json();
            let aiText = data.choices[0].message.content;
            
            // Try to parse JSON from AI
            let parsed = null;
            try {
                // Strip markdown backticks if any
                aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                parsed = JSON.parse(aiText);
            } catch (e) {
                console.warn("AI didn't return pure JSON, falling back.", aiText);
                parsed = { spoken_response: aiText };
            }

            const spoken = parsed.spoken_response;
            if (parsed.score_estimate > 0) {
                memory.evaluations.push(parsed.score_estimate);
            }

            memory.conversation.push({ role: "assistant", content: spoken });
            speakText(spoken);

        } catch (error) {
            console.error("LLM Error:", error);
            // Fallback generic error question
            speakText("I seem to be having network issues. Let's continue. Can you elaborate on your experience?");
        }
    }

    function speakText(text) {
        setState(STATE.ASKING);
        ui.aiTranscript.innerText = text;
        ui.aiAvatarContainer.classList.add('speaking');

        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Find a decent voice
        const voices = synth.getVoices();
        const prefVoice = voices.find(v => v.name.includes('Google UK English Male') || v.lang === 'en-US');
        if (prefVoice) currentUtterance.voice = prefVoice;

        currentUtterance.onend = () => {
            ui.aiAvatarContainer.classList.remove('speaking');
            setTimeout(startListening, 500); // Wait a half sec before listening
        };

        synth.speak(currentUtterance);
    }

    function startListening() {
        setState(STATE.LISTENING);
        ui.userTranscript.innerText = "Listening...";
        try {
            recognition.start();
        } catch(e) {
            // Already started
        }
    }

    function processAnswer(answerText) {
        // Stop recognition to process
        try { recognition.stop(); } catch(e) {}
        
        // Analyze filler words
        const words = answerText.toLowerCase().split(/\s+/);
        words.forEach(w => {
            if (fillerWordsList.includes(w)) memory.fillerWordsCount++;
        });

        memory.conversation.push({ role: "user", content: answerText });
        
        // Generate next question
        generateNextQuestion(false);
    }

    function endInterview() {
        // Stop everything
        try { recognition.stop(); } catch(e) {}
        synth.cancel();
        if (videoStream) {
            videoStream.getTracks().forEach(t => t.stop());
        }

        setState(STATE.REPORT);
        switchView('report');
        generateReport();
    }

    function generateReport() {
        // Simple aggregate report generation
        // In a full implementation, you'd make one final LLM call asking for a summary JSON.
        // For this demo, we'll calculate based on the internal memory evaluations.
        
        const avgScore = memory.evaluations.length > 0 
            ? Math.round(memory.evaluations.reduce((a,b) => a+b, 0) / memory.evaluations.length)
            : 75; // Default if ended early
            
        document.getElementById('report-score').innerText = avgScore;
        
        document.getElementById('score-comm').innerText = `${avgScore + 2}%`;
        document.getElementById('bar-comm').style.width = `${avgScore + 2}%`;
        
        document.getElementById('score-tech').innerText = `${avgScore - 5}%`;
        document.getElementById('bar-tech').style.width = `${avgScore - 5}%`;
        
        document.getElementById('score-prob').innerText = `${avgScore + 5}%`;
        document.getElementById('bar-prob').style.width = `${avgScore + 5}%`;

        document.getElementById('report-filler-count').innerText = memory.fillerWordsCount;
        if (memory.fillerWordsCount > 5) {
            document.getElementById('report-filler-details').innerText = "You used filler words quite often. Try to replace 'um' and 'like' with short silent pauses to sound more confident.";
        } else {
            document.getElementById('report-filler-details').innerText = "Great job! You had very few filler words, making your speech sound clear and professional.";
        }

        // Strengths & Weaknesses (Mocked based on score for now, ideally LLM generated)
        document.getElementById('report-strengths').innerHTML = `
            <li>Maintained good conversational flow</li>
            <li>Addressed the core topic of the questions</li>
        `;
        document.getElementById('report-weaknesses').innerHTML = `
            <li>Some answers could use deeper technical examples</li>
            <li>Remember to structure answers using the STAR method</li>
        `;
    }

    // Run on load
    document.addEventListener('DOMContentLoaded', init);

})();

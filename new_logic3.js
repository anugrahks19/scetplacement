const delay = (ms) => new Promise(res => setTimeout(res, ms));

const YOUR_HUGGINGFACE_TOKEN_HERE = "YOUR_HUGGINGFACE_TOKEN_HERE";

const InterviewState = {
    SETUP: "setup",
    READY: "ready",
    ASKING: "asking",
    LISTENING: "listening",
    ANALYZING: "analyzing",
    COMPLETED: "completed"
};

let currentState = InterviewState.SETUP;
let conversationHistory = [];
let fillerWordsCount = 0;
let interviewTimer = null;
let endTime = null;

// Proctoring State
let proctoringEvents = [];
let tabLossCount = 0;
let totalTabLosses = 0;
let isTabLost = false;

let recognition = null;
let synth = window.speechSynthesis;
let aiVoice = null;
let candidateVideo = null;
let faceLandmarker = null;

const fillerRegex = /\b(um|uh|like|basically|actually|you know)\b/gi;

// MediaPipe Initialization
async function initVisionModel() {
    try {
        const vision = await import("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.3");
        const FilesetResolver = vision.FilesetResolver;
        const FaceLandmarker = vision.FaceLandmarker;
        
        const visionWasm = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(visionWasm, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU"
            },
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            numFaces: 1
        });
        
        let loadingEl = document.getElementById('visionLoading');
        if(loadingEl) loadingEl.classList.add('d-none');
    } catch(e) {
        console.error("Vision Model Failed", e);
        let loadingEl = document.getElementById('visionLoading');
        if(loadingEl) loadingEl.innerHTML = "<span class='small fw-bold text-danger'>Vision API Failed</span>";
    }
}

let lastVideoTime = -1;
let visionCanvas = null;
let visionCtx = null;

function renderLoop() {
    if (currentState === InterviewState.COMPLETED) return;
    
    if (candidateVideo && candidateVideo.readyState >= 2 && faceLandmarker) {
        if (!visionCanvas) {
            visionCanvas = document.getElementById('visionCanvas');
            visionCanvas.width = candidateVideo.videoWidth;
            visionCanvas.height = candidateVideo.videoHeight;
            visionCtx = visionCanvas.getContext('2d');
        }
        
        let startTimeMs = performance.now();
        if (lastVideoTime !== candidateVideo.currentTime) {
            lastVideoTime = candidateVideo.currentTime;
            
            const results = faceLandmarker.detectForVideo(candidateVideo, startTimeMs);
            
            visionCtx.clearRect(0, 0, visionCanvas.width, visionCanvas.height);
            
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                const landmarks = results.faceLandmarks[0];
                const leftEye = landmarks[468];
                const rightEye = landmarks[473];
                
                visionCtx.fillStyle = '#00ff00';
                visionCtx.shadowColor = '#00ff00';
                visionCtx.shadowBlur = 10;
                
                if (leftEye) {
                    visionCtx.beginPath();
                    visionCtx.arc(leftEye.x * visionCanvas.width, leftEye.y * visionCanvas.height, 4, 0, 2 * Math.PI);
                    visionCtx.fill();
                }
                if (rightEye) {
                    visionCtx.beginPath();
                    visionCtx.arc(rightEye.x * visionCanvas.width, rightEye.y * visionCanvas.height, 4, 0, 2 * Math.PI);
                    visionCtx.fill();
                }
            } else {
                // If face lost, draw red border
                visionCtx.strokeStyle = 'red';
                visionCtx.lineWidth = 5;
                visionCtx.strokeRect(0, 0, visionCanvas.width, visionCanvas.height);
            }
        }
    }
    requestAnimationFrame(renderLoop);
}

// Proctoring Listeners
function logProctoringEvent(type, severity, msg) {
    if (currentState === InterviewState.SETUP || currentState === InterviewState.COMPLETED) return;
    
    let timeString = new Date().toLocaleTimeString([], { hour12: false });
    proctoringEvents.push({ type, time: timeString, severity, msg });
    
    let bubble = document.createElement('div');
    bubble.className = 'chat-bubble mx-auto border border-danger text-danger mt-2 mb-2 w-75 text-center fw-bold';
    bubble.style.background = '#fff5f5';
    bubble.style.fontSize = '0.85rem';
    
    let strikesLeft = 3 - totalTabLosses;
    bubble.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>PROCTORING: ${msg} (${strikesLeft} strikes left)`;
    
    document.getElementById('transcriptArea').appendChild(bubble);
    scrollToBottom();
}

function handleViolation(type, msg) {
    isTabLost = true;
    totalTabLosses++;
    tabLossCount++;
    logProctoringEvent(type, "HIGH", msg);
    
    if (totalTabLosses >= 3) {
        endInterview("INTERVIEW TERMINATED due to repeated proctoring violations (3 Strikes).", true);
    }
}

window.addEventListener('blur', () => {
    if (!isTabLost && currentState !== InterviewState.SETUP && currentState !== InterviewState.COMPLETED) {
        handleViolation("TAB_SWITCH", "Interview window lost focus.");
    }
});
window.addEventListener('focus', () => { isTabLost = false; });
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isTabLost && currentState !== InterviewState.SETUP && currentState !== InterviewState.COMPLETED) {
        handleViolation("TAB_SWITCH", "Interview window hidden.");
    }
});

function loadVoices() {
    let voices = synth.getVoices();
    aiVoice = voices.find(v => v.name.includes('Google US English')) || 
              voices.find(v => v.lang === 'en-US') || 
              voices[0];
}
synth.onvoiceschanged = loadVoices;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = async (event) => {
        if(currentState !== InterviewState.LISTENING) return;
        const transcript = event.results[0][0].transcript;
        
        const fillers = transcript.match(fillerRegex);
        if(fillers) fillerWordsCount += fillers.length;

        document.getElementById('btnDoneSpeaking').classList.add('d-none');
        addChatMessage(transcript, false);
        await generateFollowUp(transcript);
    };
    
    recognition.onerror = (event) => {
        if(currentState !== InterviewState.LISTENING) return;
        console.error("Speech Recognition Error:", event.error);
        setCoreState('thinking', "I didn't catch that. Could you repeat?");
        setTimeout(() => startRecording(), 2000);
    };
}

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        candidateVideo = document.getElementById('candidateVideo');
        if(candidateVideo) {
            candidateVideo.srcObject = stream;
            candidateVideo.play();
            requestAnimationFrame(renderLoop);
        }
    } catch (err) {
        console.warn("Camera access denied or unavailable.");
    }
}

function getSystemPrompt() {
    const role = document.getElementById('setupRole').value;
    const diff = document.getElementById('setupDifficulty').value;
    
    let proctoringContext = "";
    if (tabLossCount > 0) {
        proctoringContext = `\n\n[CRITICAL PROCTORING ALERT]: The candidate switched tabs or lost window focus ${tabLossCount} times recently. (Total strikes: ${totalTabLosses}/3). In your next response, start by professionally warning them that you noticed they left the interview window and that repeated violations will result in termination. Then proceed with your next question.`;
        tabLossCount = 0; 
    }

    return `You are a strict, professional technical recruiter conducting a realistic mock interview for a ${diff}-level ${role} position.
Rules:
1. Ask exactly ONE question at a time.
2. NEVER give the answer or explain concepts. Do not act like a tutor.
3. Base follow-up questions on the candidate's previous response to test depth.
4. Do NOT praise every answer. If an answer is weak, challenge it. If strong, acknowledge and move on.
5. Use a conversational, authoritative tone. Keep responses under 3 sentences.
6. Do not use markdown, asterisks, or bullet points.${proctoringContext}`;
}

async function startInterviewSession() {
    if (!recognition) {
        alert("Your browser does not support the Web Speech API. Please use Chrome/Edge.");
        return;
    }
    
    loadVoices();
    initVisionModel(); // Start async model load
    await initCamera();
    
    document.getElementById('setupView').classList.add('d-none');
    document.getElementById('interviewView').classList.remove('d-none');
    document.getElementById('interviewView').classList.add('d-flex');
    
    currentState = InterviewState.READY;
    conversationHistory = [];
    fillerWordsCount = 0;
    proctoringEvents = [];
    tabLossCount = 0;
    totalTabLosses = 0;
    document.getElementById('transcriptArea').innerHTML = ''; 
    
    const durationMins = parseInt(document.getElementById('setupDuration').value) || 5;
    endTime = Date.now() + (durationMins * 60 * 1000);
    
    setCoreState('thinking', 'Initializing Interview Engine...');
    await delay(1000);
    
    let initialGreeting = `Good day. Let's begin the interview for the ${document.getElementById('setupRole').value} position. Could you start by briefly introducing yourself and your background?`;
    conversationHistory.push({ role: 'assistant', content: initialGreeting });
    speakNative(initialGreeting);
}

function setCoreState(state, statusText) {
    document.getElementById('aiCore').className = 'clean-core ' + state;
    document.getElementById('interviewStatus').innerText = statusText;
    
    const icon = document.getElementById('aiIcon');
    if(state === 'listening') {
        icon.className = 'bi bi-mic-fill text-white fs-1';
    } else if(state === 'speaking') {
        icon.className = 'bi bi-soundwave text-white fs-1';
    } else {
        icon.className = 'bi bi-cpu text-white fs-1';
    }
}

function startRecording() {
    if (currentState === InterviewState.COMPLETED) return;
    
    if (Date.now() > endTime) {
        endInterview();
        return;
    }
    
    currentState = InterviewState.LISTENING;
    setCoreState('listening', 'Listening... (Speak your answer)');
    document.getElementById('btnDoneSpeaking').classList.remove('d-none');
    
    try {
        recognition.start();
    } catch(e) {}
}

async function generateFollowUp(userResponse) {
    currentState = InterviewState.ANALYZING;
    setCoreState('thinking', 'Analyzing response...');
    conversationHistory.push({ role: 'user', content: userResponse });

    await delay(1200);

    try {
        let messages = [
            { role: 'system', content: getSystemPrompt() },
            ...conversationHistory
        ];

        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + YOUR_HUGGINGFACE_TOKEN_HERE },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V4.1-Flash",
                messages: messages
            })
        });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message);

        let aiText = data.choices[0].message.content.replace(/[*#_]/g, ''); 
        conversationHistory.push({ role: 'assistant', content: aiText });
        
        await delay(500);
        speakNative(aiText);

    } catch (error) {
        console.error("AI Error:", error);
        setCoreState('thinking', 'Network Error.');
        endInterview("I encountered an error connecting to the AI.");
    }
}

function speakNative(text) {
    if (currentState === InterviewState.COMPLETED) return;
    currentState = InterviewState.ASKING;
    
    addChatMessage(text, true);
    setCoreState('speaking', 'Interviewer is speaking...');
    
    synth.cancel();
    let utterance = new SpeechSynthesisUtterance(text);
    if(aiVoice) utterance.voice = aiVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
        if (currentState !== InterviewState.COMPLETED) startRecording();
    };
    
    synth.speak(utterance);
}

function addChatMessage(text, isAI) {
    let bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (isAI ? 'chat-ai' : 'chat-user');
    let iconHtml = isAI ? '<i class="bi bi-robot me-2 opacity-75"></i>' : '<i class="bi bi-person me-2 opacity-75"></i>';
    bubble.innerHTML = iconHtml + text;
    document.getElementById('transcriptArea').appendChild(bubble);
    scrollToBottom();
}

function scrollToBottom() {
    let area = document.getElementById('transcriptArea');
    area.scrollTop = area.scrollHeight;
}

async function endInterview(finalMessage = null, isForceTerminated = false) {
    currentState = InterviewState.COMPLETED;
    synth.cancel();
    if(recognition) try { recognition.stop(); } catch(e) {}
    if(candidateVideo && candidateVideo.srcObject) {
        candidateVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    
    document.getElementById('interviewView').classList.remove('d-flex');
    document.getElementById('interviewView').classList.add('d-none');
    document.getElementById('reportView').classList.remove('d-none');
    
    document.getElementById('fillerCount').innerText = fillerWordsCount;
    
    const proctoringList = document.getElementById('proctoringList');
    proctoringList.innerHTML = '';
    if(proctoringEvents.length === 0) {
        proctoringList.innerHTML = '<li class="text-success"><i class="bi bi-check-circle-fill me-2"></i>No proctoring violations detected.</li>';
    } else {
        proctoringEvents.forEach(ev => {
            proctoringList.innerHTML += `<li class="text-danger small mb-1"><i class="bi bi-x-circle-fill me-2"></i>[${ev.time}] ${ev.msg}</li>`;
        });
    }

    if (isForceTerminated) {
        document.getElementById('reportTitle').innerHTML = '<span class="text-danger">Interview Terminated</span>';
        document.getElementById('reportScore').innerText = "0 / 100";
        document.getElementById('reportScore').className = "display-3 fw-bold text-danger mb-4";
        document.getElementById('reportAnalysis').innerHTML = `<strong class='text-danger'>Proctoring Failure:</strong> ${finalMessage}`;
        return; 
    }

    document.getElementById('reportAnalysis').innerText = "Generating AI Performance Report...";

    try {
        let transcriptString = conversationHistory.map(m => m.role + ": " + m.content).join("\n");
        let reportPrompt = "Analyze this interview transcript and provide a 3-sentence summary of the candidate's performance, strengths, and weaknesses. Do not use markdown. Then on a new line, provide an overall score from 0 to 100 in this exact format: SCORE: 85 \n\nTranscript:\n" + transcriptString;
        
        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + YOUR_HUGGINGFACE_TOKEN_HERE },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V4.1-Flash",
                messages: [{ role: 'user', content: reportPrompt }]
            })
        });
        const data = await response.json();
        let reportText = data.choices[0].message.content;
        
        let scoreMatch = reportText.match(/SCORE:\s*(\d+)/i);
        let score = scoreMatch ? scoreMatch[1] : "--";
        let analysis = reportText.replace(/SCORE:\s*\d+/i, '').trim();
        
        document.getElementById('reportScore').innerText = score + " / 100";
        document.getElementById('reportAnalysis').innerText = analysis;
    } catch (e) {
        document.getElementById('reportAnalysis').innerText = "Failed to generate report due to network error.";
    }
}


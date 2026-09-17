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

let recognition = null;
let synth = window.speechSynthesis;
let aiVoice = null;
let candidateVideo = null;

const fillerRegex = /\b(um|uh|like|basically|actually|you know)\b/gi;

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
        
        // Count filler words
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
        if(candidateVideo) candidateVideo.srcObject = stream;
    } catch (err) {
        console.warn("Camera access denied or unavailable.");
    }
}

function getSystemPrompt() {
    const role = document.getElementById('setupRole').value;
    const diff = document.getElementById('setupDifficulty').value;
    return `You are a strict, professional technical recruiter conducting a realistic mock interview for a ${diff}-level ${role} position.
Rules:
1. Ask exactly ONE question at a time.
2. NEVER give the answer or explain concepts. Do not act like a tutor.
3. Base follow-up questions on the candidate's previous response to test depth.
4. Do NOT praise every answer. If an answer is weak, challenge it or ask for a specific example. If strong, simply acknowledge and move on.
5. Use a conversational, authoritative tone. Keep responses under 3 sentences.
6. Do not use markdown, asterisks, or bullet points.`;
}

async function startInterviewSession() {
    if (!recognition) {
        alert("Your browser does not support the Web Speech API. Please use Chrome/Edge.");
        return;
    }
    
    loadVoices();
    await initCamera();
    
    document.getElementById('setupView').classList.add('d-none');
    document.getElementById('interviewView').classList.remove('d-none');
    document.getElementById('interviewView').classList.add('d-flex');
    
    currentState = InterviewState.READY;
    conversationHistory = [];
    fillerWordsCount = 0;
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

    // Simulate natural interviewer processing time
    await delay(1200);

    try {
        let messages = [
            { role: 'system', content: getSystemPrompt() },
            ...conversationHistory
        ];

        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + YOUR_HUGGINGFACE_TOKEN_HERE
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V4.1-Flash",
                messages: messages
            })
        });

        const data = await response.json();
        if(data.error) throw new Error(data.error.message);

        let aiText = data.choices[0].message.content.replace(/[*#_]/g, ''); 
        conversationHistory.push({ role: 'assistant', content: aiText });
        
        // Natural pre-speech delay
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

async function endInterview(finalMessage = null) {
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
    document.getElementById('reportAnalysis').innerText = "Generating AI Performance Report...";
    
    // Generate Report
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


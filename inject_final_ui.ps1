$filePath = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$html = Get-Content -Raw -Encoding utf8 $filePath
$html = $html -replace "(?i)</body>\s*</html>", ""

$injection = @"

<!-- AI Interview Modal -->
<div class="modal fade" id="aiInterviewModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen m-0">
        <div class="modal-content border-0" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px);">
            
            <!-- Header -->
            <div class="modal-header border-0 px-5 pt-4 pb-0 z-3 position-relative">
                <div class="d-flex align-items-center gap-3">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-3 bg-white shadow-sm p-3 border">
                        <i class="bi bi-mortarboard-fill text-primary fs-3"></i>
                    </div>
                    <div>
                        <h4 class="modal-title fw-bold text-dark mb-0" style="letter-spacing: -0.5px;">SCET Interview Portal</h4>
                        <div class="badge bg-light text-secondary border rounded-pill fw-normal mt-1 px-3">Powered by Nemotron 3 Ultra</div>
                    </div>
                </div>
                <button type="button" class="btn-close rounded-circle p-3 bg-white shadow-sm border" data-bs-dismiss="modal" aria-label="Close" onclick="endInterview()"></button>
            </div>

            <div class="modal-body d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden p-0 z-2">
                
                <!-- Clean Pulse Visualizer -->
                <div class="clean-core-container mb-4 d-flex align-items-center justify-content-center">
                    <div id="aiCore" class="clean-core idle">
                        <div class="clean-orb">
                            <i id="aiIcon" class="bi bi-mic-fill text-white fs-1"></i>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <h4 id="interviewStatus" class="fw-medium text-dark mb-4" style="letter-spacing: -0.5px;">System Ready</h4>

                <!-- Transcript Panel -->
                <div class="transcript-panel bg-white shadow-sm border rounded-4 w-100 p-4 mb-4 mx-auto" style="max-width: 750px; height: 380px;">
                    <div id="transcriptArea" class="d-flex flex-column gap-3 h-100 overflow-auto pe-2 custom-scrollbar">
                        <div class="text-center w-100 mt-auto mb-auto text-secondary small">Start session to begin. Ensure your microphone is allowed.</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="d-flex gap-3 position-relative z-3 mt-2">
                    <button id="btnStartSession" class="btn btn-primary rounded-pill px-5 py-3 shadow-sm fw-bold fs-5" onclick="startInterviewSession()">
                        <i class="bi bi-play-fill me-2"></i> Initialize Session
                    </button>
                    <button id="btnDoneSpeaking" class="btn btn-dark rounded-pill px-5 py-3 shadow-sm fw-bold fs-5 d-none" onclick="recognition.stop()">
                        <i class="bi bi-check-lg me-2"></i> Finalize Answer
                    </button>
                    <button id="btnEndSession" class="btn btn-outline-danger rounded-pill px-5 py-3 shadow-sm fw-bold fs-5 d-none" onclick="endInterview()">
                        <i class="bi bi-stop-fill me-2"></i> Terminate Session
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .clean-core-container {
        position: relative;
        width: 120px;
        height: 120px;
    }
    .clean-core {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s ease;
    }
    .clean-orb {
        width: 90px;
        height: 90px;
        background: linear-gradient(135deg, #0d6efd, #0dcaf0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(13, 110, 253, 0.3);
        z-index: 10;
        transition: all 0.3s ease;
    }
    
    .clean-core.idle .clean-orb {
        background: linear-gradient(135deg, #6c757d, #adb5bd);
        box-shadow: 0 10px 30px rgba(108, 117, 125, 0.2);
    }
    .clean-core.listening .clean-orb {
        background: linear-gradient(135deg, #198754, #20c997);
        box-shadow: 0 10px 30px rgba(25, 135, 84, 0.4);
        animation: cleanPulse 2s infinite;
    }
    .clean-core.thinking .clean-orb {
        background: linear-gradient(135deg, #0dcaf0, #0d6efd);
        box-shadow: 0 10px 30px rgba(13, 202, 240, 0.4);
        animation: spinSlow 3s linear infinite;
    }
    .clean-core.speaking .clean-orb {
        background: linear-gradient(135deg, #fd7e14, #ffc107);
        box-shadow: 0 10px 30px rgba(253, 126, 20, 0.4);
        animation: bounceSmall 0.5s alternate infinite ease-in-out;
    }

    @keyframes cleanPulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(25, 135, 84, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
    }
    @keyframes spinSlow {
        100% { transform: rotate(360deg); }
    }
    @keyframes bounceSmall {
        0% { transform: scale(0.95); }
        100% { transform: scale(1.05); }
    }

    .transcript-panel {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .chat-bubble {
        max-width: 85%;
        padding: 1rem 1.25rem;
        border-radius: 1rem;
        font-size: 0.95rem;
        line-height: 1.6;
        animation: slideIn 0.3s ease forwards;
        box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .chat-user {
        align-self: flex-end;
        background: #f8f9fa;
        color: #212529;
        border: 1px solid #e9ecef;
        border-bottom-right-radius: 4px;
    }
    .chat-ai {
        align-self: flex-start;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        color: #166534;
        border: 1px solid #bbf7d0;
        border-bottom-left-radius: 4px;
    }
</style>

<script>
    const NEMOTRON_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    
    let isInterviewActive = false;
    let conversationHistory = [];
    const SYSTEM_PROMPT = "You are an expert technical interviewer evaluating a software engineering candidate. Maintain a professional, encouraging tone. Keep your responses concise (strictly 1 or 2 short sentences). Ask exactly ONE technical or behavioral question at a time. Listen to the candidate's answer, briefly acknowledge it, and then proceed to the next relevant question. Do not use markdown, asterisks, or lists in your text. Speak naturally.";

    let recognition = null;
    let synth = window.speechSynthesis;
    let aiVoice = null;
    
    function loadVoices() {
        let voices = synth.getVoices();
        // Try to find a good English voice
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
            if(!isInterviewActive) return;
            const transcript = event.results[0][0].transcript;
            document.getElementById('btnDoneSpeaking').classList.add('d-none');
            addChatMessage(transcript, false);
            await generateFollowUp(transcript);
        };
        
        recognition.onerror = (event) => {
            if(!isInterviewActive) return;
            console.error("Speech Recognition Error:", event.error);
            setCoreState('thinking', "I didn't catch that. Could you repeat?");
            setTimeout(() => startRecording(), 2000);
        };
    }

    async function startInterviewSession() {
        if (!recognition) {
            alert("Your browser does not support the Web Speech API. Please use Google Chrome or Edge.");
            return;
        }
        
        loadVoices(); // Ensure voice is loaded before speaking
        isInterviewActive = true;
        conversationHistory = [];
        document.getElementById('transcriptArea').innerHTML = ''; 
        document.getElementById('btnStartSession').classList.add('d-none');
        document.getElementById('btnEndSession').classList.remove('d-none');
        
        setCoreState('thinking', 'Initializing SCET Portal...');
        
        let initialGreeting = "Hello! I am your AI interviewer powered by Nemotron 3 Ultra. I'm excited to speak with you today. To get started, could you walk me through a recent technical project you are proud of?";
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
        if (!isInterviewActive) return;
        setCoreState('listening', 'Listening... (Speak your answer)');
        
        try {
            recognition.start();
        } catch(e) {}
    }

    async function generateFollowUp(userResponse) {
        setCoreState('thinking', 'Synthesizing response...');
        conversationHistory.push({ role: 'user', content: userResponse });

        try {
            let messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory
            ];

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + NEMOTRON_API_KEY
                },
                body: JSON.stringify({
                    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
                    messages: messages
                })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);

            let aiText = data.choices[0].message.content;
            aiText = aiText.replace(/[*#_]/g, ''); 

            conversationHistory.push({ role: 'assistant', content: aiText });
            speakNative(aiText);

        } catch (error) {
            console.error("Nemotron Error:", error);
            setCoreState('thinking', 'Network Error.');
            endInterview("I encountered an error connecting to the AI.");
        }
    }

    function speakNative(text) {
        if (!isInterviewActive) return;
        
        addChatMessage(text, true);
        setCoreState('speaking', 'AI is speaking...');
        
        synth.cancel(); // Cancel any ongoing speech
        let utterance = new SpeechSynthesisUtterance(text);
        if(aiVoice) utterance.voice = aiVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
            if (isInterviewActive) startRecording();
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

    function endInterview(finalMessage = null) {
        isInterviewActive = false;
        synth.cancel();
        if(recognition) {
            try { recognition.stop(); } catch(e) {}
        }
        
        setCoreState('idle', 'Session Terminated.');
        document.getElementById('btnStartSession').classList.remove('d-none');
        document.getElementById('btnEndSession').classList.add('d-none');
        document.getElementById('btnDoneSpeaking').classList.add('d-none');
        
        if (finalMessage) {
            addChatMessage(finalMessage, true);
        }
    }
</script>

<!-- Open Modal on Page Load for Testing/Demo -->
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Change the original 'Mock Interview' buttons to trigger our modal
        let mockBtns = document.querySelectorAll('a[href="interview-prep.html"]');
        mockBtns.forEach(btn => {
            btn.href = "#";
            btn.setAttribute('data-bs-toggle', 'modal');
            btn.setAttribute('data-bs-target', '#aiInterviewModal');
        });
        
        // Auto open the modal for the user to test right away
        let myModal = new bootstrap.Modal(document.getElementById('aiInterviewModal'));
        myModal.show();
    });
</script>

</body>
</html>
"@

Set-Content c:\Antigravity\scet_placement\pages\interview-prep.html ($html + $injection) -Encoding utf8


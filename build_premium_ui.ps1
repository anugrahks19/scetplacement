$filePath = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$lines = Get-Content -Encoding utf8 $filePath
$beginIdx = -1

for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "<!-- AI Interview Modal -->") { 
        $beginIdx = $i; 
        break 
    }
}

if ($beginIdx -ne -1) {
    $newContent = @"
<!-- AI Interview Modal -->
<div class="modal fade" id="aiInterviewModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen m-0">
        <div class="modal-content border-0" style="background: rgba(10, 10, 15, 0.75); backdrop-filter: blur(25px) saturate(150%);">
            
            <!-- Header -->
            <div class="modal-header border-0 px-5 pt-4 pb-0 z-3 position-relative">
                <div class="d-flex align-items-center gap-3">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-gradient p-2">
                        <i class="bi bi-robot text-white fs-4"></i>
                    </div>
                    <div>
                        <h4 class="modal-title fw-bold text-white mb-0" style="letter-spacing: 0.5px;">Nexus Interviewer</h4>
                        <div class="badge border border-secondary text-secondary rounded-pill fw-normal mt-1" style="background: rgba(255,255,255,0.05)">Powered by Nemotron 3 Ultra & Deepgram</div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white rounded-circle p-3" style="background-color: rgba(255,255,255,0.1); backdrop-filter: blur(5px);" data-bs-dismiss="modal" aria-label="Close" onclick="endInterview()"></button>
            </div>

            <div class="modal-body d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden p-0 z-2">
                
                <!-- Background ambient lights -->
                <div class="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none z-n1">
                    <div class="ambient-light-1"></div>
                    <div class="ambient-light-2"></div>
                </div>

                <!-- AI Core Visualizer -->
                <div class="ai-core-container mb-5 d-flex align-items-center justify-content-center">
                    <div id="aiCore" class="ai-core idle">
                        <div class="ai-ring ring-1"></div>
                        <div class="ai-ring ring-2"></div>
                        <div class="ai-ring ring-3"></div>
                        <div class="ai-center-orb">
                            <i id="aiIcon" class="bi bi-mic-fill text-white fs-1"></i>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <h3 id="interviewStatus" class="fw-light text-white mb-4" style="letter-spacing: 1px; text-shadow: 0 2px 10px rgba(255,255,255,0.2);">System Ready</h3>

                <!-- Transcript Panel -->
                <div class="transcript-panel w-100 p-4 mb-5 mx-auto" style="max-width: 700px; height: 350px;">
                    <!-- Bubbles added dynamically here -->
                    <div id="transcriptArea" class="d-flex flex-column gap-3 h-100 overflow-auto pe-2 custom-scrollbar">
                        <div class="text-center w-100 mt-auto mb-auto text-secondary small text-uppercase tracking-wider" style="letter-spacing: 2px;">Start session to begin transcription</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="d-flex gap-4">
                    <button id="btnStartSession" class="btn btn-premium rounded-pill px-5 py-3 shadow-lg fw-bold fs-5" onclick="startInterviewSession()">
                        <i class="bi bi-play-fill me-2"></i> Initiate Sequence
                    </button>
                    <button id="btnDoneSpeaking" class="btn btn-success-premium rounded-pill px-5 py-3 shadow-lg fw-bold fs-5 d-none" onclick="stopRecording()">
                        <i class="bi bi-check-lg me-2"></i> Finalize Answer
                    </button>
                    <button id="btnEndSession" class="btn btn-danger-premium rounded-pill px-5 py-3 shadow-lg fw-bold fs-5 d-none" onclick="endInterview()">
                        <i class="bi bi-stop-fill me-2"></i> Terminate
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Ambient Lighting */
    .ambient-light-1 {
        position: absolute;
        top: -10%; left: 20%;
        width: 60vw; height: 60vw;
        background: radial-gradient(circle, rgba(13, 110, 253, 0.15) 0%, rgba(0,0,0,0) 70%);
        border-radius: 50%;
        filter: blur(60px);
        animation: floatLight1 10s ease-in-out infinite alternate;
    }
    .ambient-light-2 {
        position: absolute;
        bottom: -20%; right: 10%;
        width: 50vw; height: 50vw;
        background: radial-gradient(circle, rgba(111, 66, 193, 0.15) 0%, rgba(0,0,0,0) 70%);
        border-radius: 50%;
        filter: blur(60px);
        animation: floatLight2 12s ease-in-out infinite alternate;
    }
    @keyframes floatLight1 { 100% { transform: translate(10%, 10%); } }
    @keyframes floatLight2 { 100% { transform: translate(-10%, -10%); } }

    /* AI Core Visualizer */
    .ai-core-container {
        position: relative;
        width: 200px; height: 200px;
    }
    .ai-core {
        position: absolute;
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
    }
    .ai-ring {
        position: absolute;
        border-radius: 50%;
        border: 2px solid transparent;
        transition: all 0.5s ease;
    }
    .ring-1 { width: 100%; height: 100%; border-top-color: rgba(13,110,253,0.5); border-bottom-color: rgba(111,66,193,0.5); animation: spin 8s linear infinite; }
    .ring-2 { width: 75%; height: 75%; border-left-color: rgba(13,110,253,0.7); border-right-color: rgba(20,164,77,0.7); animation: spinReverse 5s linear infinite; }
    .ring-3 { width: 50%; height: 50%; border-top-color: rgba(255,255,255,0.4); animation: spin 3s linear infinite; }
    
    .ai-center-orb {
        width: 80px; height: 80px;
        background: linear-gradient(135deg, #0d6efd, #6f42c1);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 30px rgba(13, 110, 253, 0.6);
        z-index: 10;
        transition: all 0.3s ease;
    }

    /* Core States */
    .ai-core.listening .ai-center-orb {
        background: linear-gradient(135deg, #14a44d, #3b71ca);
        box-shadow: 0 0 50px rgba(20, 164, 77, 0.8);
        transform: scale(1.1);
        animation: pulseCore 1s infinite alternate;
    }
    .ai-core.listening .ring-1, .ai-core.listening .ring-2 {
        border-color: rgba(20, 164, 77, 0.6);
        animation-duration: 2s;
    }

    .ai-core.speaking .ai-center-orb {
        background: linear-gradient(135deg, #e4a11b, #dc4c64);
        box-shadow: 0 0 60px rgba(228, 161, 27, 0.8);
        animation: speakingBounce 0.4s infinite alternate;
    }
    .ai-core.speaking .ring-1, .ai-core.speaking .ring-2 {
        border-color: rgba(228, 161, 27, 0.6);
        animation-duration: 1.5s;
    }
    .ai-core.thinking .ai-center-orb {
        background: linear-gradient(135deg, #9fa6b2, #332d2d);
        box-shadow: 0 0 20px rgba(159, 166, 178, 0.4);
        transform: scale(0.9);
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
    @keyframes pulseCore { 100% { transform: scale(1.2); } }
    @keyframes speakingBounce { 100% { transform: scale(1.1) translateY(-5px); } }

    /* Transcript Panel */
    .transcript-panel {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
    }
    
    .chat-bubble {
        padding: 14px 20px;
        border-radius: 20px;
        max-width: 85%;
        width: fit-content;
        animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-size: 1.05rem;
        line-height: 1.5;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .chat-ai {
        background: linear-gradient(135deg, rgba(13,110,253,0.2), rgba(111,66,193,0.2));
        border: 1px solid rgba(13,110,253,0.3);
        color: #f8f9fa;
        border-bottom-left-radius: 4px;
        align-self: flex-start;
    }
    .chat-user {
        background: linear-gradient(135deg, rgba(20,164,77,0.2), rgba(59,113,202,0.2));
        border: 1px solid rgba(20,164,77,0.3);
        color: #f8f9fa;
        border-bottom-right-radius: 4px;
        align-self: flex-end;
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

    /* Buttons */
    .btn-premium {
        background: linear-gradient(135deg, #0d6efd, #6f42c1);
        color: white; border: none;
        transition: all 0.3s ease;
    }
    .btn-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(13,110,253,0.5) !important; color: white; }
    
    .btn-success-premium {
        background: linear-gradient(135deg, #14a44d, #1f7d40);
        color: white; border: none;
        transition: all 0.3s ease;
    }
    .btn-success-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(20,164,77,0.5) !important; color: white; }

    .btn-danger-premium {
        background: transparent;
        color: #dc4c64; border: 2px solid rgba(220,76,100,0.3);
        transition: all 0.3s ease;
    }
    .btn-danger-premium:hover { background: rgba(220,76,100,0.1); color: #dc4c64; border-color: #dc4c64; }
</style>

<script>
    // HARDCODED API KEYS
    const NVIDIA_API_KEY = "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";
    const DEEPGRAM_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    const NEMOTRON_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    
    let isInterviewActive = false;
    let conversationHistory = [];
    const SYSTEM_PROMPT = "You are an expert technical interviewer evaluating a software engineering candidate. Maintain a professional, encouraging tone. Keep your responses concise (strictly 1 or 2 short sentences). Ask exactly ONE technical or behavioral question at a time. Listen to the candidate's answer, briefly acknowledge it, and then proceed to the next relevant question. Do not use markdown, asterisks, or lists in your text. Speak naturally.";

    let mediaRecorder;
    let audioChunks = [];
    let currentAudioElement = null;

    async function startInterviewSession() {
        // BUG FIX: Removed API Key Check!
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                if(!isInterviewActive) return;
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                audioChunks = [];
                await processAudioWithWhisper(audioBlob);
            };

        } catch (err) {
            console.error(err);
            alert("Microphone access is required for the advanced mock interview.");
            return;
        }
        
        isInterviewActive = true;
        conversationHistory = [];
        document.getElementById('transcriptArea').innerHTML = ''; 
        document.getElementById('btnStartSession').classList.add('d-none');
        document.getElementById('btnEndSession').classList.remove('d-none');
        
        setCoreState('thinking', 'Initializing Nexus Interviewer...');
        
        let initialGreeting = "Hello! I am Nexus, your AI interviewer powered by Nemotron 3 Ultra. I'm excited to speak with you today. To get started, could you walk me through a recent technical project you are proud of?";
        conversationHistory.push({ role: 'assistant', content: initialGreeting });
        await speakWithDeepgram(initialGreeting);
    }

    function setCoreState(state, statusText) {
        document.getElementById('aiCore').className = 'ai-core ' + state;
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
        audioChunks = [];
        mediaRecorder.start();
        setCoreState('listening', 'Listening... (Click "Finalize Answer" when done)');
        document.getElementById('btnDoneSpeaking').classList.remove('d-none');
    }

    function stopRecording() {
        if(mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        document.getElementById('btnDoneSpeaking').classList.add('d-none');
        setCoreState('thinking', 'Transcribing with NVIDIA Whisper...');
    }

    async function processAudioWithWhisper(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'openai/whisper-large-v3');

        try {
            const response = await fetch('https://integrate.api.nvidia.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ` + NVIDIA_API_KEY
                },
                body: formData
            });
            
            const data = await response.json();
            if(data.text && data.text.trim().length > 0) {
                addChatMessage(data.text, false);
                await generateFollowUp(data.text);
            } else {
                setCoreState('thinking', 'I didn\'t catch that. Could you repeat?');
                setTimeout(() => startRecording(), 2000);
            }
        } catch(error) {
            console.error("Whisper Error:", error);
            setCoreState('thinking', 'Transcription Error. Retrying...');
            setTimeout(() => startRecording(), 2000);
        }
    }

    async function generateFollowUp(userResponse) {
        setCoreState('thinking', 'Synthesizing response (Nemotron 3 Ultra)...');
        conversationHistory.push({ role: 'user', content: userResponse });

        try {
            let messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory
            ];

            const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + NEMOTRON_API_KEY
                },
                body: JSON.stringify({
                    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
                    messages: messages
                })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);

            let aiText = data.choices[0].message.content;
            aiText = aiText.replace(/[*#_`]/g, ''); 

            conversationHistory.push({ role: 'assistant', content: aiText });
            await speakWithDeepgram(aiText);

        } catch (error) {
            console.error("Nemotron Error:", error);
            setCoreState('thinking', 'Neural Pathway Error.');
            endInterview("I encountered an error connecting to the Nexus core.");
        }
    }

    async function speakWithDeepgram(text) {
        if (!isInterviewActive) return;
        
        setCoreState('thinking', 'Generating Voice (Deepgram)...');
        addChatMessage(text, true);

        try {
            const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ` + DEEPGRAM_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "deepgram/flux-tts:free",
                    input: text
                })
            });

            if(!response.ok) throw new Error("TTS API Error");

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            currentAudioElement = new Audio(audioUrl);
            
            setCoreState('speaking', 'AI is speaking...');
            currentAudioElement.onended = () => {
                if (isInterviewActive) {
                    startRecording(); 
                }
            };
            
            currentAudioElement.play();

        } catch(error) {
            console.error("Deepgram Error:", error);
            setCoreState('thinking', 'Voice module offline.');
            if (isInterviewActive) setTimeout(() => startRecording(), 2000);
        }
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
        if(currentAudioElement) currentAudioElement.pause();
        if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        
        if(mediaRecorder && mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(t => t.stop());
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
</body>
"@

    $newLines = @($lines[0..($beginIdx - 1)]) + $newContent
    Set-Content -Path $filePath -Value $newLines -Encoding utf8
    Write-Output "Successfully injected UI redesign and bug fix."
} else {
    Write-Output "Could not find AI Interview Modal injection block."
}


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
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content bg-dark text-white">
            <div class="modal-header border-bottom border-secondary">
                <h5 class="modal-title fw-bold"><i class="bi bi-robot text-primary me-2"></i> Advanced AI Mock Interview</h5>
                <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-secondary">Powered by NVIDIA Whisper & Deepgram</span>
                    <div class="input-group input-group-sm" style="width: 250px;">
                        <span class="input-group-text bg-dark text-white border-secondary"><i class="bi bi-key"></i></span>
                        <input type="password" id="geminiApiKey" class="form-control bg-dark text-white border-secondary" placeholder="Gemini API Key" onchange="saveApiKey()">
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="endInterview()"></button>
                </div>
            </div>
            <div class="modal-body d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden p-0">
                <!-- Glowing Orb / Pulsing Animation -->
                <div class="ai-orb-container mb-5 position-relative d-flex align-items-center justify-content-center" style="height: 200px;">
                    <div id="aiOrb" class="ai-orb rounded-circle bg-primary opacity-75 shadow-lg" style="width: 100px; height: 100px; transition: all 0.3s ease;"></div>
                    <div class="position-absolute fs-1"><i class="bi bi-mic-fill text-white"></i></div>
                </div>

                <!-- Status Text -->
                <h4 id="interviewStatus" class="fw-light mb-4">Ready to start?</h4>

                <!-- Transcript Area -->
                <div id="transcriptArea" class="w-100 max-w-md mx-auto p-4 rounded-4 bg-black bg-opacity-25 border border-secondary mb-4 overflow-auto" style="height: 300px; max-width: 600px;">
                    <div class="text-center text-muted small mb-3">Interview Transcript</div>
                    <!-- Chat bubbles go here -->
                </div>

                <!-- Controls -->
                <div class="d-flex gap-3">
                    <button id="btnStartSession" class="btn btn-primary btn-lg rounded-pill px-4" onclick="startInterviewSession()"><i class="bi bi-play-fill me-1"></i> Start Session</button>
                    <button id="btnDoneSpeaking" class="btn btn-success btn-lg rounded-pill px-4 d-none" onclick="stopRecording()"><i class="bi bi-mic-fill me-1"></i> Done Speaking</button>
                    <button id="btnEndSession" class="btn btn-outline-danger btn-lg rounded-pill px-4 d-none" onclick="endInterview()"><i class="bi bi-stop-fill me-1"></i> End Session</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .ai-orb {
        box-shadow: 0 0 30px var(--bs-primary);
        animation: idlePulse 2s infinite ease-in-out;
    }
    .ai-orb.listening {
        background-color: var(--bs-success) !important;
        box-shadow: 0 0 40px var(--bs-success);
        animation: activePulse 1s infinite ease-in-out;
    }
    .ai-orb.speaking {
        background-color: var(--bs-info) !important;
        box-shadow: 0 0 50px var(--bs-info);
        animation: speakingPulse 0.5s infinite alternate;
    }
    
    @keyframes idlePulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
    }
    @keyframes activePulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
    }
    @keyframes speakingPulse {
        0% { transform: scale(1) translateY(0); }
        100% { transform: scale(1.15) translateY(-5px); }
    }
    
    .chat-bubble {
        padding: 10px 15px;
        border-radius: 20px;
        margin-bottom: 15px;
        max-width: 80%;
        width: fit-content;
        animation: fadeIn 0.3s ease-in;
    }
    .chat-ai {
        background: rgba(var(--bs-primary-rgb), 0.2);
        border: 1px solid rgba(var(--bs-primary-rgb), 0.5);
        color: white;
        border-bottom-left-radius: 0;
    }
    .chat-user {
        background: rgba(var(--bs-success-rgb), 0.2);
        border: 1px solid rgba(var(--bs-success-rgb), 0.5);
        color: white;
        border-bottom-right-radius: 0;
        margin-left: auto;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<script>
    // HARDCODED API KEYS AS REQUESTED BY USER
    const NVIDIA_API_KEY = "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";
    const OPENROUTER_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    
    let isInterviewActive = false;
    let conversationHistory = [];
    const SYSTEM_PROMPT = "You are an expert technical interviewer. The user is a candidate. Keep your responses concise (under 2 sentences). Ask one question at a time, listen to the answer, briefly evaluate it, and ask a relevant follow-up question. Do not use asterisks or markdown formatting in your response.";

    let mediaRecorder;
    let audioChunks = [];
    let currentAudioElement = null;

    document.addEventListener("DOMContentLoaded", () => {
        const key = localStorage.getItem('gemini_api_key');
        if(key) document.getElementById('geminiApiKey').value = key;
    });

    function saveApiKey() {
        const key = document.getElementById('geminiApiKey').value;
        localStorage.setItem('gemini_api_key', key);
    }

    async function startInterviewSession() {
        if (!document.getElementById('geminiApiKey').value.trim()) {
            alert("Please enter a Gemini API Key in the top right to start the dynamic interview!");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                if(!isInterviewActive) return;
                // Package the audio blob
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
        document.getElementById('transcriptArea').innerHTML = '<div class="text-center text-muted small mb-3">Interview Transcript</div>';
        document.getElementById('btnStartSession').classList.add('d-none');
        document.getElementById('btnEndSession').classList.remove('d-none');
        
        let initialGreeting = "Hi there! I am your AI interviewer today. To get started, please tell me a bit about yourself and your background.";
        conversationHistory.push({ role: 'model', parts: [{ text: initialGreeting }] });
        await speakWithDeepgram(initialGreeting);
    }

    function startRecording() {
        if (!isInterviewActive) return;
        audioChunks = [];
        mediaRecorder.start();
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle shadow-lg listening';
        document.getElementById('interviewStatus').innerText = 'Listening... (Click "Done Speaking" when finished)';
        document.getElementById('btnDoneSpeaking').classList.remove('d-none');
    }

    function stopRecording() {
        if(mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        document.getElementById('btnDoneSpeaking').classList.add('d-none');
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle bg-primary opacity-75 shadow-lg';
        document.getElementById('interviewStatus').innerText = 'Transcribing with NVIDIA Whisper...';
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
                document.getElementById('interviewStatus').innerText = 'Could not hear you properly. Try again?';
                startRecording();
            }
        } catch(error) {
            console.error("Whisper Error:", error);
            document.getElementById('interviewStatus').innerText = 'Transcription Error. Retrying...';
            startRecording();
        }
    }

    async function generateFollowUp(userResponse) {
        const apiKey = document.getElementById('geminiApiKey').value.trim();
        document.getElementById('interviewStatus').innerText = 'Thinking (Gemini)...';
        conversationHistory.push({ role: 'user', parts: [{ text: userResponse }] });

        try {
            let payload = {
                contents: [
                    { role: 'user', parts: [{ text: "SYSTEM: " + SYSTEM_PROMPT }] },
                    { role: 'model', parts: [{ text: "Understood. I will act as the interviewer." }] }
                ]
            };
            
            for(let msg of conversationHistory) {
                payload.contents.push(msg);
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=` + apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);

            let aiText = data.candidates[0].content.parts[0].text;
            aiText = aiText.replace(/\*/g, ''); 

            conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
            await speakWithDeepgram(aiText);

        } catch (error) {
            console.error("Gemini Error:", error);
            document.getElementById('interviewStatus').innerText = 'API Error';
            endInterview("I encountered an error connecting to the AI model.");
        }
    }

    async function speakWithDeepgram(text) {
        if (!isInterviewActive) return;
        
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle shadow-lg speaking';
        document.getElementById('interviewStatus').innerText = 'Generating Voice (Deepgram)...';
        addChatMessage(text, true);

        try {
            const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ` + OPENROUTER_API_KEY,
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
            
            document.getElementById('interviewStatus').innerText = 'AI is speaking...';
            currentAudioElement.onended = () => {
                if (isInterviewActive) {
                    startRecording(); // Automatically start listening after speaking finishes
                }
            };
            
            currentAudioElement.play();

        } catch(error) {
            console.error("Deepgram Error:", error);
            document.getElementById('interviewStatus').innerText = 'Audio Error - Check Console';
            // Fallback
            if (isInterviewActive) startRecording();
        }
    }

    function addChatMessage(text, isAI) {
        let bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + (isAI ? 'chat-ai' : 'chat-user');
        bubble.innerText = text;
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
        
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle bg-primary opacity-75 shadow-lg';
        document.getElementById('interviewStatus').innerText = 'Session Ended';
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
    Write-Output "Successfully injected professional API logic."
} else {
    Write-Output "Could not find AI Interview Modal injection block."
}


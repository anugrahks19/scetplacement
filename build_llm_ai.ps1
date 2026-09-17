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
                <h5 class="modal-title fw-bold"><i class="bi bi-robot text-primary me-2"></i> AI Mock Interview Session</h5>
                <div class="d-flex align-items-center gap-3">
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
    let recognition;
    let isInterviewActive = false;
    let synth = window.speechSynthesis;
    
    let conversationHistory = [];
    const SYSTEM_PROMPT = "You are an expert technical interviewer. The user is a candidate. Keep your responses concise (under 2 sentences). Ask one question at a time, listen to the answer, briefly evaluate it, and ask a relevant follow-up question.";

    // Load API key on start
    document.addEventListener("DOMContentLoaded", () => {
        const key = localStorage.getItem('gemini_api_key');
        if(key) document.getElementById('geminiApiKey').value = key;
    });

    function saveApiKey() {
        const key = document.getElementById('geminiApiKey').value;
        localStorage.setItem('gemini_api_key', key);
    }

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = true; 
        
        recognition.onstart = function() {
            if(!isInterviewActive) return;
            document.getElementById('aiOrb').className = 'ai-orb rounded-circle shadow-lg listening';
            document.getElementById('interviewStatus').innerText = 'Listening...';
        };

        let currentTranscriptionBubble = null;
        let finalUserText = '';

        recognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (!currentTranscriptionBubble) {
                currentTranscriptionBubble = document.createElement('div');
                currentTranscriptionBubble.className = 'chat-bubble chat-user';
                document.getElementById('transcriptArea').appendChild(currentTranscriptionBubble);
            }

            currentTranscriptionBubble.innerHTML = finalTranscript + '<i style="opacity:0.6">' + interimTranscript + '</i>';
            finalUserText += finalTranscript;
            scrollToBottom();
        };

        recognition.onend = function() {
            if (isInterviewActive) {
                document.getElementById('aiOrb').className = 'ai-orb rounded-circle bg-primary opacity-75 shadow-lg';
                document.getElementById('interviewStatus').innerText = 'Thinking...';
                currentTranscriptionBubble = null;
                
                if(finalUserText.trim().length > 0) {
                    generateFollowUp(finalUserText.trim());
                    finalUserText = '';
                } else {
                    try { recognition.start(); } catch(e){}
                }
            }
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error", event.error);
            if (event.error !== 'no-speech' && isInterviewActive) {
                document.getElementById('interviewStatus').innerText = 'Microphone Error. Please try again.';
            }
        };
    } else {
        console.warn("Your browser does not support the Web Speech API.");
    }

    async function generateFollowUp(userResponse) {
        const apiKey = document.getElementById('geminiApiKey').value.trim();
        if(!apiKey) {
            alert("Please enter your Gemini API key in the settings to use dynamic responses.");
            endInterview();
            return;
        }

        conversationHistory.push({ role: 'user', parts: [{ text: userResponse }] });

        try {
            let payload = {
                contents: [
                    { role: 'user', parts: [{ text: "SYSTEM: " + SYSTEM_PROMPT }] },
                    { role: 'model', parts: [{ text: "Understood. I will act as the interviewer." }] }
                ]
            };
            
            // Append history
            for(let msg of conversationHistory) {
                payload.contents.push(msg);
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=` + apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if(data.error) {
                throw new Error(data.error.message);
            }

            let aiText = data.candidates[0].content.parts[0].text;
            aiText = aiText.replace(/\*/g, ''); 

            conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
            askQuestion(aiText);

        } catch (error) {
            console.error(error);
            document.getElementById('interviewStatus').innerText = 'API Error';
            endInterview("I encountered an error connecting to the AI model.");
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

    function askQuestion(text) {
        if (!isInterviewActive) return;
        
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle shadow-lg speaking';
        document.getElementById('interviewStatus').innerText = 'AI is speaking...';
        addChatMessage(text, true);

        let utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        
        let voices = synth.getVoices();
        let enVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Female')) || voices.find(v => v.lang.includes('en'));
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = function() {
            if (isInterviewActive) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log("Recognition already started", e);
                }
            }
        };

        synth.speak(utterance);
    }

    function startInterviewSession() {
        if (!document.getElementById('geminiApiKey').value.trim()) {
            alert("Please enter a Gemini API Key in the top right to start the dynamic interview!");
            return;
        }

        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice interaction is not supported in this browser. Please use Chrome or Edge.");
            return;
        }
        synth.getVoices();
        
        isInterviewActive = true;
        conversationHistory = [];
        document.getElementById('transcriptArea').innerHTML = '<div class="text-center text-muted small mb-3">Interview Transcript</div>';
        document.getElementById('btnStartSession').classList.add('d-none');
        document.getElementById('btnEndSession').classList.remove('d-none');
        
        let initialGreeting = "Hi there! I am your AI interviewer today. To get started, please tell me a bit about yourself and your background.";
        conversationHistory.push({ role: 'model', parts: [{ text: initialGreeting }] });
        askQuestion(initialGreeting);
    }

    function endInterview(finalMessage = null) {
        isInterviewActive = false;
        synth.cancel(); 
        try { recognition.stop(); } catch(e){} 
        
        document.getElementById('aiOrb').className = 'ai-orb rounded-circle bg-primary opacity-75 shadow-lg';
        document.getElementById('interviewStatus').innerText = 'Session Ended';
        document.getElementById('btnStartSession').classList.remove('d-none');
        document.getElementById('btnEndSession').classList.add('d-none');
        
        if (finalMessage) {
            addChatMessage(finalMessage, true);
        }
    }
</script>
</body>
"@

    $newLines = @($lines[0..($beginIdx - 1)]) + $newContent
    Set-Content -Path $filePath -Value $newLines -Encoding utf8
    Write-Output "Successfully replaced AI voice modal with Gemini integration."
} else {
    Write-Output "Could not find AI Interview Modal injection block."
}

$filePath = "c:\Antigravity\scet_placement\pages\interview-prep.html"
$content = Get-Content -Encoding utf8 $filePath -Raw

# Replace Start Practice button
$oldButton = '<button class="btn btn-outline-primary rounded-pill w-100 mt-2">Start Practice</button>'
$newButton = '<button class="btn btn-outline-primary rounded-pill w-100 mt-2" data-bs-toggle="modal" data-bs-target="#aiInterviewModal">Start Practice</button>'
$content = $content.Replace($oldButton, $newButton)

# The HTML and JS to inject before </body>
$injection = @"
<!-- AI Interview Modal -->
<div class="modal fade" id="aiInterviewModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content bg-dark text-white">
            <div class="modal-header border-bottom border-secondary">
                <h5 class="modal-title fw-bold"><i class="bi bi-robot text-primary me-2"></i> AI Mock Interview Session</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="endInterview()"></button>
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
    const questions = [
        "Hi there! Let's start with a classic. Tell me about yourself.",
        "That's great. Can you describe a challenging technical problem you solved recently?",
        "Interesting. Where do you see your career heading in the next three years?",
        "Thank you for sharing. Do you have any questions for me about the company?"
    ];
    let currentQuestionIndex = 0;
    let recognition;
    let isInterviewActive = false;
    let synth = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = true; 
        
        recognition.onstart = function() {
            document.getElementById('aiOrb').className = 'ai-orb rounded-circle shadow-lg listening';
            document.getElementById('interviewStatus').innerText = 'Listening...';
        };

        let currentTranscriptionBubble = null;

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

            currentTranscriptionBubble.innerHTML = finalTranscript + '<i style=\"opacity:0.6\">' + interimTranscript + '</i>';
            scrollToBottom();
        };

        recognition.onend = function() {
            if (isInterviewActive) {
                document.getElementById('aiOrb').className = 'ai-orb rounded-circle bg-primary opacity-75 shadow-lg';
                document.getElementById('interviewStatus').innerText = 'Processing...';
                currentTranscriptionBubble = null;
                
                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        askQuestion(questions[currentQuestionIndex]);
                    } else {
                        endInterview("Great job! That concludes our mock interview.");
                    }
                }, 1500);
            }
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error", event.error);
            if (event.error !== 'no-speech') {
                document.getElementById('interviewStatus').innerText = 'Microphone Error. Please try again.';
            }
        };
    } else {
        console.warn("Your browser does not support the Web Speech API.");
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
        utterance.rate = 0.9;
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
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice interaction is not supported in this browser. Please use Chrome or Edge.");
            return;
        }
        synth.getVoices();
        
        isInterviewActive = true;
        currentQuestionIndex = 0;
        document.getElementById('transcriptArea').innerHTML = '<div class=\"text-center text-muted small mb-3\">Interview Transcript</div>';
        document.getElementById('btnStartSession').classList.add('d-none');
        document.getElementById('btnEndSession').classList.remove('d-none');
        
        askQuestion(questions[0]);
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

$content = $content.Replace("</body>", $injection)
Set-Content -Path $filePath -Value $content -Encoding utf8
Write-Output "Successfully injected Voice AI Modal."

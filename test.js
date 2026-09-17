
    const DEEPGRAM_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    const NEMOTRON_API_KEY = "YOUR_OPENROUTER_KEY_HERE";
    
    let isInterviewActive = false;
    let conversationHistory = [];
    const SYSTEM_PROMPT = "You are an expert technical interviewer evaluating a software engineering candidate. Maintain a professional, encouraging tone. Keep your responses concise (strictly 1 or 2 short sentences). Ask exactly ONE technical or behavioral question at a time. Listen to the candidate's answer, briefly acknowledge it, and then proceed to the next relevant question. Do not use markdown, asterisks, or lists in your text. Speak naturally.";

    let currentAudioElement = null;
    let recognition = null;
    
    // Initialize Speech Recognition
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
            setCoreState('thinking', 'I didn\\'t catch that. Could you repeat?');
            setTimeout(() => startRecording(), 2000);
        };
    }

    async function startInterviewSession() {
        if (!recognition) {
            alert("Your browser does not support the Web Speech API. Please use Google Chrome or Edge.");
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
        setCoreState('listening', 'Listening... (Speak your answer)');
        
        try {
            recognition.start();
        } catch(e) {
            // Already started
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
                    'Authorization': 'Bearer ' + DEEPGRAM_API_KEY,
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


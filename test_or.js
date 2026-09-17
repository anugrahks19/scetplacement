const NEMOTRON_API_KEY = "YOUR_OPENROUTER_KEY_HERE";

async function test() {
    let messages = [
        { role: 'system', content: "You are an expert technical interviewer evaluating a software engineering candidate. Maintain a professional, encouraging tone. Keep your responses concise (strictly 1 or 2 short sentences). Ask exactly ONE technical or behavioral question at a time. Listen to the candidate's answer, briefly acknowledge it, and then proceed to the next relevant question. Do not use markdown, asterisks, or lists in your text. Speak naturally." },
        { role: 'assistant', content: "Hello! I am your AI interviewer powered by Nemotron 3 Ultra. I'm excited to speak with you today. To get started, could you walk me through a recent technical project you are proud of?" },
        { role: 'user', content: "I have done nothing to be honest." },
        { role: 'assistant', content: "I appreciate the honesty. Could you tell me about your background — are you currently studying, self-teaching, or transitioning from another field?" },
        { role: 'user', content: "Failed 8th standard." }
    ];

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + NEMOTRON_API_KEY
            },
            body: JSON.stringify({
                model: "nvidia/llama-3.1-nemotron-70b-instruct:free",
                messages: messages
            })
        });

        const text = await response.text();
        console.log("RESPONSE:", text);
    } catch (e) {
        console.log("ERROR:", e);
    }
}

test();







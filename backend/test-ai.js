const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

async function run() {
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
    for (const m of models) {
        try {
            console.log('Trying', m);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('hello');
            console.log(m, 'SUCCESS:', result.response.text());
            break;
        } catch(e) {
            console.error(m, 'FAILED:', e.message);
        }
    }
}
run();

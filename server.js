const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Railway automatically provides a port via the process.env.PORT variable
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Send index.html for the root route (optional, but good for safety)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/infographic', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'infographic.html'));
});

app.post('/api/generate-gtm', async (req, res) => {
    try {
        const { player } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Act as a top-tier strategy consultant (McKinsey/Bain level).
            Analyze the following player in the Freelancer Management System (FMS) market:
            Name: ${player.name}
            Role/Lane: ${player.role || player.lane}
            Description: ${player.desc}
            Moats: ${player.moats.join(', ')}

            Generate a Go-To-Market (GTM) strategy for them.
            Return ONLY a JSON object with the following structure (no markdown, no extra text):
            {
                "northStar": "A brief, punchy slogan for their strategic direction",
                "vector": "The specific market segment or customer type they should attack next",
                "tactics": ["Tactic 1", "Tactic 2", "Tactic 3"],
                "action": "The single most high-leverage immediate action they should take"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean up the response text if it contains markdown code blocks
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const gtmStrategy = JSON.parse(text);
        res.json(gtmStrategy);

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            error: "Failed to generate strategy",
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
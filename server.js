const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = "AIzaSyBR9712432y-rEhVOOQXaocIoFqktCP8Sk";

app.post("/gemini", async (req, res) => {
    try {
        const { message, pageTitle, pageContent } = req.body;

        let prompt = `You are a chatbot assisting with CodeChef problems.
        The user is currently on the page: "${pageTitle}".
        Here is the full problem statement: "${pageContent}".
        The user asked: "${message}".
        Provide a helpful response.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ reply: "Sorry, I couldn't get an answer." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

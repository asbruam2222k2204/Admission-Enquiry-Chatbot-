const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Gemini API Configuration
const GEMINI_API_KEY = "AIzaSyBJPQdxdQ2TSd8EAwiRuThuQb8Qzj_O-U8";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Predefined responses for common queries
const responses = [
    { pattern: /hi|hello|hey/i, replies: ["Hello! How can I assist you with admissions?", "Hi there! What do you need help with?"] },
    { pattern: /admission process|admission/i, replies: ["The admission process includes application submission, entrance exam, and an interview."] },
    { pattern: /eligibility criteria/i, replies: ["Eligibility criteria vary by course. Please specify the program you are interested in."] },
    { pattern: /fees structure|admission fees/i, replies: ["The fee structure depends on the course and varies yearly. Please visit our official website or contact admissions."] },
    { pattern: /scholarships|scholarship/i, replies: ["We offer merit-based and need-based scholarships. Please check our scholarship portal."] },
    { pattern: /contact details/i, replies: ["You can contact our admission office at +123456789 or email admissions@example.com."] },
    { pattern: /bye|exit|quit/i, replies: ["Goodbye! Have a great day!", "Take care! Feel free to ask anytime."] },
    { pattern: /seat allotment|counseling seat/i, replies: ["Seat allotment is based on TNEA ranking and availability. You can check your status on the official TNEA portal."] },
    { pattern: /college cut off|cutoff/i, replies: ["College cut-offs are determined by TNEA counseling. You can find the latest cut-off scores on the official TNEA website."] }
];

app.post("/chat", async (req, res) => {
    let userInput = req.body.message;

    // Check for predefined responses first
    for (let response of responses) {
        if (response.pattern.test(userInput)) {
            return res.json({ reply: response.replies[Math.floor(Math.random() * response.replies.length)] });
        }
    }

    // If no predefined response found, use Gemini API
    try {
        const result = await model.generateContent(userInput);
        const botReply = result.response.text() || "I'm sorry, I couldn't find relevant information.";
        return res.json({ reply: botReply });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.json({ reply: "Sorry, I couldn't fetch the information right now. Please try again later." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

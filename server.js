const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const chatCompletion =
            await groq.chat.completions.create({

                messages: [
                    {
                        role: "user",
                        content: userMessage
                    }
                ],

                model: "llama-3.3-70b-versatile"
            });

        const reply =
            chatCompletion.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            reply: "Backend Error"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

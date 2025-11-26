const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("AI Bot Backend Running with Groq 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const prompt = req.body.query || req.body.prompt;

    if (!prompt) {
      return res.json({
        success: false,
        error: "No query or prompt received",
        received: req.body
      });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      content: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.json({ success: false, error: error.message });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));

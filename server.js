app.post("/generate", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const prompt = req.body.query || req.body.prompt;

    if (!prompt) {
      return res.json({
        action: "reply",
        replies: [
          { type: "text", text: "❗No query received from SalesIQ" }
        ]
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

    const aiText = response.data.choices[0].message.content;

    // 🔥 IMPORTANT: Send in SalesIQ-compatible format
    res.json({
      action: "reply",
      replies: [
        {
          type: "text",
          text: aiText
        }
      ]
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.json({
      action: "reply",
      replies: [
        {
          type: "text",
          text: "⚠️ Server error: " + error.message
        }
      ]
    });
  }
});

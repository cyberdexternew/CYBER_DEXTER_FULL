import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 HF KEY FROM RENDER ENV
const HF_KEY = process.env.HF_KEY;

// Health check
app.get("/", (req, res) => {
  res.send("CYBER DEXTER BACKEND IS RUNNING");
});

// 💬 CHAT ENDPOINT (NORMALIZED RESPONSE)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message is empty" });
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message
        })
      }
    );

    const data = await hfRes.json();

    // ✅ NORMALIZE ALL POSSIBLE RESPONSES
    let reply = "No response from AI";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      reply = "AI is loading, please try again in 30 seconds.";
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("CYBER DEXTER backend running on port " + PORT);
});

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// HF key from Render Environment
const HF_KEY = process.env.HF_KEY;

// Health check
app.get("/", (req, res) => {
  res.send("CYBER DEXTER BACKEND IS RUNNING");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

// REQUIRED for Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("CYBER DEXTER backend running on port " + PORT);
});

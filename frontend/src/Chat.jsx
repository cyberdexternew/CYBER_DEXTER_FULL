import { useState } from "react";

const API = "https://cyber-dexter-full.onrender.com";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input) return;

    setMessages(m => [...m, { role: "user", text: input }]);
    setLoading(true);

    const res = await fetch(API + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const reply = data[0]?.generated_text || "No response";

    setMessages(m => [...m, { role: "bot", text: reply }]);
    setInput("");
    setLoading(false);
  }

  return (
    <div className="chat-container">
      <h1>CYBER DEXTER AI</h1>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
          </div>
        ))}
        {loading && <div className="bot">AI is typing...</div>}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

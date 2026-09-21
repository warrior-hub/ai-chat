const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash";


// ===============================
// Generate AI Response - Streaming
// ===============================

const generateAIResponseStream = async (messages, onChunk) => {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  const responseStream = await ai.models.generateContentStream({
    model: MODEL,
    contents,
  });

  let fullResponse = "";

  for await (const chunk of responseStream) {
    const text = chunk.text || "";

    if (!text) continue;

    fullResponse += text;

    onChunk(text);
  }

  return fullResponse;
};


// ===============================
// Generate Conversation Title
// ===============================

const generateConversationTitle = async (message) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Create a short title for this chat.

User message:
"${message}"

Rules:
- Maximum 6 words
- No quotes
- No emojis
- Return only the title`,
          },
        ],
      },
    ],
  });

  return response.text.trim();
};


// ===============================
// Exports
// ===============================

module.exports = {
  generateAIResponseStream,
  generateConversationTitle,
};
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/analyze", async (req, res) => {
  try {
    const text = req.body.text;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Sos un mediador emocional argentino.
Respondé con una frase breve, calmada, estilo psicólogo.
Texto: "${text}"
`;

    const result = await model.generateContent(prompt);

    res.json({
      reply: result.response.text(),
    });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
});

app.listen(3000, () => {
  console.log("Gemini backend running on port 3000");
});

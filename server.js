import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// ✅ Gemini Init
// ================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================================
// ✅ Endpoint test
// ================================
app.get("/", (req, res) => {
  res.send("✅ CalmaAI Backend funcionando");
});

// ================================
// ✅ Endpoint principal
// ================================
app.post("/api/analyze", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!userText) {
      return res.status(400).json({
        error: "Falta el texto"
      });
    }

    console.log("📩 Texto recibido:", userText);

    // Modelo recomendado (Flash rápido y barato)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Prompt psicológico argentino
    const prompt = `
Sos un asistente emocional argentino llamado CalmaAI.
Analizás si el texto indica estrés o enojo.

Texto: "${userText}"

Respondé SOLO en JSON válido así:

{
  "stressLevel": "NONE | LOW | MEDIUM | HIGH",
  "response": "frase corta como psicólogo argentino para calmar"
}

No agregues nada fuera del JSON.
`;

    const result = await model.generateContent(prompt);

    const raw = result.response.text();
    console.log("🤖 Gemini raw:", raw);

    // Convertir texto a JSON
    const json = JSON.parse(raw);

    res.json(json);

  } catch (err) {
    console.error("❌ Error:", err.message);

    res.status(500).json({
      error: "Error en Gemini backend",
      details: err.message
    });
  }
});

// ================================
// ✅ Start server Render compatible
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend corriendo en puerto", PORT);
});


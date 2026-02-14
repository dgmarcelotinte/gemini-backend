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
// ✅ Root test
// ================================
app.get("/", (req, res) => {
  res.send("🚀 CalmaAI Backend activo");
});

// ================================
// ✅ Endpoint test
// ================================
app.get("/api/analyze", (req, res) => {
  res.json({
    ok: true,
    message: "Backend activo. Usá POST con JSON {text:...}",
  });
});

// ================================
// ✅ Endpoint principal
// ================================
app.post("/api/analyze", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!userText) {
      return res.status(400).json({
        error: "Falta el texto",
      });
    }

    console.log("📩 Texto recibido:", userText);

    // Modelo recomendado
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

    // Prompt emocional argentino
    const prompt = `
Sos un asistente emocional argentino llamado CalmaAI.
Analizás si el texto indica estrés o enojo.

Texto: "${userText}"

Respondé SOLO en JSON válido:

{
  "stressLevel": "NONE | LOW | MEDIUM | HIGH",
  "response": "frase corta como mediador argentino para calmar"
}

NO agregues texto extra.
`;

    const result = await model.generateContent(prompt);

    let raw = result.response.text();
    console.log("🤖 Gemini raw:", raw);

    // ================================
    // ✅ LIMPIEZA anti Markdown
    // ================================
    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ================================
    // ✅ Parse seguro
    // ================================
    let json;

    try {
      json = JSON.parse(raw);
    } catch (parseErr) {
      console.log("⚠️ Gemini devolvió algo no parseable");

      json = {
        stressLevel: "NONE",
        response: "",
      };
    }

    return res.json(json);

  } catch (err) {
    console.error("❌ Error Gemini:", err.message);

    return res.status(500).json({
      error: "Error en Gemini backend",
      details: err.message,
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



import { GoogleGenAI } from "@google/genai";
const genai = new GoogleGenAI({});

async function Test(){
    const response = await genai.models.generateContent({
        model: "gemini-pro",
        contents: [{
            role: "user",
            parts: [{ text: "What is the capital of France?" }]
        }]
    });
    console.log(response);
}
Test();

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface NewsAnalysis {
  title: string;
  classification: number; // 1-5 as per PDF
  isAI: boolean;
  score: number;
}

export async function analyzeNewsBatch(articles: any[]): Promise<NewsAnalysis[]> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Classify the following online news articles based on the Civilizational Cognitive War framework (Section 5.4):
    1 - factual / informational (verifiable claims, cited sources)
    2 - opinion (clearly marked personal view)
    3 - misleading framing (selective facts, out-of-context, spin)
    4 - probable misinformation (false claims presented as fact)
    5 - disinformation campaign (coordinated, deliberate manipulation)
    
    Also determine if the content shows signs of being AI-generated (Layer 3 actors).
    
    Articles:
    ${articles.map((a, i) => `${i+1}. TITLE: ${a.title}\nURL: ${a.url}`).join('\n\n')}
    
    Return a JSON array of objects with properties: title, classification (1-5), isAI (boolean), score (0-1 confidence).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              classification: { type: Type.INTEGER },
              isAI: { type: Type.BOOLEAN },
              score: { type: Type.NUMBER }
            },
            required: ["title", "classification", "isAI", "score"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [];
  }
}

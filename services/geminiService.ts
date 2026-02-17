import { GoogleGenAI } from "@google/genai";
import { Accident, DraftAccident, NewsArticle, RoadUserType } from "../types";

// Initialize Gemini Client with safety check
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

// Helper to clean JSON string from Markdown
const cleanJsonString = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

export const analyzeAccident = async (accident: Accident): Promise<string> => {
  if (!apiKey) return "API Key ontbreekt. Configureer uw Vercel Environment Variables.";

  try {
    const prompt = `
      Je bent een expert in verkeersveiligheid en infrastructuur in België.
      Analyseer het volgende ongeval met een zwakke weggebruiker:
      
      Locatie: ${accident.locationName}
      Type slachtoffer: ${accident.type}
      Beschrijving: ${accident.description}
      Datum: ${accident.date}
      
      Geef een beknopte analyse (maximaal 150 woorden) in het Nederlands. 
      Focus op:
      1. Mogelijke infrastructurele oorzaken voor dit type ongeval op deze locatie.
      2. Eén concrete aanbeveling voor beleidsmakers om dit te voorkomen.
      
      Houd de toon respectvol en feitelijk.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Geen analyse beschikbaar.";
  } catch (error) {
    console.error("Fout bij het ophalen van Gemini analyse:", error);
    return "Er is een fout opgetreden bij het genereren van de analyse. Controleer uw API-sleutel.";
  }
};

export const generateGeneralSafetyTips = async (): Promise<string> => {
  if (!apiKey) return "API Key ontbreekt.";

  try {
    const prompt = `
      Geef 3 korte, essentiële veiligheidstips voor zwakke weggebruikers in Vlaanderen, gebaseerd op recente ongevalstrends.
      Formatteer als een eenvoudige HTML lijst (<ul><li>...</li></ul>) zonder markdown code blocks.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text || "Geen tips beschikbaar.";

  } catch (error) {
    return "Kon geen veiligheidstips laden.";
  }
}

export const verifyArticleUrl = async (url: string): Promise<DraftAccident | null> => {
  if (!apiKey) {
    console.error("API Key is missing in verifyArticleUrl");
    throw new Error("API Key ontbreekt. Voeg deze toe in Vercel instellingen.");
  }

  try {
    const prompt = `
      Taak: Zoek naar informatie over het verkeersongeval dat wordt beschreven in of gelinkt is aan deze URL: ${url}.
      
      Stap 1: Verifieer of dit een ECHT ongeval is in Vlaanderen of Brussel waarbij een zwakke weggebruiker (fietser of voetganger) betrokken is.
      Stap 2: Zo ja, haal de details op.
      Stap 3: Schat de GPS coördinaten (lat/lng) zo nauwkeurig mogelijk op basis van de straatnaam en gemeente.
      
      Output formaat: Geef ENKEL een valide JSON object terug (GEEN markdown formatting, geen uitleg).
      Structuur:
      {
        "isValid": boolean, (true als het een echt ongeval met zwakke weggebruiker is)
        "locationName": string, (bv. "Gent, Veldstraat")
        "coordinates": { "lat": number, "lng": number },
        "date": string, (formaat YYYY-MM-DD, schatting indien niet exact)
        "type": "Fietser" | "Voetganger",
        "description": string, (korte samenvatting van 1 zin)
        "severity": "Fatal" | "Critical" (Fatal als dodelijk, anders Critical)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    const cleanText = cleanJsonString(text);
    
    // Log grounding metadata if available (for debugging/audit)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      console.log("Grounding sources:", chunks);
    }

    try {
      const data = JSON.parse(cleanText) as DraftAccident;
      return data;
    } catch (parseError) {
      // Fallback: try to find JSON within the text if simple cleanup failed
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as DraftAccident;
      }
      throw parseError;
    }

  } catch (error) {
    console.error("Error verifying URL:", error);
    throw error; // Rethrow to show in UI
  }
};

export const findRelatedArticles = async (accident: Accident): Promise<NewsArticle[]> => {
  if (!apiKey) return [];

  try {
    const prompt = `
      Zoek naar online nieuwsartikels en politieverslagen over dit specifieke verkeersongeval:
      Locatie: ${accident.locationName}
      Datum: ${accident.date}
      Type: ${accident.type}
      Details: ${accident.description}

      Probeer specifieke artikels te vinden van Belgische nieuwsbronnen (HLN, Nieuwsblad, VRT, De Standaard, Gazet van Antwerpen, etc.).
      
      Output formaat:
      Geef ENKEL een JSON array terug.
      Elk object in de array moet de volgende velden hebben:
      - "title": (string) De titel van het artikel of de pagina.
      - "url": (string) De directe URL naar het artikel.
      - "source": (string) De naam van de nieuwsbron.
      - "date": (string, optioneel) Datum van publicatie.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "[]";
    const cleanText = cleanJsonString(text);
    
    try {
       const articles = JSON.parse(cleanText);
       return Array.isArray(articles) ? articles : [];
    } catch (e) {
      console.error("Failed to parse articles JSON", e);
      return [];
    }
  } catch (error) {
    console.error("Error finding articles:", error);
    return [];
  }
};
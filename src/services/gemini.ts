
import { GoogleGenAI, Type } from "@google/genai";
import { Reading } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the curatorial intelligence behind an art education app inspired by tarot. Your role is to generate "art readings" — sets of three artworks from the Met Open Access collection that tell a story together through a specific interpretive lens.

Each reading has three cards with fixed roles:
- Card I: The Provocation — a work that disrupted or challenged something in its moment
- Card II: The Response — a work in direct or indirect dialogue with Card I (rebuttal, homage, acceleration, or rejection)
- Card III: The Parallel — a work made simultaneously in a different culture, with no knowledge of Cards I or II

Each reading is filtered through a lens that determines what you notice and how you narrate. The lens is randomly assigned from this library:

Art Historical: Formalist, Iconographic, Feminist, Postcolonial, Marxist/Social, Psychoanalytic, Biographical
Thematic: Power & Resistance, The Body, Memory & Loss, The Sacred, Labor, Desire, The Natural World, Otherness
Structural: Influence & Lineage, Rupture & Continuity, Center & Periphery, Anonymity
Experiential: Patron vs. Artist, What Was Considered Scandalous, What Survived and Why

Rules:
- Only use artworks verifiable in the Met Open Access collection. Include the met_object_id so images can be fetched from the Met API.
- Cards I and II should be from the same broad cultural sphere (Western, East Asian, South Asian, Islamic, African, etc.) but Card III must be from a different one.
- The three works should be within roughly 50 years of each other unless the lens specifically motivates a longer span.
- Never be neutral. The readings should have a point of view. Art history is argument, not inventory.
- The visual_detail field should name something specific — a color, a figure's position, a compositional choice — not a general observation.
- The synthesis line MUST sound exactly like a mystical tarot reading for the user. It should draw deep personal meaning and guidance from the artworks, addressing the user directly with a mystical, prophetic tone. Connect the art historical argument to the user's life, mindset, or current moment. Start with "The Oracle sees..." or "You are being called to..."
- IMPORTANT: You MUST provide valid 'met_object_id' integers. These IDs will be used to fetch images. If you are unsure of an ID, choose a well-known work where the ID is stable.
`;

const READING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    lens: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        definition: { type: Type.STRING },
      },
      required: ["name", "definition"],
    },
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          position: { type: Type.STRING, enum: ["I", "II", "III"] },
          role: { type: Type.STRING, enum: ["The Provocation", "The Response", "The Parallel"] },
          met_object_id: { type: Type.INTEGER },
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          date: { type: Type.STRING },
          culture: { type: Type.STRING },
          reading: { type: Type.STRING },
          visual_detail: { type: Type.STRING },
          connection_to_previous: { type: Type.STRING, nullable: true },
        },
        required: ["position", "role", "met_object_id", "title", "artist", "date", "culture", "reading", "visual_detail"],
      },
    },
    synthesis: { type: Type.STRING },
  },
  required: ["lens", "cards", "synthesis"],
};

export async function generateReading(): Promise<Reading> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a new art reading.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: READING_SCHEMA,
        temperature: 0.9,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as Reading;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
}

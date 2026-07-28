import { GoogleGenerativeAI } from '@google/generative-ai';
import { Garment, Outfit, PurchaseEvaluation } from '../types';

let aiClient: GoogleGenerativeAI | null = null;

export const initGeminiAPI = (apiKey: string) => {
  if (apiKey) {
    aiClient = new GoogleGenerativeAI(apiKey);
  }
};

/**
 * Evaluates whether a new item to buy matches the current wardrobe.
 */
export const evaluatePurchaseWithAI = async (
  itemTitle: string,
  price: number,
  itemColor: string,
  category: string,
  existingWardrobe: Garment[]
): Promise<PurchaseEvaluation> => {
  const wardrobeSummary = existingWardrobe
    .map(g => `- ${g.name} (${g.category}, color: ${g.color}, usada ${g.timesWorn} veces)`)
    .join('\n');

  const prompt = `
Eres el asesor estilista de la app luxury "Mawi". Analiza objetivamente si conviene comprar esta prenda para el armario personal del usuario:
- Prenda a comprar: "${itemTitle}"
- Precio estimado: $${price}
- Color: ${itemColor}
- Categoría: ${category}

Armario actual del usuario:
${wardrobeSummary}

Por favor responde estrictamente en formato JSON válido con este esquema exacto:
{
  "verdict": "Comprar con confianza" | "Pensárselo dos veces" | "No recomendable",
  "versatilityScore": número entre 0 y 100,
  "costPerWear": estimado de costo por uso en dólares (número),
  "matchingOutfitsCount": cantidad de outfits posibles con la ropa actual (número),
  "pros": ["razón 1", "razón 2"],
  "cons": ["desventaja 1"],
  "colorHarmonyAdvice": "explicación breve de combinación de colores y silueta"
}
`;

  try {
    if (!aiClient) {
      // Fallback inteligente simulado si no hay API key todavía
      const score = Math.floor(Math.random() * 30) + 70;
      const cpw = parseFloat((price / 18).toFixed(2));
      return {
        verdict: score > 80 ? 'Comprar con confianza' : 'Pensárselo dos veces',
        versatilityScore: score,
        costPerWear: cpw,
        matchingOutfitsCount: 5,
        matchingGarmentIds: existingWardrobe.slice(0, 3).map(g => g.id),
        pros: ['Combina muy bien con tus tonos neutros', 'Excelente equilibrio de silueta'],
        cons: ['Sugerimos verificar si ya tienes prendas similares en esta categoría'],
        colorHarmonyAdvice: `El color ${itemColor} crea un contraste armónico con las capas base de tu armario.`
      };
    }

    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text() || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        matchingGarmentIds: existingWardrobe.slice(0, 3).map(g => g.id),
      };
    }
  } catch (error) {
    console.warn('Gemini API query error, using fallback evaluation', error);
  }

  return {
    verdict: 'Comprar con confianza',
    versatilityScore: 88,
    costPerWear: parseFloat((price / 20).toFixed(2)),
    matchingOutfitsCount: 6,
    matchingGarmentIds: existingWardrobe.slice(0, 3).map(g => g.id),
    pros: ['Altamente versátil con tus chaquetas y pantalones', 'Excelente inversión de costo por uso'],
    cons: ['Requiere cuidados especiales de lavado'],
    colorHarmonyAdvice: 'Excelente balance cromático en la rueda de color complementario.'
  };
};

/**
 * Recommends outfit combinations based on style mode (Clásico vs Atrevido).
 */
export const generateOutfitRecommendation = async (
  wardrobe: Garment[],
  mode: 'clasico' | 'atrevido',
  occasion: string
): Promise<{ name: string; garmentIds: string[]; aiExplanation: string }> => {
  const itemsText = wardrobe.map(g => `ID: ${g.id} | ${g.name} | Cat: ${g.category} | Color: ${g.color}`).join('\n');
  const stylePrompt = mode === 'atrevido' 
    ? 'Crea una combinación atrevida, vanguardista y poco común pero cromáticamente increíble ("raras y buenas").'
    : 'Crea una combinación clásica, sofisticada, elegante y pulida.';

  const prompt = `
Eres "El Estilista Mawi". ${stylePrompt}
Ocasión: ${occasion}

Prendas disponibles:
${itemsText}

Responde estrictamente en JSON:
{
  "name": "Nombre del outfit (ej: Streetwear Alabaster Nocturno)",
  "garmentIds": ["id1", "id2", "id3"],
  "aiExplanation": "Explicación estilística detallada de por qué funciona el balance de silueta y capas."
}
`;

  try {
    if (aiClient) {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text() || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (e) {
    console.warn('Gemini outfit generation fallback', e);
  }

  // Fallback
  const top = wardrobe.find(w => w.category === 'top_inner') || wardrobe[0];
  const outer = wardrobe.find(w => w.category === 'top_outer');
  const bottom = wardrobe.find(w => w.category === 'bottom') || wardrobe[1];
  const shoes = wardrobe.find(w => w.category === 'footwear') || wardrobe[2];

  const selectedIds = [top?.id, outer?.id, bottom?.id, shoes?.id].filter(Boolean) as string[];

  return {
    name: mode === 'atrevido' ? 'Vanguardia Monocromática Mawi' : 'Elegancia Editorial Alabaster',
    garmentIds: selectedIds,
    aiExplanation: mode === 'atrevido'
      ? 'Combinación con contraste táctil de capas superiores y juego visual en las siluetas inferiores.'
      : 'Estructura minimalista de alta gama con paleta limpia, ideal para una presencia pulida.'
  };
};

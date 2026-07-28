export type GarmentCategory = 
  | 'headwear'       // Gorros, gafas, cadenas, aretes, pañuelos
  | 'top_inner'      // Camisetas, manga larga interior/térmica
  | 'top_outer'      // Sudaderas, chaquetas, abrigos, sacos
  | 'bottom'         // Pantalones, pantalonetas, faldas, joggers
  | 'footwear';      // Sneakers, formales, chanclas, botas

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  imageUrl: string;
  color: string;
  hexColor: string;
  brand?: string;
  price?: number;
  timesWorn: number;
  tags: string[];
  isWishlist?: boolean;
  priority?: 'alta' | 'media' | 'baja';
}

export interface AvatarMeasurements {
  heightCm: number;        // e.g. 175
  weightKg: number;        // e.g. 70
  shoulderWidthCm: number; // e.g. 46
  waistCm: number;         // e.g. 80
  skinToneHue: number;     // 0 - 360 (HSL)
  skinToneSat: number;     // 0 - 100%
  skinToneLight: number;   // 0 - 100%
  bodyShape: 'athletic' | 'slim' | 'average' | 'curvy';
}

export interface Outfit {
  id: string;
  name: string;
  garments: Garment[];
  tags: string[];
  occasion: string;
  isFavorite: boolean;
  createdAt: string;
  aiExplanation?: string;
  styleMode: 'clasico' | 'atrevido';
}

export interface PurchaseEvaluation {
  verdict: 'Comprar con confianza' | 'Pensárselo dos veces' | 'No recomendable';
  versatilityScore: number; // 0 - 100
  costPerWear: number;
  matchingOutfitsCount: number;
  matchingGarmentIds: string[];
  pros: string[];
  cons: string[];
  colorHarmonyAdvice: string;
}

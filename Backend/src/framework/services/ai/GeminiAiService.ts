import {
  IAiService,
  AiRecommendationPromptOptions,
  AiAlternativePromptOptions,
} from '../../../domain/interfaces/services/IAiService';
import {
  RecommendedFoodChoice,
  FoodAlternativeComparison,
} from '../../../domain/entities/Recommendation';
import { CONFIG } from '../../../shared/constants/config';

export class GeminiAiService implements IAiService {
  private apiKey: string;
  private candidateModels = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3-flash-preview',
  ];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || CONFIG.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  private async callGeminiJson<T>(promptText: string, timeoutMs: number = 10000): Promise<T | null> {
    if (!this.apiKey) {
      console.warn('GeminiAiService: GEMINI_API_KEY not configured. Falling back to local curated engine.');
      return null;
    }

    for (const model of this.candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const requestBody = {
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawText) {
            const cleaned = rawText
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();
            return JSON.parse(cleaned) as T;
          }
        } else {
          const errText = await res.text();
          console.warn(`GeminiAiService attempt with model ${model} HTTP ${res.status}:`, errText);
        }
      } catch (err: any) {
        console.warn(`GeminiAiService model ${model} error:`, err.message || err);
      }
    }

    return null;
  }

  public async generatePriorityFoods(
    options: AiRecommendationPromptOptions
  ): Promise<RecommendedFoodChoice[] | null> {
    const {
      goal,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      userAllergies,
      dietaryPreference = 'Non-Vegetarian',
    } = options;

    const allergiesFormatted =
      userAllergies.length > 0 ? userAllergies.join(', ') : 'None reported';

    const promptText = `
You are an expert clinical dietitian AI specializing in personalized medical nutrition.
Generate 4 healthy, distinct recommended priority food choices for this user.

USER PROFILE & CONSTRAINTS:
- Goal: ${goal}
- Target Daily Energy: ${targetCalories} kcal
- Target Daily Protein: ${targetProtein} g
- Target Daily Carbs: ${targetCarbs} g
- Target Daily Fat: ${targetFat} g
- Dietary Preference: ${dietaryPreference}
- CONFIRMED FOOD ALLERGIES & INTOLERANCES: [${allergiesFormatted}]

STRICT SAFETY AND ALLERGEN EXCLUSION RULES (LAYER 1 AI PREVENTION):
1. The user has STRICT MEDICAL ALLERGIES to: [${allergiesFormatted}].
2. NEVER suggest, recommend, or mention ANY food, recipe, sauce, dressing, topping, marinade, stock, broth, or ingredient containing: [${allergiesFormatted}].
3. For example:
   - If Eggs is listed: NO eggs, egg whites, yolks, boiled eggs, omelettes, scrambled eggs, frittatas, mayonnaise, egg noodles, or baked goods with eggs.
   - If Fish is listed: NO fish, salmon, tuna, cod, tilapia, sardines, anchovies, fish sauce, or fish broth.
   - If Chicken is listed: NO chicken breast, chicken curry, chicken broth, chicken soup, or poultry products.
   - If Beef is listed: NO beef steak, beef curry, minced beef, roast beef, or beef stock.
   - If Almond Butter or Almonds is listed: NO almonds, almond butter, almond milk, almond flour, or foods containing almonds.
   - If Peanuts is listed: NO peanuts, peanut butter, peanut oil, peanut flour, or peanut sauces.
4. Check all sauces, dressings, and hidden ingredients.
5. If an ingredient cannot be confirmed 100% allergen-free, DO NOT recommend it.
6. Provide wholesome, nutrient-dense foods tailored to the user's goal (${goal}).

Respond strictly with ONLY a JSON array of 4 items adhering to this schema:
[
  {
    "name": "String (e.g. Herb-Baked Tofu Bowl with Quinoa)",
    "category": "String (e.g. Plant Protein)",
    "description": "String (detailed description)",
    "calories": 250,
    "protein": 22.5,
    "reason": "String (clinical nutrition reason why this fits the user's goal without allergens)",
    "tags": ["Tag1", "Tag2"]
  }
]
`;

    try {
      const result = await this.callGeminiJson<RecommendedFoodChoice[]>(promptText, 9000);
      if (Array.isArray(result) && result.length > 0) {
        return result.map((item) => ({
          name: String(item.name || ''),
          category: String(item.category || 'Healthy Food'),
          description: String(item.description || ''),
          calories: Math.round(Number(item.calories) || 200),
          protein: Math.round((Number(item.protein) || 10) * 10) / 10,
          reason: String(item.reason || 'Nutrient-rich option tailored to your goal.'),
          tags: Array.isArray(item.tags) ? item.tags : ['Nutritious'],
        }));
      }
    } catch (err) {
      console.error('Error generating AI priority foods:', err);
    }

    return null;
  }

  public async generateFoodAlternative(
    options: AiAlternativePromptOptions
  ): Promise<FoodAlternativeComparison | null> {
    const { foodQuery, goal, userAllergies } = options;

    const allergiesFormatted =
      userAllergies.length > 0 ? userAllergies.join(', ') : 'None reported';

    const promptText = `
You are a clinical nutrition AI. The user is asking for a healthier food alternative to: "${foodQuery}".

USER CONSTRAINTS:
- Goal: ${goal}
- STRICT MEDICAL ALLERGIES: [${allergiesFormatted}]

SAFETY RULES:
1. The suggested alternative MUST NOT contain ANY of the user's allergens: [${allergiesFormatted}].
2. For example, if allergic to Chicken, DO NOT suggest grilled chicken. If allergic to Almonds, DO NOT suggest almond butter or almond milk. If allergic to Peanuts, DO NOT suggest peanut butter. If allergic to Eggs, DO NOT suggest hard-boiled eggs.
3. Suggest a healthier, delicious alternative aligned with the goal (${goal}).

Respond strictly with ONLY a JSON object adhering to this schema:
{
  "originalFood": {
    "name": "${foodQuery}",
    "calories": 400,
    "protein": 5,
    "carbohydrates": 45,
    "fat": 20,
    "sugar": 10,
    "sodium": 350,
    "servingSize": 100,
    "servingUnit": "g"
  },
  "alternativeFood": {
    "name": "String (e.g. Crispy Roasted Chickpeas)",
    "calories": 180,
    "protein": 8,
    "carbohydrates": 26,
    "fat": 4,
    "sugar": 2,
    "sodium": 95,
    "servingSize": 100,
    "servingUnit": "g"
  },
  "reason": "String explaining nutritional advantage",
  "calorieSavings": 220,
  "proteinDifference": 3,
  "healthBenefit": "String describing specific health improvement"
}
`;

    try {
      const result = await this.callGeminiJson<FoodAlternativeComparison>(promptText, 9000);
      if (result && result.alternativeFood && result.originalFood) {
        return {
          originalFood: {
            name: result.originalFood.name || foodQuery,
            calories: Math.round(Number(result.originalFood.calories) || 350),
            protein: Math.round((Number(result.originalFood.protein) || 5) * 10) / 10,
            carbohydrates: Math.round((Number(result.originalFood.carbohydrates) || 40) * 10) / 10,
            fat: Math.round((Number(result.originalFood.fat) || 15) * 10) / 10,
            sugar: Math.round((Number(result.originalFood.sugar) || 0) * 10) / 10,
            sodium: Math.round(Number(result.originalFood.sodium) || 0),
            servingSize: Number(result.originalFood.servingSize) || 100,
            servingUnit: result.originalFood.servingUnit || 'g',
          },
          alternativeFood: {
            name: result.alternativeFood.name,
            calories: Math.round(Number(result.alternativeFood.calories) || 200),
            protein: Math.round((Number(result.alternativeFood.protein) || 10) * 10) / 10,
            carbohydrates: Math.round((Number(result.alternativeFood.carbohydrates) || 25) * 10) / 10,
            fat: Math.round((Number(result.alternativeFood.fat) || 5) * 10) / 10,
            sugar: Math.round((Number(result.alternativeFood.sugar) || 0) * 10) / 10,
            sodium: Math.round(Number(result.alternativeFood.sodium) || 0),
            servingSize: Number(result.alternativeFood.servingSize) || 100,
            servingUnit: result.alternativeFood.servingUnit || 'g',
          },
          reason: result.reason || 'Nutritious swap with superior macro profile.',
          calorieSavings: Math.max(0, Math.round(Number(result.calorieSavings) || 0)),
          proteinDifference: Math.round((Number(result.proteinDifference) || 0) * 10) / 10,
          healthBenefit: result.healthBenefit || 'Significantly reduces processed fats and stabilizes energy.',
        };
      }
    } catch (err) {
      console.error('Error generating AI food alternative:', err);
    }

    return null;
  }
}

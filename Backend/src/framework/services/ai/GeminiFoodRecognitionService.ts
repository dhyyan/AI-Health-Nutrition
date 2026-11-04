import { GoogleGenAI, Type } from '@google/genai';
import {
  IFoodRecognitionService,
  RecognizedFoodResult,
  RecognizedFoodItem,
  TotalNutritionSummary,
} from '../../../domain/interfaces/services/IFoodRecognitionService';
import { CONFIG } from '../../../shared/constants/config';

export class GeminiFoodRecognitionService implements IFoodRecognitionService {
  private apiKey: string;
  private candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
  ];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || CONFIG.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  async recognizeFoodFromImage(
    imageBuffer: Buffer,
    mimeType: string = 'image/jpeg'
  ): Promise<RecognizedFoodResult> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in backend environment');
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Image file buffer is empty or invalid.');
    }

    const base64Image = imageBuffer.toString('base64');
    const promptText = `
You are an expert clinical nutritionist and computer vision AI system specializing in visual dietary assessment and meal recognition.

TASK:
Analyze the uploaded image to determine whether it contains recognizable food, dishes, ingredients, or beverages, and perform a detailed nutritional analysis.

IMAGE CLASSIFICATION RULES:
1. FOOD IMAGES ("isFood": true):
   - You MUST classify the image as food ("isFood": true) if it displays any edible meal, dish, snack, beverage, fruit, vegetable, bakery item, or ingredient.
   - Mixed & Plated Dishes: Accurately identify mixed meals and composite dishes. For example:
     * Biryani dishes (e.g. Chicken Biryani, Mutton Biryani, Vegetable Biryani): recognize the overall meal and break down visible components like spiced basmati rice, chicken/meat pieces, boiled eggs, fried onions, fresh mint/coriander garnish, and accompaniments (raita, salan/curry).
     * Rice bowls with curry, dal, stew, or sautéed meats/vegetables.
     * Salads, poke bowls, noodle dishes, pasta, stir-fries, soups.
     * Pizza, burgers, sandwiches, wraps, tacos.
     * Breakfast plates (e.g. eggs, toast, fruit, oatmeal, pancakes).
   - Food in Real Settings: If food is pictured with dining utensils, plates, cups, table settings, or hands holding food, or a person eating/holding a plate, classify as FOOD ("isFood": true) and focus analysis strictly on the food items.
   - Do NOT reject genuine food photographs simply because some ingredients are mixed, cooking oils are not measurable visually, or exact portion size is an approximation. Estimate visual portions reasonably.

2. NON-FOOD IMAGES ("isFood": false, "isUnclear": false):
   - ONLY classify as NON-FOOD if there is NO edible food or beverage anywhere in the image.
   - Examples: human selfie/portrait without food, pets/animals without food, mobile phones, computers/laptops, electronics, vehicles, landscapes, furniture, empty dishes/tables, documents, clothing, or random non-food household items.
   - Set "isFood": false, "message": "No food detected. Please upload a clear photograph of your meal.". Do NOT invent food items or nutritional data. Set "calories": 0, "protein": 0, "carbohydrates": 0, "fat": 0, "foodItems": [].

3. BLURRY / UNCLEAR IMAGES ("isFood": false, "isUnclear": true):
   - ONLY classify as UNCLEAR if the photograph is so heavily blurred, distorted, pitch black, or unidentifiable that neither food nor objects can be recognized.
   - Set "isFood": false, "isUnclear": true, "message": "The image is too blurry or unclear to identify any food items. Please upload a clearer photograph of your meal.". Set "calories": 0, "protein": 0, "carbohydrates": 0, "fat": 0, "foodItems": [].
`;

    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    let lastError: string = '';

    for (const model of this.candidateModels) {
      // Try model with up to 1 retry on 503 transient spike
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`[GeminiFoodRecognitionService] Attempting analysis with model: ${model} (attempt ${attempt})...`);
          
          const generatePromise = ai.models.generateContent({
            model,
            contents: [
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              promptText,
            ],
            config: {
              temperature: 0.1,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  isFood: { type: Type.BOOLEAN },
                  isUnclear: { type: Type.BOOLEAN },
                  message: { type: Type.STRING },
                  foodName: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  portionEstimate: { type: Type.STRING },
                  servingSize: { type: Type.NUMBER },
                  servingUnit: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbohydrates: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  fiber: { type: Type.NUMBER },
                  healthRating: { type: Type.STRING },
                  healthReasoning: { type: Type.STRING },
                  dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  healthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  foodItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        estimatedQuantity: { type: Type.STRING },
                        estimatedCalories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbohydrates: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                        fiber: { type: Type.NUMBER },
                        confidence: { type: Type.STRING },
                        visibleIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        inferredIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        potentialAllergens: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['name', 'estimatedCalories', 'protein', 'carbohydrates', 'fat'],
                    },
                  },
                  analysis: { type: Type.STRING },
                  limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['isFood', 'calories', 'protein', 'carbohydrates', 'fat', 'foodItems'],
              },
            },
          });

          // 35s timeout protection against unresponsive network/models
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after 35000ms on model ${model}`)), 35000)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);
          const rawText = response.text || '';
          console.log(`[GeminiFoodRecognitionService] Raw Gemini Response from model ${model}:\n`, rawText);

          if (rawText) {
            return this.parseJsonResponse(rawText);
          }
        } catch (err: any) {
          lastError = err?.message || String(err);
          console.warn(`[GeminiFoodRecognitionService] Model ${model} (attempt ${attempt}) failed:`, lastError);

          // Check if image data is invalid/corrupted
          if (
            lastError.includes('INVALID_ARGUMENT') ||
            lastError.includes('Unable to process input image') ||
            lastError.includes('image could not be decoded')
          ) {
            throw new Error('Invalid or corrupted image data. The AI model could not decode this photograph.');
          }

          // If 503 transient spike on first attempt, back off 1500ms and retry
          if (lastError.includes('503') && attempt === 1) {
            console.log(`[GeminiFoodRecognitionService] Retrying ${model} after 1500ms backoff...`);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }

          // For 429 quota exhaustion or timeouts, move immediately to next candidate
          break;
        }
      }
    }

    console.error('[GeminiFoodRecognitionService] All candidate AI models failed.', lastError);
    throw new Error(
      'AI food recognition service is temporarily unavailable. Please try again in a few moments.'
    );
  }

  private parseJsonResponse(rawText: string): RecognizedFoodResult {
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      // Fallback sanitization for unquoted keys or trailing commas
      try {
        let sanitized = cleanedText.replace(/,\s*([}\]])/g, '$1');
        sanitized = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');
        parsed = JSON.parse(sanitized);
      } catch (secondErr) {
        console.error('Failed to parse Gemini vision JSON output. Raw output was:', rawText);
        throw new Error(
          'Unable to parse AI vision response. Please upload a clearer photograph and try again.'
        );
      }
    }

    // 1. Inspect Food Identification Signals
    const rawItems: any[] = Array.isArray(parsed.foodItems) ? parsed.foodItems : [];
    
    // Check if foodItems contains recognizable components
    const hasRecognizedFoodItems = rawItems.some((item) => {
      if (!item || typeof item !== 'object') return false;
      const itemName = String(item.name || '').trim().toLowerCase();
      return (
        itemName.length > 0 &&
        !['none', 'no food', 'n/a', 'unknown', 'non-food', 'not food', 'unclear', 'null'].includes(itemName)
      );
    });

    // Check if foodName contains a valid recognizable dish/food title
    const parsedFoodName = String(parsed.foodName || '').trim();
    const hasRecognizedFoodName =
      parsedFoodName.length > 0 &&
      !['none', 'no food', 'n/a', 'unknown', 'non-food', 'not food', 'unclear', 'no food detected', 'null'].includes(
        parsedFoodName.toLowerCase()
      );

    const isExplicitlyUnclear = parsed.isUnclear === true || parsed.isUnclear === 'true';
    const isExplicitlyFood = parsed.isFood === true || parsed.isFood === 'true';

    // ROBUST FOOD CLASSIFICATION:
    // If the model identified recognized food components OR a recognizable dish name,
    // OR explicitly marked isFood: true, then it IS FOOD.
    // It is ONLY classified as non-food if:
    // 1) It is explicitly unclear/blurry, OR
    // 2) There are NO recognized food items AND NO recognized food name AND isFood is not true.
    const isFood = (isExplicitlyFood || hasRecognizedFoodItems || hasRecognizedFoodName) && !isExplicitlyUnclear;

    // 2. NON-FOOD OR UNCLEAR IMAGE DETECTED
    if (!isFood) {
      const message =
        parsed.message ||
        (isExplicitlyUnclear
          ? 'The image is too blurry or unclear to identify any food items. Please upload a clearer photograph of your meal.'
          : 'No food detected. Please upload a clear photograph of your meal.');

      return {
        isFood: false,
        message,
        isUnclear: isExplicitlyUnclear,
        foodItems: [],
        totalNutrition: null,
        foodName: '',
        confidence: 0,
        portionEstimate: '',
        servingSize: 0,
        servingUnit: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        healthRating: 'moderate',
        healthReasoning: message,
        dietaryTags: [],
        healthTips: [],
        analysis: '',
        limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
      };
    }

    // 3. FOOD DETECTED — Parse Components and Nutrition
    const foodItems: RecognizedFoodItem[] = rawItems.map((item: any) => ({
      name: String(item.name || 'Identified Food Item'),
      estimatedQuantity: String(item.estimatedQuantity || '1 portion'),
      estimatedCalories: Math.round(Number(item.estimatedCalories) || 0),
      protein: Math.round((Number(item.protein) || 0) * 10) / 10,
      carbohydrates: Math.round((Number(item.carbohydrates) || 0) * 10) / 10,
      fat: Math.round((Number(item.fat) || 0) * 10) / 10,
      fiber: Math.round((Number(item.fiber) || 0) * 10) / 10,
      confidence: ['high', 'medium', 'low'].includes(item.confidence) ? item.confidence : 'medium',
      visibleIngredients: Array.isArray(item.visibleIngredients)
        ? item.visibleIngredients.map((v: any) => String(v))
        : [],
      inferredIngredients: Array.isArray(item.inferredIngredients)
        ? item.inferredIngredients.map((i: any) => String(i))
        : [],
      potentialAllergens: Array.isArray(item.potentialAllergens)
        ? item.potentialAllergens.map((a: any) => String(a))
        : [],
    }));

    // Calculate or map totalNutrition
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    if (parsed.totalNutrition && typeof parsed.totalNutrition === 'object') {
      totalCalories = Math.round(Number(parsed.totalNutrition.calories) || 0);
      totalProtein = Math.round((Number(parsed.totalNutrition.protein) || 0) * 10) / 10;
      totalCarbs = Math.round((Number(parsed.totalNutrition.carbohydrates) || 0) * 10) / 10;
      totalFat = Math.round((Number(parsed.totalNutrition.fat) || 0) * 10) / 10;
      totalFiber = Math.round((Number(parsed.totalNutrition.fiber) || 0) * 10) / 10;
    }

    // If totalNutrition was 0 or missing, aggregate from foodItems
    if (totalCalories === 0 && foodItems.length > 0) {
      for (const item of foodItems) {
        totalCalories += item.estimatedCalories;
        totalProtein += item.protein;
        totalCarbs += item.carbohydrates;
        totalFat += item.fat;
        totalFiber += item.fiber || 0;
      }
    }

    // If still 0, fallback to root values if present
    if (totalCalories === 0 && Number(parsed.calories) > 0) {
      totalCalories = Math.round(Number(parsed.calories));
      totalProtein = Math.round((Number(parsed.protein) || 0) * 10) / 10;
      totalCarbs = Math.round((Number(parsed.carbohydrates) || 0) * 10) / 10;
      totalFat = Math.round((Number(parsed.fat) || 0) * 10) / 10;
      totalFiber = Math.round((Number(parsed.fiber) || 0) * 10) / 10;
    }

    const totalNutrition: TotalNutritionSummary = {
      calories: totalCalories,
      protein: Math.round(totalProtein * 10) / 10,
      carbohydrates: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
    };

    const foodName =
      hasRecognizedFoodName
        ? parsedFoodName
        : (foodItems[0]?.name ?? 'Scanned Meal Plate');

    const confidence =
      typeof parsed.confidence === 'number'
        ? Math.min(0.99, Math.max(0.5, parsed.confidence))
        : 0.88;
    const portionEstimate = parsed.portionEstimate || '1 serving';
    const servingSize = Number(parsed.servingSize) || 1;
    const servingUnit = parsed.servingUnit || 'serving';

    const healthRating = ['healthy', 'unhealthy', 'moderate'].includes(parsed.healthRating)
      ? parsed.healthRating
      : 'moderate';

    const healthReasoning =
      parsed.healthReasoning ||
      `Recognized ${foodName} containing estimated ${totalCalories} calories with balanced macronutrients.`;

    const dietaryTags =
      Array.isArray(parsed.dietaryTags) && parsed.dietaryTags.length > 0
        ? parsed.dietaryTags.map((t: any) => String(t))
        : ['Wholesome'];

    const healthTips =
      Array.isArray(parsed.healthTips) && parsed.healthTips.length > 0
        ? parsed.healthTips.map((t: any) => String(t))
        : ['Mind portion sizes and stay well hydrated.'];

    const analysis =
      parsed.analysis ||
      `Visual AI nutritional analysis of ${foodName} containing an estimated ${totalCalories} kcal.`;

    const limitations =
      Array.isArray(parsed.limitations) && parsed.limitations.length > 0
        ? parsed.limitations.map((l: any) => String(l))
        : [
            'Nutritional values are visual AI estimates and may vary based on hidden cooking oils, seasonings, and exact portion size.',
            'Visual analysis cannot guarantee the absence of allergens or cross-contamination.',
          ];

    return {
      isFood: true,
      message: 'Food recognized and analyzed successfully',
      isUnclear: false,
      foodItems,
      totalNutrition,
      foodName,
      confidence,
      portionEstimate,
      servingSize,
      servingUnit,
      calories: totalCalories,
      protein: totalNutrition.protein,
      carbohydrates: totalNutrition.carbohydrates,
      fat: totalNutrition.fat,
      fiber: totalNutrition.fiber || 0,
      healthRating,
      healthReasoning,
      dietaryTags,
      healthTips,
      analysis,
      limitations,
    };
  }
}

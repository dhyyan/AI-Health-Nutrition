import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { FoodItem, MicronutrientInfo } from '../../domain/entities/FoodItem';
import { AnalyzeNutritionDTO, NutritionAnalysisResultDTO } from '../../domain/interfaces/DTOs/NutritionDTOs';

export class AnalyzeNutritionUseCase {
  constructor(private nutritionDatabaseService: INutritionDatabaseService) {}

  async execute(dto: AnalyzeNutritionDTO): Promise<NutritionAnalysisResultDTO> {
    const { foodId, foodName, servingSize, servingUnit } = dto;

    let foodItem: FoodItem | null = null;

    if (foodId) {
      foodItem = await this.nutritionDatabaseService.getFoodById(foodId);
    }

    if (!foodItem && foodName) {
      foodItem = await this.nutritionDatabaseService.getFoodByName(foodName);
    }

    if (!foodItem && foodName) {
      // Search database for fallback match
      const matches = await this.nutritionDatabaseService.searchFood(foodName, 1);
      if (matches.length > 0) {
        foodItem = matches[0];
      }
    }

    if (!foodItem) {
      throw new Error(`Nutrition data for '${foodName || foodId}' could not be found in nutrition database.`);
    }

    const requestedAmount = Math.max(1, servingSize || foodItem.servingSize);
    const baseServing = foodItem.servingSize > 0 ? foodItem.servingSize : 100;

    // Scaling ratio based on base serving size
    const ratio = requestedAmount / baseServing;

    const scaledCalories = Math.round(foodItem.calories * ratio);
    const scaledProtein = parseFloat((foodItem.protein * ratio).toFixed(1));
    const scaledCarbs = parseFloat((foodItem.carbohydrates * ratio).toFixed(1));
    const scaledFat = parseFloat((foodItem.fat * ratio).toFixed(1));
    const scaledFiber = parseFloat(((foodItem.fiber || 0) * ratio).toFixed(1));
    const scaledSugar = parseFloat(((foodItem.sugar || 0) * ratio).toFixed(1));
    const scaledSodium = Math.round((foodItem.sodium || 0) * ratio);

    const scaledVitaminsAndMinerals: MicronutrientInfo[] = (foodItem.vitaminsAndMinerals || []).map((micro) => {
      const scaledAmount = parseFloat((micro.amount * ratio).toFixed(2));
      const scaledDV = micro.dailyValuePercentage ? Math.round(micro.dailyValuePercentage * ratio) : undefined;
      return {
        name: micro.name,
        amount: scaledAmount,
        unit: micro.unit,
        dailyValuePercentage: scaledDV,
      };
    });

    return {
      foodId: foodItem.id,
      foodName: foodItem.name,
      category: foodItem.category,
      servingSize: requestedAmount,
      servingUnit: servingUnit || foodItem.servingUnit,
      servingOptions: foodItem.servingOptions,
      calories: scaledCalories,
      protein: scaledProtein,
      carbohydrates: scaledCarbs,
      fat: scaledFat,
      fiber: scaledFiber,
      sugar: scaledSugar,
      sodium: scaledSodium,
      vitaminsAndMinerals: scaledVitaminsAndMinerals,
      dataSource: foodItem.dataSource || 'Verified Database',
      imageUrl: foodItem.imageUrl,
      isVerified: foodItem.isVerified ?? true,
    };
  }
}

import { INutritionDatabaseService } from '../../../domain/interfaces/services/INutritionDatabaseService';
import { IFoodRepository } from '../../../domain/interfaces/repositories/IFoodRepository';
import { FoodItem, MicronutrientInfo } from '../../../domain/entities/FoodItem';

export class NutritionDatabaseService implements INutritionDatabaseService {
  constructor(private foodRepository: IFoodRepository) {}

  async searchFood(query: string, limit: number = 20): Promise<FoodItem[]> {
    const localItems = await this.foodRepository.search(query, undefined, limit);
    if (localItems.length >= 3 || !query || query.trim().length < 2) {
      return localItems;
    }

    // External Fallback: Open Food Facts API (Free public endpoint)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query
        )}&search_simple=1&action=process&json=1&page_size=${limit}`
      );
      if (response.ok) {
        const data = await response.json();
        const externalProducts = data.products || [];

        const externalItems: FoodItem[] = externalProducts
          .filter((p: any) => p.product_name && p.nutriments)
          .map((p: any) => {
            const nut = p.nutriments || {};
            const energyKcal = nut['energy-kcal_100g'] || nut['energy-kcal'] || nut['energy_100g'] / 4.184 || 0;
            const protein = nut.proteins_100g || nut.proteins || 0;
            const carbs = nut.carbohydrates_100g || nut.carbohydrates || 0;
            const fat = nut.fat_100g || nut.fat || 0;
            const fiber = nut.fiber_100g || nut.fiber || 0;
            const sugar = nut.sugars_100g || nut.sugars || 0;
            const sodiumMg = (nut.sodium_100g || nut.sodium || 0) * 1000;

            const vitaminsAndMinerals: MicronutrientInfo[] = [];
            if (nut['vitamin-a_100g']) vitaminsAndMinerals.push({ name: 'Vitamin A', amount: nut['vitamin-a_100g'] * 1000, unit: 'mcg' });
            if (nut['vitamin-c_100g']) vitaminsAndMinerals.push({ name: 'Vitamin C', amount: nut['vitamin-c_100g'] * 1000, unit: 'mg' });
            if (nut['calcium_100g']) vitaminsAndMinerals.push({ name: 'Calcium', amount: nut['calcium_100g'] * 1000, unit: 'mg' });
            if (nut['iron_100g']) vitaminsAndMinerals.push({ name: 'Iron', amount: nut['iron_100g'] * 1000, unit: 'mg' });
            if (nut['potassium_100g']) vitaminsAndMinerals.push({ name: 'Potassium', amount: nut['potassium_100g'] * 1000, unit: 'mg' });

            return new FoodItem({
              name: p.product_name,
              category: p.categories_hierarchy?.[0]?.replace('en:', '').replace(/-/g, ' ') || 'Packaged Foods',
              brand: p.brands || 'Open Food Facts Database',
              servingSize: 100,
              servingUnit: 'g',
              calories: Math.round(energyKcal),
              protein: parseFloat(Number(protein).toFixed(1)),
              carbohydrates: parseFloat(Number(carbs).toFixed(1)),
              fat: parseFloat(Number(fat).toFixed(1)),
              fiber: parseFloat(Number(fiber).toFixed(1)),
              sugar: parseFloat(Number(sugar).toFixed(1)),
              sodium: Math.round(sodiumMg),
              vitaminsAndMinerals,
              dataSource: 'Open Food Facts Database',
              imageUrl: p.image_front_small_url || p.image_url || '',
              isVerified: true,
            });
          });

        // Merge local and external without duplicate names
        const combined = [...localItems];
        for (const ext of externalItems) {
          if (!combined.some((item) => item.name.toLowerCase() === ext.name.toLowerCase())) {
            combined.push(ext);
          }
        }
        return combined.slice(0, limit);
      }
    } catch (err) {
      console.warn('Open Food Facts API fallback unavailable:', err);
    }

    return localItems;
  }

  async getFoodById(id: string): Promise<FoodItem | null> {
    return this.foodRepository.findById(id);
  }

  async getFoodByName(name: string): Promise<FoodItem | null> {
    return this.foodRepository.findByName(name);
  }
}

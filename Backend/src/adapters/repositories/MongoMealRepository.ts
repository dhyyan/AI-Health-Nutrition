import { IMealRepository, MealFilterOptions } from '../../domain/interfaces/repositories/IMealRepository';
import { Meal, CreateMealDTO, UpdateMealDTO, MealType, DietaryPreference } from '../../domain/entities/Meal';
import { HealthGoal } from '../../domain/entities/HealthProfile';
import { MealModel, IMealDocument } from '../../framework/database/models/MealModel';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';

export class MongoMealRepository implements IMealRepository {
  private allergyValidator: IAllergyValidationService;

  constructor(allergyValidator?: IAllergyValidationService) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
  }

  private mapDocumentToEntity(doc: IMealDocument): Meal {
    return {
      id: doc._id.toString(),
      name: doc.name,
      mealType: doc.mealType,
      category: doc.category,
      dietaryPreference: doc.dietaryPreference,
      suitableGoals: doc.suitableGoals,
      allergens: doc.allergens || [],
      calories: doc.calories,
      protein: doc.protein,
      carbohydrates: doc.carbohydrates,
      fat: doc.fat,
      fiber: doc.fiber || 0,
      servingSize: doc.servingSize,
      servingUnit: doc.servingUnit,
      ingredients: doc.ingredients || [],
      instructions: doc.instructions,
      imageUrl: doc.imageUrl,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(mealData: CreateMealDTO): Promise<Meal> {
    const created = await MealModel.create(mealData);
    return this.mapDocumentToEntity(created);
  }

  async findById(id: string): Promise<Meal | null> {
    const found = await MealModel.findById(id);
    if (!found) return null;
    return this.mapDocumentToEntity(found);
  }

  async findAll(options: MealFilterOptions = {}): Promise<Meal[]> {
    const query: any = {};

    if (options.mealType) {
      query.mealType = options.mealType;
    }
    if (options.goal) {
      query.suitableGoals = options.goal;
    }
    if (options.dietaryPreference) {
      query.dietaryPreference = options.dietaryPreference;
    }
    if (options.search && options.search.trim()) {
      query.name = { $regex: options.search.trim(), $options: 'i' };
    }

    const docs = await MealModel.find(query)
      .limit(options.limit || 100)
      .sort({ createdAt: -1 });

    const meals = docs.map((doc) => this.mapDocumentToEntity(doc));

    if (options.excludeAllergens && options.excludeAllergens.length > 0) {
      const { valid } = this.allergyValidator.filterMeals(meals, options.excludeAllergens);
      return valid;
    }

    return meals;
  }

  async update(id: string, mealData: UpdateMealDTO): Promise<Meal | null> {
    const updated = await MealModel.findByIdAndUpdate(id, mealData, { new: true });
    if (!updated) return null;
    return this.mapDocumentToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await MealModel.findByIdAndDelete(id);
    return !!result;
  }

  async findSuitableMealsForSlot(
    mealType: MealType,
    goal: HealthGoal,
    dietaryPreference: DietaryPreference,
    excludeAllergens: string[]
  ): Promise<Meal[]> {
    const query: any = {
      mealType,
      suitableGoals: goal,
    };

    if (dietaryPreference && dietaryPreference !== 'Non-Vegetarian') {
      if (dietaryPreference === 'Vegetarian') {
        query.dietaryPreference = { $in: ['Vegetarian', 'Vegan'] };
      } else {
        query.dietaryPreference = dietaryPreference;
      }
    }

    // Pre-filter at MongoDB query level using known aliases for excluded allergens
    if (excludeAllergens && excludeAllergens.length > 0) {
      const allAliases: string[] = [];
      for (const allergy of excludeAllergens) {
        const aliases = this.allergyValidator.getAllergenAliases(allergy);
        allAliases.push(...aliases);
      }
      const uniqueAliases = Array.from(new Set(allAliases));
      if (uniqueAliases.length > 0) {
        const regexList = uniqueAliases.map((a) => new RegExp(`\\b${a.trim()}\\b`, 'i'));
        // Exclude meals where allergens array matches any alias
        query.allergens = { $nin: regexList };
      }
    }

    const docs = await MealModel.find(query).limit(100);
    const candidateMeals = docs.map((doc) => this.mapDocumentToEntity(doc));

    // STRICT LAYER 2 BACKEND ENFORCEMENT:
    // Run all candidates through AllergyValidationService to inspect name, ingredients, instructions
    if (excludeAllergens && excludeAllergens.length > 0) {
      const { valid } = this.allergyValidator.filterMeals(candidateMeals, excludeAllergens);
      return valid;
    }

    return candidateMeals;
  }
}

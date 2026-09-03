import { IMealRepository, MealFilterOptions } from '../../domain/interfaces/repositories/IMealRepository';
import { Meal, CreateMealDTO, UpdateMealDTO, MealType, DietaryPreference } from '../../domain/entities/Meal';
import { HealthGoal } from '../../domain/entities/HealthProfile';
import { MealModel, IMealDocument } from '../../framework/database/models/MealModel';

export class MongoMealRepository implements IMealRepository {
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
    if (options.excludeAllergens && options.excludeAllergens.length > 0) {
      query.allergens = { $nin: options.excludeAllergens };
    }
    if (options.search && options.search.trim()) {
      query.name = { $regex: options.search.trim(), $options: 'i' };
    }

    const docs = await MealModel.find(query)
      .limit(options.limit || 100)
      .sort({ createdAt: -1 });

    return docs.map((doc) => this.mapDocumentToEntity(doc));
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

    if (excludeAllergens && excludeAllergens.length > 0) {
      // Exclude meals containing any of the excluded allergens (case insensitive match)
      const allergenRegexes = excludeAllergens.map((a) => new RegExp(`^${a.trim()}$`, 'i'));
      query.allergens = { $nin: allergenRegexes };
    }

    const docs = await MealModel.find(query).limit(50);
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }
}

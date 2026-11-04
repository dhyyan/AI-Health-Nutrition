import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AllergyValidationService } from '../framework/services/allergy/AllergyValidationService';
import { GeneratePersonalizedRecommendationsUseCase } from '../useCases/recommendation/GeneratePersonalizedRecommendationsUseCase';
import { GetFoodAlternativesUseCase } from '../useCases/recommendation/GetFoodAlternativesUseCase';
import { GenerateMealPlanUseCase } from '../useCases/meal/GenerateMealPlanUseCase';
import { GetUserMealPlanUseCase } from '../useCases/meal/GetUserMealPlanUseCase';
import { SwapMealOptionUseCase } from '../useCases/meal/SwapMealOptionUseCase';
import { UpdateHealthProfileUseCase } from '../useCases/user/UpdateHealthProfileUseCase';
import { HealthProfile } from '../domain/entities/HealthProfile';
import { Meal, MealPlan } from '../domain/entities/Meal';
import { IHealthProfileRepository } from '../domain/interfaces/repositories/IHealthProfileRepository';
import { IFoodLogRepository } from '../domain/interfaces/repositories/IFoodLogRepository';
import { IMealRepository } from '../domain/interfaces/repositories/IMealRepository';
import { IMealPlanRepository } from '../domain/interfaces/repositories/IMealPlanRepository';
import { IUserRepository } from '../domain/interfaces/repositories/IUserRepository';
import { INutritionDatabaseService } from '../domain/interfaces/services/INutritionDatabaseService';
import { IAiService } from '../domain/interfaces/services/IAiService';

// Mock Repositories for Unit / Integration Testing
class MockHealthProfileRepository implements IHealthProfileRepository {
  public profiles: Map<string, HealthProfile> = new Map();

  async findByUserId(userId: string): Promise<HealthProfile | null> {
    return this.profiles.get(userId) || null;
  }

  async upsert(profile: HealthProfile): Promise<HealthProfile> {
    this.profiles.set(profile.userId, profile);
    return profile;
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    return this.profiles.delete(userId);
  }
}

class MockFoodLogRepository implements IFoodLogRepository {
  async create(log: any): Promise<any> { return log; }
  async findById(id: string): Promise<any> { return null; }
  async findByUserId(userId: string, limit?: number): Promise<any[]> { return []; }
  async findByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<any[]> { return []; }
  async delete(id: string): Promise<boolean> { return true; }
  async deleteById(id: string): Promise<boolean> { return true; }
}

class MockMealRepository implements IMealRepository {
  public meals: Meal[] = [];

  constructor(meals: Meal[]) {
    this.meals = meals;
  }

  async create(mealData: any): Promise<Meal> { return mealData as Meal; }
  async findById(id: string): Promise<Meal | null> {
    return this.meals.find((m) => m.id === id) || null;
  }
  async findAll(options?: any): Promise<Meal[]> { return this.meals; }
  async update(id: string, mealData: any): Promise<Meal | null> { return null; }
  async delete(id: string): Promise<boolean> { return true; }
  async findSuitableMealsForSlot(
    slot: any,
    goal: any,
    pref: any,
    excludeAllergens: string[]
  ): Promise<Meal[]> {
    const validator = new AllergyValidationService();
    return this.meals.filter((m) => {
      if (m.mealType !== slot) return false;
      const check = validator.validateMeal(m, excludeAllergens);
      return check.isValid;
    });
  }
}

class MockMealPlanRepository implements IMealPlanRepository {
  public plans: Map<string, MealPlan> = new Map();

  async createOrUpdate(mealPlan: MealPlan): Promise<MealPlan> {
    this.plans.set(mealPlan.userId, mealPlan);
    return mealPlan;
  }

  async findByUserId(userId: string): Promise<MealPlan | null> {
    return this.plans.get(userId) || null;
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    return this.plans.delete(userId);
  }
}

class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<any> {
    return { id, name: 'Test User', email: 'test@example.com', role: 'user' };
  }
  async findByEmail(email: string): Promise<any> { return null; }
  async create(user: any): Promise<any> { return user; }
  async update(user: any): Promise<any> { return user; }
  async delete(id: string): Promise<boolean> { return true; }
  async findAll(): Promise<any[]> { return []; }
  async count(): Promise<number> { return 0; }
}

class MockNutritionDatabaseService implements INutritionDatabaseService {
  async searchFood(query: string, limit?: number): Promise<any[]> { return []; }
  async getFoodById(id: string): Promise<any> { return null; }
  async getFoodByName(name: string): Promise<any> { return null; }
}

// Mock AI Service that can simulate bad / rogue Gemini outputs
class MockAiService implements IAiService {
  public priorityFoodsToReturn: any[] | null = null;
  public alternativeToReturn: any | null = null;

  async generatePriorityFoods(options: any): Promise<any[] | null> {
    return this.priorityFoodsToReturn;
  }

  async generateFoodAlternative(options: any): Promise<any | null> {
    return this.alternativeToReturn;
  }
}

describe('Strict Allergy Filtering & Validation Test Suite', () => {
  const allergyValidator = new AllergyValidationService();

  // --------------------------------------------------------------------------
  // Scenario 1: User has an egg allergy -> AI suggests an omelette -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 1: User has an egg allergy -> AI suggests an omelette -> REJECT', () => {
    const candidate = {
      name: 'Fluffy Spanish Omelette with Herbs',
      ingredients: ['Eggs', 'Potatoes', 'Onion', 'Olive Oil'],
      instructions: 'Beat the eggs and cook until set with sautéed potatoes.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Eggs']);
    assert.strictEqual(result.isValid, false, 'Omelette must be rejected for egg allergy');
    assert.ok(result.detectedAllergens.includes('Eggs'), 'Must identify Eggs as restricted allergen');
  });

  // --------------------------------------------------------------------------
  // Scenario 2: User has an egg allergy -> AI suggests boiled eggs -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 2: User has an egg allergy -> AI suggests boiled eggs -> REJECT', () => {
    const candidate = {
      name: 'Whole Boiled Eggs (2 pcs)',
      ingredients: ['Whole eggs', 'Water', 'Pinch of salt'],
      instructions: 'Boil eggs in hot water for 8 minutes and peel.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Eggs']);
    assert.strictEqual(result.isValid, false, 'Boiled eggs must be rejected for egg allergy');
    assert.ok(result.detectedAllergens.includes('Eggs'));
  });

  // --------------------------------------------------------------------------
  // Scenario 3: User has a peanut allergy -> AI suggests peanut butter -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 3: User has a peanut allergy -> AI suggests peanut butter -> REJECT', () => {
    const candidate = {
      name: 'Whole Grain Toast with Creamy Peanut Butter & Banana',
      ingredients: ['Whole Wheat Toast', 'Peanut Butter', 'Sliced Banana'],
      instructions: 'Spread creamy peanut butter evenly over warm toast.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Peanuts']);
    assert.strictEqual(result.isValid, false, 'Peanut butter must be rejected for peanut allergy');
    assert.ok(result.detectedAllergens.includes('Peanuts'));
  });

  // --------------------------------------------------------------------------
  // Scenario 4: User has an almond butter allergy -> AI suggests almond milk -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 4: User has an almond butter allergy -> AI suggests almond milk -> REJECT', () => {
    const candidate = {
      name: 'Creamy Berry Oats Porridge',
      ingredients: ['Rolled Oats', 'Unsweetened Almond Milk', 'Blueberries'],
      instructions: 'Simmer rolled oats in almond milk until rich and creamy.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Almond Butter']);
    assert.strictEqual(result.isValid, false, 'Almond milk must be rejected when Almond Butter is restricted');
    assert.ok(result.detectedAllergens.includes('Almond Butter'));
  });

  // --------------------------------------------------------------------------
  // Scenario 5: User has a chicken allergy -> AI suggests grilled chicken -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 5: User has a chicken allergy -> AI suggests grilled chicken -> REJECT', () => {
    const candidate = {
      name: 'Herb-Marinated Grilled Chicken Breast Bowl',
      ingredients: ['Boneless Chicken Breast', 'Steamed Quinoa', 'Rosemary Oil'],
      instructions: 'Char-grill chicken breast over medium heat for 6 minutes per side.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Chicken']);
    assert.strictEqual(result.isValid, false, 'Grilled chicken must be rejected for chicken allergy');
    assert.ok(result.detectedAllergens.includes('Chicken'));
  });

  // --------------------------------------------------------------------------
  // Scenario 6: User has a fish allergy -> AI suggests fish curry -> REJECT
  // --------------------------------------------------------------------------
  it('Scenario 6: User has a fish allergy -> AI suggests fish curry -> REJECT', () => {
    const candidate = {
      name: 'Traditional Coastal Fish Curry',
      ingredients: ['Atlantic Salmon Cubes', 'Coconut Milk', 'Curry Spices'],
      instructions: 'Simmer fresh fish fillets in aromatic tamarind coconut sauce.',
    };
    const result = allergyValidator.validateMeal(candidate, ['Fish']);
    assert.strictEqual(result.isValid, false, 'Fish curry must be rejected for fish allergy');
    assert.ok(result.detectedAllergens.includes('Fish'));
  });

  // --------------------------------------------------------------------------
  // Scenario 7: User has no food allergies -> Normal recommendations should work
  // --------------------------------------------------------------------------
  it('Scenario 7: User has no food allergies -> Normal recommendations should work', async () => {
    const healthProfileRepo = new MockHealthProfileRepository();
    const foodLogRepo = new MockFoodLogRepository();
    const aiService = new MockAiService();

    // User profile with NO allergies
    await healthProfileRepo.upsert(
      new HealthProfile({
        userId: 'user-no-allergies',
        age: 28,
        gender: 'female',
        heightCm: 165,
        weightKg: 60,
        bmi: 22.0,
        bmiCategory: 'Normal',
        goal: 'weight_loss',
        foodAllergies: [],
      })
    );

    const useCase = new GeneratePersonalizedRecommendationsUseCase(
      healthProfileRepo,
      foodLogRepo,
      allergyValidator,
      aiService
    );

    const recommendations = await useCase.execute('user-no-allergies');
    assert.ok(recommendations.goalPlan.recommendedFoods.length > 0, 'Should return recommended foods');
    assert.strictEqual(recommendations.excludedAllergies?.length, 0, 'No excluded allergies');
    assert.ok(recommendations.goalPlan.recommendedFoods.length === 4, 'Should provide 4 standard choices');
  });

  // --------------------------------------------------------------------------
  // Scenario 8: User adds a new allergy -> Previous cached recommendations must not remain visible
  // --------------------------------------------------------------------------
  it('Scenario 8: User adds a new allergy -> Previous cached recommendations must not remain visible', async () => {
    const healthProfileRepo = new MockHealthProfileRepository();
    const mealPlanRepo = new MockMealPlanRepository();
    const userRepo = new MockUserRepository();

    // 1. Initial profile: No allergies
    const initialProfile = new HealthProfile({
      userId: 'user-cache-test',
      age: 30,
      gender: 'male',
      heightCm: 175,
      weightKg: 75,
      bmi: 24.5,
      bmiCategory: 'Normal',
      goal: 'weight_loss',
      foodAllergies: [],
    });
    await healthProfileRepo.upsert(initialProfile);

    // Initial meal plan containing eggs
    const stalePlan: MealPlan = {
      userId: 'user-cache-test',
      startDate: '2026-11-04',
      goal: 'weight_loss',
      dietaryPreference: 'Non-Vegetarian',
      excludedAllergies: [],
      weeklySchedule: [
        {
          day: 'Monday',
          meals: {
            breakfast: {
              name: 'Scrambled Eggs on Toast',
              mealType: 'breakfast',
              category: 'High Protein',
              dietaryPreference: 'Vegetarian',
              suitableGoals: ['weight_loss'],
              allergens: ['Eggs'],
              calories: 320,
              protein: 18,
              carbohydrates: 25,
              fat: 14,
              fiber: 3,
              servingSize: 200,
              servingUnit: 'g',
              ingredients: ['Eggs', 'Butter', 'Whole Wheat Toast'],
            },
            lunch: {
              name: 'Quinoa Veggie Bowl',
              mealType: 'lunch',
              category: 'Vegan',
              dietaryPreference: 'Vegan',
              suitableGoals: ['weight_loss'],
              allergens: [],
              calories: 450,
              protein: 15,
              carbohydrates: 60,
              fat: 12,
              fiber: 8,
              servingSize: 300,
              servingUnit: 'g',
              ingredients: ['Quinoa', 'Broccoli', 'Chickpeas'],
            },
            dinner: {
              name: 'Lentil Soup',
              mealType: 'dinner',
              category: 'Vegan',
              dietaryPreference: 'Vegan',
              suitableGoals: ['weight_loss'],
              allergens: [],
              calories: 380,
              protein: 18,
              carbohydrates: 55,
              fat: 6,
              fiber: 10,
              servingSize: 350,
              servingUnit: 'g',
              ingredients: ['Lentils', 'Carrots', 'Vegetable Broth'],
            },
            snack: {
              name: 'Apple with Cinnamon',
              mealType: 'snack',
              category: 'Fruit',
              dietaryPreference: 'Vegan',
              suitableGoals: ['weight_loss'],
              allergens: [],
              calories: 120,
              protein: 1,
              carbohydrates: 28,
              fat: 0,
              fiber: 4,
              servingSize: 150,
              servingUnit: 'g',
              ingredients: ['Apple', 'Cinnamon'],
            },
            totalCalories: 1270,
            totalProtein: 52,
            totalCarbs: 168,
            totalFat: 32,
          },
        },
      ],
      generatedAt: new Date(),
    };
    await mealPlanRepo.createOrUpdate(stalePlan);

    // 2. User updates profile to add 'Eggs' allergy
    const mealRepo = new MockMealRepository([]);
    const generateMealPlanUseCase = new GenerateMealPlanUseCase(
      mealRepo,
      mealPlanRepo,
      healthProfileRepo,
      allergyValidator
    );
    const updateProfileUseCase = new UpdateHealthProfileUseCase(
      userRepo,
      healthProfileRepo,
      undefined,
      mealPlanRepo,
      generateMealPlanUseCase
    );

    await updateProfileUseCase.execute('user-cache-test', {
      age: 30,
      gender: 'male',
      heightCm: 175,
      weightKg: 75,
      foodAllergies: ['Eggs'],
    });

    // 3. Retrieve user meal plan
    const getUserMealPlanUseCase = new GetUserMealPlanUseCase(
      mealPlanRepo,
      generateMealPlanUseCase,
      healthProfileRepo,
      allergyValidator
    );

    const activePlan = await getUserMealPlanUseCase.execute('user-cache-test');

    // Verify stale 'Scrambled Eggs on Toast' is NO LONGER in the active plan
    const mondayBreakfast = activePlan.weeklySchedule.find((d) => d.day === 'Monday')?.meals.breakfast;
    assert.notStrictEqual(mondayBreakfast?.name, 'Scrambled Eggs on Toast');
    const eggCheck = allergyValidator.validateMeal(mondayBreakfast!, ['Eggs']);
    assert.strictEqual(eggCheck.isValid, true, 'New meal plan breakfast must be 100% free of eggs');
    assert.ok(activePlan.excludedAllergies.includes('Eggs'), 'Meal plan must record Eggs as excluded');
  });

  // --------------------------------------------------------------------------
  // Scenario 9: User removes an allergy -> Recommendations should be regenerated using updated profile
  // --------------------------------------------------------------------------
  it('Scenario 9: User removes an allergy -> Recommendations should be regenerated using updated profile', async () => {
    const healthProfileRepo = new MockHealthProfileRepository();
    const foodLogRepo = new MockFoodLogRepository();
    const aiService = new MockAiService();

    // User initially had 'Fish' allergy
    await healthProfileRepo.upsert(
      new HealthProfile({
        userId: 'user-remove-allergy',
        age: 26,
        gender: 'male',
        heightCm: 180,
        weightKg: 80,
        bmi: 24.7,
        bmiCategory: 'Normal',
        goal: 'muscle_gain',
        foodAllergies: ['Fish'],
      })
    );

    const recUseCase = new GeneratePersonalizedRecommendationsUseCase(
      healthProfileRepo,
      foodLogRepo,
      allergyValidator,
      aiService
    );

    const recsWithAllergy = await recUseCase.execute('user-remove-allergy');
    // None of the recommended foods should be fish
    for (const food of recsWithAllergy.goalPlan.recommendedFoods) {
      assert.strictEqual(
        allergyValidator.checkTextForRestrictedAllergens(food.name, ['Fish']).isValid,
        true,
        'Should not contain fish when allergy active'
      );
    }

    // User removes 'Fish' allergy (foodAllergies is now empty)
    await healthProfileRepo.upsert(
      new HealthProfile({
        userId: 'user-remove-allergy',
        age: 26,
        gender: 'male',
        heightCm: 180,
        weightKg: 80,
        bmi: 24.7,
        bmiCategory: 'Normal',
        goal: 'muscle_gain',
        foodAllergies: [],
      })
    );

    const recsWithoutAllergy = await recUseCase.execute('user-remove-allergy');
    assert.strictEqual(recsWithoutAllergy.excludedAllergies?.length, 0);
  });

  // --------------------------------------------------------------------------
  // Scenario 10: Weekly meal plan must be checked across every day and every meal
  // --------------------------------------------------------------------------
  it('Scenario 10: Weekly meal plan must be checked across every day and every meal', async () => {
    const healthProfileRepo = new MockHealthProfileRepository();
    const mealPlanRepo = new MockMealPlanRepository();

    // User has multiple severe allergies: Eggs, Fish, Beef, Chicken, Almond Butter, Peanuts
    const allergies = ['Eggs', 'Fish', 'Beef', 'Chicken', 'Almond Butter', 'Peanuts'];
    await healthProfileRepo.upsert(
      new HealthProfile({
        userId: 'user-multi-allergy',
        age: 27,
        gender: 'female',
        heightCm: 168,
        weightKg: 62,
        bmi: 22.0,
        bmiCategory: 'Normal',
        goal: 'weight_loss',
        foodAllergies: allergies,
      })
    );

    const mealRepo = new MockMealRepository([]);
    const generateMealPlanUseCase = new GenerateMealPlanUseCase(
      mealRepo,
      mealPlanRepo,
      healthProfileRepo,
      allergyValidator
    );

    const plan = await generateMealPlanUseCase.execute('user-multi-allergy');

    assert.strictEqual(plan.weeklySchedule.length, 7, 'Must have 7 days in weekly schedule');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const day of days) {
      const daySchedule = plan.weeklySchedule.find((d) => d.day === day);
      assert.ok(daySchedule, `Schedule for ${day} must exist`);

      const slots = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
      for (const slot of slots) {
        const meal: any = daySchedule.meals[slot];
        assert.ok(meal, `${day} ${slot} meal must exist`);

        const check = allergyValidator.validateMeal(meal, allergies);
        assert.strictEqual(
          check.isValid,
          true,
          `VIOLATION on ${day} ${slot}: "${meal.name}" contains ${check.detectedAllergens.join(', ')}`
        );
      }
    }
  });

  // --------------------------------------------------------------------------
  // Scenario 11: Ingredient hidden inside a sauce or dressing must also be detected
  // --------------------------------------------------------------------------
  it('Scenario 11: Ingredient hidden inside a sauce or dressing must also be detected', () => {
    // 11a: Caesar salad dressing with hidden anchovies / fish sauce
    const caesarSalad = {
      name: 'Classic Caesar Salad Bowl',
      ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
      instructions: 'Toss crisp romaine leaves in homemade creamy caesar dressing with grated parmesan.',
    };
    const fishResult = allergyValidator.validateMeal(caesarSalad, ['Fish']);
    assert.strictEqual(fishResult.isValid, false, 'Caesar dressing contains fish/anchovies and must be rejected');

    // 11b: Thai Noodle bowl with hidden fish sauce in instructions
    const thaiNoodles = {
      name: 'Stir-Fried Vegetable Noodles',
      ingredients: ['Rice Noodles', 'Bell Peppers', 'Carrots', 'Scallions'],
      instructions: 'Wok fry rice noodles and season with authentic fish sauce and lime juice.',
    };
    const fishSauceResult = allergyValidator.validateMeal(thaiNoodles, ['Fish']);
    assert.strictEqual(fishSauceResult.isValid, false, 'Fish sauce in instructions must be rejected');

    // 11c: Chicken Satay skewers with hidden peanut sauce
    const satayDish = {
      name: 'Grilled Tofu Skewers with Satay Glaze',
      ingredients: ['Organic Tofu', 'Peanut Sauce', 'Cucumber Slices'],
      instructions: 'Brush skewers with rich satay peanut sauce and grill.',
    };
    const peanutResult = allergyValidator.validateMeal(satayDish, ['Peanuts']);
    assert.strictEqual(peanutResult.isValid, false, 'Satay peanut sauce must be rejected for peanut allergy');

    // 11d: Aioli sauce containing raw egg yolk
    const aioliBowl = {
      name: 'Roasted Potato Bowl with Garlic Aioli',
      ingredients: ['Fingerling Potatoes', 'Garlic Aioli', 'Chives'],
      instructions: 'Dip roasted potatoes into rich egg garlic aioli.',
    };
    const eggResult = allergyValidator.validateMeal(aioliBowl, ['Eggs']);
    assert.strictEqual(eggResult.isValid, false, 'Aioli / mayonnaise dressing must be rejected for egg allergy');
  });

  // --------------------------------------------------------------------------
  // Scenario 12: Gemini returns invalid or incomplete ingredient info -> Fail safely
  // --------------------------------------------------------------------------
  it('Scenario 12: Gemini returns invalid or incomplete ingredient info -> Fail safely', () => {
    // Empty / missing ingredients
    const unverifiedMeal1 = {
      name: 'Chef Mystery Surprise Platter',
      ingredients: [],
      instructions: '',
    };
    const res1 = allergyValidator.validateMeal(unverifiedMeal1, ['Eggs']);
    assert.strictEqual(res1.isValid, false, 'Must reject meal with empty ingredients and no instructions');
    assert.ok(res1.reason?.includes('Unverified food data'));

    // Missing food name
    const unverifiedMeal2 = {
      name: '',
      ingredients: ['Water'],
    };
    const res2 = allergyValidator.validateMeal(unverifiedMeal2 as any, ['Eggs']);
    assert.strictEqual(res2.isValid, false, 'Must reject candidate with missing name');

    // Null candidate
    const res3 = allergyValidator.validateMeal(null as any, ['Eggs']);
    assert.strictEqual(res3.isValid, false, 'Must reject null meal candidate');
  });
});

export interface MealCandidate {
  id?: string;
  name: string;
  mealType?: string;
  category?: string;
  ingredients?: string[];
  instructions?: string;
  allergens?: string[];
  description?: string;
  reason?: string;
  [key: string]: any;
}

export interface AllergyValidationResult {
  isValid: boolean;
  detectedAllergens: string[];
  reason?: string;
}

export interface FilteredMealsResult<T = MealCandidate> {
  valid: T[];
  rejected: Array<{
    item: T;
    detectedAllergens: string[];
    reason: string;
  }>;
}

export interface IAllergyValidationService {
  /**
   * Normalizes an allergy term (trims, lowercases, handles common variants).
   */
  normalizeAllergy(allergy: string): string;

  /**
   * Expands an allergy term to its associated ingredients, synonyms, and preparations.
   */
  getAllergenAliases(allergy: string): string[];

  /**
   * Validates whether a meal candidate contains any of the user's restricted allergens.
   * Checks meal name, ingredients, instructions, description, category, and pre-tagged allergens.
   * If a meal lacks verifiable ingredients and is ambiguous, fails safely.
   */
  validateMeal(meal: MealCandidate, userAllergies: string[]): AllergyValidationResult;

  /**
   * Checks if a food name or text contains any restricted allergens.
   */
  checkTextForRestrictedAllergens(text: string, userAllergies: string[]): AllergyValidationResult;

  /**
   * Filters an array of meals or food items, separating valid ones from rejected ones.
   */
  filterMeals<T extends MealCandidate>(meals: T[], userAllergies: string[]): FilteredMealsResult<T>;

  /**
   * Returns a safe fallback meal tailored to a slot and goal that is guaranteed free of userAllergies.
   */
  getSafeFallbackMeal(
    slotType: string,
    goal: string,
    dietaryPreference: string,
    userAllergies: string[]
  ): MealCandidate;
}


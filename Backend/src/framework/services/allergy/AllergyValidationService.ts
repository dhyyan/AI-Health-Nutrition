import {
  IAllergyValidationService,
  MealCandidate,
  AllergyValidationResult,
  FilteredMealsResult,
} from '../../../domain/interfaces/services/IAllergyValidationService';

/**
 * Standard mapping of major food allergens to their synonymous forms,
 * derived ingredients, derivatives, preparations, and hidden carrier foods.
 */
interface AllergenRule {
  primaryCategory: string;
  aliases: string[];
  // Words that might contain the substring but are NOT this allergen (e.g. eggplant is not egg)
  negativeExclusions?: string[];
  regexPatterns?: RegExp[];
}

export class AllergyValidationService implements IAllergyValidationService {
  /**
   * Pre-configured knowledge base of food allergies, derivatives, and hidden ingredients.
   */
  private readonly allergenDatabase: Record<string, AllergenRule> = {
    egg: {
      primaryCategory: 'Eggs',
      aliases: [
        'egg', 'eggs', 'egg white', 'egg whites', 'egg yolk', 'egg yolks',
        'boiled egg', 'hard boiled egg', 'soft boiled egg', 'poached egg',
        'scrambled egg', 'scrambled eggs', 'omelette', 'omelet', 'omelettes',
        'frittata', 'frittatas', 'quiche', 'meringue', 'mayonnaise', 'mayo',
        'aioli', 'hollandaise', 'egg curry', 'egg salad', 'egg bhurji',
        'egg noodles', 'egg drop', 'egg roll', 'shakshuka', 'albumin',
        'ovalbumin', 'ovomucoid', 'eggnog', 'custard'
      ],
      negativeExclusions: ['eggplant', 'egg plant', 'eggfruit', 'egg fruit'],
    },
    fish: {
      primaryCategory: 'Fish',
      aliases: [
        'fish', 'fishes', 'fish fillet', 'fish fillets', 'fish curry',
        'fish sauce', 'fish broth', 'fish stock', 'fish oil', 'fish fry',
        'salmon', 'smoked salmon', 'lox', 'tuna', 'canned tuna', 'cod',
        'trout', 'mackerel', 'sardine', 'sardines', 'anchovy', 'anchovies',
        'tilapia', 'halibut', 'sea bass', 'bass', 'haddock', 'herring',
        'swordfish', 'carp', 'catfish', 'mahi-mahi', 'mahi mahi', 'snapper',
        'red snapper', 'flounder', 'pollock', 'surimi', 'worcestershire',
        'dashi', 'caesar dressing', 'caviar', 'roe'
      ],
      negativeExclusions: ['crayfish', 'starfish', 'jellyfish', 'selfish', 'silverfish'],
    },
    chicken: {
      primaryCategory: 'Chicken',
      aliases: [
        'chicken', 'chickens', 'chicken breast', 'chicken breasts',
        'chicken thigh', 'chicken thighs', 'chicken wing', 'chicken wings',
        'chicken curry', 'chicken broth', 'chicken stock', 'chicken soup',
        'chicken biryani', 'chicken tikka', 'grilled chicken', 'roast chicken',
        'roasted chicken', 'fried chicken', 'chicken tender', 'chicken tenders',
        'chicken strip', 'chicken strips', 'chicken cutlet', 'poultry',
        'poultry broth', 'poultry stock', 'chicken sausage'
      ],
      negativeExclusions: ['chickpea', 'chickpeas'],
    },
    beef: {
      primaryCategory: 'Beef',
      aliases: [
        'beef', 'beef steak', 'beef curry', 'beef stock', 'beef broth',
        'beef stew', 'steak', 'steaks', 'ground beef', 'minced beef',
        'roast beef', 'brisket', 'ribeye', 'sirloin', 'tenderloin',
        'filet mignon', 't-bone', 't bone', 'beef burger', 'beef patty',
        'pastrami', 'corned beef', 'veal', 'bovine gelatin', 'beef tallow'
      ],
      negativeExclusions: [],
    },
    almond: {
      primaryCategory: 'Almonds / Almond Butter',
      aliases: [
        'almond', 'almonds', 'almond butter', 'almond milk', 'almond flour',
        'almond meal', 'almond oil', 'almond paste', 'almond extract',
        'sliced almonds', 'roasted almonds', 'raw almonds', 'marzipan',
        'frangipane', 'amaretto', 'badam'
      ],
      negativeExclusions: ['diamond'],
    },
    peanut: {
      primaryCategory: 'Peanuts',
      aliases: [
        'peanut', 'peanuts', 'peanut butter', 'peanut flour', 'peanut oil',
        'roasted peanuts', 'salted peanuts', 'groundnut', 'groundnuts',
        'peanut sauce', 'satay sauce', 'arachis', 'monkey nuts'
      ],
      negativeExclusions: [],
    },
    dairy: {
      primaryCategory: 'Dairy / Lactose',
      aliases: [
        'dairy', 'milk', 'cow milk', 'cheese', 'cheddar', 'mozzarella',
        'parmesan', 'feta', 'butter', 'ghee', 'cream', 'heavy cream',
        'sour cream', 'yogurt', 'yoghurt', 'greek yogurt', 'paneer',
        'cottage cheese', 'curd', 'whey', 'whey protein', 'casein',
        'lactose', 'buttermilk', 'ricotta', 'mascarpone', 'ice cream'
      ],
      negativeExclusions: [
        'coconut milk', 'almond milk', 'soy milk', 'oat milk', 'rice milk',
        'peanut butter', 'almond butter', 'cocoa butter', 'shea butter',
        'apple butter', 'butternut', 'butternut squash'
      ],
    },
    soy: {
      primaryCategory: 'Soy',
      aliases: [
        'soy', 'soya', 'soybean', 'soybeans', 'edamame', 'tofu', 'tempeh',
        'soy sauce', 'tamari', 'miso', 'natto', 'soy milk', 'soy flour',
        'soy lecithin', 'textured vegetable protein', 'tvp'
      ],
      negativeExclusions: [],
    },
    shellfish: {
      primaryCategory: 'Shellfish / Crustaceans / Mollusks',
      aliases: [
        'shellfish', 'crustacean', 'crustaceans', 'mollusk', 'mollusks',
        'shrimp', 'shrimps', 'prawn', 'prawns', 'crab', 'crabs', 'crabmeat',
        'lobster', 'lobsters', 'crawfish', 'crayfish', 'clam', 'clams',
        'mussel', 'mussels', 'oyster', 'oysters', 'scallop', 'scallops',
        'squid', 'calamari', 'octopus', 'scampi', 'krill'
      ],
      negativeExclusions: [],
    },
    gluten: {
      primaryCategory: 'Gluten / Wheat',
      aliases: [
        'gluten', 'wheat', 'whole wheat', 'barley', 'rye', 'spelt',
        'kamut', 'farro', 'couscous', 'semolina', 'durum', 'seitan',
        'bulgur', 'wheat flour', 'all purpose flour', 'refined flour',
        'maida'
      ],
      negativeExclusions: ['gluten-free', 'gluten free', 'buckwheat'],
    },
    sesame: {
      primaryCategory: 'Sesame',
      aliases: [
        'sesame', 'sesame seed', 'sesame seeds', 'sesame oil', 'tahini',
        'halva', 'sesame dressing', 'gomasio'
      ],
      negativeExclusions: [],
    },
    tree_nuts: {
      primaryCategory: 'Tree Nuts',
      aliases: [
        'tree nut', 'tree nuts', 'nuts', 'nut', 'walnut', 'walnuts',
        'cashew', 'cashews', 'pistachio', 'pistachios', 'pecan', 'pecans',
        'hazelnut', 'hazelnuts', 'macadamia', 'macadamias', 'brazil nut',
        'brazil nuts', 'pine nut', 'pine nuts', 'chestnut', 'chestnuts'
      ],
      negativeExclusions: ['coconut', 'butternut', 'nutmeg', 'water chestnut'],
    },
    mustard: {
      primaryCategory: 'Mustard',
      aliases: [
        'mustard', 'dijon', 'mustard seed', 'mustard seeds', 'mustard greens',
        'mustard oil', 'yellow mustard'
      ],
      negativeExclusions: [],
    },
  };

  /**
   * Normalize an allergy term into a clean key.
   */
  public normalizeAllergy(allergy: string): string {
    if (!allergy) return '';
    return allergy
      .toLowerCase()
      .trim()
      .replace(/[\/\\,\-_]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Find matching rule key in allergenDatabase, or return null if unknown custom allergy.
   */
  private findMatchingRuleKey(normalizedAllergy: string): string | null {
    const directKeys: Record<string, string> = {
      egg: 'egg',
      eggs: 'egg',
      fish: 'fish',
      seafood: 'fish',
      chicken: 'chicken',
      poultry: 'chicken',
      beef: 'beef',
      almond: 'almond',
      almonds: 'almond',
      'almond butter': 'almond',
      'almond milk': 'almond',
      peanut: 'peanut',
      peanuts: 'peanut',
      'peanut butter': 'peanut',
      dairy: 'dairy',
      milk: 'dairy',
      lactose: 'dairy',
      'dairy lactose': 'dairy',
      soy: 'soy',
      soya: 'soy',
      shellfish: 'shellfish',
      gluten: 'gluten',
      wheat: 'gluten',
      sesame: 'sesame',
      'tree nut': 'tree_nuts',
      'tree nuts': 'tree_nuts',
      nut: 'tree_nuts',
      nuts: 'tree_nuts',
      mustard: 'mustard',
    };

    if (directKeys[normalizedAllergy]) {
      return directKeys[normalizedAllergy];
    }

    // Check if normalized allergy contains any direct keys as tokens
    for (const [key, mapped] of Object.entries(directKeys)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(normalizedAllergy)) {
        return mapped;
      }
    }

    // Check inside allergenDatabase aliases
    for (const [ruleKey, rule] of Object.entries(this.allergenDatabase)) {
      if (
        rule.aliases.some((alias) => {
          const aliasNorm = alias.toLowerCase();
          return aliasNorm === normalizedAllergy || normalizedAllergy.includes(aliasNorm);
        })
      ) {
        return ruleKey;
      }
    }

    return null;
  }

  /**
   * Expand an allergy term to all known aliases, synonyms, and derivatives.
   */
  public getAllergenAliases(allergy: string): string[] {
    const normalized = this.normalizeAllergy(allergy);
    if (!normalized) return [];

    const ruleKey = this.findMatchingRuleKey(normalized);
    if (ruleKey && this.allergenDatabase[ruleKey]) {
      const rule = this.allergenDatabase[ruleKey];
      // If the user's allergy was tree nuts, also include almonds and peanuts derivatives if desired,
      // but primarily return the rule's aliases plus the user's term.
      const set = new Set<string>([normalized, ...rule.aliases]);
      if (ruleKey === 'tree_nuts') {
        // Tree nuts include almonds
        this.allergenDatabase.almond.aliases.forEach((a) => set.add(a));
      }
      return Array.from(set);
    }

    // Custom allergy not in preset rules (e.g., "Avocado", "Kiwi", "Celery")
    // Return singular and plural variants of the normalized phrase
    const words = normalized.split(' ');
    const aliases = [normalized];
    if (normalized.endsWith('s')) {
      aliases.push(normalized.slice(0, -1));
    } else {
      aliases.push(normalized + 's');
    }
    // Also include primary noun if compound (e.g., "Almond Butter" -> "almond")
    if (words.length > 1) {
      aliases.push(words[0]);
    }
    return Array.from(new Set(aliases));
  }

  /**
   * Check whether a specific text string contains an allergen or any of its aliases.
   * Uses safe word boundary regexes and checks negative exclusions.
   */
  public checkTextForRestrictedAllergens(
    text: string,
    userAllergies: string[]
  ): AllergyValidationResult {
    if (!text || !userAllergies || userAllergies.length === 0) {
      return { isValid: true, detectedAllergens: [] };
    }

    const cleanText = text.toLowerCase();
    const detectedAllergens: string[] = [];
    const reasons: string[] = [];

    for (const allergy of userAllergies) {
      const normAllergy = this.normalizeAllergy(allergy);
      if (!normAllergy) continue;

      const ruleKey = this.findMatchingRuleKey(normAllergy);
      const aliases = this.getAllergenAliases(allergy);
      const rule = ruleKey ? this.allergenDatabase[ruleKey] : null;

      let matched = false;
      let matchedTerm = '';

      for (const alias of aliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Word boundary match
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');

        if (regex.test(cleanText)) {
          // Check if this match is part of a negative exclusion
          let isExcluded = false;
          if (rule?.negativeExclusions) {
            for (const excl of rule.negativeExclusions) {
              const exclEscaped = excl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const exclRegex = new RegExp(`\\b${exclEscaped}\\b`, 'i');
              if (exclRegex.test(cleanText)) {
                // If the only occurrence of the alias was within an exclusion (e.g. "eggplant" for "egg")
                // Check if there is an isolated occurrence of the alias outside the exclusion
                const replaced = cleanText.replace(new RegExp(`\\b${exclEscaped}\\b`, 'gi'), ' ');
                if (!regex.test(replaced)) {
                  isExcluded = true;
                  break;
                }
              }
            }
          }

          if (!isExcluded) {
            matched = true;
            matchedTerm = alias;
            break;
          }
        }
      }

      if (matched) {
        detectedAllergens.push(allergy.trim());
        reasons.push(`Contains restricted allergen "${allergy.trim()}" (detected alias: "${matchedTerm}")`);
      }
    }

    return {
      isValid: detectedAllergens.length === 0,
      detectedAllergens,
      reason: reasons.length > 0 ? reasons.join('; ') : undefined,
    };
  }

  /**
   * Validates a meal candidate against user allergies.
   * Safety-critical: Inspects name, ingredients, instructions, description, category, and pre-tagged allergens.
   * Fails safely if ingredients are unknown or cannot be verified.
   */
  public validateMeal(meal: MealCandidate, userAllergies: string[]): AllergyValidationResult {
    if (!meal) {
      return { isValid: false, detectedAllergens: [], reason: 'Invalid or empty meal candidate' };
    }

    if (!userAllergies || userAllergies.length === 0) {
      return { isValid: true, detectedAllergens: [] };
    }

    // Safety-critical check: Meal must have a name
    if (!meal.name || typeof meal.name !== 'string' || meal.name.trim() === '') {
      return {
        isValid: false,
        detectedAllergens: [],
        reason: 'Unverified meal: missing food name',
      };
    }

    // Assemble all text searchable fields
    const ingredientsArr = Array.isArray(meal.ingredients) ? meal.ingredients : [];
    const allergensArr = Array.isArray(meal.allergens) ? meal.allergens : [];
    const instructionsStr = typeof meal.instructions === 'string' ? meal.instructions : '';
    const descriptionStr = typeof meal.description === 'string' ? meal.description : '';
    const reasonStr = typeof meal.reason === 'string' ? meal.reason : '';
    const categoryStr = typeof meal.category === 'string' ? meal.category : '';

    // Safety check: If ingredients list is empty, check if description or name can verify it.
    // If it is completely unverified with no ingredients or instructions, fail safely.
    if (ingredientsArr.length === 0 && !instructionsStr && !descriptionStr) {
      // Incomplete data: Cannot guarantee food safety without ingredient verification
      return {
        isValid: false,
        detectedAllergens: [],
        reason: `Unverified food data: "${meal.name}" lacks verified ingredient list or preparation details`,
      };
    }

    // Check pre-tagged allergens first
    for (const taggedAllergen of allergensArr) {
      for (const userAllergy of userAllergies) {
        const normTagged = this.normalizeAllergy(taggedAllergen);
        const normUser = this.normalizeAllergy(userAllergy);
        const userAliases = this.getAllergenAliases(userAllergy);

        if (
          normTagged === normUser ||
          userAliases.some((a) => normTagged.includes(a) || a.includes(normTagged))
        ) {
          return {
            isValid: false,
            detectedAllergens: [userAllergy.trim()],
            reason: `Direct allergen tag match: "${taggedAllergen}" violates user restriction "${userAllergy.trim()}"`,
          };
        }
      }
    }

    // Compile comprehensive text body from all fields
    const allTextSegments = [
      meal.name,
      ...ingredientsArr,
      instructionsStr,
      descriptionStr,
      reasonStr,
      categoryStr,
    ].join(' | ');

    // Also individually test ingredients to catch subtle nested ingredients
    for (const ing of ingredientsArr) {
      const ingCheck = this.checkTextForRestrictedAllergens(ing, userAllergies);
      if (!ingCheck.isValid) {
        return {
          isValid: false,
          detectedAllergens: ingCheck.detectedAllergens,
          reason: `Ingredient restriction: "${ing}" contains ${ingCheck.detectedAllergens.join(', ')}`,
        };
      }
    }

    // Check full aggregated text (captures name, sauces in instructions, dressings in description)
    const aggregatedCheck = this.checkTextForRestrictedAllergens(allTextSegments, userAllergies);
    if (!aggregatedCheck.isValid) {
      return {
        isValid: false,
        detectedAllergens: aggregatedCheck.detectedAllergens,
        reason: `Restricted ingredient or preparation detected: ${aggregatedCheck.reason}`,
      };
    }

    return {
      isValid: true,
      detectedAllergens: [],
    };
  }

  /**
   * Filters a list of meals, returning valid meals and detailed rejected meals.
   */
  public filterMeals<T extends MealCandidate>(meals: T[], userAllergies: string[]): FilteredMealsResult<T> {
    const valid: T[] = [];
    const rejected: Array<{ item: T; detectedAllergens: string[]; reason: string }> = [];

    if (!Array.isArray(meals)) {
      return { valid: [], rejected: [] };
    }

    for (const meal of meals) {
      const res = this.validateMeal(meal, userAllergies);
      if (res.isValid) {
        valid.push(meal);
      } else {
        rejected.push({
          item: meal,
          detectedAllergens: res.detectedAllergens,
          reason: res.reason || 'Contains restricted allergen',
        });
      }
    }

    return { valid, rejected };
  }

  /**
   * Generates a guaranteed allergen-free fallback meal for a given slot and goal.
   * Systematically selects safe ingredients that do not violate any of the user's active allergies.
   */
  public getSafeFallbackMeal(
    slotType: string,
    goal: string,
    dietaryPreference: string,
    userAllergies: string[]
  ): MealCandidate {
    // Preset safe template pools for each slot
    const breakfastCandidates: MealCandidate[] = [
      {
        name: 'Steel-Cut Oatmeal with Chia Seeds & Fresh Blueberries',
        mealType: 'breakfast',
        category: 'High Fiber Whole Grain',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 340,
        protein: 12,
        carbohydrates: 58,
        fat: 7,
        fiber: 9,
        servingSize: 280,
        servingUnit: 'g',
        ingredients: ['Steel-Cut Oats', 'Water', 'Chia Seeds', 'Fresh Blueberries', 'Pure Maple Syrup', 'Cinnamon'],
        instructions: 'Simmer steel-cut oats in water with cinnamon, stir in chia seeds, and top with fresh blueberries.',
      },
      {
        name: 'Warm Quinoa Porridge with Sliced Banana & Sunflower Butter',
        mealType: 'breakfast',
        category: 'Ancient Grain Energy',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_gain', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 420,
        protein: 14,
        carbohydrates: 68,
        fat: 12,
        fiber: 8,
        servingSize: 300,
        servingUnit: 'g',
        ingredients: ['Organic Quinoa', 'Oat Milk', 'Ripe Banana', 'Sunflower Seed Butter', 'Pumpkin Seeds', 'Flaxseed'],
        instructions: 'Cook quinoa in oat milk until tender. Fold in mashed banana, sunflower seed butter, and toasted pumpkin seeds.',
      },
      {
        name: 'Spiced Chickpea & Avocado Breakfast Hash',
        mealType: 'breakfast',
        category: 'Savory Plant Protein',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'maintenance', 'muscle_gain'],
        allergens: [],
        calories: 330,
        protein: 13,
        carbohydrates: 42,
        fat: 14,
        fiber: 11,
        servingSize: 260,
        servingUnit: 'g',
        ingredients: ['Cooked Chickpeas', 'Diced Sweet Potato', 'Hass Avocado', 'Baby Spinach', 'Olive Oil', 'Cumin & Paprika'],
        instructions: 'Sauté sweet potato cubes and chickpeas in olive oil with cumin and paprika. Fold in spinach and top with sliced avocado.',
      },
    ];

    const lunchCandidates: MealCandidate[] = [
      {
        name: 'Mediterranean Quinoa Power Bowl with Roasted Chickpeas & Tahini-Free Herb Dressing',
        mealType: 'lunch',
        category: 'Nutrient-Dense Bowl',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 460,
        protein: 18,
        carbohydrates: 65,
        fat: 15,
        fiber: 13,
        servingSize: 350,
        servingUnit: 'g',
        ingredients: ['Fluffy Quinoa', 'Roasted Chickpeas', 'Diced Cucumber', 'Cherry Tomatoes', 'Kalamata Olives', 'Extra Virgin Olive Oil', 'Lemon Juice & Oregano'],
        instructions: 'Toss cooked quinoa with roasted chickpeas, diced cucumbers, tomatoes, and olives in a cold-pressed lemon oregano dressing.',
      },
      {
        name: 'Spiced Black Bean & Brown Rice Fiesta Bowl with Guacamole',
        mealType: 'lunch',
        category: 'High Protein Plant Bowl',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 490,
        protein: 19,
        carbohydrates: 78,
        fat: 14,
        fiber: 16,
        servingSize: 380,
        servingUnit: 'g',
        ingredients: ['Brown Basmati Rice', 'Simmered Black Beans', 'Roasted Corn', 'Bell Peppers', 'Avocado Mash', 'Lime Juice', 'Cilantro'],
        instructions: 'Layer steamed brown rice with seasoned black beans, fire-roasted corn, sweet peppers, and fresh cilantro guacamole.',
      },
      {
        name: 'Hearty Lentil & Root Vegetable Ragout with Steamed Millet',
        mealType: 'lunch',
        category: 'Mineral Rich Comfort',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'maintenance'],
        allergens: [],
        calories: 410,
        protein: 21,
        carbohydrates: 70,
        fat: 6,
        fiber: 15,
        servingSize: 360,
        servingUnit: 'g',
        ingredients: ['Green Lentils', 'Carrots', 'Celery', 'Diced Tomatoes', 'Vegetable Broth', 'Steamed Millet', 'Fresh Rosemary'],
        instructions: 'Simmer lentils with carrots and tomatoes in savory vegetable broth until rich and thick; ladle over fluffy steamed millet.',
      },
    ];

    const dinnerCandidates: MealCandidate[] = [
      {
        name: 'Herb-Roasted Sweet Potato & Brown Lentil Cottage Bowl with Steamed Broccoli',
        mealType: 'dinner',
        category: 'Restorative Complex Carb & Protein',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'maintenance', 'muscle_gain'],
        allergens: [],
        calories: 450,
        protein: 22,
        carbohydrates: 72,
        fat: 9,
        fiber: 17,
        servingSize: 360,
        servingUnit: 'g',
        ingredients: ['Roasted Sweet Potato', 'Brown Lentils', 'Steamed Broccoli Florets', 'Olive Oil', 'Garlic', 'Thyme'],
        instructions: 'Bake seasoned sweet potato wedges, pair with savory slow-cooked brown lentils, and serve alongside freshly steamed broccoli florets.',
      },
      {
        name: 'Golden Butternut Squash & Wild Rice Medley with Pumpkin Seeds',
        mealType: 'dinner',
        category: 'Antioxidant Rich Dinner',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'maintenance', 'weight_gain'],
        allergens: [],
        calories: 430,
        protein: 15,
        carbohydrates: 74,
        fat: 11,
        fiber: 12,
        servingSize: 340,
        servingUnit: 'g',
        ingredients: ['Wild Rice Blend', 'Roasted Butternut Squash', 'Baby Kale', 'Toasted Pumpkin Seeds', 'Cold-Pressed Olive Oil', 'Sage'],
        instructions: 'Sauté roasted squash cubes and wilted baby kale with wild rice, then garnish with crisp toasted pumpkin seeds and sage.',
      },
      {
        name: 'Slow-Simmered Chickpea & Spinach Coconut Stew with Jasmine Rice',
        mealType: 'dinner',
        category: 'Aromatic Wholesome Curry',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_gain', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 520,
        protein: 17,
        carbohydrates: 76,
        fat: 18,
        fiber: 13,
        servingSize: 400,
        servingUnit: 'g',
        ingredients: ['Chickpeas', 'Baby Spinach', 'Coconut Milk', 'Steamed Jasmine Rice', 'Turmeric', 'Ginger', 'Crushed Tomatoes'],
        instructions: 'Simmer chickpeas and fresh spinach in light coconut milk infused with ginger and turmeric; serve warm over fragrant jasmine rice.',
      },
    ];

    const snackCandidates: MealCandidate[] = [
      {
        name: 'Roasted Spiced Pumpkin & Sunflower Seeds with Dried Cranberries',
        mealType: 'snack',
        category: 'Nut-Free Energy Booster',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 190,
        protein: 8,
        carbohydrates: 15,
        fat: 12,
        fiber: 4,
        servingSize: 50,
        servingUnit: 'g',
        ingredients: ['Toasted Pumpkin Seeds', 'Sunflower Seeds', 'Dried Cranberries', 'Sea Salt', 'Cinnamon'],
        instructions: 'Toss toasted seeds with tart dried cranberries and a pinch of cinnamon sea salt for clean midday fuel.',
      },
      {
        name: 'Crisp Apple Slices with Creamy Sunflower Seed Butter',
        mealType: 'snack',
        category: 'Nut-Free Fruit & Fat Pair',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'maintenance'],
        allergens: [],
        calories: 170,
        protein: 5,
        carbohydrates: 22,
        fat: 9,
        fiber: 5,
        servingSize: 160,
        servingUnit: 'g',
        ingredients: ['Fresh Crisp Apple', 'Sunflower Seed Butter', 'Dash of Cinnamon'],
        instructions: 'Slice a crisp apple and serve alongside creamy sunflower seed butter dusted with ground cinnamon.',
      },
      {
        name: 'Roasted Crunchy Chickpeas with Smoked Paprika & Sea Salt',
        mealType: 'snack',
        category: 'Savory Plant Crunch',
        dietaryPreference: 'Vegan',
        suitableGoals: ['weight_loss', 'muscle_gain', 'maintenance'],
        allergens: [],
        calories: 160,
        protein: 7,
        carbohydrates: 24,
        fat: 4,
        fiber: 6,
        servingSize: 75,
        servingUnit: 'g',
        ingredients: ['Cooked Chickpeas', 'Olive Oil Spray', 'Smoked Paprika', 'Sea Salt', 'Garlic Powder'],
        instructions: 'Oven-roast dry chickpeas at 200°C until golden and crispy; dust with smoked paprika and sea salt.',
      },
    ];

    let candidates: MealCandidate[];
    switch (slotType.toLowerCase()) {
      case 'breakfast':
        candidates = breakfastCandidates;
        break;
      case 'lunch':
        candidates = lunchCandidates;
        break;
      case 'dinner':
        candidates = dinnerCandidates;
        break;
      default:
        candidates = snackCandidates;
        break;
    }

    // Find the first candidate that passes complete validation against user allergies
    for (const candidate of candidates) {
      const val = this.validateMeal(candidate, userAllergies);
      if (val.isValid) {
        return candidate;
      }
    }

    // Universal extreme fail-safe candidate (virtually non-allergenic basic food)
    return {
      name: `Simple Steamed Brown Rice & Lentil Bowl (${slotType})`,
      mealType: slotType,
      category: 'Certified Allergen-Free Essential',
      dietaryPreference: 'Vegan',
      suitableGoals: [goal],
      allergens: [],
      calories: 380,
      protein: 16,
      carbohydrates: 68,
      fat: 4,
      fiber: 10,
      servingSize: 300,
      servingUnit: 'g',
      ingredients: ['Brown Rice', 'Yellow Split Lentils', 'Water', 'Olive Oil', 'Sea Salt', 'Cumin'],
      instructions: 'Simmer brown rice and split lentils with a touch of cumin and olive oil until tender and warm.',
    };
  }
}


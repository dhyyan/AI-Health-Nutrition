import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { GeminiFoodRecognitionService } from '../framework/services/ai/GeminiFoodRecognitionService';
import { ScanFoodImageUseCase } from '../useCases/nutrition/ScanFoodImageUseCase';
import { validateImageBuffer } from '../shared/utils/imageValidator';
import { IHealthProfileRepository } from '../domain/interfaces/repositories/IHealthProfileRepository';
import { HealthProfile } from '../domain/entities/HealthProfile';

// Mock health profile repository for allergy testing
class MockHealthProfileRepo implements IHealthProfileRepository {
  private profiles = new Map<string, HealthProfile>();

  setProfile(userId: string, profile: HealthProfile) {
    this.profiles.set(userId, profile);
  }

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

async function runTestSuite() {
  console.log('====================================================');
  console.log('AI FOOD SCANNER TEST SUITE: REAL IMAGE RECOGNITION');
  console.log('====================================================\n');

  const recognitionService = new GeminiFoodRecognitionService();
  const mockHealthRepo = new MockHealthProfileRepo();
  mockHealthRepo.setProfile('user_with_egg_allergy', new HealthProfile({
    id: 'hp1',
    userId: 'user_with_egg_allergy',
    age: 28,
    gender: 'male',
    heightCm: 175,
    weightKg: 72,
    bmi: 23.5,
    bmiCategory: 'Normal',
    goal: 'maintenance',
    activityLevel: 'moderate',
    foodAllergies: ['egg', 'dairy'],
    medicalHistory: [],
    hasDiabetes: false,
    diabetesStatus: 'None',
    dietaryPreference: 'Non-Vegetarian',
    sleepHours: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const useCase = new ScanFoodImageUseCase(
    recognitionService,
    undefined,
    mockHealthRepo
  );

  const testCases = [
    {
      name: 'Chicken biryani with eggs',
      filePath: '/tmp/biryani_egg.jpg',
      expectedIsFood: true,
      allergyUser: 'user_with_egg_allergy',
    },
    {
      name: 'Plain rice',
      filePath: '/tmp/rice_egg.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Chicken curry',
      filePath: '/tmp/curry.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Vegetable salad',
      filePath: '/tmp/salad.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Fruits',
      filePath: '/tmp/fruit_plate.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Pizza',
      filePath: '/tmp/pizza.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Multiple dishes',
      filePath: '/tmp/multi_dishes.jpg',
      expectedIsFood: true,
    },
    {
      name: 'Human portrait',
      filePath: '/tmp/portrait.jpg',
      expectedIsFood: false,
    },
    {
      name: 'Dog photograph',
      filePath: '/tmp/dog.jpg',
      expectedIsFood: false,
    },
    {
      name: 'Mobile phone',
      filePath: '/tmp/phone.jpg',
      expectedIsFood: false,
    },
    {
      name: 'Laptop',
      filePath: '/tmp/laptop.jpg',
      expectedIsFood: false,
    },
    {
      name: 'Blurry food image',
      filePath: '/tmp/blurry_food.jpg',
      expectedIsFood: false,
      expectedUnclear: true,
    },
    {
      name: 'Corrupted image',
      filePath: '/tmp/test_apple.jpg',
      expectedValidationFail: true,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    console.log(`\n--- Testing: ${tc.name} (${tc.filePath}) ---`);
    if (!fs.existsSync(tc.filePath)) {
      console.error(`File ${tc.filePath} not found!`);
      failed++;
      continue;
    }

    const buffer = fs.readFileSync(tc.filePath);
    const validation = validateImageBuffer(buffer);

    if (tc.expectedValidationFail) {
      if (!validation.isValid) {
        console.log(`✅ PASSED: Image validation rejected corrupt file correctly (${validation.error})`);
        passed++;
      } else {
        console.error('❌ FAILED: Expected validation to reject corrupted image but it passed.');
        failed++;
      }
      continue;
    }

    if (!validation.isValid) {
      console.error(`❌ FAILED: Validation failed unexpectedly: ${validation.error}`);
      failed++;
      continue;
    }

    try {
      const result = await useCase.execute(
        buffer,
        validation.mimeType,
        path.basename(tc.filePath),
        tc.allergyUser
      );

      console.log(`Result: isFood=${result.isFood}, isUnclear=${result.isUnclear}, foodName="${result.foodName}", calories=${result.calories}, itemsCount=${result.foodItems?.length || 0}`);

      if (tc.allergyUser) {
        console.log(`Allergy Alert: hasAllergenAlert=${result.suitability.hasAllergenAlert}, alerts=${JSON.stringify(result.suitability.allergenAlerts)}`);
      }

      let tcPassed = true;
      if (result.isFood !== tc.expectedIsFood) {
        console.error(`❌ FAILED: Expected isFood=${tc.expectedIsFood}, but got isFood=${result.isFood}`);
        tcPassed = false;
      }

      if (tc.expectedUnclear && !result.isUnclear) {
        console.error(`❌ FAILED: Expected isUnclear=true, but got isUnclear=${result.isUnclear}`);
        tcPassed = false;
      }

      if (tc.allergyUser && !result.suitability.hasAllergenAlert) {
        console.error('❌ FAILED: Expected allergen alert for user with egg/dairy allergy on biryani with egg.');
        tcPassed = false;
      }

      if (tcPassed) {
        console.log(`✅ PASSED: ${tc.name}`);
        passed++;
      } else {
        failed++;
      }
    } catch (err: any) {
      console.error(`❌ FAILED with error:`, err.message);
      failed++;
    }
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${testCases.length})`);
  console.log('====================================================\n');
}

runTestSuite().catch(console.error);

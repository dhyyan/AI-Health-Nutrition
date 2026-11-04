import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { validateImageBuffer } from '../shared/utils/imageValidator';
import { GeminiFoodRecognitionService } from '../framework/services/ai/GeminiFoodRecognitionService';
import { ScanFoodImageUseCase } from '../useCases/nutrition/ScanFoodImageUseCase';
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
  async deleteByUserId(userId: string): Promise<boolean> { return true; }
}

describe('AI Food Scanner — Validation & Security', () => {
  it('should reject empty image buffer (0 bytes)', () => {
    const emptyBuf = Buffer.alloc(0);
    const result = validateImageBuffer(emptyBuf);
    assert.strictEqual(result.isValid, false);
    assert.match(result.error || '', /empty/i);
  });

  it('should reject truncated or corrupted image buffer', () => {
    const corruptedBuf = Buffer.from([0xff, 0xd8, 0x01, 0x02]);
    const result = validateImageBuffer(corruptedBuf);
    assert.strictEqual(result.isValid, false);
    assert.match(result.error || '', /corrupted|unreadable/i);
  });

  it('should reject unsupported file types (e.g. text or PDF)', () => {
    const textBuf = Buffer.from('This is a plain text file pretending to be an image. 12345678901234567890');
    const result = validateImageBuffer(textBuf);
    assert.strictEqual(result.isValid, false);
    assert.match(result.error || '', /unsupported/i);

    const pdfBuf = Buffer.from('%PDF-1.4 1234567890123456789012345678901234567890');
    const pdfResult = validateImageBuffer(pdfBuf);
    assert.strictEqual(pdfResult.isValid, false);
    assert.match(pdfResult.error || '', /unsupported/i);
  });

  it('should accept valid JPEG header', () => {
    const jpegHeader = Buffer.alloc(64);
    jpegHeader[0] = 0xff;
    jpegHeader[1] = 0xd8;
    jpegHeader[2] = 0xff;
    jpegHeader[3] = 0xe0;
    const result = validateImageBuffer(jpegHeader);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.mimeType, 'image/jpeg');
  });

  it('should accept valid PNG header', () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...new Array(30).fill(0)]);
    const result = validateImageBuffer(pngHeader);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.mimeType, 'image/png');
  });

  it('should accept valid WEBP header', () => {
    const webpHeader = Buffer.alloc(64);
    webpHeader.write('RIFF', 0, 'ascii');
    webpHeader.write('WEBP', 8, 'ascii');
    const result = validateImageBuffer(webpHeader);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.mimeType, 'image/webp');
  });
});

describe('AI Food Scanner — Error Handling & No Dummy Fallbacks', () => {
  it('should throw proper error when Gemini API key is missing, not return dummy plate', async () => {
    const service = new GeminiFoodRecognitionService('INVALID_DUMMY_KEY_FORCE_FAIL');
    const sampleImage = Buffer.alloc(100);
    sampleImage[0] = 0xff;
    sampleImage[1] = 0xd8;
    sampleImage[2] = 0xff;

    await assert.rejects(
      async () => {
        await service.recognizeFoodFromImage(sampleImage, 'image/jpeg');
      },
      (err: any) => {
        assert.ok(!err.foodName); // Must be an error, not returning a food object
        assert.match(err.message, /AI food recognition service is temporarily unavailable|API_KEY_INVALID|invalid/i);
        return true;
      }
    );
  });

  it('should reject corrupted image decoding from Gemini without dummy fallback', async () => {
    const service = new GeminiFoodRecognitionService();
    // 32-byte garbage with JPEG magic number
    const fakeJpeg = Buffer.alloc(32);
    fakeJpeg[0] = 0xff;
    fakeJpeg[1] = 0xd8;
    fakeJpeg[2] = 0xff;

    await assert.rejects(
      async () => {
        await service.recognizeFoodFromImage(fakeJpeg, 'image/jpeg');
      },
      (err: any) => {
        assert.match(err.message, /corrupted|decode|unavailable|failed/i);
        return true;
      }
    );
  });
});

describe('AI Food Scanner — Live Vision Analysis on Real Images', () => {
  const recognitionService = new GeminiFoodRecognitionService();
  const healthProfileRepo = new MockHealthProfileRepo();
  const scanUseCase = new ScanFoodImageUseCase(
    recognitionService,
    undefined,
    healthProfileRepo
  );

  it('Test 1: Food image (Chicken Biryani) — returns actual food analysis', async () => {
    if (!fs.existsSync('/tmp/biryani.jpg')) return;

    const buffer = fs.readFileSync('/tmp/biryani.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, true);
    assert.ok(result.foodName.length > 0);
    assert.match(result.foodName.toLowerCase(), /biryani|rice|chicken|curry/i);
    assert.ok(result.calories > 300, `Calories ${result.calories} should be > 300`);
    assert.ok(result.protein > 10, `Protein ${result.protein} should be > 10`);
    assert.ok(result.carbohydrates > 20, `Carbohydrates ${result.carbohydrates} should be > 20`);
    assert.ok(result.foodItems && result.foodItems.length > 0);
    assert.ok(result.totalNutrition !== null);
  });

  it('Test 2: Personal photograph — rejects as non-food without fabricated nutrition', async () => {
    const avatarPath = path.join(__dirname, '../../uploads/profiles/avatar-1788420710286-347886741.jpeg');
    if (!fs.existsSync(avatarPath)) return;

    const buffer = fs.readFileSync(avatarPath);
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, false);
    assert.strictEqual(result.calories, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.totalNutrition, null);
    assert.deepStrictEqual(result.foodItems, []);
    assert.match(result.message || '', /no food detected|upload a clear photograph/i);
  });

  it('Test 3: Random object (Laptop) — rejects as non-food', async () => {
    if (!fs.existsSync('/tmp/laptop.jpg')) return;

    const buffer = fs.readFileSync('/tmp/laptop.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, false);
    assert.strictEqual(result.calories, 0);
    assert.strictEqual(result.totalNutrition, null);
    assert.deepStrictEqual(result.foodItems, []);
  });

  it('Test 3b: Random object (Dog) — rejects as non-food', async () => {
    if (!fs.existsSync('/tmp/dog.jpg')) return;

    const buffer = fs.readFileSync('/tmp/dog.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, false);
    assert.strictEqual(result.calories, 0);
    assert.strictEqual(result.totalNutrition, null);
    assert.deepStrictEqual(result.foodItems, []);
  });

  it('Test 4: Multiple food items (Fruit Plate) — identifies separate items and combined totals', async () => {
    if (!fs.existsSync('/tmp/fruit_plate.jpg')) return;

    const buffer = fs.readFileSync('/tmp/fruit_plate.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, true);
    assert.ok(result.foodItems.length >= 1, 'Should detect food items');
    assert.ok(result.calories > 100);
    assert.ok(result.carbohydrates > 10);
    assert.ok(result.totalNutrition !== null);
  });

  it('Test 5: Blurry image — requests clearer photograph', async () => {
    if (!fs.existsSync('/tmp/blurry_food.jpg')) return;

    const buffer = fs.readFileSync('/tmp/blurry_food.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg');

    assert.strictEqual(result.isFood, false);
    assert.strictEqual(result.calories, 0);
    assert.strictEqual(result.totalNutrition, null);
    assert.match(result.message || '', /blurry|unclear|clear/i);
  });

  it('Test 6: Different food images produce image-dependent results (not static dummy values)', async () => {
    if (!fs.existsSync('/tmp/biryani.jpg') || !fs.existsSync('/tmp/fruit_plate.jpg')) return;

    const biryaniBuf = fs.readFileSync('/tmp/biryani.jpg');
    const fruitBuf = fs.readFileSync('/tmp/fruit_plate.jpg');

    const biryaniResult = await scanUseCase.execute(biryaniBuf, 'image/jpeg');
    const fruitResult = await scanUseCase.execute(fruitBuf, 'image/jpeg');

    assert.strictEqual(biryaniResult.isFood, true);
    assert.strictEqual(fruitResult.isFood, true);

    // Results must NOT be identical hardcoded dummy data!
    assert.notStrictEqual(biryaniResult.foodName, fruitResult.foodName);
    assert.notStrictEqual(biryaniResult.calories, fruitResult.calories);
    assert.notStrictEqual(biryaniResult.protein, fruitResult.protein);
  });

  it('Test 7: User allergy integration — flags allergen warning when allergen is detected', async () => {
    if (!fs.existsSync('/tmp/biryani.jpg')) return;

    const allergicUserId = 'user-allergic-to-chicken';
    healthProfileRepo.setProfile(
      allergicUserId,
      new HealthProfile({
        userId: allergicUserId,
        age: 30,
        gender: 'male',
        heightCm: 175,
        weightKg: 70,
        bmi: 22.9,
        bmiCategory: 'Normal',
        goal: 'maintenance',
        foodAllergies: ['Chicken'],
        medicalHistory: [],
        hasDiabetes: false,
        diabetesStatus: 'None',
        activityLevel: 'moderate',
        dietaryPreference: 'Non-Vegetarian',
        sleepHours: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    const buffer = fs.readFileSync('/tmp/biryani.jpg');
    const result = await scanUseCase.execute(buffer, 'image/jpeg', undefined, allergicUserId);

    assert.strictEqual(result.isFood, true);
    // If the biryani was recognized as containing chicken, allergen alert must be flagged!
    if (result.foodName.toLowerCase().includes('chicken') ||
        result.foodItems.some(i => i.name.toLowerCase().includes('chicken') ||
        i.visibleIngredients?.some(v => v.toLowerCase().includes('chicken')))) {
      assert.strictEqual(result.suitability.hasAllergenAlert, true);
      assert.strictEqual(result.suitability.rating, 'unsuitable');
      assert.ok(result.suitability.allergenAlerts.length > 0);
      assert.match(result.suitability.allergenAlerts.join(' '), /CHICKEN/i);
    }
  });
});


import { Router } from 'express';
import { authenticateJwt, requireRole } from '../../adapters/middlewares/auth.middleware';
import { MongoMealRepository } from '../../adapters/repositories/MongoMealRepository';
import { MongoMealPlanRepository } from '../../adapters/repositories/MongoMealPlanRepository';
import { HealthProfileRepository } from '../../adapters/repositories/HealthProfileRepository';
import { AllergyValidationService } from '../services/allergy/AllergyValidationService';
import { CreateMealUseCase } from '../../useCases/meal/CreateMealUseCase';
import { GetAllMealsUseCase } from '../../useCases/meal/GetAllMealsUseCase';
import { UpdateMealUseCase } from '../../useCases/meal/UpdateMealUseCase';
import { DeleteMealUseCase } from '../../useCases/meal/DeleteMealUseCase';
import { GenerateMealPlanUseCase } from '../../useCases/meal/GenerateMealPlanUseCase';
import { GetUserMealPlanUseCase } from '../../useCases/meal/GetUserMealPlanUseCase';
import { SwapMealOptionUseCase } from '../../useCases/meal/SwapMealOptionUseCase';
import { MealController } from '../../adapters/controllers/meal/MealController';

const router = Router();

// Instantiate Repositories & Services
const allergyValidationService = new AllergyValidationService();
const mealRepository = new MongoMealRepository(allergyValidationService);
const mealPlanRepository = new MongoMealPlanRepository();
const healthProfileRepository = new HealthProfileRepository();

// Instantiate Use Cases
const createMealUseCase = new CreateMealUseCase(mealRepository);
const getAllMealsUseCase = new GetAllMealsUseCase(mealRepository);
const updateMealUseCase = new UpdateMealUseCase(mealRepository);
const deleteMealUseCase = new DeleteMealUseCase(mealRepository);
const generateMealPlanUseCase = new GenerateMealPlanUseCase(
  mealRepository,
  mealPlanRepository,
  healthProfileRepository,
  allergyValidationService
);
const getUserMealPlanUseCase = new GetUserMealPlanUseCase(
  mealPlanRepository,
  generateMealPlanUseCase,
  healthProfileRepository,
  allergyValidationService
);
const swapMealOptionUseCase = new SwapMealOptionUseCase(
  mealRepository,
  mealPlanRepository,
  healthProfileRepository,
  allergyValidationService
);

// Instantiate Controller
const mealController = new MealController(
  createMealUseCase,
  getAllMealsUseCase,
  updateMealUseCase,
  deleteMealUseCase,
  generateMealPlanUseCase,
  getUserMealPlanUseCase,
  swapMealOptionUseCase
);

// All routes are protected by JWT authentication
router.use(authenticateJwt);

// User Meal Plan routes
router.get('/plan', mealController.getUserMealPlan);
router.post('/plan/generate', mealController.generateMealPlan);
router.post('/plan/swap', mealController.swapMealSlot);

// Public / User search meals
router.get('/', mealController.getAllMeals);

// Admin-only CRUD operations on Master Meal Database
router.post('/', requireRole('admin'), mealController.createMeal);
router.put('/:id', requireRole('admin'), mealController.updateMeal);
router.delete('/:id', requireRole('admin'), mealController.deleteMeal);

export default router;

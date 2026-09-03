import { Router } from 'express';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { HealthProfileRepository } from '../../adapters/repositories/HealthProfileRepository';
import { MongoFoodLogRepository } from '../../adapters/repositories/MongoFoodLogRepository';
import { MongoFoodRepository } from '../../adapters/repositories/MongoFoodRepository';
import { NutritionDatabaseService } from '../services/nutrition/NutritionDatabaseService';
import { GeneratePersonalizedRecommendationsUseCase } from '../../useCases/recommendation/GeneratePersonalizedRecommendationsUseCase';
import { GetFoodAlternativesUseCase } from '../../useCases/recommendation/GetFoodAlternativesUseCase';
import { RecommendationController } from '../../adapters/controllers/recommendation/RecommendationController';

const router = Router();

// Instantiate Repositories & Services
const healthProfileRepository = new HealthProfileRepository();
const foodLogRepository = new MongoFoodLogRepository();
const foodRepository = new MongoFoodRepository();
const nutritionDatabaseService = new NutritionDatabaseService(foodRepository);

// Instantiate Use Cases
const generatePersonalizedRecommendationsUseCase = new GeneratePersonalizedRecommendationsUseCase(
  healthProfileRepository,
  foodLogRepository
);
const getFoodAlternativesUseCase = new GetFoodAlternativesUseCase(
  nutritionDatabaseService,
  healthProfileRepository
);

// Instantiate Controller
const recommendationController = new RecommendationController(
  generatePersonalizedRecommendationsUseCase,
  getFoodAlternativesUseCase
);

// All routes are protected by JWT authentication
router.use(authenticateJwt);

router.get('/', recommendationController.getPersonalizedRecommendations);
router.get('/alternatives', recommendationController.getFoodAlternatives);
router.post('/alternatives', recommendationController.getFoodAlternatives);

export default router;

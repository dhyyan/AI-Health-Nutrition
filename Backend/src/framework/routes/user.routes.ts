import { Router } from 'express';
import { UserRepository } from '../../adapters/repositories/UserRepository';
import { HealthProfileRepository } from '../../adapters/repositories/HealthProfileRepository';
import { WeightBmiLogRepository } from '../../adapters/repositories/WeightBmiLogRepository';
import { MongoMealPlanRepository } from '../../adapters/repositories/MongoMealPlanRepository';
import { MongoMealRepository } from '../../adapters/repositories/MongoMealRepository';
import { AllergyValidationService } from '../services/allergy/AllergyValidationService';
import { GenerateMealPlanUseCase } from '../../useCases/meal/GenerateMealPlanUseCase';
import { LocalStorageService } from '../services/storage/LocalStorageService';
import { GetHealthProfileUseCase } from '../../useCases/user/GetHealthProfileUseCase';
import { UpdateHealthProfileUseCase } from '../../useCases/user/UpdateHealthProfileUseCase';
import { UploadProfilePictureUseCase } from '../../useCases/user/UploadProfilePictureUseCase';
import { HealthProfileController } from '../../adapters/controllers/user/HealthProfileController';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { profileUpload } from '../../adapters/middlewares/upload.middleware';

const router = Router();

// Instantiate dependencies
const userRepository = new UserRepository();
const healthProfileRepository = new HealthProfileRepository();
const weightBmiLogRepository = new WeightBmiLogRepository();
const mealPlanRepository = new MongoMealPlanRepository();
const allergyValidationService = new AllergyValidationService();
const mealRepository = new MongoMealRepository(allergyValidationService);
const generateMealPlanUseCase = new GenerateMealPlanUseCase(
  mealRepository,
  mealPlanRepository,
  healthProfileRepository,
  allergyValidationService
);
const storageService = new LocalStorageService('profiles');

const getHealthProfileUseCase = new GetHealthProfileUseCase(userRepository, healthProfileRepository);
const updateHealthProfileUseCase = new UpdateHealthProfileUseCase(
  userRepository,
  healthProfileRepository,
  weightBmiLogRepository,
  mealPlanRepository,
  generateMealPlanUseCase
);
const uploadProfilePictureUseCase = new UploadProfilePictureUseCase(userRepository, storageService);

const healthProfileController = new HealthProfileController(
  getHealthProfileUseCase,
  updateHealthProfileUseCase,
  uploadProfilePictureUseCase
);

// All routes require JWT authentication
router.use(authenticateJwt);

router.get('/profile', healthProfileController.getProfile);
router.put('/profile', healthProfileController.updateProfile);
router.post('/profile/picture', profileUpload.single('picture'), healthProfileController.uploadPicture);

export default router;

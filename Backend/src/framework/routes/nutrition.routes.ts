import { Router } from 'express';
import multer from 'multer';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { MongoFoodRepository } from '../../adapters/repositories/MongoFoodRepository';
import { MongoFoodLogRepository } from '../../adapters/repositories/MongoFoodLogRepository';
import { NutritionDatabaseService } from '../services/nutrition/NutritionDatabaseService';
import { SearchFoodUseCase } from '../../useCases/nutrition/SearchFoodUseCase';
import { GetFoodDetailsUseCase } from '../../useCases/nutrition/GetFoodDetailsUseCase';
import { AnalyzeNutritionUseCase } from '../../useCases/nutrition/AnalyzeNutritionUseCase';
import { CreateFoodLogUseCase } from '../../useCases/food/CreateFoodLogUseCase';
import { GetUserFoodLogsUseCase } from '../../useCases/food/GetUserFoodLogsUseCase';
import { DeleteFoodLogUseCase } from '../../useCases/food/DeleteFoodLogUseCase';
import { NutritionController } from '../../adapters/controllers/nutrition/NutritionController';

import { GeminiFoodRecognitionService } from '../services/ai/GeminiFoodRecognitionService';
import { ScanFoodImageUseCase } from '../../useCases/nutrition/ScanFoodImageUseCase';
import { ScannerController } from '../../adapters/controllers/nutrition/ScannerController';

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Dependency Injection Setup
const foodRepository = new MongoFoodRepository();
const foodLogRepository = new MongoFoodLogRepository();
const nutritionDatabaseService = new NutritionDatabaseService(foodRepository);

const searchFoodUseCase = new SearchFoodUseCase(nutritionDatabaseService);
const getFoodDetailsUseCase = new GetFoodDetailsUseCase(nutritionDatabaseService);
const analyzeNutritionUseCase = new AnalyzeNutritionUseCase(nutritionDatabaseService);
const createFoodLogUseCase = new CreateFoodLogUseCase(foodLogRepository, nutritionDatabaseService);
const getUserFoodLogsUseCase = new GetUserFoodLogsUseCase(foodLogRepository);
const deleteFoodLogUseCase = new DeleteFoodLogUseCase(foodLogRepository);

const geminiFoodRecognitionService = new GeminiFoodRecognitionService();
const scanFoodImageUseCase = new ScanFoodImageUseCase(geminiFoodRecognitionService);
const scannerController = new ScannerController(scanFoodImageUseCase);

const nutritionController = new NutritionController(
  searchFoodUseCase,
  getFoodDetailsUseCase,
  analyzeNutritionUseCase,
  createFoodLogUseCase,
  getUserFoodLogsUseCase,
  deleteFoodLogUseCase
);

// Protected routes (Requires valid JWT)
router.use(authenticateJwt);

router.get('/search', nutritionController.searchFoods);
router.get('/food/:id', nutritionController.getFoodDetails);
router.post('/analyze', nutritionController.analyzeNutrition);
router.post('/logs', nutritionController.createFoodLog);
router.get('/logs', nutritionController.getUserFoodLogs);
router.delete('/logs/:id', nutritionController.deleteFoodLog);

// AI Food Scanner Endpoint
router.post('/scan', upload.single('image'), scannerController.scanImage);

export default router;

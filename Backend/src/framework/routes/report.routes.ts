import { Router } from 'express';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { MongoFoodLogRepository } from '../../adapters/repositories/MongoFoodLogRepository';
import { WaterIntakeRepository } from '../../adapters/repositories/WaterIntakeRepository';
import { HealthProfileRepository } from '../../adapters/repositories/HealthProfileRepository';
import { WeightBmiLogRepository } from '../../adapters/repositories/WeightBmiLogRepository';
import { UserRepository } from '../../adapters/repositories/UserRepository';

import { GetDailyReportUseCase } from '../../useCases/report/GetDailyReportUseCase';
import { GetWeeklyReportUseCase } from '../../useCases/report/GetWeeklyReportUseCase';
import { GetMonthlyReportUseCase } from '../../useCases/report/GetMonthlyReportUseCase';
import { GetHealthTrendsUseCase } from '../../useCases/report/GetHealthTrendsUseCase';
import { LogWeightBmiUseCase } from '../../useCases/report/LogWeightBmiUseCase';
import { GeneratePdfReportUseCase } from '../../useCases/report/GeneratePdfReportUseCase';
import { GetUserDashboardUseCase } from '../../useCases/report/GetUserDashboardUseCase';
import { GeneratePersonalizedRecommendationsUseCase } from '../../useCases/recommendation/GeneratePersonalizedRecommendationsUseCase';

import { ReportController } from '../../adapters/controllers/report/ReportController';

const router = Router();

// Instantiate Repositories
const foodLogRepository = new MongoFoodLogRepository();
const waterIntakeRepository = new WaterIntakeRepository();
const healthProfileRepository = new HealthProfileRepository();
const weightBmiLogRepository = new WeightBmiLogRepository();
const userRepository = new UserRepository();

// Instantiate Use Cases
const generateRecommendationsUseCase = new GeneratePersonalizedRecommendationsUseCase(
  healthProfileRepository,
  foodLogRepository
);

const getUserDashboardUseCase = new GetUserDashboardUseCase(
  userRepository,
  healthProfileRepository,
  foodLogRepository,
  waterIntakeRepository,
  weightBmiLogRepository,
  generateRecommendationsUseCase
);

const getDailyReportUseCase = new GetDailyReportUseCase(
  foodLogRepository,
  waterIntakeRepository,
  healthProfileRepository,
  weightBmiLogRepository
);

const getWeeklyReportUseCase = new GetWeeklyReportUseCase(
  foodLogRepository,
  waterIntakeRepository,
  healthProfileRepository,
  weightBmiLogRepository
);

const getMonthlyReportUseCase = new GetMonthlyReportUseCase(
  foodLogRepository,
  waterIntakeRepository,
  healthProfileRepository,
  weightBmiLogRepository
);

const getHealthTrendsUseCase = new GetHealthTrendsUseCase(
  foodLogRepository,
  waterIntakeRepository,
  weightBmiLogRepository,
  healthProfileRepository
);

const logWeightBmiUseCase = new LogWeightBmiUseCase(
  weightBmiLogRepository,
  healthProfileRepository
);

const generatePdfReportUseCase = new GeneratePdfReportUseCase(
  userRepository,
  getDailyReportUseCase,
  getWeeklyReportUseCase,
  getMonthlyReportUseCase
);

const reportController = new ReportController(
  getDailyReportUseCase,
  getWeeklyReportUseCase,
  getMonthlyReportUseCase,
  getHealthTrendsUseCase,
  logWeightBmiUseCase,
  generatePdfReportUseCase,
  getUserDashboardUseCase
);

// All routes protected by JWT
router.use(authenticateJwt);

router.get('/dashboard', reportController.getDashboard);
router.get('/daily', reportController.getDailyReport);
router.get('/weekly', reportController.getWeeklyReport);
router.get('/monthly', reportController.getMonthlyReport);
router.get('/trends', reportController.getTrends);
router.post('/weight-bmi', reportController.logWeightBmi);
router.get('/download-pdf', reportController.downloadPdfReport);

export default router;

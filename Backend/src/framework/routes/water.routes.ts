import { Router } from 'express';
import { WaterIntakeRepository } from '../../adapters/repositories/WaterIntakeRepository';
import { LogWaterIntakeUseCase } from '../../useCases/water/LogWaterIntakeUseCase';
import { DeleteWaterIntakeUseCase } from '../../useCases/water/DeleteWaterIntakeUseCase';
import { GetWaterSummaryUseCase } from '../../useCases/water/GetWaterSummaryUseCase';
import { UpdateWaterGoalUseCase } from '../../useCases/water/UpdateWaterGoalUseCase';
import { GetWaterHistoryUseCase } from '../../useCases/water/GetWaterHistoryUseCase';
import { WaterIntakeController } from '../../adapters/controllers/water/WaterIntakeController';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';

const router = Router();

// Dependency Injection Setup
const waterIntakeRepository = new WaterIntakeRepository();

const logWaterIntakeUseCase = new LogWaterIntakeUseCase(waterIntakeRepository);
const deleteWaterIntakeUseCase = new DeleteWaterIntakeUseCase(waterIntakeRepository);
const getWaterSummaryUseCase = new GetWaterSummaryUseCase(waterIntakeRepository);
const updateWaterGoalUseCase = new UpdateWaterGoalUseCase(waterIntakeRepository);
const getWaterHistoryUseCase = new GetWaterHistoryUseCase(waterIntakeRepository);

const waterIntakeController = new WaterIntakeController(
  logWaterIntakeUseCase,
  deleteWaterIntakeUseCase,
  getWaterSummaryUseCase,
  updateWaterGoalUseCase,
  getWaterHistoryUseCase
);

// All water routes require JWT authentication
router.use(authenticateJwt);

router.get('/summary', waterIntakeController.getTodaySummary);
router.post('/log', waterIntakeController.logIntake);
router.delete('/log/:intakeId', waterIntakeController.deleteIntake);
router.put('/goal', waterIntakeController.updateGoal);
router.get('/history', waterIntakeController.getHistory);

export default router;

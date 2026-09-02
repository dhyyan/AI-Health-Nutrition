import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { SearchFoodUseCase } from '../../../useCases/nutrition/SearchFoodUseCase';
import { GetFoodDetailsUseCase } from '../../../useCases/nutrition/GetFoodDetailsUseCase';
import { AnalyzeNutritionUseCase } from '../../../useCases/nutrition/AnalyzeNutritionUseCase';
import { CreateFoodLogUseCase } from '../../../useCases/food/CreateFoodLogUseCase';
import { GetUserFoodLogsUseCase } from '../../../useCases/food/GetUserFoodLogsUseCase';
import { DeleteFoodLogUseCase } from '../../../useCases/food/DeleteFoodLogUseCase';

export class NutritionController {
  constructor(
    private searchFoodUseCase: SearchFoodUseCase,
    private getFoodDetailsUseCase: GetFoodDetailsUseCase,
    private analyzeNutritionUseCase: AnalyzeNutritionUseCase,
    private createFoodLogUseCase: CreateFoodLogUseCase,
    private getUserFoodLogsUseCase: GetUserFoodLogsUseCase,
    private deleteFoodLogUseCase: DeleteFoodLogUseCase
  ) {}

  public searchFoods = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const query = req.query.query as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const foods = await this.searchFoodUseCase.execute(query || '', limit);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'Foods retrieved successfully',
      data: foods,
    });
  };

  public getFoodDetails = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;
    const food = await this.getFoodDetailsUseCase.execute(id);

    if (!food) {
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: 'Food item not found',
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Food details retrieved successfully',
      data: food,
    });
  };

  public analyzeNutrition = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { foodId, foodName, servingSize, servingUnit } = req.body;

    const analysis = await this.analyzeNutritionUseCase.execute({
      foodId,
      foodName,
      servingSize: Number(servingSize),
      servingUnit,
    });

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Nutrition analysis generated successfully',
      data: analysis,
    });
  };

  public createFoodLog = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const { foodItemId, foodName, mealType, servingSize, servingUnit } = req.body;

    const result = await this.createFoodLogUseCase.execute(userId, {
      foodItemId,
      foodName,
      mealType,
      servingSize: Number(servingSize),
      servingUnit,
    });

    return sendResponse({
      res,
      statusCode: 201,
      message: 'Food logged successfully',
      data: result,
    });
  };

  public getUserFoodLogs = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const dateStr = req.query.date as string;

    const logs = await this.getUserFoodLogsUseCase.execute(userId, dateStr);

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Food logs retrieved successfully',
      data: logs,
    });
  };

  public deleteFoodLog = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const deleted = await this.deleteFoodLogUseCase.execute(id, userId);

    if (!deleted) {
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: 'Food log entry not found or unauthorized to delete',
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Food log deleted successfully',
    });
  };
}

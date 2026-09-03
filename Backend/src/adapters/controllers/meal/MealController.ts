import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { CreateMealUseCase } from '../../../useCases/meal/CreateMealUseCase';
import { GetAllMealsUseCase } from '../../../useCases/meal/GetAllMealsUseCase';
import { UpdateMealUseCase } from '../../../useCases/meal/UpdateMealUseCase';
import { DeleteMealUseCase } from '../../../useCases/meal/DeleteMealUseCase';
import { GenerateMealPlanUseCase } from '../../../useCases/meal/GenerateMealPlanUseCase';
import { GetUserMealPlanUseCase } from '../../../useCases/meal/GetUserMealPlanUseCase';
import { SwapMealOptionUseCase } from '../../../useCases/meal/SwapMealOptionUseCase';
import { MealType, DietaryPreference } from '../../../domain/entities/Meal';
import { HealthGoal } from '../../../domain/entities/HealthProfile';

export class MealController {
  constructor(
    private createMealUseCase: CreateMealUseCase,
    private getAllMealsUseCase: GetAllMealsUseCase,
    private updateMealUseCase: UpdateMealUseCase,
    private deleteMealUseCase: DeleteMealUseCase,
    private generateMealPlanUseCase: GenerateMealPlanUseCase,
    private getUserMealPlanUseCase: GetUserMealPlanUseCase,
    private swapMealOptionUseCase: SwapMealOptionUseCase
  ) {}

  public getAllMeals = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { mealType, goal, dietaryPreference, search, excludeAllergens } = req.query;

    const options = {
      mealType: mealType as MealType,
      goal: goal as HealthGoal,
      dietaryPreference: dietaryPreference as DietaryPreference,
      search: search as string,
      excludeAllergens: excludeAllergens
        ? (excludeAllergens as string).split(',').map((s) => s.trim())
        : undefined,
    };

    const meals = await this.getAllMealsUseCase.execute(options);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'Meals retrieved successfully',
      data: meals,
    });
  };

  public createMeal = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const meal = await this.createMealUseCase.execute(req.body);
    return sendResponse({
      res,
      statusCode: 201,
      message: 'Meal created successfully',
      data: meal,
    });
  };

  public updateMeal = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;
    const meal = await this.updateMealUseCase.execute(id, req.body);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'Meal updated successfully',
      data: meal,
    });
  };

  public deleteMeal = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { id } = req.params;
    await this.deleteMealUseCase.execute(id);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'Meal deleted successfully',
    });
  };

  public getUserMealPlan = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const mealPlan = await this.getUserMealPlanUseCase.execute(userId);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'User meal plan retrieved successfully',
      data: mealPlan,
    });
  };

  public generateMealPlan = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const mealPlan = await this.generateMealPlanUseCase.execute(userId);
    return sendResponse({
      res,
      statusCode: 200,
      message: 'Fresh 7-Day personalized meal plan generated successfully',
      data: mealPlan,
    });
  };

  public swapMealSlot = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user!.userId;
    const { day, slotType, replacementMealId } = req.body;

    if (!day || !slotType) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Day and slotType (breakfast, lunch, dinner, snack) are required.',
      });
    }

    const updatedPlan = await this.swapMealOptionUseCase.execute(
      userId,
      day,
      slotType as MealType,
      replacementMealId
    );

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Meal slot swapped successfully',
      data: updatedPlan,
    });
  };
}

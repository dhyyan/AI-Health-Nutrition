import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { GeneratePersonalizedRecommendationsUseCase } from '../../../useCases/recommendation/GeneratePersonalizedRecommendationsUseCase';
import { GetFoodAlternativesUseCase } from '../../../useCases/recommendation/GetFoodAlternativesUseCase';

export class RecommendationController {
  constructor(
    private generatePersonalizedRecommendationsUseCase: GeneratePersonalizedRecommendationsUseCase,
    private getFoodAlternativesUseCase: GetFoodAlternativesUseCase
  ) {}

  public getPersonalizedRecommendations = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    const userId = req.user!.userId;
    const recommendations = await this.generatePersonalizedRecommendationsUseCase.execute(userId);

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Personalized health recommendations retrieved successfully',
      data: recommendations,
    });
  };

  public getFoodAlternatives = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    const userId = req.user!.userId;
    const foodQuery = (req.query.food || req.body?.food || 'Potato Chips') as string;

    const alternatives = await this.getFoodAlternativesUseCase.execute(foodQuery, userId);

    return sendResponse({
      res,
      statusCode: 200,
      message: 'Food alternatives generated successfully',
      data: alternatives,
    });
  };
}

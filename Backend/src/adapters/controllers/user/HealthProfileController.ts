import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { GetHealthProfileUseCase } from '../../../useCases/user/GetHealthProfileUseCase';
import { UpdateHealthProfileUseCase } from '../../../useCases/user/UpdateHealthProfileUseCase';
import { UploadProfilePictureUseCase } from '../../../useCases/user/UploadProfilePictureUseCase';

export class HealthProfileController {
  constructor(
    private getHealthProfileUseCase: GetHealthProfileUseCase,
    private updateHealthProfileUseCase: UpdateHealthProfileUseCase,
    private uploadProfilePictureUseCase: UploadProfilePictureUseCase
  ) {}

  getProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const result = await this.getHealthProfileUseCase.execute(userId);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Health profile fetched successfully',
        data: result,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch health profile',
      });
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const result = await this.updateHealthProfileUseCase.execute(userId, req.body);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Health profile updated successfully',
        data: result,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to update health profile',
      });
    }
  };

  uploadPicture = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      if (!req.file) {
        return sendResponse({ res, statusCode: 400, message: 'Please upload an image file' });
      }

      const userSummary = await this.uploadProfilePictureUseCase.execute(userId, req.file);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Profile picture uploaded successfully',
        data: userSummary,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to upload profile picture',
      });
    }
  };
}

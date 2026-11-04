import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { ScanFoodImageUseCase } from '../../../useCases/nutrition/ScanFoodImageUseCase';
import { validateImageBuffer } from '../../../shared/utils/imageValidator';

export class ScannerController {
  constructor(private scanFoodImageUseCase: ScanFoodImageUseCase) {}

  scanImage = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      let buffer: Buffer | undefined;
      let filename: string | undefined;

      if (req.file) {
        buffer = req.file.buffer || (req.file.path ? require('fs').readFileSync(req.file.path) : undefined);
        filename = req.file.filename;
      } else if (req.body && req.body.imageBase64) {
        const base64Str = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        buffer = Buffer.from(base64Str, 'base64');
      }

      if (!buffer || buffer.length === 0) {
        return sendResponse({
          res,
          statusCode: 400,
          message: 'Image file is empty or missing. Please select a valid photograph.',
        });
      }

      // Strict backend image validation (magic bytes, size <= 10MB, formats JPEG/PNG/WEBP)
      const validation = validateImageBuffer(buffer);
      if (!validation.isValid) {
        return sendResponse({
          res,
          statusCode: 400,
          message: validation.error || 'Unsupported image format. Please upload a valid JPEG, PNG, or WEBP image.',
        });
      }

      const userId = req.user?.userId;
      const result = await this.scanFoodImageUseCase.execute(
        buffer,
        validation.mimeType,
        filename,
        userId
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: result.isFood
          ? 'Food recognized and analyzed successfully'
          : result.message || 'No food detected. Please upload a clear photograph of your meal.',
        data: result,
      });
    } catch (error: any) {
      console.error('Error scanning food image:', error);
      const isClientError =
        error.message?.includes('Invalid or corrupted image') ||
        error.message?.includes('Unsupported image format') ||
        error.message?.includes('buffer is empty');

      return sendResponse({
        res,
        statusCode: isClientError ? 400 : 500,
        message: error.message || 'Failed to analyze food image with AI',
      });
    }
  };
}

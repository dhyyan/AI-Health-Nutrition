import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { ScanFoodImageUseCase } from '../../../useCases/nutrition/ScanFoodImageUseCase';

export class ScannerController {
  constructor(private scanFoodImageUseCase: ScanFoodImageUseCase) {}

  scanImage = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      let buffer: Buffer | undefined;
      let mimeType = 'image/jpeg';
      let filename: string | undefined;

      if (req.file) {
        buffer = req.file.buffer || (req.file.path ? require('fs').readFileSync(req.file.path) : undefined);
        mimeType = req.file.mimetype || 'image/jpeg';
        filename = req.file.filename;
      } else if (req.body && req.body.imageBase64) {
        const base64Str = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        buffer = Buffer.from(base64Str, 'base64');
        const match = req.body.imageBase64.match(/^data:(image\/\w+);base64,/);
        if (match) {
          mimeType = match[1];
        }
      }

      if (!buffer) {
        return sendResponse({
          res,
          statusCode: 400,
          message: 'Please provide a valid image file or base64 image data.',
        });
      }

      const result = await this.scanFoodImageUseCase.execute(buffer, mimeType, filename);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Food recognized and analyzed successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('Error scanning food image:', error);
      return sendResponse({
        res,
        statusCode: 500,
        message: error.message || 'Failed to analyze food image',
      });
    }
  };
}

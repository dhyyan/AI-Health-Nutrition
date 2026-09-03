import { IFoodRecognitionService, RecognizedFoodResult } from '../../domain/interfaces/services/IFoodRecognitionService';

export interface ScanResultDTO extends RecognizedFoodResult {
  imageUrl?: string;
  isHealthy: boolean; // boolean flag for quick UI styling
}

export class ScanFoodImageUseCase {
  constructor(private foodRecognitionService: IFoodRecognitionService) {}

  async execute(imageBuffer: Buffer, mimeType: string = 'image/jpeg', savedFilePath?: string): Promise<ScanResultDTO> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Image file buffer is empty or invalid.');
    }

    const recognized = await this.foodRecognitionService.recognizeFoodFromImage(imageBuffer, mimeType);

    // Nutrition Rules for Healthy vs Unhealthy verification
    let healthRating = recognized.healthRating;
    let isHealthy = healthRating === 'healthy';

    // Rule engine sanity checks:
    // 1. High saturated fat / high calorie dense fast food -> mark unhealthy
    if (recognized.calories > 750 && recognized.fat > 40 && recognized.fiber < 3) {
      healthRating = 'unhealthy';
      isHealthy = false;
    }

    const imageUrl = savedFilePath ? `/uploads/scans/${savedFilePath}` : `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

    return {
      ...recognized,
      healthRating,
      isHealthy,
      imageUrl,
    };
  }
}

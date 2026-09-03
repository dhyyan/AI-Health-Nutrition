import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { WeightBmiLog } from '../../domain/entities/WeightBmiLog';
import { HealthProfile } from '../../domain/entities/HealthProfile';
import { LogWeightBmiDTO } from '../../domain/interfaces/DTOs/HealthReportDTOs';

export class LogWeightBmiUseCase {
  constructor(
    private weightBmiLogRepository: IWeightBmiLogRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string, dto: LogWeightBmiDTO): Promise<WeightBmiLog> {
    if (!dto.weightKg || dto.weightKg <= 0 || dto.weightKg > 500) {
      throw new Error('Please enter a valid weight in kg (1-500 kg)');
    }

    const healthProfile = await this.healthProfileRepository.findByUserId(userId);
    const heightCm = dto.heightCm || healthProfile?.heightCm || 170;

    const { bmi, category: bmiCategory } = HealthProfile.calculateBMI(heightCm, dto.weightKg);
    const logDate = dto.date || new Date().toISOString().split('T')[0];

    const weightLog = new WeightBmiLog({
      userId,
      weightKg: dto.weightKg,
      heightCm,
      bmi,
      bmiCategory,
      date: logDate,
    });

    const savedLog = await this.weightBmiLogRepository.createOrUpdateLog(weightLog);

    // Update current health profile weight & BMI if date is today or latest
    if (healthProfile) {
      healthProfile.weightKg = dto.weightKg;
      healthProfile.heightCm = heightCm;
      healthProfile.bmi = bmi;
      healthProfile.bmiCategory = bmiCategory;
      await this.healthProfileRepository.upsert(healthProfile);
    }

    return savedLog;
  }
}

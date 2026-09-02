import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { HealthProfileResponseDTO } from '../../domain/interfaces/DTOs/HealthProfileDTOs';

export class GetHealthProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string): Promise<HealthProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const healthProfile = await this.healthProfileRepository.findByUserId(userId);

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      profile: healthProfile
        ? {
            id: healthProfile.id,
            userId: healthProfile.userId,
            age: healthProfile.age,
            gender: healthProfile.gender,
            heightCm: healthProfile.heightCm,
            weightKg: healthProfile.weightKg,
            bloodGroup: healthProfile.bloodGroup || 'Unknown',
            bmi: healthProfile.bmi,
            bmiCategory: healthProfile.bmiCategory,
            goal: healthProfile.goal,
            foodAllergies: healthProfile.foodAllergies || [],
            medicalHistory: healthProfile.medicalHistory || [],
            activityLevel: healthProfile.activityLevel || 'moderate',
            sleepHours: healthProfile.sleepHours || 7,
            dietaryPreference: healthProfile.dietaryPreference || 'Non-Vegetarian',
            hasDiabetes: healthProfile.hasDiabetes || false,
            diabetesStatus: healthProfile.diabetesStatus || 'none',
            updatedAt: healthProfile.updatedAt,
          }
        : null,
    };
  }
}

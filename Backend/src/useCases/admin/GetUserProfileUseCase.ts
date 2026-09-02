import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { UserProfileDetailsDTO } from '../../domain/interfaces/DTOs/AdminDTOs';
import { AppError } from '../../shared/errors/AppError';

export class GetUserProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string): Promise<UserProfileDetailsDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const healthProfile = await this.healthProfileRepository.findByUserId(userId);

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        createdAt: user.createdAt,
      },
      healthProfile: healthProfile
        ? {
            id: healthProfile.id,
            userId: healthProfile.userId,
            age: healthProfile.age,
            gender: healthProfile.gender,
            heightCm: healthProfile.heightCm,
            weightKg: healthProfile.weightKg,
            bloodGroup: healthProfile.bloodGroup,
            bmi: healthProfile.bmi,
            bmiCategory: healthProfile.bmiCategory,
            goal: healthProfile.goal,
            foodAllergies: healthProfile.foodAllergies,
            medicalHistory: healthProfile.medicalHistory,
            activityLevel: healthProfile.activityLevel,
            sleepHours: healthProfile.sleepHours,
            dietaryPreference: healthProfile.dietaryPreference,
            createdAt: healthProfile.createdAt,
            updatedAt: healthProfile.updatedAt,
          }
        : null,
    };
  }
}

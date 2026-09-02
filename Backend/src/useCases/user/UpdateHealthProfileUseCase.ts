import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { HealthProfile } from '../../domain/entities/HealthProfile';
import { UpdateHealthProfileDTO, HealthProfileResponseDTO } from '../../domain/interfaces/DTOs/HealthProfileDTOs';

export class UpdateHealthProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string, dto: UpdateHealthProfileDTO): Promise<HealthProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update basic user name if provided
    if (dto.name && dto.name.trim() !== '' && dto.name !== user.name) {
      user.name = dto.name.trim();
      await this.userRepository.update(user);
    }

    // Validation checks for physical metrics
    if (!dto.heightCm || dto.heightCm <= 0 || dto.heightCm > 300) {
      throw new Error('Please provide a valid height in centimeters (1-300 cm)');
    }
    if (!dto.weightKg || dto.weightKg <= 0 || dto.weightKg > 500) {
      throw new Error('Please provide a valid weight in kilograms (1-500 kg)');
    }
    if (!dto.age || dto.age <= 0 || dto.age > 120) {
      throw new Error('Please provide a valid age (1-120 years)');
    }

    // Server-side calculated BMI and category using domain entity utility
    const { bmi, category: bmiCategory } = HealthProfile.calculateBMI(dto.heightCm, dto.weightKg);

    // Instantiate domain model
    const profileDomain = new HealthProfile({
      userId,
      age: Number(dto.age),
      gender: dto.gender || 'other',
      heightCm: Number(dto.heightCm),
      weightKg: Number(dto.weightKg),
      bloodGroup: dto.bloodGroup || 'Unknown',
      bmi,
      bmiCategory,
      goal: dto.goal || 'maintenance',
      foodAllergies: dto.foodAllergies || [],
      medicalHistory: dto.medicalHistory || [],
      activityLevel: dto.activityLevel || 'moderate',
      sleepHours: Number(dto.sleepHours) || 7,
      dietaryPreference: dto.dietaryPreference || 'Non-Vegetarian',
      hasDiabetes: dto.hasDiabetes ?? false,
      diabetesStatus: dto.diabetesStatus || 'none',
    });

    const updatedProfile = await this.healthProfileRepository.upsert(profileDomain);

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      profile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        age: updatedProfile.age,
        gender: updatedProfile.gender,
        heightCm: updatedProfile.heightCm,
        weightKg: updatedProfile.weightKg,
        bloodGroup: updatedProfile.bloodGroup || 'Unknown',
        bmi: updatedProfile.bmi,
        bmiCategory: updatedProfile.bmiCategory,
        goal: updatedProfile.goal,
        foodAllergies: updatedProfile.foodAllergies,
        medicalHistory: updatedProfile.medicalHistory,
        activityLevel: updatedProfile.activityLevel,
        sleepHours: updatedProfile.sleepHours,
        dietaryPreference: updatedProfile.dietaryPreference,
        hasDiabetes: updatedProfile.hasDiabetes,
        diabetesStatus: updatedProfile.diabetesStatus,
        updatedAt: updatedProfile.updatedAt,
      },
    };
  }
}

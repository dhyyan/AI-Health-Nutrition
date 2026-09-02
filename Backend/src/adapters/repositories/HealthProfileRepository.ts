import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { HealthProfile } from '../../domain/entities/HealthProfile';
import { HealthProfileModel, IHealthProfileDocument } from '../../framework/database/models/HealthProfileModel';

export class HealthProfileRepository implements IHealthProfileRepository {
  private mapToDomain(doc: IHealthProfileDocument): HealthProfile {
    return new HealthProfile({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      age: doc.age,
      gender: doc.gender,
      heightCm: doc.heightCm,
      weightKg: doc.weightKg,
      bloodGroup: doc.bloodGroup,
      bmi: doc.bmi,
      bmiCategory: doc.bmiCategory,
      goal: doc.goal,
      foodAllergies: doc.foodAllergies,
      medicalHistory: doc.medicalHistory,
      activityLevel: doc.activityLevel,
      sleepHours: doc.sleepHours,
      dietaryPreference: doc.dietaryPreference,
      hasDiabetes: doc.hasDiabetes,
      diabetesStatus: doc.diabetesStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<HealthProfile | null> {
    const doc = await HealthProfileModel.findOne({ userId });
    return doc ? this.mapToDomain(doc) : null;
  }

  async upsert(profile: HealthProfile): Promise<HealthProfile> {
    const doc = await HealthProfileModel.findOneAndUpdate(
      { userId: profile.userId },
      {
        userId: profile.userId,
        age: profile.age,
        gender: profile.gender,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        bloodGroup: profile.bloodGroup,
        bmi: profile.bmi,
        bmiCategory: profile.bmiCategory,
        goal: profile.goal,
        foodAllergies: profile.foodAllergies,
        medicalHistory: profile.medicalHistory,
        activityLevel: profile.activityLevel,
        sleepHours: profile.sleepHours,
        dietaryPreference: profile.dietaryPreference,
        hasDiabetes: profile.hasDiabetes,
        diabetesStatus: profile.diabetesStatus,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return this.mapToDomain(doc);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const res = await HealthProfileModel.findOneAndDelete({ userId });
    return res !== null;
  }
}

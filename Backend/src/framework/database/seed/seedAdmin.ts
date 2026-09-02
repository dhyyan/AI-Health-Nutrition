import { UserModel } from '../models/UserModel';
import { HealthProfileModel } from '../models/HealthProfileModel';
import { PasswordService } from '../../services/password/PasswordService';

const passwordService = new PasswordService();

export const seedInitialAdminAndUsers = async () => {
  try {
    // 1. Seed Demo Admin (Gmail)
    const gmailAdmin = await UserModel.findOne({ email: 'admin@gmail.com' });
    if (!gmailAdmin) {
      const passwordHash = await passwordService.hash('Admin@123456');
      await UserModel.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        passwordHash,
        role: 'admin',
        isVerified: true,
        status: 'active',
      });
      console.log('✅ Demo Gmail Admin created: admin@gmail.com / Admin@123456');
    }

    const adminExists = await UserModel.findOne({ role: 'admin' });
    if (!adminExists) {
      const passwordHash = await passwordService.hash('Admin@123456');
      await UserModel.create({
        name: 'System Admin',
        email: 'admin@health.com',
        passwordHash,
        role: 'admin',
        isVerified: true,
        status: 'active',
      });
    }


    // 2. Seed Sample Users & Health Profiles if no regular users exist
    const regularUserCount = await UserModel.countDocuments({ role: 'user' });
    if (regularUserCount === 0) {
      const defaultPasswordHash = await passwordService.hash('User@123456');

      const sampleUsersData = [
        {
          name: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          passwordHash: defaultPasswordHash,
          role: 'user' as const,
          isVerified: true,
          status: 'active' as const,
          healthProfile: {
            age: 28,
            gender: 'female' as const,
            heightCm: 165,
            weightKg: 62,
            bloodGroup: 'O+',
            bmi: 22.8,
            bmiCategory: 'Normal' as const,
            goal: 'weight_loss' as const,
            foodAllergies: ['Peanuts', 'Lactose'],
            medicalHistory: ['Mild Asthma'],
            activityLevel: 'active' as const,
            sleepHours: 8,
            dietaryPreference: 'Vegetarian',
          },
        },
        {
          name: 'Michael Chen',
          email: 'm.chen@example.com',
          passwordHash: defaultPasswordHash,
          role: 'user' as const,
          isVerified: true,
          status: 'active' as const,
          healthProfile: {
            age: 34,
            gender: 'male' as const,
            heightCm: 180,
            weightKg: 88,
            bloodGroup: 'A+',
            bmi: 27.2,
            bmiCategory: 'Overweight' as const,
            goal: 'muscle_gain' as const,
            foodAllergies: [],
            medicalHistory: ['Hypertension'],
            activityLevel: 'moderate' as const,
            sleepHours: 7,
            dietaryPreference: 'Non-Vegetarian',
          },
        },
        {
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          passwordHash: defaultPasswordHash,
          role: 'user' as const,
          isVerified: false,
          status: 'blocked' as const,
          healthProfile: {
            age: 22,
            gender: 'female' as const,
            heightCm: 158,
            weightKg: 44,
            bloodGroup: 'B-',
            bmi: 17.6,
            bmiCategory: 'Underweight' as const,
            goal: 'weight_gain' as const,
            foodAllergies: ['Gluten', 'Shellfish'],
            medicalHistory: ['Anemia'],
            activityLevel: 'sedentary' as const,
            sleepHours: 6,
            dietaryPreference: 'Vegan',
          },
        },
      ];

      for (const uData of sampleUsersData) {
        const { healthProfile, ...uInfo } = uData;
        const createdUser = await UserModel.create(uInfo);
        await HealthProfileModel.create({
          userId: createdUser._id,
          ...healthProfile,
        });
      }
      console.log('✅ Seeded sample user accounts with health profiles.');
    }
  } catch (error) {
    console.error('⚠️ Admin seeder error:', error);
  }
};

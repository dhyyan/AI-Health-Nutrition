export type Gender = 'male' | 'female' | 'other';
export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
export type HealthGoal = 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active';

export interface HealthProfileProps {
  id?: string;
  userId: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bloodGroup?: string;
  bmi: number;
  bmiCategory: BMICategory;
  goal: HealthGoal;
  foodAllergies?: string[];
  medicalHistory?: string[];
  activityLevel?: ActivityLevel;
  sleepHours?: number;
  dietaryPreference?: string;
  hasDiabetes?: boolean;
  diabetesStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class HealthProfile {
  public id?: string;
  public userId: string;
  public age: number;
  public gender: Gender;
  public heightCm: number;
  public weightKg: number;
  public bloodGroup?: string;
  public bmi: number;
  public bmiCategory: BMICategory;
  public goal: HealthGoal;
  public foodAllergies: string[];
  public medicalHistory: string[];
  public activityLevel: ActivityLevel;
  public sleepHours: number;
  public dietaryPreference: string;
  public hasDiabetes: boolean;
  public diabetesStatus: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: HealthProfileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.age = props.age;
    this.gender = props.gender;
    this.heightCm = props.heightCm;
    this.weightKg = props.weightKg;
    this.bloodGroup = props.bloodGroup || 'Unknown';
    this.bmi = props.bmi;
    this.bmiCategory = props.bmiCategory;
    this.goal = props.goal || 'maintenance';
    this.foodAllergies = props.foodAllergies || [];
    this.medicalHistory = props.medicalHistory || [];
    this.activityLevel = props.activityLevel || 'moderate';
    this.sleepHours = props.sleepHours || 7;
    this.dietaryPreference = props.dietaryPreference || 'Non-Vegetarian';
    this.hasDiabetes = props.hasDiabetes ?? false;
    this.diabetesStatus = props.diabetesStatus || 'none';
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static calculateBMI(heightCm: number, weightKg: number): { bmi: number; category: BMICategory } {
    if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
      return { bmi: 0, category: 'Normal' };
    }
    const heightInMeters = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightInMeters * heightInMeters)).toFixed(1));

    let category: BMICategory = 'Normal';
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi < 25) {
      category = 'Normal';
    } else if (bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    return { bmi, category };
  }
}

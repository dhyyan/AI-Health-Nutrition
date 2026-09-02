import { MicronutrientInfo } from './FoodItem';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodLogProps {
  id?: string;
  userId: string;
  foodItemId?: string;
  foodName: string;
  mealType: MealType;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminsAndMinerals?: MicronutrientInfo[];
  loggedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FoodLog {
  public id?: string;
  public userId: string;
  public foodItemId?: string;
  public foodName: string;
  public mealType: MealType;
  public servingSize: number;
  public servingUnit: string;
  public calories: number;
  public protein: number;
  public carbohydrates: number;
  public fat: number;
  public fiber: number;
  public sugar: number;
  public sodium: number;
  public vitaminsAndMinerals: MicronutrientInfo[];
  public loggedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: FoodLogProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.foodItemId = props.foodItemId;
    this.foodName = props.foodName;
    this.mealType = props.mealType || 'snack';
    this.servingSize = props.servingSize;
    this.servingUnit = props.servingUnit || 'g';
    this.calories = Math.round(props.calories);
    this.protein = parseFloat(props.protein.toFixed(1));
    this.carbohydrates = parseFloat(props.carbohydrates.toFixed(1));
    this.fat = parseFloat(props.fat.toFixed(1));
    this.fiber = parseFloat((props.fiber || 0).toFixed(1));
    this.sugar = parseFloat((props.sugar || 0).toFixed(1));
    this.sodium = Math.round(props.sodium || 0);
    this.vitaminsAndMinerals = props.vitaminsAndMinerals || [];
    this.loggedAt = props.loggedAt || new Date();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface MicronutrientInfo {
  name: string;
  amount: number;
  unit: string;
  dailyValuePercentage?: number;
}

export interface ServingSizeOption {
  amount: number;
  unit: string;
  label?: string;
}

export interface FoodItemProps {
  id?: string;
  name: string;
  category: string;
  brand?: string;
  servingSize: number; // default e.g. 100
  servingUnit: string; // default e.g. 'g'
  servingOptions?: ServingSizeOption[];
  calories: number; // kcal
  protein: number; // g
  carbohydrates: number; // g
  fat: number; // g
  fiber?: number; // g
  sugar?: number; // g
  sodium?: number; // mg
  vitaminsAndMinerals?: MicronutrientInfo[];
  dataSource?: string;
  imageUrl?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FoodItem {
  public id?: string;
  public name: string;
  public category: string;
  public brand?: string;
  public servingSize: number;
  public servingUnit: string;
  public servingOptions: ServingSizeOption[];
  public calories: number;
  public protein: number;
  public carbohydrates: number;
  public fat: number;
  public fiber: number;
  public sugar: number;
  public sodium: number;
  public vitaminsAndMinerals: MicronutrientInfo[];
  public dataSource: string;
  public imageUrl?: string;
  public isVerified: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: FoodItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.category = props.category || 'General Food';
    this.brand = props.brand || '';
    this.servingSize = props.servingSize || 100;
    this.servingUnit = props.servingUnit || 'g';
    this.servingOptions = props.servingOptions || [
      { amount: 100, unit: 'g', label: '100 grams' },
      { amount: 1, unit: 'serving', label: '1 standard serving' },
    ];
    this.calories = props.calories;
    this.protein = props.protein;
    this.carbohydrates = props.carbohydrates;
    this.fat = props.fat;
    this.fiber = props.fiber ?? 0;
    this.sugar = props.sugar ?? 0;
    this.sodium = props.sodium ?? 0;
    this.vitaminsAndMinerals = props.vitaminsAndMinerals || [];
    this.dataSource = props.dataSource || 'Verified Database';
    this.imageUrl = props.imageUrl || '';
    this.isVerified = props.isVerified ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

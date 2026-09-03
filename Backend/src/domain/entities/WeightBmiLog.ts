export interface WeightBmiLogProps {
  id?: string;
  userId: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: string;
  date: string; // Format: YYYY-MM-DD
  recordedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WeightBmiLog {
  public id?: string;
  public userId: string;
  public weightKg: number;
  public heightCm: number;
  public bmi: number;
  public bmiCategory: string;
  public date: string;
  public recordedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: WeightBmiLogProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.weightKg = props.weightKg;
    this.heightCm = props.heightCm;
    this.bmi = props.bmi;
    this.bmiCategory = props.bmiCategory;
    this.date = props.date;
    this.recordedAt = props.recordedAt || new Date();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

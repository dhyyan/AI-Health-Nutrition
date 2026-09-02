import { HealthProfile } from '../../entities/HealthProfile';

export interface IHealthProfileRepository {
  findByUserId(userId: string): Promise<HealthProfile | null>;
  upsert(profile: HealthProfile): Promise<HealthProfile>;
  deleteByUserId(userId: string): Promise<boolean>;
}

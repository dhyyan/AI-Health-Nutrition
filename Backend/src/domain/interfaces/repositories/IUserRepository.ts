import { User } from '../../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  findAll(query?: { search?: string; status?: string; role?: string }): Promise<User[]>;
  count(query?: { search?: string; status?: string; role?: string }): Promise<number>;
}


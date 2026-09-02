import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel, IUserDocument } from '../../framework/database/models/UserModel';

export class UserRepository implements IUserRepository {
  private mapToDomain(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      isVerified: doc.isVerified,
      verificationOtp: doc.verificationOtp,
      otpExpiresAt: doc.otpExpiresAt,
      resetPasswordOtp: doc.resetPasswordOtp,
      resetPasswordExpiresAt: doc.resetPasswordExpiresAt,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
    return doc ? this.mapToDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.mapToDomain(doc) : null;
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isVerified: user.isVerified,
      verificationOtp: user.verificationOtp,
      otpExpiresAt: user.otpExpiresAt,
      resetPasswordOtp: user.resetPasswordOtp,
      resetPasswordExpiresAt: user.resetPasswordExpiresAt,
      status: user.status,
    });
    return this.mapToDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        isVerified: user.isVerified,
        verificationOtp: user.verificationOtp,
        otpExpiresAt: user.otpExpiresAt,
        resetPasswordOtp: user.resetPasswordOtp,
        resetPasswordExpiresAt: user.resetPasswordExpiresAt,
        status: user.status,
      },
      { new: true }
    );

    if (!updated) {
      throw new Error(`User with ID ${user.id} not found for update`);
    }

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    const res = await UserModel.findByIdAndDelete(id);
    return res !== null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => this.mapToDomain(doc));
  }
}

import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IStorageService } from '../../domain/interfaces/services/IStorageService';
import { UserProfileSummaryDTO } from '../../domain/interfaces/DTOs/HealthProfileDTOs';

export class UploadProfilePictureUseCase {
  constructor(
    private userRepository: IUserRepository,
    private storageService: IStorageService
  ) {}

  async execute(userId: string, file: Express.Multer.File): Promise<UserProfileSummaryDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!file) {
      throw new Error('No image file provided');
    }

    // Delete old picture if local file exists
    if (user.profilePicture) {
      await this.storageService.deleteFile(user.profilePicture);
    }

    // Save new file
    const pictureUrl = await this.storageService.uploadFile(file);

    user.profilePicture = pictureUrl;
    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
    };
  }
}

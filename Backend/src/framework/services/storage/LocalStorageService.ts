import fs from 'fs';
import path from 'path';
import { IStorageService } from '../../../domain/interfaces/services/IStorageService';

export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor(uploadSubDir: string = 'profiles') {
    this.uploadDir = path.join(process.cwd(), 'uploads', uploadSubDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // The file is saved by Multer diskStorage to file.path
    // Return relative static access path e.g. /uploads/profiles/filename.png
    const fileName = path.basename(file.path);
    return `/uploads/profiles/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl) return false;
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting local file:', error);
      return false;
    }
  }
}

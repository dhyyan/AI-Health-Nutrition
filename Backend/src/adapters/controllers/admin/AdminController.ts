import { Request, Response, NextFunction } from 'express';
import { AdminLoginUseCase } from '../../../useCases/admin/AdminLoginUseCase';
import { GetAllUsersUseCase } from '../../../useCases/admin/GetAllUsersUseCase';
import { GetUserProfileUseCase } from '../../../useCases/admin/GetUserProfileUseCase';
import { UpdateUserStatusUseCase } from '../../../useCases/admin/UpdateUserStatusUseCase';
import { DeleteUserUseCase } from '../../../useCases/admin/DeleteUserUseCase';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { UserStatus, UserRole } from '../../../domain/entities/User';

export class AdminController {
  constructor(
    private adminLoginUseCase: AdminLoginUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserProfileUseCase: GetUserProfileUseCase,
    private updateUserStatusUseCase: UpdateUserStatusUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.adminLoginUseCase.execute({ email, password });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Admin authentication successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { search, status, role, page, limit } = req.query;

      const result = await this.getAllUsersUseCase.execute({
        search: search ? String(search) : undefined,
        status: status ? (String(status) as UserStatus) : undefined,
        role: role ? (String(role) as UserRole) : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Users retrieved successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.getUserProfileUseCase.execute(id);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'User profile retrieved successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminId = req.user!.userId;

      const result = await this.updateUserStatusUseCase.execute({
        userId: id,
        status,
        adminId,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: `User status updated to ${status} successfully.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user!.userId;

      await this.deleteUserUseCase.execute(id, adminId);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'User account and associated profile deleted successfully.',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

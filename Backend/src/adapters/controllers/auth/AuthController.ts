import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../useCases/auth/RegisterUserUseCase';
import { VerifyEmailOTPUseCase } from '../../../useCases/auth/VerifyEmailOTPUseCase';
import { ResendOTPUseCase } from '../../../useCases/auth/ResendOTPUseCase';
import { LoginUserUseCase } from '../../../useCases/auth/LoginUserUseCase';
import { ForgotPasswordUseCase } from '../../../useCases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../../useCases/auth/ResetPasswordUseCase';
import { GetAuthenticatedUserUseCase } from '../../../useCases/auth/GetAuthenticatedUserUseCase';
import { sendResponse } from '../../../shared/utils/apiResponse';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../../shared/validators/auth.validator';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private verifyEmailOTPUseCase: VerifyEmailOTPUseCase,
    private resendOTPUseCase: ResendOTPUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await this.registerUserUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 201,
        message: result.message,
        data: { email: result.email, otp: result.otp },
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = verifyOtpSchema.parse(req.body);
      const result = await this.verifyEmailOTPUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Account successfully verified!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = resendOtpSchema.parse(req.body);
      const result = await this.resendOTPUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 200,
        message: result.message,
        data: { email: result.email, otp: result.otp },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await this.loginUserUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Login successful!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      const result = await this.forgotPasswordUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 200,
        message: result.message,
        data: { email: result.email, otp: result.otp },
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      const result = await this.resetPasswordUseCase.execute(validated);
      return sendResponse({
        res,
        statusCode: 200,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = await this.getAuthenticatedUserUseCase.execute(userId);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'User profile retrieved',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

import { Router } from 'express';
import { UserRepository } from '../../adapters/repositories/UserRepository';
import { PasswordService } from '../services/password/PasswordService';
import { JwtService } from '../services/jwt/JwtService';
import { EmailService } from '../services/email/EmailService';
import { RegisterUserUseCase } from '../../useCases/auth/RegisterUserUseCase';
import { VerifyEmailOTPUseCase } from '../../useCases/auth/VerifyEmailOTPUseCase';
import { ResendOTPUseCase } from '../../useCases/auth/ResendOTPUseCase';
import { LoginUserUseCase } from '../../useCases/auth/LoginUserUseCase';
import { ForgotPasswordUseCase } from '../../useCases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../useCases/auth/ResetPasswordUseCase';
import { GetAuthenticatedUserUseCase } from '../../useCases/auth/GetAuthenticatedUserUseCase';
import { AuthController } from '../../adapters/controllers/auth/AuthController';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';

const router = Router();

// Instantiate Clean Architecture dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();
const emailService = new EmailService();

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService, emailService);
const verifyEmailOTPUseCase = new VerifyEmailOTPUseCase(userRepository, jwtService);
const resendOTPUseCase = new ResendOTPUseCase(userRepository, emailService);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordService, jwtService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordService);
const getAuthenticatedUserUseCase = new GetAuthenticatedUserUseCase(userRepository);

const authController = new AuthController(
  registerUserUseCase,
  verifyEmailOTPUseCase,
  resendOTPUseCase,
  loginUserUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  getAuthenticatedUserUseCase
);

// Endpoints
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected endpoint
router.get('/me', authenticateJwt, authController.getMe);

export default router;

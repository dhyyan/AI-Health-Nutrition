import { Router } from 'express';
import { UserRepository } from '../../adapters/repositories/UserRepository';
import { HealthProfileRepository } from '../../adapters/repositories/HealthProfileRepository';
import { PasswordService } from '../services/password/PasswordService';
import { JwtService } from '../services/jwt/JwtService';

import { AdminLoginUseCase } from '../../useCases/admin/AdminLoginUseCase';
import { GetAllUsersUseCase } from '../../useCases/admin/GetAllUsersUseCase';
import { GetUserProfileUseCase } from '../../useCases/admin/GetUserProfileUseCase';
import { UpdateUserStatusUseCase } from '../../useCases/admin/UpdateUserStatusUseCase';
import { DeleteUserUseCase } from '../../useCases/admin/DeleteUserUseCase';

import { AdminController } from '../../adapters/controllers/admin/AdminController';
import { authenticateJwt, requireRole } from '../../adapters/middlewares/auth.middleware';

const router = Router();

// Instantiate Repositories & Services
const userRepository = new UserRepository();
const healthProfileRepository = new HealthProfileRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();

// Instantiate Use Cases
const adminLoginUseCase = new AdminLoginUseCase(userRepository, passwordService, jwtService);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository, healthProfileRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository, healthProfileRepository);

// Instantiate Controller
const adminController = new AdminController(
  adminLoginUseCase,
  getAllUsersUseCase,
  getUserProfileUseCase,
  updateUserStatusUseCase,
  deleteUserUseCase
);

// Public Admin Login & Information Routes
router.post('/login', adminController.login);

// Handle GET /login gracefully: browser visits get redirected to the frontend Admin Login page (/admin/login)
router.get('/login', (req, res) => {
  if (req.accepts('html')) {
    return res.redirect('/admin/login');
  }
  return res.status(405).json({
    success: false,
    message: 'Admin login endpoint accepts POST requests only with JSON body { email, password }. For the web portal, please navigate to /admin/login.',
  });
});

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.redirect('/admin/login');
  }
  return res.status(200).json({
    success: true,
    message: 'NutriAI Admin API service active. Web portal available at /admin/login.',
  });
});

// Protected Admin Routes
router.use(authenticateJwt, requireRole('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserProfile);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

export default router;

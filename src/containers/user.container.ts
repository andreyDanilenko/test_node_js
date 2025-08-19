import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';
import { AuthController } from '../controllers/authController';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export { authController };

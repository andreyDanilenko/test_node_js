import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/userRepository';
import { IUserCreate, IAuthResult } from '../interfaces/user.interface';
import { AuthenticationError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface IAuthService {
  registerUser(userData: IUserCreate): Promise<IAuthResult>;
  loginUser(email: string, password: string): Promise<IAuthResult>;
}

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(userData: IUserCreate): Promise<IAuthResult> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const token = this.generateToken(user.id);
    const sanitizedUser = this.userRepository.sanitizeUser(user);

    return { user: sanitizedUser, token };
  }

  async loginUser(email: string, password: string): Promise<IAuthResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    const sanitizedUser = this.userRepository.sanitizeUser(user);

    return { user: sanitizedUser, token };
  }

  // Далее можно зашить информацию о роли и тд
  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  }
}

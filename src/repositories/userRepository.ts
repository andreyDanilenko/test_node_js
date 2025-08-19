import { User } from '../models/User';
import { IUser, IUserCreate, IUserSanitized } from '../interfaces/user.interface';
import { NotFoundError, ConflictError } from '../utils/errors';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  create(userData: IUserCreate): Promise<IUser>;
  sanitizeUser(user: IUser): IUserSanitized;
}

export class UserRepository implements IUserRepository {
    async findByEmail(email: string, throwIfNotFound: boolean = false): Promise<IUser | null> {
        const user = await User.findOne({ where: { email } });
        if (throwIfNotFound && !user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async findById(id: number): Promise<IUser | null> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    async create(userData: IUserCreate): Promise<IUser> {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictError('User already exists');
        }

        return User.create(userData);
    }

    sanitizeUser(user: IUser): IUserSanitized {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
    }
}

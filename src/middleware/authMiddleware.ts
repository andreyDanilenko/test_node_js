import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils/response';
import { AuthenticationError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      ResponseHandler.error(res, new AuthenticationError('Access denied. No token provided.'), 401);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    ResponseHandler.error(res, new AuthenticationError('Invalid token'), 401);
  }
};

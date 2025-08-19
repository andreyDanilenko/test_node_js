import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ResponseHandler } from '../utils/response';
import { AppError } from '../utils/errors';

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
        const { email, password, firstName, lastName } = req.body;

        const result = await this.authService.registerUser({
            email,
            password,
            firstName,
            lastName
        });
            ResponseHandler.created(res, result, 'User created successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.loginUser(email, password);

            ResponseHandler.success(res, result, 'Login successful');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private handleError(error: unknown, res: Response): void {
        if (error instanceof AppError) {
            ResponseHandler.error(res, error, error.statusCode);
        } else if (error instanceof Error) {
            ResponseHandler.error(res, error);
        } else {
            ResponseHandler.error(res, 'Internal server error');
        }
    }
}

import express from 'express';
import type { Request, Response } from 'express';
import { authController } from '../config/dependencies';
import { validate } from '../middleware/validation.middleware';
import { loginValidator, registrationValidator } from '../validators/auth.validator';

const router = express.Router();

router.post(
    '/register',
    validate(registrationValidator),
    (req: Request, res: Response) => authController.register(req, res)
);

router.post(
    '/login',
    validate(loginValidator),
    (req: Request, res: Response) => authController.login(req, res)
);

export default router;

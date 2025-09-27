import express from 'express';
import type { Request, Response } from 'express';
import { authController } from '../containers/user.container';
import { validate } from '../middleware/validation.middleware';
import { loginValidator, registrationValidator } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/authMiddleware';

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

router.use(authMiddleware);

router.get(
    '/me',
    (req: Request, res: Response) => authController.getCurrentUser(req, res)
);

export default router;

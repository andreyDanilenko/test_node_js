import { Router } from 'express';
import authRoutes from './authRoutes';
import boardRoutes from './boardRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/board', boardRoutes);


export default router;

import { Router } from 'express';
import authRoutes from './authRoutes';
import boardRoutes from './boardRoutes';
import stickyNoteRoutes from './stickyNoteRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/boards', boardRoutes);
router.use('/api/sticky-notes', stickyNoteRoutes);


export default router;

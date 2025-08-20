import express from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validation.middleware';
import { updateStickyNoteValidator } from '../validators/stickyNote.validator';
import { stickyNoteController } from '../containers/board.container';

const router = express.Router();
router.use(authMiddleware);

router.put(
  '/:id',
  validate(updateStickyNoteValidator),
  (req: Request, res: Response) => stickyNoteController.updateStickyNote(req, res)
);

router.patch('/:id/move', (req, res) =>
  stickyNoteController.moveStickyNote(req, res)
);

router.delete('/:id', (req: Request, res: Response) => 
  stickyNoteController.deleteStickyNote(req, res)
);

export default router;

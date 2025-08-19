import express from 'express';
import type { Request, Response } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createStickyNoteValidator } from '../validators/stickyNote.validator';
import { stickyNoteController } from '../containers/board.container';

const router = express.Router();

router.post(
  '/sticky-notes',
  validate(createStickyNoteValidator),
  (req: Request, res: Response) => stickyNoteController.createStickyNote(req, res)
);

export default router;

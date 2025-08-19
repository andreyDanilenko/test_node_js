import express from 'express';
import type { Request, Response } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createBoardValidator } from '../validators/board.validator';
import { authMiddleware } from '../middleware/authMiddleware';
import { boardController } from '../containers/board.container';

const router = express.Router();
router.use(authMiddleware);

router.get(
    '/', 
    (req: Request, res: Response) =>  boardController.getBoards(req, res)
);

router.post(
    '/',
    validate(createBoardValidator),
    (req: Request, res: Response) => boardController.createBoard(req, res)
);

router.get(
    '/:id/sticky-notes', 
    (req: Request, res: Response) => boardController.getBoardStickyNotes(req, res)
);

export default router;

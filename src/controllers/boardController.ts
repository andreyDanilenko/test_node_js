import { Request, Response } from 'express';
import { IBoardService } from '../services/boardService';
import { ResponseHandler } from '../utils/response';
import { AppError } from '../utils/errors';

export class BoardController {
  constructor(private boardService: IBoardService) {}

  async getBoards(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const boards = await this.boardService.getUserBoards(userId);
      ResponseHandler.success(res, boards, 'Boards retrieved successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async createBoard(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const userId = (req as any).userId;

      const board = await this.boardService.createBoard({
        title,
        description,
        userId
      });

      ResponseHandler.created(res, board, 'Board created successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getBoardStickyNotes(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const result = await this.boardService.getBoardWithStickyNotes(
        parseInt(id),
        userId
      );

      ResponseHandler.success(res, result, 'Board with sticky notes retrieved successfully');
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

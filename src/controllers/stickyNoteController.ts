import { Request, Response } from 'express';
import { IStickyNoteService } from '../services/stickyNoteService';
import { ResponseHandler } from '../utils/response';
import { AppError } from '../utils/errors';

export class StickyNoteController {
  constructor(private stickyNoteService: IStickyNoteService) {}

  async createStickyNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, color, positionX, positionY } = req.body;
      const userId = (req as any).userId;

      const stickyNote = await this.stickyNoteService.createStickyNote({
        title,
        content,
        color,
        positionX,
        positionY,
        boardId: parseInt(id)
      }, userId);

      ResponseHandler.created(res, stickyNote, 'Sticky note created successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateStickyNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = (req as any).userId;

      const stickyNote = await this.stickyNoteService.updateStickyNote(
        parseInt(id),
        updates,
        userId
      );

      ResponseHandler.success(res, stickyNote, 'Sticky note updated successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteStickyNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await this.stickyNoteService.deleteStickyNote(parseInt(id), userId);
      
      ResponseHandler.noContent(res, 'Sticky note deleted successfully');
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

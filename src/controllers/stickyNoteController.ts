import { Request, Response } from 'express';
import { IStickyNoteService } from '../services/stickyNoteService';
import { ResponseHandler } from '../utils/response';
import { AppError } from '../utils/errors';
import { Server } from 'socket.io';

export class StickyNoteController {
  constructor(private stickyNoteService: IStickyNoteService) {}

  async createStickyNote(req: Request, res: Response): Promise<void> {
    try {      
      const { id } = req.params;
      const { title, content, color, positionX, positionY } = req.body;
      const userId = (req as any).userId;
      const io: Server = (req as any).io; // Получаем io из запроса

      const stickyNote = await this.stickyNoteService.createStickyNote({
        title,
        content,
        color,
        positionX,
        positionY,
        boardId: parseInt(id)
      }, userId);

      // Отправляем событие через Socket.IO
      io.emit('sticky_note_created', stickyNote);

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
      const io: Server = (req as any).io;

      const stickyNote = await this.stickyNoteService.updateStickyNote(
        parseInt(id),
        updates,
        userId
      );

      // Отправляем событие через Socket.IO
      io.emit('sticky_note_updated', stickyNote);

      ResponseHandler.success(res, stickyNote, 'Sticky note updated successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteStickyNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const io: Server = (req as any).io;

      // Получаем данные стикера перед удалением
      const stickyNote = await this.stickyNoteService.getStickyNoteById(parseInt(id), userId);
      
      await this.stickyNoteService.deleteStickyNote(parseInt(id), userId);

      io.emit('sticky_note_deleted', { id: parseInt(id), boardId: stickyNote?.boardId });

      ResponseHandler.noContent(res, 'Sticky note deleted successfully');
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async moveStickyNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { positionX, positionY } = req.body;
      const userId = (req as any).userId;
      const io: Server = (req as any).io;

      const stickyNote = await this.stickyNoteService.updateStickyNote(
        parseInt(id),
        { positionX, positionY },
        userId
      );

      io.emit('sticky_note_moved', stickyNote);

      ResponseHandler.success(res, stickyNote, 'Sticky note moved successfully');
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

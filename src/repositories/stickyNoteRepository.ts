import { StickyNote, Board } from '../models';
import { 
  IStickyNote, 
  IStickyNoteCreate, 
  IStickyNoteUpdate, 
  IStickyNoteSanitized 
} from '../interfaces/stickyNote.interface';
import { NotFoundError } from '../utils/errors';

export interface IStickyNoteRepository {
  findById(id: number, userId?: number): Promise<IStickyNote | null>;
  create(stickyNoteData: IStickyNoteCreate): Promise<IStickyNote>;
  update(id: number, updates: IStickyNoteUpdate): Promise<IStickyNote>;
  delete(id: number): Promise<void>;
  sanitizeStickyNote(stickyNote: IStickyNote): IStickyNoteSanitized;
  checkUserAccess(stickyNoteId: number, userId: number): Promise<boolean>;
}

export class StickyNoteRepository implements IStickyNoteRepository {
  async findById(id: number, userId?: number): Promise<IStickyNote | null> {
    const where: any = { id };
    
    if (userId) {
      const stickyNote = await StickyNote.findOne({
        where: { id },
        include: [{
          model: Board,
          where: { userId },
          required: true
        }]
      });
      
      if (!stickyNote) {
        throw new NotFoundError('Sticky note not found');
      }
      
      return stickyNote;
    }
    
    return StickyNote.findByPk(id);
  }

  async create(stickyNoteData: IStickyNoteCreate): Promise<IStickyNote> {
    return StickyNote.create({
      ...stickyNoteData,
      positionX: stickyNoteData.positionX || 0,
      positionY: stickyNoteData.positionY || 0
    });
  }

  async update(id: number, updates: IStickyNoteUpdate): Promise<IStickyNote> {
    const stickyNote = await StickyNote.findByPk(id);
    if (!stickyNote) {
      throw new NotFoundError('Sticky note not found');
    }

    await stickyNote.update(updates);
    return stickyNote;
  }

  async delete(id: number): Promise<void> {
    const stickyNote = await StickyNote.findByPk(id);
    if (!stickyNote) {
      throw new NotFoundError('Sticky note not found');
    }

    await stickyNote.destroy();
  }

  async checkUserAccess(stickyNoteId: number, userId: number): Promise<boolean> {
    const stickyNote = await StickyNote.findOne({
      where: { id: stickyNoteId },
      include: [{
        model: Board,
        where: { userId },
        required: true
      }]
    });

    return !!stickyNote;
  }

  sanitizeStickyNote(stickyNote: IStickyNote): IStickyNoteSanitized {    
    return {
      id: stickyNote.id,
      title: stickyNote.title,
      content: stickyNote.content,
      color: stickyNote.color,
      positionX: stickyNote.positionX,
      positionY: stickyNote.positionY,
      boardId: stickyNote.boardId,
      createdAt: stickyNote.createdAt,
      updatedAt: stickyNote.updatedAt
    };
  }
}

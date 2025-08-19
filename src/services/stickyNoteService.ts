import { 
  IStickyNoteRepository 
} from '../repositories/stickyNoteRepository';
import { 
  IStickyNoteCreate, 
  IStickyNoteUpdate, 
  IStickyNoteSanitized 
} from '../interfaces/stickyNote.interface';
import { IBoardRepository } from '../repositories/boardRepository';
import { ForbiddenError } from '../utils/errors';

export interface IStickyNoteService {
  createStickyNote(stickyNoteData: IStickyNoteCreate, userId: number): Promise<IStickyNoteSanitized>;
  updateStickyNote(id: number, updates: IStickyNoteUpdate, userId: number): Promise<IStickyNoteSanitized>;
  deleteStickyNote(id: number, userId: number): Promise<void>;
}

export class StickyNoteService implements IStickyNoteService {
  constructor(
    private stickyNoteRepository: IStickyNoteRepository,
    private boardRepository: IBoardRepository
  ) {}

  async createStickyNote(stickyNoteData: IStickyNoteCreate, userId: number): Promise<IStickyNoteSanitized> {
    // Проверяем, что доска принадлежит пользователю
    await this.boardRepository.findById(stickyNoteData.boardId, userId);
    
    const stickyNote = await this.stickyNoteRepository.create(stickyNoteData);
    return this.stickyNoteRepository.sanitizeStickyNote(stickyNote);
  }

  async updateStickyNote(id: number, updates: IStickyNoteUpdate, userId: number): Promise<IStickyNoteSanitized> {
    // Проверяем доступ пользователя к стикеру
    const hasAccess = await this.stickyNoteRepository.checkUserAccess(id, userId);
    if (!hasAccess) {
      throw new ForbiddenError('Access denied');
    }

    const stickyNote = await this.stickyNoteRepository.update(id, updates);
    return this.stickyNoteRepository.sanitizeStickyNote(stickyNote);
  }

  async deleteStickyNote(id: number, userId: number): Promise<void> {
    // Проверяем доступ пользователя к стикеру
    const hasAccess = await this.stickyNoteRepository.checkUserAccess(id, userId);
    if (!hasAccess) {
      throw new ForbiddenError('Access denied');
    }

    await this.stickyNoteRepository.delete(id);
  }
}

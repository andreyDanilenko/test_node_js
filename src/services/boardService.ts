import { IBoardRepository } from '../repositories/boardRepository';
import { IBoard, IBoardCreate, IBoardSanitized } from '../interfaces/board.interface';
import { StickyNote } from '../models/StickyNote';
import { NotFoundError } from '../utils/errors';

export interface IBoardService {
  getUserBoards(userId: number): Promise<IBoardSanitized[]>;
  getAllBoards(): Promise<IBoardSanitized[]>; 
  createBoard(boardData: IBoardCreate): Promise<IBoardSanitized>;
  getBoardWithStickyNotes(boardId: number, userId: number): Promise<any>;
  getPublicBoardWithStickyNotes(boardId: number): Promise<any>;
}

export class BoardService implements IBoardService {
  constructor(private boardRepository: IBoardRepository) {}

  async getUserBoards(userId: number): Promise<IBoardSanitized[]> {
    const boards = await this.boardRepository.findAllByUserId(userId);
    return boards.map(board => this.boardRepository.sanitizeBoard(board));
  }

  async getAllBoards(): Promise<IBoardSanitized[]> {
    const boards = await this.boardRepository.findAll();
    return boards.map(board => this.boardRepository.sanitizeBoard(board));
  }

  async createBoard(boardData: IBoardCreate): Promise<IBoardSanitized> {
    const board = await this.boardRepository.create(boardData);
    return this.boardRepository.sanitizeBoard(board);
  }

  async getBoardWithStickyNotes(boardId: number, userId: number): Promise<any> {
    const board = await this.boardRepository.findById(boardId, userId);
    
    const stickyNotes = await StickyNote.findAll({
      where: { boardId },
      order: [['createdAt', 'ASC']],
    });

    return {
      board: this.boardRepository.sanitizeBoard(board),
      stickyNotes
    };
  }

  async getPublicBoardWithStickyNotes(boardId: number): Promise<any> {
    const board = await this.boardRepository.findById(boardId);
    
    if (!board) {
      throw new NotFoundError('Доска не найдена');
    }

    const stickyNotes = await StickyNote.findAll({
      where: { boardId },
      order: [['createdAt', 'ASC']],
    });

    return {
      board: this.boardRepository.sanitizeBoard(board),
      stickyNotes
    };
  }
}

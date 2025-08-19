import { Board } from '../models/Board';
import { IBoard, IBoardCreate, IBoardSanitized } from '../interfaces/board.interface';
import { NotFoundError } from '../utils/errors';

export interface IBoardRepository {
  findAllByUserId(userId: number): Promise<IBoard[]>;
  findById(id: number, userId?: number): Promise<IBoard>;
  create(boardData: IBoardCreate): Promise<IBoard>;
  sanitizeBoard(board: IBoard): IBoardSanitized;
}

export class BoardRepository implements IBoardRepository {
  async findAllByUserId(userId: number): Promise<IBoard[]> {
    return Board.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number, userId?: number): Promise<IBoard> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const board = await Board.findOne({ where });
    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }

  async create(boardData: IBoardCreate): Promise<IBoard> {
    return Board.create(boardData);
  }

  sanitizeBoard(board: IBoard): IBoardSanitized {
    return {
      id: board.id,
      title: board.title,
      description: board.description,
      userId: board.userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}

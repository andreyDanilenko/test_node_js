import { BoardRepository } from '../repositories/boardRepository';
import { BoardService } from '../services/boardService';
import { BoardController } from '../controllers/boardController';

const boardRepository = new BoardRepository();
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

export { boardController };

import { BoardRepository } from '../repositories/boardRepository';
import { StickyNoteRepository } from '../repositories/stickyNoteRepository';
import { BoardService } from '../services/boardService';
import { StickyNoteService } from '../services/stickyNoteService';
import { BoardController } from '../controllers/boardController';
import { StickyNoteController } from '../controllers/stickyNoteController';

// Репозитории
const boardRepository = new BoardRepository();
const stickyNoteRepository = new StickyNoteRepository();

// Сервисы
const boardService = new BoardService(boardRepository);
const stickyNoteService = new StickyNoteService(stickyNoteRepository, boardRepository);

// Контроллеры
const boardController = new BoardController(boardService);
const stickyNoteController = new StickyNoteController(stickyNoteService);

export { 
  boardController, 
  stickyNoteController,
};

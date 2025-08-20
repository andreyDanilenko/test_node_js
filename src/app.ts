import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes';
import { getAllModelsData } from './controllers/dump';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

app.use(routes);


const clients = new Map();
io.on('connection', (socket) => {
  console.log('✅ Клиент подключился:', socket.id);
  clients.set(socket.id, { connected: new Date() });

  socket.emit('server_message', {
    type: 'welcome',
    message: 'Добро пожаловать на сервер!',
    clientsCount: clients.size
  });

  socket.broadcast.emit('server_message', {
    type: 'user_joined',
    message: `Новый пользователь ${socket.id} присоединился`,
    clientId: socket.id,
    clientsCount: clients.size
  });

  io.emit('clients_count', clients.size);

socket.on('client_message', (msg) => {
  console.log('📨 Сообщение от', socket.id, ':', msg);
  
  // Проверяем тип сообщения
  if (typeof msg === 'string') {
    // Текстовые сообщения
    io.emit('server_message', {
      type: 'message',
      message: msg,
      clientId: socket.id,
      timestamp: new Date().toLocaleTimeString()
    });

    if (msg.toLowerCase() === 'exit') {
      socket.emit('server_message', {
        type: 'goodbye',
        message: 'До свидания!'
      });
      socket.disconnect();
    }
  } else if (typeof msg === 'object' && msg !== null) {
    // Объектные сообщения (например, для sticky notes)
    io.emit('server_message', {
      type: 'object_message',
      data: msg,
      clientId: socket.id,
      timestamp: new Date().toLocaleTimeString()
    });
  }
});

  socket.on('disconnect', () => {
    console.log('🔌 Клиент отключился:', socket.id);
    clients.delete(socket.id);

    io.emit('server_message', {
      type: 'user_left',
      message: `Пользователь ${socket.id} вышел`,
      clientId: socket.id,
      clientsCount: clients.size
    });

    io.emit('clients_count', clients.size);
  });

  socket.on('error', (error) => {
    console.log('❌ Ошибка:', error);
  });
});

export { app, server, io };

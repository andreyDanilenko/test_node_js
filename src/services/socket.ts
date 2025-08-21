import { Server, Socket } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

interface ClientInfo {
  connected: Date;
}

const clients = new Map<string, ClientInfo>();
let ioInstance: Server | null = null;

export const initSocket = async (io: Server) => {
  ioInstance = io;

  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket: Socket) => {
    console.log('Клиент подключился:', socket.id);
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

    socket.on('client_message', (msg) => handleClientMessage(io, socket, msg));
    socket.on('disconnect', () => handleDisconnect(io, socket));
    socket.on('error', (error) => console.log('Ошибка:', error));
  });
};

export const getIO = (): Server => {
  if (!ioInstance) throw new Error('Socket.IO не инициализирован!');
  return ioInstance;
};

const handleClientMessage = (io: Server, socket: Socket, msg: any) => {
  console.log('Сообщение от', socket.id, ':', msg);

  if (typeof msg === 'string') {
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
    io.emit('server_message', {
      type: 'object_message',
      data: msg,
      clientId: socket.id,
      timestamp: new Date().toLocaleTimeString()
    });
  }
};

const handleDisconnect = (io: Server, socket: Socket) => {
  console.log('Клиент отключился:', socket.id);
  clients.delete(socket.id);

  io.emit('server_message', {
    type: 'user_left',
    message: `Пользователь ${socket.id} вышел`,
    clientId: socket.id,
    clientsCount: clients.size
  });

  io.emit('clients_count', clients.size);
};

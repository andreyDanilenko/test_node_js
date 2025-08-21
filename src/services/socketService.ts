import { Server, Socket } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

interface ClientInfo {
  connected: Date;
}

export class SocketService {
  private io: Server | null = null;
  private clients = new Map<string, ClientInfo>();

  async init(io: Server) {
    this.io = io;

    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket: Socket) => this.handleConnection(socket));
  }

  private handleConnection(socket: Socket) {
    console.log('Клиент подключился:', socket.id);
    this.clients.set(socket.id, { connected: new Date() });

    socket.emit('server_message', {
      type: 'welcome',
      message: 'Добро пожаловать на сервер!',
      clientsCount: this.clients.size
    });

    socket.broadcast.emit('server_message', {
      type: 'user_joined',
      message: `Новый пользователь ${socket.id} присоединился`,
      clientId: socket.id,
      clientsCount: this.clients.size
    });

    this.io?.emit('clients_count', this.clients.size);

    socket.on('client_message', (msg) => this.handleClientMessage(socket, msg));
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (err) => console.log('Socket.IO ошибка:', err));
  }

  private handleClientMessage(socket: Socket, msg: any) {
    if (!this.io) return;

    if (typeof msg === 'string') {
      this.io.emit('server_message', {
        type: 'message',
        message: msg,
        clientId: socket.id,
        timestamp: new Date().toLocaleTimeString()
      });

      if (msg.toLowerCase() === 'exit') {
        socket.emit('server_message', { type: 'goodbye', message: 'До свидания!' });
        socket.disconnect();
      }
    } else if (typeof msg === 'object' && msg !== null) {
      this.io.emit('server_message', {
        type: 'object_message',
        data: msg,
        clientId: socket.id,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  private handleDisconnect(socket: Socket) {
    if (!this.io) return;

    console.log('Клиент отключился:', socket.id);
    this.clients.delete(socket.id);

    this.io.emit('server_message', {
      type: 'user_left',
      message: `Пользователь ${socket.id} вышел`,
      clientId: socket.id,
      clientsCount: this.clients.size
    });

    this.io.emit('clients_count', this.clients.size);
  }

  getIO(): Server {
    if (!this.io) throw new Error('Socket.IO не инициализирован!');
    return this.io;
  }
}

export const socketService = new SocketService();

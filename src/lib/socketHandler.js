import { Server } from 'socket.io';
import { handleSocketEvents } from './socketEvents.js';

export function createSocketIOServer(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    handleSocketEvents(io, socket);
  });

  return io;
}
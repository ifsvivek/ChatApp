import { handleMessage, handleImageUpload, handleImageAnalysis, handleGuess } from './chatHandlers.js';

export function handleSocketEvents(io, socket) {
  socket.on('send_message', (data) => handleMessage(io, socket, data));
  socket.on('upload_image', (data) => handleImageUpload(io, socket, data));
  socket.on('analyze_image', (data) => handleImageAnalysis(io, socket, data));
  socket.on('guess', (data) => handleGuess(io, socket, data));

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
}
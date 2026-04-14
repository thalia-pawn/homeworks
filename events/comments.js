import { Server } from 'socket.io';

let io;

function initCommentsSocket(server) {
  io = new Server(server);

  io.on('connection', (socket) => {
    const { bookId } = socket.handshake.query;

    if (bookId) {
      socket.join(bookId);
      console.log(`Client joined room: ${bookId}`);
    }

    socket.on('disconnect', () => {
      console.log(`Client disconnected from room: ${bookId}`);
    });
  });

  return io;
}

function getCommentsIO() {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }

  return io;
}

export { initCommentsSocket, getCommentsIO };
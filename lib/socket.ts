import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectChatSocket = (token: string) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io('http://localhost:5000', {
    transports: ['websocket'],
    auth: { token },
  });

  return socket;
};

export const getChatSocket = () => socket;

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

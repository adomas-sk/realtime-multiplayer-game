import http from 'http';
import { Server, Socket } from 'socket.io';
import { WEBSOCKET_MESSAGES } from 'shared';
import { Games } from './interfaces';
import {
  createGameEventHandler,
  disconnectEventHandler,
  joinGameEventHandler,
  readyEventHandler,
  userInputEventHandler,
} from './handlers';

const games: Games = {};

export const createWSServer = (httpServer: http.Server) => {
  const io = new Server(httpServer);

  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', disconnectEventHandler(socket, games));

    socket.on(WEBSOCKET_MESSAGES.CREATE_GAME, createGameEventHandler(socket, games));
    socket.on(WEBSOCKET_MESSAGES.JOIN_GAME, joinGameEventHandler(socket, games));
    socket.on(WEBSOCKET_MESSAGES.READY, readyEventHandler(socket, games));
    socket.on(WEBSOCKET_MESSAGES.USER_INPUT, userInputEventHandler);
  });
};

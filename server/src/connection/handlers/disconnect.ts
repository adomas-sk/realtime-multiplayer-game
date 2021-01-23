import { Socket } from 'socket.io';
import { Games } from '../interfaces';
import { findGameByPlayerId } from './helpers';

export const disconnectEventHandler = (socket: Socket, games: Games) => () => {
  const game = findGameByPlayerId(games, socket.id);
  if (!game) {
    return;
  }
  game.playerDisconnected;
};

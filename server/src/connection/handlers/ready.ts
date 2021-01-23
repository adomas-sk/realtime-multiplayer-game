import { serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { Games } from '../interfaces';
import { findGameByPlayerId } from './helpers';

export const readyEventHandler = (socket: Socket, games: Games) => () => {
  try {
    const game = findGameByPlayerId(games, socket.id);
    if (!game) {
      throw new Error('Player did not join a game');
    }

    const { allPlayersReady, startTime } = game.playerReady(socket.id);
    console.log(`Player ${socket.id} is ready`);

    if (allPlayersReady) {
      serverEmit.startGame(socket, startTime, game.gameKey);
      console.log(`Game ${game.gameKey} has started`);
    }
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

import { Game, ObjectOf, serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { findGameByPlayerId } from './helpers';

export const readyEventHandler = (socket: Socket, games: ObjectOf<Game>) => () => {
  try {
    const game = findGameByPlayerId(games, socket.id);
    if (!game) {
      throw new Error('Player did not join a game');
    }

    game.setPlayerReady(socket.id);
    console.log(`Player ${socket.id} is ready`);

    const readyTime = game.getStartTimeIfAllPlayersReady();
    if (readyTime) {
      game.startGame(readyTime);
      serverEmit.startGame(socket, readyTime, game.gameKey);
      console.log(`Game ${game.gameKey} has started`);
    }
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

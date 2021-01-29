import { Game, ObjectOf } from 'shared';
import { Socket } from 'socket.io';
import { findGameByPlayerId } from './helpers';

export const disconnectEventHandler = (socket: Socket, games: ObjectOf<Game>) => () => {
  const game = findGameByPlayerId(games, socket.id);
  if (!game) {
    return;
  }
  console.log(`Player ${socket.id} has disconnected from game ${game.gameKey}`);

  game.setPlayerDisconnected(socket.id);
  if (game.areAllPlayersDisconnected()) {
    clearInterval(game.serverClockId);
    delete games[game.gameKey];
  }
};

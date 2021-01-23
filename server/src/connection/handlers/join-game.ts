import { ClientJoinGamePayload, serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { Games } from '../interfaces';

const getGame = (games: Games, gameKey: string) => {
  if (!games[gameKey]) {
    throw new Error('Game not found');
  }
  return games[gameKey];
};

export const joinGameEventHandler = (socket: Socket, games: Games) => (gameKey: ClientJoinGamePayload) => {
  try {
    const game = getGame(games, gameKey);
    if (game.startTime) {
      throw new Error('Game has already started');
    }

    const playerInGame = game.players.find((player) => player.playerId === socket.id);
    if (playerInGame) {
      throw new Error('Player already in game');
    }

    game.playerJoin(socket.id);

    serverEmit.joinGame(socket, { gameKey, playerId: socket.id }, gameKey);
    serverEmit.getGamePlayers(
      socket,
      game.players.map((player) => player.playerId).filter((id) => id !== socket.id),
      socket.id
    );

    console.log(`Game ${gameKey} joined by ${socket.id}`);
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

import { ClientCreateGamePayload, serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { GameState } from '../../game-state';
import { Games } from '../interfaces';

const createGame = (games: Games, gameKey: string) => {
  if (games[gameKey]) {
    throw new Error('Game already exists');
  }
  const newGame = new GameState(gameKey);
  games[gameKey] = newGame;
  return newGame;
};

export const createGameEventHandler = (socket: Socket, games: Games) => (gameKey: ClientCreateGamePayload) => {
  try {
    createGame(games, gameKey);
    socket.join(gameKey);

    serverEmit.createGame(socket, gameKey, gameKey);
    console.log(`Game ${gameKey} created`);
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

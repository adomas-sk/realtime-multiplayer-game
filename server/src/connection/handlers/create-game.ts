import { ClientCreateGamePayload, Game, ObjectOf, serverEmit } from 'shared';
import { Socket } from 'socket.io';

const createGame = (games: ObjectOf<Game>, gameKey: string) => {
  if (games[gameKey]) {
    throw new Error('Game already exists');
  }
  const newGame = new Game(gameKey);
  newGame.addPlatform({ id: '1', left: 0, right: 600, top: 400 - 50, bottom: 500 - 50 });
  games[gameKey] = newGame;
  return newGame;
};

export const createGameEventHandler = (socket: Socket, games: ObjectOf<Game>) => (gameKey: ClientCreateGamePayload) => {
  try {
    const game = createGame(games, gameKey);
    
    game.serverClockId = Number(setInterval(() => {
      game.gameStarted && game.progressGame(1000 / 60);
      // if (game.checkEventOccurance()) {
        serverEmit.gameStateUpdate(socket, game.getGameState(), gameKey);
      // }
    }, 1000 / 60));
    
    socket.join(gameKey);

    serverEmit.createGame(socket, gameKey, gameKey);
    console.log(`Game ${gameKey} created`);
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

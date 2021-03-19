import { ClientJoinGamePayload, serverEmit, Player, ObjectOf, Game } from 'shared';
import { Socket } from 'socket.io';

const getGame = (games: ObjectOf<Game>, gameKey: string) => {
  if (!games[gameKey]) {
    throw new Error('Game not found');
  }
  return games[gameKey];
};

export const joinGameEventHandler = (socket: Socket, games: ObjectOf<Game>) => (gameKey: ClientJoinGamePayload) => {
  try {
    const game = getGame(games, gameKey);
    if (game.gameStarted) {
      throw new Error('Game has already started');
    }

    const playerInGame = game.getPlayer(socket.id, false);
    if (playerInGame) {
      throw new Error('Player already in game');
    }
    socket.join(gameKey);

    const newPlayer: Player = {
      playerId: socket.id,
      playerState: {
        x: 200 + game.getNonRenderedPlayersIds().length * 50,
        y: 200,
        touchingGround: false,
        velocity: [0, 0],
      },
      verticalFromCenter: 16,
      horizontalFromCenter: 16,
    };
    game.addPlayer(newPlayer);

    serverEmit.joinGame(
      socket,
      {
        gameKey,
        player: newPlayer,
      },
      gameKey
    );

    serverEmit.getGamePlayers(
      socket,
      game.getPlayersExcept(socket.id),
      socket.id
    );

    console.log(`Game ${gameKey} joined by ${socket.id}`);
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

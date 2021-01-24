import { ClientJoinGamePayload, serverEmit, Player } from 'shared';
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

    const newPlayer: Player = {
      playerId: socket.id,
      playerState: {
        x: 200 + game.players.length * 50,
        y: 200,
        touchingGround: false,
        velocity: [0, 0],
      },
      verticalFromCenter: 16,
      horizontalFromCenter: 16,
    };
    game.playerJoin(newPlayer);

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
      game.players.map((player) => player.playerData).filter((playerData) => playerData.playerId !== socket.id),
      socket.id
    );

    console.log(`Game ${gameKey} joined by ${socket.id}`);
  } catch (error) {
    serverEmit.error(socket, error.message);
  }
};

import { Game, ObjectOf } from 'shared';

export const findGameByPlayerId = (games: ObjectOf<Game>, playerId: string) => {
  const game = Object.values(games).find((game) => game.getPlayer(playerId));
  if (!game) {
    return null;
  }
  return game;
};

import { Games } from '../interfaces';

export const findGameByPlayerId = (games: Games, playerId: string) => {
  const gameKey = Object.keys(games).find((gameKey) =>
    games[gameKey]?.players.find((player) => player.playerId === playerId)
  );
  if (!gameKey) {
    return null;
  }
  return games[gameKey];
};

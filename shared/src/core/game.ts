import { characterNext } from './character';
import { Game } from './interfaces';

export const runGame = (game: Game, delta: number) => {
  game.characters.forEach((character) => characterNext(character, game.platforms, delta));
  return game;
};

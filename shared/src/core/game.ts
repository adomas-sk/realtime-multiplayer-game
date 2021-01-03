import { CharacterState } from './character';

export interface Game {
  gameToken: string;
  currentTime: number;
  characters: CharacterState[];
}

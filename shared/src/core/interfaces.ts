export interface Platform {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Game {
  characters: CharacterState[];
  platforms: Platform[];
}

export interface CharacterState {
  playerId?: string;
  x: number;
  y: number;
  touchingGround: boolean;
  velocity: number[];
}

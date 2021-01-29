export interface Platform {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

// Data that does not change
export interface Player {
  playerId: string;
  verticalFromCenter: number;
  horizontalFromCenter: number;
  rendered?: boolean;
  ready?: boolean;
  disconnected?: boolean;
  playerState: PlayerState;
}

// Data that changes based on what happens
export interface PlayerState {
  x: number;
  y: number;
  touchingGround: boolean;
  velocity: number[];
}

export interface EventState {
  left: boolean;
  right: boolean;
}

export type ObjectOf<T> = { [key: string]: T };

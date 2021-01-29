import { Game } from 'shared';

const state = {
  game: new Game(),
  playerId: '',
};

export const getGame = () => state.game;
export const getCurrentPlayerId = () => state.playerId;

export const setCurrentPlayerId = (playerId: string) => (state.playerId = playerId);

import type { Player } from 'shared';

interface ConnectionState {
  gameJoined?: string;
  gameStarted?: boolean;
  gameStartedAt?: number;
  self?: Player;
  playersJoined: { [key: string]: Player };
}

const state: ConnectionState = {
  playersJoined: {},
};

const events: any[] = [];

export const getState = () => state;
export const getGameJoined = () => getState().gameJoined;
export const getGameStarted = () => getState().gameStarted;
export const getGameStartedAt = () => getState().gameStartedAt;
export const getSelf = () => getState().self;
export const getPlayers = () => getState().playersJoined;
export const getPlayerById = (playerId: string) => getPlayers() && getPlayers()[playerId];

const createEvent = (event: string) => (mutateState: (...args: any[]) => void) => {
  return (...args: any[]) => {
    events.push(event);
    console.log(`Event: ${event}`, args);
    return mutateState(...args);
  };
};

export const setJoinedGame = createEvent('JOINED GAME')((gameKey: string) => {
  state.gameJoined = gameKey;
});

export const setGameStarted = createEvent('GAME STARTED')((gameStartedAt: number) => {
  state.gameStarted = true;
  state.gameStartedAt = gameStartedAt;
});

export const addPlayer = createEvent('PLAYER JOINED')((player: Player) => {
  if (state.playersJoined[player.playerId]) {
    throw new Error('Player already joined');
  }
  state.playersJoined[player.playerId] = player;
});

export const addSelf = createEvent('ADD SELF')((player: Player) => {
  if (state.self) {
    throw new Error('Self already joined');
  }
  state.self = player;
});

export const setPlayer = createEvent('SET PLAYER')((player: Player) => {
  state.playersJoined[player.playerId] = player;
});
export const setSelf = createEvent('SET SELF')((player: Player) => {
  state.self = player;
});

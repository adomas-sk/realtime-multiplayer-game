import { USER_INPUT, EventState, Player } from 'shared';
import { ClientEvents, getSelf } from '../connection';

const initialEventState: EventState = { left: false, right: false };

const eventState: { [key: string]: EventState } = {};

export const getEventState = () => eventState;
export const addPlayerEventState = (playerId: string) => {
  eventState[playerId] = initialEventState;
};

export const leftKeyDown = (clientEvents: ClientEvents, playerId?: string) => () => {
  const fromPlayerId = playerId || (getSelf() as Player).playerId;
  eventState[fromPlayerId].left = true;
  clientEvents.userInput(USER_INPUT.LEFT_DOWN);
};

export const leftKeyUp = (clientEvents: ClientEvents, playerId?: string) => () => {
  const fromPlayerId = playerId || (getSelf() as Player).playerId;
  eventState[fromPlayerId].left = false;
  clientEvents.userInput(USER_INPUT.LEFT_UP);
};

export const rightKeyUp = (clientEvents: ClientEvents, playerId?: string) => () => {
  const fromPlayerId = playerId || (getSelf() as Player).playerId;
  eventState[fromPlayerId].right = false;
  clientEvents.userInput(USER_INPUT.RIGHT_UP);
};

export const rightKeyDown = (clientEvents: ClientEvents, playerId?: string) => () => {
  const fromPlayerId = playerId || (getSelf() as Player).playerId;
  eventState[fromPlayerId].right = true;
  clientEvents.userInput(USER_INPUT.RIGHT_DOWN);
};

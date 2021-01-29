import { USER_INPUT } from 'shared';
import type { ClientEvents } from '../connection';
import { getCurrentPlayerId, getGame } from '../state';

export const leftKeyDown = (clientEvents: ClientEvents) => () => {
  getGame().processPlayerEvent(getCurrentPlayerId(), USER_INPUT.LEFT_DOWN);
  clientEvents.userInput(USER_INPUT.LEFT_DOWN);
};

export const leftKeyUp = (clientEvents: ClientEvents) => () => {
  getGame().processPlayerEvent(getCurrentPlayerId(), USER_INPUT.LEFT_UP);
  clientEvents.userInput(USER_INPUT.LEFT_UP);
};

export const rightKeyUp = (clientEvents: ClientEvents) => () => {
  getGame().processPlayerEvent(getCurrentPlayerId(), USER_INPUT.RIGHT_UP);
  clientEvents.userInput(USER_INPUT.RIGHT_UP);
};

export const rightKeyDown = (clientEvents: ClientEvents) => () => {
  getGame().processPlayerEvent(getCurrentPlayerId(), USER_INPUT.RIGHT_DOWN);
  clientEvents.userInput(USER_INPUT.RIGHT_DOWN);
};

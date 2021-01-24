import type { Socket } from 'socket.io-client';
import {
  ServerCreateGamePayload,
  ServerGetGamePlayersPayload,
  ServerJoinGamePayload,
  ServerStartGamePayload,
  ServerUserInputPayload,
  WEBSOCKET_MESSAGES,
  USER_INPUT,
} from 'shared';

import type { ClientEvents } from './events.connections';
import { addPlayer, addSelf, setGameStarted, setJoinedGame, getSelf, getGameJoined } from './state.connection';
import { updateGameKey } from '../button/button';
import { addPlayerEventState, leftKeyDown, leftKeyUp, rightKeyDown, rightKeyUp } from '../input';

export const createHandlers = (socket: Socket, clientEvents: ClientEvents) => {
  socket.on(WEBSOCKET_MESSAGES.CREATE_GAME, (data: ServerCreateGamePayload) => {
    clientEvents.joinGame(data);
  });
  socket.on(WEBSOCKET_MESSAGES.JOIN_GAME, (data: ServerJoinGamePayload) => {
    if (!getGameJoined()) {
      setJoinedGame(data.gameKey);
    }
    if (!getSelf()) {
      addPlayerEventState(data.player.playerId);
      addSelf(data.player);
      return;
    }
    addPlayerEventState(data.player.playerId);
    addPlayer(data.player);
  });
  socket.on(WEBSOCKET_MESSAGES.START_GAME, (data: ServerStartGamePayload) => {
    setGameStarted(data);
  });
  socket.on(WEBSOCKET_MESSAGES.GET_GAME_PLAYERS, (data: ServerGetGamePlayersPayload) => {
    data.forEach((player) => addPlayer(player));
  });
  socket.on(WEBSOCKET_MESSAGES.USER_INPUT, (data: ServerUserInputPayload) => {
    switch (data.event) {
      case USER_INPUT.RIGHT_DOWN:
        return rightKeyDown(clientEvents, data.playerId);
      case USER_INPUT.RIGHT_UP:
        return rightKeyUp(clientEvents, data.playerId);
      case USER_INPUT.LEFT_DOWN:
        return leftKeyDown(clientEvents, data.playerId);
      case USER_INPUT.LEFT_UP:
        return leftKeyUp(clientEvents, data.playerId);
      default:
        throw new Error('Unknown Event');
    }
  });
  socket.on(WEBSOCKET_MESSAGES.ERROR, (data: string) => {
    if (data === 'Game has already started') {
      updateGameKey();
    }
    console.error(data);
  });
};

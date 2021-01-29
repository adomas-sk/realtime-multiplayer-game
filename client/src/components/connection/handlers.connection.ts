import type { Socket } from 'socket.io-client';
import {
  ServerCreateGamePayload,
  ServerGetGamePlayersPayload,
  ServerJoinGamePayload,
  ServerStartGamePayload,
  ServerUserInputPayload,
  ServerGameStateUpdatePayload,
  WEBSOCKET_MESSAGES,
} from 'shared';

import type { ClientEvents } from './events.connections';
import { updateGameKey } from '../button/button';
import { getCurrentPlayerId, getGame, setCurrentPlayerId } from '../state';

export const createHandlers = (socket: Socket, clientEvents: ClientEvents) => {
  socket.on(WEBSOCKET_MESSAGES.CREATE_GAME, (data: ServerCreateGamePayload) => {
    clientEvents.joinGame(data);
  });
  socket.on(WEBSOCKET_MESSAGES.JOIN_GAME, (data: ServerJoinGamePayload) => {
    if (!getGame().gameKey) {
      getGame().addGameKey(data.gameKey);
    }
    if (!getCurrentPlayerId()) {
      setCurrentPlayerId(data.player.playerId);
    }
    getGame().addPlayer(data.player);
  });
  socket.on(WEBSOCKET_MESSAGES.START_GAME, (data: ServerStartGamePayload) => {
    getGame().startGame(data);
  });
  socket.on(WEBSOCKET_MESSAGES.GET_GAME_PLAYERS, (data: ServerGetGamePlayersPayload) => {
    data.forEach((player) => getGame().addPlayer(player));
  });
  socket.on(WEBSOCKET_MESSAGES.USER_INPUT, ({ playerId, event }: ServerUserInputPayload) => {
    if (playerId === getCurrentPlayerId()) {
      return;
    }
    getGame().processPlayerEvent(playerId, event);
  });
  socket.on(WEBSOCKET_MESSAGES.GAME_STATE_UPDATE, ({ players }: ServerGameStateUpdatePayload) => {
    getGame().updatePlayers(players);
  });
  socket.on(WEBSOCKET_MESSAGES.ERROR, (data: string) => {
    if (data === 'Game has already started') {
      updateGameKey();
    }
    console.error(data);
  });
};

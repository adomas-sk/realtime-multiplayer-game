import { Player } from '../core';

export enum WEBSOCKET_MESSAGES {
  CREATE_GAME = 'CREATE_GAME',
  JOIN_GAME = 'JOIN_GAME',
  READY = 'READY',
  START_GAME = 'START_GAME',
  GET_GAME_PLAYERS = 'GET_GAME_PLAYERS',
  ERROR = 'ERROR',
}

export type ServerCreateGamePayload = string;
export type ServerJoinGamePayload = { gameKey: string; player: Player };
export type ServerStartGamePayload = number;
export type ServerGetGamePlayersPayload = Player[];

export type ClientCreateGamePayload = string;
export type ClientJoinGamePayload = string;
export type ClientReadyPayload = void;

const send = (socket: any, event: string, data: any, room?: any) => {
  if (room) {
    socket.to(room).emit(event, data);
  }
  socket.emit(event, data);
};

const emitServerCreateGame = (socket: any, data: ServerCreateGamePayload, room: string) =>
  send(socket, WEBSOCKET_MESSAGES.CREATE_GAME, data, room);
const emitServerJoinGame = (socket: any, data: ServerJoinGamePayload, room: string) =>
  send(socket, WEBSOCKET_MESSAGES.JOIN_GAME, data, room);
const emitServerStartGame = (socket: any, data: ServerStartGamePayload, room: string) =>
  send(socket, WEBSOCKET_MESSAGES.START_GAME, data, room);
const emitServerGetGamePlayers = (socket: any, data: ServerGetGamePlayersPayload, room: string) =>
  send(socket, WEBSOCKET_MESSAGES.GET_GAME_PLAYERS, data, room);
const emitServerError = (socket: any, data: string) => {
  console.error(data);
  send(socket, WEBSOCKET_MESSAGES.ERROR, data);
};

const emitClientCreateGame = (socket: any, data: ClientCreateGamePayload) =>
  send(socket, WEBSOCKET_MESSAGES.CREATE_GAME, data);
const emitClientJoinGame = (socket: any, data: ClientJoinGamePayload) =>
  send(socket, WEBSOCKET_MESSAGES.JOIN_GAME, data);
const emitClientReady = (socket: any, data: ClientReadyPayload) => send(socket, WEBSOCKET_MESSAGES.READY, data);

export const serverEmit = {
  createGame: emitServerCreateGame,
  joinGame: emitServerJoinGame,
  startGame: emitServerStartGame,
  getGamePlayers: emitServerGetGamePlayers,
  error: emitServerError,
};

export const clientEmit = {
  createGame: emitClientCreateGame,
  joinGame: emitClientJoinGame,
  ready: emitClientReady,
};

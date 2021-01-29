import { clientEmit, USER_INPUT } from 'shared';
import type { Socket } from 'socket.io-client';

export interface ClientEvents {
  createGame: (gameKey: string) => void;
  joinGame: (gameKey: string) => void;
  ready: () => void;
  userInput: (input: USER_INPUT) => void;
}

const createGameEvent = (socket: Socket): ClientEvents['createGame'] => (gameKey) =>
  clientEmit.createGame(socket, gameKey);
const joinGameEvent = (socket: Socket): ClientEvents['joinGame'] => (gameKey) => clientEmit.joinGame(socket, gameKey);
const readyGameEvent = (socket: Socket): ClientEvents['ready'] => () => clientEmit.ready(socket);
const userInputEvent = (socket: Socket): ClientEvents['userInput'] => (input) =>
  clientEmit.userInput(socket, { event: input, timestamp: Date.now() });

export const createClientEvents = (socket: Socket) => {
  return {
    createGame: createGameEvent(socket),
    joinGame: joinGameEvent(socket),
    ready: readyGameEvent(socket),
    userInput: userInputEvent(socket),
  };
};

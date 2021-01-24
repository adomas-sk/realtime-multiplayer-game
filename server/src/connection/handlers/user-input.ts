import { ClientUserInputPayload, serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { Games } from '../interfaces';
import { findGameByPlayerId } from './helpers';

export const userInputEventHandler = (socket: Socket, games: Games) => (data: ClientUserInputPayload) => {
  const game = findGameByPlayerId(games, socket.id);
  if (!game) {
    return;
  }

  serverEmit.userInput(socket, { playerId: socket.id, event: data }, game.gameKey);
};

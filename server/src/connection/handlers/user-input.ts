import { ClientUserInputPayload, Game, ObjectOf, serverEmit } from 'shared';
import { Socket } from 'socket.io';
import { findGameByPlayerId } from './helpers';

export const userInputEventHandler = (socket: Socket, games: ObjectOf<Game>) => (data: ClientUserInputPayload) => {
  const game = findGameByPlayerId(games, socket.id);
  if (!game) {
    return;
  }
  game.processPlayerEvent(socket.id, data.event, data.timestamp);

  serverEmit.userInput(socket, { playerId: socket.id, ...data }, game.gameKey);
};;;

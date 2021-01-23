import { io } from 'socket.io-client';

import { ClientEvents, createClientEvents } from './events.connections';
import { createHandlers } from './handlers.connection';

export const createWSClient = (): ClientEvents => {
  const socket = io({
    transports: ['websocket'],
  });
  const clientEvents = createClientEvents(socket);

  createHandlers(socket, clientEvents);

  return clientEvents;
};

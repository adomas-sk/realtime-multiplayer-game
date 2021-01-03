import { io } from 'socket.io-client';
import { Game, WEBSOCKET_MESSAGES } from 'shared';

let initialState: Game;

export const createWSClient = () => {
  console.log('Connecting to websocket');
  const socket = io({
    transports: ['websocket'],
  });

  socket.on(WEBSOCKET_MESSAGES.USER_INPUT, (socket: any) => {
    console.log(`Message is: ${socket}`);
  });

  socket.on(WEBSOCKET_MESSAGES.INSTANCE_SYNC, (socket: Game) => {
    console.log(socket);
    initialState = socket;
  });
};

export const getInitialState = (): Promise<Game> => new Promise((resolve) => getState(resolve));
export const getGameTimeStamp = (): number | null => initialState?.currentTime || null;

const getState = (resolve: (returnValue: any) => void) => {
  if (initialState) {
    resolve(initialState);
  }
  setTimeout(() => getState(resolve), 250);
};

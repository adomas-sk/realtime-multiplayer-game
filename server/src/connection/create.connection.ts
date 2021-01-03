import http from 'http';
import { Server, Socket } from 'socket.io';
import { WEBSOCKET_MESSAGES } from 'shared';
import ServerGame from './game.connection';

const PLAYERS_NEEDED = 2;
const games: { [key: string]: ServerGame } = {};
const playerQueue: string[] = [];

const createGame = (socket: Socket, io: Server) => {
  const gameToken = '123';

  const players = playerQueue.slice(0, PLAYERS_NEEDED);
  playerQueue.splice(0, PLAYERS_NEEDED);

  const newGame = ServerGame.getNewGame(gameToken, players, Date.now());
  games[socket.id] = newGame;
  players.forEach((playerId) => io.to(playerId).emit(WEBSOCKET_MESSAGES.INSTANCE_SYNC, newGame));
  setInterval(() => {
    newGame.run(Date.now() - newGame.getLastTick());
  }, 1000 / 60);
};

export const createWSServer = (httpServer: http.Server) => {
  const io = new Server(httpServer);

  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {
      const index = playerQueue.findIndex((playerId) => playerId === socket.id);
      if (index !== -1) {
        console.log(playerQueue, index);
        playerQueue.splice(index, 1);
      }
    });

    console.log(`Connected ${socket.id}`);
    playerQueue.push(socket.id);

    if (playerQueue.length >= PLAYERS_NEEDED) {
      createGame(socket, io);
    }

    socket.emit(WEBSOCKET_MESSAGES.USER_INPUT, ':)');
  });
};

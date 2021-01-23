import { characterNext, Game } from 'shared';

interface GamePlayer {
  playerId: string;
  ready?: boolean;
  disconnected: boolean;
}

class GameState {
  public gameKey: string;
  public players: GamePlayer[] = [];
  public startTime?: number;

  private lastTick?: number;

  constructor(gameKey: string) {
    this.gameKey = gameKey;
  }

  public playerJoin = (playerId: string) => {
    this.players.push({ playerId, disconnected: false });
  };

  public playerReady = (playerId: string) => {
    const player = this.players.find((player) => player.playerId === playerId);
    if (!player) {
      throw new Error('Ready player not found | This should not happen!');
    }
    if (player.ready) {
      throw new Error('Player already ready');
    }
    player.ready = true;
    this.startTime = Date.now();
    this.lastTick = this.startTime;

    return { allPlayersReady: this.players.every((player) => player.ready), startTime: this.startTime };
  };

  public playerDisconnected = (playerId: string) => {
    const player = this.players.find((player) => player.playerId === playerId);
    if (!player) {
      throw new Error('Disconnected player not found | This should not happen!');
    }
    player.disconnected = true;
  };

  // static createGame = (gameKey: string) => {
  //   return new ServerGame(gameKey);
  // }

  // static getNewGame = (gameToken: string, players: string[], startTime: number): ServerGame => {
  //   const initialGameState = {
  //     gameToken,
  //     currentTime: startTime,
  //     characters: players.map((playerId, index) => ({
  //       playerId,
  //       x: 20 + index * 500,
  //       y: 40,
  //       velocity: [0, 0],
  //       touchingGround: false,
  //     })),
  //   };
  //   const serverGame = new ServerGame(initialGameState);

  //   return serverGame;
  // };

  // public run = (delta: number) => {
  //   const newCharacters = this.gameState.characters.map((player) => characterNext(player, delta));
  //   this.gameState.characters = newCharacters;
  //   this.lastTick = Date.now();
  // };

  // public getLastTick = () => this.lastTick;

  // public getCurrentState = () => this.gameState;
}

export default GameState;

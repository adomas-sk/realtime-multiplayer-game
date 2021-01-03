import { characterNext, Game } from 'shared';

class ServerGame {
  private gameState: Game;
  private lastTick: number;

  constructor(initialGameState: Game) {
    this.gameState = initialGameState;
    this.lastTick = initialGameState.currentTime;
  }

  static getNewGame = (gameToken: string, players: string[], startTime: number): ServerGame => {
    const initialGameState = {
      gameToken,
      currentTime: startTime,
      characters: players.map((playerId, index) => ({
        playerId,
        x: 20 + index * 500,
        y: 40,
        velocity: [0, 0],
        touchingGround: false,
      })),
    };
    const serverGame = new ServerGame(initialGameState);

    return serverGame;
  };

  public run = (delta: number) => {
    const newCharacters = this.gameState.characters.map((player) => characterNext(player, delta));
    this.gameState.characters = newCharacters;
    this.lastTick = Date.now();
  };

  public getLastTick = () => this.lastTick;

  public getCurrentState = () => this.gameState;
}

export default ServerGame;

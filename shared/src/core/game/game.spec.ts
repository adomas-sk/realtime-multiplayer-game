import { USER_INPUT } from '../../connection';
import { Game } from './game';

describe('Game', () => {
  const createGame = () => {
    const game = new Game();
    game.addPlayer({
      playerId: '123',
      verticalFromCenter: 16,
      horizontalFromCenter: 16,
      rendered: true,
      ready: true,
      disconnected: false,
      playerState: {
        x: 5,
        y: 5,
        touchingGround: false,
        velocity: [0, 0],
      },
    });
    return game;
  };

  describe('same output when deltas are different but sum up to same amount', () => {
    it('should give same output from falling', () => {
      const gameOne = createGame();
      const gameTwo = createGame();

      gameOne.progressGameDeltaOverride(1500);
      gameOne.progressGameDeltaOverride(1500);

      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);

      expect(gameOne.getPlayer('123')).toEqual(gameTwo.getPlayer('123'));
    });

    it('should give same output from falling and walking event', () => {
      const gameOne = createGame();
      const gameTwo = createGame();

      gameOne.progressGameDeltaOverride(1500);
      gameOne.processPlayerEvent('123', USER_INPUT.RIGHT_DOWN);
      gameOne.progressGameDeltaOverride(1500);

      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.processPlayerEvent('123', USER_INPUT.RIGHT_DOWN);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);

      expect(gameOne.getPlayer('123')).toEqual(gameTwo.getPlayer('123'));
    });

    it('should give same output from falling and walking event if it was fired in the past', () => {
      const gameOne = createGame();
      const gameTwo = createGame();

      gameOne.progressGameDeltaOverride(500);
      gameOne.progressGameDeltaOverride(500);
      gameOne.progressGameDeltaOverride(500);
      gameOne.processPlayerEvent('123', USER_INPUT.RIGHT_DOWN, 500);
      gameOne.progressGameDeltaOverride(1000);

      gameTwo.progressGameDeltaOverride(500);
      gameTwo.progressGameDeltaOverride(500);
      gameTwo.processPlayerEvent('123', USER_INPUT.RIGHT_DOWN);
      gameTwo.progressGameDeltaOverride(1500);

      expect(gameOne.getPlayer('123')).toEqual(gameTwo.getPlayer('123'));
    });
  });
});

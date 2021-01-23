import { BODY_ANIMATION } from '../../loaders/body.loader';
import type { ClientEvents } from '../connection';

// TODO: remove
const gameKey = '123';

class Button extends Phaser.GameObjects.Sprite {
  private hasPurpose = false;

  public makeItCreateGame = (createGame: ClientEvents['createGame']) => {
    this.initButton();
    this.on(Phaser.Input.Events.POINTER_DOWN, (event: Phaser.Types.Input.EventData) => {
      createGame(gameKey);
    });
    return this;
  };

  public makeItJoinGame = (joinGame: ClientEvents['joinGame']) => {
    this.on(Phaser.Input.Events.POINTER_DOWN, (event: Phaser.Types.Input.EventData) => {
      joinGame(gameKey);
    });
    this.initButton();
    return this;
  };

  public makeItReady = (ready: ClientEvents['ready']) => {
    this.on(Phaser.Input.Events.POINTER_DOWN, (event: Phaser.Types.Input.EventData) => {
      ready();
    });
    this.initButton();
    return this;
  };

  private initButton = () => {
    if (this.hasPurpose) {
      throw new Error('Button already has purpose');
    }
    this.setInteractive();
    this.scene.add.existing(this);
    this.anims.play(BODY_ANIMATION);
    this.hasPurpose = true;
  };
}

export default Button;

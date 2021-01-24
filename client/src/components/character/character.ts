import Phaser from 'phaser';
import type { Player } from 'shared';
import { BODY_ANIMATION, BODY_SPRITE } from '../../loaders/body.loader';

class Character extends Phaser.GameObjects.GameObject {
  public playerId: string;
  public playerData: Player;

  private bodySprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, playerData: Player) {
    super(scene, 'character-sprite');
    this.playerId = playerData.playerId;
    this.playerData = playerData;
    this.addToScene();
  }

  private addToScene = () => {
    const texture = this.scene.textures.get(BODY_SPRITE);
    this.bodySprite = new Phaser.GameObjects.Sprite(
      this.scene,
      this.playerData.playerState.x,
      this.playerData.playerState.y,
      texture
    );

    this.scene.add.existing(this.bodySprite);
    this.bodySprite.anims.play(BODY_ANIMATION);
  };

  public update = (nextState: Player | undefined) => {
    if (!nextState) {
      throw new Error(`Did not receive nextState ${this.playerId}`);
    }
    this.bodySprite.x = nextState.playerState.x;
    this.bodySprite.y = nextState.playerState.y;
    this.playerData = nextState;
  };
}

export default Character;

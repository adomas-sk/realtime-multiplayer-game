import Phaser from 'phaser';
import type { CharacterState } from 'shared';
import { BODY_ANIMATION, BODY_SPRITE } from '../../loaders/body.loader';

class Character extends Phaser.GameObjects.GameObject {
  public playerId: string;
  public characterState: CharacterState;

  private bodySprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number[], playerId = 'player') {
    super(scene, 'character-object');
    this.playerId = playerId;
    this.characterState = {
      x,
      y,
      playerId,
      touchingGround: false,
      velocity: velocity,
    };
    this.addToScene();
  }

  private addToScene = () => {
    const texture = this.scene.textures.get(BODY_SPRITE);
    this.bodySprite = new Phaser.GameObjects.Sprite(this.scene, this.characterState.x, this.characterState.y, texture);

    this.scene.add.existing(this.bodySprite);
    this.bodySprite.anims.play(BODY_ANIMATION);
  };

  public update = (nextState: CharacterState | undefined) => {
    if (!nextState) {
      throw new Error(`Did not receive nextState ${this.playerId}`);
    }
    this.bodySprite.x = Number(nextState.x);
    this.bodySprite.y = Number(nextState.y);
    this.characterState = nextState;
  };
}

export default Character;

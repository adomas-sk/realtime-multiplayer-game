import Phaser from 'phaser';
import { BODY_ANIMATION, BODY_SPRITE } from '../../loaders/body.loader';
import { getGame } from '../state';

class Character extends Phaser.GameObjects.GameObject {
  public playerId: string;

  private bodySprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, playerId: string) {
    super(scene, 'character-sprite');
    this.playerId = playerId;
    this.addToScene();
  }

  private addToScene = () => {
    const playerData = getGame().getPlayer(this.playerId);
    const texture = this.scene.textures.get(BODY_SPRITE);
    this.bodySprite = new Phaser.GameObjects.Sprite(
      this.scene,
      playerData.playerState.x,
      playerData.playerState.y,
      texture
    );

    this.scene.add.existing(this.bodySprite);
    this.bodySprite.anims.play(BODY_ANIMATION);
    getGame().setPlayerAsRendered(this.playerId);
  };

  public update = () => {
    const playerData = getGame().getPlayer(this.playerId);
    this.bodySprite.x = playerData.playerState.x;
    this.bodySprite.y = playerData.playerState.y;
  };
}

export default Character;

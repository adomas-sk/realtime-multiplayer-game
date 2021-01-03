import Phaser from 'phaser';
// import { characterNext } from 'shared';
import { BODY_ANIMATION, BODY_SPRITE } from '../../loaders/body.loader';

export interface CharacterState {
  playerId?: string;
  x: number;
  y: number;
  touchingGround: boolean;
  velocity: number[];
}

const GRAVITY = 0.000001;
const MAX_VELOCITY = 1;

const getNewVelocity = (characterState: CharacterState, delta: number) => {
  if (!characterState.touchingGround) {
    // const nextPosition = Math.pow(Math.sqrt(2) * Math.sqrt(characterState.x) + delta * Math.sqrt(GRAVITY), 2) / 2;
    const newVelY = characterState.velocity[1] + GRAVITY * delta;
    return [characterState.velocity[0], newVelY >= MAX_VELOCITY ? MAX_VELOCITY : newVelY];
  }
  return [characterState.velocity[0], 0];
};

export const characterNext = (characterState: CharacterState, delta: number): CharacterState => {
  const [newVelx, newVely] = getNewVelocity(characterState, delta);

  return {
    ...characterState,
    x: characterState.x + newVelx,
    y: characterState.y + newVely,
    velocity: [newVelx, newVely],
  };
};

class Character extends Phaser.GameObjects.GameObject {
  private x: number;
  private y: number;
  private velocity: Phaser.Math.Vector2;

  private bodySprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number[]) {
    super(scene, 'character-object');
    this.x = x;
    this.y = y;
    this.velocity = new Phaser.Math.Vector2(velocity[0], velocity[1]);
    this.addToScene();
  }

  private addToScene = () => {
    const texture = this.scene.textures.get(BODY_SPRITE);
    this.bodySprite = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, texture);

    this.scene.add.existing(this.bodySprite);
    this.bodySprite.anims.play(BODY_ANIMATION);
  };

  public run = (delta: number) => {
    const nextState = characterNext(
      {
        x: this.x,
        y: this.y,
        touchingGround: false,
        velocity: [this.velocity.x, this.velocity.y],
      },
      delta
    );
    this.x = this.bodySprite.x = nextState.x;
    this.y = this.bodySprite.y = nextState.y;
    this.velocity.x = nextState.velocity[0];
    this.velocity.y = nextState.velocity[1];
  };

  // public static initFocuxedHex = (scene: Phaser.Scene, x: number, y: number) => {
  //   const texture = scene.textures.get(HEX_TYPE[EMPTY_HEX].spirte);
  //   const focusedHex = new FocusedHex(scene, x, y, texture, 0);

  //   focusedHex.scale = HEX_DIMENSIONS.scale;
  //   scene.add.existing(focusedHex);

  //   return focusedHex;
  // };

  // public pointerDownHandler = (event: Phaser.Input.Pointer) => {
  //   const { x, y } = this.calcHexPosition(event);

  //   let spriteFound = false;
  //   InitialScene.hexesRendered.forEach((hex) => {
  //     if (hex.x === x && hex.y === y) {
  //       hex.destroy();
  //       Hex.createHex(this.scene, x, y, RED_HEX);
  //       spriteFound = true;
  //     }
  //   });
  //   if (!spriteFound) {
  //     Hex.createHex(this.scene, x, y, BLUE_HEX);
  //   }
  // };

  // public mouseMoveHandler = (event: Phaser.Input.Pointer) => {
  //   const { x, y } = this.calcHexPosition(event);

  //   this.setPosition(x, y);
  // };

  // private calcHexPosition = (event: Phaser.Input.Pointer) => {
  //   const { x, y } = event.position;

  //   const hexWidth = HEX_DIMENSIONS.width * HEX_DIMENSIONS.scale;
  //   const hexHeight =
  //     HEX_DIMENSIONS.height * HEX_DIMENSIONS.scale - HEX_DIMENSIONS.verticalEdgeHeight * HEX_DIMENSIONS.scale;

  //   const row = Math.round(y / hexHeight);
  //   const column = Math.round((row % 2 === 0 ? x : x - hexWidth / 2) / hexWidth);

  //   const xToRender = column * hexWidth + (row % 2 === 0 ? 0 : hexWidth / 2);
  //   const yToRender = row * hexHeight;

  //   return { x: xToRender, y: yToRender };
  // };
}

export default Character;

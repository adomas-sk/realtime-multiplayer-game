export const BODY_SPRITE = 'body-sprite';
export const BODY_ANIMATION = 'body-animation';

export const loadBodySprite = (load: Phaser.Loader.LoaderPlugin) => {
  load.spritesheet(BODY_SPRITE, 'assets/sprite-sheets/body.png', {
    frameWidth: 32,
    frameHeight: 32,
    startFrame: 0,
    endFrame: 1,
  });
};

export const loadBodyAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: BODY_ANIMATION,
    frames: [
      { key: BODY_SPRITE, frame: 1 },
      { key: BODY_SPRITE, frame: 2 },
    ],
    frameRate: 8,
    repeat: -1,
  });
};

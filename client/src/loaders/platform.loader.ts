export const PLATFORM_SPRITE = 'platform-sprite';
export const PLATFORM_ANIMATION = 'platform-animation';

export const loadPlatformSprite = (load: Phaser.Loader.LoaderPlugin) => {
  load.spritesheet(PLATFORM_SPRITE, 'assets/sprite-sheets/platform.png', {
    frameWidth: 3000,
    frameHeight: 100,
    startFrame: 0,
    endFrame: 1,
  });
};

export const loadPlatformAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: PLATFORM_ANIMATION,
    frames: [
      { key: PLATFORM_SPRITE, frame: 0 },
      { key: PLATFORM_SPRITE, frame: 1 },
    ],
    frameRate: 8,
    repeat: -1,
  });
};

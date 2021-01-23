import { CharacterState, Platform } from './interfaces';

const GRAVITY = 0.003;

const updateVelocity = (characterState: CharacterState, delta: number) => {
  if (!characterState.touchingGround) {
    characterState.velocity[1] += GRAVITY * delta;
    return;
  }
  characterState.velocity[1] = 0;
};

const checkForCollision = (character: CharacterState, platform: Platform) => {
  console.log(
    character.x > platform.left &&
      character.x < platform.right &&
      character.y > platform.top &&
      character.y < platform.bottom
  );
  if (
    character.x > platform.left &&
    character.x < platform.right &&
    character.y > platform.top &&
    character.y < platform.bottom
  ) {
    character.touchingGround = true;
    character.y = platform.top;
    character.velocity[1] = 0;
  } else {
    character.touchingGround = false;
  }
};

export const characterNext = (characterState: CharacterState, platforms: Platform[], delta: number): void => {
  updateVelocity(characterState, delta);

  platforms.forEach((platform) => checkForCollision(characterState, platform));

  characterState.y += characterState.velocity[1];
  characterState.x += characterState.velocity[0];

  // characterState.x += newVelx * delta;
  // characterState.y += newVely * delta;
  // characterState.velocity = [newVelx, newVely];
  // return {
  //   ...characterState,
  //   x: characterState.x + newVelx * delta,
  //   y: characterState.y + newVely * delta,
  //   velocity: [newVelx, newVely],
  // };
};

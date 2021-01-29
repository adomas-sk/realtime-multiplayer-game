import { Player, Platform, PlayerState, EventState } from './interfaces';

const GRAVITY = 0.003;
const ACCELLERATION = 0.3;
const MAX_SPEED = 5;
const FRICTION = 0.6;

const updateVelocity = (player: Player, eventState: EventState, delta: number) => {
  if (!player.playerState.touchingGround) {
    player.playerState.velocity[1] += GRAVITY * delta;
  } else {
    player.playerState.velocity[1] = 0;
  }

  if (eventState.left) {
    player.playerState.velocity[0] -= ACCELLERATION;
    if (player.playerState.velocity[0] <= -MAX_SPEED) {
      player.playerState.velocity[0] = -MAX_SPEED;
    }
  }
  if (eventState.right) {
    player.playerState.velocity[0] += ACCELLERATION;
    if (player.playerState.velocity[0] >= MAX_SPEED) {
      player.playerState.velocity[0] = MAX_SPEED;
    }
  }
  if (
    ((!eventState.left && !eventState.right) || (eventState.left && eventState.right)) &&
    player.playerState.velocity[0] !== 0
  ) {
    if (player.playerState.velocity[0] > 0) {
      player.playerState.velocity[0] -= FRICTION;
      if (player.playerState.velocity[0] < 0) {
        player.playerState.velocity[0] = 0;
      }
    } else if (player.playerState.velocity[0] < 0) {
      player.playerState.velocity[0] += FRICTION;
      if (player.playerState.velocity[0] > 0) {
        player.playerState.velocity[0] = 0;
      }
    }
  }
};

const checkForCollision = (playerState: Player, platform: Platform) => {
  if (
    playerState.playerState.x - playerState.horizontalFromCenter >= platform.left &&
    playerState.playerState.x + playerState.horizontalFromCenter <= platform.right &&
    playerState.playerState.y + playerState.verticalFromCenter >= platform.top &&
    playerState.playerState.y - playerState.verticalFromCenter <= platform.bottom
  ) {
    playerState.playerState.touchingGround = true;
    playerState.playerState.y = platform.top - 16;
    playerState.playerState.velocity[1] = 0;
  } else {
    playerState.playerState.touchingGround = false;
  }
};

const checkIfFellOffTheWorld = (playerState: PlayerState) => {
  if (playerState.y > 1000) {
    playerState.x = 200;
    playerState.y = 200;
  }
};

export const characterNext = (player: Player, eventState: EventState, platforms: Platform[], delta: number): void => {
  updateVelocity(player, eventState, delta);

  platforms.forEach((platform) => checkForCollision(player, platform));

  player.playerState.y += player.playerState.velocity[1];
  player.playerState.x += player.playerState.velocity[0];

  checkIfFellOffTheWorld(player.playerState);
};

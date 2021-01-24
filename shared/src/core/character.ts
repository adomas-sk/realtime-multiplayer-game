import { Player, Platform, PlayerState } from './interfaces';

const GRAVITY = 0.003;

const updateVelocity = (player: Player, delta: number) => {
  if (!player.playerState.touchingGround) {
    player.playerState.velocity[1] += GRAVITY * delta;
    return;
  }
  player.playerState.velocity[1] = 0;
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

export const characterNext = (player: Player, platforms: Platform[], delta: number): void => {
  updateVelocity(player, delta);

  platforms.forEach((platform) => checkForCollision(player, platform));

  player.playerState.y += player.playerState.velocity[1];
  player.playerState.x += player.playerState.velocity[0];

  checkIfFellOffTheWorld(player.playerState);
};

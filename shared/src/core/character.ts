import { USER_INPUT } from '../connection';
import { Player, Platform, PlayerState, EventState, PlayerEvent } from './interfaces';

const GRAVITY = 0.003;
const ACCELLERATION = 0.3;
const MAX_SPEED = 5;
const FRICTION = 0.6;

interface UpdateVelocityProps {
  player: Player;
  playerEvents: PlayerEvent[];
  delta: number;
  eventState: EventState;
}

const updateVelocity = ({ player, playerEvents, delta, eventState }: UpdateVelocityProps) => {
  if (!player.playerState.touchingGround) {
    player.playerState.velocity[1] += GRAVITY * delta;
  } else {
    player.playerState.velocity[1] = 0;
  }

  const leftChanges = playerEvents.some(
    (event) => event.event === USER_INPUT.LEFT_DOWN || event.event === USER_INPUT.LEFT_UP
  );
  const rightChanges = playerEvents.some(
    (event) => event.event === USER_INPUT.RIGHT_DOWN || event.event === USER_INPUT.RIGHT_UP
  );

  playerEvents.forEach((event) => {
    const left = event.event === USER_INPUT.LEFT_DOWN;
    const right = event.event === USER_INPUT.RIGHT_DOWN;

    if (left) {
      player.playerState.velocity[0] -= ACCELLERATION * event.timeSinceLastTick;
      if (player.playerState.velocity[0] <= -MAX_SPEED) {
        player.playerState.velocity[0] = -MAX_SPEED;
      }
    }
    if (right) {
      player.playerState.velocity[0] -= ACCELLERATION * event.timeSinceLastTick;
      if (player.playerState.velocity[0] <= -MAX_SPEED) {
        player.playerState.velocity[0] = -MAX_SPEED;
      }
    }
    if (((!left && !right) || (left && right)) && player.playerState.velocity[0] !== 0) {
      if (player.playerState.velocity[0] > 0) {
        player.playerState.velocity[0] -= FRICTION * event.timeSinceLastTick;
        if (player.playerState.velocity[0] < 0) {
          player.playerState.velocity[0] = 0;
        }
      } else if (player.playerState.velocity[0] < 0) {
        player.playerState.velocity[0] += FRICTION * event.timeSinceLastTick;
        if (player.playerState.velocity[0] > 0) {
          player.playerState.velocity[0] = 0;
        }
      }
    }
  });

  if (leftChanges || rightChanges) {
    if (eventState.left) {
      player.playerState.velocity[0] -= ACCELLERATION * delta;
      if (player.playerState.velocity[0] <= -MAX_SPEED) {
        player.playerState.velocity[0] = -MAX_SPEED;
      }
    }
    if (eventState.right) {
      player.playerState.velocity[0] += ACCELLERATION * delta;
      if (player.playerState.velocity[0] >= MAX_SPEED) {
        player.playerState.velocity[0] = MAX_SPEED;
      }
    }
    if (
      ((!eventState.left && !eventState.right) || (eventState.left && eventState.right)) &&
      player.playerState.velocity[0] !== 0
    ) {
      if (player.playerState.velocity[0] > 0) {
        player.playerState.velocity[0] -= FRICTION * delta;
        if (player.playerState.velocity[0] < 0) {
          player.playerState.velocity[0] = 0;
        }
      } else if (player.playerState.velocity[0] < 0) {
        player.playerState.velocity[0] += FRICTION * delta;
        if (player.playerState.velocity[0] > 0) {
          player.playerState.velocity[0] = 0;
        }
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

interface CharacterNextProps {
  player: Player;
  eventState: EventState;
  playerEvents: PlayerEvent[];
  platforms: Platform[];
  delta: number;
}

export const characterNext = ({ player, eventState, platforms, delta, playerEvents }: CharacterNextProps): void => {
  updateVelocity({
    player,
    playerEvents: playerEvents.filter((event) => event.playerId === player.playerId),
    eventState,
    delta,
  });

  platforms.forEach((platform) => checkForCollision(player, platform));

  player.playerState.y += (player.playerState.velocity[1] * delta * delta) / 2;
  player.playerState.x += (player.playerState.velocity[0] * delta * delta) / 2;

  checkIfFellOffTheWorld(player.playerState);
};

export interface CharacterState {
  playerId?: string;
  x: number;
  y: number;
  touchingGround: boolean;
  velocity: number[];
}

const GRAVITY = 0.00003;

const getNewVelocity = (characterState: CharacterState, delta: number) => {
  if (!characterState.touchingGround) {
    // const nextPosition = Math.pow(Math.sqrt(2) * Math.sqrt(characterState.x) + delta * Math.sqrt(GRAVITY), 2) / 2;
    return [characterState.velocity[0], characterState.velocity[1] + GRAVITY * delta];
  }
  return [characterState.velocity[0], 0];
};

export const characterNext = (characterState: CharacterState, delta: number): CharacterState => {
  const [newVelx, newVely] = getNewVelocity(characterState, delta);

  return {
    ...characterState,
    x: characterState.x + newVelx * delta,
    y: characterState.y + newVely * delta,
    velocity: [newVelx, newVely],
  };
};

// High-performance Spring Solver for 3D Card Physics

export interface Spring1D {
  current: number;
  target: number;
  velocity: number;
}

export interface CardPhysicsState {
  tx: Spring1D;
  ty: Spring1D;
  tz: Spring1D;
  rx: Spring1D;
  ry: Spring1D;
  scale: Spring1D;
  foilX: number;
  foilY: number;
  darkOverlay: number;
  isSettled: boolean;
}

export function createCardPhysicsState(initialZ: number = 0, initialRx: number = 0, initialScale: number = 1): CardPhysicsState {
  return {
    tx: { current: 0, target: 0, velocity: 0 },
    ty: { current: 0, target: 0, velocity: 0 },
    tz: { current: initialZ, target: initialZ, velocity: 0 },
    rx: { current: initialRx, target: initialRx, velocity: 0 },
    ry: { current: 0, target: 0, velocity: 0 },
    scale: { current: initialScale, target: initialScale, velocity: 0 },
    foilX: 50,
    foilY: 50,
    darkOverlay: 0,
    isSettled: false,
  };
}

export function updateSpring1D(
  spring: Spring1D,
  stiffness: number,
  damping: number,
  mass: number,
  dt: number,
  threshold: number = 0.001
): boolean {
  const force = -stiffness * (spring.current - spring.target);
  const dampingForce = -damping * spring.velocity;
  const acceleration = (force + dampingForce) / mass;

  spring.velocity += acceleration * dt;
  spring.current += spring.velocity * dt;

  const isAtTarget = Math.abs(spring.current - spring.target) < threshold;
  const isZeroVelocity = Math.abs(spring.velocity) < threshold;

  if (isAtTarget && isZeroVelocity) {
    spring.current = spring.target;
    spring.velocity = 0;
    return true;
  }
  return false;
}

export function updateCardPhysics(
  state: CardPhysicsState,
  stiffness: number,
  damping: number,
  mass: number,
  dt: number
): boolean {
  const settledTx = updateSpring1D(state.tx, stiffness, damping, mass, dt, 0.01);
  const settledTy = updateSpring1D(state.ty, stiffness, damping, mass, dt, 0.01);
  const settledTz = updateSpring1D(state.tz, stiffness, damping, mass, dt, 0.05);
  const settledRx = updateSpring1D(state.rx, stiffness, damping, mass, dt, 0.02);
  const settledRy = updateSpring1D(state.ry, stiffness, damping, mass, dt, 0.02);
  const settledScale = updateSpring1D(state.scale, stiffness, damping, mass, dt, 0.001);

  state.isSettled = settledTx && settledTy && settledTz && settledRx && settledRy && settledScale;
  return state.isSettled;
}

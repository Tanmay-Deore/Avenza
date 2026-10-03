// Depth Engine Configuration & Tuning Profiles

export type DepthIntensityLevel = 0 | 1 | 2 | 3;

export interface DepthProfile {
  name: string;
  tiltMax: number;        // maximum tilt angle in degrees
  liftZ: number;          // primary hover lift in px
  rippleZ: number;        // maximum neighbour sink depth in px
  pushDist: number;       // maximum neighbour push displacement in px
  springStiffness: number;
  springDamping: number;
  springMass: number;
  hasOvershoot: boolean;
  scaleHover: number;
  scalePress: number;
  scaleSelected: number;
  scaleNeighbour: number;
  ladderStagger: number;  // ms between ladder steps
  ladderDuration: number; // ms duration per step
  scrollLeanMax: number;  // degrees for Wild mode
}

export const DEPTH_PROFILES: Record<DepthIntensityLevel, DepthProfile> = {
  0: {
    name: 'Off',
    tiltMax: 0,
    liftZ: 0,
    rippleZ: 0,
    pushDist: 0,
    springStiffness: 300,
    springDamping: 30,
    springMass: 1,
    hasOvershoot: false,
    scaleHover: 1.0,
    scalePress: 1.0,
    scaleSelected: 1.0,
    scaleNeighbour: 1.0,
    ladderStagger: 0,
    ladderDuration: 0,
    scrollLeanMax: 0,
  },
  1: {
    name: 'Calm',
    tiltMax: 3,
    liftZ: 4,
    rippleZ: 0,
    pushDist: 0,
    springStiffness: 220,
    springDamping: 26, // critical damping, no overshoot
    springMass: 1,
    hasOvershoot: false,
    scaleHover: 1.005,
    scalePress: 0.99,
    scaleSelected: 1.01,
    scaleNeighbour: 1.0,
    ladderStagger: 35,
    ladderDuration: 300,
    scrollLeanMax: 0,
  },
  2: {
    name: 'Expressive', // Default desktop: 4-6 deg tilt, 4-8px lift, no push
    tiltMax: 5,
    liftZ: 6,
    rippleZ: 0,
    pushDist: 0,
    springStiffness: 240,
    springDamping: 24, // smooth settle, subtle life
    springMass: 1,
    hasOvershoot: false,
    scaleHover: 1.01,
    scalePress: 0.988,
    scaleSelected: 1.015,
    scaleNeighbour: 1.0,
    ladderStagger: 40,
    ladderDuration: 350,
    scrollLeanMax: 0,
  },
  3: {
    name: 'Wild',
    tiltMax: 6,
    liftZ: 8,
    rippleZ: 0,
    pushDist: 0,
    springStiffness: 260,
    springDamping: 22,
    springMass: 1,
    hasOvershoot: true,
    scaleHover: 1.015,
    scalePress: 0.985,
    scaleSelected: 1.02,
    scaleNeighbour: 1.0,
    ladderStagger: 45,
    ladderDuration: 400,
    scrollLeanMax: 0,
  },
};

export function getEffectiveIntensityLevel(preferredLevel: DepthIntensityLevel = 2): DepthIntensityLevel {
  if (typeof window === 'undefined') return preferredLevel;

  // 1. Accessibility check: reduced motion forces level 0
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 0;

  // 2. Touch / coarse pointer check: default to Level 1 without aggressive tilt
  const isCoarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (isCoarse) {
    return Math.min(preferredLevel, 1) as DepthIntensityLevel;
  }

  return preferredLevel;
}

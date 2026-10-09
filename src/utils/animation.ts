import {
  Easing,
  interpolate,
  spring,
  type ExtrapolateType,
  type SpringConfig,
} from "remotion";

/**
 * Animation helpers. Every helper is a pure function of the current frame,
 * so output is deterministic and renders identically in Studio and on export.
 * Never use CSS transitions/animations or Date.now() in Remotion.
 */

export const CLAMP: {
  extrapolateLeft: ExtrapolateType;
  extrapolateRight: ExtrapolateType;
} = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

/** Reusable easing curves. */
export const EASE = {
  /** Fast start, long soft landing – the default for UI/typography entrances. */
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  /** Smooth both ends – good for exits and camera moves. */
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  /** Accelerating – good for elements leaving the frame. */
  inCubic: Easing.bezier(0.32, 0, 0.67, 0),
  /** Slight overshoot. */
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

/** Spring presets (pass to `spring({config})`). */
export const SPRING = {
  /** No bounce, smooth settle. */
  smooth: { damping: 200 },
  /** Snappy with a small overshoot. */
  snappy: { damping: 20, stiffness: 200 },
  /** Playful bounce. */
  bouncy: { damping: 8 },
  /** Slow and heavy. */
  heavy: { damping: 15, stiffness: 80, mass: 2 },
} satisfies Record<string, Partial<SpringConfig>>;

/** Linear 0→1 progress between two frames, eased. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE.outExpo,
): number =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    ...CLAMP,
    easing,
  });

/** Spring-driven 0→1 progress starting at `delay` frames. */
export const springIn = ({
  frame,
  fps,
  delay = 0,
  config = SPRING.smooth,
  durationInFrames,
}: {
  frame: number;
  fps: number;
  delay?: number;
  config?: Partial<SpringConfig>;
  durationInFrames?: number;
}): number => spring({ frame, fps, delay, config, durationInFrames });

/** Map 0→1 progress to any output range. */
export const mix = (t: number, from: number, to: number): number =>
  from + (to - from) * t;

/** Delay (in frames) for the n-th item of a staggered group. */
export const stagger = (index: number, step: number, base = 0): number =>
  base + index * step;

/**
 * Fade-out multiplier for the end of a scene.
 * Returns 1 until `durationInFrames - outFrames`, then eases to 0.
 */
export const fadeOutAtEnd = (
  frame: number,
  durationInFrames: number,
  outFrames: number,
): number =>
  interpolate(frame, [durationInFrames - outFrames, durationInFrames], [1, 0], {
    ...CLAMP,
    easing: EASE.inCubic,
  });

import { sec } from "../../utils/time";

/**
 * Single source of truth for the Showcase timing, in SECONDS.
 * Change a value here and the total duration, scene lengths and
 * audio cue points all update automatically at any frame rate.
 */
export const SCENE_SECONDS = {
  intro: 3.4,
  shapes: 3.6,
  specs: 3.6,
  outro: 3.4,
} as const;

/** Length of each scene-to-scene transition. */
export const TRANSITION_SECONDS = 0.7;

export type SceneName = keyof typeof SCENE_SECONDS;
const ORDER: SceneName[] = ["intro", "shapes", "specs", "outro"];

/** Frames per scene at the given fps. */
export const sceneFrames = (fps: number) =>
  Object.fromEntries(
    ORDER.map((name) => [name, sec(SCENE_SECONDS[name], fps)]),
  ) as Record<SceneName, number>;

export const transitionFrames = (fps: number) => sec(TRANSITION_SECONDS, fps);

/**
 * Absolute start frame of each scene. Transitions overlap neighbouring scenes,
 * so each later scene starts one transition earlier than a plain sequence would.
 * Use these to sync audio cues (whooshes, hits) with scene changes.
 */
export const sceneStarts = (fps: number): Record<SceneName, number> => {
  const frames = sceneFrames(fps);
  const t = transitionFrames(fps);
  let cursor = 0;
  const starts = {} as Record<SceneName, number>;
  ORDER.forEach((name, i) => {
    starts[name] = cursor;
    cursor += frames[name] - (i < ORDER.length - 1 ? t : 0);
  });
  return starts;
};

/** Total composition length in frames. */
export const totalFrames = (fps: number): number => {
  const frames = sceneFrames(fps);
  const scenesTotal = ORDER.reduce((sum, name) => sum + frames[name], 0);
  return scenesTotal - (ORDER.length - 1) * transitionFrames(fps);
};

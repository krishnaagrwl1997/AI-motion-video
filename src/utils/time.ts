/** Convert seconds to a whole number of frames at the given fps. */
export const sec = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

/** Convert frames back to seconds. */
export const toSeconds = (frames: number, fps: number): number => frames / fps;

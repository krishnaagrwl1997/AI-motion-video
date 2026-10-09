import { useVideoConfig } from "remotion";

/**
 * Resolution-independent unit. Design at 1920×1080 and multiply sizes by `u`
 * so layouts scale cleanly to 720p, 4K or other aspect ratios.
 */
export const useUnit = (): number => {
  const { width, height } = useVideoConfig();
  return Math.min(width / 1920, height / 1080);
};

/** True when the frame is taller than it is wide (e.g. 1080×1920). */
export const useIsPortrait = (): boolean => {
  const { width, height } = useVideoConfig();
  return height > width;
};

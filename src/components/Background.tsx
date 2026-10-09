import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../styles/theme";

type BackgroundProps = {
  readonly color?: string;
  readonly glowA?: string;
  readonly glowB?: string;
  /** Show the subtle blueprint grid. */
  readonly grid?: boolean;
};

/**
 * Full-frame animated backdrop: base color, two slowly drifting glows and an optional grid.
 * Driven by the absolute composition frame, so it stays continuous across scene transitions
 * when placed outside of a <TransitionSeries>.
 */
export const Background: React.FC<BackgroundProps> = ({
  color = COLORS.background,
  glowA = COLORS.accent,
  glowB = COLORS.accent2,
  grid = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const size = Math.max(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: size * 0.9,
          height: size * 0.9,
          left: width * 0.05 + Math.sin(t * 0.6) * width * 0.08,
          top: -size * 0.35 + Math.cos(t * 0.5) * height * 0.08,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowA}55 0%, ${glowA}00 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          right: -size * 0.2 + Math.cos(t * 0.45) * width * 0.06,
          bottom: -size * 0.45 + Math.sin(t * 0.55) * height * 0.08,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowB}40 0%, ${glowB}00 60%)`,
        }}
      />
      {grid ? (
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [0, fps], [0, 0.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            backgroundImage: `linear-gradient(${COLORS.text}0D 1px, transparent 1px), linear-gradient(90deg, ${COLORS.text}0D 1px, transparent 1px)`,
            backgroundSize: `${width / 24}px ${width / 24}px`,
            backgroundPosition: `${(-t * 12) % (width / 24)}px 0px`,
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

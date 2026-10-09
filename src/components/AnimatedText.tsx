import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING, mix, springIn } from "../utils/animation";

type AnimatedTextProps = {
  readonly text: string;
  /** Animate per word or per character. */
  readonly by?: "word" | "char";
  /** Frame (relative to the parent sequence) at which the first unit starts. */
  readonly delay?: number;
  /** Frames between consecutive units. */
  readonly staggerFrames?: number;
  /** Distance (px) each unit rises from. */
  readonly rise?: number;
  /** Starting blur (px). */
  readonly blur?: number;
  readonly style?: React.CSSProperties;
  /** Optional per-unit style, e.g. to color a highlighted word. */
  readonly unitStyle?: (
    unit: string,
    index: number,
  ) => React.CSSProperties | undefined;
};

/**
 * Kinetic typography: splits text into words or characters and springs each one in
 * with rise, fade and de-blur, staggered over time.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  by = "word",
  delay = 0,
  staggerFrames = 4,
  rise = 40,
  blur = 12,
  style,
  unitStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const units = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: by === "word" ? "0.28em" : 0,
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const p = springIn({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: SPRING.smooth,
          durationInFrames: Math.round(fps * 0.8),
        });
        return (
          <span
            // Units are generated from one source string, so index keys are stable.
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              // Keep word spacing visible when animating per character.
              minWidth: unit === " " ? "0.3em" : undefined,
              opacity: p,
              translate: `0px ${mix(p, rise, 0)}px`,
              filter: `blur(${mix(p, blur, 0)}px)`,
              ...unitStyle?.(unit, i),
            }}
          >
            {unit}
          </span>
        );
      })}
    </div>
  );
};

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { Counter } from "../../../components/Counter";
import { COLORS, FONTS } from "../../../styles/theme";
import {
  CLAMP,
  EASE,
  SPRING,
  mix,
  springIn,
  stagger,
} from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

type SpecsSceneProps = {
  readonly accentColor: string;
  readonly secondaryColor: string;
};

const StatCard: React.FC<{
  readonly label: string;
  readonly value: number;
  readonly suffix?: string;
  readonly color: string;
  readonly delay: number;
}> = ({ label, value, suffix = "", color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const p = springIn({ frame, fps, delay, config: SPRING.snappy });

  return (
    <div
      style={{
        width: 440 * u,
        padding: `${44 * u}px ${48 * u}px`,
        borderRadius: 32 * u,
        backgroundColor: `${COLORS.surface}CC`,
        border: `${2 * u}px solid ${color}55`,
        boxShadow: `0 ${30 * u}px ${80 * u}px ${color}22`,
        opacity: Math.min(1, p * 1.5),
        translate: `0px ${mix(p, 80 * u, 0)}px`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22 * u,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 12 * u,
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: 104 * u,
          letterSpacing: "-0.04em",
          color: COLORS.text,
          whiteSpace: "nowrap",
        }}
      >
        <Counter
          to={value}
          delay={delay}
          durationInFrames={Math.round(1.1 * fps)}
        />
        <span
          style={{
            fontSize: 44 * u,
            fontWeight: 600,
            color: COLORS.muted,
            marginLeft: 8 * u,
          }}
        >
          {suffix}
        </span>
      </div>
    </div>
  );
};

/** Reads the live video config, so the numbers always match the actual render settings. */
export const SpecsScene: React.FC<SpecsSceneProps> = ({
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const u = useUnit();
  const step = Math.round(0.15 * fps);
  const base = Math.round(0.35 * fps);
  const playhead = interpolate(frame, [base, 3.2 * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.inOutCubic,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 70 * u,
      }}
    >
      <AnimatedText
        text="Any size. Any frame rate."
        by="word"
        staggerFrames={Math.round(0.08 * fps)}
        rise={40 * u}
        blur={10 * u}
        style={{
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: 88 * u,
          letterSpacing: "-0.03em",
          color: COLORS.text,
        }}
      />

      <div style={{ display: "flex", gap: 48 * u }}>
        <StatCard
          label="Width"
          value={width}
          suffix="px"
          color={accentColor}
          delay={stagger(0, step, base)}
        />
        <StatCard
          label="Height"
          value={height}
          suffix="px"
          color={secondaryColor}
          delay={stagger(1, step, base)}
        />
        <StatCard
          label="Frame rate"
          value={fps}
          suffix="fps"
          color={COLORS.accent3}
          delay={stagger(2, step, base)}
        />
      </div>

      {/* Timeline scrubber: ticks per second of the full composition and a moving playhead. */}
      <div style={{ position: "relative", width: 1356 * u, height: 40 * u }}>
        {Array.from({ length: Math.floor(durationInFrames / fps) + 1 }).map(
          (_, i, arr) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i / (arr.length - 1)) * 100}%`,
                top: 12 * u,
                width: 2 * u,
                height: 16 * u,
                backgroundColor: COLORS.muted,
                opacity: interpolate(
                  frame,
                  [base + i, base + i + 10],
                  [0, 0.6],
                  CLAMP,
                ),
              }}
            />
          ),
        )}
        <div
          style={{
            position: "absolute",
            top: 18 * u,
            left: 0,
            height: 4 * u,
            width: `${playhead * 100}%`,
            borderRadius: 4 * u,
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6 * u,
            left: `calc(${playhead * 100}% - ${14 * u}px)`,
            width: 28 * u,
            height: 28 * u,
            borderRadius: "50%",
            backgroundColor: COLORS.text,
            boxShadow: `0 0 ${24 * u}px ${secondaryColor}`,
            opacity: interpolate(frame, [base, base + 8], [0, 1], CLAMP),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

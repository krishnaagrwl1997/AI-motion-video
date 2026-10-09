import { Circle, Rect, Star, Triangle } from "@remotion/shapes";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { PopIn } from "../../../components/PopIn";
import { COLORS, FONTS } from "../../../styles/theme";
import { CLAMP, EASE, SPRING, stagger } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

type ShapesSceneProps = {
  readonly accentColor: string;
  readonly secondaryColor: string;
};

const Label: React.FC<{
  readonly children: string;
  readonly delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const u = useUnit();
  return (
    <div
      style={{
        marginTop: 36 * u,
        fontFamily: FONTS.mono,
        fontSize: 24 * u,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: COLORS.muted,
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], CLAMP),
      }}
    >
      {children}
    </div>
  );
};

export const ShapesScene: React.FC<ShapesSceneProps> = ({
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const size = 220 * u;
  const step = Math.round(0.15 * fps);
  const base = Math.round(0.45 * fps);
  // Continuous idle motion after the entrance.
  const spin = (frame / fps) * 40;
  const bob = (i: number) => Math.sin((frame / fps) * 2.4 + i) * 10 * u;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 90 * u,
      }}
    >
      <AnimatedText
        text="Shapes. Springs. Timing."
        by="word"
        delay={0}
        staggerFrames={Math.round(0.1 * fps)}
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

      <div style={{ display: "flex", gap: 110 * u, alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            translate: `0px ${bob(0)}px`,
          }}
        >
          <PopIn delay={stagger(0, step, base)} config={SPRING.bouncy}>
            <Circle radius={size / 2} fill={accentColor} />
          </PopIn>
          <Label delay={stagger(0, step, base) + 8}>Circle</Label>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            translate: `0px ${bob(1)}px`,
          }}
        >
          <PopIn
            delay={stagger(1, step, base)}
            config={SPRING.bouncy}
            fromRotate={-90}
          >
            <Rect
              width={size}
              height={size}
              cornerRadius={36 * u}
              fill={secondaryColor}
              style={{ rotate: `${spin * 0.5}deg` }}
            />
          </PopIn>
          <Label delay={stagger(1, step, base) + 8}>Rect</Label>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            translate: `0px ${bob(2)}px`,
          }}
        >
          <PopIn
            delay={stagger(2, step, base)}
            config={SPRING.bouncy}
            fromRotate={120}
          >
            <Triangle
              length={size * 1.1}
              direction="up"
              cornerRadius={18 * u}
              fill={COLORS.accent3}
            />
          </PopIn>
          <Label delay={stagger(2, step, base) + 8}>Triangle</Label>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            translate: `0px ${bob(3)}px`,
          }}
        >
          <PopIn
            delay={stagger(3, step, base)}
            config={SPRING.bouncy}
            fromRotate={-180}
          >
            <Star
              points={5}
              innerRadius={size * 0.24}
              outerRadius={size * 0.55}
              cornerRadius={10 * u}
              fill={COLORS.warm}
              style={{ rotate: `${spin}deg` }}
            />
          </PopIn>
          <Label delay={stagger(3, step, base) + 8}>Star</Label>
        </div>
      </div>

      <div
        style={{
          width: 900 * u,
          height: 4 * u,
          borderRadius: 4 * u,
          background: `linear-gradient(90deg, transparent, ${COLORS.muted}66, transparent)`,
          scale: `${interpolate(frame, [base, base + fps], [0, 1], { ...CLAMP, easing: EASE.outExpo })} 1`,
        }}
      />
    </AbsoluteFill>
  );
};

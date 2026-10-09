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
import { CLAMP, EASE, SPRING } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

type OutroSceneProps = {
  readonly accentColor: string;
  readonly secondaryColor: string;
};

export const OutroScene: React.FC<OutroSceneProps> = ({
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const ring = 240 * u;
  const stroke = 14 * u;
  const r = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const draw = interpolate(frame, [0.2 * fps, 1.4 * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.inOutCubic,
  });
  const check = interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.outExpo,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 56 * u,
      }}
    >
      <PopIn delay={0} config={SPRING.snappy}>
        <svg width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`}>
          <defs>
            <linearGradient id="outro-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={r}
            stroke={`${COLORS.muted}33`}
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={r}
            stroke="url(#outro-ring)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - draw)}
            transform={`rotate(-90 ${ring / 2} ${ring / 2})`}
          />
          <path
            d={`M ${ring * 0.32} ${ring * 0.52} L ${ring * 0.45} ${ring * 0.64} L ${ring * 0.69} ${ring * 0.38}`}
            stroke={COLORS.text}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - check}
          />
        </svg>
      </PopIn>

      <AnimatedText
        text="Made with Remotion"
        by="char"
        delay={Math.round(0.5 * fps)}
        staggerFrames={1}
        rise={30 * u}
        blur={8 * u}
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 120 * u,
          letterSpacing: "-0.04em",
          color: COLORS.text,
        }}
      />

      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 34 * u,
          color: secondaryColor,
          padding: `${16 * u}px ${32 * u}px`,
          borderRadius: 999,
          border: `${2 * u}px solid ${secondaryColor}66`,
          backgroundColor: `${COLORS.surface}AA`,
          opacity: interpolate(frame, [1.3 * fps, 1.8 * fps], [0, 1], CLAMP),
          translate: `0px ${interpolate(frame, [1.3 * fps, 1.8 * fps], [24 * u, 0], { ...CLAMP, easing: EASE.outExpo })}px`,
        }}
      >
        $ npm run dev
      </div>
    </AbsoluteFill>
  );
};

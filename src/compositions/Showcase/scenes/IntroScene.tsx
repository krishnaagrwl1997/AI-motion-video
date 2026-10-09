import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { RevealBar } from "../../../components/RevealBar";
import { COLORS, FONTS } from "../../../styles/theme";
import { CLAMP, EASE } from "../../../utils/animation";
import { useUnit } from "../../../utils/layout";

type IntroSceneProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly accentColor: string;
  readonly secondaryColor: string;
};

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  subtitle,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useUnit();
  const words = title.split(" ");
  const lastIndex = words.length - 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 36 * u,
        padding: 120 * u,
        // Slow push-in for the whole scene.
        scale: String(
          interpolate(frame, [0, 3.4 * fps], [1, 1.05], {
            ...CLAMP,
            easing: EASE.inOutCubic,
          }),
        ),
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 26 * u,
          letterSpacing: "0.4em",
          color: secondaryColor,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], CLAMP),
          translate: `0px ${interpolate(frame, [0, 0.6 * fps], [20 * u, 0], {
            ...CLAMP,
            easing: EASE.outExpo,
          })}px`,
        }}
      >
        Remotion · Programmatic Motion
      </div>

      <AnimatedText
        text={title}
        by="word"
        delay={Math.round(0.25 * fps)}
        staggerFrames={Math.round(0.12 * fps)}
        rise={60 * u}
        blur={16 * u}
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 150 * u,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: COLORS.text,
          textAlign: "center",
        }}
        unitStyle={(_, i) =>
          i === lastIndex
            ? {
                backgroundImage: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : undefined
        }
      />

      <RevealBar
        width={360 * u}
        height={8 * u}
        color={accentColor}
        delay={Math.round(0.8 * fps)}
        durationInFrames={Math.round(0.7 * fps)}
      />

      <AnimatedText
        text={subtitle}
        by="word"
        delay={Math.round(1.1 * fps)}
        staggerFrames={2}
        rise={24 * u}
        blur={8 * u}
        style={{
          fontFamily: FONTS.body,
          fontWeight: 400,
          fontSize: 44 * u,
          color: COLORS.muted,
          textAlign: "center",
        }}
      />
    </AbsoluteFill>
  );
};

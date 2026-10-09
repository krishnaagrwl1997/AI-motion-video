import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../../components/AnimatedText";
import { Background } from "../../components/Background";
import { COLORS, FONTS } from "../../styles/theme";
import { CLAMP, EASE } from "../../utils/animation";
import { useUnit } from "../../utils/layout";

/**
 * Starter scene used by `npm run new <Name>`.
 * The script copies this file to src/compositions/<Name>/<Name>.tsx,
 * renames `Template`, and registers it in src/Root.tsx.
 */
export type TemplateProps = {
  readonly title: string;
};

export const Template: React.FC<TemplateProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const u = useUnit();

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(
            frame,
            [durationInFrames - 0.5 * fps, durationInFrames],
            [1, 0],
            { ...CLAMP, easing: EASE.inCubic },
          ),
        }}
      >
        <AnimatedText
          text={title}
          delay={Math.round(0.2 * fps)}
          rise={50 * u}
          style={{
            fontFamily: FONTS.display,
            fontWeight: 800,
            fontSize: 140 * u,
            letterSpacing: "-0.03em",
            color: COLORS.text,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

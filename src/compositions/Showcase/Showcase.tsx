import { Audio } from "@remotion/media";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import {
  AbsoluteFill,
  type CalculateMetadataFunction,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../../components/Background";
import { SPRING, fadeOutAtEnd } from "../../utils/animation";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { ShapesScene } from "./scenes/ShapesScene";
import { SpecsScene } from "./scenes/SpecsScene";
import type { ShowcaseProps } from "./schema";
import {
  sceneFrames,
  sceneStarts,
  totalFrames,
  transitionFrames,
} from "./timeline";

/**
 * Derives width, height, fps and duration from props, so changing the format
 * (in Studio, via --props, or in config/video.ts) keeps timing correct.
 */
export const calculateShowcaseMetadata: CalculateMetadataFunction<
  ShowcaseProps
> = ({ props }) => ({
  width: props.width,
  height: props.height,
  fps: props.fps,
  durationInFrames: totalFrames(props.fps),
});

export const Showcase: React.FC<ShowcaseProps> = ({
  title,
  subtitle,
  accentColor,
  secondaryColor,
  backgroundColor,
  music,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scenes = sceneFrames(fps);
  const starts = sceneStarts(fps);
  const transition = springTiming({
    config: SPRING.smooth,
    durationInFrames: transitionFrames(fps),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOutAtEnd(frame, durationInFrames, Math.round(0.5 * fps)),
      }}
    >
      {/* Persistent background outside the TransitionSeries stays continuous across cuts. */}
      <Background
        color={backgroundColor}
        glowA={accentColor}
        glowB={secondaryColor}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={scenes.intro}
          premountFor={fps}
        >
          <IntroScene
            title={title}
            subtitle={subtitle}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Shapes"
          durationInFrames={scenes.shapes}
          premountFor={fps}
        >
          <ShapesScene
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Specs"
          durationInFrames={scenes.specs}
          premountFor={fps}
        >
          <SpecsScene
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={scenes.outro}
          premountFor={fps}
        >
          <OutroScene
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Audio: a music bed plus sound effects synced to scene changes via timeline.ts. */}
      {music ? (
        <>
          <Audio
            name="Music bed"
            src={staticFile("audio/music-bed.mp3")}
            premountFor={fps}
            volume={interpolate(
              frame,
              [0, fps, durationInFrames - fps, durationInFrames],
              [0, 0.6, 0.6, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )}
          />
          <Audio
            name="Title impact"
            src={staticFile("audio/impact.mp3")}
            from={Math.round(0.25 * fps)}
            premountFor={fps}
            volume={0.8}
          />
          <Audio
            name="Whoosh → Shapes"
            src={staticFile("audio/whoosh.mp3")}
            from={starts.shapes}
            premountFor={fps}
            volume={0.5}
          />
          <Audio
            name="Whoosh → Specs"
            src={staticFile("audio/whoosh.mp3")}
            from={starts.specs}
            premountFor={fps}
            volume={0.35}
          />
          <Audio
            name="Whoosh → Outro"
            src={staticFile("audio/whoosh.mp3")}
            from={starts.outro}
            premountFor={fps}
            volume={0.5}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE, progress } from "../utils/animation";

type RevealBarProps = {
  readonly width: number;
  readonly height?: number;
  readonly color: string;
  readonly delay?: number;
  readonly durationInFrames?: number;
  readonly align?: "left" | "center";
};

/** A horizontal accent line that draws itself in. */
export const RevealBar: React.FC<RevealBarProps> = ({
  width,
  height = 8,
  color,
  delay = 0,
  durationInFrames = 20,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, durationInFrames, EASE.outExpo);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: height,
        backgroundColor: color,
        scale: `${p} 1`,
        transformOrigin: align === "left" ? "left center" : "center",
        boxShadow: `0 0 ${height * 3}px ${color}`,
      }}
    />
  );
};

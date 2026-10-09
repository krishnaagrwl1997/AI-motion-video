import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE, progress } from "../utils/animation";

type CounterProps = {
  readonly to: number;
  readonly from?: number;
  readonly delay?: number;
  readonly durationInFrames?: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly style?: React.CSSProperties;
};

/** Animated number that counts from `from` to `to`. Uses tabular numerals to avoid jitter. */
export const Counter: React.FC<CounterProps> = ({
  to,
  from = 0,
  delay = 0,
  durationInFrames = 30,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, durationInFrames, EASE.outExpo);
  const value = from + (to - from) * p;

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

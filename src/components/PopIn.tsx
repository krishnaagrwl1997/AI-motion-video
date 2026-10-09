import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING, mix, springIn } from "../utils/animation";
import type { SpringConfig } from "remotion";

type PopInProps = {
  readonly children: React.ReactNode;
  readonly delay?: number;
  readonly config?: Partial<SpringConfig>;
  /** Starting rotation in degrees. */
  readonly fromRotate?: number;
  readonly style?: React.CSSProperties;
};

/** Generic entrance wrapper: scales and fades its children in with a spring. */
export const PopIn: React.FC<PopInProps> = ({
  children,
  delay = 0,
  config = SPRING.bouncy,
  fromRotate = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay, config });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, p * 2),
        scale: String(p),
        rotate: `${mix(p, fromRotate, 0)}deg`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

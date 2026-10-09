import { z } from "zod";

/**
 * Shared schema for the video format. Compositions that extend it get
 * width / height / fps as props, which their calculateMetadata() applies.
 * That makes the format editable in three places:
 *   1. `defaultProps` of the <Composition> in src/Root.tsx (the defaults)
 *   2. the Studio props panel (saved back to Root.tsx)
 *   3. per render: --props='{"width":1080,"height":1920,"fps":60}'
 */
export const videoFormatSchema = z.object({
  width: z.number().int().min(16).max(7680),
  height: z.number().int().min(16).max(7680),
  fps: z.number().int().min(1).max(120),
});

export type VideoFormat = z.infer<typeof videoFormatSchema>;

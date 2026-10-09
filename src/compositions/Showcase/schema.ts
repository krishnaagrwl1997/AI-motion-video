import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { videoFormatSchema } from "../../config/video";

/** Props editable in the Studio sidebar and via `--props` on the CLI. Defaults live in src/Root.tsx. */
export const showcaseSchema = videoFormatSchema.extend({
  title: z.string(),
  subtitle: z.string(),
  accentColor: zColor(),
  secondaryColor: zColor(),
  backgroundColor: zColor(),
  music: z.boolean(),
});

export type ShowcaseProps = z.infer<typeof showcaseSchema>;

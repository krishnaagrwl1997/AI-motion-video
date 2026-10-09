import React from "react";
import { Composition, Folder } from "remotion";
import {
  Showcase,
  calculateShowcaseMetadata,
  showcaseSchema,
} from "./compositions/Showcase";
// @new-composition-imports (used by scripts/new-composition.mjs – keep this line)

/**
 * Register every renderable video here.
 * - `id` is what you pass to `npx remotion render <id>`.
 * - Keep `defaultProps` as inline object literals so Studio can save edits back to this file.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Examples">
        {/* Format (width/height/fps) is set via props; duration is derived from
            compositions/Showcase/timeline.ts by calculateShowcaseMetadata. */}
        <Composition
          id="Showcase"
          component={Showcase}
          schema={showcaseSchema}
          calculateMetadata={calculateShowcaseMetadata}
          defaultProps={{
            width: 1920,
            height: 1080,
            fps: 30,
            title: "Motion, Programmed.",
            subtitle: "Polished videos written in React with Remotion",
            accentColor: "#6C5CFF",
            secondaryColor: "#00D4C8",
            backgroundColor: "#070B1A",
            music: true,
          }}
        />
      </Folder>
      {/* @new-compositions (used by scripts/new-composition.mjs – keep this line) */}
    </>
  );
};

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Fonts are self-hosted from public/fonts (SIL Open Font License, see OFL-*.txt),
 * so renders work offline and never depend on a font CDN.
 * loadFont() delays rendering until each font is ready.
 *
 * To add a font: drop the .woff2 into public/fonts and call loadFont() below.
 * Google Fonts can also be used via `npx remotion add @remotion/google-fonts`.
 */
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-Variable-latin.woff2"),
  weight: "100 900",
});
loadFont({
  family: "JetBrains Mono",
  url: staticFile("fonts/JetBrainsMono-Variable-latin.woff2"),
  weight: "100 800",
});

export const FONTS = {
  display: "Inter, sans-serif",
  body: "Inter, sans-serif",
  mono: '"JetBrains Mono", monospace',
} as const;

export const COLORS = {
  background: "#070B1A",
  surface: "#111733",
  text: "#F5F7FF",
  muted: "#8A93B8",
  accent: "#6C5CFF",
  accent2: "#00D4C8",
  accent3: "#FF5C8A",
  warm: "#FFB547",
} as const;

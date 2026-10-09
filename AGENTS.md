# AGENTS.md — Remotion motion-graphics project

Instructions for AI coding agents (Claude Code, Codex, Cursor, …) working in this repo.
Videos are React components rendered frame-by-frame by **Remotion 4.0.534**.

## First steps for any task

1. Read this file, then the official Remotion skills in `.agents/skills/` (symlinked into
   `.claude/skills/`). Start with `remotion-best-practices/SKILL.md`; for markup load
   `remotion-markup/SKILL.md` and the topic file you need (`transitions.md`, `audio.md`,
   `google-fonts.md`, `timing.md`, `sequencing.md`, …).
2. Look at `src/compositions/Showcase/` — it is the reference implementation of every pattern below.
3. Users may edit code between turns (also through the Studio, which writes back to source).
   Don't overwrite surprising changes; assume they were intentional.

## Commands

| Task | Command |
| --- | --- |
| Install deps | `npm i` |
| Preview in Remotion Studio | `npm run dev` (opens http://localhost:3000) |
| List compositions + their size/fps/duration | `npm run compositions` |
| New composition from template | `npm run new -- MyPromo [--width 1920 --height 1080 --fps 30 --seconds 5]` |
| Render the sample to MP4 | `npm run render` → `out/showcase.mp4` |
| Render any composition | `npx remotion render <CompositionId> out/<name>.mp4` |
| Render one frame (visual check) | `npx remotion still <CompositionId> out/frame.png --frame=60` |
| Lint + typecheck | `npm run lint` |
| Upgrade Remotion (keeps all `@remotion/*` in sync) | `npx remotion upgrade` |
| Add a Remotion package at the matching version | `npx remotion add @remotion/<pkg>` |

Never install `@remotion/*` packages with a plain `npm i` + `@latest`: all Remotion packages must share
the exact same version (currently `4.0.534`). Use `npx remotion add`.

## Project layout

```
src/
  index.ts                  registerRoot() entry point – don't change
  Root.tsx                  registers every <Composition>; defaultProps live here (inline literals)
  config/video.ts           videoFormatSchema – width/height/fps as props
  styles/theme.ts           COLORS palette + FONTS (self-hosted fonts loaded here)
  utils/animation.ts        EASE curves, SPRING presets, progress(), springIn(), stagger(), fadeOutAtEnd()
  utils/time.ts             sec(seconds, fps) → frames
  utils/layout.ts           useUnit() resolution-independent sizing, useIsPortrait()
  components/               reusable building blocks
    AnimatedText.tsx        kinetic type: per-word / per-char spring reveal with blur
    Background.tsx          animated gradient glows + drifting grid
    PopIn.tsx               spring scale/rotate/fade entrance wrapper
    Counter.tsx             counting number (tabular numerals)
    RevealBar.tsx           self-drawing accent line
  compositions/
    Showcase/               sample video (4 scenes, transitions, audio)
      Showcase.tsx          TransitionSeries + audio + calculateMetadata
      timeline.ts           scene lengths in SECONDS → frames, start frames, total duration
      schema.ts             zod props schema (Studio controls)
      scenes/*.tsx          one file per scene
    _template/Template.tsx  copied by `npm run new`
public/                     static assets, referenced with staticFile("…")
  audio/  fonts/  images/  video/
  generated/                files created by the AI-generation MCP servers
scripts/new-composition.mjs scaffolder used by `npm run new`
out/                        render output (git-ignored)
```

## Golden rules (Remotion is deterministic)

- **Everything animates from `useCurrentFrame()`.** Use `interpolate()`, `spring()`, `Easing`.
  CSS `transition`/`animation`, `requestAnimationFrame`, `setTimeout`, `Date.now()` and
  `Math.random()` break rendering. For randomness use `random("seed")` from `remotion`.
- **Think in seconds, compute in frames.** Get `fps` from `useVideoConfig()` and write
  `2 * fps` / `sec(2, fps)`, never a hard-coded `60`. Then changing fps never changes timing.
- **Always clamp** `interpolate()` (`...CLAMP` from `utils/animation.ts`) unless you want extrapolation.
- **Size with `useUnit()`**: design at 1920×1080 and multiply px values by `u` so every resolution works.
- Prefer the CSS `scale`, `translate`, `rotate` properties over a `transform` string.
- Give `<Sequence>`, `<TransitionSeries.Sequence>`, `<Audio>`, `<Video>` `premountFor={fps}`.
- Assets go in `public/` and are referenced with `staticFile("audio/x.mp3")`. Remote URLs also work.
- Media: `<Audio>`/`<Video>` from `@remotion/media`; images with `<Img>` from `remotion`.
- Keep `defaultProps` in `Root.tsx` as inline object literals so Studio can save prop edits.
- Every `<Composition id>` must be unique and use only letters, numbers and `-`.

## AI asset generation (MCP servers)

`.mcp.json` connects these free MCP servers for Claude Code. Keys come from environment variables (Codespaces secrets).
A server whose key is missing will fail to connect; ignore it and use another.

| Server | Use for | Tools | Needs |
| --- | --- | --- | --- |
| `pollinations` (@pinkpixel/mcpollinations 1.3.1) | images (default choice) | `generateImage` (saves file; defaults 1920×1080), `editImage`, `generateImageFromReference`, `listImageModels`, `respondAudio` (TTS) | nothing (`POLLINATIONS_TOKEN` optional). Anonymous use is rate-limited (~1 request / 15 s) and may add a watermark |
| `huggingface` (official, remote) | images, short video, music via Gradio Spaces | Hub/Space search plus the Spaces the user enabled at huggingface.co/settings/mcp | `HF_TOKEN` (free; GPU Spaces use a daily free ZeroGPU quota) |
| `gemini` (aio-gemini-mcp 0.5.0) | voiceover | `generate_speech` (free tier), `transcribe_audio`. `generate_image`, `generate_omni` (video) and `generate_music` need a billed key and fail on the free tier | `GEMINI_API_KEY`; saves to `GEMINI_OUTPUT_DIR`, which must be absolute |
| `elevenlabs` (official) | voices, sound effects | `text_to_speech`, `text_to_sound_effects`, voice search/design. `compose_music` needs a paid plan | `ELEVENLABS_API_KEY` (free plan: 10k credits/month, non-commercial) |

- Generated files are written to `public/generated/` (`MCP_OUTPUT_DIR`). Use them with
  `staticFile("generated/<file>")`: `<Img>` for images, `<Video>`/`<Audio>` from `@remotion/media` for clips, voice and music.
- Rename generated files to descriptive kebab-case names, then reference them.
- Hugging Face Space tools return file URLs. Download them into `public/generated/` (e.g. with `curl -L -o`) before using them.
- Prefer building motion with Remotion itself (shapes, type, transitions). Use generated media for backgrounds, textures, voice and music.
- Free tiers have tight quotas. Generate only what the video needs, and reuse files that already exist in `public/generated/`.
- Sync narration to scenes: measure the file (`ffprobe -show_entries format=duration public/generated/<file>`)
  and size scenes in `timeline.ts`, or read the duration in `calculateMetadata` with Mediabunny
  (https://www.remotion.dev/docs/mediabunny/metadata).
- **Blender** (3D) runs only on the user's own computer with Blender open: `uvx mcp-for-blender setup`
  configures Claude Code and installs the add-on. Render from Blender to PNG sequences or MP4 files and place them in `public/`.

## Changing resolution, frame rate, duration

- **Showcase:** edit `defaultProps` `width` / `height` / `fps` in `src/Root.tsx`, or the Studio props
  panel, or per render: `npx remotion render Showcase out/vertical.mp4 --props='{"width":1080,"height":1920,"fps":60}'`.
  Duration comes from `compositions/Showcase/timeline.ts` (seconds per scene + transition length) via
  `calculateMetadata`, so it stays correct at any fps.
- **Simple compositions** (created by `npm run new`): edit `width`, `height`, `fps`,
  `durationInFrames` on the `<Composition>` in `Root.tsx`.
- CLI one-offs: `--width`, `--height`, `--fps`, `--frames=0-89`, `--scale=0.5`.
  (For Showcase prefer `--props`, so the duration is recomputed from the new fps.)

## Recipes

### Create a new composition / scene
1. `npm run new -- ProductLaunch --seconds 12` (creates `src/compositions/ProductLaunch/ProductLaunch.tsx`
   and registers it in `Root.tsx`).
2. Multi-scene videos: one component per scene in `scenes/`, sequenced with `<TransitionSeries>`
   (see `Showcase.tsx`). Keep scene lengths in a `timeline.ts` in seconds. If the total
   depends on props or fps, compute it in `calculateMetadata`.
3. Scene components should be transparent (no background) when a shared `<Background>` sits behind
   the `TransitionSeries`, so the backdrop stays continuous across cuts.

### Animate typography
- `<AnimatedText text="…" by="word" | "char" delay={…} staggerFrames={…} />` for kinetic reveals;
  use `unitStyle` to highlight words (e.g. a gradient on the last word, see `IntroScene`).
- Fade/slide pattern: `opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], CLAMP)` and
  `translate: \`0px ${interpolate(...)}px\``.
- Use the `EASE.outExpo` curve for entrances and `EASE.inCubic` for exits. For springs, use the `SPRING.smooth`
  preset (no bounce) for text and `SPRING.bouncy` for playful graphics.
- Fonts: add a `.woff2` to `public/fonts/` and call `loadFont()` in `styles/theme.ts`, or use Google
  Fonts via `npx remotion add @remotion/google-fonts` (`import {loadFont} from "@remotion/google-fonts/Inter"`).
  Load fonts at module level; Remotion waits for them before rendering.
- Measure text to fit boxes with `@remotion/layout-utils` (`fitText`, `measureText`).

### Animate graphics
- `@remotion/shapes` gives `<Circle>`, `<Rect>`, `<Triangle>`, `<Star>`, `<Polygon>`, `<Pie>`, `<Ellipse>`, `<Heart>`,
  and their `make*()` path functions. Wrap them in `<PopIn>` for entrances.
- SVG line drawing: `strokeDasharray` + `strokeDashoffset` driven by `interpolate` (see `OutroScene`).
- Stagger groups with `stagger(index, stepFrames, baseFrames)`.
- Idle motion after the entrance: derive from `frame / fps` (e.g. `Math.sin(frame / fps * 2)`).
- Transitions: `<TransitionSeries.Transition presentation={fade() | slide({direction}) | wipe() | flip() | clockWipe()} timing={springTiming(...) | linearTiming(...)} />`.
  Transitions overlap scenes: total = sum(scenes) − sum(transitions).

### Synchronize audio
- Put files in `public/audio/`. Add `<Audio src={staticFile("audio/x.mp3")} />` from `@remotion/media`.
- Start a sound at a moment with `from={frames}`, trim with `trimBefore` / `durationInFrames`,
  and fade it with `volume={interpolate(frame, [...], [...], CLAMP)}`.
- Sync cues to visuals by computing frames from the **same timeline source** the visuals use:
  `Showcase.tsx` places whooshes at `sceneStarts(fps).shapes` etc., so retiming a scene moves its sound too.
- To sync visuals to the beat, put beat times (seconds) in a constant and convert with `sec()`, or analyze the audio
  with `@remotion/media-utils` (`useWindowedAudioData` + `visualizeAudio`), see
  `.agents/skills/remotion-markup/audio-visualization.md`.
- Get a file's duration in `calculateMetadata` to size a composition to its soundtrack
  (see `.agents/skills/remotion-markup/calculate-metadata.md`).
- The bundled `music-bed.mp3`, `whoosh.mp3` and `impact.mp3` are synthesized placeholders (generated with ffmpeg,
  free to use). Replace them with your own licensed audio.

### Preview
- `npm run dev` opens Remotion Studio: pick a composition in the left sidebar, press Space to play, use J/K/L to shuttle,
  and edit props in the right panel. Hot reload is automatic.
- Agents without a browser: render stills of key frames and look at them:
  `npx remotion still Showcase out/check.png --frame=120`, or several at once:
  `npx remotion render Showcase out/frames --frames=0,60,120 --image-format=png` (output is an image sequence).

### Render / export
- MP4 (H.264, default): `npx remotion render <Id> out/<name>.mp4`
- Higher quality: `--crf=16` (lower = better; H.264 default is 18). Faster drafts: `--scale=0.5`.
- ProRes for editing: `--codec=prores --prores-profile=4444`. WebM: `--codec=vp9`. GIF: `--codec=gif`.
- Section only: `--frames=0-89`. Custom props: `--props='{"title":"Hello"}'` or `--props=./props.json`.
- Render from the Studio with the Render button (bottom right).

## Before you finish a change

1. `npm run lint` (ESLint + `tsc`) must pass.
2. Render 2–4 stills at key moments (entrances, mid-transition, end) and inspect them.
3. For timing/audio changes, render the MP4 and check `ffprobe out/<name>.mp4` (duration, fps, audio stream).
4. Don't commit `out/`.

## Troubleshooting

- **Browser download fails** (`remotion.media` unreachable, offline/locked-down machine): pass an
  existing Chrome/Chromium with `--browser-executable=/path/to/chrome` (or `Config.setBrowserExecutable()`
  in `remotion.config.ts`). Linux needs the packages listed at https://www.remotion.dev/docs/miscellaneous/linux-dependencies.
- **`delayRender()` timeout**: an asset or font failed to load. Check the URL/path and network.
- **Version mismatch warnings**: run `npx remotion upgrade` / use `npx remotion add`.
- **Fonts**: `public/fonts/` contains Inter and JetBrains Mono (SIL OFL 1.1, licenses alongside).

## Docs

- https://www.remotion.dev/docs/ — main docs (fundamentals: https://www.remotion.dev/docs/the-fundamentals)
- Animation: https://www.remotion.dev/docs/interpolate · https://www.remotion.dev/docs/spring · https://www.remotion.dev/docs/easing
- Transitions: https://www.remotion.dev/docs/transitions
- Audio: https://www.remotion.dev/docs/using-audio · https://www.remotion.dev/docs/media/audio
- Props & schemas: https://www.remotion.dev/docs/schemas · https://www.remotion.dev/docs/calculate-metadata
- CLI render: https://www.remotion.dev/docs/cli/render · Agent skills: https://www.remotion.dev/docs/ai/skills
- Licensing: free for individuals, non-profits and for-profit companies with up to 3 employees; larger
  companies need a company license (https://www.remotion.dev/docs/license).

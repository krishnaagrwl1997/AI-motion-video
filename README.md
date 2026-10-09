# AI Motion Video

Programmatic motion-graphics videos built with [Remotion](https://www.remotion.dev) **4.0.534** + React 19 + TypeScript,
set up for working with AI coding agents.

- `AGENTS.md` / `CLAUDE.md`: how agents should build scenes, animate type and graphics, sync audio, preview and render.
- `.agents/skills/` (and `.claude/skills/`): Remotion's official Agent Skills.
- `src/compositions/Showcase`: a polished 1920×1080 / 30 fps sample (≈12 s, 4 scenes, transitions, audio).

## Easiest way to open Remotion Studio (nothing to install)

1. On this repo's GitHub page, click the green **Code** button → **Codespaces** tab → **Create codespace**.
2. Wait a few minutes while it sets up (first time only).
3. Remotion Studio opens in a new browser tab. If it doesn't, open the **Ports** tab at the bottom
   and click the globe icon next to port **3000**.

## AI generation: images, video, voice, music, 3D

The project connects AI-generation tools (MCP servers) to **Claude Code**:

- **MiniMax**: images, video, voices
- **ElevenLabs**: voices, sound effects, music
- **Blender**: 3D, on your own computer

Generated files are saved to `public/generated/`.

**Set up once:**
1. Create accounts and copy your API keys:
   - MiniMax: https://www.minimax.io/platform/user-center/basic-information/interface-key
   - ElevenLabs: https://elevenlabs.io/app/settings/api-keys
2. Go to https://github.com/settings/codespaces, then **New secret**. Add `MINIMAX_API_KEY` and `ELEVENLABS_API_KEY`,
   and give each access to this repository.
3. Create a **new** codespace (or restart an existing one) so it picks up the secrets.

**Use them:**
1. In the codespace, click the **Claude** icon in the sidebar, or type `claude` in a new terminal.
2. Sign in, and answer **Yes** when asked to trust the folder and enable the project's MCP servers.
3. Ask, for example: *"Generate a 10-second upbeat background track and a voiceover saying 'Welcome', then add both to the Showcase video."*

**Blender (3D):** this only works on your own computer with Blender installed. Run
`curl -LsSf https://www.mcp-for-blender.com/install.sh | sh` (macOS/Linux) or
`powershell -ExecutionPolicy ByPass -c "irm https://www.mcp-for-blender.com/install.ps1 | iex"` (Windows),
then reopen Claude and Blender.

## Requirements

- Node.js 16+ (Remotion 4 minimum; tested with Node 22) and npm
- Linux only: [some extra packages](https://www.remotion.dev/docs/miscellaneous/linux-dependencies)
- Remotion downloads its own headless Chrome on first render. No separate FFmpeg install is needed.

## Commands

```bash
npm i                      # install dependencies
npm run dev                # open Remotion Studio (http://localhost:3000)
npm run render             # export the sample → out/showcase.mp4
npm run new -- MyPromo     # scaffold + register a new composition (opts: --width --height --fps --seconds)
npx remotion render MyPromo out/my-promo.mp4   # export any composition
npx remotion still Showcase out/frame.png --frame=60   # export a single frame
npm run compositions       # list compositions with size / fps / duration
npm run lint               # eslint + typecheck
npx remotion upgrade       # upgrade all Remotion packages together
```

Change the format without touching code:

```bash
npx remotion render Showcase out/vertical-60fps.mp4 --props='{"width":1080,"height":1920,"fps":60}'
```

Defaults are in `src/Root.tsx` (`defaultProps`), and scene lengths (in seconds) are in
`src/compositions/Showcase/timeline.ts`.

## Structure

```
src/Root.tsx            composition registry
src/compositions/       one folder per video (Showcase = sample, _template = scaffold source)
src/components/         AnimatedText, Background, PopIn, Counter, RevealBar
src/utils/              animation (easings, springs, helpers), time, layout (resolution-independent units)
src/styles/theme.ts     colors + fonts
public/                 audio, fonts, images, video (use staticFile())
```

## Assets & licenses

- Fonts: Inter and JetBrains Mono, SIL Open Font License 1.1 (`public/fonts/OFL-*.txt`).
- Audio in `public/audio/` is synthesized with FFmpeg for this project, so you can use it freely. Replace it with your own.
- Remotion is free for individuals, non-profits and companies with up to 3 employees. Larger companies need a
  [company license](https://www.remotion.dev/docs/license).

## Docs

[Remotion docs](https://www.remotion.dev/docs/) · [Fundamentals](https://www.remotion.dev/docs/the-fundamentals) ·
[Transitions](https://www.remotion.dev/docs/transitions) · [Audio](https://www.remotion.dev/docs/using-audio) ·
[CLI render](https://www.remotion.dev/docs/cli/render) · [Agent Skills](https://www.remotion.dev/docs/ai/skills)

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

## AI generation: images, video, voice, music, 3D (free tools)

Claude Code in this project is connected to free AI-generation tools (MCP servers, see `.mcp.json`).
Everything they create is saved to `public/generated/`.

| Tool | Makes | What you need (all free) |
| --- | --- | --- |
| **Pollinations** | images | nothing, works right away (slower, about 1 image per 15 s) |
| **Hugging Face** | images, short videos, music (via free community "Spaces") | free account + token → secret `HF_TOKEN` |
| **Gemini** | voiceovers (free tier). Images, video and music need billing | free key from AI Studio → secret `GEMINI_API_KEY` |
| **ElevenLabs** | voices, sound effects (10,000 free credits/month, non-commercial) | free account + key → secret `ELEVENLABS_API_KEY` |
| **Blender** | 3D scenes, on your own computer only | Blender installed |

**Add a key (do this for each tool you want):** go to https://github.com/settings/codespaces, click **New secret**,
use the name from the table, paste the key, and give it access to this repository. Then create a new codespace
(or restart the existing one).

- Hugging Face token: https://huggingface.co/settings/tokens (create a token with "Read" access).
  Choose which free image, video and music Spaces Claude can use at https://huggingface.co/settings/mcp.
- Gemini key: https://aistudio.google.com/apikey
- ElevenLabs key: https://elevenlabs.io/app/settings/api-keys

**Use it:** in the codespace, click the **Claude** icon (or type `claude` in a terminal). Sign in, then answer **Yes** to
trust the folder and enable the MCP servers. Then ask, for example: *"Generate a neon city background with Pollinations and
a voiceover saying 'Welcome' with Gemini, and use them in the Showcase intro."*

**Or add files by hand:** create images or videos in the Gemini or ChatGPT app, download them, drag them into
`public/generated/` in the file list, and tell Claude to use `generated/<file name>`.

**Blender (3D):** only works on your own computer with Blender installed. Run
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

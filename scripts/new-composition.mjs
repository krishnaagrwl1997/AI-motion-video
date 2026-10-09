#!/usr/bin/env node
/**
 * Scaffold a new composition from src/compositions/_template.
 *
 *   npm run new -- MyPromo                 # 1920×1080, 30 fps, 5 s
 *   npm run new -- MyReel --width 1080 --height 1920 --fps 30 --seconds 15
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--"));
const flag = (key, fallback) => {
  const i = args.indexOf(`--${key}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error(
    "Usage: npm run new -- <PascalCaseName> [--width 1920] [--height 1080] [--fps 30] [--seconds 5]",
  );
  process.exit(1);
}

const width = flag("width", 1920);
const height = flag("height", 1080);
const fps = flag("fps", 30);
const seconds = flag("seconds", 5);
for (const [k, v] of Object.entries({ width, height, fps, seconds })) {
  if (!Number.isFinite(v) || v <= 0) {
    console.error(`Invalid --${k}: ${v}`);
    process.exit(1);
  }
}

const dir = path.join(root, "src/compositions", name);
if (fs.existsSync(dir)) {
  console.error(`src/compositions/${name} already exists.`);
  process.exit(1);
}

const template = fs.readFileSync(
  path.join(root, "src/compositions/_template/Template.tsx"),
  "utf8",
);
const body = template
  .replace(/\/\*\*\n \* Starter scene[\s\S]*?\*\/\n/, "")
  .replaceAll("TemplateProps", `${name}Props`)
  .replaceAll("Template", name);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, `${name}.tsx`), body);

const rootFile = path.join(root, "src/Root.tsx");
let rootSrc = fs.readFileSync(rootFile, "utf8");
const importMarker = "// @new-composition-imports";
const compMarker = "{/* @new-compositions";
if (!rootSrc.includes(importMarker) || !rootSrc.includes(compMarker)) {
  console.error(
    "Could not find the @new-composition markers in src/Root.tsx; register the composition manually.",
  );
  process.exit(1);
}
rootSrc = rootSrc.replace(
  importMarker,
  `import { ${name} } from "./compositions/${name}/${name}";\n${importMarker}`,
);
rootSrc = rootSrc.replace(
  compMarker,
  `<Composition
        id="${name}"
        component={${name}}
        width={${width}}
        height={${height}}
        fps={${fps}}
        durationInFrames={${Math.round(seconds * fps)}}
        defaultProps={{ title: "${name}" }}
      />
      ${compMarker}`,
);
fs.writeFileSync(rootFile, rootSrc);

console.log(
  `Created src/compositions/${name}/${name}.tsx and registered "${name}" in src/Root.tsx`,
);
console.log(`Preview: npm run dev`);
console.log(`Render:  npx remotion render ${name} out/${name}.mp4`);

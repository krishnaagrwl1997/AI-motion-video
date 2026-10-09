/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// If Remotion can't download its headless browser (offline / locked-down network),
// point it at an existing Chrome or Chromium instead:
// Config.setBrowserExecutable("/path/to/chrome");

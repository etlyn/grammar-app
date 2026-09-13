// Additive catalog: preserve the published v1 lessons and question records exactly.
import {
  buildTopics as buildFoundations,
  sources as foundationSources,
  VERSION as FOUNDATION_VERSION,
} from "./foundations.mjs";
import {
  buildExtension,
  sources as extensionSources,
  VERSION,
} from "./extension/index.mjs";
export { VERSION };
export { sha, normalize } from "./foundations.mjs";
export const PROGRESS_VERSION = FOUNDATION_VERSION;
export const sources = [...foundationSources, ...extensionSources];
export const buildTopics = () => [...buildFoundations(), ...buildExtension()];

import {
  buildTopics as buildFoundations,
  sources as foundationSources,
  VERSION as FOUNDATION_VERSION,
} from "./foundations.mjs";
import {
  buildExtension,
  sources as extensionSources,
} from "./extension/index.mjs";
import {
  buildCore,
  enrichChapter,
  enrichTeaching,
  sequence,
} from "./core/index.mjs";
import { sources as coreSources, extraReferences } from "./core/sources.mjs";
import { expandReading, sources as scopeSources } from "./scope/index.mjs";
export { VERSION } from "./scope/index.mjs";
export { sha, normalize } from "./foundations.mjs";
export const PROGRESS_VERSION = FOUNDATION_VERSION;
export const sources = [
  ...foundationSources,
  ...extensionSources,
  ...coreSources,
  ...scopeSources,
];
export const buildTopics = () =>
  expandReading(
    sequence(
      [...buildFoundations(), ...buildExtension(), ...buildCore()].map((t) => {
        const references = extraReferences[t.slug];
        if (references)
          t = {
            ...t,
            provenance: {
              ...t.provenance,
              referenceIds: [...t.provenance.referenceIds, ...references],
            },
          };
        return enrichTeaching(enrichChapter(t));
      }),
    ),
  );

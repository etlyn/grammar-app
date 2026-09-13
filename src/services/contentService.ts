import snapshot from "../generated/catalog.json";
import type { GrammarTopic } from "../types/grammar";

// Immutable build snapshot: no client credentials, remote content or runtime AI.
export const catalogVersion = snapshot.version;
export const progressVersion = snapshot.progressVersion;
export const catalogHash = snapshot.contentHash;
export const contentSources = snapshot.sources;
export const grammarCatalog = snapshot.topics as GrammarTopic[];
export const loadGrammarCatalog = async (): Promise<GrammarTopic[]> =>
  grammarCatalog;

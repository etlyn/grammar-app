import rawSnapshot from "../generated/catalog.json?raw";
import type { GrammarTopic } from "../types/grammar";

type SourceReference = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  use: string;
  license?: string;
};
const snapshot = JSON.parse(rawSnapshot) as {
  version: string;
  progressVersion: string;
  contentHash: string;
  sources: SourceReference[];
  topics: GrammarTopic[];
};

// Immutable build snapshot: no client credentials, remote content or runtime AI.
export const catalogVersion = snapshot.version;
export const progressVersion = snapshot.progressVersion;
export const catalogHash = snapshot.contentHash;
export const contentSources = snapshot.sources;
export const grammarCatalog = snapshot.topics as GrammarTopic[];
export const loadGrammarCatalog = async (): Promise<GrammarTopic[]> =>
  grammarCatalog;

import rawSnapshot from "../generated/catalog.json?raw";
import rawSpanishSnapshot from "../generated/catalog-es.json?raw";
import type { GrammarTopic, GrammarMap } from "../types/grammar";
import type { CourseId } from "../utils/accountProgress";
import {
  isCourseId,
  resolveInitialCourseId,
  hasExistingEnglishLearning as existingEnglish,
} from "../utils/courseSelection";
export type { CourseId } from "../utils/accountProgress";
export { COURSE_STORAGE_KEY, isCourseId } from "../utils/courseSelection";

type SourceReference = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  use: string;
  license?: string;
};
type Snapshot = {
  version: string;
  progressVersion: string;
  contentHash: string;
  sources: SourceReference[];
  topics: GrammarTopic[];
  grammarMap: GrammarMap;
  reviewStatus?: string;
  instructionLanguage?: string;
};
const snapshot = JSON.parse(rawSnapshot) as Snapshot;
const spanishSnapshot = JSON.parse(rawSpanishSnapshot) as Snapshot;

const createCourse = (
  id: CourseId,
  name: string,
  languageName: string,
  data: Snapshot,
) => ({
  id,
  name,
  languageName,
  code: id.toUpperCase(),
  catalogVersion: data.version,
  progressVersion: data.progressVersion,
  contentHash: data.contentHash,
  contentSources: data.sources,
  grammarMap: data.grammarMap,
  topics: data.topics,
  questionCount: data.topics.reduce(
    (total, topic) => total + topic.quizItems.length,
    0,
  ),
  stageNames: [...new Set(data.topics.map((topic) => topic.stage ?? ""))],
  reviewStatus: data.reviewStatus ?? "Independent educator review pending.",
  instructionLanguage: data.instructionLanguage ?? "en",
});
export const courses = {
  en: createCourse("en", "English", "English", snapshot),
  es: createCourse("es", "Español", "Spanish", spanishSnapshot),
};
export type CourseCatalog = ReturnType<typeof createCourse>;
export const courseList = [courses.en, courses.es];
export const resolveCourse = (value: unknown): CourseCatalog =>
  courses[isCourseId(value) ? value : "es"];

/** New browsers start with Spanish; upgrades retain their English workspace. */
export function initialCourseId(
  storage?: Pick<Storage, "getItem" | "key" | "length">,
): CourseId {
  return resolveInitialCourseId(snapshot.progressVersion, storage);
}
export const hasExistingEnglishLearning = (
  storage?: Pick<Storage, "getItem" | "key" | "length">,
) => existingEnglish(snapshot.progressVersion, storage);

// Immutable build snapshot: no client credentials, remote content or runtime AI.
export const grammarMap = snapshot.grammarMap;
export const catalogVersion = snapshot.version;
export const progressVersion = snapshot.progressVersion;
export const catalogHash = snapshot.contentHash;
export const contentSources = snapshot.sources;
export const grammarCatalog = snapshot.topics as GrammarTopic[];
export const loadGrammarCatalog = async (): Promise<GrammarTopic[]> =>
  grammarCatalog;

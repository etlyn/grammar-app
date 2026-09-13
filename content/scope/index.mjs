import { sections as structure } from "./structure.mjs";
import { sections as nouns } from "./nouns.mjs";
import { sections as verbs } from "./verbs.mjs";
import { sections as meaning } from "./meaning.mjs";
import { sections as complex } from "./complex.mjs";
import { sections as usage } from "./usage.mjs";
import { domains, topicDomains, VERSION } from "./domains.mjs";
export { domains, VERSION, sources } from "./domains.mjs";
export const additions = [
  ...structure,
  ...nouns,
  ...verbs,
  ...meaning,
  ...complex,
  ...usage,
];
// Stable section identifiers are independent of display order. Original question
// payloads and original teaching-source versions remain untouched.
export function expandReading(topics) {
  const known = new Set(topics.map((t) => t.slug));
  const domainIds = new Set(domains.map((d) => d.id));
  const ids = new Set();
  for (const section of additions) {
    if (
      !known.has(section.topicSlug) ||
      !domainIds.has(section.domain) ||
      ids.has(section.id)
    )
      throw Error("Invalid scope section " + section.id);
    ids.add(section.id);
  }
  return topics.map((t) => {
    if (!topicDomains[t.slug]) throw Error("Unmapped chapter " + t.slug);
    const base = t.chapter.rules.map((r, i) => ({
      ...r,
      id: `${t.slug}-foundation-${i + 1}`,
      domain: topicDomains[t.slug],
      referenceIds: t.provenance.referenceIds,
      readingVersion: t.provenance.version,
    }));
    const extra = additions
      .filter((s) => s.topicSlug === t.slug)
      .map(({ topicSlug, ...r }) => ({ ...r, readingVersion: VERSION }));
    return {
      ...t,
      chapter: {
        ...t.chapter,
        readingVersion: VERSION,
        rules: [...base, ...extra],
      },
      readingReferenceIds: [
        ...new Set([
          ...t.provenance.referenceIds,
          ...extra.flatMap((r) => r.referenceIds),
        ]),
      ],
    };
  });
}
export function makeGrammarMap(topics) {
  return {
    title: "The English grammar map",
    scope:
      "Contemporary standard English: spoken and written grammar, with common regional and register differences.",
    description:
      "Explore the whole subject, then follow the chapters in learning order. Every section opens a reading with rules, examples and important qualifications. The existing 200-question chapter banks provide practice alongside this wider reading syllabus.",
    referenceIds: [
      "cambridge-comprehensive-scope",
      "dfe-grammar",
      "english-profile",
    ],
    domains: domains.map((d) => ({
      ...d,
      concepts: topics.flatMap((t) =>
        t.chapter.rules
          .filter((r) => r.domain === d.id)
          .map((r) => ({
            id: r.id,
            title: r.title,
            topicSlug: t.slug,
            topicTitle: t.title,
            order: t.order,
            stage: t.stage,
            referenceIds: r.referenceIds,
          })),
      ),
    })),
  };
}

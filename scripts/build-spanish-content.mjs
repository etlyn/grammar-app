import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { buildCatalog, validateCatalog } from "../content/spanish/catalog.mjs";

const catalog = buildCatalog();
const counts = validateCatalog(catalog);
if (counts.topics !== 30)
  throw new Error("The initial Spanish release must have 30 chapters.");
const coverage = {
  version: catalog.version,
  progressVersion: catalog.progressVersion,
  contentHash: catalog.contentHash,
  language: catalog.language,
  reviewStatus: catalog.reviewStatus,
  totalQuestions: counts.questions,
  totalReadingSections: counts.sections,
  topics: catalog.topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    order: topic.order,
    stage: topic.stage,
    level: topic.level,
    prerequisites: topic.prerequisites,
    referenceIds: topic.readingReferenceIds,
    readingSections: topic.chapter.rules.map((rule) => ({
      id: rule.id,
      title: rule.title,
    })),
    skills: Object.fromEntries(
      [...new Set(topic.quizItems.map((question) => question.skill))].map(
        (skill) => [
          skill,
          topic.quizItems.filter((question) => question.skill === skill).length,
        ],
      ),
    ),
    questions: topic.quizItems.map((question) => ({
      id: question.id,
      contextKey: question.contextKey,
      skill: question.skill,
      fingerprint: question.fingerprint,
    })),
  })),
};
const index = `# Spanish course coverage\n\nVersion: ${catalog.version}\n\n${catalog.grammarMap.scope}\n\n${counts.topics} chapters · ${counts.sections} reading sections · ${counts.questions} original exercises · six stages · ten map areas. Each chapter has four skills and 24 exercises, six per skill. A session draws 20 without replacement.\n\nContent SHA-256: ${catalog.contentHash}\n\nAll explanations, examples and exercises are original and authored offline with AI assistance. References inform scope or grammar guidance; no publisher exercises are reproduced or adapted. Independent educator/native-speaker review is pending. Levels are approximate teaching labels; this grammar course does not cover all CEFR communication skills or certify a level.\n\n| Chapter | Stage | Level | Title | Questions |\n| --- | --- | --- | --- | ---: |\n${catalog.topics.map((topic) => `| ${topic.order} | ${topic.stage} | ${topic.level} | ${topic.title} | ${topic.quizItems.length} |`).join("\n")}\n\n## Reading index\n\n${catalog.topics.map((topic) => `### ${topic.order}. ${topic.title}\n\n${topic.chapter.rules.map((rule) => `- ${rule.title} — ${rule.id}`).join("\n")}`).join("\n\n")}\n\n## Reference use\n\n${catalog.sources.map((source) => `- [${source.publisher}: ${source.title}](${source.url}) — ${source.use}${source.accessNote ? ` ${source.accessNote}` : ""}`).join("\n")}\n\n## Review and refresh\n\nRead [the authoring policy](README.md), [coverage.json](coverage.json) and the complete [exercise review export](review.tsv) before expanding this release. Preserve existing semantic keys and question IDs. Review every correct answer, distractor, context, gloss and regional qualification with an educator. Structural checks do not establish linguistic accuracy.\n`;
const cell = (value) =>
  String(value).replaceAll("\t", " ").replaceAll("\n", " ");
const review =
  [
    [
      "chapter",
      "question_id",
      "context_key",
      "skill",
      "prompt",
      "A",
      "B",
      "C",
      "D",
      "answer",
      "hint",
      "explanation",
      "reason_A",
      "reason_B",
      "reason_C",
      "reason_D",
    ].join("\t"),
    ...catalog.topics.flatMap((topic) =>
      topic.quizItems.map((question) =>
        [
          topic.title,
          question.id,
          question.contextKey,
          question.skill,
          question.prompt,
          ...question.choices.map((choice) => choice.text),
          question.answerId,
          question.hint,
          question.explanation,
          ...question.choices.map(
            (choice) => question.teaching.choiceReasons[choice.id],
          ),
        ]
          .map(cell)
          .join("\t"),
      ),
    ),
  ].join("\n") + "\n";
const outputs = {
  "src/generated/catalog-es.json": JSON.stringify(catalog) + "\n",
  "content/spanish/coverage.json": JSON.stringify(coverage, null, 2) + "\n",
  "content/spanish/INDEX.md": index,
  "content/spanish/review.tsv": review,
};
for (const [name, value] of Object.entries(outputs)) {
  const target = fileURLToPath(new URL(`../${name}`, import.meta.url));
  if (process.argv.includes("--check")) {
    if ((await readFile(target, "utf8")) !== value)
      throw new Error(`${name} is stale; run yarn content:spanish`);
  } else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, value);
  }
}
console.log(
  `Spanish validated: ${counts.topics} chapters, ${counts.sections} sections, ${counts.questions} questions; ${catalog.contentHash}`,
);

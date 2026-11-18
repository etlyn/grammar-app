import { createHash } from "node:crypto";
import { chapters as firstHalf } from "./part-1.mjs";
import { chapters as secondHalf } from "./part-2.mjs";

export const VERSION = "spanish-2026-11-v1";
export const PROGRESS_VERSION = VERSION;
export const normalize = (value) =>
  value.normalize("NFC").trim().toLocaleLowerCase("es").replace(/\s+/g, " ");
export const sha = (value) => createHash("sha256").update(value).digest("hex");
const stableId = (value) => {
  const hash = sha(value);
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
};

export const sources = [
  {
    id: "cervantes-a1-a2",
    publisher: "Instituto Cervantes",
    title: "Plan curricular: Grammar inventory A1–A2",
    url: "https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/02_gramatica_inventario_a1-a2.htm",
    use: "Scope crosswalk only. The inventory is a reference for topic families, not approval of this sequence or item-level CEFR calibration. Original explanations and exercises; no publisher exercises reproduced.",
    accessNote:
      "Indexed inventory checked 2026-11-17; full inventory temporarily redirects to maintenance.",
  },
  {
    id: "cervantes-b1-b2",
    publisher: "Instituto Cervantes",
    title: "Plan curricular: Grammar inventory B1–B2",
    url: "https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/02_gramatica_inventario_b1-b2.htm",
    use: "Scope crosswalk only. Original explanations and exercises, not an official DELE preparation bank or a complete B2 course.",
    accessNote:
      "Indexed inventory checked 2026-11-17; full inventory temporarily redirects to maintenance.",
  },
  {
    id: "cervantes-orthography",
    publisher: "Instituto Cervantes",
    title: "Plan curricular: Orthography inventory A1–A2",
    url: "https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/04_ortografia_inventario_a1-a2.htm",
    use: "Writing-system scope reference only; original examples. No pronunciation recordings or publisher material copied.",
  },
  {
    id: "rae-dpd",
    publisher: "Real Academia Española and ASALE",
    title: "Diccionario panhispánico de dudas",
    url: "https://www.rae.es/dpd/",
    use: "Grammar, spelling and regional-usage guidance only. Original learner explanations, examples and practice; no dictionary entries or question banks reproduced.",
  },
  {
    id: "rae-tilde",
    publisher: "Real Academia Española and ASALE",
    title: "Diccionario panhispánico de dudas: tilde",
    url: "https://www.rae.es/dpd/tilde",
    use: "Stress, written accents, hiatus and diacritic guidance only; original wording and examples.",
  },
  {
    id: "rae-clitics",
    publisher: "Real Academia Española",
    title: "Personal unstressed pronouns: placement with verbs",
    url: "https://www.rae.es/dpd/pronombres%20personales%20%C3%A1tonos",
    use: "Clitic agreement, placement and regional qualification guidance only; original exercises.",
  },
  {
    id: "rae-se",
    publisher: "Real Academia Española",
    title: "Se: impersonal and reflexive passive constructions",
    url: "https://www.rae.es/espanol-al-dia/se-venden-casas-se-buscan-actores-frente-se-busca-los-culpables",
    use: "Impersonal/passive agreement guidance only; original explanations and tasks.",
  },
  {
    id: "rae-preterite",
    publisher: "Real Academia Española",
    title: "Glosario de términos gramaticales: pretérito perfecto simple",
    url: "https://www.rae.es/gtg/pret%C3%A9rito-perfecto-simple",
    use: "Past-tense aspect and regional-usage guidance only; original learner material.",
  },
  {
    id: "rae-imperfect",
    publisher: "Real Academia Española",
    title:
      "Glosario de términos gramaticales: pretérito imperfecto de indicativo",
    url: "https://www.rae.es/gtg/pret%C3%A9rito-imperfecto-de-indicativo",
    use: "Past background and habitual-aspect guidance only; original learner material.",
  },
  {
    id: "rae-perfect",
    publisher: "Real Academia Española",
    title:
      "Glosario de términos gramaticales: pretérito perfecto compuesto de indicativo",
    url: "https://www.rae.es/gtg/pret%C3%A9rito-perfecto-compuesto-de-indicativo",
    use: "Compound perfect and regional distribution guidance only; original learner material.",
  },
  {
    id: "rae-pluperfect",
    publisher: "Real Academia Española",
    title:
      "Glosario de términos gramaticales: pretérito pluscuamperfecto de indicativo",
    url: "https://www.rae.es/gtg/pret%C3%A9rito-pluscuamperfecto-de-indicativo",
    use: "Earlier-past reference guidance only; original learner material.",
  },
  {
    id: "rae-conditional",
    publisher: "Real Academia Española",
    title: "Glosario de términos gramaticales: condicional simple",
    url: "https://www.rae.es/gtg/condicional-simple",
    use: "Conditional form and meaning guidance only; original learner material.",
  },
];

const provenance = (referenceIds) => ({
  authorship:
    "Original, authored offline with AI assistance; no publisher exercises reproduced.",
  reviewStatus:
    "Independent educator and native-speaker editorial review pending.",
  referenceIds,
});

export function buildCatalog(authored = [...firstHalf, ...secondHalf]) {
  const topics = authored.map((chapter, index) => {
    const referenceIds = chapter.referenceIds ?? [
      index < 10 ? "cervantes-a1-a2" : "cervantes-b1-b2",
      "rae-dpd",
    ];
    const rules = chapter.rules.map((rule) => ({
      ...rule,
      id: `${chapter.slug}:${rule.key}`,
      referenceIds: rule.referenceIds ?? referenceIds,
    }));
    const quizItems = chapter.questions.map((question) => {
      const id = stableId(`grammacho:es:${chapter.slug}:${question.key}`);
      const entries = [
        { text: question.correct, reason: question.explanation, correct: true },
        ...question.distractors.map(([text, reason]) => ({
          text,
          reason,
          correct: false,
        })),
      ];
      const rotation =
        Number.parseInt(
          sha(`${chapter.slug}:${question.key}`).slice(0, 2),
          16,
        ) % 4;
      const rotated = [
        ...entries.slice(rotation),
        ...entries.slice(0, rotation),
      ];
      const choices = rotated.map((choice, i) => ({
        id: "ABCD"[i],
        text: choice.text,
      }));
      return {
        id,
        prompt: question.prompt,
        choices,
        answerId: "ABCD"[rotated.findIndex((choice) => choice.correct)],
        hint: question.hint,
        explanation: question.explanation,
        skill: question.skill,
        contextKey: `${chapter.slug}:${question.key}`,
        fingerprint: sha(
          `${normalize(question.prompt)}|${normalize(question.correct)}`,
        ),
        teaching: {
          steps: [
            question.hint,
            `The answer is “${question.correct}”.`,
            question.explanation,
          ],
          choiceReasons: Object.fromEntries(
            rotated.map((choice, i) => ["ABCD"[i], choice.reason]),
          ),
        },
        provenance: provenance(referenceIds),
      };
    });
    return {
      slug: chapter.slug,
      title: chapter.title,
      level: chapter.level,
      order: index + 1,
      stage: chapter.stage,
      summary: chapter.summary,
      guidance: chapter.guidance,
      learningGoals: chapter.learningGoals,
      prerequisites: index ? [authored[index - 1].slug] : [],
      rules,
      chapter: {
        introduction: chapter.introduction,
        rules,
        recap: chapter.rules.map((rule) => rule.explanation),
      },
      readingReferenceIds: referenceIds,
      provenance: provenance(referenceIds),
      quizItems,
    };
  });
  const areas = [
    [
      "writing",
      "Writing and accents",
      "Letters, stress and meaningful written accents.",
      [0],
    ],
    [
      "noun-phrases",
      "Nouns and their companions",
      "Gender, number, articles, adjectives, possession and quantity.",
      [1, 2, 7, 18],
    ],
    [
      "basic-clauses",
      "Building everyday sentences",
      "Subjects, descriptions, existence, questions, negation and routines.",
      [3, 4, 8, 9],
    ],
    [
      "present",
      "Present-time verbs",
      "Regular, irregular and stem-changing present forms.",
      [5, 6],
    ],
    [
      "past",
      "Past time and experience",
      "Completed events, background, experience and earlier past.",
      [10, 11, 12, 13],
    ],
    [
      "future",
      "Future and conditional",
      "Plans, predictions and conditional forms.",
      [14],
    ],
    [
      "clitics",
      "Object pronouns",
      "Direct and indirect objects, combinations and placement.",
      [15, 16],
    ],
    [
      "connections",
      "Prepositions and verb patterns",
      "Relationships, infinitives, gerunds and verbal constructions.",
      [17, 19],
    ],
    [
      "mood",
      "Mood, commands and conditions",
      "Subjunctive forms, intentions, time clauses and hypotheses.",
      [20, 21, 22, 23, 24, 25],
    ],
    [
      "discourse",
      "Connected language",
      "Relatives, passive and impersonal clauses, reporting and cohesion.",
      [26, 27, 28, 29],
    ],
  ];
  const grammarMap = {
    title: "The Spanish grammar map",
    scope:
      "An initial Spanish grammar course with English explanations and original Spanish examples and practice. Approximate A1–B2 teaching labels are not a complete CEFR syllabus or a calibrated assessment. General shared usage is taught with explicit regional and register qualifications. Educator review is pending.",
    referenceIds: sources.map((source) => source.id),
    domains: areas.map(([id, title, summary, indexes]) => ({
      id: `es-${id}`,
      title,
      summary,
      concepts: indexes.flatMap((index) =>
        (topics[index]?.chapter.rules ?? []).map((rule) => ({
          id: rule.id,
          title: rule.title,
          topicSlug: topics[index].slug,
          topicTitle: topics[index].title,
          order: topics[index].order,
          stage: topics[index].stage,
        })),
      ),
    })),
  };
  const payload = {
    version: VERSION,
    progressVersion: PROGRESS_VERSION,
    language: "es",
    instructionLanguage: "en",
    reviewStatus: provenance([]).reviewStatus,
    sources,
    topics,
    grammarMap,
  };
  return { ...payload, contentHash: sha(JSON.stringify(payload)) };
}

export function validateCatalog(catalog) {
  const fail = (message) => {
    throw new Error(`Spanish content: ${message}`);
  };
  const ids = new Set(),
    prompts = new Set(),
    fingerprints = new Set(),
    slugs = new Set(),
    sections = new Set();
  const sourceIds = new Set(catalog.sources.map((source) => source.id));
  const sectionOwners = new Map();
  const checkReferences = (references, label) => {
    if (!references?.length || references.some((id) => !sourceIds.has(id)))
      fail(`invalid references: ${label}`);
  };
  const text = (value, label) => {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /\b(?:undefined|NaN|TODO|TBD)\b/.test(value)
    )
      fail(`missing/placeholder text: ${label}`);
  };
  if (
    catalog.language !== "es" ||
    catalog.progressVersion === "foundations-2026-09-v1"
  )
    fail("invalid language/progress namespace");
  for (const topic of catalog.topics) {
    if (!/^es-[a-z0-9-]+$/.test(topic.slug) || slugs.has(topic.slug))
      fail(`duplicate/invalid topic ${topic.slug}`);
    slugs.add(topic.slug);
    for (const field of ["title", "summary", "guidance", "stage"])
      text(topic[field], `${topic.slug}/${field}`);
    if (!["A1", "A2", "B1", "B2"].includes(topic.level))
      fail(`invalid teaching label ${topic.slug}`);
    if (!topic.learningGoals?.length || !topic.chapter.introduction?.length)
      fail(`missing study guide ${topic.slug}`);
    [
      ...topic.learningGoals,
      ...topic.chapter.introduction,
      ...topic.chapter.recap,
    ].forEach((value) => text(value, topic.slug));
    if (topic.chapter.rules.length !== 4 || topic.quizItems.length !== 24)
      fail(`expected four sections and 24 exercises: ${topic.slug}`);
    checkReferences(topic.readingReferenceIds, topic.slug);
    for (const prerequisite of topic.prerequisites)
      if (!slugs.has(prerequisite) || prerequisite === topic.slug)
        fail(`invalid prerequisite ${topic.slug}`);
    for (const rule of topic.chapter.rules) {
      if (sections.has(rule.id)) fail(`duplicate section ${rule.id}`);
      sections.add(rule.id);
      sectionOwners.set(rule.id, topic.slug);
      for (const field of ["title", "explanation", "pattern"])
        text(rule[field], rule.id);
      if (rule.examples?.length < 2 || !rule.commonMistakes?.length)
        fail(`incomplete examples/qualification ${rule.id}`);
      rule.examples.forEach((example) => text(example, rule.id));
      rule.commonMistakes.forEach((mistake) => text(mistake, rule.id));
      checkReferences(rule.referenceIds, rule.id);
    }
    const skills = new Map();
    for (const question of topic.quizItems) {
      if (
        ids.has(question.id) ||
        prompts.has(normalize(question.prompt)) ||
        fingerprints.has(question.fingerprint)
      )
        fail(`duplicate exercise ${question.contextKey}`);
      ids.add(question.id);
      prompts.add(normalize(question.prompt));
      fingerprints.add(question.fingerprint);
      for (const field of [
        "id",
        "prompt",
        "hint",
        "explanation",
        "skill",
        "contextKey",
        "fingerprint",
      ])
        text(question[field], question.contextKey);
      if (
        question.choices.length !== 4 ||
        question.choices.map((choice) => choice.id).join("") !== "ABCD" ||
        new Set(question.choices.map((choice) => normalize(choice.text)))
          .size !== 4 ||
        !question.choices.some((choice) => choice.id === question.answerId)
      )
        fail(`invalid options ${question.contextKey}`);
      question.choices.forEach((choice) => {
        text(choice.text, question.contextKey);
        text(
          question.teaching?.choiceReasons?.[choice.id],
          question.contextKey,
        );
      });
      if (question.teaching?.steps?.length !== 3)
        fail(`missing teaching ${question.contextKey}`);
      question.teaching.steps.forEach((step) =>
        text(step, question.contextKey),
      );
      checkReferences(question.provenance?.referenceIds, question.contextKey);
      skills.set(question.skill, (skills.get(question.skill) ?? 0) + 1);
    }
    if (skills.size !== 4 || [...skills.values()].some((count) => count !== 6))
      fail(`expected four balanced skills: ${topic.slug}`);
  }
  const mapped = catalog.grammarMap.domains.flatMap((area) =>
    area.concepts.map((concept) => concept.id),
  );
  if (
    catalog.grammarMap.domains.some(
      (area) =>
        !area.concepts.length ||
        area.concepts.some(
          (concept) => sectionOwners.get(concept.id) !== concept.topicSlug,
        ),
    )
  )
    fail("map does not cover every reading section with its owning chapter");
  if (
    mapped.length !== sections.size ||
    new Set(mapped).size !== mapped.length ||
    mapped.some((id) => !sections.has(id))
  )
    fail("map does not cover every reading section exactly once");
  return { topics: slugs.size, questions: ids.size, sections: sections.size };
}

import { createHash } from "node:crypto";
import {
  verbs,
  beContexts,
  nouns,
  comparisons,
  timeMarkers,
} from "./contexts.mjs";
export const VERSION = "foundations-2026-09-v1";
export const AUTHORS = "Grammacho; generated offline with AI assistance";
const bc = (id, title, path) => ({
  id,
  title,
  publisher: "British Council",
  url: `https://learnenglish.britishcouncil.org/free-resources/grammar/${path}`,
  use: "Guidance reference only; exercises and wording are not reproduced",
  accessed: "2026-09-13",
});
export const sources = [
  bc("bc-be", "Present simple: to be", "a1-a2/present-simple-be"),
  bc("bc-present", "Present simple", "a1-a2/present-simple"),
  bc(
    "bc-continuous",
    "Present continuous",
    "english-grammar-reference/present-continuous",
  ),
  bc("bc-past", "Past simple", "english-grammar-reference/past-simple"),
  bc("bc-articles", "Articles: a, an, the", "a1-a2-grammar/articles-a-an-the"),
  bc(
    "bc-pronouns",
    "Personal pronouns",
    "english-grammar-reference/personal-pronouns",
  ),
  bc("bc-possessives", "Possessives", "english-grammar-reference/possessives"),
  bc(
    "bc-comparisons",
    "Comparative adjectives",
    "a1-a2/comparative-adjectives",
  ),
  {
    id: "bc-time",
    title: "Prepositions of time",
    publisher: "British Council",
    url: "https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/prepositions-time",
    use: "Guidance reference only; exercises and wording are not reproduced",
    accessed: "2026-09-13",
  },
  {
    id: "pcc-esol",
    title: "A Digital Workbook for Beginning ESOL",
    publisher: "Portland Community College",
    authors: "Eric Dodson, Davida Jordan, and Timothy Krause",
    url: "https://openoregon.pressbooks.pub/esol23/front-matter/introduction-2/",
    mirror: "https://opentextbc.ca/testing/",
    license: "CC BY 4.0 (except separately credited material)",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    use: "Course structure and task-format reference only; no H5P items or third-party videos copied",
    accessed: "2026-09-13",
  },
];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const optionIds = ["A", "B", "C", "D"];
export const normalize = (s) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
export const sha = (s) => createHash("sha256").update(s).digest("hex");
const rules = (rows) =>
  rows.map(([title, explanation, examples]) => ({
    title,
    explanation,
    examples,
  }));
const definitions = [
  [
    "present-simple-be",
    "Present simple: be",
    "A1",
    "bc-be",
    "Match am, is and are to the subject, then build statements, negatives and questions.",
    [
      [
        "Present forms",
        "Use am with I, is with a singular subject, and are with you or a plural subject. Be describes identity, location or a state.",
        ["I am near the exit.", "The keys are on a hook."],
      ],
      [
        "Negatives and questions",
        "Place not after be. For a standard yes/no question, put be before the subject. Do not add do or does.",
        ["The door is not locked.", "Are the seats free?"],
      ],
      [
        "Contractions",
        "In everyday English, I am becomes I’m and they are becomes they’re. Full forms remain correct. In positive short answers, keep the full verb.",
        ["Yes, we are.", "No, it is not."],
      ],
    ],
  ],
  [
    "present-simple",
    "Present simple",
    "A1",
    "bc-present",
    "Talk about regular activities and practise agreement, negatives, questions and base forms.",
    [
      [
        "Habits and facts",
        "Use the present simple for routines and general facts. With I, you, we and they, use the base verb. Most singular third-person subjects add -s.",
        ["We cycle to college.", "The guide explains the route."],
      ],
      [
        "Spelling",
        "Some verbs add -es. A consonant followed by y usually changes to -ies; a vowel followed by y keeps the y.",
        ["She carries the equipment.", "He plays chess."],
      ],
      [
        "Do and does",
        "Use do or does for questions, and do not or does not for negatives. The main verb then returns to its base form.",
        ["Does the driver stop here?", "We do not work on Sundays."],
      ],
    ],
  ],
  [
    "present-continuous",
    "Present continuous",
    "A1",
    "bc-continuous",
    "Describe actions happening now with the right form of be and an -ing form.",
    [
      [
        "Actions in progress",
        "Use am, is or are plus an -ing form for an activity in progress now. The form of be agrees with the subject.",
        ["The dog is sleeping by the fire.", "We are discussing the route."],
      ],
      [
        "Building the verb",
        "Many verbs add -ing. Usually remove a final silent e; some short verbs double their last consonant. Learn spelling with the verb.",
        ["write → writing", "cut → cutting"],
      ],
      [
        "Questions and negatives",
        "Move be before the subject in a question. Put not after be in a negative. Keep the -ing form in both.",
        ["Are they loading the van?", "I am not using the lift."],
      ],
    ],
  ],
  [
    "past-simple",
    "Past simple",
    "A2",
    "bc-past",
    "Use regular and irregular past forms and keep the base verb after did.",
    [
      [
        "Completed past events",
        "Use the past simple for events at a finished past time. Regular forms often end in -ed; irregular forms must be learned.",
        ["We booked a room last week.", "The visitor spoke to the guide."],
      ],
      [
        "Questions and negatives",
        "Did and did not carry the past tense. The main verb is the base form, even when its affirmative past is irregular.",
        ["Did the shop open early?", "They did not bring a camera."],
      ],
      [
        "Spelling and unchanged forms",
        "Some verbs change spelling; others keep the same written form. Read has the same spelling in the present and past but different pronunciation.",
        ["carry → carried", "put → put"],
      ],
    ],
  ],
  [
    "articles",
    "Articles: a, an and the",
    "A1",
    "bc-articles",
    "Choose an indefinite, definite or zero article using sound and context.",
    [
      [
        "One nonspecific item",
        "Use a or an before a singular countable noun that is not yet identified. Choose by the next sound: an before a vowel sound and a before a consonant sound.",
        ["a uniform", "an hourglass"],
      ],
      [
        "An identified item",
        "Use the when the listener can identify the item, including a second mention. The also works with identified plural nouns.",
        [
          "I found a ring. The ring was silver.",
          "Please return the borrowed books.",
        ],
      ],
      [
        "General plural nouns",
        "Usually omit the article before a plural noun when referring to its whole class. In these exercises, — means no article.",
        [
          "Bicycles need regular maintenance.",
          "The bicycles outside are ours.",
        ],
      ],
    ],
  ],
  [
    "pronouns-and-possessive-determiners",
    "Pronouns and possession",
    "A1",
    "bc-pronouns",
    "Distinguish subjects, objects, possessive determiners and possessive pronouns.",
    [
      [
        "Subject and object",
        "Use I, he, she, we or they as subjects. Use me, him, her, us or them as objects. You and it keep the same form.",
        ["She invited us.", "They spoke to me."],
      ],
      [
        "Before a noun",
        "Use my, your, his, her, its, our or their directly before a noun. These determiners identify the owner.",
        ["Our appointment is tomorrow.", "Her parcel has arrived."],
      ],
      [
        "Replacing a noun phrase",
        "Mine, yours, his, hers, ours and theirs stand on their own. Do not add an apostrophe. His works both before a noun and on its own.",
        ["This seat is yours.", "Those gloves are theirs."],
      ],
    ],
  ],
  [
    "prepositions-of-time",
    "Prepositions of time",
    "A1",
    "bc-time",
    "Practise at, on, in and no preposition with unambiguous time expressions.",
    [
      [
        "At",
        "Use at with clock times and expressions such as noon, midnight and dawn.",
        ["The gates open at 8:15.", "We leave at sunrise."],
      ],
      [
        "On and in",
        "Use on with days and dates, including a named day plus a part of that day. Use in with months and with the morning, afternoon or evening.",
        ["on Thursday afternoon", "in November"],
      ],
      [
        "No preposition",
        "Usually omit a time preposition before next, last, this or every, and before today, tomorrow and yesterday. Here, — means leave the gap empty.",
        ["The rehearsal is next week.", "I will call tomorrow."],
      ],
    ],
  ],
  [
    "comparatives-and-superlatives",
    "Comparatives and superlatives",
    "A2",
    "bc-comparisons",
    "Compare two things, identify an extreme in a group, and express equality.",
    [
      [
        "Comparing two",
        "Many short adjectives add -er; longer adjectives often use more. Introduce the second item with than. Avoid adding more to an -er comparative.",
        [
          "This route is shorter than that one.",
          "The new seat is more comfortable.",
        ],
      ],
      [
        "Comparing a group",
        "Use the plus a superlative: often -est or most plus the adjective. Good becomes better/best; bad becomes worse/worst.",
        ["This is the safest path.", "That was the best result."],
      ],
      [
        "Equal degree",
        "Use as plus the base adjective plus as for equality. Spelling may change in comparative and superlative forms.",
        ["The two boxes are as heavy as each other.", "big → bigger → biggest"],
      ],
    ],
  ],
];

export function buildTopics() {
  const topics = definitions.map(
    ([slug, title, level, ref, summary, ruleRows], index) => ({
      slug,
      title,
      level,
      order: index + 1,
      summary,
      learningGoals: ruleRows.map((r) => r[0]),
      guidance:
        "Read the short rules and examples, then complete a 20-question session. Use feedback to explain each choice. Revisit the skill you missed before trying again.",
      rules: rules(ruleRows),
      tips: [
        "Read the full context before choosing.",
        "Check the explanation, including after a correct answer.",
        "A passing practice session is useful feedback, not a language certificate.",
      ],
      source: "seed",
      provenance: {
        version: VERSION,
        authorship: AUTHORS,
        kind: "original-guidance-aligned",
        reviewStatus: "automated-checked; educator-review-pending",
        referenceIds: [
          ref,
          ...(slug === "pronouns-and-possessive-determiners"
            ? ["bc-possessives"]
            : []),
          "pcc-esol",
        ],
        assessment:
          "Practice only; levels are approximate teaching labels, not validated CEFR assessment.",
      },
      quizItems: [],
    }),
  );
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  function add(slug, skill, contextKey, prompt, correct, wrong, explanation) {
    const topic = bySlug.get(slug);
    const distractors = [...new Set(wrong)]
      .filter((x) => normalize(x) !== normalize(correct))
      .slice(0, 3);
    if (distractors.length !== 3)
      throw new Error(`Need three distractors: ${slug} ${prompt}`);
    const key = `${slug}/${skill}/${contextKey}`;
    const hash = sha(key);
    const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
    const offset = parseInt(hash.slice(0, 2), 16) % 4;
    const texts = [correct, ...distractors];
    const choices = optionIds.map((id, i) => ({
      id,
      text: texts[(i - offset + 4) % 4],
    }));
    topic.quizItems.push({
      id,
      topicSlug: slug,
      level: topic.level,
      prompt,
      choices,
      answerId: optionIds[offset],
      hint: topic.rules[
        Math.min(
          topic.rules.length - 1,
          skill.includes("question") || skill.includes("negative") ? 1 : 0,
        )
      ].explanation,
      explanation,
      keywords: [],
      source: "seed",
      skill,
      contextKey,
      provenance: {
        kind: "original-guidance-aligned",
        referenceIds: topic.provenance.referenceIds,
        version: VERSION,
        reviewStatus: "automated-checked; educator-review-pending",
      },
      fingerprint: sha(normalize(prompt) + "|" + normalize(correct)),
    });
  }
  const subjects = [
    ["I", "am", false],
    ["you", "are", false],
    ["he", "is", true],
    ["she", "is", true],
    ["we", "are", false],
    ["they", "are", false],
    ["the gardener", "is", true],
    ["the volunteers", "are", false],
    ["our teacher", "is", true],
    ["my friends", "are", false],
  ];
  beContexts.forEach(([s, be, tail], i) => {
    const key = `be-${i + 1}`;
    add(
      "present-simple-be",
      "agreement",
      key,
      `${cap(s)} ____ ${tail}.`,
      be,
      ["am", "is", "are", "be"],
      `The subject “${s}” takes ${be} in the present: ${s} ${be} ${tail}.`,
    );
    add(
      "present-simple-be",
      "negative",
      key,
      `Complete the negative: ${cap(s)} ____ ${tail}.`,
      `${be} not`,
      ["am not", "is not", "are not", "do not be"],
      `Put not after the correct form of be: ${s} ${be} not ${tail}.`,
    );
    add(
      "present-simple-be",
      "question",
      key,
      `____ ${s} ${tail}?`,
      cap(be),
      ["Am", "Is", "Are", "Be"],
      `In a standard yes/no question, ${be} goes before “${s}”.`,
    );
    const incorrect = be === "is" ? "are" : "is";
    add(
      "present-simple-be",
      "correction",
      key,
      `Replace the incorrect verb: “${cap(s)} ${incorrect} ${tail}.”`,
      be,
      ["am", "is", "are", "be"],
      `Replace ${incorrect} with ${be}, which agrees with “${s}”.`,
    );
  });
  verbs.forEach(([base, third, past, ing, tail], i) => {
    const [s, be, singular] = subjects[i % subjects.length];
    const present = singular ? third : base;
    const aux = singular ? "does" : "do";
    const key = `verb-${base}`;
    add(
      "present-simple",
      "affirmative",
      key,
      `Every week, ${s} ____ ${tail}. Use the present simple.`,
      present,
      [base, third, past, ing, `to ${base}`, `is ${base}`],
      `For the routine described, “${s}” takes ${present}. ${singular ? "A third-person singular subject needs the -s/-es form." : "Use the base form with this subject."}`,
    );
    add(
      "present-simple",
      "negative",
      key,
      `Complete the present-simple negative: ${cap(s)} ____ ${base} ${tail}.`,
      `${aux} not`,
      ["do not", "does not", "did not", "is not"],
      `Use ${aux} not with “${s}”, followed by the base form ${base}.`,
    );
    add(
      "present-simple",
      "question",
      key,
      `____ ${s} ${base} ${tail} every week? Use the present simple.`,
      cap(aux),
      ["Do", "Does", "Did", "Is"],
      `A present-simple question with “${s}” starts with ${aux}.`,
    );
    add(
      "present-simple",
      "base-after-auxiliary",
      key,
      `${cap(aux)} ${s} ____ ${tail} regularly? (${base})`,
      base,
      [third, ing, `to ${base}`, `is ${base}`],
      `After ${aux}, use the base form ${base}; the auxiliary carries the agreement.`,
    );
    add(
      "present-continuous",
      "affirmative",
      key,
      `Right now, ${s} ____ ${tail}. Use the present continuous.`,
      `${be} ${ing}`,
      [`am ${ing}`, `is ${ing}`, `are ${ing}`, `${be} ${base}`],
      `The present continuous needs ${be} plus ${ing} with “${s}”.`,
    );
    add(
      "present-continuous",
      "negative",
      key,
      `Complete the present-continuous negative: ${cap(s)} ____ ${tail} right now.`,
      `${be} not ${ing}`,
      [`am not ${ing}`, `is not ${ing}`, `are not ${ing}`, `do not ${ing}`],
      `Keep the -ing form and put not after ${be}: ${s} ${be} not ${ing}.`,
    );
    add(
      "present-continuous",
      "question",
      key,
      `____ ${s} ${ing} ${tail} right now?`,
      cap(be),
      ["Am", "Is", "Are", "Does"],
      `Move ${be} before “${s}” to make this present-continuous question.`,
    );
    add(
      "present-continuous",
      "ing-form",
      key,
      `${cap(s)} ${be} ____ ${tail} at the moment. (${base})`,
      ing,
      [base, third, past, `to ${base}`, `${base}ed`],
      `After ${be} in the present continuous, use the -ing form ${ing}.`,
    );
    add(
      "past-simple",
      "affirmative",
      key,
      `Yesterday, ${s} ____ ${tail}. Use the past simple.`,
      past,
      [base, third, ing, `to ${base}`, `did ${past}`],
      `The past-simple form of ${base} is ${past}. The sentence describes a completed event yesterday.`,
    );
    add(
      "past-simple",
      "negative",
      key,
      `Complete the past-simple negative: ${cap(s)} ____ ${base} ${tail} yesterday.`,
      `did not`,
      ["does not", "do not", "is not"],
      `Use did not plus ${base} for a past-simple negative, regardless of the subject.`,
    );
    add(
      "past-simple",
      "question",
      key,
      `____ ${s} ${base} ${tail} yesterday? Use the past simple.`,
      `Did`,
      ["Do", "Does", "Was"],
      `Use did before “${s}” and keep ${base} in the base form.`,
    );
    add(
      "past-simple",
      "base-after-did",
      key,
      `Did ${s} ____ ${tail} last week? (${base})`,
      base,
      [third, ing, `to ${base}`, `did ${base}`],
      `After did, use ${base}. Do not put the main verb into a past or -ing form.`,
    );
  });
  nouns.forEach(([noun, plural, article], i) => {
    const key = `noun-${noun.replaceAll(" ", "-")}`;
    const options = ["a", "an", "the", "—"];
    add(
      "articles",
      "indefinite-sound",
      key,
      `First mention, no particular item: I would like ____ ${noun}.`,
      article,
      options,
      `Use ${article} for one nonspecific ${noun}. The first sound of “${noun}” is ${article === "an" ? "a vowel" : "a consonant"} sound.`,
    );
    add(
      "articles",
      "second-mention",
      key,
      `I found ${article} ${noun}. ____ ${noun} I found belongs to my neighbour.`,
      `The`,
      options.map(cap),
      `The second mention identifies the same ${noun}, so use the.`,
    );
    add(
      "articles",
      "general-plural",
      key,
      `Talk about the whole category, not particular items: ____ ${plural} come in many varieties.`,
      `—`,
      options,
      `For ${plural} in general, use the plural noun without an article. — means no article.`,
    );
    add(
      "articles",
      "identified-plural",
      key,
      `We are discussing a particular set: please count ____ ${plural} in this photograph.`,
      `the`,
      options,
      `The phrase “in this photograph” identifies a specific set of ${plural}; use the.`,
    );
  });
  const owners = [
    ["I", "me", "my", "mine"],
    ["you", "you", "your", "yours"],
    ["he", "him", "his", "his"],
    ["she", "her", "her", "hers"],
    ["we", "us", "our", "ours"],
    ["they", "them", "their", "theirs"],
  ];
  nouns.forEach(([noun, , article], i) => {
    const [sub, obj, det, poss] = owners[i % owners.length];
    const key = `owner-${noun.replaceAll(" ", "-")}`;
    const subVerb = sub === "he" || sub === "she" ? "has" : "have";
    add(
      "pronouns-and-possessive-determiners",
      "subject",
      key,
      `Replace the object form with its subject form: “${obj}”. ____ ${subVerb} ${article} ${noun}.`,
      cap(sub),
      ["I", "You", "He", "She", "We", "They"].filter((x) => x !== cap(sub)),
      `The subject form paired with ${obj} is ${sub}. It performs the action of having the ${noun}.`,
    );
    add(
      "pronouns-and-possessive-determiners",
      "object",
      key,
      `Use the object form of “${sub}”: The assistant handed ____ ${article} ${noun}.`,
      obj,
      ["me", "you", "him", "her", "us", "them"].filter((x) => x !== obj),
      `After handed, use the object form ${obj}, not a possessive form.`,
    );
    add(
      "pronouns-and-possessive-determiners",
      "possessive-determiner",
      key,
      `The ${noun} belongs to ${obj}. Complete: This is ____ ${noun}.`,
      det,
      ["my", "your", "his", "her", "our", "their"].filter((x) => x !== det),
      `Use ${det} before the noun ${noun} to identify the owner.`,
    );
    add(
      "pronouns-and-possessive-determiners",
      "possessive-pronoun",
      key,
      `The ${noun} belongs to ${obj}. Complete without repeating the noun: The ${noun} is ____.`,
      poss,
      ["mine", "yours", "his", "hers", "ours", "theirs"].filter(
        (x) => x !== poss,
      ),
      `Use ${poss} on its own to replace the possessive noun phrase.`,
    );
  });
  timeMarkers.forEach(([prep, marker], i) => {
    const key = `time-${i + 1}`;
    const explain =
      prep === "—"
        ? `Do not add a preposition before ${marker}.`
        : `Use ${prep} before the time expression “${marker}”.`;
    // Four separately worded, concrete uses; not answer-order permutations.
    [
      "The training session starts",
      "The last bus leaves",
      "The library opens",
      "The delivery is due",
    ].forEach((start, j) => {
      add(
        "prepositions-of-time",
        prep === "—" ? "zero" : prep,
        key + `-${j + 1}`,
        `${start} ____ ${marker}.`,
        prep,
        ["at", "on", "in", "—"],
        explain,
      );
    });
  });
  comparisons.forEach(([adj, comp, sup, noun], i) => {
    const key = `adjective-${adj}`;
    add(
      "comparatives-and-superlatives",
      "comparative-form",
      key,
      `Compare two ${noun}: The first is ____ than the second. (${adj})`,
      comp,
      [adj, sup, `most ${adj}`, `more ${comp}`],
      `Use the comparative ${comp} when comparing these two ${noun}; than introduces the second.`,
    );
    add(
      "comparatives-and-superlatives",
      "superlative-form",
      key,
      `Compare all the ${noun} in a group: The first is the ____. (${adj})`,
      sup,
      [adj, comp, `more ${comp}`, `most ${sup}`],
      `Use the superlative ${sup} after the to identify the extreme in the group.`,
    );
    add(
      "comparatives-and-superlatives",
      "equality",
      key,
      `These two ${noun} have the same quality: The first is as ____ as the second. (${adj})`,
      adj,
      [comp, sup, `more ${comp}`, `most ${sup}`],
      `The as ... as pattern uses the base adjective ${adj}, not a comparative or superlative.`,
    );
    add(
      "comparatives-and-superlatives",
      "than",
      key,
      `The first of these two ${noun} is ${comp} ____ the second.`,
      `than`,
      ["then", "as", "that"],
      `After the comparative ${comp}, use than to introduce the item being compared.`,
    );
  });
  return topics;
}

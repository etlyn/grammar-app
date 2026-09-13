import {
  existence,
  possession,
  quantities,
  owners,
  places,
  ongoing,
  purposes,
  complements,
  emotions,
} from "./contexts.mjs";
import { AUTHORS, sha, normalize } from "../foundations.mjs";
export const VERSION = "foundations-2026-09-v2";
export const definitions = [
  [
    "there-is-there-are",
    "There is and there are",
    "A1",
    "using-there-there-are",
    "Describe what exists, ask about it, and give short answers.",
    [
      [
        "Existence and number",
        "Use there is before a singular or uncountable noun. Use there are before a plural noun. These exercises use standard written agreement.",
        [
          "There is a light above the gate.",
          "There are two seats near the exit.",
        ],
      ],
      [
        "Questions and negatives",
        "Put is or are before there to ask a question. Put not after the verb to make a negative.",
        ["Is there a bicycle stand?", "There are not any spare chairs."],
      ],
      [
        "Short answers",
        "Keep there and the matching verb in a short answer. In a positive answer, do not shorten there is to there’s.",
        ["Yes, there is.", "No, there are not."],
      ],
    ],
  ],
  [
    "have-got",
    "Have got",
    "A1",
    "present-simple-have-got",
    "Talk about possessions, characteristics and present arrangements with have got.",
    [
      [
        "Have or has",
        "Use have got with I, you, we and they; use has got with he, she, it or a singular noun.",
        ["I have got a warm coat.", "The cabin has got two bedrooms."],
      ],
      [
        "Negative and question forms",
        "Put not after have or has. In questions, move have or has before the subject and keep got after it.",
        ["We have not got a spare wheel.", "Has the flat got a balcony?"],
      ],
      [
        "Short answers and time",
        "Short answers keep have or has but leave out got. This possession pattern describes the present; use had for past possession.",
        ["Yes, it has.", "They had a garden before they moved."],
      ],
    ],
  ],
  [
    "countable-uncountable",
    "Countable and uncountable nouns",
    "A1",
    "nouns-countable-uncountable",
    "Choose quantity expressions and agreement from a noun’s meaning in context.",
    [
      [
        "Count the things or measure an amount",
        "Countable nouns name separate units and can be plural. Uncountable nouns name amounts or collections in the senses used here. Other senses may differ.",
        ["three baskets", "some equipment"],
      ],
      [
        "Asking about quantity",
        "Use how many before plural countable nouns and how much before uncountable nouns. Use plural agreement with the former and singular agreement with the latter.",
        ["How many baskets are ready?", "How much equipment is available?"],
      ],
      [
        "Some and individual units",
        "Some works with both plural countable and uncountable nouns. For an uncountable noun, add a unit phrase when counting individual quantities.",
        ["some luggage", "two pieces of luggage"],
      ],
    ],
  ],
  [
    "small-quantities",
    "Few, a few, little and a little",
    "A2",
    "../a1-a2-grammar/quantifiers-few-a-few-little-a-bit",
    "Distinguish a small useful amount from a shortage, with countable and uncountable nouns.",
    [
      [
        "A positive small amount",
        "A few goes with plural countable nouns. A little and a bit of go with uncountable nouns. These expressions can present the amount positively.",
        ["A few volunteers can help.", "We have a little energy left."],
      ],
      [
        "Emphasising a shortage",
        "Few with plural nouns and little or very little with uncountable nouns emphasise scarcity. The surrounding context tells us whether the quantity feels sufficient.",
        [
          "Few volunteers signed up; we need more.",
          "There is very little energy left.",
        ],
      ],
      [
        "Read the meaning as well as the noun",
        "A few and few have different emphasis despite both referring to small numbers. Do not treat all small quantities as shortages.",
        [
          "We have a few useful ideas.",
          "We have few useful ideas, unfortunately.",
        ],
      ],
    ],
  ],
  [
    "possessive-s",
    "Possessive ’s",
    "A1",
    "possessive-s",
    "Show ownership with singular nouns, regular plurals and irregular plurals.",
    [
      [
        "One owner",
        "Add apostrophe plus s to a singular owner noun in the forms practised here. The owner comes before the thing owned.",
        ["the explorer’s compass", "the rabbit’s hutch"],
      ],
      [
        "Plural owners",
        "For a regular plural already ending in s, add only an apostrophe. For an irregular plural without final s, add apostrophe plus s.",
        ["the explorers’ compasses", "the children’s drawings"],
      ],
      [
        "Read the whole phrase",
        "The owner phrase determines apostrophe placement. The owned object can itself be singular or plural. Names ending in s have additional conventions outside this bank.",
        ["one student’s notebooks", "several students’ classroom"],
      ],
    ],
  ],
  [
    "prepositions-of-place",
    "Prepositions of place",
    "A1",
    "prepositions-place",
    "Use in for containment, on for surfaces, and at for activity locations and points.",
    [
      [
        "Inside a space",
        "In locates something within a container, area, city or country. Read the stated physical relation carefully.",
        ["The tools are in a chest.", "The village is in a valley."],
      ],
      [
        "On a surface",
        "On describes contact with a surface, including vertical surfaces. It does not simply mean higher than something.",
        ["The chart is on the wall.", "The cloth is on the counter."],
      ],
      [
        "At a point or activity",
        "At often marks an exact point or an activity location. Expressions such as at home and at work are conventional. Some places allow different prepositions with different meanings; each question specifies its intended meaning.",
        ["Meet me at the entrance.", "She is at work."],
      ],
    ],
  ],
  [
    "past-continuous",
    "Past continuous and past simple",
    "A2",
    "past-continuous-past-simple",
    "Describe an activity in progress when another past event happened.",
    [
      [
        "A past activity in progress",
        "Use was or were plus an -ing form for a background activity already happening at a past moment. I, he, she and it take was; you, we and they take were.",
        ["I was sketching the view.", "They were preparing breakfast."],
      ],
      [
        "Negatives and questions",
        "Put not after was or were. Move was or were before the subject to ask a question. Keep the -ing form.",
        ["We were not skating.", "Was the dog barking?"],
      ],
      [
        "A background and an event",
        "The past continuous can show an activity that began before a past-simple event. The event happens during that activity; the sentence need not tell us when the activity ended.",
        [
          "I was sketching when the rain began.",
          "The rain began during the sketching.",
        ],
      ],
    ],
  ],
  [
    "infinitive-of-purpose",
    "Infinitive of purpose",
    "A2",
    "infinitive-purpose",
    "Explain the aim of an action with to and the base form of a verb.",
    [
      [
        "Answering why",
        "A to-infinitive can express an action’s purpose: the goal somebody intended. It answers a why question.",
        [
          "We stopped to admire the view.",
          "She called to confirm the address.",
        ],
      ],
      [
        "Keep the base form",
        "Use to followed by the base verb, without an -ing ending. The subject of the main action can vary; the purpose verb stays in its base form.",
        ["They met to discuss the budget.", "He met us to discuss the budget."],
      ],
      [
        "Link the action and its aim",
        "A short answer can begin with To. In a full sentence, place the purpose phrase after the main action. These tasks practise this to-infinitive pattern.",
        ["Why did you stop? To rest.", "We stopped to rest."],
      ],
    ],
  ],
  [
    "verb-patterns",
    "Verbs followed by -ing or to",
    "A2",
    "verbs-followed-ing-or-infinitive",
    "Choose the second verb’s form from the pattern required by the first verb.",
    [
      [
        "Verbs with -ing",
        "Enjoy, avoid, finish, practise and several other verbs take an -ing form when followed directly by another verb. Learn the pattern with the first verb.",
        ["We enjoy solving riddles.", "I avoid wasting paper."],
      ],
      [
        "Verbs with to",
        "Want, hope, plan, decide and several other verbs take to plus the base form when followed directly by another verb.",
        ["We hope to arrive early.", "I offered to wash up."],
      ],
      [
        "Preserve the pattern",
        "A question or negative does not change the complement pattern. Some verbs, including like and love, allow both forms and are excluded from single-answer contrasts here.",
        ["Do you enjoy solving riddles?", "I do not want to leave yet."],
      ],
    ],
  ],
  [
    "ed-ing-adjectives",
    "Adjectives ending in -ed and -ing",
    "A2",
    "adjectives-ending-ed-ing",
    "Distinguish an experienced feeling from something that causes that feeling.",
    [
      [
        "The experienced feeling",
        "In these adjective pairs, the -ed form describes how someone feels. Context identifies the experiencer.",
        ["The climbers felt exhausted.", "The children seemed delighted."],
      ],
      [
        "The cause of the feeling",
        "The -ing form describes what produces the feeling. A person can also cause a feeling, so do not use a people-versus-things shortcut.",
        [
          "The climb was exhausting.",
          "An entertaining storyteller can hold our attention.",
        ],
      ],
      [
        "Connect cause and effect",
        "Read who experiences the emotion and what causes it. The two forms belong to the same adjective family but have different roles.",
        [
          "A confusing instruction leaves a reader confused.",
          "An exciting event leaves spectators excited.",
        ],
      ],
    ],
  ],
];
export const sources = definitions.map(([slug, title, , ,]) => {
  const path = definitions.find((d) => d[0] === slug)[3];
  return {
    id: `bc-${slug}`,
    title,
    publisher: "British Council",
    url: new URL(
      `a1-a2/${path}`,
      "https://learnenglish.britishcouncil.org/free-resources/grammar/",
    ).href,
    use: "Guidance reference only; original contexts and exercises, no publisher question text reproduced",
    accessed: "2026-09-13",
  };
});
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export function buildExtension() {
  const topics = definitions.map(
    ([slug, title, level, , summary, ruleRows], index) => ({
      slug,
      title,
      level,
      order: index + 9,
      summary,
      learningGoals: ruleRows.map((r) => r[0]),
      guidance:
        "Read the rules and examples, then try a 20-question session. Explain why your chosen form fits the context and revisit any missed skill.",
      rules: ruleRows.map(([title, explanation, examples]) => ({
        title,
        explanation,
        examples,
      })),
      tips: [
        "Check both the meaning and the form before answering.",
        "Use the explanation to understand a mistake before moving on.",
        "A practice result is feedback, not an official language certificate.",
      ],
      source: "seed",
      provenance: {
        version: VERSION,
        authorship: AUTHORS,
        kind: "original-guidance-aligned",
        reviewStatus: "automated-checked; educator-review-pending",
        referenceIds: [`bc-${slug}`],
        assessment:
          "Practice only; approximate teaching labels, not validated CEFR assessment.",
      },
      quizItems: [],
    }),
  );
  const map = new Map(topics.map((t) => [t.slug, t]));
  function add(
    slug,
    skill,
    key,
    prompt,
    correct,
    wrong,
    explanation,
    ruleIndex = 0,
  ) {
    const topic = map.get(slug),
      hash = sha(`${slug}/${skill}/${key}`);
    const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
    const distractors = [...new Set(wrong)]
      .filter((w) => normalize(w) !== normalize(correct))
      .slice(0, 3);
    if (distractors.length !== 3)
      throw new Error(`Distractors: ${slug} ${prompt}`);
    const offset = parseInt(hash.slice(0, 2), 16) % 4,
      texts = [correct, ...distractors],
      ids = ["A", "B", "C", "D"];
    topic.quizItems.push({
      id,
      topicSlug: slug,
      level: topic.level,
      prompt,
      choices: ids.map((id, i) => ({ id, text: texts[(i - offset + 4) % 4] })),
      answerId: ids[offset],
      hint: topic.rules[ruleIndex].explanation,
      explanation,
      keywords: [],
      source: "seed",
      skill,
      contextKey: key,
      provenance: {
        kind: "original-guidance-aligned",
        referenceIds: topic.provenance.referenceIds,
        version: VERSION,
        reviewStatus: "automated-checked; educator-review-pending",
      },
      fingerprint: sha(normalize(prompt) + "|" + normalize(correct)),
    });
  }
  existence.forEach(([be, noun, place], i) => {
    const k = `existence-${i + 1}`,
      slug = "there-is-there-are",
      opposite = be === "is" ? "are" : "is";
    add(
      slug,
      "agreement",
      k,
      `There ____ ${noun} ${place}. Use standard present-tense agreement.`,
      be,
      [opposite, "be", "am"],
      `Use there ${be} with “${noun}”: There ${be} ${noun} ${place}.`,
    );
    add(
      slug,
      "negative",
      k,
      `Use the negative form of there ${be}: There ____ ${noun.replace(/^some /, "any ")} ${place}.`,
      `${be} not`,
      [`${opposite} not`, "do not", "not be"],
      `Place not after ${be}; retain its agreement with “${noun}”.`,
      1,
    );
    add(
      slug,
      "question",
      k,
      `____ there ${noun} ${place}? Ask whether it exists now.`,
      cap(be),
      [cap(opposite), "Does", "Has"],
      `Put ${be} before there: ${cap(be)} there ${noun} ${place}?`,
      1,
    );
    add(
      slug,
      "short-answer",
      k,
      `“${cap(be)} there ${noun} ${place}?” Complete the positive short answer: “Yes, there ____.”`,
      be,
      [opposite, "has", "be"],
      `The short answer keeps there ${be}. A positive there is answer keeps the full verb.`,
      2,
    );
  });
  possession.forEach(([s, have, pronoun, object], i) => {
    const k = `possession-${i + 1}`,
      slug = "have-got",
      other = have === "has" ? "have" : "has";
    add(
      slug,
      "agreement",
      k,
      `${cap(s)} ____ got ${object}. Describe present possession or circumstances.`,
      have,
      [other, "is", "does"],
      `Use ${have} got with “${s}”: ${s} ${have} got ${object}.`,
    );
    add(
      slug,
      "negative",
      k,
      `Use have got in the negative: ${cap(s)} ____ got ${object}.`,
      `${have} not`,
      [`${other} not`, "does not", "is not"],
      `Put not after ${have}; do not introduce do or does into the have got pattern.`,
      1,
    );
    add(
      slug,
      "question",
      k,
      `____ ${s} got ${object}?`,
      cap(have),
      [cap(other), "Does", "Is"],
      `In this question, ${have} comes before “${s}”; got stays after it.`,
      1,
    );
    add(
      slug,
      "short-answer",
      k,
      `“${cap(have)} ${s} got ${object}?” Answer positively using “${pronoun}”: “Yes, ${pronoun} ____.”`,
      have,
      [other, "got", "is"],
      `Use ${pronoun} ${have} in the short answer and leave out got.`,
      2,
    );
  });
  quantities.forEach(([kind, noun, location, sense], i) => {
    const k = `quantity-${i + 1}`,
      count = kind === "C",
      be = count ? "are" : "is",
      slug = "countable-uncountable";
    add(
      slug,
      "countability",
      k,
      `For ${sense}, how is “${noun}” used?`,
      count ? "A plural countable noun" : "An uncountable noun",
      [
        "A plural countable noun",
        "An uncountable noun",
        "A singular countable noun",
        "An adjective",
      ],
      `${cap(noun)} ${be} used ${count ? "for separate countable units" : "as an uncountable amount or collection"} here. This classification applies to the stated sense.`,
    );
    add(
      slug,
      "quantity-question",
      k,
      `While ${sense}, ask about the quantity: How ____ ${noun} ${be} there?`,
      count ? "many" : "much",
      ["many", "much", "a", "an"],
      `Use how ${count ? "many with plural countable" : "much with uncountable"} ${noun}.`,
      1,
    );
    add(
      slug,
      "noun-agreement",
      k,
      `In the context of ${sense}, the ${noun} in ${location} ____ ready to be checked.`,
      be,
      ["is", "are", "am", "be"],
      `The ${count ? "plural countable" : "uncountable"} noun ${noun} takes ${be} in this sentence.`,
      1,
    );
    add(
      slug,
      "quantity-phrase",
      k,
      `Use “some” to refer to ${noun} in ${location}, in the sense of ${sense}. Choose the complete noun phrase.`,
      `some ${noun}`,
      [`some of ${noun}`, `some a ${noun}`, `a some ${noun}`],
      `Some goes directly before ${noun}. Some of needs an identified set, for example “some of the ${noun}”.`,
      2,
    );
    const qslug = "small-quantities",
      positive = count ? "a few" : "a little",
      scarce = count ? "few" : "very little";
    add(
      qslug,
      "positive-amount",
      k,
      `For ${sense}, present a small available quantity positively: “We have ____ ${noun} available.” Choose the small-quantity phrase.`,
      positive,
      count ? ["few", "a little", "very little"] : ["few", "a few", "many"],
      `${positive} presents a small quantity of ${noun} positively. ${count ? "Use a few with plural countable nouns." : "Use a little with uncountable nouns."}`,
    );
    add(
      qslug,
      "shortage",
      k,
      `For ${sense}, emphasise that the quantity is almost zero: “We have ____ ${noun}, unfortunately.”`,
      scarce,
      count
        ? ["a few", "a little", "very little"]
        : ["a little", "a few", "few"],
      `${scarce} emphasises scarcity with ${count ? "plural countable" : "uncountable"} ${noun}.`,
      1,
    );
    add(
      qslug,
      "meaning",
      k,
      `In a discussion about ${noun} in ${location}, “We have ${positive} ${noun}” presents the amount in which way?`,
      "As a small quantity with positive emphasis",
      [
        "As exactly zero",
        "As a very large quantity",
        "As a stated exact number",
      ],
      `${positive} means some, often with positive emphasis. It does not specify an exact number or amount.`,
      2,
    );
    const phrase = count ? `a few ${noun}` : `a bit of ${noun}`;
    add(
      qslug,
      "noun-fit",
      k,
      `For ${sense}, which phrase correctly uses a small-quantity expression with “${noun}”?`,
      phrase,
      count
        ? [`a bit of ${noun}`, `a little ${noun}`, `very little ${noun}`]
        : [`a few ${noun}`, `many ${noun}`, `several ${noun}`],
      `${count ? "A few goes with plural countable nouns" : "A bit of goes with uncountable nouns"}: ${phrase}.`,
    );
  });
  owners.forEach(([owner, poss, number, object], i) => {
    const k = `owner-${i + 1}`,
      slug = "possessive-s",
      bare = object.replace(/^the /, ""),
      regular = number.startsWith("several") && owner.endsWith("s"),
      plural = number.startsWith("several");
    const wrong = [
      owner,
      owner + "'",
      owner + "'s",
      owner + "s'",
      owner + "s",
    ].filter((v) => v !== poss);
    add(
      slug,
      "owner-marking",
      k,
      `The owner is ${number}. Show ownership in “____ ${bare}” using “${owner}”.`,
      poss,
      wrong,
      `${cap(owner)} becomes ${poss}. ${regular ? "The plural already ends in s, so add only an apostrophe." : plural ? "This irregular plural does not end in s; add apostrophe plus s." : "Add apostrophe plus s to this singular owner."}`,
      regular || plural ? 1 : 0,
    );
    add(
      slug,
      "phrase-order",
      k,
      `Express “${object} belonging to ${number}” with an apostrophe phrase beginning “${owner}”.`,
      `${poss} ${bare}`,
      [`${owner} ${bare}`, `${owner} ${bare}'s`, `${owner} of ${bare}`],
      `Put the marked owner before the owned object: ${poss} ${bare}.`,
    );
    add(
      slug,
      "owner-number",
      k,
      `In “${poss} ${bare}”, who is identified as the owner?`,
      number,
      [`the ${bare}`, "an unspecified place", "an unspecified time"],
      `The owner is ${number}; ${object} names what is owned.`,
      2,
    );
    const rule = regular
      ? "Add only an apostrophe to a plural ending in s"
      : plural
        ? "Add apostrophe plus s to an irregular plural without final s"
        : "Add apostrophe plus s to a singular owner";
    add(
      slug,
      "apostrophe-rule",
      k,
      `Which rule explains the spelling of “${poss}” in “${poss} ${bare}”?`,
      rule,
      [
        "Add only an apostrophe to a plural ending in s",
        "Add apostrophe plus s to an irregular plural without final s",
        "Add apostrophe plus s to a singular owner",
        "Remove the apostrophe to show possession",
      ],
      `${cap(owner)} refers to ${number}. ${rule}.`,
      plural ? 1 : 0,
    );
  });
  places.forEach(([prep, place, object, meaning], i) => {
    const k = `place-${i + 1}`,
      slug = "prepositions-of-place",
      rule = prep === "in" ? 0 : prep === "on" ? 1 : 2,
      options = ["in", "on", "at", "into"];
    add(
      slug,
      "location-preposition",
      k,
      `Locate ${object}, ${meaning}: ${cap(object)} is ____ ${place}.`,
      prep,
      options,
      `Use ${prep} ${place} for the stated relation: ${meaning}.`,
      rule,
    );
    add(
      slug,
      "location-phrase",
      k,
      `Give the static location of ${object}: ${meaning}. Choose the phrase.`,
      `${prep} ${place}`,
      options.map((p) => `${p} ${place}`),
      `The requested location is ${prep} ${place}. Into describes movement, not the static relation requested here.`,
      rule,
    );
    const description =
      prep === "in"
        ? "Within a space or container"
        : prep === "on"
          ? "In contact with a surface"
          : "At a conventional activity location or a point";
    add(
      slug,
      "spatial-meaning",
      k,
      `In “${object} ${prep} ${place}”, with the meaning “${meaning}”, what relation does ${prep} express?`,
      description,
      [
        "Within a space or container",
        "In contact with a surface",
        "At a conventional activity location or a point",
        "Movement into a space",
      ],
      `Here, ${prep} describes ${meaning}. The same place can take another preposition if its meaning changes.`,
      rule,
    );
    add(
      slug,
      "static-correction",
      k,
      `Replace “into” to state a static location: “${cap(object)} is into ${place}.” Intended meaning: ${meaning}.`,
      prep,
      options,
      `For the stated static meaning, replace into with ${prep}: ${object} is ${prep} ${place}.`,
      rule,
    );
  });
  ongoing.forEach(([s, was, base, ing, tail, event], i) => {
    const k = `background-${i + 1}`,
      slug = "past-continuous",
      other = was === "was" ? "were" : "was";
    add(
      slug,
      "background-form",
      k,
      `The activity was already in progress: ${cap(s)} ____ ${tail} when ${event}. (${base})`,
      `${was} ${ing}`,
      [`${other} ${ing}`, `${was} ${base}`, `did ${ing}`],
      `Use ${was} plus ${ing} for the ongoing activity with “${s}”.`,
    );
    add(
      slug,
      "negative",
      k,
      `Use the past continuous to deny the activity: ${cap(s)} ____ ${tail} when ${event}. (${base})`,
      `${was} not ${ing}`,
      [`${other} not ${ing}`, `did not ${ing}`, `${was} not ${base}`],
      `Put not after ${was} and keep ${ing}: ${s} ${was} not ${ing}.`,
      1,
    );
    add(
      slug,
      "question",
      k,
      `____ ${s} ${ing} ${tail} when ${event}? Ask about the ongoing past activity.`,
      cap(was),
      [cap(other), "Did", "Does"],
      `Move ${was} before the subject and retain ${ing}.`,
      1,
    );
    add(
      slug,
      "event-sequence",
      k,
      `“${cap(s)} ${was} ${ing} ${tail} when ${event}.” Which statement describes the timing?`,
      `The activity of ${ing} ${tail} had already begun`,
      [
        `The activity began only after ${event}`,
        "Both actions are plans for tomorrow",
        "The sentence gives an exact duration for both actions",
      ],
      `The continuous form shows that ${ing} ${tail} was already happening when ${event}. It does not give an exact duration.`,
      2,
    );
  });
  purposes.forEach(([action, base, ing, tail], i) => {
    const k = `purpose-${i + 1}`,
      slug = "infinitive-of-purpose";
    add(
      slug,
      "purpose-form",
      k,
      `${action} ____ ${tail}. State the aim using the verb “${base}”.`,
      `to ${base}`,
      [`for ${base}`, `to ${ing}`, `for to ${base}`],
      `The purpose is to ${base} ${tail}. Use to plus the base verb.`,
      0,
    );
    add(
      slug,
      "base-after-to",
      k,
      `${action} to ____ ${tail}. (${base})`,
      base,
      [ing, `to ${base}`, `for ${base}`],
      `After the purpose marker to, the base form is ${base}. Do not add another to or an -ing ending.`,
      1,
    );
    add(
      slug,
      "why-answer",
      k,
      `Action: “${action}.” Intended aim: “${base} ${tail}”. Answer “Why?” with a to-infinitive.`,
      `To ${base} ${tail}.`,
      [
        `For ${base} ${tail}.`,
        `To ${ing} ${tail}.`,
        `Because to ${base} ${tail}.`,
      ],
      `A purpose answer can stand alone: To ${base} ${tail}.`,
      2,
    );
    add(
      slug,
      "link-action-goal",
      k,
      `Combine this action and aim using a to-infinitive: “${action}.” Aim: “${base} ${tail}”.`,
      `${action} to ${base} ${tail}.`,
      [
        `${action} for ${base} ${tail}.`,
        `${action} to ${ing} ${tail}.`,
        `${action} for to ${base} ${tail}.`,
      ],
      `Attach the goal as to ${base} ${tail} after the main action.`,
      2,
    );
  });
  complements.forEach(([first, pattern, base, ing, tail], i) => {
    const k = `complement-${i + 1}`,
      slug = "verb-patterns",
      correct = pattern === "ing" ? ing : `to ${base}`,
      wrong = [base, ing, `to ${base}`, `to ${ing}`, `for ${base}`],
      rule = pattern === "ing" ? 0 : 1;
    add(
      slug,
      "complement-form",
      k,
      `I ${first} ____ ${tail}. (${base})`,
      correct,
      wrong,
      `${cap(first)} takes ${pattern === "ing" ? "an -ing form" : "to plus the base verb"} here: ${first} ${correct} ${tail}.`,
      rule,
    );
    add(
      slug,
      "question-pattern",
      k,
      `Do you ${first} ____ ${tail}? (${base})`,
      correct,
      wrong,
      `Making a question with do does not change the complement: ${first} ${correct}.`,
      2,
    );
    add(
      slug,
      "negative-pattern",
      k,
      `I do not ${first} ____ ${tail}. (${base})`,
      correct,
      wrong,
      `The negative do not applies to ${first}; its complement remains ${correct}.`,
      2,
    );
    const bad = pattern === "ing" ? `to ${base}` : ing;
    add(
      slug,
      "correction",
      k,
      `Correct only the second verb: “I ${first} ${bad} ${tail}.” Replace “${bad}” with ____.`,
      correct,
      wrong,
      `Use ${first} ${correct}; ${first} requires ${pattern === "ing" ? "the -ing pattern" : "the to-infinitive pattern"} in this construction.`,
      rule,
    );
  });
  const stems = {
    bored: "bore",
    interested: "interest",
    excited: "excite",
    confused: "confuse",
    annoyed: "annoy",
    surprised: "surprise",
    frightened: "frighten",
    disappointed: "disappoint",
    tired: "tire",
    worried: "worry",
  };
  emotions.forEach(([ed, ing, cause, people], i) => {
    const k = `emotion-${i + 1}`,
      slug = "ed-ing-adjectives",
      stem = stems[ed],
      options = [ed, ing, stem, stem === "worry" ? "worries" : `${stem}s`];
    add(
      slug,
      "experienced-feeling",
      k,
      `Describe the feeling in the “${stem}” family: After ${cause}, ${people} felt ____.`,
      ed,
      options,
      `${cap(ed)} describes the feeling experienced by ${people}; ${ing} describes its cause.`,
    );
    add(
      slug,
      "cause-of-feeling",
      k,
      `Describe the cause of feeling ${ed}: ${cap(cause)} was ____ for ${people}.`,
      ing,
      options,
      `Use ${ing} for the situation that causes ${people} to feel ${ed}.`,
      1,
    );
    add(
      slug,
      "paired-forms",
      k,
      `Choose the adjective pair from the “${stem}” family: ${cap(cause)} was ____; ${people} felt ____.`,
      `${ing} / ${ed}`,
      [`${ed} / ${ing}`, `${ed} / ${ed}`, `${ing} / ${ing}`],
      `The cause takes ${ing}; the experiencers feel ${ed}.`,
      2,
    );
    add(
      slug,
      "meaning",
      k,
      `“${cap(people)} found ${cause} ${ing}.” What does ${ing} tell us?`,
      `The situation caused ${people} to feel ${ed}`,
      [
        `The situation itself felt ${ed}`,
        `The people caused the situation to feel ${ed}`,
        "The sentence states when the situation happened",
      ],
      `${ing} describes the effect of the situation on ${people}. It is not the experiencer's -ed adjective.`,
      2,
    );
  });
  return topics;
}

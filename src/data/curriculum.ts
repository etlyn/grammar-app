import { TOPIC_QUIZ_BANK_SIZE } from "../constants/learning";
import type { CEFRLevel, GrammarRule, GrammarTopic, QuizChoice, QuizItem } from "../types/grammar";

const topicTitles = [
  "Present simple",
  "Present continuous",
  "Stative verbs",
  "Past simple",
  "Past continuous",
  "Used to",
  "Present perfect simple",
  "Present perfect continuous",
  "Past perfect simple",
  "Past perfect continuous",
  "Future times",
  "Prepositions of time and place",
  "The passive 1",
  "The passive 2",
  "Countable and uncountable nouns",
  "Articles",
  "Pronouns and possessive determiners",
  "Relative clauses",
  "Modals 1: ability, permission, advice",
  "Modals 2: obligation, probability, possibility",
  "Modals 3: the modal perfect",
  "Questions, question tags, indirect questions",
  "So and such, too and enough",
  "Comparatives and superlatives",
  "Conditionals 1: zero, 1st and 2nd conditionals",
  "Conditionals 2: 3rd conditional",
  "Reported speech",
  "Reported questions, orders, requests",
  "Direct and indirect objects",
  "Wish, -ing and infinitive",
  "Both, either, neither, so, nor",
  "Connectives",
  "The causative",
  "Phrasal verbs",
  "Adverbs and adjectives",
  "Subject-verb agreement",
  "Indefinite pronouns",
  "Modal verbs for deduction",
  "Prepositional phrases",
  "Conjunctions",
  "Determiners",
  "Quantifiers",
  "Verb patterns",
  "Noun phrases",
  "Adverbial clauses",
  "Conditional sentences",
  "Synonyms and antonyms",
  "Punctuation rules",
  "Sentence structure",
  "Voice (Active and Passive)",
  "Mood (Indicative, Imperative, Subjunctive)",
  "Aspects of verbs",
  "Linking verbs",
  "Ellipsis and substitution",
  "Discourse markers",
  "Suffixes and prefixes",
  "Word formation",
  "Spelling rules",
];

const levelByIndex = (index: number): CEFRLevel => {
  if (index < 8) return "A1";
  if (index < 20) return "A2";
  if (index < 35) return "B1";
  if (index < 48) return "B2";
  return "C1";
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const baseRules: Record<string, GrammarRule[]> = {
  "present-simple": [
    {
      title: "Use it for routines, facts, and permanent situations",
      explanation:
        "The present simple describes what is generally true, repeated, or stable. It does not usually describe an action happening right now.",
      examples: ["I study grammar every morning.", "Water boils at 100°C.", "She works near the station."],
      commonMistakes: ["Do not use it for actions happening at this exact moment: say ‘I am studying now’, not ‘I study now’."],
    },
    {
      title: "Add -s or -es after he, she, and it",
      explanation:
        "In affirmative sentences, the third-person singular form changes: he goes, she studies, it works.",
      examples: ["He watches English videos.", "Maria studies after dinner.", "The bus leaves at eight."],
      commonMistakes: ["Do not add -s after I, you, we, or they."],
    },
    {
      title: "Use do and does for questions and negatives",
      explanation:
        "The helper verb carries the tense. After do or does, use the base verb.",
      examples: ["Do you understand the rule?", "She does not need help.", "Does it sound natural?"],
    },
  ],
  "present-continuous": [
    {
      title: "Use am, is, or are + -ing",
      explanation:
        "The present continuous focuses on an action in progress now or around the present period.",
      examples: ["I am reading a grammar note.", "They are preparing for a test.", "She is improving quickly."],
    },
    {
      title: "Use it for temporary situations and changing trends",
      explanation:
        "When something is not permanent or is developing, the continuous form is usually clearer than the present simple.",
      examples: ["I am living with my cousin this month.", "Your writing is getting stronger.", "The class is becoming more confident."],
    },
  ],
  "stative-verbs": [
    {
      title: "Stative verbs describe states, not actions",
      explanation:
        "Verbs about feelings, possession, senses, and thoughts are often not used in continuous forms when they describe a state.",
      examples: ["I know the answer.", "She owns a small car.", "This soup tastes great."],
      commonMistakes: ["Say ‘I understand’, not usually ‘I am understanding’."],
    },
    {
      title: "Some verbs can be stative or active",
      explanation:
        "Meaning decides the tense. ‘Think’ can mean an opinion or an active mental process.",
      examples: ["I think this is correct.", "I am thinking about your suggestion.", "He has a car. / He is having lunch."],
    },
  ],
  "past-simple": [
    {
      title: "Use it for finished past actions",
      explanation:
        "The past simple places an action at a completed time before now. The time can be stated or understood from context.",
      examples: ["I finished the lesson yesterday.", "She visited London in 2020.", "They watched the video twice."],
    },
    {
      title: "Use did for questions and negatives",
      explanation:
        "After did or did not, use the base verb, not the past form.",
      examples: ["Did you finish the quiz?", "We did not see the answer.", "Where did he go?"],
      commonMistakes: ["Say ‘Did you went?’ is wrong; say ‘Did you go?’"],
    },
  ],
  "past-continuous": [
    {
      title: "Use was or were + -ing for a past action in progress",
      explanation:
        "The past continuous shows that an action was already happening at a past time.",
      examples: ["I was studying when you called.", "They were waiting at 7 p.m.", "She was writing notes all afternoon."],
    },
    {
      title: "Combine it with the past simple for interruptions",
      explanation:
        "The longer background action uses past continuous; the shorter interrupting action uses past simple.",
      examples: ["We were eating when the phone rang.", "He was driving when it started to rain.", "I was reading when she arrived."],
    },
  ],
  "present-perfect-simple": [
    {
      title: "Connect the past to now",
      explanation:
        "Use have or has + past participle when the time is unfinished, the result matters now, or the experience is part of your life up to now.",
      examples: ["I have finished the exercise.", "She has visited Canada twice.", "We have known each other for years."],
    },
    {
      title: "Use for and since with continuing situations",
      explanation:
        "Use for with a period of time and since with the starting point.",
      examples: ["I have lived here for six months.", "He has worked here since May.", "They have studied English for a long time."],
    },
  ],
  "present-perfect-continuous": [
    {
      title: "Focus on duration and activity",
      explanation:
        "Use have or has been + -ing when an activity started in the past and continues now, or its recent effect is visible.",
      examples: ["I have been studying for two hours.", "She has been practicing pronunciation.", "It has been raining all morning."],
    },
  ],
  "future-times": [
    {
      title: "Choose the future form by meaning",
      explanation:
        "Use will for decisions made now or predictions, be going to for plans or evidence, present continuous for arrangements, and present simple for timetables.",
      examples: ["I will help you.", "Look at those clouds; it is going to rain.", "We are meeting at six.", "The train leaves at 9:10."],
    },
  ],
  "articles": [
    {
      title: "Use a or an for one nonspecific countable noun",
      explanation:
        "Use a before consonant sounds and an before vowel sounds when the listener does not know exactly which one.",
      examples: ["I bought a notebook.", "She is an engineer.", "We need a clear example."],
    },
    {
      title: "Use the when the noun is specific",
      explanation:
        "The points to something already known, unique, or identified by context.",
      examples: ["The answer is on the board.", "Close the window near you.", "The sun is bright today."],
    },
  ],
  "relative-clauses": [
    {
      title: "Use relative clauses to identify or add information",
      explanation:
        "Who refers to people, which to things, and that can often refer to people or things in defining clauses.",
      examples: ["The student who asked the question is right.", "The book that I bought is useful.", "My laptop, which is old, still works."],
    },
  ],
  "conditionals-1-zero-1st-and-2nd-conditionals": [
    {
      title: "Use the zero conditional for general truths",
      explanation:
        "If + present simple, present simple describes a result that is normally true.",
      examples: ["If water freezes, it expands.", "If I sleep badly, I feel tired."],
    },
    {
      title: "Use the first conditional for real future possibilities",
      explanation:
        "If + present simple, will + base verb describes a possible future result.",
      examples: ["If you practice, you will improve.", "If it rains, we will stay home."],
    },
    {
      title: "Use the second conditional for unreal or unlikely situations",
      explanation:
        "If + past simple, would + base verb describes an imaginary present or future.",
      examples: ["If I had more time, I would read more.", "If she knew the answer, she would tell us."],
    },
  ],
  "conditionals-2-3rd-conditional": [
    {
      title: "Use it for imaginary past results",
      explanation:
        "If + past perfect, would have + past participle describes a past situation that did not happen and its imagined result.",
      examples: ["If I had known, I would have called.", "If they had left earlier, they would have arrived on time."],
    },
  ],
  "reported-speech": [
    {
      title: "Move the tense back when the reporting verb is past",
      explanation:
        "Reported speech often changes present to past, past to past perfect, and will to would when the report is not immediate.",
      examples: ["She said, ‘I am tired.’ → She said she was tired.", "He said, ‘I will call.’ → He said he would call."],
    },
  ],
  "comparatives-and-superlatives": [
    {
      title: "Compare two things with comparative forms",
      explanation:
        "Use -er or more + adjective, usually followed by than.",
      examples: ["This exercise is easier than the last one.", "Grammar is more interesting with examples."],
    },
    {
      title: "Compare one thing with all others using superlatives",
      explanation:
        "Use the + -est or the most + adjective.",
      examples: ["This is the easiest question.", "It was the most useful lesson."],
    },
  ],
};

const genericRules = (title: string): GrammarRule[] => [
  {
    title: `Understand the purpose of ${title}`,
    explanation:
      `${title} is best learned by asking what meaning it adds to a sentence: time, relationship, emphasis, accuracy, or sentence flow. Read the full sentence before choosing a form.`,
    examples: [
      `The ${title.toLowerCase()} choice depends on the complete sentence, not only one word.`,
      "Context tells you whether the sentence needs a form, a connector, or a word order change.",
      "Natural English usually combines grammar accuracy with clear meaning.",
    ],
  },
  {
    title: "Notice signal words and sentence patterns",
    explanation:
      "Signal words are helpful, but they are not enough alone. Check the subject, verb form, time expression, and the relationship between clauses.",
    examples: [
      "Read before and after the gap before answering.",
      "Underline time expressions, subjects, and linking words.",
      "Test your answer by reading the full sentence aloud.",
    ],
  },
];

const makeChoice = (id: QuizChoice["id"], text: string): QuizChoice => ({ id, text });

const quiz = (
  topicSlug: string,
  index: number,
  prompt: string,
  choices: [string, string, string, string],
  answerId: QuizChoice["id"],
  hint: string,
  explanation: string,
  keywords: string[],
  level: CEFRLevel = "A2",
): QuizItem => ({
  id: `${topicSlug}-${index}`,
  topicSlug,
  level,
  prompt,
  choices: [makeChoice("A", choices[0]), makeChoice("B", choices[1]), makeChoice("C", choices[2]), makeChoice("D", choices[3])],
  answerId,
  hint,
  explanation,
  keywords,
  source: "seed",
});

const topicQuiz: Record<string, QuizItem[]> = {
  "present-simple": [
    quiz("present-simple", 1, "Maya ____ English podcasts every morning before work.", ["listen", "listens", "is listening", "has listened"], "B", "The subject is Maya, so use the third-person singular form.", "For routines with he, she, or it, add -s or -es to the main verb.", ["every morning", "Maya"], "A1"),
    quiz("present-simple", 2, "____ your brother usually study in the evening?", ["Do", "Does", "Is", "Has"], "B", "Use does for questions with he, she, or it.", "Questions in the present simple use do or does + base verb.", ["your brother", "usually"], "A1"),
    quiz("present-simple", 3, "The museum ____ at six on Sundays.", ["close", "closes", "is closing", "closed"], "B", "Timetables and regular facts use present simple.", "A singular subject takes the -s form in the present simple.", ["on Sundays", "museum"], "A1"),
  ],
  "present-continuous": [
    quiz("present-continuous", 1, "Please be quiet; I ____ to understand this rule.", ["try", "tries", "am trying", "have tried"], "C", "The action is happening now.", "Use am/is/are + -ing for actions in progress now.", ["Please be quiet", "now"], "A1"),
    quiz("present-continuous", 2, "This month, Leo ____ with his aunt near the college.", ["stays", "is staying", "stayed", "has stayed"], "B", "This month shows a temporary situation.", "The present continuous can show temporary arrangements around now.", ["This month"], "A2"),
    quiz("present-continuous", 3, "Your pronunciation ____ much clearer these days.", ["gets", "is getting", "got", "has got"], "B", "A changing trend often uses the continuous form.", "Use the present continuous for changes and developments.", ["these days", "clearer"], "A2"),
  ],
  "past-simple": [
    quiz("past-simple", 1, "We ____ the grammar lesson yesterday.", ["finish", "finished", "have finished", "were finishing"], "B", "Yesterday is a finished past time.", "Use the past simple for completed actions at a finished time.", ["yesterday"], "A1"),
    quiz("past-simple", 2, "Did she ____ the example clearly?", ["explained", "explains", "explain", "explaining"], "C", "After did, use the base verb.", "The helper did carries the past tense in questions and negatives.", ["Did"], "A1"),
    quiz("past-simple", 3, "I ____ my notebook on the bus this morning.", ["leave", "left", "have left", "was leaving"], "B", "This morning is treated as a finished past event here.", "Irregular verbs need their past form in affirmative past simple sentences.", ["this morning"], "A2"),
  ],
  "present-perfect-simple": [
    quiz("present-perfect-simple", 1, "Nina ____ three practice tests this week.", ["takes", "took", "has taken", "is taking"], "C", "This week is an unfinished time period.", "Use the present perfect for actions in an unfinished time period.", ["this week"], "A2"),
    quiz("present-perfect-simple", 2, "I ____ this grammar app since January.", ["use", "used", "have used", "am using"], "C", "Since gives a starting point that continues to now.", "Use have/has + past participle with since for continuing situations.", ["since January"], "A2"),
    quiz("present-perfect-simple", 3, "Have you ever ____ a full book in English?", ["read", "reading", "reads", "rode"], "A", "Ever asks about life experience up to now.", "Use the past participle after have/has in present perfect questions.", ["ever"], "B1"),
  ],
  "articles": [
    quiz("articles", 1, "She bought ____ umbrella because it was raining.", ["a", "an", "the", "—"], "B", "Umbrella starts with a vowel sound.", "Use an before vowel sounds when introducing one countable noun.", ["umbrella"], "A1"),
    quiz("articles", 2, "Could you close ____ window next to you?", ["a", "an", "the", "—"], "C", "The listener knows exactly which window.", "Use the for a specific noun identified by context.", ["next to you"], "A2"),
    quiz("articles", 3, "I need ____ advice about pronunciation.", ["a", "an", "the", "—"], "D", "Advice is uncountable in standard English.", "Do not use a/an with uncountable nouns such as advice, information, or furniture.", ["advice"], "B1"),
  ],
  "conditionals-2-3rd-conditional": [
    quiz("conditionals-2-3rd-conditional", 1, "If I ____ earlier, I would have joined the lesson.", ["knew", "had known", "would know", "have known"], "B", "The result uses would have + past participle, so the if-clause needs past perfect.", "The third conditional uses if + past perfect, would have + past participle.", ["would have joined"], "B2"),
    quiz("conditionals-2-3rd-conditional", 2, "She would have passed if she ____ more carefully.", ["revises", "revised", "had revised", "would revise"], "C", "This is an unreal past condition.", "For imagined past situations, use had + past participle in the if-clause.", ["would have passed"], "B2"),
    quiz("conditionals-2-3rd-conditional", 3, "If they had left on time, they ____ the train.", ["catch", "caught", "would catch", "would have caught"], "D", "The if-clause has past perfect, so use would have + past participle for the result.", "The result clause of the third conditional uses would have + past participle.", ["had left"], "B2"),
  ],
};

const quizContexts = [
  "a quick grammar check",
  "a CEFR-style practice item",
  "a focused review question",
  "a classroom drill",
  "a short exam-style task",
  "a warm-up exercise",
  "a mixed practice set",
  "a revision round",
  "a fluency check",
  "an accuracy check",
  "a mini test item",
  "a guided practice task",
  "a grammar-book exercise",
  "a self-study question",
  "a progress check",
  "a challenge round",
  "a recap question",
  "a confidence check",
  "a skill-building item",
  "a final review item",
];

const baseDefaultQuizItems = (slug: string, title: string, level: CEFRLevel): QuizItem[] => {
  const lowerTitle = title.toLowerCase();

  return [
    quiz(
      slug,
      1,
      `Choose the most natural sentence for the topic: ${title}.`,
      [
        `The sentence uses ${lowerTitle} accurately and clearly.`,
        `The sentence use ${lowerTitle} accurate and clear.`,
        `Sentence the ${lowerTitle} uses clearly accurate.`,
        `The sentence using ${lowerTitle} accurate clear.`,
      ],
      "A",
      "Choose the sentence with correct word order and grammar.",
      "A clear English sentence needs a subject, a correctly formed verb phrase, and natural word order.",
      ["accurately", "clearly"],
      level,
    ),
    quiz(slug, 2, "Before choosing an answer, you should first ____ the complete sentence.", ["to read", "reading", "read", "reads"], "C", "After should, use the base verb.", "Modal verbs such as should are followed by the base form of the verb.", ["should"], level),
    quiz(slug, 3, "The learner improved because she ____ her mistakes after every quiz.", ["review", "reviews", "reviewed", "is reviewing"], "C", "The sentence describes a completed past habit or sequence.", "Use the past simple for completed actions in a past narrative.", ["improved", "after every quiz"], level),
    quiz(slug, 4, "A good grammar explanation should ____ the rule with clear examples.", ["supports", "support", "supporting", "supported"], "B", "After should, use the base verb.", "Modal verbs are followed by the base form of the main verb.", ["should"], level),
    quiz(slug, 5, "If an answer sounds wrong, read the sentence ____ before you change it.", ["careful", "carefully", "care", "cared"], "B", "The word describes how you read, so use an adverb.", "Adverbs often describe verbs. Carefully describes the action read.", ["read"], level),
    quiz(slug, 6, `The topic ${title} ____ easier when you compare correct and incorrect examples.`, ["becomes", "become", "becoming", "to become"], "A", "The subject is the singular noun phrase ‘The topic’.", "Use a singular verb after a singular subject in the present simple.", ["The topic"], level),
    quiz(slug, 7, "Each example in the guide ____ one clear grammar point.", ["show", "shows", "showing", "shown"], "B", "Each is singular, so the verb needs -s.", "Indefinite words such as each usually take a singular verb.", ["Each"], level),
    quiz(slug, 8, "The examples are useful because they connect the rule ____ real situations.", ["at", "to", "for", "by"], "B", "The common phrase is connect something to something.", "Use connect to when showing the relationship between a rule and a real situation.", ["connect"], level),
    quiz(slug, 9, "When you see a blank, ____ for the subject before choosing the verb.", ["look", "looks", "looking", "to look"], "A", "This is an imperative instruction, so use the base verb.", "Instructions often begin with the base form of the verb.", ["When you see", "before choosing"], level),
    quiz(slug, 10, "This sentence is ____ clear than the first version.", ["more", "most", "much", "many"], "A", "The comparison uses than.", "Use more + adjective + than for many comparative adjective forms.", ["than"], level),
    quiz(slug, 11, "The learner chose the answer ____ matched the meaning of the sentence.", ["who", "where", "that", "when"], "C", "The relative clause describes the answer, a thing.", "That can introduce a defining relative clause for things.", ["answer", "matched"], level),
    quiz(slug, 12, "There ____ several clue words in this question.", ["is", "are", "was", "be"], "B", "Several clue words is plural.", "Use are with a plural subject in the present simple.", ["several clue words"], level),
    quiz(slug, 13, "The rule was explained clearly, ____ the learner could use it in a new sentence.", ["so", "but", "although", "unless"], "A", "The second clause is a result.", "Use so to connect a reason or situation with its result.", ["could use it"], level),
    quiz(slug, 14, "You should review the explanation ____ you make the same mistake again.", ["because", "after", "before", "while"], "C", "The review should happen first.", "Before shows that one action happens earlier than another.", ["review", "again"], level),
    quiz(slug, 15, "A complete answer needs both accuracy ____ meaning.", ["or", "and", "but", "nor"], "B", "Both pairs with and.", "Use both ... and to join two necessary ideas.", ["both"], level),
    quiz(slug, 16, "The quiz gives feedback ____ learners can correct their mistakes.", ["so that", "even though", "unless", "as if"], "A", "The second clause explains purpose.", "So that introduces a purpose clause.", ["can correct"], level),
    quiz(slug, 17, "If a sentence has two possible answers, choose ____ one that best fits the context.", ["a", "an", "the", "—"], "C", "The phrase identifies one specific answer.", "Use the when the noun is specific or defined by context.", ["best fits the context"], level),
    quiz(slug, 18, "The mistake is easier to notice when the sentence is read ____.", ["aloud", "loud", "loudly voice", "louder"], "A", "Read aloud is the natural phrase.", "Aloud means spoken so that people can hear it.", ["read"], level),
    quiz(slug, 19, "The guide asks learners to focus on meaning rather ____ memorising rules only.", ["that", "than", "then", "to"], "B", "The phrase is rather than.", "Rather than introduces the alternative you are avoiding.", ["rather"], level),
    quiz(slug, 20, `After twenty questions, you should be able to explain ${lowerTitle} ____ your own words.`, ["on", "at", "in", "by"], "C", "The fixed phrase is in your own words.", "Use in your own words when someone explains an idea personally and clearly.", ["your own words"], level),
  ];
};

const buildQuizBank = (
  items: QuizItem[],
  slug: string,
  title: string,
  level: CEFRLevel,
) => {
  const baseItems = items.length ? items : baseDefaultQuizItems(slug, title, level);
  const bank = [...items];
  const seenIds = new Set(bank.map((item) => item.id));
  let variant = 1;

  const withContext = (prompt: string, context: string) =>
    `In ${context}, answer this: ${prompt}`;

  while (bank.length < TOPIC_QUIZ_BANK_SIZE) {
    const item = baseItems[(variant - 1) % baseItems.length];
    const context = quizContexts[(variant - 1) % quizContexts.length];
    const nextId = `${slug}-bank-${variant}`;
    variant += 1;

    if (seenIds.has(nextId)) continue;

    seenIds.add(nextId);
    bank.push({
      ...item,
      id: nextId,
      topicSlug: slug,
      level: item.level ?? level,
      prompt: withContext(item.prompt, context),
      hint: `${item.hint} Read it as if it appears in ${context}.`,
      explanation: `${item.explanation} This variation checks the same grammar skill in ${context}.`,
    });
  }

  return bank.slice(0, TOPIC_QUIZ_BANK_SIZE);
};

const defaultQuizItems = (slug: string, title: string, level: CEFRLevel): QuizItem[] =>
  buildQuizBank(baseDefaultQuizItems(slug, title, level), slug, title, level);

const ensurePracticeSet = (items: QuizItem[], slug: string, title: string, level: CEFRLevel) => {
  if (items.length >= TOPIC_QUIZ_BANK_SIZE) return items.slice(0, TOPIC_QUIZ_BANK_SIZE);

  return buildQuizBank(items, slug, title, level);
};

const summaryFor = (title: string) =>
  `Study ${title.toLowerCase()} with a practical grammar-book sequence: meaning first, then form, signal words, examples, common mistakes, and short practice.`;

const guidanceFor = (title: string) =>
  `Read the examples slowly and ask three questions: What time or relationship does the sentence show? Which form creates that meaning? What clue words support the answer? This keeps ${title.toLowerCase()} practice focused on meaning, not memorising isolated rules.`;

const goalsFor = (title: string) => [
  `Recognise when ${title.toLowerCase()} is needed in a sentence.`,
  "Choose the correct form from context, not from one clue word only.",
  "Explain your answer using simple grammar language.",
  "Review mistakes and repeat the topic until the rule feels natural.",
];

const tipsFor = (title: string) => [
  "Read the whole sentence before looking at the options.",
  "Underline time expressions, subjects, connectors, and verb forms.",
  `After each answer, say why the correct option fits ${title.toLowerCase()}.`,
  "If two answers look possible, choose the one that best matches the meaning of the sentence.",
];

export const seedCurriculum: GrammarTopic[] = topicTitles.map((title, index) => {
  const slug = slugify(title);
  const level = levelByIndex(index);

  return {
    slug,
    title,
    level,
    order: index + 1,
    summary: summaryFor(title),
    learningGoals: goalsFor(title),
    guidance: guidanceFor(title),
    rules: baseRules[slug] ?? genericRules(title),
    tips: tipsFor(title),
    quizItems: ensurePracticeSet(topicQuiz[slug] ?? defaultQuizItems(slug, title, level), slug, title, level),
    source: "seed",
  };
});

export const getSeedTopic = (slug: string) => seedCurriculum.find((topic) => topic.slug === slug);

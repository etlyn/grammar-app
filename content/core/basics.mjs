import { define, task as Q, cap } from "./engine.mjs";
import { actions, nouns } from "./contexts.mjs";
const L = (...a) => a;
export function buildBasics() {
  return [
    define(
      "sentence-structure",
      "Sentence structure and word classes",
      "A1",
      "dfe-grammar",
      "Start with the building blocks: subjects, verbs, objects, complements and complete clauses.",
      [
        L(
          "Find the subject and the verb",
          "A clause normally contains a **subject** and a **verb phrase**. The subject tells us who or what the clause is about. The verb expresses an action, event or state. In a simple statement, the subject usually comes before the verb. A subject can contain several words.",
          "**The new guide** **explains** the route.",
          "The first noun you see is not always the subject: in On Monday, the guide arrives, Monday belongs to a time phrase.",
        ),
        L(
          "Objects and complements",
          "A transitive verb can take an **object**, the person or thing affected or involved. After a linking verb such as be or seem, a **complement** describes or identifies the subject instead. Compare She paints the door with The door is blue. Blue describes the door; it is not a thing receiving an action.",
          "She opens **the door**. / The door is **heavy**.",
          "Some verbs need no object: the baby sleeps. Do not force every sentence into subject–verb–object.",
        ),
        L(
          "Word class depends on its job",
          "A noun names something, an adjective describes a noun, and an adverb can modify a verb, adjective or clause. The same spelling may have different jobs: a clean room uses clean as an adjective; clean the room uses it as a verb. Identify the word in its sentence.",
          "They **carefully** open the **heavy** door.",
          "An -ly ending is only a clue: friendly is usually an adjective, and fast can be an adjective or adverb.",
        ),
        L(
          "A complete written sentence",
          "A written sentence needs a complete main clause and suitable final punctuation. A dependent clause introduced by because or although usually needs a main clause beside it. Commands often leave the subject you unspoken, so Open the door is complete.",
          "**Because it was cold, we closed the window.**",
          "Because it was cold alone is a fragment in ordinary formal prose, though fragments have purposeful uses in conversation and creative writing.",
        ),
      ],
      actions,
      ({ v, s, o }) => [
        Q(
          "subject-identification",
          `In “The assistant ${s} ${o} carefully”, which words are the subject?`,
          "The assistant",
          "**The assistant** is the subject: it tells us who performs the action.",
          [
            [s, "This is the verb, which expresses the action."],
            [o, "This is the object involved in the action."],
            ["carefully", "This adverb describes how the action is performed."],
          ],
          "Find who or what performs the action, then separate it from the action itself.",
        ),
        Q(
          "verb-identification",
          `In “The assistant ${s} ${o} carefully”, which word is the main verb?`,
          s,
          `**${s}** expresses the action and agrees with the singular subject.`,
          [
            ["assistant", "Assistant is a noun within the subject phrase."],
            ["carefully", "Carefully modifies the verb; it is an adverb."],
            [o, "This noun phrase is the object, not the verb."],
          ],
          "Look for the word that expresses the action.",
        ),
        Q(
          "object-identification",
          `In “The assistant ${s} ${o}”, which phrase is the object?`,
          o,
          `**${o}** answers what the assistant ${s}; it is the object of the transitive verb.`,
          [
            ["The assistant", "This is the subject performing the action."],
            [s, "This is the verb, not its object."],
            [
              "There is no object",
              "This transitive clause names the thing involved in the action.",
            ],
          ],
          "Ask the verb’s question: the assistant does this to or with **what**?",
        ),
        Q(
          "clause-completion",
          `Complete the main clause after a reason: “Because there is time, ____ ${o}.”`,
          `we ${v}`,
          `**We ${v}** supplies the subject and finite verb for the main clause.`,
          [
            [
              `to ${v}`,
              "A to-infinitive does not supply a finite main clause here.",
            ],
            [`${v}ing`, "This form does not supply a subject and finite verb."],
            ["our", "A possessive determiner cannot form the missing clause."],
          ],
          "Because introduces a dependent reason clause. The rest still needs a **main clause**.",
        ),
      ],
    ),
    define(
      "nouns-and-plurals",
      "Nouns: singular, plural and irregular forms",
      "A1",
      "bc-nouns",
      "Recognise separate things, form their plurals and make nearby words agree with their number.",
      [
        L(
          "Regular plural endings",
          "Most countable nouns form a plural with **-s**. After endings such as -s, -sh, -ch and -x, we often add **-es**. After a consonant + y, replace y with **-ies**. After a vowel + y, keep y and add -s. The ending changes the noun’s number, not its ownership.",
          "book**s** · box**es** · cit**ies** · key**s**",
          "An apostrophe does not normally make a plural: two books, not two book’s.",
        ),
        L(
          "Irregular and unchanged plurals",
          "Some nouns change internally: man → men, tooth → teeth. Others have the same singular and plural form, such as sheep and species. Learn each noun with its plural. A word ending in -s is not automatically plural: news usually takes singular agreement.",
          "one **child**, two **children** · one **sheep**, two **sheep**",
          "Fish is a common plural for individual fish; fishes can refer to different kinds. The practice specifies the ordinary count sense.",
        ),
        L(
          "Agreement around the noun",
          "Use **this / that / a / an** with a singular count noun and **these / those** with a plural. A plural noun used as subject normally takes a plural verb. The words around an unchanged noun can reveal its number.",
          "**These sheep are** calm. / **This sheep is** calm.",
          "This books mixes a singular demonstrative with a plural noun.",
        ),
        L(
          "Plural form is not possession",
          "Distinguish plural -s from possessive ’s and s’. A plural noun says how many; a possessive marks a relationship. In two students’ bags, students is plural and the apostrophe marks possession. With an irregular plural, add ’s: children’s.",
          "two **students** · one **student’s** bag · two **students’** bags",
          "Some nouns such as furniture are uncountable in their usual sense. Use pieces of furniture, not furnitures.",
        ),
      ],
      nouns,
      ({ one, many }) => [
        Q(
          "plural-form",
          `Choose the ordinary plural phrase for individual ${many}: “two ____”.`,
          many,
          `The ordinary plural of **${one}** is **${many}**. The number two requires that plural sense.`,
          [
            [
              `${one}'s`,
              "Apostrophe + s marks possession, not a plural count.",
            ],
            [
              `${many}'`,
              "A possessive apostrophe is not needed to count these nouns.",
            ],
            [
              `${many}es`,
              "This adds an extra ending to the established plural form.",
            ],
          ],
          "Look at the number **two**, then recall the noun’s plural; an apostrophe is not a plural ending.",
        ),
        Q(
          "plural-agreement",
          `Choose the verb: “These ${many} ____ easy to recognise.”`,
          "are",
          `**These ${many}** is plural, so use **are**.`,
          [
            ["is", "Is is singular and does not agree with these."],
            ["am", "Am agrees with I, not this plural noun phrase."],
            ["be", "Be is not the finite present form required here."],
          ],
          "The demonstrative **these** makes the plural number explicit.",
        ),
        Q(
          "singular-demonstrative",
          `Point to one item: “____ ${one} is in the picture.”`,
          "This",
          `The instruction specifies one ${one}, so the singular demonstrative is **this**.`,
          [
            [
              "These",
              "These is plural, but the noun phrase refers to one item.",
            ],
            ["Those", "Those is plural."],
            [
              "Many",
              "Many requires a plural count noun and would not agree with is.",
            ],
          ],
          "Match the demonstrative to **one** item and the singular verb is.",
        ),
        Q(
          "plural-possession",
          `Several ${many} share the belongings. Choose the possessive spelling for the plural noun “${many}”.`,
          many.endsWith("s") ? many + "'" : many + "'s",
          `The plural **${many}** ${many.endsWith("s") ? "already ends in s, so add only an apostrophe" : "does not end in s, so add apostrophe + s"}.`,
          [
            [many, "The possessive apostrophe is missing."],
            [
              many + "s's",
              "This adds an extra plural-like s and the wrong possessive ending.",
            ],
            [many + "'s'", "Two apostrophes are not used for this possessive."],
          ],
          "Find the plural noun’s final letter, then choose **apostrophe only** or **apostrophe + s**.",
        ),
      ],
    ),
    define(
      "demonstratives",
      "This, that, these and those",
      "A1",
      "bc-determiners",
      "Choose words that point to things and distinguish number from distance.",
      [
        L(
          "Near and far",
          "Use **this** for one nearby thing and **that** for one more distant thing. Distance can be physical or part of how the speaker views a situation. Demonstratives can stand alone or come before a noun.",
          "**This** seat is free. / **That** seat by the door is taken.",
          "This and that are singular, even when the object seems large or contains many parts.",
        ),
        L(
          "Plural demonstratives",
          "Use **these** for nearby plural things and **those** for more distant plural things. Match the following noun and verb to plural number. Near and far are described explicitly in the practice so that the intended choice is clear.",
          "**These books are** mine. / **Those books are** yours.",
          "These is pronounced differently from this. In writing, remember the final -e in these.",
        ),
        L(
          "Pointing without a following noun",
          "A demonstrative can function as a pronoun when the thing is already understood. It still has number: This is mine; These are mine. Do not add an unnecessary noun merely because the demonstrative has no following noun.",
          "What is **that**? / Who owns **these**?",
          "The word it refers back to an identified thing but does not make the same near/far contrast.",
        ),
        L(
          "Referring to ideas and time",
          "This and that can refer to an event or whole idea. This week identifies the current week; that week points to a week already identified elsewhere. In conversation, that often responds to something just said.",
          "The train was cancelled. **That** was frustrating.",
          "Real conversational choices depend on viewpoint. The questions here use explicit physical distance rather than judging subjective emphasis.",
        ),
      ],
      nouns,
      ({ one, many }) => [
        Q(
          "near-singular",
          `Point to one ${one} in your hand: “____ ${one} is mine.”`,
          "This",
          "One nearby item takes **this**.",
          [
            [
              "That",
              "That points away from the speaker; the item is explicitly in your hand.",
            ],
            ["These", "These is plural."],
            ["Those", "Those is both plural and distant."],
          ],
          "Check two features: **one** item and **near** the speaker.",
        ),
        Q(
          "far-singular",
          `Point to one ${one} far away across the room: “____ ${one} is yours.”`,
          "That",
          "One distant item takes **that**.",
          [
            [
              "This",
              "This points to something near; the task explicitly places it far away.",
            ],
            ["These", "These is plural and near."],
            ["Those", "Those is plural, but the task says one."],
          ],
          "Check **one + distant**.",
        ),
        Q(
          "near-plural",
          `Point to several ${many} beside you: “____ ${many} are ours.”`,
          "These",
          "Nearby plural things take **these**.",
          [
            ["This", "This is singular."],
            ["That", "That is singular and distant."],
            [
              "Those",
              "Those is plural but distant; these things are beside you.",
            ],
          ],
          "Check **several + nearby**.",
        ),
        Q(
          "far-plural",
          `Point to several ${many} far away beyond the fence: “____ ${many} are theirs.”`,
          "Those",
          "Distant plural things take **those**.",
          [
            ["This", "This is singular and near."],
            ["That", "That is distant but singular."],
            ["These", "These is plural but near."],
          ],
          "Check **several + distant**.",
        ),
      ],
    ),
    define(
      "question-forms",
      "Questions, question words and short answers",
      "A1",
      "bc-question-forms",
      "Build direct questions and distinguish a question about the subject from one about the object.",
      [
        L(
          "Use the existing auxiliary",
          "If a statement already has be, a modal or an auxiliary have, put the first auxiliary before the subject. The rest of the verb phrase remains after the subject. A question word, if needed, normally comes first.",
          "**Are** they ready? / Where **have** they gone?",
          "Do not add do to a question already built with auxiliary be: Are they waiting?, not Do they are waiting?",
        ),
        L(
          "Add do when needed",
          "For an ordinary present-simple action verb, add **do / does**. For past simple, add **did**. These auxiliaries carry tense and agreement, so the main verb uses its base form.",
          "Where **does** she **work**? / What **did** they **buy**?",
          "Does she works? marks agreement twice. Keep the -s on does, not on the main verb.",
        ),
        L(
          "Subject questions",
          "When who or what is itself the subject, a neutral affirmative question usually has normal subject–verb order without do. Compare Who called you? with Who did you call? The person sought has a different role.",
          "**Who called**? / **Who did you call**?",
          "Emphatic subject questions can use do, as in Who did call? These exercises practise the neutral pattern.",
        ),
        L(
          "Short answers",
          "Use a pronoun and the same auxiliary family as the question: Do they work? Yes, they do. Can she swim? No, she can’t. In a positive short answer, keep the auxiliary full rather than ending with a contraction.",
          "Yes, she **does**. / No, they **did not**.",
          "Yes, she’s is not a normal complete positive short answer to Is she ready? Use Yes, she is.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "present-question-auxiliary",
          `Present simple: “____ the assistant ${v} ${o} every day?”`,
          "Does",
          `The singular subject **the assistant** takes **does**; ${v} stays in the base form.`,
          [
            ["Do", "Do does not agree with the singular third-person subject."],
            [
              "Is",
              "The lexical verb is in base form, so is cannot make this present-simple question.",
            ],
            [
              "Has",
              "Has would require a participle for a perfect question, not this present-simple construction.",
            ],
          ],
          "Find the subject’s number, then choose **do or does**.",
        ),
        Q(
          "past-question-base",
          `Complete the past-simple question: “Why did the assistant ____ ${o}?”`,
          v,
          `**Did** carries the past tense, so choose base **${v}**.`,
          [
            [s, "The third-person -s form cannot follow did in this question."],
            [`to ${v}`, "Did takes a bare infinitive, without to."],
            [`been ${v}`, "Been cannot follow did to build this question."],
          ],
          "The past marker is already on **did**; do not mark it twice.",
        ),
        Q(
          "subject-question",
          `Ask who performs the action, in the neutral present simple: “Who ____ ${o} each morning?”`,
          s,
          `**Who** is the subject, so use the singular present form **${s}** without an extra do.`,
          [
            [
              `does ${s}`,
              "This marks the main verb as well as adding does; the form after does would have to be base.",
            ],
            [
              `is ${v}`,
              "Is cannot take this base action verb in a neutral present-simple question.",
            ],
            [`to ${v}`, "A to-infinitive is not a finite predicate after who."],
          ],
          "The missing person is the **subject**, not the object.",
        ),
        Q(
          "matching-short-answer",
          `“Did they ${v} ${o} yesterday?” Complete the positive short answer: “Yes, they ____.”`,
          "did",
          "Repeat **did**, the auxiliary from the past-simple question.",
          [
            ["do", "Do changes the short answer to present time."],
            [
              "were",
              "Were does not match the auxiliary family of this question.",
            ],
            [
              "have",
              "Have would answer a perfect question, not one beginning with did.",
            ],
          ],
          "Match the short answer’s auxiliary to the question.",
        ),
      ],
    ),
    define(
      "imperatives",
      "Commands, requests and suggestions",
      "A1",
      "bc-verbs-reference",
      "Give instructions with a base verb, make them negative, and suggest actions together.",
      [
        L(
          "The unspoken subject",
          "An imperative often begins with the **base verb**. Its subject you is usually understood. This lets instructions be short without being incomplete sentences. Tone and context determine whether an imperative is helpful, firm or rude.",
          "**Open** the window. / **Please wait** here.",
          "Do not add -s to an imperative, even when one person receives the instruction.",
        ),
        L(
          "Negative instructions",
          "Use **do not / don’t + base verb** for a prohibition or negative instruction. This also applies to be in a command: Don’t be late. Ordinary statements with be have a different negative pattern.",
          "**Don’t touch** the switch. / **Do not be** late.",
          "Not touch the switch is not the usual full imperative form.",
        ),
        L(
          "Suggestions with let’s",
          "Use **let’s + base verb** to propose an action involving the speaker and other people. Let’s is a contraction of let us in this use. The negative is usually let’s not + base verb.",
          "**Let’s take** a break. / **Let’s not hurry**.",
          "Lets without an apostrophe is a different verb form: she lets us leave.",
        ),
        L(
          "Polite requests",
          "Please can soften an instruction. Modal questions with could or would often make a request less direct. After could you or would you, retain the base verb. Please does not make every command appropriate; relationship and situation matter.",
          "**Could you close** the door, please?",
          "Would you mind takes an -ing form: Would you mind closing the door? It is a different pattern.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "positive-command",
          `Give a direct instruction: “____ ${o}, please.”`,
          cap(v),
          `An imperative starts with the base verb **${v}**; the subject you is understood.`,
          [
            [cap(s), "An imperative does not take third-person -s."],
            [cap(p), "A past form does not make a present instruction."],
            [
              `To ${v}`,
              "A to-infinitive is not the ordinary direct imperative.",
            ],
          ],
          "Use a **base verb** for the instruction.",
        ),
        Q(
          "negative-command",
          `Give a negative instruction: “Do not ____ ${o} yet.”`,
          v,
          `After **do not**, keep the base form **${v}**.`,
          [
            [
              s,
              "Do not already supplies the auxiliary; remove third-person -s.",
            ],
            [g, "The imperative after do not needs the base verb, not -ing."],
            [`to ${v}`, "Do not takes a bare infinitive, without to."],
          ],
          "Build **do not + base verb**.",
        ),
        Q(
          "shared-suggestion",
          `Suggest doing the task together: “Let’s ____ ${o} now.”`,
          v,
          `**Let’s** takes base **${v}** and includes the speaker in the suggestion.`,
          [
            [g, "The -ing form does not follow let’s directly."],
            [s, "Third-person agreement is not used after let’s."],
            [`to ${v}`, "Let’s takes an infinitive without to."],
          ],
          "After **let’s**, choose the bare infinitive.",
        ),
        Q(
          "polite-modal-request",
          `Complete the polite request: “Could you ____ ${o}, please?”`,
          v,
          `After modal **could**, use base **${v}**. The question functions as a request.`,
          [
            [s, "A modal is not followed by a third-person -s form."],
            [g, "Could requires the base verb here, not an -ing form."],
            [`to ${v}`, "There is no to after could in this request."],
          ],
          "Could makes the request less direct, but the following verb still uses its **base form**.",
        ),
      ],
    ),
    define(
      "adverbs-position",
      "Adverbs of frequency, manner and position",
      "A2",
      "bc-adverbials",
      "Describe how often and how an action happens, while placing the adverb where its meaning is clear.",
      [
        L(
          "Frequency before the main verb",
          "Frequency adverbs such as usually, often and never normally go before an ordinary lexical verb. Their position may shift for focus, but neutral order gives a reliable starting point. Never is already negative in meaning.",
          "She **usually walks**. / They **never complain**.",
          "Do not add not merely because never is negative: they never complain is already negative in meaning.",
        ),
        L(
          "After be and after the first auxiliary",
          "With main-verb be, a frequency adverb usually follows be. With a multi-part verb phrase, it often follows the first auxiliary. Always can appear in other positions for emphasis; these are neutral-order exercises.",
          "She is **usually** early. / They have **often** visited.",
          "She usually is early can be emphatic, so a neutral-order instruction is needed when comparing positions.",
        ),
        L(
          "Manner and adjective forms",
          "A manner adverb describes how an action is done. Many are formed with -ly, but not all: fast and hard are common adverbs without -ly. An adjective usually describes a noun or follows a linking verb.",
          "They worked **carefully**. / The work was **careful**.",
          "Hard means with effort; hardly means almost not. They are not ordinary form variants with the same meaning.",
        ),
        L(
          "Keep the object beside its verb",
          "A short manner adverb often goes after the object, or before the main verb. Do not normally put it between a transitive verb and its direct object. Position also changes scope: only can focus on different parts of a sentence.",
          "She read **the letter carefully**.",
          "She read carefully the letter is awkward neutral order; put carefully after the object or before read.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "neutral-frequency",
          `Choose neutral word order for a routine involving ${o}.`,
          `She usually ${s} ${o}.`,
          "The frequency adverb **usually** normally precedes the lexical verb in neutral order.",
          [
            [
              `She ${s} usually ${o}.`,
              "This puts usually between the transitive verb and its object.",
            ],
            [
              `She ${s} ${o} usuallys.`,
              "Usually is an adverb and does not take an -s agreement ending.",
            ],
            [
              `She usual ${s} ${o}.`,
              "Usual is an adjective; this position requires the adverb usually.",
            ],
          ],
          "Place **usually before the main lexical verb**, while keeping verb and object together.",
        ),
        Q(
          "frequency-after-be",
          `Use the adverb, not the adjective: “The assistant is ____ ready to ${v} ${o}.”`,
          "usually",
          "After be, **usually** gives the frequency of the state ready.",
          [
            [
              "usual",
              "Usual is an adjective and cannot modify ready as a frequency adverb here.",
            ],
            ["usuals", "Usuals is not the frequency adverb."],
            [
              "usualness",
              "A noun naming a quality does not supply the needed frequency adverb.",
            ],
          ],
          "The blank modifies how often the assistant is ready, so it needs a **frequency adverb**.",
        ),
        Q(
          "manner-adverb",
          `Describe the action’s manner: “They ${v} ${o} ____.”`,
          "carefully",
          "**Carefully** tells us how they perform the action.",
          [
            [
              "careful",
              "Careful is an adjective; the task asks for an adverb describing the action.",
            ],
            ["carefulness", "Carefulness is a noun, not a manner adverb."],
            ["care", "Care is not the required manner adverb."],
          ],
          "Ask **how?** about the action, rather than asking what the person is like.",
        ),
        Q(
          "manner-word-order",
          `Keep the object beside the verb in this neutral sentence about ${o}.`,
          `They ${p} ${o} carefully.`,
          "The direct object follows the verb, and **carefully** follows the object.",
          [
            [
              `They ${p} carefully ${o}.`,
              "The adverb separates the transitive verb from its object in an awkward neutral order.",
            ],
            [
              `They careful ${p} ${o}.`,
              "Careful is an adjective, not the adverb needed here.",
            ],
            [
              `They ${p} ${o} carefulness.`,
              "Carefulness is a noun and does not modify the action in this position.",
            ],
          ],
          "Keep **verb + object** together, then add the manner adverb.",
        ),
      ],
    ),
    define(
      "modals-ability",
      "Ability, possibility and permission: can and could",
      "A2",
      "bc-past-ability",
      "Use basic modals for ability and permission, and distinguish general past ability from a successful event.",
      [
        L(
          "A modal keeps the next verb simple",
          "Can and could take a **base verb without to**. They do not take third-person -s. Can commonly describes present ability or informal permission. The surrounding context distinguishes those meanings.",
          "She **can swim**. / You **can leave** now.",
          "She cans swim and she can to swim are not standard modal constructions.",
        ),
        L(
          "Questions and negatives",
          "Move the modal before the subject in a question. Put not after it for a negative. Cannot is normally written as one word; can’t is its common contraction. No do or does is needed.",
          "**Can** they help? / They **cannot help**.",
          "Do they can help? adds an unnecessary auxiliary.",
        ),
        L(
          "General past ability",
          "Could can describe a general ability in the past. For one successful achievement on a particular occasion, affirmative was/were able to or managed to is often more natural. Could is still possible for perception and some mental processes.",
          "As a child, she **could swim**. / Yesterday, she **managed to escape**.",
          "Could not can describe failure on one occasion; the restriction mainly concerns affirmative achievement.",
        ),
        L(
          "Permission and polite requests",
          "Can I asks permission; could I is often more tentative. Could you commonly makes a polite request, not a claim about past ability. Be able to supplies forms unavailable to can, such as will be able to.",
          "**Could you help** me? / I’ll **be able to come**.",
          "Do not stack two central modals: will can is not standard. Use will be able to.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "present-ability",
          `Express ability: “The assistant can ____ ${o} without help.”`,
          v,
          `**Can** takes base **${v}**, even after a singular subject.`,
          [
            [
              s,
              "Central modals do not allow third-person -s on the following verb.",
            ],
            [g, "Can alone does not take an -ing form."],
            [`to ${v}`, "Can takes a bare infinitive, without to."],
          ],
          "Ability is expressed by **can + base verb**.",
        ),
        Q(
          "modal-question",
          `Ask about ability: “____ she ${v} ${o}?”`,
          "Can",
          "**Can** moves before she; no do is added.",
          [
            ["Does can", "Do-support is not added to a can question."],
            ["Cans", "Can does not take an -s ending."],
            ["Is can", "Be is not added before can."],
          ],
          "A modal forms its own question by moving before the subject.",
        ),
        Q(
          "past-achievement",
          `Use managed to for one successful event: “Yesterday, we managed to ____ ${o} despite the difficulty.”`,
          v,
          `**Managed to ${v}** describes successful completion on that occasion.`,
          [
            [s, "The infinitive after to has no -s ending."],
            [
              g,
              "Managed in this meaning takes a to-infinitive, not to + -ing.",
            ],
            [p, "The past marking is on managed, not on the infinitive."],
          ],
          "After **managed to**, the next verb returns to its base form.",
        ),
        Q(
          "future-ability",
          `Express future ability with able: “Next month, they will ____ ${o} without help.”`,
          `be able to ${v}`,
          `After **will**, use **be able to ${v}**; this supplies future ability without stacking modals.`,
          [
            [
              `can ${v}`,
              "Will can combines two central modals, which standard English does not allow.",
            ],
            [`are able to ${v}`, "After will, be must stay in its base form."],
            [`be able ${v}`, "Able requires to before the infinitive."],
          ],
          "Can has no infinitive form; use **be able to** after will.",
        ),
      ],
    ),
  ];
}

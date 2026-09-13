import { define, task as Q } from "./engine.mjs";
import { actions, nouns } from "./contexts.mjs";
const L = (...a) => a;
export function buildModifiers() {
  return [
    define(
      "determiners-quantifiers",
      "Determiners: some, any, each, all and neither",
      "A2",
      "bc-determiners",
      "Choose quantity and reference words from number, meaning and the type of noun phrase.",
      [
        L(
          "Some and any",
          "Some is common in positive statements; any is common in negatives and open questions. Some is also natural in offers and requests when a positive response is anticipated. Any can mean it does not matter which in positive clauses.",
          "Would you like **some** tea? / Choose **any** seat.",
          "Some and any are not fixed positive/negative opposites in every context.",
        ),
        L(
          "Every and each",
          "Every and each usually take a singular count noun and singular agreement. Every views the members as a complete group; each foregrounds them individually. Each of takes a plural noun phrase but the head each remains singular.",
          "**Every student has** a book. / **Each of the students has** one.",
          "Every students mixes a singular determiner pattern with a plural noun.",
        ),
        L(
          "Both, either and neither",
          "Both refers to two together. Either selects one of two or leaves either choice open. Neither excludes both. Before a noun, either and neither usually take a singular count form; both takes plural. Usage after neither of can vary, especially informally.",
          "**Both seats are** free. / **Neither seat is** free.",
          "Do not add not to neither merely to express the same negative meaning.",
        ),
        L(
          "All, most and of",
          "Use all or most directly before a general plural noun. Before a determiner or object pronoun, use an of-pattern where required: most of the books, all of them. All can often omit of before the: all the books.",
          "**Most books** / **Most of the books** / **All of them**",
          "Most the books is missing of. Avoid assuming all and most have identical rules in every pattern.",
        ),
      ],
      nouns,
      ({ one, many }) => [
        Q(
          "every-singular-agreement",
          `“Every ${one} in this picture ____ a label.”`,
          "has",
          `**Every ${one}** is singular, so its verb is **has**.`,
          [
            ["have", "Every takes singular agreement in this pattern."],
            ["having", "Having alone is not a finite verb."],
            ["to have", "A to-infinitive cannot be the finite predicate."],
          ],
          "Every presents the members one at a time: use **singular agreement**.",
        ),
        Q(
          "both-plural-agreement",
          `“Both ${many} shown here ____ clearly labelled.”`,
          "are",
          "**Both** selects two things and takes plural agreement.",
          [
            ["is", "Is is singular; both refers to two."],
            ["am", "Am agrees only with I."],
            ["be", "Be is not a finite present form here."],
          ],
          "Both means **the two together**.",
        ),
        Q(
          "most-of-determined",
          `“Most ____ the ${many} in the picture are labelled.”`,
          "of",
          "Before **the + noun**, most uses **of**.",
          [
            ["—", "Most the ... omits the required of."],
            ["to", "To does not form this partitive pattern."],
            [
              "than",
              "Than is used in comparisons, not after most in this quantity phrase.",
            ],
          ],
          "There is already a determiner **the**, so use **most of the**.",
        ),
        Q(
          "neither-meaning",
          `Exactly two ${many} were considered, and neither was selected. What does “neither” mean here?`,
          "Not one and not the other.",
          "**Neither** excludes both members of the stated pair.",
          [
            ["Both were selected.", "That is the opposite of neither."],
            [
              "One was selected, but we do not know which.",
              "That would leave one selected; neither excludes both.",
            ],
            [
              "All but one were selected.",
              "With two items, that would select one, contradicting neither.",
            ],
          ],
          "The context names **two choices** and excludes each of them.",
        ),
      ],
    ),
    define(
      "adjective-order",
      "Adjectives: position, order and noun phrases",
      "A2",
      "bc-adjectives",
      "Describe nouns clearly and recognise the usual ordering of several adjectives.",
      [
        L(
          "Before a noun or after a linking verb",
          "Many adjectives can come before a noun or after be, seem and other linking verbs. They describe a quality of the noun or subject. English adjectives do not normally change for plural number.",
          "a **quiet** room / The rooms are **quiet**.",
          "Quiet rooms does not become quiets rooms. Number is normally marked on the noun.",
        ),
        L(
          "Usual adjective order",
          "A useful neutral order is opinion, size, age, shape, colour, origin, material, purpose, then noun. This is a strong tendency rather than an absolute law. Writers may change order for emphasis or grouping, and long strings are usually avoided.",
          "a **lovely small old wooden** box",
          "Do not overload a noun with every category; two or three relevant details are normally clearer.",
        ),
        L(
          "Linking verbs take descriptive adjectives",
          "After a linking verb, an adjective describes the subject rather than the manner of an action. Compare The soup smells good with She smells the flower carefully. The verb’s role determines the modifier.",
          "The plan **sounds useful**.",
          "Sounds usefully is not the normal way to say the plan itself seems useful.",
        ),
        L(
          "Restricted positions",
          "Some adjectives commonly prefer one position. Asleep and afraid are usually predicative: the child is asleep. Main and former usually come before nouns. Learn these restrictions with the individual adjective rather than assuming every adjective moves freely.",
          "the **main** road / The child is **asleep**.",
          "An asleep child is less usual than a sleeping child; dictionary examples help with such lexical restrictions.",
        ),
      ],
      actions,
      ({ v, g, o }) => [
        Q(
          "adjective-linking",
          `Describe the task’s quality: “The plan to ${v} ${o} sounds ____.”`,
          "useful",
          "Sounds is a linking verb here, so **useful** describes the plan.",
          [
            [
              "usefully",
              "Usefully is an adverb and would describe manner, not the plan’s quality after linking sounds.",
            ],
            ["usefulness", "Usefulness is a noun, not the required adjective."],
            ["use", "Use is not the descriptive adjective needed here."],
          ],
          "The sentence evaluates **the plan**, not how someone makes a sound.",
        ),
        Q(
          "adjective-number",
          `Complete the plural noun phrase: “We need ____ instructions to ${v} ${o}.”`,
          "clear",
          "The adjective **clear** does not change to match plural instructions.",
          [
            [
              "clears",
              "Adjectives do not normally add a plural -s in English.",
            ],
            [
              "clearly",
              "Clearly is an adverb, not the adjective before instructions.",
            ],
            [
              "clearness",
              "Clearness is a noun and does not supply this adjective.",
            ],
          ],
          "The noun is plural, but the **adjective stays unchanged**.",
        ),
        Q(
          "neutral-adjective-order",
          `Choose the usual neutral adjective order for the box of supplies used to ${v} ${o}.`,
          "a small old wooden box",
          "The ordinary sequence here is **size → age → material → noun**.",
          [
            [
              "a wooden old small box",
              "This reverses the usual size–age–material ordering.",
            ],
            [
              "an old wooden small box",
              "Small normally comes before age and material in the neutral sequence.",
            ],
            [
              "a small wooden olds box",
              "Old does not take a plural -s and normally precedes the material adjective.",
            ],
          ],
          "Order these categories: **size, age, material**.",
        ),
        Q(
          "predicative-adjective",
          `Choose an adjective after be: “The assistant is ____ of ${g} ${o} alone.”`,
          "afraid",
          "**Afraid of** is a predicative adjective pattern describing the assistant’s state.",
          [
            ["fear", "Fear is a noun or verb, not this adjective after is."],
            [
              "fearfully",
              "Fearfully is an adverb and does not fill the adjective slot.",
            ],
            ["afraids", "Afraid does not take an -s ending."],
          ],
          "The slot after **is** describes a state and is followed by the preposition **of**.",
        ),
      ],
    ),
    define(
      "degree-comparison",
      "Degree: too, enough, so, such and comparison modifiers",
      "B1",
      "bc-degree",
      "Express degree, sufficiency and excess, and make comparisons more precise.",
      [
        L(
          "Too means more than wanted",
          "Too + adjective/adverb means an excessive degree for the situation, often followed by a to-infinitive explaining the consequence. It is not simply a stronger version of very. Very hot can be a neutral description; too hot means a limit is exceeded.",
          "The soup is **too hot to drink**.",
          "Too delicious usually does not mean very delicious unless there is a real problematic excess in context.",
        ),
        L(
          "Enough has two positions",
          "Enough normally follows an adjective or adverb but precedes a noun. It means the required amount or degree has been reached. A following infinitive can explain the purpose.",
          "**clear enough** / **enough time**",
          "Enough clear and time enough are not the neutral patterns practised here, though literary placements may differ.",
        ),
        L(
          "So and such",
          "So usually modifies an adjective or adverb. Such modifies a noun phrase, with a/an before a singular count noun. So also combines with much, many, little and few to express quantity.",
          "**so useful** / **such a useful guide** / **so many guides**",
          "Such useful a guide puts the article in the wrong position for this ordinary pattern.",
        ),
        L(
          "Modify comparisons and adjective strength",
          "Much, far and a little can modify a comparative; very does not normally do so directly. Extreme adjectives often take absolutely rather than very. Ordinary adjectives can take very or quite. The acceptable combinations are partly lexical and depend on the adjective’s sense.",
          "**much easier** / **a little easier** / **absolutely exhausted**",
          "Very easier is not the ordinary comparative pattern. Some adjectives have both gradable and non-gradable senses.",
        ),
      ],
      actions,
      ({ v, o }) => [
        Q(
          "enough-adjective-order",
          `The instructions let us do the task. “They are ____ to help us ${v} ${o}.”`,
          "clear enough",
          "Enough follows the adjective: **clear enough**.",
          [
            ["enough clear", "Enough normally follows an adjective."],
            [
              "clearly enough",
              "The adjective describes the instructions; clearly is an adverb.",
            ],
            [
              "enough clearly",
              "This uses an adverb and reverses its normal relation to enough.",
            ],
          ],
          "Enough follows **adjectives**, but precedes **nouns**.",
        ),
        Q(
          "enough-noun-order",
          `“We have ____ to ${v} ${o} before lunch.”`,
          "enough time",
          "Enough precedes the noun: **enough time**.",
          [
            ["time enoughs", "Enough does not have this plural form."],
            [
              "enough times",
              "Times would count occasions rather than the amount of time intended here.",
            ],
            ["enoughly time", "Enoughly is not the standard form."],
          ],
          "Time here is an **uncountable amount**, so use enough before the noun.",
        ),
        Q(
          "such-noun-phrase",
          `“It is ____ useful task to ${v} ${o}.”`,
          "such a",
          "Before singular count task with an adjective, use **such a useful task**.",
          [
            ["so a", "So does not take this article + adjective + noun order."],
            [
              "such",
              "The singular count noun needs the article in this phrase.",
            ],
            ["a such", "The neutral order is such a, not a such."],
          ],
          "The modifier introduces a **singular count noun phrase**, not just an adjective.",
        ),
        Q(
          "comparative-modifier",
          `Choose the degree modifier that fits: “It is ____ easier to ${v} ${o} with help.”`,
          "much",
          "**Much** can modify comparative easier to show a large difference.",
          [
            ["very", "Very does not normally modify a comparative directly."],
            ["many", "Many counts plural nouns, not a comparative adjective."],
            [
              "such",
              "Such normally modifies a noun phrase, not easier by itself.",
            ],
          ],
          "Easier is already **comparative**; choose a modifier that works with comparisons.",
        ),
      ],
    ),
    define(
      "reflexive-reciprocal",
      "Reflexive and reciprocal pronouns",
      "B1",
      "bc-reflexive",
      "Distinguish doing something to yourself, doing it alone and doing it to one another.",
      [
        L(
          "The same participant twice",
          "A reflexive pronoun can be used when the subject and object refer to the same person or thing. Its form matches the subject: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves.",
          "She introduced **herself**.",
          "Her and herself are not interchangeable: her normally refers to someone other than the subject in this example.",
        ),
        L(
          "Emphasis and independence",
          "A reflexive can emphasise that the subject personally did the action. **By + reflexive** usually means alone or without help. **For + reflexive** means for one’s own benefit. These meanings are related but not identical.",
          "I made it **myself**. / I did it **by myself**.",
          "By myself says without company or help; for myself says who benefits.",
        ),
        L(
          "Reciprocal actions",
          "Each other and one another express a reciprocal relationship: A acts on B and B acts on A. They are not equivalent to themselves, where each participant’s action returns to that same participant.",
          "They introduced **each other**.",
          "They looked at themselves means each looked at their own reflection; each other means they looked across at one another.",
        ),
        L(
          "Use a reflexive only when its role needs one",
          "Ordinary English often omits reflexives with routine personal-care verbs: she washed and dressed. A reflexive is not a generally more polite substitute for me or I. In a coordinated subject, use I in formal standard prose.",
          "Please contact Sam or **me**.",
          "Please contact myself is not the ordinary formal choice when no matching subject creates a reflexive relationship.",
        ),
      ],
      actions,
      ({ v, p, o }) => [
        Q(
          "singular-reflexive",
          `“She ${p} ${o} by ____.” Choose the matching reflexive.`,
          "herself",
          "**Herself** matches the feminine singular subject she; by herself means without help or company.",
          [
            ["himself", "Himself does not match she."],
            [
              "themselves",
              "Themselves does not match the explicitly supplied she in this exercise.",
            ],
            [
              "her",
              "After by in the alone meaning, use the reflexive herself, not object her.",
            ],
          ],
          "Match the reflexive to **she**, and recognise **by herself**.",
        ),
        Q(
          "plural-reflexive",
          `“We ${p} ${o} by ____.”`,
          "ourselves",
          "The plural first-person subject we takes **ourselves**.",
          [
            ["myself", "Myself is singular and matches I, not we."],
            ["ourself", "The ordinary plural reflexive for we is ourselves."],
            [
              "us",
              "The alone/without-help expression needs a reflexive after by.",
            ],
          ],
          "We requires the plural first-person reflexive **ourselves**.",
        ),
        Q(
          "reciprocal-meaning",
          `“The two assistants helped each other to ${v} ${o}.” What does “each other” show?`,
          "Each assistant helped the other assistant.",
          "**Each other** expresses a reciprocal action between the two assistants.",
          [
            [
              "Each assistant helped only themselves.",
              "That would be reflexive, not reciprocal.",
            ],
            [
              "Only one assistant received help.",
              "The stated reciprocal relationship goes both ways.",
            ],
            [
              "Neither assistant received help.",
              "This contradicts helped each other.",
            ],
          ],
          "A reciprocal action goes **from A to B and from B to A**.",
        ),
        Q(
          "ordinary-object-pronoun",
          `“The supervisor asked Sam and ____ to ${v} ${o}.” Choose the standard object pronoun for the speaker.`,
          "me",
          "Sam and **me** is the object of asked; removing Sam and leaves asked me.",
          [
            [
              "I",
              "I is a subject pronoun, but the phrase is the object of asked.",
            ],
            [
              "myself",
              "The subject is the supervisor, so myself has no matching subject for an ordinary reflexive use.",
            ],
            [
              "mine",
              "Mine is possessive and cannot be the person object here.",
            ],
          ],
          "Test the role without the other name: **asked me**.",
        ),
      ],
    ),
    define(
      "linking-clauses",
      "Linking clauses: time, reason, purpose and result",
      "B1",
      "dfe-grammar",
      "Connect ideas with the right kind of clause or phrase, and keep their logical relationship clear.",
      [
        L(
          "Coordinating complete ideas",
          "And, but and or can connect words, phrases or clauses of equal status. When linking two independent clauses, punctuation helps mark the boundary. Choose the connector from the intended relation: addition, contrast or alternative.",
          "We checked the route, **and** we booked the tickets.",
          "A connector should express the intended relation; grammatical sentences can still communicate the wrong logic.",
        ),
        L(
          "Reasons: because and because of",
          "Because introduces a finite clause with a subject and verb. Because of introduces a noun phrase or an -ing expression. The meaning may be similar, but the grammar following the connector differs.",
          "**Because it rained**, we stayed. / **Because of the rain**, we stayed.",
          "Because of it rained puts a finite clause after a preposition phrase without the structure needed for it.",
        ),
        L(
          "Purpose and result",
          "A to-infinitive often gives purpose when its understood subject matches the main subject. So that can introduce a finite purpose clause, especially when the subjects differ. So and therefore can introduce results, but therefore behaves as an adverb and needs suitable sentence punctuation.",
          "I spoke slowly **so that everyone could follow**.",
          "Therefore cannot always replace so between two clauses with the same punctuation; avoid a comma splice.",
        ),
        L(
          "Time clauses and sequence",
          "When, while, before, after, until and as soon as describe different temporal relations. While often accompanies an activity in progress; until describes continuation up to a point. In an ordinary future time clause, use a present form rather than will.",
          "I’ll wait **until you arrive**.",
          "By Friday gives a deadline; until Friday says something continues to Friday. They are not interchangeable.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "because-finite-clause",
          `“We were tired ____ we had ${p} ${o} all morning.”`,
          "because",
          "**Because** introduces the reason as a finite clause: we had ... .",
          [
            [
              "because of",
              "Because of normally takes a noun phrase or -ing expression, not this finite clause.",
            ],
            [
              "despite",
              "Despite would need a noun phrase and would express contrast, not the stated reason.",
            ],
            ["during", "During takes a noun phrase, not a finite clause."],
          ],
          "The reason has its own **subject and verb**.",
        ),
        Q(
          "because-of-noun",
          `“We could not ${v} ${o} ____ the power cut.”`,
          "because of",
          "The reason is a noun phrase, **the power cut**, so use **because of**.",
          [
            [
              "because",
              "Because requires a finite reason clause rather than this noun phrase alone.",
            ],
            [
              "although",
              "Although normally introduces a finite clause and gives contrast rather than this reason.",
            ],
            [
              "while",
              "While would normally introduce a clause, not this bare reason phrase.",
            ],
          ],
          "The reason is a **noun phrase**, so choose because of.",
        ),
        Q(
          "purpose-so-that",
          `Express purpose with a different subject: “I brought the instructions ____ you could ${v} ${o}.”`,
          "so that",
          "**So that** introduces a finite purpose clause whose subject is you.",
          [
            [
              "in order to",
              "In order to needs a base verb immediately, not you could.",
            ],
            [
              "because of",
              "Because of cannot introduce this finite purpose clause.",
            ],
            [
              "despite",
              "Despite both changes the relation and requires a different complement.",
            ],
          ],
          "The purpose clause has its own subject **you** and modal **could**.",
        ),
        Q(
          "during-while",
          `Use the time preposition before an -ing noun phrase: “The error occurred during the process of ____ ${o}.”`,
          g,
          `After preposition **of**, use **${g}** to name the process.`,
          [
            [
              v,
              "A base verb does not supply the noun-like complement after of.",
            ],
            [
              `to ${v}`,
              "A to-infinitive cannot directly follow of in this pattern.",
            ],
            [p, "A past form does not name the process after of."],
          ],
          "The preposition **of** needs a noun-like complement: use the **-ing form**.",
        ),
      ],
    ),
    define(
      "contrast-concession",
      "Contrast and concession: although, despite and whereas",
      "B2",
      "bc-contrast",
      "Show that two ideas contrast, or that something happens in spite of an obstacle.",
      [
        L(
          "Although and even though",
          "Although, though and even though introduce a subordinate clause. They present information that contrasts with the main clause or might have led to a different expectation. Even though often makes the contrast stronger.",
          "**Although it rained**, we went out.",
          "Do not normally combine although and but to mark the same relation in one standard sentence.",
        ),
        L(
          "Despite and in spite of",
          "Despite and in spite of take a noun phrase or -ing expression. To follow them with a finite clause, use the fact that. Despite does not itself take of.",
          "**Despite the rain**, we went out. / **Despite the fact that it rained**, we went out.",
          "Despite of is not the standard phrase; use despite or in spite of.",
        ),
        L(
          "Whereas and while",
          "Whereas and contrastive while compare two facts, preferences or situations. While also has a time meaning, so ensure that context makes the contrast clear. Whereas is particularly useful when balancing one fact against another.",
          "She likes tea, **whereas** he prefers coffee.",
          "Whereas normally introduces a clause, not a noun phrase by itself.",
        ),
        L(
          "However and nevertheless",
          "However and nevertheless are linking adverbs, not ordinary coordinating conjunctions. They can start a new sentence or follow a semicolon between independent clauses. Their punctuation differs from but even when the contrast is similar.",
          "It rained**; however,** we went out.",
          "It rained, however we went out is a comma splice in ordinary formal prose.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "although-clause",
          `“____ we had ${p} ${o}, the supervisor asked for another check.”`,
          "Although",
          "**Although** introduces a finite concession clause with subject we and verb had ... .",
          [
            [
              "Despite",
              "Despite normally takes a noun phrase or -ing expression, not this finite clause directly.",
            ],
            [
              "In spite",
              "The complete phrase is in spite of, and it still needs a suitable complement.",
            ],
            [
              "However",
              "However is a linking adverb and does not subordinate this clause in the same way.",
            ],
          ],
          "The contrast is expressed by a **full finite clause**.",
        ),
        Q(
          "despite-gerund",
          `“Despite ____ ${o}, we still had plenty to do.”`,
          g,
          `After **despite**, use **${g}** to express the conceded activity.`,
          [
            [v, "A bare base verb does not follow despite in this pattern."],
            [`to ${v}`, "Despite does not take a to-infinitive here."],
            [p, "A past form alone does not form the required complement."],
          ],
          "Despite is followed by a **noun phrase or -ing clause**.",
        ),
        Q(
          "despite-of-error",
          `Choose the correct concession phrase: “____ the difficulty, we managed to ${v} ${o}.”`,
          "In spite of",
          "**In spite of** is the complete three-word phrase before the noun phrase.",
          [
            ["Despite of", "Despite does not take of."],
            ["In spite", "In spite requires of before this noun phrase."],
            [
              "Although of",
              "Although introduces a clause and does not form although of.",
            ],
          ],
          "Distinguish the fixed forms **despite** and **in spite of**.",
        ),
        Q(
          "however-punctuation",
          `Choose formal punctuation linking two complete clauses: “We ${p} ${o} ____ however, the supervisor requested a change.”`,
          ";",
          "A **semicolon** separates the independent clauses before linking adverb however.",
          [
            [",", "A comma alone would create a comma splice."],
            ["no punctuation", "The clauses would run together."],
            ["of", "Of cannot connect these independent clauses."],
          ],
          "However is a **linking adverb**; it does not make a comma alone sufficient.",
        ),
      ],
    ),
    define(
      "noun-modifiers",
      "Noun modifiers, compound phrases and nominalisation",
      "C1",
      "bc-noun-modifiers",
      "Build compact noun phrases and understand how turning actions into nouns changes a sentence’s focus.",
      [
        L(
          "Nouns can modify other nouns",
          "A noun before another noun often classifies its purpose or type. The final noun is usually the head and controls number and agreement. The first noun often stays singular: a book shelf, two book shelves. Some established compounds keep a plural modifier.",
          "a **shoe shop** / two **shoe shops**",
          "A sports centre is an established plural modifier. The singular-modifier pattern has lexical exceptions.",
        ),
        L(
          "Measure compounds before nouns",
          "A measurement used as a compound modifier usually has a singular unit and is often hyphenated. When the same measurement follows the noun as a separate phrase, the unit can be plural.",
          "a **three-hour** journey / a journey of **three hours**",
          "A three-hours journey incorrectly pluralises the unit inside the usual compound modifier.",
        ),
        L(
          "Possessive relationships and of phrases",
          "A possessive can express relationships beyond ownership, including time and association. Noun modifiers often classify; possessives often identify a particular relationship. An of phrase may be clearer with long or abstract noun phrases.",
          "a **day’s** work / the roof **of the building**",
          "A children’s book and a child’s book can differ: the former can name a category, the latter a book belonging to one child.",
        ),
        L(
          "Nominalisation and clarity",
          "Nominalisation turns an action or quality into a noun, often useful in academic writing: decide → decision, develop → development. It can make a process the subject of a sentence but can also hide who acted. Keep the agent explicit when responsibility matters.",
          "We decided quickly. → **Our decision** was quick.",
          "Long strings of abstract nouns are not automatically clearer or more precise than verbs.",
        ),
      ],
      actions,
      ({ v, p, g, o }, i) => {
        const n = 2 + (i % 8);
        return [
          Q(
            "measure-compound",
            `Choose the modifier: “It is a ____ task to ${v} ${o}.”`,
            `${n}-hour`,
            `A compound measurement before task uses a singular unit: **${n}-hour**.`,
            [
              [
                `${n}-hours`,
                "The unit stays singular inside this compound modifier.",
              ],
              [
                `${n} hours'`,
                "This is a possessive-shaped duration, not the adjective compound after a.",
              ],
              [
                `${n}-hourly`,
                "Hourly means occurring each hour, not lasting this many hours.",
              ],
            ],
            "Before a noun, build **number + singular unit** as a compound modifier.",
          ),
          Q(
            "measure-after-noun",
            `“The task of ${g} ${o} took ${n} ____.”`,
            "hours",
            "After the verb took, the measurement is a normal plural noun phrase: **hours**.",
            [
              [
                "hour",
                "The number is greater than one, so the separate measure noun is plural.",
              ],
              [
                "hourly",
                "Hourly is an adjective/adverb, not the unit noun required here.",
              ],
              [
                "hour’s",
                "A possessive apostrophe is not needed to state this duration.",
              ],
            ],
            "This measurement stands **after the verb**, outside a compound modifier.",
          ),
          Q(
            "one-day-possession",
            `Choose the possessive duration: “We completed a ____ work on ${o}.”`,
            "day’s",
            "A singular time unit in the possessive takes **’s**: a day’s work.",
            [
              ["days’", "Days’ is plural possession, but a specifies one day."],
              [
                "days",
                "A plain plural lacks the possessive marking and conflicts with a.",
              ],
              [
                "day",
                "The requested duration phrase is possessive: a day’s work.",
              ],
            ],
            "The article **a** specifies one day, and the phrase asks for its possessive form.",
          ),
          Q(
            "nominalisation-agent",
            `“A decision was made to ${v} ${o}.” Which revision names the decision-maker clearly?`,
            `The committee decided to ${v} ${o}.`,
            "The active verb and explicit subject **the committee** identify who made the decision.",
            [
              [
                `A decision about ${o} was made.`,
                "This still omits who made the decision.",
              ],
              [
                `The making of a decision to ${v} ${o} occurred.`,
                "The nominalised wording still hides the decision-maker.",
              ],
              [
                `It was decided to ${v} ${o}.`,
                "This impersonal passive also omits the decision-maker.",
              ],
            ],
            "Look for an explicit **actor as subject**, not just a noun naming the decision.",
          ),
        ];
      },
    ),
  ];
}

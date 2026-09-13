import { define, task as Q, row } from "./engine.mjs";
import { actions } from "./contexts.mjs";
const L = (...a) => a;
const phrasals = row(`
turn|turned|on|the lamp|activate the lamp
turn|turned|off|the heater|deactivate the heater
turn|turned|up|the radio volume|increase the radio volume
turn|turned|down|the music|reduce the music’s volume
turn|turned|down|the invitation|refuse the invitation
put|put|on|the coat|dress in the coat
put|put|off|the meeting|postpone the meeting
put|put|away|the dishes|return the dishes to their storage place
put|put|out|the fire|extinguish the fire
put|put|up|the tent|erect the tent
take|took|off|the shoes|remove the shoes
take|took|out|the rubbish|move the rubbish outside
take|took|down|the decorations|remove the decorations from their raised position
take|took|back|the defective kettle|return the defective kettle
take|took|apart|the clock|separate the clock into pieces
pick|picked|up|the parcel|collect the parcel
pick|picked|out|the blue shirt|select the blue shirt
bring|brought|back|the library books|return the library books
bring|brought|up|the problem|mention the problem in conversation
bring|brought|forward|the appointment|move the appointment to an earlier time
call|called|off|the match|cancel the match
call|called|back|the customer|return the customer’s phone call
carry|carried|out|the inspection|perform the inspection
fill|filled|in|the application form|complete the application form
fill|filled|up|the fuel tank|make the fuel tank full
find|found|out|the truth|discover the truth
hand|handed|in|the homework|submit the homework
hand|handed|out|the leaflets|distribute the leaflets
hand|handed|over|the keys|transfer the keys to another person
look|looked|up|the unfamiliar word|find the unfamiliar word in a reference source
make|made|up|the story|invent the story
pay|paid|back|the loan|repay the loan
point|pointed|out|the error|draw attention to the error
set|set|up|the display|arrange the display for use
sort|sorted|out|the problem|resolve the problem
throw|threw|away|the broken toy|discard the broken toy
try|tried|on|the jacket|wear the jacket to check its fit
try|tried|out|the new software|test the new software
write|wrote|down|the address|record the address in writing
work|worked|out|the answer|find the answer by reasoning
cut|cut|up|the vegetables|cut the vegetables into pieces
cut|cut|out|the newspaper article|remove the article by cutting around it
cross|crossed|out|the incorrect word|draw a line through the incorrect word
rub|rubbed|out|the pencil mark|erase the pencil mark
clean|cleaned|up|the kitchen|make the kitchen clean and tidy
wipe|wiped|off|the chalk marks|remove the chalk marks by wiping
wrap|wrapped|up|the gift|cover the gift in wrapping material
lock|locked|up|the shop|secure the shop by locking it
let|let|down|the team|disappoint the team
back|backed|up|the computer files|make a safety copy of the computer files
`).map(([v, p, particle, o, meaning]) => ({ v, p, particle, o, meaning }));
export function buildLexical() {
  return [
    define(
      "phrasal-verbs",
      "Phrasal verbs: meaning and object position",
      "B2",
      "bc-phrasal-order",
      "Learn a verb and its particle together, including whether an object can split them.",
      [
        L(
          "A verb plus particle can have a new meaning",
          "A phrasal verb combines a verb with an adverbial particle such as up, out or off. Its meaning may be literal or idiomatic. Learn the whole expression in context rather than trying to assign one fixed meaning to each particle.",
          "**Call off** a match = cancel it.",
          "Off does not always mean remove: in call off, it contributes to the idiomatic meaning cancel.",
        ),
        L(
          "Separable transitive phrasal verbs",
          "With many transitive phrasal verbs, a noun object can come after the particle or between verb and particle. The 50 expressions in this bank are practised in their separable uses. A long noun object often sounds clearer after the particle.",
          "Turn **the light** off. / Turn off **the light**.",
          "Not all multi-word verbs are separable; this pattern must be learned for the specific verb and meaning.",
        ),
        L(
          "Pronoun objects go in the middle",
          "With a separable phrasal verb, an unstressed object pronoun normally goes between verb and particle. Use turn it off, not turn off it. The verb carries tense; the particle does not change.",
          "She **turned it off**.",
          "She turned off it is not the ordinary object-pronoun order for separable turn off.",
        ),
        L(
          "Inseparable and three-part verbs",
          "Prepositional verbs such as look after keep their preposition before the object: look after her. Three-part expressions such as put up with normally keep the whole sequence before the object. Some phrasal verbs are intransitive and have no object.",
          "Look **after her**. / Put **up with it**. / The plane **took off**.",
          "Take off can be intransitive for a plane departing or separable for removing clothing; meaning changes its structure.",
        ),
      ],
      phrasals,
      ({ v, p, particle, o, meaning }, i) => {
        const pronoun =
          /\b(dishes|shoes|decorations|books|leaflets|keys|vegetables|marks|files)\b/.test(
            o,
          )
            ? "them"
            : "it";
        const alternatives = phrasals
          .filter((x) => x.meaning !== meaning)
          .slice((i + 7) % 30, ((i + 7) % 30) + 3);
        return [
          Q(
            "phrasal-meaning",
            `In “Please ${v} ${particle} ${o}”, what does the phrasal verb mean in this context?`,
            meaning,
            `Here **${v} ${particle}** means **${meaning}**. Learn this verb–particle combination as a unit.`,
            alternatives.map((x) => [
              x.meaning,
              `That would describe “${x.v} ${x.particle} ${x.o}”, not the expression used here.`,
            ]),
            "Use the **whole verb + particle**, and check its meaning against the object.",
          ),
          Q(
            "pronoun-placement",
            `Replace “${o}” with “${pronoun}” in this separable phrasal verb: “Please ${v} ${particle} ${o}.”`,
            `${v} ${pronoun} ${particle}`,
            `An object pronoun goes **between the verb and particle**: ${v} ${pronoun} ${particle}.`,
            [
              [
                `${v} ${particle} ${pronoun}`,
                "With this separable verb, the object pronoun must come before the particle.",
              ],
              [
                `${pronoun} ${v} ${particle}`,
                "This puts the object pronoun before the imperative verb.",
              ],
              [
                `${v} ${pronoun} to ${particle}`,
                "To is not part of this phrasal verb.",
              ],
            ],
            "The object is now a **pronoun**, so place it **in the middle**.",
          ),
          Q(
            "noun-object-separation",
            `Move the noun object between verb and particle, preserving the past tense: “They ${p} ${particle} ${o}.”`,
            `They ${p} ${o} ${particle}.`,
            `This separable use permits **verb + noun object + particle** while keeping ${p} in the past.`,
            [
              [
                `They ${o} ${p} ${particle}.`,
                "The object cannot be placed before the verb in this ordinary statement pattern.",
              ],
              [
                `They ${p} ${o} to ${particle}.`,
                "The added to is not part of the expression.",
              ],
              [
                `They ${particle} ${p} ${o}.`,
                "The particle cannot precede the verb in this structure.",
              ],
            ],
            "A **noun object** can separate this verb and particle.",
          ),
          Q(
            "phrasal-after-did",
            `Keep the phrasal verb after did not: “They did not ____ ${particle} ${o}.”`,
            v,
            `After did not, the verb is base **${v}**; the particle **${particle}** stays unchanged.`,
            [
              [`to ${v}`, "Did not takes a bare infinitive."],
              [
                `${v}s`,
                "The next verb cannot carry a third-person -s after did.",
              ],
              [`been ${v}`, "Been cannot follow did to build this negative."],
            ],
            "Only the verb changes form; after **did not**, use its **base form**.",
          ),
        ];
      },
    ),
    define(
      "dependent-prepositions",
      "Adjectives and verbs with dependent prepositions",
      "B1",
      "bc-dependent-prepositions",
      "Learn prepositions as part of a phrase, and use the right complement after them.",
      [
        L(
          "Learn complete combinations",
          "An adjective or verb often selects a particular preposition: interested in, responsible for, depend on. These are lexical patterns rather than meanings predictable from spatial in/on/at alone. Record the phrase with a short example and its intended sense.",
          "**interested in** music / **depend on** support",
          "Some words allow different prepositions with different meanings; angry with a person and angry about an event are both possible.",
        ),
        L(
          "Prepositions take noun-like complements",
          "After a preposition, use a noun, object pronoun or -ing clause when naming an action. To can itself be a preposition in expressions such as look forward to, where it is followed by -ing rather than a base verb.",
          "look forward to **meeting** you",
          "Do not treat every to as an infinitive marker. Its job depends on the preceding expression.",
        ),
        L(
          "Questions can leave the preposition at the end",
          "A neutral direct question commonly leaves a dependent preposition near the end of its clause. Formal English can place it before whom or which, but this changes register and is not always natural with every multi-word expression.",
          "What are you **interested in**?",
          "Ending an English sentence with a preposition is often entirely grammatical.",
        ),
        L(
          "Keep the preposition in relative clauses",
          "When a relative clause contains a dependent combination, preserve the preposition even if an object relative pronoun is omitted. A formal fronted preposition requires whom or which, not that.",
          "the subject **(that) she is interested in**",
          "The subject which she is interested omits the preposition required by interested in.",
        ),
      ],
      actions,
      ({ v, p, g, o }, i) => {
        const [phrase, prep] = [
          ["interested", "in"],
          ["responsible", "for"],
          ["capable", "of"],
          ["committed", "to"],
          ["accustomed", "to"],
          ["enthusiastic", "about"],
          ["familiar", "with"],
          ["opposed", "to"],
          ["successful", "in"],
          ["tired", "of"],
        ][i % 10];
        const bad = ["at", "by", "from", "under"]
          .filter((x) => x !== prep)
          .slice(0, 3);
        return [
          Q(
            "dependent-combination",
            `“The team is ${phrase} ____ ${g} ${o}.”`,
            prep,
            `In this sense, the combination is **${phrase} ${prep}**.`,
            bad.map((x) => [
              x,
              `“${phrase} ${x}” does not form the required combination for this action complement.`,
            ]),
            `Recall the complete expression with **${phrase}**, rather than a spatial rule.`,
          ),
          Q(
            "preposition-gerund",
            `“The team is ${phrase} ${prep} ____ ${o}.”`,
            g,
            `After preposition **${prep}**, use **${g}** to name the action.`,
            [
              [
                v,
                "The base verb cannot serve as the action complement after this preposition.",
              ],
              [
                `to ${v}`,
                "A to-infinitive does not fit after this dependent preposition.",
              ],
              [
                p,
                "A past form does not name the action after the preposition.",
              ],
            ],
            `Here **${prep}** is a preposition, so the verb after it takes **-ing**.`,
          ),
          Q(
            "question-preposition",
            `Ask about the activity of ${g} ${o}: “What is the team ${phrase} ____?”`,
            prep,
            `The question retains **${phrase} ${prep}**, leaving the preposition at the end.`,
            bad.map((x) => [
              x,
              `The question still needs the preposition in “${phrase} ${prep}”; changing it to ${x} breaks that combination.`,
            ]),
            "Question order does not remove the preposition selected by the adjective.",
          ),
          Q(
            "relative-preposition",
            `Complete the relative clause about ${g} ${o}: “This is the activity that the team is ${phrase} ____.”`,
            prep,
            `The relative clause still needs **${phrase} ${prep}**; that represents the activity governed by the preposition.`,
            [
              [
                "—",
                "Omitting the relative object does not license omitting its required preposition.",
              ],
              [
                bad[0],
                `The adjective takes ${prep} in this sense, not ${bad[0]}.`,
              ],
              [
                bad[1],
                `The adjective takes ${prep} in this sense, not ${bad[1]}.`,
              ],
            ],
            "The relative clause must preserve the **whole adjective + preposition** pattern.",
          ),
        ];
      },
    ),
    define(
      "register-variation",
      "Formal and informal grammar; British and American usage",
      "C1",
      "bc-varieties",
      "Recognise standard variation and choose a form that suits the audience rather than treating every difference as an error.",
      [
        L(
          "Contractions and formality",
          "Contractions are normal in speech and much informal writing. Full forms can suit a formal notice or create emphasis. A contraction may be ambiguous until its complement is read: she’s can mean she is or she has; she’d can mean she had or she would.",
          "She’s **working** = she **is** working. / She’s **finished** = she **has** finished.",
          "She’s finished can also mean she is finished in a different context. Read the full sentence rather than expanding mechanically.",
        ),
        L(
          "Standard varieties differ",
          "British and American English share the central grammar system but differ in some preferences. British English often favours present perfect with just and already; American English also commonly uses past simple. Collective-noun agreement and some prepositions vary.",
          "I’ve just eaten. / I just ate.",
          "A form common in another standard variety is not automatically an error. Practice questions specify a variety when the distinction matters.",
        ),
        L(
          "Speech leaves more recoverable material unstated",
          "Informal speech often uses ellipsis and short responses because the context is shared. Formal standalone writing usually needs clearer reference and fuller sentence structure. The choice depends on audience and purpose, not on one style being universally superior.",
          "Want a hand? → **Do you want** a hand?",
          "A conversational fragment can be effective in dialogue while being unsuitable as an isolated formal report sentence.",
        ),
        L(
          "Grammar supports a purpose",
          "Polite modal questions, hedging and impersonal passives can soften a claim or request. Active clauses can make responsibility clearer. Use those tools deliberately: clarity is more important than adding complicated structures. Respect dialect differences while learning the standard forms appropriate to a particular setting.",
          "Could you check this? / We suggest that the team review it.",
          "This course gives broad standard-English practice, not an exhaustive catalogue of dialect grammar or a certificate of fluency.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "expand-progressive-contraction",
          `Expand “she’s” in “She’s ${g} ${o} right now.”`,
          "she is",
          `Before the active -ing form **${g}**, she’s expands to **she is**.`,
          [
            ["she has", "Has alone cannot precede this -ing form."],
            ["she was", "She’s does not contract she was."],
            ["she does", "She’s does not contract she does."],
          ],
          "Use the following **-ing form** to identify the auxiliary.",
        ),
        Q(
          "expand-would-contraction",
          `Expand “she’d” in “She’d ${v} ${o} if she had time.”`,
          "she would",
          `The base verb ${v} and hypothetical condition identify **she would**.`,
          [
            [
              "she had",
              "Had would need a participle or another complement, not this base verb in the conditional result.",
            ],
            ["she did", "She’d does not contract she did."],
            ["she should", "She’d does not contract she should."],
          ],
          "The following **base verb** and conditional result point to would.",
        ),
        Q(
          "formal-negative",
          `Rewrite “We won’t ${v} ${o} today” using the full negative form.`,
          `We will not ${v} ${o} today.`,
          "**Won’t** expands to **will not**; keep the base verb unchanged.",
          [
            [
              `We would not ${v} ${o} today.`,
              "Would not changes the modal and meaning; it does not expand won’t.",
            ],
            [
              `We will not to ${v} ${o} today.`,
              "Will not takes an infinitive without to.",
            ],
            [
              `We will not ${p} ${o} today.`,
              "The verb after will not must remain base form.",
            ],
          ],
          "Expand the contraction while **preserving the original modal and meaning**.",
        ),
        Q(
          "polite-request-register",
          `Choose a standard polite modal request asking someone to ${v} ${o}.`,
          `Could you ${v} ${o}, please?`,
          "**Could you + base verb** is a standard polite request.",
          [
            [
              `Could you to ${v} ${o}, please?`,
              "Could takes a bare infinitive without to.",
            ],
            [
              `Could you ${p} ${o}, please?`,
              "The main verb after could remains base, not past.",
            ],
            [
              `Do could you ${v} ${o}, please?`,
              "Could forms its own question; do-support is not added.",
            ],
          ],
          "Use the **modal question** pattern to make a polite request.",
        ),
      ],
    ),
  ];
}

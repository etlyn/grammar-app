import { define, task as Q } from "./engine.mjs";
import { actions, nouns } from "./contexts.mjs";
const L = (...a) => a;
export function buildAdvanced() {
  return [
    define(
      "advanced-passives",
      "Advanced passives and causative have/get",
      "C1",
      "bc-advanced-passives",
      "Report beliefs impersonally, combine passive with perfect forms, and describe services someone arranges.",
      [
        L(
          "Impersonal reporting",
          "A reporting passive can avoid naming who holds a view: **It is believed that ...**. Another pattern makes the reported subject the main subject: **She is believed to ...**. These constructions report a claim; they do not establish that it is true.",
          "It is believed that she lives here. / She is believed **to live** here.",
          "Do not confuse the time of the belief with the time of the event being reported.",
        ),
        L(
          "Earlier events after a reporting passive",
          "Use a **perfect infinitive** when the reported event is earlier than the reporting reference: is believed to have left. A continuous infinitive can show an ongoing activity: is thought to be working. A passive infinitive adds be or have been before the participle.",
          "The bridge is thought **to have been built** in 1900.",
          "To have built is active; to have been built is passive. The participant’s role determines which is needed.",
        ),
        L(
          "Arrange for someone else to do something",
          "**Have / get + object + past participle** often describes a service or arranged action. The subject arranges or experiences the action rather than necessarily performing it. Get is often less formal. The causative verb carries tense.",
          "We **had the roof repaired**.",
          "We had repaired the roof is past perfect active and normally says we did the repair; it is a different structure.",
        ),
        L(
          "Get-passives and affected experiences",
          "Get + participle can form an informal passive, especially for events or changes affecting someone. Causative have can also describe an unwelcome experience that was not arranged, such as having a bag stolen. Meaning and context matter.",
          "The parcel **got damaged**. / She **had her bag stolen**.",
          "Have something done does not always imply the subject chose or paid for the action.",
        ),
      ],
      actions,
      ({ v, p, g, o, plural }) => [
        Q(
          "reporting-passive-infinitive",
          `Report a habitual activity impersonally: “She is believed ____ ${o} every week.”`,
          `to ${v}`,
          `The reporting passive **is believed** takes **to ${v}** for this habitual activity.`,
          [
            [v, "The reporting-passive pattern requires a to-infinitive."],
            [
              p,
              "A bare past form cannot follow is believed in this construction.",
            ],
            [
              g,
              "The simple -ing form does not complete this reporting-passive pattern.",
            ],
          ],
          "After **is believed**, use a suitable **to-infinitive**.",
        ),
        Q(
          "earlier-reported-event",
          `The event was yesterday: “She is believed ____ ${o} then.”`,
          `to have ${p}`,
          `The event precedes the current belief, so use the perfect infinitive **to have ${p}**.`,
          [
            [`to has ${p}`, "An infinitive uses base have, not has."],
            [`to had ${p}`, "To takes base have, not had."],
            [
              `to have ${g}`,
              "The simple perfect infinitive needs a past participle.",
            ],
          ],
          "Separate **belief now** from the **event yesterday**.",
        ),
        Q(
          "causative-service",
          `Someone else did the task for us. Complete the causative: “We had ${o} ____.”`,
          p,
          `**Had + object + ${p}** describes the arranged or experienced action on that object.`,
          [
            [
              v,
              "A bare verb after the object is not this causative have + object + participle pattern.",
            ],
            [
              g,
              "An -ing form gives a different construction, not the requested completed service.",
            ],
            [
              `to ${v}`,
              "Have + object + to-infinitive is not the standard causative pattern here.",
            ],
          ],
          "The object receives the action, so use a **past participle** after it.",
        ),
        Q(
          "perfect-passive-infinitive",
          `Use a perfect passive infinitive: “${o[0].toUpperCase() + o.slice(1)} ${plural ? "are" : "is"} thought to have ____ already.”`,
          `been ${p}`,
          `After to have, **been ${p}** makes the infinitive both perfect and passive.`,
          [
            [`being ${p}`, "Have requires been, not being."],
            [`be ${p}`, "Base be cannot follow perfect have."],
            [
              `been ${g}`,
              "The passive ends in a past participle, not an -ing form.",
            ],
          ],
          "The thing receives the earlier action: **to have been + past participle**.",
        ),
      ],
    ),
    define(
      "reporting-verb-patterns",
      "Reporting verbs and their complements",
      "C1",
      "bc-reporting-patterns",
      "Match the reporting verb to an infinitive, an -ing clause, an object or a preposition.",
      [
        L(
          "Verb plus to-infinitive",
          "Agree, offer, promise and refuse commonly take a to-infinitive when reporting someone’s intended action. The understood subject of the infinitive is usually the reporting subject. The choice of reporting verb adds information about the speaker’s attitude.",
          "She **offered to help**. / They **refused to leave**.",
          "Offered helping is not the ordinary pattern when offering to perform an action.",
        ),
        L(
          "Verb plus object and infinitive",
          "Advise, encourage, remind and warn can take an object followed by a to-infinitive. The object names the person expected to do the action. This differs from promise to, where the subject makes a commitment about their own action.",
          "He **reminded me to call**.",
          "He reminded to call omits the person object required by this pattern.",
        ),
        L(
          "Verb plus -ing",
          "Admit, deny and suggest can take an -ing clause. They can also have other complements, such as a that-clause. Suggest does not normally use the same object + to-infinitive pattern as advise.",
          "She **admitted leaving**. / He **suggested waiting**.",
          "Suggested me to wait is not the standard pattern; use suggested that I wait or advised me to wait.",
        ),
        L(
          "Prepositions before -ing",
          "Some reporting verbs use a preposition: apologise for, insist on, accuse someone of. A verb after that preposition normally takes -ing. Keep any object required by the reporting verb.",
          "They **apologised for arriving** late.",
          "Apologised to arrive changes or breaks the pattern; the reason for the apology follows for.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "promise-infinitive",
          `“She promised ____ ${o} before lunch.”`,
          `to ${v}`,
          `**Promise to ${v}** reports her commitment to perform the action.`,
          [
            [
              g,
              "Promise does not normally take this bare -ing complement for a commitment.",
            ],
            [v, "Promise needs to before the infinitive in this pattern."],
            [p, "A past form cannot serve as the infinitive complement."],
          ],
          "The reporting verb **promise** takes a **to-infinitive** for the promised action.",
        ),
        Q(
          "remind-object-infinitive",
          `“He reminded us ____ ${o} before leaving.”`,
          `to ${v}`,
          `**Reminded us to ${v}** names us as the people expected to act.`,
          [
            [g, "Remind + person takes a to-infinitive here, not bare -ing."],
            [v, "The to marker is required in this pattern."],
            [
              `that ${v}`,
              "That would need a finite clause with its own subject.",
            ],
          ],
          "Use **remind + person + to-infinitive**.",
        ),
        Q(
          "admit-gerund",
          `“They admitted ____ ${o} without permission.”`,
          g,
          `**Admitted ${g}** uses an -ing complement for the acknowledged action.`,
          [
            [
              `to ${v}`,
              "Admit in this construction takes -ing, not a to-infinitive.",
            ],
            [v, "A bare base verb does not complete admit here."],
            [
              p,
              "A simple past form cannot serve as this non-finite complement.",
            ],
          ],
          "After **admit**, this action is expressed by an **-ing clause**.",
        ),
        Q(
          "apologise-preposition",
          `“We apologised for ____ ${o} late.”`,
          g,
          `After preposition **for**, use **${g}** to name the action being apologised for.`,
          [
            [
              `to ${v}`,
              "A to-infinitive cannot follow for in this action-complement pattern.",
            ],
            [v, "A base verb is not the standard complement after for here."],
            [p, "A past form is not the -ing clause required after for."],
          ],
          "The key is the **preposition for**, which is followed by a noun or -ing form.",
        ),
      ],
    ),
    define(
      "participle-clauses",
      "Participle clauses and reduced relatives",
      "C1",
      "bc-participles",
      "Make related information more compact while keeping the implied subject and time relationship clear.",
      [
        L(
          "An active -ing clause",
          "A present-participle clause can add a reason, simultaneous activity or result. In an introductory clause, its understood subject normally matches the main-clause subject. Its form does not by itself set a present tense; the main clause and context provide time.",
          "**Walking home**, she called her brother.",
          "Walking home, the rain began suggests that the rain was walking. This is a dangling modifier.",
        ),
        L(
          "A passive participle clause",
          "A past-participle clause usually has a passive meaning: the implied subject receives the action. It can express a condition, reason or accompanying description. The main clause supplies the participant and time.",
          "**Kept cool**, the food lasts longer.",
          "A past participle does not automatically mean past time; it often marks passive meaning.",
        ),
        L(
          "A completed earlier action",
          "Use **having + past participle** to make completion before the main action explicit. The passive equivalent is having been + participle. This is useful when sequence might otherwise be unclear, but long chains of participles can become hard to read.",
          "**Having checked** the map, we left.",
          "Having checking is not the perfect-participle form: having takes a past participle.",
        ),
        L(
          "Reduced relative clauses",
          "An -ing phrase after a noun can correspond to an active relative clause; a past-participle phrase can correspond to a passive relative. Keep the relation close to its noun and ensure that the reduction preserves the intended meaning.",
          "The person **waiting outside** is here. / The letter **sent yesterday** arrived.",
          "Not every finite relative clause can be reduced without changing its meaning, tense or emphasis.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "active-participle",
          `Add an active participle clause: “____ ${o}, the assistant noticed a mistake.”`,
          g,
          `**${g} ${o}** describes the assistant’s activity; the main subject supplies the understood actor.`,
          [
            [
              `To ${v}`,
              "A to-infinitive would normally suggest purpose or a different relation, not the requested participle clause.",
            ],
            [
              s,
              "A finite -s verb cannot open this subjectless participle clause.",
            ],
            [
              `Has ${p}`,
              "A finite perfect verb requires its own subject and is not this participle construction.",
            ],
          ],
          "The assistant performs both actions, so an **active -ing clause** can share that subject.",
        ),
        Q(
          "perfect-participle",
          `Make the earlier completion explicit: “Having ____ ${o}, we took a break.”`,
          p,
          `**Having ${p}** marks the activity as completed before the break.`,
          [
            [g, "Having requires a past participle for this perfect clause."],
            [
              `to ${v}`,
              "A to-infinitive does not follow having in a perfect participle clause.",
            ],
            [
              `been ${g}`,
              "This would foreground earlier ongoing activity rather than the requested completed simple-perfect action.",
            ],
          ],
          "After **having**, choose the **past participle** for an earlier completed action.",
        ),
        Q(
          "reduced-active-relative",
          `Reduce “who is doing the task”: “The assistant ____ ${o} is new.”`,
          g,
          `**${g} ${o}** is an active reduced relative modifying the assistant.`,
          [
            [
              s,
              "A second finite verb here needs a relative pronoun or another clause structure.",
            ],
            [
              `has ${p}`,
              "A finite perfect clause cannot follow the noun directly without a connector in this construction.",
            ],
            [
              `to ${v}`,
              "An infinitive suggests a task to be done rather than the stated ongoing activity.",
            ],
          ],
          "The noun is the **actor**, and the action is in progress: use an **-ing modifier**.",
        ),
        Q(
          "shared-participle-subject",
          `In “Having ${p} ${o}, the assistant left”, who performed the earlier action?`,
          "the assistant",
          "The introductory participle clause normally shares its understood subject with **the assistant**, the main-clause subject.",
          [
            [o, "This is the object of the earlier action, not the actor."],
            [
              "an unnamed different person",
              "The structure normally links the implied actor to the main-clause subject.",
            ],
            [
              "the sentence does not imply an actor",
              "The main subject supplies the understood actor in this construction.",
            ],
          ],
          "Link the opening participle clause to the **subject of the main clause**.",
        ),
      ],
    ),
    define(
      "inversion",
      "Inversion after negatives and in conditionals",
      "C1",
      "bc-inversion",
      "Recognise formal emphasis that places an auxiliary before the subject, and conditional forms that omit if.",
      [
        L(
          "Negative or limiting openings",
          "After fronted negative or limiting expressions such as never, rarely and only then, formal English often uses **auxiliary–subject inversion** in the main clause. Add do-support if the original lexical verb has no auxiliary.",
          "**Rarely does she complain**.",
          "Rarely she complains does not follow the standard emphatic inversion pattern after fronted rarely.",
        ),
        L(
          "Move only the first auxiliary",
          "If a verb phrase already has auxiliaries, move just the first one before the subject. Keep later auxiliaries and the main verb after the subject. The form resembles a question, but the sentence is still a statement.",
          "**Never have I been** so surprised.",
          "Never have been I ... moves too much of the verb phrase before the subject.",
        ),
        L(
          "Conditional inversion without if",
          "Formal conditionals can omit if and begin with **had**, **were** or **should**. Had I known means if I had known. Were she to leave presents a hypothetical condition; should you need help presents a possible contingency.",
          "**Had I known**, I would have called.",
          "Do not keep if as well as using this inverted conditional pattern.",
        ),
        L(
          "Scope of only and not until",
          "An opening such as Only after the meeting or Not until she arrived triggers inversion in the **main clause**, not in the subordinate time clause. Only modifying the subject does not normally trigger this inversion.",
          "Only after she arrived **did we begin**.",
          "Only the manager knew has no inversion because only modifies the subject itself.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "negative-fronting-present",
          `Use formal inversion: “Rarely ____ ${o} without help.”`,
          `does she ${v}`,
          `Fronted **rarely** triggers **does she + ${v}**; does carries present agreement.`,
          [
            [
              `she ${s}`,
              "This retains ordinary statement order instead of the requested inversion.",
            ],
            [
              `does she ${s}`,
              "Does carries agreement, so the main verb must lose -s.",
            ],
            [
              `she does ${v}`,
              "The auxiliary must precede the subject after fronted rarely.",
            ],
          ],
          "A fronted negative-frequency expression triggers **auxiliary before subject**.",
        ),
        Q(
          "negative-fronting-perfect",
          `Use formal inversion: “Never ____ ${o} so quickly.”`,
          `have they ${p}`,
          `Move the first auxiliary **have** before they; keep the participle after the subject.`,
          [
            [
              `they have ${p}`,
              "This is ordinary statement order rather than the requested inversion.",
            ],
            [
              `have ${p} they`,
              "Only the first auxiliary moves; the participle stays after they.",
            ],
            [`has they ${p}`, "Has does not agree with they."],
          ],
          "Move **only have** in this perfect construction.",
        ),
        Q(
          "inverted-past-condition",
          `Replace “If we had ${p} ${o}”: “____ ${o}, we would have finished earlier.”`,
          `Had we ${p}`,
          `Omit if and invert **had we** to express the unreal past condition.`,
          [
            [
              `If had we ${p}`,
              "Do not combine if with this inverted conditional structure.",
            ],
            [
              `We had ${p}`,
              "Without if or inversion, this would not mark the requested conditional relationship.",
            ],
            [`Had we ${g}`, "Had requires a past participle, not -ing."],
          ],
          "A formal unreal past condition can begin **Had + subject + participle**.",
        ),
        Q(
          "only-after-scope",
          `Use inversion in the main clause: “Only after the call ____ ${o}.”`,
          `did she ${v}`,
          `Only after the call is a limiting opening; invert **did she** and use base ${v}.`,
          [
            [
              `she ${p}`,
              "The requested formal main clause needs inversion after this limiting opening.",
            ],
            [
              `did she ${p}`,
              "Did already marks the past, so the next verb must be base.",
            ],
            [
              `she did ${v}`,
              "The auxiliary must precede the subject in the inverted main clause.",
            ],
          ],
          "The inversion belongs in the **main clause following only after**.",
        ),
      ],
    ),
    define(
      "clefts-emphasis",
      "Cleft sentences and emphatic do",
      "C1",
      "bc-emphasis",
      "Focus the reader’s attention on a participant, an action or a correction.",
      [
        L(
          "It-clefts",
          "An it-cleft divides a message into a focused part and a following clause: **It was X who/that ...**. The focus can be a person, thing, time or place. Use a form that makes the intended contrast clear.",
          "**It was the guide who** called.",
          "It in an it-cleft is a grammatical device; it does not refer back to a thing.",
        ),
        L(
          "What-clefts",
          "A what-clause can introduce the part of the message already under discussion, followed by be and the focus. What I need is a break focuses on a break. After what + do, the focused action commonly uses a base infinitive, with to also possible in many contexts.",
          "**What I need is** more time. / **What she did was (to) call**.",
          "Do not reject the to variant after what she did was merely because a bare infinitive is also possible.",
        ),
        L(
          "Emphatic do",
          "Use do, does or did in an affirmative clause to contradict a negative assumption or add emphasis. The auxiliary carries tense and agreement, so the main verb uses its base form. Spoken stress falls on the auxiliary.",
          "She **does know**. / We **did call**.",
          "She does knows marks agreement twice; use does know.",
        ),
        L(
          "Choose emphasis for a reason",
          "Clefts and emphatic auxiliaries make information prominent. Too many in a paragraph can make prose heavy. Choose the structure according to what the listener already knows and which contrast matters. Written emphasis should still leave the underlying grammar clear.",
          "It was **yesterday** that we called.",
          "Clefts are not needed simply to make every sentence sound more advanced.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "emphatic-present",
          `Correct the claim that she never does the task: “She does ____ ${o}!”`,
          v,
          `Emphatic **does** carries the agreement, so choose base **${v}**.`,
          [
            [s, "The -s agreement is already on does."],
            [p, "Does is present; the following verb still needs base form."],
            [`to ${v}`, "Emphatic do takes a bare infinitive."],
          ],
          "Emphasis adds **does**, which takes over the agreement marking.",
        ),
        Q(
          "emphatic-past",
          `Correct a denial about yesterday: “We did ____ ${o}!”`,
          v,
          `Emphatic **did** carries the past tense, so use **${v}**.`,
          [
            [p, "The past marker is already on did."],
            [s, "A third-person present form cannot follow did."],
            [`to ${v}`, "Did takes a bare infinitive."],
          ],
          "The auxiliary carries both **past tense and emphasis**.",
        ),
        Q(
          "person-cleft",
          `Focus on the person: “It was the assistant ____ ${p} ${o}.”`,
          "who",
          "**Who** links the focused person to the action in this it-cleft.",
          [
            ["whose", "Whose would need a noun after it to mark possession."],
            [
              "where",
              "Where does not represent the person performing this action.",
            ],
            [
              "what",
              "What does not normally follow a named person as the cleft connector here.",
            ],
          ],
          "The focused element is a **person**, and the following clause needs its subject.",
        ),
        Q(
          "what-cleft-agreement",
          `Complete the what-cleft: “What I need ____ time to ${v} ${o}.”`,
          "is",
          "The what-clause presents a single need, so **is** links it to time.",
          [
            [
              "are",
              "The complement is uncountable time and the clause presents one need, so plural are does not fit this example.",
            ],
            ["be", "Be is not a finite present form."],
            [
              "am",
              "Am agrees with I as a main subject, not with the whole what-clause.",
            ],
          ],
          "The subject is the whole **what I need** clause, not the I inside it.",
        ),
      ],
    ),
    define(
      "ellipsis-substitution",
      "Ellipsis, substitution and avoiding repetition",
      "C1",
      "bc-ellipsis",
      "Leave out recoverable words and use substitutes without losing the intended meaning.",
      [
        L(
          "Keep the auxiliary, omit repeated content",
          "Ellipsis removes words that the listener can recover from context. After a suitable auxiliary, a repeated verb phrase can be omitted. Match the auxiliary to the clause’s tense and structure.",
          "She can swim, and I **can too**.",
          "I swim and she is too does not match the auxiliary to the lexical verb in the first clause.",
        ),
        L(
          "So and neither for shared experience",
          "Use **so + auxiliary + subject** to add agreement to a positive statement. Use **neither / nor + auxiliary + subject** after a negative one. This is an inverted agreement pattern, not ordinary statement order.",
          "I work here. **So do I.** / I don’t. **Neither do I.**",
          "So I do is an emphatic acknowledgement, not the same pattern as So do I.",
        ),
        L(
          "One and ones replace count nouns",
          "One can replace a singular count noun and ones can replace plural count nouns when the noun is understood. They can combine with adjectives or determiners. They do not freely replace uncountable nouns.",
          "I prefer the blue **one**. / The old **ones** are cheaper.",
          "Some advice → some, not some ones; advice is uncountable in this use.",
        ),
        L(
          "Substitute for whole propositions",
          "So can stand for an affirmative proposition after verbs such as think, hope and expect. Negative forms vary by verb: I hope not, I don’t think so. Such can point back to a type of thing already mentioned. Keep the reference unambiguous.",
          "Will it work? I **hope so**.",
          "I don’t hope so is not the ordinary negative response; use I hope not.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "positive-agreement",
          `“I ${v} ${o} every week.” Add that you do too: “____.”`,
          "So do I",
          "Positive present-simple agreement uses **so + do + I**.",
          [
            [
              "So I do",
              "So I do acknowledges or confirms a claim rather than adding another matching subject in the requested pattern.",
            ],
            [
              "Neither do I",
              "Neither adds agreement to a negative statement, but this one is positive.",
            ],
            [
              "So am I",
              "Am does not match the ordinary lexical present-simple verb.",
            ],
          ],
          "The first clause is **positive present simple**.",
        ),
        Q(
          "negative-agreement",
          `“I do not ${v} ${o}.” Add that you do not either: “____.”`,
          "Neither do I",
          "Negative agreement uses **neither + do + I**.",
          [
            [
              "So do I",
              "So adds positive agreement, not agreement with this negative clause.",
            ],
            [
              "Neither I do",
              "The agreement pattern inverts the auxiliary and subject.",
            ],
            [
              "Neither am I",
              "Am does not match the do auxiliary of the original statement.",
            ],
          ],
          "The first clause is **negative** and uses **do**.",
        ),
        Q(
          "auxiliary-ellipsis",
          `“She can ${v} ${o}, and we ____ too.”`,
          "can",
          "Retain **can** and omit the recoverable action phrase.",
          [
            ["are", "Are does not match the can construction."],
            [
              "do",
              "Do would not preserve the stated modal ability meaning here.",
            ],
            ["have", "Have does not match the modal construction."],
          ],
          "Keep the modal **can** while leaving out the repeated action.",
        ),
        Q(
          "proposition-substitution",
          `“Will they ${v} ${o} on time?” Express a positive hope: “I hope ____.”`,
          "so",
          "**So** substitutes for the positive proposition that they will do it on time.",
          [
            ["not", "Not expresses a negative hope, opposite to the prompt."],
            [
              "one",
              "One substitutes for a count noun, not a whole proposition.",
            ],
            [
              "ones",
              "Ones substitutes for plural count nouns, not a proposition.",
            ],
          ],
          "The missing content is a **whole positive statement**, so use so.",
        ),
      ],
    ),
    define(
      "unreal-subjunctive",
      "Unreal time and the subjunctive",
      "C1",
      "bc-unreal",
      "Recognise formal recommendations, imagined situations and expressions whose past form refers to the present.",
      [
        L(
          "The mandative subjunctive",
          "After a demand, recommendation or requirement, formal English can use a that-clause with the **base verb for every subject**. Be remains be. This pattern is especially common in American formal usage; British English also often uses should + base.",
          "They requested that she **be** present.",
          "She be in a subjunctive clause is not an agreement error. The clause expresses a requirement rather than reporting a fact.",
        ),
        L(
          "Negative subjunctives",
          "In a mandative subjunctive, **not** normally comes directly before the base verb without do-support. The reporting verb may be past while the recommended action is later. The base verb does not backshift in the usual way.",
          "They insisted that he **not leave**.",
          "The pattern differs from ordinary factual He does not leave. Read the demand or recommendation meaning first.",
        ),
        L(
          "Would rather and it is time",
          "Would rather + base verb expresses a preference about one’s own action. Would rather + subject + past form can express a preference about another person now or in the future. It is time + subject + past form says an action is overdue or due now.",
          "I’d rather **stay**. / I’d rather you **stayed**. / It’s time we **left**.",
          "The past form in It’s time we left need not refer to a past departure.",
        ),
        L(
          "As if and hypothetical were",
          "As if or as though can compare a situation with an imagined one. A backshifted form can show that the speaker views it as unreal or doubtful. Were is common in formal hypothetical be clauses. Ordinary tenses remain possible when the comparison may be true.",
          "He speaks as if he **knew** everything.",
          "As if does not automatically force unreal past; context can support an ordinary factual interpretation.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "mandative-base",
          `Use the formal mandative subjunctive: “They recommend that she ____ ${o} today.”`,
          v,
          `The requested subjunctive uses base **${v}**, without third-person -s.`,
          [
            [
              s,
              "This is ordinary indicative agreement, not the explicitly requested subjunctive form.",
            ],
            [p, "The subjunctive here uses a base form, not past tense."],
            [
              `to ${v}`,
              "A finite that-clause in this pattern does not use a to-infinitive.",
            ],
          ],
          "The clause expresses a **recommendation**, and the requested form is the **subjunctive**.",
        ),
        Q(
          "negative-subjunctive",
          `Use a negative mandative subjunctive: “They insist that she ____ ${o} without permission.”`,
          `not ${v}`,
          `The negative subjunctive is **not + base ${v}**, without does.`,
          [
            [
              `does not ${v}`,
              "This is indicative do-support, not the requested negative subjunctive.",
            ],
            [
              `not ${s}`,
              "The subjunctive base form does not carry third-person -s.",
            ],
            [
              `not to ${v}`,
              "Not to is an infinitive, not this finite subjunctive clause.",
            ],
          ],
          "A mandative negative places **not directly before the base verb**.",
        ),
        Q(
          "rather-own-action",
          `“I would rather ____ ${o} tomorrow.”`,
          v,
          `For the speaker’s own preference, **would rather** takes base **${v}**.`,
          [
            [
              p,
              "A past form belongs in some different-subject preference clauses, not directly after would rather here.",
            ],
            [g, "The direct complement is a base verb, not -ing."],
            [`to ${v}`, "Would rather takes an infinitive without to."],
          ],
          "There is no new subject after rather, so use the **bare infinitive**.",
        ),
        Q(
          "time-unreal-past",
          `The task is due now. Use the “it is time” past-form pattern: “It is time we ____ ${o}.”`,
          p,
          `The pattern **it is time + subject + past form** uses **${p}** for an action due now.`,
          [
            [
              `will ${v}`,
              "The requested it-is-time construction uses a past form, not will.",
            ],
            [g, "An -ing form alone does not form the finite clause."],
            [
              `to ${v}`,
              "After the stated subject we, this pattern needs a finite past form.",
            ],
          ],
          "The past form expresses that the action is **due now**, not that it already happened.",
        ),
      ],
    ),
    define(
      "agreement-advanced",
      "Agreement with complex subjects",
      "B2",
      "bc-agreement",
      "Find the head of a subject phrase and handle indefinite pronouns, quantities and collective nouns carefully.",
      [
        L(
          "The head controls agreement",
          "A subject can contain another noun inside a prepositional phrase. In ordinary agreement, the **head of the subject phrase** controls the verb, not the nearest noun. The box of tools is singular because box is the head.",
          "The **list** of names **is** ready.",
          "The list of names are ready incorrectly lets the nearby plural names control agreement.",
        ),
        L(
          "Indefinite pronouns",
          "Everyone, someone, anybody and each normally take singular verb agreement. They can still be referred back to with singular they. Each of the students is ready combines singular each with a plural noun inside an of phrase.",
          "**Everyone is** ready; **they** have a ticket.",
          "Singular they does not change the agreement of everyone itself to plural.",
        ),
        L(
          "Coordinated subjects and quantities",
          "Two separate subjects joined by and normally take a plural verb. A combined dish, title or single measured amount can be treated as one unit. Percentages and fractions often take agreement from what is being measured.",
          "The guide and the driver **are** here. / Ten pounds **is** enough.",
          "Agreement with quantities depends on meaning: ten pounds is a price, but the coins are separate objects.",
        ),
        L(
          "Collective nouns and variation",
          "A team or committee may take singular agreement when treated as one unit. British English also commonly uses plural agreement when its members are in focus; American English more often favours singular. Keep pronoun choices and viewpoint consistent.",
          "The team **is** united. / The team **are** arguing among themselves.",
          "Do not label every plural collective agreement wrong without specifying variety and intended meaning.",
        ),
      ],
      actions,
      ({ v, s, o }) => [
        Q(
          "head-agreement",
          `“The list of tasks needed to ${v} ${o} ____ ready.”`,
          "is",
          "The head of the subject is singular **list**. The plural tasks is inside an of phrase.",
          [
            [
              "are",
              "This agrees with nearby tasks rather than the subject head list.",
            ],
            ["am", "Am agrees only with I."],
            ["be", "Be is not the required finite present form."],
          ],
          "Remove the **of tasks** phrase mentally and find the subject head.",
        ),
        Q(
          "indefinite-agreement",
          `“Everyone who can ${v} ${o} ____ welcome.”`,
          "is",
          "**Everyone** takes singular verb agreement, even though it includes many people.",
          [
            ["are", "Everyone is grammatically singular in this construction."],
            ["am", "Am agrees with I."],
            ["be", "Be is not a finite present form here."],
          ],
          "The subject head is **everyone**, which takes singular agreement.",
        ),
        Q(
          "coordinated-subjects",
          `“The guide and the assistant ____ ready to ${v} ${o}.”`,
          "are",
          "Two distinct people joined by **and** form a plural subject.",
          [
            ["is", "The subject names two separate people, not one unit."],
            ["am", "Am agrees with I."],
            ["be", "Be is not the finite present form."],
          ],
          "Count the two distinct subjects joined by **and**.",
        ),
        Q(
          "each-of-agreement",
          `“Each of the people assigned to ${v} ${o} ____ a copy of the instructions.”`,
          "has",
          "The subject head **each** is singular, so use **has**.",
          [
            [
              "have",
              "The plural people is inside an of phrase; each controls agreement.",
            ],
            ["having", "Having alone is not a finite verb."],
            ["to have", "An infinitive cannot be the finite predicate here."],
          ],
          "The phrase **each of** selects members individually and takes a singular verb.",
        ),
      ],
    ),
    define(
      "punctuation-clauses",
      "Punctuation, sentence boundaries and direct speech",
      "B1",
      "dfe-grammar",
      "Use punctuation to show clause relationships, possession, quotation and sentence boundaries.",
      [
        L(
          "Independent clauses need a real boundary",
          "A comma alone does not normally join two independent clauses in formal prose. Use a full stop, a semicolon, or a comma with a suitable coordinating conjunction. A semicolon joins closely related main clauses without a conjunction.",
          "The train stopped**;** we got off.",
          "The train stopped, we got off is a comma splice in ordinary formal writing.",
        ),
        L(
          "Colons and introductory material",
          "A colon can introduce an explanation or list after a complete clause. A comma commonly follows an introductory subordinate clause or a long introductory adverbial. A dash can mark a break or inserted explanation, with conventions varying by style.",
          "We need three things**:** paper, ink and time.",
          "Do not routinely put a colon between a verb and its object: We need: paper is usually unnecessary punctuation.",
        ),
        L(
          "Direct speech",
          "Quotation marks show exact spoken or written words. A reporting clause can introduce the quotation with a comma. Capitalise the beginning of a full quoted sentence. Single versus double quotation marks and some punctuation placement vary by house style.",
          "She said, **“Please wait.”**",
          "Reported speech normally removes quotation marks because it does not claim the same exact wording.",
        ),
        L(
          "Apostrophes and capitals",
          "Use apostrophes for contractions and possession, not ordinary plurals. Its is possessive; it’s means it is or it has. Capitalise sentence openings, the pronoun I and proper names, including languages and weekdays.",
          "**It’s** Tuesday. / The dog lost **its** collar.",
          "Quotation style varies, but the distinction between its and it’s is grammatical rather than an optional style choice.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "semicolon-main-clauses",
          `Choose punctuation that joins two main clauses without a conjunction: “We ${p} ${o} ____ the supervisor thanked us.”`,
          ";",
          "A **semicolon** can connect these related independent clauses.",
          [
            [",", "A comma alone would create a comma splice in formal prose."],
            [
              "—,",
              "A dash-comma combination is not the standard boundary required here.",
            ],
            [
              "no punctuation",
              "The two independent clauses would run together.",
            ],
          ],
          "Both sides can stand as sentences; use a **semicolon** when joining them without a conjunction.",
        ),
        Q(
          "introductory-clause-comma",
          `Where should the comma go in “After we ${p} ${o} we rested”?`,
          `After we ${p} ${o}, we rested.`,
          "The comma separates the introductory after-clause from the main clause we rested.",
          [
            [
              `After, we ${p} ${o} we rested.`,
              "This separates the subordinating word from its clause instead of marking the clause boundary.",
            ],
            [
              `After we, ${p} ${o} we rested.`,
              "This separates the subject from its verb.",
            ],
            [
              `After we ${p}, ${o} we rested.`,
              "This separates the transitive verb from its object.",
            ],
          ],
          "Find where the **introductory after-clause ends**.",
        ),
        Q(
          "direct-speech-capital",
          `Choose a correctly introduced direct instruction to ${v} ${o}.`,
          `She said, “${v[0].toUpperCase() + v.slice(1)} ${o}.”`,
          "A comma introduces the full quoted sentence, which begins with a capital and ends with punctuation.",
          [
            [
              `She said “${v} ${o}”`,
              "This version lacks the capital for the full quoted sentence and final punctuation.",
            ],
            [
              `She, said “${v} ${o}.”`,
              "The comma wrongly separates the subject and verb, and the full quotation starts lowercase.",
            ],
            [`She said, ${v} ${o}”.`, "The opening quotation mark is missing."],
          ],
          "Check the **reporting clause, opening quotation mark, capital and closing punctuation**.",
        ),
        Q(
          "its-contraction",
          `“____ time to ${v} ${o}.” Choose the contraction meaning “it is”.`,
          "It’s",
          "**It’s** contracts **it is** in this sentence.",
          [
            [
              "Its",
              "Its is a possessive determiner, not the requested contraction.",
            ],
            [
              "Its’",
              "Its’ is not the standard contraction or possessive form.",
            ],
            [
              "I’ts",
              "The apostrophe is misplaced; it replaces the missing letter in is.",
            ],
          ],
          "Expand the word: the sentence needs **it is**.",
        ),
      ],
    ),
  ];
}

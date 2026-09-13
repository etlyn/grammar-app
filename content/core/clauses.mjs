import { define, task as Q } from "./engine.mjs";
import { actions } from "./contexts.mjs";
const L = (...a) => a;
export function buildClauses() {
  return [
    define(
      "conditionals",
      "Zero, first and second conditionals",
      "B1",
      "bc-conditionals",
      "Express regular consequences, realistic future possibilities and imagined alternatives.",
      [
        L(
          "General conditions",
          "A common **zero conditional** uses present simple in both clauses for a regular consequence or general relationship. If can sometimes be replaced by when when the event is expected or repeated. It is the general meaning, not only the verb forms, that matters.",
          "If water freezes, it **expands**.",
          "A conditional can also contain an instruction: If you need help, ask. Not every if sentence belongs to one numbered formula.",
        ),
        L(
          "A realistic future possibility",
          "The usual **first conditional** has if + present simple, followed by will + base verb. It treats the condition as a realistic possibility. The result can also use can, may or an imperative when that meaning is appropriate.",
          "If she **calls**, I **will answer**.",
          "In an ordinary future condition, do not put will in the if clause. Will can occur there with other meanings, such as willingness.",
        ),
        L(
          "An imagined present or future",
          "A common **second conditional** uses if + past simple with would + base verb. The past form marks distance from reality rather than necessarily past time. Were is common for all subjects in formal hypothetical be clauses, especially If I were you.",
          "If I **had** time, I **would visit**.",
          "The form does not mean the imagined event happened in the past; it often concerns now or the future.",
        ),
        L(
          "Clause order and unless",
          "The clauses can swap order without changing the basic relationship. A leading if clause is normally followed by a comma. Unless often means if not, but replacing every negative condition mechanically can change meaning.",
          "If it rains, we’ll stay. / We’ll stay if it rains.",
          "Do not add a second negative merely because unless already has an if-not meaning.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "zero-result",
          `State a regular procedure in the zero conditional: “Whenever an order arrives, she ____ ${o}.”`,
          s,
          `This describes a repeated procedure, so the zero-conditional result uses present simple **${s}**, agreeing with she.`,
          [
            [v, "The present-simple verb needs third-person -s with she."],
            [
              `will to ${v}`,
              "Will cannot be followed by to; the task also asks for a regular present procedure.",
            ],
            [g, "An -ing form alone is not a finite verb for this result."],
          ],
          "A **regular procedure** uses present simple in both clauses; then check subject–verb agreement.",
        ),
        Q(
          "first-if-clause",
          `Use the standard first conditional: “If she ____ ${o} tomorrow, we will be ready.”`,
          s,
          `The ordinary future if-clause uses present simple: **she ${s}**.`,
          [
            [
              `will ${v}`,
              "Will normally belongs in the result clause for this ordinary future condition.",
            ],
            [
              `would ${v}`,
              "Would would create the wrong form for the requested if-clause.",
            ],
            [g, "The -ing form alone is not a finite predicate."],
          ],
          "This is a **real future possibility**; use present simple after if.",
        ),
        Q(
          "second-if-clause",
          `Use the second conditional for an imagined situation now: “If she ____ ${o}, we would have less work.”`,
          p,
          `The hypothetical if-clause uses past-form **${p}** to mark distance from reality.`,
          [
            [
              s,
              "The requested second-conditional if-clause uses a past form, not present -s.",
            ],
            [
              `would ${v}`,
              "Would belongs in the result clause in this standard pattern.",
            ],
            [g, "An -ing form alone is not a finite clause verb."],
          ],
          "The past form here expresses an **imagined alternative**, not a completed past event.",
        ),
        Q(
          "second-result",
          `Complete the second-conditional result: “If I had more time now, I ____ ${o}.”`,
          `would ${v}`,
          `An imagined present result takes **would + ${v}**.`,
          [
            [`would to ${v}`, "Would takes a bare infinitive without to."],
            [`would ${p}`, "A past form cannot directly follow would."],
            [
              `would ${g}`,
              "Would needs be before -ing; this task asks for the simple result pattern.",
            ],
          ],
          "Match **if + past** with **would + base verb** in this standard hypothetical pattern.",
        ),
      ],
    ),
    define(
      "third-mixed-conditionals",
      "Third and mixed conditionals",
      "B2",
      "bc-third-conditionals",
      "Look back at an unreal past and connect past conditions with present consequences.",
      [
        L(
          "An unreal past condition",
          "The usual **third conditional** imagines a past that did not happen. Use if + past perfect for the condition and would have + past participle for the result. The grammar shows both parts as alternatives to the actual past.",
          "If I **had called**, she **would have waited**.",
          "Had and would have do different jobs. Do not routinely put would have in the if clause of this standard pattern.",
        ),
        L(
          "Possible and certain imagined results",
          "Could have or might have can replace would have when the imagined result is ability or possibility rather than the expected consequence. Keep the same perfect construction after the modal.",
          "We **might have won** if we had trained more.",
          "Could have is not always interchangeable with would have; the strength or kind of result changes.",
        ),
        L(
          "Past condition, present result",
          "A mixed conditional can link an unreal past condition to a present result. The if-clause stays past perfect, but the present result normally uses would + base verb. Explicit time words help the reader follow the link.",
          "If I **had studied** medicine, I **would be** a doctor now.",
          "Do not force have into a present result merely because the condition is past.",
        ),
        L(
          "Present condition, past result",
          "A continuing hypothetical state can explain an unreal past result. Use if + past simple for the imagined state and would have + participle for the past result. Match each clause to its own time instead of memorising one fixed pair.",
          "If I **were** more organised, I **would have remembered** yesterday.",
          "The label mixed describes the time relationship, not an error in tense consistency.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "unreal-past-condition",
          `Use the third conditional: “If she ____ ${o} yesterday, we would have finished on time.”`,
          `had ${p}`,
          `The unreal past condition is **if + had + ${p}**.`,
          [
            [
              `would have ${p}`,
              "In the standard third conditional, would have belongs in the result clause.",
            ],
            [
              `had ${g}`,
              "The past perfect requires a participle, not an -ing form.",
            ],
            [
              `has ${p}`,
              "Present perfect does not mark the unreal past condition requested.",
            ],
          ],
          "The condition concerns a **different past**, so use past perfect.",
        ),
        Q(
          "unreal-past-result",
          `Complete the third-conditional result: “If we had had more time yesterday, we ____ ${o}.”`,
          `would have ${p}`,
          `The imagined past result uses **would have ${p}**.`,
          [
            [`would ${p}`, "The perfect auxiliary have is missing."],
            [`would had ${p}`, "Would takes base have, not had."],
            [
              `would have ${g}`,
              "Have needs the past participle in this result.",
            ],
          ],
          "The result is also in an **unreal past**: use modal + have + participle.",
        ),
        Q(
          "past-condition-present-result",
          `Complete the present result of a mixed conditional: “If she had ${p} ${o} yesterday, she ____ free now.”`,
          "would be",
          "The result is **now**, so use **would be**, while the past condition keeps had + participle.",
          [
            [
              "would have been",
              "This would locate the imagined result in the past, contrary to the specified present result.",
            ],
            ["would been", "Would requires base be unless have precedes been."],
            ["would is", "Is cannot follow would."],
          ],
          "Read **now**: the condition is past, but the result is present.",
        ),
        Q(
          "present-condition-past-result",
          `Complete the past result of a mixed conditional: “If I were more organised, I ____ ${o} yesterday.”`,
          `would have ${p}`,
          `The imagined result is yesterday, so it needs **would have ${p}** despite the continuing-state condition.`,
          [
            [
              `would ${g}`,
              "The result needs a perfect construction, not an unsupported -ing form.",
            ],
            [`would had ${p}`, "After would, use have rather than had."],
            [
              `would have ${g}`,
              "A past result in the simple perfect needs a past participle.",
            ],
          ],
          "Match the result to **yesterday**, not to the surface tense of the if-clause.",
        ),
      ],
    ),
    define(
      "wishes",
      "Wishes, regrets and if only",
      "B2",
      "bc-wishes",
      "Express a desired change in the present, regret about the past or dissatisfaction with someone’s behaviour.",
      [
        L(
          "An unreal present wish",
          "After wish or if only, use a past form to imagine a present situation differently. This is sometimes called unreal past: its form is past, but its reference can be now. With be, were is common for all persons in formal hypothetical uses.",
          "I wish I **knew** the answer. / If only I **were** taller.",
          "A future hope that may come true normally uses hope, not wish + will in the same pattern.",
        ),
        L(
          "Regret about the past",
          "Use **wish + past perfect** to regret an earlier event or non-event. The past perfect marks the fact that the past cannot now be changed. The wish describes an alternative to it.",
          "I wish I **had checked** the time.",
          "I wish I checked yesterday does not give the standard past-regret form; use had checked.",
        ),
        L(
          "A wish for changed behaviour",
          "Wish + would often expresses a desire for another person or an external situation to change, especially an irritating repeated behaviour. It normally concerns willingness or behaviour, rather than a simple characteristic.",
          "I wish they **would listen**.",
          "I wish I would be taller is not the normal way to wish for a different characteristic.",
        ),
        L(
          "Ability and wishes",
          "Wish + could can express a desired ability or opportunity. Compare I wish I could come with I hope I can come: the former suggests a barrier, while the latter leaves the possibility open. If only usually makes the wish more emphatic.",
          "If only I **could stay** longer.",
          "Choose wish or hope from the speaker’s view of reality, not just from whether the sentence refers to the future.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "present-wish",
          `Use a past form for an unreal present wish: “I wish she ____ ${o} more often.”`,
          p,
          `The wish imagines a different present habit, so it uses past-form **${p}**.`,
          [
            [
              s,
              "The ordinary unreal-present wish uses a past form rather than present -s.",
            ],
            [g, "An -ing form alone cannot complete the finite clause."],
            [
              `to ${v}`,
              "A to-infinitive does not supply the finite predicate after she.",
            ],
          ],
          "This is an **unreal present wish**; past form marks distance from reality.",
        ),
        Q(
          "past-regret",
          `The task was not done yesterday: “I wish I ____ ${o} then.”`,
          `had ${p}`,
          `A regret about yesterday uses **had + ${p}** after wish.`,
          [
            [
              `have ${p}`,
              "Present perfect is not the standard past-regret form after wish.",
            ],
            [`had ${g}`, "Had needs a past participle here, not -ing."],
            [
              `would ${v}`,
              "Would + base normally asks for changed behaviour rather than rewriting a finished past event.",
            ],
          ],
          "The time **then** refers to a finished past; use **past perfect** for the regret.",
        ),
        Q(
          "wish-behaviour",
          `You want someone to change an annoying habit: “I wish they would ____ ${o} without being asked.”`,
          v,
          `After **would**, keep base **${v}** for the desired change in behaviour.`,
          [
            [s, "Would takes a base form without -s."],
            [p, "A past form cannot directly follow would."],
            [`to ${v}`, "Would takes a bare infinitive without to."],
          ],
          "The change is expressed by **would + base verb**.",
        ),
        Q(
          "wish-ability",
          `You lack the ability: “If only I could ____ ${o} by myself.”`,
          v,
          `**Could + ${v}** expresses the wished-for ability.`,
          [
            [g, "Could alone does not take -ing."],
            [s, "Could does not take third-person -s on the next verb."],
            [`to ${v}`, "Could takes a bare infinitive."],
          ],
          "Could already marks the desired ability; use the **base verb** after it.",
        ),
      ],
    ),
    define(
      "passive-voice",
      "Passive voice: focus on the receiver",
      "B1",
      "bc-passives",
      "Change the focus of a clause while keeping its tense and meaning clear.",
      [
        L(
          "Change the starting point",
          "A passive clause makes the receiver or affected participant the subject. Build it with **be + past participle**. A by phrase can name the agent when that information matters, but it is often omitted when unknown or obvious.",
          "The report **was checked** by the editor.",
          "An intransitive verb such as arrive normally has no object to turn into a passive subject.",
        ),
        L(
          "Keep the original tense",
          "The form of **be** carries tense and agreement. The past participle stays the same. Present simple passive uses am/is/are; past simple passive uses was/were. Find the new subject’s number before choosing be.",
          "The letters **are delivered**. / The letter **was delivered**.",
          "A past participle is not a past-tense marker by itself: is delivered is present passive.",
        ),
        L(
          "Continuous and perfect passives",
          "A continuous passive adds being before the participle. A perfect passive adds been after have. Read the chain from left to right: first tense, then aspect, then passive.",
          "It **is being repaired**. / It **has been repaired**.",
          "Being and been are not interchangeable: continuous uses being; perfect uses been.",
        ),
        L(
          "Negatives, questions and modals",
          "Put not after the first auxiliary and move that auxiliary before the subject in questions. A modal passive uses modal + be + participle. Do not add do to a passive that already contains be.",
          "**Was** it repaired? / It **must be repaired**.",
          "A passive is a choice of focus, not automatically better or more formal than active voice.",
        ),
      ],
      actions,
      ({ v, p, g, o, plural }) => [
        Q(
          "present-passive",
          `Use present simple passive: “${o[0].toUpperCase() + o.slice(1)} ____ every week.”`,
          `${plural ? "are" : "is"} ${p}`,
          `The ${plural ? "plural" : "singular/uncountable"} subject takes **${plural ? "are" : "is"}**, followed by participle **${p}**.`,
          [
            [`is ${g}`, "This is active continuous, not passive."],
            [
              `${plural ? "is" : "are"} ${p}`,
              "This form of be does not agree with the subject.",
            ],
            [
              `is to ${v}`,
              "This is not the present-simple passive construction.",
            ],
          ],
          "The task asks for **receiver + present be + past participle**.",
        ),
        Q(
          "past-passive",
          `Use past simple passive: “${o[0].toUpperCase() + o.slice(1)} ____ yesterday.”`,
          `${plural ? "were" : "was"} ${p}`,
          `Past simple passive with this subject is **${plural ? "were" : "was"} ${p}**.`,
          [
            [
              `${plural ? "was" : "were"} ${p}`,
              "This form of be does not agree with the subject in this factual clause.",
            ],
            [`was ${g}`, "This is active past continuous, not passive."],
            [`did ${p}`, "Did cannot replace passive be before a participle."],
          ],
          "The event is past and the subject receives the action.",
        ),
        Q(
          "continuous-passive",
          `Use present continuous passive: “${o[0].toUpperCase() + o.slice(1)} ${plural ? "are" : "is"} ____ right now.”`,
          `being ${p}`,
          `After the finite form of be, **being ${p}** marks an ongoing passive action.`,
          [
            [
              `been ${p}`,
              "Been belongs after perfect have, not directly after is.",
            ],
            [
              p,
              "This makes simple passive, not the requested continuous passive.",
            ],
            [
              `being ${g}`,
              "The passive part needs a past participle after being.",
            ],
          ],
          "Ongoing passive = **be + being + past participle**.",
        ),
        Q(
          "modal-passive",
          `Use a modal passive: “${o[0].toUpperCase() + o.slice(1)} must ____ before Friday.”`,
          `be ${p}`,
          `After must, use base **be** and participle **${p}**.`,
          [
            [
              `been ${p}`,
              "Must needs have before been; this task asks for a simple modal passive.",
            ],
            [`is ${p}`, "A finite is cannot follow must."],
            [`be ${g}`, "This is active continuous, not passive."],
          ],
          "The object receives the required action: **must be + participle**.",
        ),
      ],
    ),
    define(
      "relative-clauses",
      "Defining and non-defining relative clauses",
      "B1",
      "bc-relative",
      "Identify a person or thing precisely, or add extra information without changing who you mean.",
      [
        L(
          "Defining information",
          "A defining relative clause tells us which person or thing is meant and usually has no surrounding commas. Who refers to people; which refers to things; that can often refer to either in defining clauses. The relative pronoun can be subject or object within its clause.",
          "The person **who called** left a message.",
          "Do not mark that as wrong where it is a valid defining relative alternative to who or which.",
        ),
        L(
          "Extra information",
          "A non-defining relative clause adds information about an already identified referent and is set off with commas. Use who or which, not that. The relative pronoun is not omitted in this type of clause.",
          "My bicycle, **which is red**, is outside.",
          "Leaving out the commas may change whether the information identifies the referent or merely adds a detail.",
        ),
        L(
          "Possession and place",
          "Whose marks a possessive relationship and comes before a noun. Where introduces a relative clause about a place when that place has an adverbial role. Compare the place where we met with the place which we visited: visited takes a direct object.",
          "The artist **whose work** won is here.",
          "Where is not a universal substitute for which after a place noun; the role inside the clause matters.",
        ),
        L(
          "When omission is possible",
          "In a defining clause, an object relative pronoun can often be omitted. A subject relative pronoun cannot normally be omitted. Non-defining clauses keep the pronoun regardless of its role.",
          "The book **(that) I read** was short. / The book **that won** was long.",
          "The person works here without a relative pronoun is a main clause, not a defining clause attached to another noun phrase.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "relative-person",
          `Choose a person-relative pronoun: “The assistant ____ ${s} ${o} is here.”`,
          "who",
          "**Who** refers to the person and is the subject of the relative clause.",
          [
            ["which", "Which normally refers to things, not this person."],
            ["whose", "Whose needs a following noun to express possession."],
            [
              "where",
              "Where would express a place role, not the person subject.",
            ],
          ],
          "Identify the antecedent as a **person** and the gap as the clause’s subject.",
        ),
        Q(
          "nondefining-relative",
          `Add extra information: “Our assistant, ____ ${s} ${o} every week, is away.”`,
          "who",
          "The commas mark a non-defining clause about a person, so use **who**.",
          [
            [
              "that",
              "That is not used as the relative pronoun in an ordinary non-defining clause.",
            ],
            ["—", "The pronoun cannot be omitted in a non-defining clause."],
            ["whose", "Whose requires a noun after it to express possession."],
          ],
          "The **commas** signal extra information, and the referent is a person.",
        ),
        Q(
          "relative-possession",
          `Express possession: “The assistant ____ job is to ${v} ${o} has arrived.”`,
          "whose",
          "**Whose job** marks the job’s relationship to the assistant.",
          [
            ["who", "Who alone cannot mark possession before job."],
            ["who’s", "Who’s means who is or who has, not whose."],
            [
              "which",
              "Which job would ask or identify a job, not mark the assistant’s possession here.",
            ],
          ],
          "The blank comes before **job** and means **the assistant’s**.",
        ),
        Q(
          "object-relative-omission",
          `In “The task that we chose was to ${v} ${o}”, what is true about “that”?`,
          "It can be omitted because it is the object in a defining clause.",
          "We is the subject and that represents the object of chose; a defining object relative can be omitted.",
          [
            [
              "It must stay because every relative pronoun is a subject.",
              "Relative pronouns can be objects; here we is the subject.",
            ],
            [
              "It can be omitted because all non-defining pronouns can be omitted.",
              "This is defining, and non-defining relative pronouns cannot normally be omitted.",
            ],
            [
              "It must change to whose because task is a noun.",
              "Whose would mark possession, which is not the role here.",
            ],
          ],
          "Inside **we chose**, locate the subject and the missing object.",
        ),
      ],
    ),
    define(
      "reported-statements",
      "Reported speech: statements and reference",
      "B1",
      "bc-reported-statements",
      "Report someone’s message while adjusting tense, pronouns and time words to the reporting situation.",
      [
        L(
          "Reporting is a change of viewpoint",
          "Reported speech conveys a message without quoting the exact words. A that-clause commonly follows said or told. Pronouns and time expressions depend on who reports the message, where and when. Do not change them mechanically without checking the situation.",
          "“I’m ready.” → She said **she was ready**.",
          "If the report is made on the same day, today may remain today. There is no compulsory word-replacement table independent of context.",
        ),
        L(
          "Backshift after a past reporting verb",
          "When a report looks back from a later time, present often shifts to past, past to past perfect, and will to would. This is called backshift. It helps mark the original message as earlier than the reporting moment.",
          "“I work here.” → He said he **worked** there.",
          "Backshift is not always necessary if the message is still true or relevant. The exercises explicitly request it where needed.",
        ),
        L(
          "Say and tell",
          "Use **say something** or **say to someone**. Use **tell someone something** with an object naming the listener. These are different verb patterns. Told me that and said to me that can both be correct.",
          "She **told me** the news. / She **said** she was tired.",
          "She said me is not the standard pattern; use told me or said to me.",
        ),
        L(
          "Modals and continuing truth",
          "Will commonly becomes would and can becomes could in a backshifted report. Would, could, should and might often remain unchanged. A current fact can remain in present tense when the reporter endorses it as still true.",
          "He said the Earth **is** round.",
          "Reported speech is about accurate meaning, not changing every verb merely because said is past.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "present-backshift",
          `Backshift this report: She said, “I ${v} ${o} every week.” → She said she ____ ${o} every week.`,
          p,
          `The instruction requests backshift from present ${v} to past **${p}**.`,
          [
            [
              s,
              "This keeps present tense; the task explicitly requests backshift.",
            ],
            [g, "An -ing form alone does not supply a finite reported verb."],
            [`to ${v}`, "A to-infinitive does not complete this that-clause."],
          ],
          "The reporting verb is past and the instruction requests a **present-to-past backshift**.",
        ),
        Q(
          "future-backshift",
          `Report the plan with backshift: “I will ${v} ${o}.” → She said she ____ ${o}.`,
          `would ${v}`,
          `Backshift **will** to **would**, keeping base ${v}.`,
          [
            [
              `would ${p}`,
              "The verb after would must remain in its base form.",
            ],
            [`would to ${v}`, "Would takes a bare infinitive without to."],
            [
              `will ${g}`,
              "Will cannot directly take -ing, and it does not perform the requested backshift.",
            ],
          ],
          "Backshift the **modal**, not the main verb after it.",
        ),
        Q(
          "tell-object",
          `Choose the verb pattern: “She ____ me that she would ${v} ${o}.”`,
          "told",
          "**Told me that** uses tell with a listener object.",
          [
            [
              "said",
              "Say does not take me directly in this pattern; it would need to me.",
            ],
            ["spoke", "Spoke me that is not the required reporting pattern."],
            [
              "talked",
              "Talked me that is not the standard statement-reporting pattern.",
            ],
          ],
          "The listener **me** follows the reporting verb directly.",
        ),
        Q(
          "past-backshift",
          `Backshift a finished past statement: “We ${p} ${o}.” → They said they ____ ${o}.`,
          `had ${p}`,
          `A requested backshift from past simple uses **had + ${p}**.`,
          [
            [
              `have ${p}`,
              "Present perfect is not the requested backshift from past simple.",
            ],
            [`had ${g}`, "Had needs a past participle in the past perfect."],
            [
              `had to ${v}`,
              "Had to changes the meaning to obligation rather than reporting the completed action.",
            ],
          ],
          "The original action is already past; the requested backshift is **past perfect**.",
        ),
      ],
    ),
    define(
      "reported-questions",
      "Reported questions and commands",
      "B1",
      "bc-reported-questions",
      "Embed a question in a report without carrying direct-question word order into the embedded clause.",
      [
        L(
          "Yes/no questions use if or whether",
          "A reported yes/no question commonly starts with asked if or asked whether. The embedded clause has **statement order**, with subject before verb. A report of a question is not itself necessarily a question and usually ends with a full stop.",
          "She asked **whether I was ready**.",
          "She asked was I ready keeps direct-question order where an embedded clause is needed.",
        ),
        L(
          "Wh-questions keep the question word",
          "Who, what, where, when, why and how stay at the start of the embedded clause. Remove do-support when it only formed the direct question and put the lexical verb into the appropriate tense.",
          "“Where do you work?” → She asked **where I worked**.",
          "Where did I work inside a statement report incorrectly retains inversion and do-support.",
        ),
        L(
          "Commands use an infinitive pattern",
          "Tell or ask someone **to do** something can report an instruction or request. A negative command uses **not to do**. Keep the person receiving the instruction as the object of told or asked.",
          "She told us **to wait**. / She asked us **not to leave**.",
          "Told us wait omits to in this reported-command pattern.",
        ),
        L(
          "Adjust viewpoint carefully",
          "Pronouns, time words and backshift depend on the reporting context, just as in reported statements. Subject questions require special care: Who called? already has subject-first order and does not contain removable do-support.",
          "He asked **who had called**.",
          "Whether is preferred or required in some structures, such as whether to leave and after prepositions; if cannot replace it everywhere.",
        ),
      ],
      actions,
      ({ v, p, o }) => [
        Q(
          "reported-yes-no",
          `Report the question with statement order: “Did she ${v} ${o}?” → He asked whether ____.`,
          `she had ${p} ${o}`,
          `After **whether**, use subject **she** before **had ${p}** in this backshifted report.`,
          [
            [
              `had she ${p} ${o}`,
              "This keeps question inversion inside the embedded clause.",
            ],
            [
              `did she ${v} ${o}`,
              "This keeps direct-question do-support and inversion.",
            ],
            [
              `she did ${p} ${o}`,
              "After did, a main verb must be base; this is not the requested backshifted structure.",
            ],
          ],
          "An embedded question uses **subject before verb**.",
        ),
        Q(
          "reported-wh-order",
          `Report with backshift: “When will they ${v} ${o}?” → She asked when ____.`,
          `they would ${v} ${o}`,
          `Keep when, then use **they would ${v}** in statement order.`,
          [
            [
              `would they ${v} ${o}`,
              "The subject must precede would inside the embedded question.",
            ],
            [`they would to ${v} ${o}`, "Would takes a bare infinitive."],
            [`they would ${p} ${o}`, "The verb after would stays base."],
          ],
          "Keep the question word, but **remove inversion** in the report.",
        ),
        Q(
          "reported-command",
          `Report the instruction: “Please ${v} ${o}.” → She asked us ____.`,
          `to ${v} ${o}`,
          `A reported request uses **asked us to ${v}**.`,
          [
            [
              `${v} ${o}`,
              "The reported-request pattern needs to before the infinitive.",
            ],
            [
              `${p} ${o}`,
              "A past form does not complete asked us in this request pattern.",
            ],
            [
              `that ${v} ${o}`,
              "That would need a complete finite clause, not a bare verb.",
            ],
          ],
          "Report the instruction with **ask + person + to-infinitive**.",
        ),
        Q(
          "negative-reported-command",
          `Report “Do not ${v} ${o} yet.” → She told us ____.`,
          `not to ${v} ${o} yet`,
          `The negative reported instruction is **told us not to ${v}**.`,
          [
            [
              `do not ${v} ${o} yet`,
              "This keeps the direct imperative instead of using a reported infinitive.",
            ],
            [`not ${v} ${o} yet`, "To is missing before the infinitive."],
            [
              `not to ${p} ${o} yet`,
              "After to, use the base form, not the past form.",
            ],
          ],
          "Put **not before to** in a reported negative instruction.",
        ),
      ],
    ),
    define(
      "noun-clauses",
      "Indirect questions, noun clauses and preparatory it",
      "B2",
      "bc-questions-reference",
      "Use a whole clause as a subject, object or complement, and keep embedded questions in statement order.",
      [
        L(
          "Clauses can fill noun-like roles",
          "A that-clause can express the content of a belief, statement or fact. It may be the object of a verb or follow a noun or adjective. In many object clauses, that can be omitted, but it helps readers recognise a complex structure.",
          "I believe **that she is right**.",
          "That does not itself supply a subject and verb; the words after it still need a complete clause.",
        ),
        L(
          "Polite indirect questions",
          "An opening such as Could you tell me can make a question less direct. Inside the embedded question, use statement order. The whole sentence still takes a question mark because the outer clause is a question.",
          "Could you tell me **where she works**?",
          "Where does she work is direct-question order, not the order required inside this embedded clause.",
        ),
        L(
          "Whether before an infinitive",
          "Use **whether to + base verb** to discuss a choice or uncertainty about an action. Whether can also introduce alternatives or follow a preposition. If is common in finite yes/no reports but does not normally replace whether before to-infinitives.",
          "We discussed **whether to leave**.",
          "We discussed if to leave is not the standard pattern.",
        ),
        L(
          "Preparatory it",
          "English often uses **it** as a grammatical subject when a long clause or infinitive is placed later. This can make information easier to process. Compare To check is important with It is important to check. It here does not refer to an object.",
          "**It is important to check** the details.",
          "Do not omit the grammatical subject in an ordinary English statement: Is important to check is incomplete.",
        ),
      ],
      actions,
      ({ v, s, p, o }) => [
        Q(
          "indirect-question-order",
          `Choose the polite indirect question about ${o}.`,
          `Could you tell me why she ${s} ${o}?`,
          "Inside **why she ...**, the subject comes before the verb; does is not retained.",
          [
            [
              `Could you tell me why does she ${v} ${o}?`,
              "This retains direct-question inversion inside the embedded clause.",
            ],
            [
              `Could you tell me why she ${v} ${o}?`,
              "The singular third-person subject needs the -s verb in this present-simple clause.",
            ],
            [
              `Could you tell me why she to ${v} ${o}?`,
              "A to-infinitive cannot serve as the finite predicate after she.",
            ],
          ],
          "The outer clause is the question; the inner clause keeps **statement order**.",
        ),
        Q(
          "whether-infinitive",
          `“We have not decided ____ to ${v} ${o} today.”`,
          "whether",
          "**Whether to** introduces the decision between doing and not doing the task.",
          [
            [
              "if",
              "If does not normally introduce a to-infinitive in this pattern.",
            ],
            [
              "that",
              "That does not introduce this whether-or-not choice before an infinitive.",
            ],
            [
              "what",
              "What to would mean choosing an object, but the task already supplies the object.",
            ],
          ],
          "Before a **to-infinitive** expressing a yes/no choice, use whether.",
        ),
        Q(
          "preparatory-it",
          `“____ is important to ${v} ${o} carefully.”`,
          "It",
          "Preparatory **it** fills the subject position, with the important action expressed later by the infinitive.",
          [
            [
              "There",
              "Existential there does not introduce this adjective + infinitive evaluation.",
            ],
            ["—", "An ordinary English statement needs a subject here."],
            [
              "They",
              "They does not agree with is and does not serve as preparatory it.",
            ],
          ],
          "The real content comes in the infinitive; English still needs a **grammatical subject**.",
        ),
        Q(
          "finite-that-clause",
          `Complete the content clause: “We know that she ____ ${o} every week.”`,
          s,
          `The that-clause is finite, so **she ${s}** uses present agreement.`,
          [
            [
              v,
              "The third-person singular subject requires -s in this affirmative clause.",
            ],
            [`to ${v}`, "A to-infinitive is not a finite verb after she."],
            [
              `been ${p}`,
              "Been would need an auxiliary and does not fit this active present-simple clause.",
            ],
          ],
          "A **that-clause** has its own subject and finite verb.",
        ),
      ],
    ),
  ];
}

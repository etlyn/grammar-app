import { define, task as Q } from "./engine.mjs";
import { actions, perfectActions } from "./contexts.mjs";
const L = (title, rule, pattern, edge) => [title, rule, pattern, edge];
export function buildTenses() {
  return [
    define(
      "future-forms",
      "Future plans, predictions and arrangements",
      "A2",
      "bc-future-forms",
      "Choose a future form by the speaker’s intention: a decision, a plan, an arrangement or a timetable.",
      [
        L(
          "Decisions and promises",
          "Use **will + base verb** for a decision made while speaking, a promise or a prediction. Will does not change with the subject. A time word such as tomorrow does not force will: the speaker’s meaning matters more than the date. In conversation, I will often becomes I’ll.",
          "I **will help**. / She **will not help**.",
          "Do not add -s after will: she will helps is not the standard form.",
        ),
        L(
          "Prior intentions",
          "Use **be going to + base verb** for an intention formed before speaking. The form of be agrees with the subject. Going to also introduces a prediction based on present evidence. A dark sky can justify It is going to rain, even if no one planned the rain.",
          "We **are going to leave**.",
          "Going to and will can overlap. These questions explicitly name the construction rather than treating both as universally incompatible.",
        ),
        L(
          "Arranged future events",
          "The present continuous can describe a future arrangement, especially when another person, place or booking is involved. A future time expression separates this use from an action happening now. Present continuous is not a general replacement for will in predictions.",
          "We **are meeting** the guide tomorrow.",
          "It is raining tomorrow is unusual as a simple weather prediction; use a suitable prediction form.",
        ),
        L(
          "Timetables and future time clauses",
          "Use present simple for published timetables. After when, as soon as, before and until in an ordinary future time clause, use a present form. The main clause can contain will. This rule concerns time clauses, not indirect questions about what will happen.",
          "I’ll call **when I arrive**.",
          "I wonder when she will arrive is an indirect question, so will is possible there.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "will-form",
          `Make a promise with will: I ____ ${o} tomorrow.`,
          `will ${v}`,
          `A promise uses **will + ${v}**. The modal already marks the future meaning; keep the main verb in its base form.`,
          [
            [`will to ${v}`, "Will takes a bare infinitive, without to."],
            [
              `will ${g}`,
              "An -ing form cannot follow will alone; a continuous form would need be.",
            ],
            [`will ${p}`, "A past form cannot directly follow will."],
          ],
          "The instruction asks for a promise with **will**. Check the form immediately after the modal.",
        ),
        Q(
          "going-to-form",
          `Complete the prior plan using going to: We ____ ${o} next week.`,
          `are going to ${v}`,
          `With **we**, use **are going to + ${v}** for the stated prior plan.`,
          [
            [`is going to ${v}`, "Is does not agree with we."],
            [
              `are going to ${g}`,
              "To in this intention pattern takes the base verb, not -ing.",
            ],
            [`going to ${v}`, "The finite verb are is missing."],
          ],
          "Find the subject, then build **be going to + base verb**.",
        ),
        Q(
          "arrangement",
          `Use the present continuous for a booked arrangement: She ____ ${o} on Tuesday.`,
          `is ${g}`,
          `The arrangement is expressed with **is + ${g}**; Tuesday gives it future reference.`,
          [
            [`are ${g}`, "Are does not agree with she."],
            [`is ${v}`, "The present continuous needs the -ing form after is."],
            [`${g}`, "The finite auxiliary is is missing."],
          ],
          "A future time can accompany a present continuous arrangement. Check subject + be + -ing.",
        ),
        Q(
          "future-time-clause",
          `Keep the when-clause in the present simple: I will call when I ____ ${o}.`,
          v,
          `The ordinary future time clause after **when** uses present simple: **I ${v}**.`,
          [
            [
              `will ${v}`,
              "This ordinary when time clause uses a present form, not will.",
            ],
            [
              g,
              "An -ing form alone is not a finite verb for I in this clause.",
            ],
            [
              `to ${v}`,
              "An infinitive cannot serve as the finite verb after when I.",
            ],
          ],
          "Locate **when**. The future marker belongs in the main clause, while this time clause uses present simple.",
        ),
      ],
    ),
    ...[
      [
        "present-perfect",
        "Present perfect: experience and results",
        "B1",
        "bc-present-perfect",
        "have",
        "has",
        "present",
        "up to now",
        "The present perfect connects earlier events with the present: an experience so far, a recent result or a period that is still open. Contrast this with a finished past time such as yesterday. A past participle may resemble the past simple, but irregular verbs can differ: went / gone, saw / seen.",
        "For a finished date, use past simple: I visited last year. British English often prefers present perfect with just or already; American English also uses past simple in those contexts.",
      ],
      [
        "past-perfect",
        "Past perfect: the earlier past",
        "B1",
        "bc-past-perfect",
        "had",
        "had",
        "past",
        "before the inspection began",
        "The past perfect looks backwards from a past reference point. It marks the earlier event with had + past participle. This is useful when the narrative moves out of chronological order. The later event usually uses past simple. Once the order is clear, a story does not need past perfect in every sentence.",
        "Before and after can already show the sequence, so past simple is sometimes enough. Past perfect is not required merely because an event happened a long time ago.",
      ],
    ].map(([slug, title, level, ref, aux, third, time, cue, intro, edge]) =>
      define(
        slug,
        title,
        level,
        ref,
        intro,
        [
          L(
            "Connect two points in time",
            intro,
            `Subject + **${aux} / ${third} + past participle**`,
            edge,
          ),
          L(
            "Build the perfect verb",
            "A perfect construction uses **have as an auxiliary**, followed by a past participle. Regular participles normally end in -ed. Irregular ones must be learned with their base and past forms: write / wrote / written. Do not substitute an -ing form unless you also build the continuous construction.",
            `She **${third} written**. / They **${aux} written**.`,
            "The form written is a participle; wrote is past simple. They are not interchangeable after have.",
          ),
          L(
            "Negatives and questions",
            `Put **not after ${aux} or ${third}**. For a yes/no question, move the auxiliary before the subject. The participle stays unchanged. There is no extra do or did because the perfect construction already contains an auxiliary.`,
            `${aux === "had" ? "Had" : "Have"} they finished? / They **${aux} not finished**.`,
            "Do not combine did with a perfect auxiliary to make its negative or question.",
          ),
          L(
            "Time expressions and short answers",
            `Read the whole sentence to locate the reference time. Here it is **${cue}**. Keep the appropriate form of have in a short answer and omit the repeated participle. Since names a starting point; for names a duration. Neither word automatically selects a single tense.`,
            `Yes, they **${aux}**. / No, they **${aux} not**.`,
            "Been can describe a completed visit; gone often means the person has left and has not yet returned.",
          ),
        ],
        perfectActions,
        ({ v, p, g, o }) => [
          Q(
            "perfect-affirmative",
            `Use the ${time} perfect: She ____ ${o} ${cue}.`,
            `${third} ${p}`,
            `The requested ${time} perfect needs **${third} + ${p}** with she. The reference is ${cue}.`,
            [
              [
                `${third} ${g}`,
                "The perfect simple takes a past participle, not an -ing form.",
              ],
              [
                `${third} to ${v}`,
                "An infinitive cannot follow the perfect auxiliary here.",
              ],
              [
                `${third} been ${g}`,
                "This is a perfect continuous form; the instruction specifically asks for perfect simple.",
              ],
            ],
            `Find the ${time} reference and use **have + past participle**, with the auxiliary in the appropriate tense.`,
          ),
          Q(
            "perfect-negative",
            `Make a ${time}-perfect negative: They ____ ${o} ${cue}.`,
            `${aux} not ${p}`,
            `Place **not after ${aux}** and keep **${p}**: they ${aux} not ${p}.`,
            [
              [
                `did not ${aux} ${p}`,
                "Perfect negatives do not add did; not follows the existing auxiliary.",
              ],
              [
                `${aux} not ${g}`,
                "The -ing form needs been for a perfect continuous, which is not requested.",
              ],
              [
                `not ${aux} ${p}`,
                "In the standard finite negative, not follows the auxiliary.",
              ],
            ],
            `Keep the ${time}-perfect auxiliary and add **not** immediately after it.`,
          ),
          Q(
            "perfect-question",
            `Begin this ${time}-perfect question: ____ they ${p} ${o} ${cue}?`,
            aux === "had" ? "Had" : "Have",
            `Move **${aux}** before they. The participle ${p} remains after the subject.`,
            [
              [
                "Did",
                "Did would require a base verb and would not make this perfect question.",
              ],
              [
                "Are",
                "Are would create a different structure, not the requested perfect.",
              ],
              [
                "Has",
                "Has does not agree with they, and cannot form a past-perfect question.",
              ],
            ],
            "The first auxiliary moves before the subject; do not add a new auxiliary.",
          ),
          Q(
            "perfect-participle",
            `Choose the participle for the ${time} perfect: We ${aux} ____ ${o} ${cue}. (${v})`,
            p,
            `The past participle of **${v}** is **${p}**. It follows ${aux} in the requested perfect construction.`,
            [
              [g, "This is the -ing form, not the past participle."],
              [`to ${v}`, "This is the to-infinitive, not a past participle."],
              [
                `been ${g}`,
                "This would make a perfect continuous construction, not perfect simple.",
              ],
            ],
            "Identify the past participle, rather than choosing a word only because it looks past.",
          ),
        ],
      ),
    ),
    ...[
      [
        "present-perfect-continuous",
        "Present perfect simple and continuous",
        "B2",
        "bc-perfect-continuous",
        "have",
        "has",
        "present",
        "so far today",
        "The perfect continuous connects an activity with now and draws attention to duration, repetition or visible evidence of recent effort. The activity may still continue or may have just stopped. The perfect simple often highlights a completed result or a number of finished items.",
      ],
      [
        "past-perfect-continuous",
        "Past perfect continuous",
        "B2",
        "bc-past-perfect",
        "had",
        "had",
        "past",
        "before lunch yesterday",
        "The past perfect continuous describes an activity leading up to a past moment. It can explain a past condition: someone was tired because they had been working. The simple perfect often foregrounds completion; the continuous foregrounds the activity and its duration.",
      ],
    ].map(([slug, title, level, ref, aux, third, time, cue, intro]) =>
      define(
        slug,
        title,
        level,
        ref,
        intro,
        [
          L(
            "Focus on the activity",
            intro,
            `Subject + **${aux} been + -ing**`,
            "A continuous form does not guarantee that the activity is unfinished; context can show that it recently stopped.",
          ),
          L(
            "Keep both auxiliaries",
            `The construction has three verb parts: **${aux} or ${third}**, then **been**, then an **-ing** form. Only the first auxiliary changes with tense and subject. Been is the past participle of be; it connects perfect aspect with the continuous construction.`,
            `She **${third} been working**.`,
            "Do not omit been or change it to being in this construction.",
          ),
          L(
            "Questions and negatives",
            `Move only **${aux} or ${third}** before the subject in questions. Put not after that same auxiliary in negatives. Been and the -ing form remain in place. A short answer repeats only the first auxiliary.`,
            `${aux === "had" ? "Had" : "Have"} they **been working**?`,
            "Have been they working? puts too much of the verb phrase before the subject.",
          ),
          L(
            "State verbs and completed quantities",
            "Know, own and believe usually describe states and favour perfect simple: I have known her for years. A completed count also favours the simple: I have written three reports. Repeated activity can use continuous: I have been writing reports all morning. The meaning of the verb matters, not just a time expression.",
            "I have **known** her for years. / I have **been waiting** for an hour.",
            "For and since can accompany simple perfect states; they do not automatically require continuous.",
          ),
        ],
        perfectActions,
        ({ v, p, g, o }) => [
          Q(
            "continuous-affirmative",
            `Use the ${time} perfect continuous: She ____ ${o} for an hour ${cue}.`,
            `${third} been ${g}`,
            `Build **${third} + been + ${g}**. The sentence focuses on the duration of the activity ${cue}.`,
            [
              [
                `${third} ${g}`,
                "Been is missing between the perfect auxiliary and the -ing form.",
              ],
              [
                `${third} being ${g}`,
                "The perfect auxiliary requires been, not being.",
              ],
              [
                `${third} been ${p}`,
                "A past participle here would suggest passive voice rather than the requested active continuous.",
              ],
            ],
            "An activity lasting for a period calls for the requested **perfect + continuous** form.",
          ),
          Q(
            "continuous-negative",
            `Make a ${time}-perfect-continuous negative: We ____ ${o} all morning ${cue}.`,
            `${aux} not been ${g}`,
            `Put not after **${aux}**, before **been ${g}**.`,
            [
              [
                `${aux} been not ${g}`,
                "The ordinary negative position is after the first auxiliary, before been.",
              ],
              [`${aux} not ${g}`, "Been is missing."],
              [
                `did not been ${g}`,
                "Did cannot combine with been to make a perfect continuous negative.",
              ],
            ],
            "Put **not after the first auxiliary** and retain the rest of the verb phrase.",
          ),
          Q(
            "continuous-question",
            `Complete the ${time}-perfect-continuous question: ${aux === "had" ? "Had" : "Have"} they ____ ${o} for long ${cue}?`,
            `been ${g}`,
            `The first auxiliary is already at the front. After they, keep **been + ${g}**.`,
            [
              [`being ${g}`, "The perfect auxiliary requires been, not being."],
              [
                `been ${v}`,
                "The active continuous part requires -ing, not the base form.",
              ],
              [g, "The linking auxiliary been is missing."],
            ],
            "The first auxiliary has already moved. Supply **been + -ing** after the subject.",
          ),
          Q(
            "simple-continuous-contrast",
            `Choose the ${time} perfect SIMPLE, focusing on completion: I ____ ${o} ${cue}.`,
            `${aux} ${p}`,
            `The instruction focuses on a completed result, so use the simple perfect **${aux} ${p}**.`,
            [
              [
                `${aux} been ${g}`,
                "This is perfect continuous, which foregrounds the activity rather than the requested simple form.",
              ],
              [
                `${aux} ${g}`,
                "This omits been and is not a complete perfect continuous form.",
              ],
              [
                `${aux} to ${v}`,
                "Have as a perfect auxiliary cannot take a to-infinitive.",
              ],
            ],
            "Separate **completion** from **duration**. The requested form is perfect simple.",
          ),
        ],
      ),
    ),
    define(
      "future-perfect-continuous",
      "Future continuous and future perfect",
      "B2",
      "bc-future-perfect",
      "Look ahead to an activity in progress, a completed result or a duration measured from a future point.",
      [
        L(
          "An activity at a future moment",
          "Use **will be + -ing** to picture an activity already in progress at a future moment. You are looking into the middle of it. This differs from will + base verb, which can simply predict an event or express a decision.",
          "At noon, we **will be travelling**.",
          "A precise future time does not always require continuous; the intended viewpoint decides.",
        ),
        L(
          "Completion by a future deadline",
          "Use **will have + past participle** to look back from a future point at something expected to be complete. By means no later than that point. Until generally describes continuation up to a point, so it is not interchangeable with by.",
          "By noon, we **will have arrived**.",
          "Will have arrived describes completion by a deadline; will arrive until noon does not express that meaning.",
        ),
        L(
          "Duration up to a future point",
          "Use **will have been + -ing** for the duration of an activity measured at a future point. It combines future reference, perfect aspect and continuous aspect. The first auxiliary is will; the later forms stay have and been.",
          "By July, I **will have been working** here for a year.",
          "State verbs usually favour future perfect simple: will have known, rather than will have been knowing.",
        ),
        L(
          "Questions and negatives",
          "Move **will** before the subject in a question. Put **not** after will in a negative. All later auxiliaries stay after the subject in their original order. In conversation, will not often becomes won’t.",
          "Will she **have finished**? / She **will not have finished**.",
          "Do not change have to has after will, even with she, he or it.",
        ),
      ],
      perfectActions,
      ({ v, p, g, o }) => [
        Q(
          "future-in-progress",
          `Use future continuous: At ten tomorrow, we ____ ${o}.`,
          `will be ${g}`,
          `Future continuous pictures an activity at that moment: **will be ${g}**.`,
          [
            [`will ${g}`, "Be is needed before the -ing form."],
            [`will been ${g}`, "After will use base be, not been."],
            [
              `will be ${p}`,
              "This is a passive-shaped phrase, not the requested active continuous.",
            ],
          ],
          "Picture the activity **in progress at a future time**.",
        ),
        Q(
          "future-completion",
          `Use future perfect simple: By Friday, they ____ ${o}.`,
          `will have ${p}`,
          `The future perfect simple is **will have ${p}**, looking back from Friday.`,
          [
            [`will has ${p}`, "Have must remain base form after will."],
            [`will have ${g}`, "Perfect simple needs a past participle."],
            [`will had ${p}`, "Had cannot follow will directly."],
          ],
          "By gives a future deadline. Build **will + have + participle**.",
        ),
        Q(
          "future-duration",
          `Use future perfect continuous: By noon, I ____ ${o} for two hours.`,
          `will have been ${g}`,
          `The duration measured at noon is expressed by **will have been ${g}**.`,
          [
            [
              `will have being ${g}`,
              "Use the past participle been, not being, after have.",
            ],
            [
              `will been ${g}`,
              "Have is missing and will cannot take been directly.",
            ],
            [`will have be ${g}`, "Have needs been, not base be."],
          ],
          "Combine the future auxiliary with **have been + -ing** to measure duration.",
        ),
        Q(
          "future-question-order",
          `Choose the opening for a future-perfect question about ${o}: ____ they have ${p} it by Friday?`,
          "Will",
          "Only **will** moves before the subject; have stays after they.",
          [
            [
              "Have",
              "The sentence already has have after they; the future auxiliary is missing.",
            ],
            ["Do", "Do is not added when will is the first auxiliary."],
            [
              "Will have",
              "This would repeat have and put two auxiliaries before the subject.",
            ],
          ],
          "In a multi-auxiliary question, move **only the first auxiliary**.",
        ),
      ],
    ),
    define(
      "past-habits",
      "Past habits: used to, would and getting used to",
      "B1",
      "bc-past-habits",
      "Distinguish a former habit from a familiar experience and from the process of adapting.",
      [
        L(
          "Former habits and states",
          "Use **used to + base verb** for a past habit or state that contrasts with now. Used to can describe actions and states. In standard written questions and negatives after did, use **use to**.",
          "I **used to live** here. / Did you **use to live** here?",
          "Used to is not a normal present-habit form. For habits now, use present simple.",
        ),
        L(
          "Repeated past actions with would",
          "Would can recall repeated actions within an established past period. It normally needs a clear past setting and does not usually replace used to for a continuing state such as owning a house.",
          "When we were children, we **would visit** every summer.",
          "We would own a cottage does not normally describe simple past ownership.",
        ),
        L(
          "Being accustomed to something",
          "In **be used to**, used is an adjective and to is a preposition. Follow it with a noun or an -ing form. It means familiar or accustomed, and be can refer to present, past or future.",
          "She **is used to working** at night.",
          "Is used to work does not mean that she is accustomed to working.",
        ),
        L(
          "The process of adapting",
          "**Get used to + noun / -ing** describes becoming accustomed. The tense belongs to get: am getting used to, got used to, will get used to. This is distinct from a discontinued habit.",
          "I’m **getting used to driving** on the left.",
          "Do not add an extra be after get; get used to already expresses the change.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "former-habit",
          `Complete a former habit: I used to ____ ${o}, but I do not do that now.`,
          v,
          `The discontinued-habit pattern is **used to + ${v}**, using the base verb.`,
          [
            [
              g,
              "The -ing form belongs after be/get used to, not after past-habit used to.",
            ],
            [
              p,
              "Used to already marks the past habit; the following verb stays in the base form.",
            ],
            [`to ${v}`, "To is already present; do not repeat it."],
          ],
          "Here used to contrasts a past routine with now.",
        ),
        Q(
          "habit-negative",
          `Use did in the negative: I did not ____ ${o} in my old job.`,
          `use to ${v}`,
          `After **did not**, standard written English uses **use to ${v}**.`,
          [
            [
              `used to ${v}`,
              "After did, the recommended standard written form is use to, without -d.",
            ],
            [`use to ${g}`, "Past-habit use to takes the base verb."],
            [`using to ${v}`, "Did requires the base form use, not using."],
          ],
          "The past marker is already on **did**.",
        ),
        Q(
          "accustomed-state",
          `I am familiar with the task: I am used to ____ ${o}.`,
          g,
          `In **am used to**, to is a preposition, so the following verb is **${g}**.`,
          [
            [
              v,
              "The base verb belongs in the former-habit pattern, not after am used to.",
            ],
            [
              p,
              "A past participle does not name the activity after this preposition.",
            ],
            [
              `to ${v}`,
              "Do not put a to-infinitive after the preposition to in this pattern.",
            ],
          ],
          "The word **am** changes the construction: this is familiarity, not a former habit.",
        ),
        Q(
          "repeated-past-action",
          `Recall a repeated action with would: In my old job, I would ____ ${o} every week.`,
          v,
          `Would takes the base verb **${v}**. The old job and every week establish a repeated past action.`,
          [
            [g, "Would alone cannot take an -ing form."],
            [p, "Would takes a base verb, not a past form."],
            [`to ${v}`, "Would takes a bare infinitive without to."],
          ],
          "The context supplies a past routine; **would** still takes the base form.",
        ),
      ],
    ),
  ];
}

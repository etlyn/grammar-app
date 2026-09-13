import { define, task as Q } from "./engine.mjs";
import { actions } from "./contexts.mjs";
const L = (...a) => a;
export function buildVerbs() {
  return [
    define(
      "stative-dynamic",
      "States and actions: simple or continuous?",
      "B1",
      "bc-stative",
      "Choose a verb form from its meaning: a state, an activity or a temporary behaviour.",
      [
        L(
          "States are not normally continuous",
          "Know, believe, own and need commonly describe states rather than activities unfolding moment by moment. They usually take simple forms even when true now. A word such as now does not force every verb into the continuous.",
          "I **know** the answer now.",
          "I am knowing the answer is not the ordinary standard form for possession of knowledge.",
        ),
        L(
          "A verb can change meaning",
          "Think can mean hold an opinion or actively consider. Have can mean possess or take part in an activity. Use the meaning in the sentence to decide whether continuous aspect is natural.",
          "I **think** it is useful. / I **am thinking about** the problem.",
          "A memorised list of stative verbs is not enough: the same spelling can have a dynamic sense.",
        ),
        L(
          "Temporary behaviour with being",
          "Be usually describes a state, but **be being + adjective** can describe temporary behaviour. You are being helpful comments on someone’s behaviour now. It does not mean that every adjective works naturally in this pattern.",
          "He **is being patient** today.",
          "He is being tall does not normally describe temporary behaviour; height is a characteristic.",
        ),
        L(
          "Perception and deliberate activity",
          "See and hear often describe involuntary perception and use simple forms or can. Other senses can describe deliberate activity: tasting soup or smelling a flower. See can also mean meet, which permits a continuous arrangement.",
          "I **can hear** music. / She **is tasting** the soup.",
          "Advertising and informal emphatic uses sometimes put state verbs in the continuous. Practice here follows the ordinary meaning stated in each prompt.",
        ),
      ],
      actions,
      ({ v, g, o }) => [
        Q(
          "knowledge-state",
          `Describe present knowledge: “I ____ how to ${v} ${o}.”`,
          "know",
          "Knowledge is a state in this sentence, so the ordinary form is **know**.",
          [
            [
              "am knowing",
              "The ordinary possession-of-knowledge sense does not use continuous aspect.",
            ],
            ["knowing", "An -ing form alone is not a finite verb."],
            ["am know", "Am cannot directly take the base verb know here."],
          ],
          "The sentence expresses **knowledge**, not an activity in progress.",
        ),
        Q(
          "active-consideration",
          `Use present continuous for active consideration: “We ____ about how to ${v} ${o}.”`,
          "are thinking",
          "Active consideration is dynamic: **are thinking about**.",
          [
            ["are think", "The continuous requires thinking after are."],
            ["thinking", "The finite auxiliary are is missing."],
            ["is thinking", "Is does not agree with we."],
          ],
          "Thinking about an issue is an **activity**; build the requested continuous form.",
        ),
        Q(
          "opinion-state",
          `State an opinion, in the simple present: “She ____ that ${g} ${o} is worthwhile.”`,
          "thinks",
          "Think here means **hold an opinion**, so use simple present thinks with she.",
          [
            ["think", "The third-person singular subject requires thinks."],
            ["is think", "Be cannot take base think in this statement."],
            [
              "thinking",
              "Thinking alone has no finite tense or subject agreement.",
            ],
          ],
          "Think followed by **that + proposition** expresses an opinion in this example.",
        ),
        Q(
          "temporary-behaviour",
          `Comment on temporary helpful behaviour: “You ____ helpful by ${g} ${o} for us today.”`,
          "are being",
          "**Are being helpful** describes the person’s behaviour in this situation.",
          [
            ["is being", "Is does not agree with you."],
            ["are be", "The continuous of be requires being after are."],
            ["being", "A finite auxiliary is missing."],
          ],
          "The adjective describes **behaviour today**, so temporary being is appropriate.",
        ),
      ],
    ),
    define(
      "modal-obligation",
      "Obligation, advice and prohibition",
      "B1",
      "bc-obligation",
      "Separate what is required, forbidden, unnecessary or advisable.",
      [
        L(
          "Must and have to",
          "Must and have to can both express obligation. Have to is especially useful for external requirements and for past or future forms. Must often expresses a strong rule or the speaker’s judgement. The distinction is a tendency, not a rigid division.",
          "You **must wear** a helmet. / We **had to wait**.",
          "Must has no ordinary past-tense form for obligation. Use had to, not musted.",
        ),
        L(
          "Forbidden is different from optional",
          "**Must not** expresses prohibition. **Do not have to** means there is no obligation; the action is still allowed. This contrast is crucial when interpreting instructions. Need not can also mean that an action is unnecessary.",
          "You **must not enter**. / You **do not have to enter**.",
          "Must not enter does not mean entering is optional. It means entering is forbidden.",
        ),
        L(
          "Advice and expectations",
          "Should and ought to commonly give advice or say what is expected. Should takes a bare infinitive; ought takes to. Had better gives stronger situation-specific advice and is followed by a base verb.",
          "You **should rest**. / You **ought to rest**. / You **had better rest**.",
          "Had better is normally about the present or future despite had; it is not simply past advice.",
        ),
        L(
          "Form questions and negatives correctly",
          "Have to behaves like a lexical verb for do-support: Does she have to? She does not have to. Must and should form their own questions and negatives. Choose the auxiliary pattern that belongs to the expression.",
          "**Does she have to** leave? / **Should she** leave?",
          "Does she has to? marks agreement twice; after does, use have.",
        ),
      ],
      actions,
      ({ v, s, g, o }) => [
        Q(
          "prohibition",
          `The rule forbids the task. “You ____ ${v} ${o}.”`,
          "must not",
          "**Must not** means the action is forbidden, matching the explicit rule.",
          [
            [
              "do not have to",
              "This means the task is optional, not forbidden.",
            ],
            ["may", "May would give permission or possibility."],
            [
              "should",
              "Should recommends the task, opposite to the prohibition.",
            ],
          ],
          "Decide whether the instruction means **forbidden** or merely **not required**.",
        ),
        Q(
          "no-obligation",
          `The task is optional and allowed. “You ____ ${v} ${o}.”`,
          "do not have to",
          "**Do not have to** means there is no obligation; the task remains allowed.",
          [
            ["must not", "Must not would forbid it, contradicting allowed."],
            ["must", "Must would make it compulsory."],
            ["have to", "Have to also makes it compulsory."],
          ],
          "Optional means **no obligation**, not prohibition.",
        ),
        Q(
          "advice-form",
          `Give advice: “She should ____ ${o} before Friday.”`,
          v,
          `After **should**, use base **${v}**.`,
          [
            [s, "Should takes a base form without -s."],
            [g, "Should alone cannot take the -ing form."],
            [
              `to ${v}`,
              "Should takes a bare infinitive; ought is the expression that uses to.",
            ],
          ],
          "The modal **should** carries the advice; the following verb stays in base form.",
        ),
        Q(
          "obligation-question",
          `Ask about the requirement: “Does she ____ ${o} today?”`,
          `have to ${v}`,
          `**Does** carries agreement, so use **have to ${v}**.`,
          [
            [`has to ${v}`, "After does, use base have rather than has."],
            [`must ${v}`, "Must forms its own question without does."],
            [`have ${v}`, "The obligation expression have to requires to."],
          ],
          "Does is already present; choose **have to**, not has to.",
        ),
      ],
    ),
    define(
      "modal-deduction",
      "Deductions and degrees of certainty",
      "B2",
      "bc-deduction",
      "Express conclusions and possibilities without confusing certainty with obligation.",
      [
        L(
          "A strong positive conclusion",
          "Must can express a strong deduction based on evidence. This differs from must as an obligation. Must be working means the speaker concludes that the activity is happening; it does not necessarily order anyone to work.",
          "The lights are on; someone **must be working**.",
          "A deduction is the speaker’s judgement, not an absolute guarantee.",
        ),
        L(
          "A strong negative conclusion",
          "Can’t and cannot can express that something is impossible according to the available evidence. Mustn’t normally expresses prohibition rather than the ordinary negative counterpart of deductive must.",
          "That **can’t be** the right address.",
          "Do not substitute mustn’t when you mean that something is impossible.",
        ),
        L(
          "An uncertain possibility",
          "May, might and could often express an uncertain possibility. Their relative strength depends on context, intonation and variety, so these exercises do not assign fixed percentage probabilities. A negative may not or might not means possibly not.",
          "She **might be** at home.",
          "Could not often suggests impossibility; it is not always interchangeable with might not.",
        ),
        L(
          "Match the verb form to the time",
          "For a present activity, use modal + be + -ing. For a state, use modal + base verb. Future probability can also use be likely to or probably. Keep probably before a negative modal in the common phrase probably won’t.",
          "They **must be waiting**. / They **are likely to arrive** soon.",
          "A present deduction about an activity needs be before -ing; must waiting is incomplete.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "strong-positive-deduction",
          `You draw a strong positive conclusion from clear evidence: “They ____ be ${g} ${o}.”`,
          "must",
          "Deductive **must** expresses the strong positive conclusion requested.",
          [
            [
              "must not",
              "Must not normally conveys prohibition, not a positive deduction.",
            ],
            [
              "cannot",
              "Cannot expresses a negative conclusion, the opposite of the prompt.",
            ],
            [
              "might",
              "Might expresses uncertainty rather than the requested strong conclusion.",
            ],
          ],
          "Identify the intended strength: **strong positive deduction**.",
        ),
        Q(
          "impossibility",
          `The evidence rules this out as impossible: “They ____ be ${g} ${o}.”`,
          "cannot",
          "**Cannot** expresses impossibility according to the stated evidence.",
          [
            ["must", "Must would give a strong positive conclusion."],
            ["may", "May would leave the event possible."],
            [
              "must not",
              "Must not normally prohibits an action rather than ruling it out as impossible.",
            ],
          ],
          "Choose the modal for an **impossible explanation**, not a prohibition.",
        ),
        Q(
          "uncertain-possibility",
          `The evidence is inconclusive; this is only possible: “They ____ be ${g} ${o}.”`,
          "might",
          "**Might** leaves the action possible without claiming certainty.",
          [
            [
              "must",
              "Must would express a stronger positive conclusion than the prompt supports.",
            ],
            ["cannot", "Cannot rules the action out."],
            [
              "have to",
              "Have to ordinarily introduces a requirement here, not the requested uncertain possibility.",
            ],
          ],
          "The prompt says **possible but uncertain**.",
        ),
        Q(
          "deduction-continuous-form",
          `Build a deduction about an action happening now: “She must ____ ${o}.”`,
          `be ${g}`,
          `After must, use **be + ${g}** for an ongoing action.`,
          [
            [g, "The auxiliary be is missing."],
            [`is ${g}`, "Must takes base be, not finite is."],
            [`been ${g}`, "Been requires a perfect auxiliary have before it."],
          ],
          "A present ongoing deduction has the form **modal + be + -ing**.",
        ),
      ],
    ),
    define(
      "past-modals",
      "Past deductions, criticism and unnecessary actions",
      "B2",
      "bc-past-deduction",
      "Use modal perfect forms to look back at possibilities, missed opportunities and actions that were unnecessary.",
      [
        L(
          "Deductions about the past",
          "Use **modal + have + past participle** to evaluate an earlier event. Must have suggests a strong positive conclusion; can’t have suggests impossibility; might have leaves it uncertain. Have remains base form after every modal and every subject.",
          "She **must have left**. / They **might have missed** it.",
          "Must had and must has are not standard modal-perfect forms.",
        ),
        L(
          "Criticism and regret",
          "Should have + past participle can describe a desirable action that did not happen, or an expectation about a completed event. Context decides which. Should not have often criticises an action that did happen.",
          "You **should have called**; we were worried.",
          "Should have is not always blame: the parcel should have arrived by now can express an expectation.",
        ),
        L(
          "Past possibility and opportunity",
          "Could have may refer to a past possibility or an unrealised opportunity. Might have can express uncertainty about whether something happened. Read the context carefully before deciding whether the sentence states an actual event.",
          "We **could have stayed**, but we chose to leave.",
          "Could have stayed does not by itself say that the person stayed.",
        ),
        L(
          "No need versus an unnecessary completed action",
          "Needn’t have + participle usually says an action happened but was unnecessary. Didn’t need to says there was no necessity and does not, by itself, settle whether the action happened. This meaning difference matters when offering reassurance.",
          "You **needn’t have waited**; I had a key.",
          "Didn’t need to wait does not automatically mean that the person waited.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "past-deduction-form",
          `Make a past deduction: “She must ____ ${o} before we arrived.”`,
          `have ${p}`,
          `The past deduction requires **must have ${p}**. Have stays base after must.`,
          [
            [`has ${p}`, "Has cannot follow a central modal."],
            [`had ${p}`, "Had cannot directly follow must."],
            [
              `have ${g}`,
              "Have needs a past participle in this simple modal-perfect construction.",
            ],
          ],
          "Build **modal + have + past participle**.",
        ),
        Q(
          "past-criticism",
          `The task was not done, but doing it was advisable: “You ____ have ${p} ${o}.”`,
          "should",
          "**Should have** marks the desirable action that the context says did not happen.",
          [
            [
              "must",
              "Must have would claim a strong deduction that it happened, contradicting the context.",
            ],
            [
              "will",
              "Will have would express a different prediction or inference, not the requested retrospective advice.",
            ],
            [
              "can",
              "Can have does not make the normal retrospective-advice pattern.",
            ],
          ],
          "The clue is **advisable but not done**, pointing to should have.",
        ),
        Q(
          "unnecessary-completed-action",
          `You did the task, but it was unnecessary: “You ____ have ${p} ${o}.”`,
          "need not",
          "**Need not have** says the completed action was unnecessary.",
          [
            [
              "must not",
              "Must not have does not express the stated lack of necessity in this construction.",
            ],
            [
              "did not need",
              "Did not need requires to before have and is not the needn’t-have pattern.",
            ],
            [
              "should",
              "Should have would recommend the action, not say it was unnecessary.",
            ],
          ],
          "The action **happened**, and the speaker says there was **no need** for it.",
        ),
        Q(
          "past-continuous-deduction",
          `Infer an ongoing past activity: “At that time, they might have ____ ${o}.”`,
          `been ${g}`,
          `After might have, use **been ${g}** to refer to an activity in progress at that past time.`,
          [
            [`being ${g}`, "Have requires the participle been, not being."],
            [`be ${g}`, "Base be cannot follow perfect have."],
            [g, "Been is missing between have and the -ing form."],
          ],
          "Combine past possibility with continuous aspect: **might have been + -ing**.",
        ),
      ],
    ),
    define(
      "verb-pattern-meaning",
      "Verb patterns that change meaning",
      "B2",
      "bc-verb-meaning",
      "Distinguish remembering a duty from recalling an experience, stopping an action from pausing for a purpose, and methods from attempts.",
      [
        L(
          "Remember a duty or recall an experience",
          "**Remember to do** means remembering a necessary action before doing it. **Remember doing** means recalling an earlier experience. The same contrast often appears with forget, although a negative such as I’ll never forget meeting her is especially common.",
          "Remember **to lock** the door. / I remember **locking** it.",
          "The -ing form refers to the remembered experience; it is not simply an alternative spelling of the infinitive.",
        ),
        L(
          "Stop one activity or pause for another",
          "**Stop doing** means cease that activity. **Stop to do** means interrupt another activity in order to do this one. The second pattern is an infinitive of purpose, so it answers why the person paused.",
          "We stopped **talking**. / We stopped **to talk**.",
          "Stopped to smoke does not mean quit smoking; it means paused in order to smoke.",
        ),
        L(
          "Try a method or attempt a difficult action",
          "**Try doing** often suggests testing a method to see if it helps. **Try to do** emphasises making an attempt, which may fail. Some contexts allow both with little practical difference, so tasks need a clear intention.",
          "Try **restarting** it. / I tried **to lift** it but could not.",
          "Do not assume that try + -ing always succeeded; it describes the method being tested.",
        ),
        L(
          "Go on and regret",
          "Go on doing continues the same activity; go on to do moves to a new activity. Regret doing looks back with regret, while regret to inform is a conventional way to introduce unwelcome information. Learn these as meaning-and-form pairs.",
          "She went on **speaking**. / She went on **to explain** the next step.",
          "Not every verb accepts both patterns. Avoid transferring these contrasts to verbs such as enjoy, which normally takes -ing.",
        ),
      ],
      actions,
      ({ v, p, g, o }) => [
        Q(
          "remember-future-duty",
          `The task is still ahead. Complete the reminder: “Please remember ____ ${o}.”`,
          `to ${v}`,
          `**Remember to ${v}** means remember the duty before carrying it out.`,
          [
            [
              g,
              "Remember + -ing recalls an earlier experience; the task is still ahead.",
            ],
            [
              v,
              "Remember normally needs a to-infinitive for this duty meaning.",
            ],
            [p, "A past form does not supply the required complement."],
          ],
          "Locate the task in time: it is a **future duty**, not a memory.",
        ),
        Q(
          "remember-past-experience",
          `The task happened yesterday and I recall doing it: “I remember ____ ${o}.”`,
          g,
          `**Remember ${g}** recalls the earlier experience explicitly described.`,
          [
            [
              `to ${v}`,
              "Remember to points to remembering a duty before doing it, rather than recalling the experience now.",
            ],
            [v, "A base verb without to does not form this complement."],
            [p, "The past form is not the required -ing complement."],
          ],
          "The speaker is **recalling an experience that already happened**.",
        ),
        Q(
          "stop-ceasing",
          `They ceased this activity completely: “They stopped ____ ${o}.”`,
          g,
          `**Stopped ${g}** means they ceased that activity.`,
          [
            [
              `to ${v}`,
              "Stopped to would mean paused another activity in order to do this one.",
            ],
            [v, "Stop cannot take a bare base verb for this meaning."],
            [p, "A past form cannot serve as this complement."],
          ],
          "The activity itself **ended**; this is stop + -ing.",
        ),
        Q(
          "stop-purpose",
          `We interrupted our walk in order to do the task: “We stopped ____ ${o}.”`,
          `to ${v}`,
          `**Stopped to ${v}** gives the purpose of pausing the walk.`,
          [
            [
              g,
              "Stopped + -ing would mean we ceased this task, not paused the walk to begin it.",
            ],
            [v, "A purpose infinitive needs to."],
            [p, "A past form does not express the purpose of stopping."],
          ],
          "The blank answers **why we paused another activity**.",
        ),
      ],
    ),
    define(
      "question-tags",
      "Question tags and agreement in responses",
      "B1",
      "bc-question-tags",
      "Add a short checking question and match its auxiliary, pronoun and polarity to the statement.",
      [
        L(
          "Opposite polarity in a checking tag",
          "A usual checking tag is negative after a positive statement and positive after a negative statement. Intonation helps show whether the speaker expects agreement or is genuinely checking. Other tag patterns exist in conversation, but the ordinary opposite-polarity form is a useful starting point.",
          "She is ready, **isn’t she**? / She isn’t ready, **is she**?",
          "A negative statement can contain never or nobody without the word not. Its checking tag is normally positive.",
        ),
        L(
          "Reuse the auxiliary",
          "Match the tense and auxiliary of the statement. If it has no auxiliary and is ordinary present or past simple, use do, does or did. Replace a noun subject with an appropriate pronoun.",
          "The guide arrived, **didn’t she**?",
          "Do not use is as a universal tag auxiliary; it must match the clause.",
        ),
        L(
          "Keep number and person",
          "The tag’s pronoun refers to the statement’s subject, not the nearest noun. Everyone commonly takes they in a tag. There stays there after an existential statement. Standard conversation often uses aren’t I after I am.",
          "There is a seat, **isn’t there**? / I’m late, **aren’t I**?",
          "Everyone is ready, aren’t they? combines singular agreement in the main clause with singular they in the tag.",
        ),
        L(
          "Requests and special tags",
          "Commands often use will you or would you as a softening tag. Let’s commonly takes shall we. These patterns do not follow the simple positive/negative statement rule. Tags in these exercises are ordinary checking tags unless a special function is named.",
          "Let’s leave, **shall we**? / Close the door, **will you**?",
          "A comma normally separates a written tag from the statement.",
        ),
      ],
      actions,
      ({ v, s, p, g, o }) => [
        Q(
          "positive-present-tag",
          `“She ${s} ${o} every week, ____?”`,
          "doesn’t she",
          "The positive present-simple statement with she takes negative **doesn’t she**.",
          [
            [
              "does she",
              "This has the same polarity, rather than the ordinary checking tag requested.",
            ],
            [
              "isn’t she",
              "The lexical present-simple verb requires does in the tag, not is.",
            ],
            ["don’t she", "Do does not agree with she."],
          ],
          "Find the tense, subject and positive polarity; then build the **negative matching tag**.",
        ),
        Q(
          "negative-past-tag",
          `“They did not ${v} ${o} yesterday, ____?”`,
          "did they",
          "The negative past-simple clause takes the positive tag **did they**.",
          [
            [
              "didn’t they",
              "The main clause is already negative; the ordinary checking tag is positive.",
            ],
            ["do they", "Do changes the tense to present."],
            ["were they", "Were does not match the did auxiliary."],
          ],
          "A negative clause takes a **positive checking tag**.",
        ),
        Q(
          "continuous-tag",
          `“We are ${g} ${o}, ____?”`,
          "aren’t we",
          "Reuse **are** and the pronoun we, with negative polarity.",
          [
            ["don’t we", "The existing auxiliary is are, not do."],
            ["isn’t we", "Is does not agree with we."],
            ["weren’t we", "Were changes the time to past."],
          ],
          "The statement already contains **are**; keep that auxiliary family.",
        ),
        Q(
          "suggestion-tag",
          `“Let’s ${v} ${o}, ____?”`,
          "shall we",
          "The usual tag after a shared suggestion with **let’s** is **shall we**.",
          [
            ["do we", "Do we is not the usual let’s suggestion tag."],
            ["aren’t we", "The clause has no be construction to match."],
            ["did we", "A past tag does not fit this present suggestion."],
          ],
          "Recognise the special **let’s … shall we?** pattern.",
        ),
      ],
    ),
  ];
}

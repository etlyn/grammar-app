import { verbs } from "../contexts.mjs";
const ruleFor = (t, q) => {
  const skill = q.skill;
  if (t.slug === "present-simple")
    return /negative|question|base-after/.test(skill)
      ? 2
      : skill === "affirmative"
        ? 0
        : 1;
  if (t.slug === "present-continuous")
    return /negative|question/.test(skill) ? 2 : skill === "ing-form" ? 1 : 0;
  if (t.slug === "past-simple")
    return /negative|question|base-after/.test(skill) ? 1 : 0;
  if (t.slug === "present-simple-be")
    return /negative|question/.test(skill) ? 1 : 0;
  return Math.min(
    t.rules.findIndex((r) => r.explanation === q.hint) >= 0
      ? t.rules.findIndex((r) => r.explanation === q.hint)
      : 0,
    t.rules.length - 1,
  );
};
const pronounRoles = {
  subject: ["i", "you", "he", "she", "it", "we", "they"],
  object: ["me", "you", "him", "her", "it", "us", "them"],
  "possessive-determiner": ["my", "your", "his", "her", "its", "our", "their"],
  "possessive-pronoun": ["mine", "yours", "his", "hers", "ours", "theirs"],
};
function diagnose(t, q, choice, correct) {
  const w = choice.toLowerCase(),
    c = correct.toLowerCase(),
    slug = t.slug,
    skill = q.skill;
  const form = verbs.find((v) => `verb-${v[0]}` === q.contextKey);
  const exact = `In this sentence, **${correct}** is required. ${q.explanation}`;
  if (slug === "articles") {
    if (skill === "indefinite-sound")
      return w === "the"
        ? "The would identify a particular item, but the prompt explicitly introduces one nonspecific item."
        : w === "—"
          ? "A singular countable noun needs a determiner here; leaving the article out does not form the requested phrase."
          : `**${choice}** is chosen for a ${w === "an" ? "vowel" : "consonant"} sound, but the next word begins with a ${c === "an" ? "vowel" : "consonant"} sound. Choose by pronunciation, not just spelling.`;
    if (w === "a" || w === "an")
      return /plural/.test(skill)
        ? `**${choice}** is singular, but the noun in this question is plural.`
        : `**${choice}** would introduce another nonspecific item; this mention identifies the same item already introduced.`;
    return skill === "general-plural"
      ? "The would narrow the reference to an identifiable set, but the prompt asks about the whole category."
      : "No article would leave a general or incomplete reference; this question explicitly identifies a particular item or set.";
  }
  if (slug === "pronouns-and-possessive-determiners") {
    const role = skill.replaceAll("-", " ");
    return pronounRoles[skill]?.includes(w)
      ? `**${choice}** can be a ${role}, but it refers to a different person or number from the one specified. ${q.explanation}`
      : `This slot needs a **${role}**. **${choice}** does not have that role in this pattern. ${q.explanation}`;
  }
  if (slug === "prepositions-of-time") {
    return (
      {
        at: "At normally marks clock times and certain fixed expressions, not this time phrase.",
        on: "On normally marks days and dates, not this time phrase.",
        in: "In normally marks larger periods or parts of the day, not this time phrase.",
        "—": "This time expression requires a preposition; it is not one of the zero-preposition expressions in the question.",
      }[w] +
      " " +
      q.explanation
    );
  }
  if (
    [
      "present-simple-be",
      "there-is-there-are",
      "have-got",
      "present-continuous",
      "past-continuous",
      "countable-uncountable",
    ].includes(slug) &&
    /^(am|is|are|was|were|have|has|be|do|does|did|not|got)\b/.test(w)
  ) {
    if (/^(do|does|did)/.test(w) && !/^(do|does|did)/.test(c))
      return `This construction uses its existing **${c.split(" ")[0]}** form, so **${choice}** introduces the wrong auxiliary. ${q.explanation}`;
    if (w === "be" || w.startsWith("not be"))
      return `Base **be** does not supply the finite agreement required here. ${q.explanation}`;
    if (w === "got")
      return `A short answer keeps **have/has** and drops got. Got alone does not supply the required auxiliary. ${q.explanation}`;
    if (w.split(" ")[0] !== c.split(" ")[0])
      return `**${w.split(" ")[0]}** does not match the subject’s person/number or the construction’s tense here. ${q.explanation}`;
    return `The auxiliary is in the right family, but the rest of **${choice}** does not complete the required verb pattern. ${q.explanation}`;
  }
  if (
    slug === "present-simple" ||
    slug === "past-simple" ||
    (slug === "present-continuous" && skill === "ing-form")
  ) {
    if (/^(did|do|does|is|was)\b/.test(w) && /negative|question/.test(skill))
      return /^(did)/.test(w) && slug === "present-simple"
        ? "Did marks past time, but the question asks for present simple."
        : /^(do|does)/.test(w) && slug === "past-simple"
          ? "Do/does are present forms; the finished past context needs did."
          : /^(is|was)/.test(w)
            ? "Be does not form this ordinary simple-tense action-verb question or negative; use do-support."
            : `**${choice}** does not agree with the subject in this present-simple pattern. ${q.explanation}`;
    if (w.startsWith("to "))
      return `This slot does not take a **to-infinitive**. ${q.explanation}`;
    if (form) {
      if (choice === form[3])
        return `**${choice}** is the -ing form. It cannot fill the finite simple-tense or base-after-auxiliary slot requested here. ${q.explanation}`;
      if (choice === form[1] && /base-after/.test(skill))
        return `The auxiliary already carries tense/agreement. Adding **-s/-es** to the main verb marks it again; use base **${form[0]}**.`;
      if (slug === "present-continuous")
        return `**${choice}** is not the -ing form required after be in this continuous construction. The verb changes to **${form[3]}**.`;
      if (slug === "past-simple" && skill === "affirmative")
        return `**${choice}** is not the requested past-simple form for the completed event. The past form of **${form[0]}** is **${form[2]}**.`;
      return `**${choice}** does not give the present-simple form for this subject. ${q.explanation}`;
    }
  }
  if (slug === "countable-uncountable") {
    if (skill === "countability")
      return `**${choice}** gives the wrong word class, countability or number for the stated sense. ${q.explanation}`;
    if (skill === "quantity-question")
      return ["a", "an"].includes(w)
        ? "A/an mark one singular countable item; they do not make a how-much/how-many quantity question."
        : `How **${choice}** is used with ${w === "many" ? "plural countable" : "uncountable"} nouns, but this noun has the other countability in the stated sense. ${q.explanation}`;
    if (w.startsWith("some of"))
      return "Some of needs a determined set, such as some of the ...; the required determiner after of is missing.";
    return `This puts two incompatible determiners together. Use **some directly before the noun** in the requested phrase. ${q.explanation}`;
  }
  if (slug === "small-quantities") {
    if (skill === "meaning")
      return `The phrase expresses a **small amount with positive emphasis**, not “${choice.toLowerCase()}”. It gives neither an exact count nor a claim that the amount is zero.`;
    const count = /\ba few\b|^few\b/.test(c),
      wrongCount = /\ba few\b|^few\b|^many\b|^several\b/.test(w);
    if (count !== wrongCount)
      return `**${choice}** fits ${wrongCount ? "plural countable" : "uncountable"} nouns. This question uses the other kind of noun in its stated sense. ${q.explanation}`;
    return `The quantity-word family fits, but **${choice}** changes the emphasis: the prompt asks for ${skill === "shortage" ? "scarcity, almost none" : "a small amount presented positively"}. ${q.explanation}`;
  }
  if (slug === "possessive-s") {
    if (skill === "owner-number")
      return `**${choice}** is not the owner identified before the possessive mark. ${q.explanation}`;
    if (skill === "apostrophe-rule")
      return `This rule does not match the owner’s singular/plural form and final letter. ${q.explanation}`;
    if (!w.includes("'"))
      return `This option does not mark the owner with the required possessive apostrophe. ${q.explanation}`;
    return `The apostrophe or added s is attached in the wrong place for this owner. The owned object's number does not determine the mark. ${q.explanation}`;
  }
  if (slug === "prepositions-of-place") {
    const meaning =
      w.startsWith("into") || w.startsWith("movement")
        ? "movement into a space"
        : w.startsWith("in ") || w === "in" || w.startsWith("within")
          ? "an inside position"
          : w.startsWith("on ") || w === "on" || w.startsWith("in contact")
            ? "contact with a surface"
            : "a point or conventional activity location";
    return `**${choice}** describes ${meaning}, which is not the relation specified in this question. ${q.explanation}`;
  }
  if (slug === "infinitive-of-purpose") {
    if (/^for\b/.test(w))
      return `For does not form the requested **to + base verb** purpose construction here. A for + -ing phrase can describe an object's function in a different pattern. ${q.explanation}`;
    if (w.includes("ing"))
      return `This option uses an **-ing form** where the purpose infinitive needs a **base verb after to**. ${q.explanation}`;
    return `The purpose construction requires **to + base verb**. This option omits to, duplicates it or changes the following verb away from its base form. ${q.explanation}`;
  }
  if (slug === "verb-patterns")
    return `The first verb selects a particular complement. **${choice}** uses a different complement form from the one required here. ${q.explanation}`;
  if (slug === "ed-ing-adjectives") {
    if (skill === "meaning")
      return `This interpretation reverses or loses the distinction between **the person feeling the emotion** and **the cause of the emotion**. ${q.explanation}`;
    if (skill === "paired-forms")
      return `At least one adjective in this pair assigns the wrong role: **-ed** normally describes the experiencer and **-ing** the cause. ${q.explanation}`;
    return `This is not the adjective form for the role asked about: ${skill === "experienced-feeling" ? "the person experiencing the feeling" : "the cause of the feeling"}. ${q.explanation}`;
  }
  if (slug === "comparatives-and-superlatives") {
    if (skill === "equality")
      return `An equal comparison uses **as + adjective + as**. **${choice}** does not supply the missing part of that pattern. ${q.explanation}`;
    if (skill === "than")
      return `The target of an ordinary comparative is introduced by **than**, not **${choice}**. As belongs to an equality pattern; that is a different connector.`;
    return `**${choice}** is not the ${skill === "superlative-form" ? "superlative" : "comparative"} form required by the stated comparison; do not combine an -er/-est form with an extra more/most. ${q.explanation}`;
  }
  if (slug === "past-continuous")
    return `This option does not preserve the background activity and the shorter event in their stated order. ${q.explanation}`;
  return `This option changes the required form or relation. ${exact}`;
}
export function enrichTeaching(t) {
  return {
    ...t,
    quizItems: t.quizItems.map((q) => {
      if (q.teaching) return q;
      const correct = q.choices.find((c) => c.id === q.answerId).text;
      const rule = t.rules[ruleFor(t, q)];
      const hint = `${rule.explanation} Focus on **${q.skill.replaceAll("-", " ")}** in this question.`;
      return {
        ...q,
        hint,
        teaching: {
          steps: [
            `Identify what the question tests: **${q.skill.replaceAll("-", " ")}**. ${rule.explanation}`,
            q.explanation,
            `Choose **${correct}**. Check the completed expression against the subject, time and intended meaning in the prompt.`,
          ],
          choiceReasons: Object.fromEntries(
            q.choices.map((c) => [
              c.id,
              c.id === q.answerId
                ? q.explanation
                : diagnose(t, q, c.text, correct),
            ]),
          ),
        },
      };
    }),
  };
}

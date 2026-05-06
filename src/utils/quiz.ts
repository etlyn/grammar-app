import { REQUIRED_QUIZ_ITEMS } from "../constants/learning";
import type { QuizItem } from "../types/grammar";

const generatedPromptPrefixPattern = /^In\s+[^,]+,\s*answer this:\s*/i;

export const cleanQuizPrompt = (prompt: string) =>
  prompt.replace(generatedPromptPrefixPattern, "").trim();

const getRandomIndex = (exclusiveMax: number) => {
  if (exclusiveMax <= 1) return 0;

  const cryptoSource = globalThis.crypto;
  if (cryptoSource?.getRandomValues) {
    const values = new Uint32Array(1);
    const maxUnbiasedValue =
      Math.floor(0xffffffff / exclusiveMax) * exclusiveMax;

    do {
      cryptoSource.getRandomValues(values);
    } while (values[0] >= maxUnbiasedValue);

    return values[0] % exclusiveMax;
  }

  return Math.floor(Math.random() * exclusiveMax);
};

export const shuffle = <T,>(items: readonly T[]) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const normalizeQuizText = (value: string) =>
  cleanQuizPrompt(value).toLowerCase().replace(/\s+/g, " ").trim();

const quizPromptKey = (item: QuizItem) =>
  [
    normalizeQuizText(item.prompt),
    item.answerId,
    ...item.choices.map((choice) => normalizeQuizText(choice.text)),
  ].join("|");

export const uniqueQuizItems = (items: readonly QuizItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = quizPromptKey(item);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

type BuildQuizSessionOptions = {
  items: readonly QuizItem[];
  answeredItemIds?: readonly string[];
  count?: number;
};

export const buildQuizSessionItems = ({
  items,
  answeredItemIds = [],
  count = REQUIRED_QUIZ_ITEMS,
}: BuildQuizSessionOptions) => {
  const answeredIds = new Set(answeredItemIds);
  const answeredPromptKeys = new Set(
    items
      .filter((item) => answeredIds.has(item.id))
      .map((item) => quizPromptKey(item)),
  );
  const uniqueItems = uniqueQuizItems(items);
  const selected: QuizItem[] = [];
  const selectedKeys = new Set<string>();

  const appendUnique = (pool: readonly QuizItem[]) => {
    for (const item of pool) {
      if (selected.length >= count) break;

      const key = quizPromptKey(item);
      if (selectedKeys.has(key)) continue;

      selected.push(item);
      selectedKeys.add(key);
    }
  };

  appendUnique(
    shuffle(
      uniqueItems.filter((item) => !answeredPromptKeys.has(quizPromptKey(item))),
    ),
  );
  appendUnique(
    shuffle(uniqueItems.filter((item) => !answeredIds.has(item.id))),
  );
  appendUnique(shuffle(uniqueItems));

  return selected;
};
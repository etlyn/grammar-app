import type { CourseId } from "./accountProgress";

export const COURSE_STORAGE_KEY = "grammacho-web-course:v1";
export const isCourseId = (value: unknown): value is CourseId =>
  value === "en" || value === "es";
type BrowserStorage = Pick<Storage, "getItem" | "key" | "length">;
const parsed = (raw: string | null) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const meaningfulState = (state: unknown) => {
  if (!state || typeof state !== "object") return false;
  const value = state as {
    activeSlug?: unknown;
    progress?: object;
    sessions?: object;
  };
  return Boolean(
    (typeof value.activeSlug === "string" && value.activeSlug) ||
      Object.keys(value.progress ?? {}).length ||
      Object.keys(value.sessions ?? {}).length,
  );
};

/** Mounting a fresh welcome writes empty compatibility mirrors. Those are not
 * evidence that this browser previously learned English or finished onboarding. */
export function hasExistingEnglishLearning(
  englishProgressVersion: string,
  storage?: BrowserStorage,
): boolean {
  try {
    storage ??= globalThis.localStorage;
    if (!storage) return false;
    if (
      meaningfulState(
        parsed(
          storage.getItem(`grammacho-web-progress:${englishProgressVersion}`),
        ),
      ) ||
      storage.getItem("grammar-app-progress-v2")
    )
      return true;
    const guest = parsed(
      storage.getItem(`grammacho-web-guest-ledger:${englishProgressVersion}`),
    );
    if (guest?.version === 1 || meaningfulState(guest?.states?.en)) return true;
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key?.startsWith("grammacho-web-account:")) continue;
      const account = parsed(storage.getItem(key));
      if (account?.version === 1 || meaningfulState(account?.states?.en))
        return true;
    }
  } catch {
    /* Existing data is kept when storage is unavailable. */
  }
  return false;
}

/** A fresh browser starts with Spanish; existing English work stays selected. */
export function resolveInitialCourseId(
  englishProgressVersion: string,
  storage?: BrowserStorage,
): CourseId {
  try {
    storage ??= globalThis.localStorage;
    const saved = storage?.getItem(COURSE_STORAGE_KEY);
    if (isCourseId(saved)) return saved;
    if (hasExistingEnglishLearning(englishProgressVersion, storage))
      return "en";
  } catch {
    /* Storage may be unavailable in an opaque or restricted browser. */
  }
  return "es";
}

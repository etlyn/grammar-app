import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { PracticePanel } from "./components/PracticePanel";
import { AuthPanel } from "./components/AuthPanel";
import { Mark, Icon, Wordmark } from "./components/rebrand/Brand";
import { Learn } from "./components/rebrand/Learn";
import { Map as GrammarMap } from "./components/rebrand/Map";
import { Reader } from "./components/rebrand/Reader";
import { Practice } from "./components/rebrand/Practice";
import { Progress, Mistakes } from "./components/rebrand/Progress";
import {
  About,
  CourseSheet,
  Onboarding,
  SearchSheet,
  Settings,
  Sheet,
  type Appearance,
  type OnboardingStep,
} from "./components/rebrand/Preferences";
import { useProgress } from "./hooks/useProgress";
import { useAuth, type AccountAuth } from "./hooks/useAuth";
import {
  COURSE_STORAGE_KEY,
  hasExistingEnglishLearning,
  initialCourseId,
  resolveCourse,
  type CourseId,
} from "./services/contentService";

const tabs = [
  { id: "learn", text: "Learn", icon: "book" },
  { id: "map", text: "Map", icon: "grid" },
  { id: "practice", text: "Practice", icon: "target" },
  { id: "progress", text: "Progress", icon: "chart" },
] as const;
type Tab = (typeof tabs)[number]["id"];
type Route =
  | { name: "tab"; tab: Tab }
  | { name: "reader"; slug: string; sectionId?: string }
  | { name: "quiz"; slug: string }
  | { name: "settings" | "about" | "mistakes" };
type HistoryEntry = { course: CourseId; route: Route; depth: number };
type SheetName = "courses" | "search" | "reset" | null;

const startRoute: Route = { name: "tab", tab: "learn" };
const onboardingKey = "grammacho-web-onboarded:v1";
const themeKey = "grammacho-web-appearance:v1";
const startKey = (course: CourseId) => `grammacho-web-start:v1:${course}`;

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* The current learning session still works. */
  }
}
function readAppearance(): Appearance {
  const value = readStorage(themeKey);
  return value === "light" || value === "dark" ? value : "system";
}
function isReturningLearner() {
  return (
    [onboardingKey, COURSE_STORAGE_KEY, "grammacho-web-view"].some(
      readStorage,
    ) || hasExistingEnglishLearning()
  );
}
function readHistory(course: CourseId): HistoryEntry {
  const value = window.history.state?.grammacho as HistoryEntry | undefined;
  if (
    value?.course === course &&
    Number.isInteger(value.depth) &&
    value.route?.name
  )
    return value;
  return { course, route: startRoute, depth: 0 };
}

function TabBar({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (value: Tab) => void;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const index = tabs.findIndex((item) => item.id === tab);
  function handleKeys(
    event: KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) {
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === "ArrowLeft"
            ? (current - 1 + tabs.length) % tabs.length
            : event.key === "ArrowRight"
              ? (current + 1) % tabs.length
              : undefined;
    if (target === undefined) return;
    event.preventDefault();
    onChange(tabs[target].id);
    buttons.current[target]?.focus();
  }
  return (
    <nav
      className="rb-tabs"
      role="tablist"
      aria-label="Learning"
      style={{ "--rb-tab": index } as CSSProperties}
    >
      {tabs.map((item, position) => (
        <button
          key={item.id}
          ref={(node) => {
            buttons.current[position] = node;
          }}
          id={`tab-${item.id}`}
          type="button"
          role="tab"
          aria-selected={item.id === tab}
          aria-controls={item.id === tab ? "learning-main" : undefined}
          tabIndex={item.id === tab ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => handleKeys(event, position)}
        >
          <Icon name={item.icon} solid={item.id === tab} size={25} />
          <span>{item.text}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const auth = useAuth();
  const [appearance, setAppearance] = useState(readAppearance);
  const [courseId, setCourseId] = useState(initialCourseId);
  const [onboarding, setOnboarding] = useState<OnboardingStep | null>(() =>
    isReturningLearner() ? null : "welcome",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = appearance;
  }, [appearance]);
  if (!auth.hydrated)
    return (
      <main
        className="rb-startup"
        aria-busy="true"
        aria-label="Opening your learning"
      >
        <Mark tone="bare" size={118} />
      </main>
    );
  return (
    <LearningWorkspace
      key={auth.user?.id ?? "guest"}
      auth={auth}
      courseId={courseId}
      setCourseId={setCourseId}
      onboarding={onboarding}
      setOnboarding={setOnboarding}
      appearance={appearance}
      setAppearance={(value) => {
        setAppearance(value);
        writeStorage(themeKey, value);
      }}
    />
  );
}

function LearningWorkspace({
  auth,
  courseId,
  setCourseId,
  onboarding,
  setOnboarding,
  appearance,
  setAppearance,
}: {
  auth: AccountAuth;
  courseId: CourseId;
  setCourseId: (course: CourseId) => void;
  onboarding: OnboardingStep | null;
  setOnboarding: (step: OnboardingStep | null) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
}) {
  const course = resolveCourse(courseId);
  const { topics, grammarMap: map, contentSources: sources } = course;
  const learning = useProgress(auth.user?.id ?? null, courseId);
  const [historyEntry, setHistoryEntry] = useState(() => readHistory(courseId));
  const [sheet, setSheet] = useState<SheetName>(null);
  const [accountRequest, setAccountRequest] = useState(0);
  const main = useRef<HTMLElement>(null);
  const route = historyEntry.route;
  const tab = route.name === "tab" ? route.tab : null;
  const topic =
    (route.name === "reader" || route.name === "quiz") &&
    topics.find((item) => item.slug === route.slug);
  const nextTopic = topic ? topics[topics.indexOf(topic) + 1] : undefined;

  useEffect(() => {
    const onPop = () => {
      setSheet(null);
      setHistoryEntry(readHistory(courseId));
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [courseId]);

  function navigate(
    next: Route,
    {
      replace = false,
      focus = true,
      selectedCourse = courseId,
    }: {
      replace?: boolean;
      focus?: boolean;
      selectedCourse?: CourseId;
    } = {},
  ) {
    const entry = {
      course: selectedCourse,
      route: next,
      depth: replace ? historyEntry.depth : historyEntry.depth + 1,
    };
    const state = { ...window.history.state, grammacho: entry };
    if (replace) window.history.replaceState(state, "");
    else {
      // Store the initial route as well so browser Back restores its tab.
      if (!window.history.state?.grammacho)
        window.history.replaceState(
          { ...window.history.state, grammacho: historyEntry },
          "",
        );
      window.history.pushState(state, "");
    }
    setHistoryEntry(entry);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (focus)
      requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
  }
  const goTab = (value: Tab, focus = true) => {
    if (tab !== value) navigate({ name: "tab", tab: value }, { focus });
  };
  const onBack = () => {
    if (historyEntry.depth > 0) window.history.back();
    else navigate(startRoute, { replace: true });
  };
  const openRead = (slug: string, sectionId?: string) => {
    if (!topics.some((item) => item.slug === slug)) return;
    learning.selectTopic(slug);
    setSheet(null);
    navigate({ name: "reader", slug, sectionId }, { focus: !sectionId });
  };
  const openQuiz = (slug: string) => {
    if (!topics.some((item) => item.slug === slug)) return;
    learning.selectTopic(slug);
    navigate({ name: "quiz", slug });
  };
  const openMistakes = () => navigate({ name: "mistakes" });
  const selectCourse = (selected: CourseId) => {
    setSheet(null);
    if (selected === courseId) return;
    writeStorage(COURSE_STORAGE_KEY, selected);
    setCourseId(selected);
    navigate(startRoute, { replace: true, selectedCourse: selected });
  };
  const finishOnboarding = (slug: string) => {
    writeStorage(COURSE_STORAGE_KEY, courseId);
    writeStorage(onboardingKey, "1");
    writeStorage(startKey(courseId), slug);
    learning.selectTopic(slug);
    setOnboarding(null);
    navigate(startRoute, { replace: true });
  };
  const authPanel = (
    <AuthPanel
      auth={auth}
      syncing={learning.syncing}
      syncMessage={learning.syncMessage}
      pendingCount={learning.pendingCount}
      onSync={learning.sync}
      onClear={learning.clearAccountData}
      clearing={learning.clearing}
      showTrigger={false}
      openRequest={accountRequest}
    />
  );
  if (onboarding)
    return (
      <div className="rb-shell rb-onboarding">
        {authPanel}
        <Onboarding
          step={onboarding}
          course={course}
          onStep={setOnboarding}
          onCourse={setCourseId}
          onFinish={finishOnboarding}
        />
      </div>
    );

  const panes = {
    learn: (
      <Learn
        courseId={courseId}
        topics={topics}
        map={map}
        learning={learning}
        startSlug={readStorage(startKey(courseId)) ?? ""}
        onRead={openRead}
        onPractice={openQuiz}
        onMap={() => goTab("map")}
      />
    ),
    map: (
      <GrammarMap
        courseId={courseId}
        topics={topics}
        map={map}
        sources={sources}
        onRead={openRead}
      />
    ),
    practice: (
      <Practice
        courseId={courseId}
        topics={topics}
        learning={learning}
        onPractice={openQuiz}
        onRead={openRead}
        onMistakes={openMistakes}
      />
    ),
    progress: (
      <Progress
        courseId={courseId}
        topics={topics}
        learning={learning}
        onRead={openRead}
        onMistakes={openMistakes}
      />
    ),
  };
  let body;
  if (tab) body = null;
  else if (route.name === "reader" && topic)
    body = (
      <Reader
        key={topic.slug}
        courseId={courseId}
        topic={topic}
        topics={topics}
        chapterCount={topics.length}
        nextTopic={nextTopic}
        sources={sources}
        progress={learning.progress[topic.slug]}
        session={learning.sessions[topic.slug]}
        sectionId={route.sectionId}
        onBack={onBack}
        onRead={openRead}
        onPractice={openQuiz}
      />
    );
  else if (route.name === "quiz" && topic)
    body = (
      <div className="rb-session-frame">
        <PracticePanel
          key={topic.slug}
          courseId={courseId}
          topic={topic}
          progress={learning.progress[topic.slug]}
          session={learning.sessions[topic.slug]}
          blocked={
            auth.user && !learning.accountReady
              ? "Connect once to load this account’s progress before starting practice."
              : learning.resetWaiting
                ? "A chapter reset is waiting to sync. Reconnect to continue practice."
                : undefined
          }
          onClose={onBack}
          onRead={() => openRead(topic.slug)}
          onStart={() => learning.startSession(topic.slug)}
          onAnswer={(sessionId, itemId, choice) =>
            learning.answer(topic.slug, sessionId, itemId, choice)
          }
          onNext={(sessionId) => learning.next(topic.slug, sessionId)}
          onReset={() => learning.resetTopic(topic.slug)}
          onContinue={nextTopic ? () => openRead(nextTopic.slug) : undefined}
        />
      </div>
    );
  else if (route.name === "settings")
    body = (
      <Settings
        course={course}
        appearance={appearance}
        onAppearance={setAppearance}
        completed={learning.totals.completedTopics}
        accountName={
          auth.user ? (auth.user.displayName ?? "Signed in") : undefined
        }
        onCourses={() => setSheet("courses")}
        onAccount={() => setAccountRequest((value) => value + 1)}
        onAbout={() => navigate({ name: "about" })}
        onBack={onBack}
        onReset={() => setSheet("reset")}
        resetWaiting={learning.resetWaiting}
      />
    );
  else if (route.name === "about")
    body = <About course={course} onBack={onBack} />;
  else if (route.name === "mistakes")
    body = (
      <Mistakes
        courseId={courseId}
        topics={topics}
        learning={learning}
        onBack={onBack}
        onRead={openRead}
        onPractice={openQuiz}
      />
    );
  else
    body = (
      <p className="rb-empty">
        This chapter belongs to another course.{" "}
        <button className="rb-inline" onClick={() => goTab("learn")}>
          Back to Learn
        </button>
      </p>
    );

  return (
    <div className="rb-shell" data-detail={tab ? undefined : route.name}>
      <a
        className="skip-link"
        href="#learning-main"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus({ preventScroll: true });
          main.current?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      {authPanel}
      {tab && (
        <header className="rb-shell-header">
          <div className="rb-shell-header-inner">
            <button
              className="rb-wordmark-link"
              aria-label="Grammacho Learn"
              onClick={() => goTab("learn")}
            >
              <Wordmark height={23} />
            </button>
            <button
              className="rb-course-trigger"
              type="button"
              aria-haspopup="dialog"
              aria-label={`Courses, current course ${course.name}`}
              onClick={() => setSheet("courses")}
            >
              <Mark size={28} />
              <span lang={courseId}>{course.name}</span>
              <Icon name="chevronsUpDown" size={16} />
            </button>
            <div className="rb-header-actions">
              <button
                className="rb-icon-button"
                aria-label="Search"
                aria-haspopup="dialog"
                type="button"
                onClick={() => setSheet("search")}
              >
                <Icon name="search" />
              </button>
              {tab === "progress" && (
                <button
                  className="rb-icon-button"
                  aria-label="Settings"
                  type="button"
                  onClick={() => navigate({ name: "settings" })}
                >
                  <Icon name="gear" />
                </button>
              )}
            </div>
          </div>
        </header>
      )}
      <main
        id="learning-main"
        ref={main}
        tabIndex={-1}
        className={`rb-main${tab ? "" : " rb-detail"}`}
        role={tab ? "tabpanel" : undefined}
        aria-labelledby={tab ? `tab-${tab}` : undefined}
      >
        {learning.storageMessage && (
          <p className="rb-alert" role="alert">
            {learning.storageMessage}
          </p>
        )}
        {learning.canImport && route.name !== "quiz" && (
          <section
            className="rb-import rb-card"
            aria-label="Import guest progress"
          >
            <h2>Keep your browser progress?</h2>
            <p>
              Copy this browser’s {course.name} progress into your account to
              use it across devices.
            </p>
            <div className="rb-actions">
              <button
                type="button"
                className="rb-button"
                onClick={learning.importGuest}
              >
                Add to my account
              </button>
              <button
                type="button"
                className="rb-button secondary"
                onClick={learning.declineImport}
              >
                Keep on this browser
              </button>
            </div>
          </section>
        )}
        {tabs.map((item) => (
          <div
            className="rb-tab-content"
            key={`${courseId}-${item.id}`}
            hidden={tab !== item.id}
          >
            {panes[item.id]}
          </div>
        ))}
        {body}
      </main>
      {tab && <TabBar tab={tab} onChange={(value) => goTab(value, false)} />}
      {sheet === "courses" && (
        <CourseSheet
          course={courseId}
          onSelect={selectCourse}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "search" && (
        <SearchSheet
          course={course}
          onRead={openRead}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "reset" && (
        <Sheet
          title={`Reset ${course.languageName} progress?`}
          onClose={() => setSheet(null)}
        >
          <p className="rb-note">
            This clears the current course’s progress, mistakes and saved
            sessions.
          </p>
          <div className="rb-actions rb-sheet-actions">
            <button
              className="rb-button secondary"
              onClick={() => setSheet(null)}
            >
              Cancel
            </button>
            <button
              className="rb-button"
              onClick={() => {
                learning.resetAll();
                setSheet(null);
              }}
            >
              Reset progress
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

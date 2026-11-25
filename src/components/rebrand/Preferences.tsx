import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  courseList,
  type CourseCatalog,
  type CourseId,
} from "../../services/contentService";
import { Icon, Tile, TildeUnderline, Wordmark } from "./Brand";

export type Appearance = "system" | "light" | "dark";
export type OnboardingStep = "welcome" | "course" | "start";

export function courseDetail(course: CourseCatalog) {
  const levels = [...new Set(course.topics.map((topic) => topic.level))];
  return `${course.topics.length} chapters · ${levels[0]}–${levels[levels.length - 1]} · ${course.questionCount.toLocaleString("en-US")} questions${course.id === "es" ? " · English explanations" : ""}`;
}

function CourseChoices({
  course,
  onChange,
}: {
  course: CourseId;
  onChange: (course: CourseId) => void;
}) {
  const group = useId();
  return (
    <fieldset aria-label="Courses">
      {courseList.map((item) => (
        <label className="rb-choice-row" key={item.id}>
          <span aria-hidden="true" className="rb-course-code">
            {item.code}
          </span>
          <span className="rb-row-copy">
            <strong lang={item.id}>{item.name}</strong>
            <small id={`${group}-${item.id}-detail`}>
              {courseDetail(item)}
            </small>
          </span>
          <input
            className="rb-radio"
            type="radio"
            name={group}
            aria-label={item.name}
            aria-describedby={`${group}-${item.id}-detail`}
            checked={course === item.id}
            onChange={() => onChange(item.id)}
          />
        </label>
      ))}
    </fieldset>
  );
}

export function Onboarding({
  step,
  course,
  onStep,
  onCourse,
  onFinish,
}: {
  step: OnboardingStep;
  course: CourseCatalog;
  onStep: (step: OnboardingStep) => void;
  onCourse: (course: CourseId) => void;
  onFinish: (slug: string) => void;
}) {
  const [stage, setStage] = useState(course.stageNames[0]);
  const group = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const lastStep = useRef(step);
  useEffect(() => {
    if (lastStep.current !== step) {
      heading.current?.focus();
      lastStep.current = step;
    }
  }, [step]);
  if (step === "welcome") {
    return (
      <main className="rb-welcome">
        <div className="rb-welcome-inner">
          <div className="rb-welcome-brand">
            <Wordmark accent height={29} />
          </div>
          <div className="rb-welcome-tiles" aria-hidden="true">
            {[2, 3, 4, 5, 12, 7].map((kind) => (
              <Tile key={kind} stage={kind} size={122} />
            ))}
          </div>
          <div className="rb-welcome-copy">
            <h1 ref={heading} tabIndex={-1}>
              Grammar,
              <br />
              con gusto.
            </h1>
            <TildeUnderline />
            <p>
              Explore Spanish or English grammar, one clear chapter at a time.
            </p>
          </div>
          <div className="rb-welcome-actions">
            <button
              className="rb-button inverse"
              onClick={() => onStep("course")}
            >
              Get started <Icon name="arrowRight" size={20} />
            </button>
            <p className="rb-note">
              Works offline · Guest progress stays in this browser
            </p>
          </div>
        </div>
      </main>
    );
  }
  const choosingCourse = step === "course";
  return (
    <main className="rb-step">
      <header className="rb-step-head">
        <button
          className="rb-icon-button"
          aria-label="Back"
          onClick={() => onStep(choosingCourse ? "welcome" : "course")}
        >
          <Icon name="arrowLeft" size={20} />
        </button>
        <span>Step {choosingCourse ? 1 : 2} of 2</span>
        <span />
      </header>
      <div className="rb-step-main">
        <h1 ref={heading} tabIndex={-1}>
          {choosingCourse
            ? "What would you like to learn?"
            : "Where do you want to start?"}
        </h1>
        <p>
          {choosingCourse
            ? "Pick a course. You can switch courses from any tab."
            : "Begin with the first chapter or jump to a stage that fits you."}
        </p>
        {choosingCourse ? (
          <CourseChoices
            course={course.id}
            onChange={(id) => {
              onCourse(id);
              setStage("");
            }}
          />
        ) : (
          <fieldset aria-label="Starting point">
            {course.stageNames.map((name, index) => {
              const chapters = course.topics.filter(
                (topic) => topic.stage === name,
              );
              const first = chapters[0];
              const last = chapters[chapters.length - 1];
              const label = name.split(" · ").slice(-1)[0];
              return (
                <label key={name} className="rb-choice-row">
                  <Tile stage={index + 1} size={44} />
                  <span className="rb-row-copy">
                    <strong>
                      {index === 0 ? "From the beginning" : label}
                    </strong>
                    <small>
                      Stage {index + 1} ·{" "}
                      {first?.level === last?.level
                        ? first?.level
                        : `${first?.level}–${last?.level}`}{" "}
                      · {chapters.length} chapters
                    </small>
                  </span>
                  <input
                    className="rb-radio"
                    type="radio"
                    name={group}
                    aria-label={index === 0 ? "From the beginning" : label}
                    checked={(stage || course.stageNames[0]) === name}
                    onChange={() => setStage(name)}
                  />
                </label>
              );
            })}
          </fieldset>
        )}
      </div>
      <button
        className="rb-button"
        onClick={() => {
          if (choosingCourse) onStep("start");
          else
            onFinish(
              (
                course.topics.find((topic) => topic.stage === stage) ??
                course.topics[0]
              ).slug,
            );
        }}
      >
        {choosingCourse ? "Continue" : "Start learning"}{" "}
        <Icon name="arrowRight" size={20} />
      </button>
    </main>
  );
}

export function Sheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const element = dialog.current;
    const opener = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => {
      element?.close();
      if (opener?.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      className="rb-dialog"
      ref={dialog}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header className="rb-dialog-header">
        <h2 id={id}>{title}</h2>
        <button
          className="rb-icon-button"
          aria-label={`Close ${title.toLowerCase()}`}
          onClick={onClose}
        >
          <Icon name="close" size={20} />
        </button>
      </header>
      {children}
    </dialog>
  );
}

export function CourseSheet({
  course,
  onSelect,
  onClose,
}: {
  course: CourseId;
  onSelect: (course: CourseId) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(course);
  return (
    <Sheet title="Your courses" onClose={onClose}>
      <CourseChoices course={selected} onChange={setSelected} />
      <div className="rb-actions rb-sheet-actions">
        <button className="rb-button" onClick={() => onSelect(selected)}>
          {selected === course ? "Done" : "Switch course"}
        </button>
      </div>
    </Sheet>
  );
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function SearchSheet({
  course,
  onRead,
  onClose,
}: {
  course: CourseCatalog;
  onRead: (slug: string, sectionId?: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    const matchingTopics = course.topics
      .filter((topic) =>
        normalize(
          `${topic.title} ${topic.level} ${topic.stage ?? ""}`,
        ).includes(term),
      )
      .map((topic) => ({
        id: topic.slug,
        title: topic.title,
        context: `Chapter ${topic.order} · ${topic.level}`,
        slug: topic.slug,
        sectionId: undefined as string | undefined,
      }));
    const matches = course.grammarMap.domains.flatMap((area) =>
      area.concepts
        .filter((concept) => normalize(concept.title).includes(term))
        .map((concept) => ({
          id: concept.id,
          title: concept.title,
          context: concept.topicTitle,
          slug: concept.topicSlug,
          sectionId: concept.id,
        })),
    );
    return [...matchingTopics, ...matches].slice(0, 40);
  }, [course, query]);
  return (
    <Sheet title="Search" onClose={onClose}>
      <div className="rb-dialog-search">
        <input
          autoFocus
          type="search"
          aria-label="Find a chapter or concept"
          placeholder="Find a chapter or concept"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="rb-search-results">
        {results.map((result) => (
          <button
            key={result.id}
            className="rb-settings-row"
            onClick={() => onRead(result.slug, result.sectionId)}
          >
            <span className="rb-row-copy">
              <strong>{result.title}</strong>
              <small>{result.context}</small>
            </span>
            <Icon name="chevronRight" size={18} />
          </button>
        ))}
      </div>
      {!!query.trim() && !results.length && (
        <p className="rb-empty" role="status">
          No chapters or sections match.
        </p>
      )}
    </Sheet>
  );
}

export function Settings({
  course,
  appearance,
  onAppearance,
  onCourses,
  onAccount,
  onAbout,
  onReset,
  onBack,
  resetWaiting,
  completed,
  accountName,
}: {
  course: CourseCatalog;
  appearance: Appearance;
  onAppearance: (appearance: Appearance) => void;
  onCourses: () => void;
  onAccount: () => void;
  onAbout: () => void;
  onReset: () => void;
  onBack: () => void;
  resetWaiting: boolean;
  completed: number;
  accountName?: string;
}) {
  return (
    <section className="rb-settings" aria-labelledby="settings-title">
      <div className="rb-back-row">
        <button
          className="rb-icon-button"
          type="button"
          onClick={onBack}
          aria-label="Back"
        >
          <Icon name="arrowLeft" size={20} />
        </button>
        <h1 id="settings-title">Settings</h1>
      </div>
      <div className="rb-settings-group">
        <h2>Course</h2>
        <div className="rb-card">
          <button className="rb-settings-row" onClick={onCourses}>
            <span className="rb-course-code">{course.code}</span>
            <span className="rb-row-copy">
              <strong>{course.name}</strong>
              <small>
                {completed} of {course.topics.length} chapters complete
              </small>
            </span>
            <span className="rb-inline">Change</span>
          </button>
        </div>
      </div>
      <div className="rb-settings-group">
        <h2>Account</h2>
        <div className="rb-card">
          <button
            className="rb-settings-row"
            aria-haspopup="dialog"
            onClick={onAccount}
          >
            <span className="rb-row-copy">
              <strong>{accountName ? "Your account" : "Sign in"}</strong>
              <small>
                {accountName ??
                  "Sync learning and review mistakes across devices"}
              </small>
            </span>
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
      </div>
      <div className="rb-settings-group">
        <h2>Appearance</h2>
        <div
          className="rb-option-set rb-card"
          role="group"
          aria-label="Appearance"
        >
          {(["system", "light", "dark"] as const).map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={appearance === value}
              onClick={() => onAppearance(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="rb-settings-group">
        <h2>About</h2>
        <div className="rb-card">
          <button className="rb-settings-row" onClick={onAbout}>
            <span className="rb-row-copy">
              <strong>About Grammacho</strong>
              <small>Course references and review notes</small>
            </span>
            <Icon name="chevronRight" size={20} />
          </button>
          <button
            className="rb-settings-row"
            onClick={onReset}
            disabled={resetWaiting}
          >
            <span className="rb-row-copy">
              <strong>Reset {course.languageName} progress</strong>
            </span>
            <Icon name="refresh" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function About({
  course,
  onBack,
}: {
  course: CourseCatalog;
  onBack: () => void;
}) {
  return (
    <section className="rb-settings" aria-labelledby="about-title">
      <div className="rb-back-row">
        <button className="rb-icon-button" aria-label="Back" onClick={onBack}>
          <Icon name="arrowLeft" size={20} />
        </button>
        <h1 id="about-title">About Grammacho</h1>
      </div>
      <div className="rb-about-brand rb-card">
        <Wordmark height={29} />
        <p>Grammar, con gusto.</p>
      </div>
      <section className="rb-settings-group">
        <h2>{course.name} course</h2>
        <p>{courseDetail(course)}</p>
        <p className="rb-note">{course.reviewStatus}</p>
      </section>
      <section className="rb-settings-group">
        <h2>Learning references</h2>
        <div className="rb-card">
          {course.contentSources.map((source) => (
            <a
              className="rb-settings-row"
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rb-row-copy">
                <strong>{source.title}</strong>
                <small>{source.publisher}</small>
              </span>
              <Icon name="external" size={18} />
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}

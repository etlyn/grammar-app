import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { PracticePanel } from "./components/PracticePanel";
import { GrammarMap } from "./components/GrammarMap";
import { TopicReader } from "./components/TopicReader";
import { TopicSidebar } from "./components/TopicSidebar";
import { useProgress } from "./hooks/useProgress";
import {
  grammarCatalog as topics,
  catalogVersion,
} from "./services/contentService";

type View = "map" | "read" | "practice";
const viewKey = "grammacho-web-view";
export default function App() {
  const learning = useProgress();
  const topic = topics.find((t) => t.slug === learning.activeSlug) ?? topics[0];
  const nextTopic = topics[topics.indexOf(topic) + 1];
  const [view, setView] = useState<View>(() => {
    try {
      const saved = localStorage.getItem(viewKey);
      return saved === "practice" || saved === "read" ? saved : "map";
    } catch {
      return "map";
    }
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const mapTab = useRef<HTMLButtonElement>(null);
  const readTab = useRef<HTMLButtonElement>(null);
  const practiceTab = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(viewKey, view);
    } catch {
      /* Learning hook reports storage failures. */
    }
  }, [view]);
  const select = (slug: string, sectionId?: string) => {
    learning.selectTopic(slug);
    setView("read");
    dialog.current?.close();
    requestAnimationFrame(() => {
      const section = sectionId
        ? document.getElementById(`concept-${sectionId}`)
        : null;
      if (section) {
        section.focus({ preventScroll: true });
        section.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      } else {
        readTab.current?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    });
  };
  const changeView = (next: View) => {
    if (view === next) return;
    if (
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.startViewTransition(() => flushSync(() => setView(next)));
    } else setView(next);
  };
  const tabKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const views: View[] = ["map", "read", "practice"];
    const index = views.indexOf(view);
    const next =
      event.key === "Home"
        ? "map"
        : event.key === "End"
          ? "practice"
          : views[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3];
    changeView(next);
    ({ map: mapTab, read: readTab, practice: practiceTab })[
      next
    ].current?.focus();
  };
  const practise = () => {
    setView("practice");
    requestAnimationFrame(() => {
      content.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  };
  const sidebar = (mobile = false) => (
    <TopicSidebar
      topics={topics}
      activeSlug={topic.slug}
      progress={learning.progress}
      onSelect={select}
      onMap={() => {
        setView("map");
        dialog.current?.close();
        requestAnimationFrame(() => {
          mapTab.current?.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: "instant" });
        });
      }}
      onClose={mobile ? () => dialog.current?.close() : undefined}
    />
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#lesson-content">
        Skip to lesson
      </a>
      <header className="app-header">
        <a
          className="brand"
          href="#lesson-content"
          aria-label="Grammacho, skip to lesson"
        >
          <img src="/assets/grammacho-logo.png" alt="" width="32" height="32" />
          <span>Grammacho</span>
          <span className="beta-label">Beta</span>
        </a>
        <div className="header-actions">
          <span className="save-note">Saved on this browser</span>
          <button
            className="button secondary mobile-menu"
            onClick={() => dialog.current?.showModal()}
            type="button"
            aria-haspopup="dialog"
          >
            Topics
          </button>
        </div>
      </header>
      <div className="workspace">
        <aside className="desktop-sidebar">
          {sidebar()}
          <details className="progress-details">
            <summary>
              Your progress{" "}
              <span>
                {learning.totals.completedTopics}/{topics.length}
              </span>
            </summary>
            <div className="disclosure-content">
              <p>
                {learning.totals.completedTopics} of {topics.length} topics
                complete
              </p>
              <p>
                {learning.totals.correctAnswers} correct of{" "}
                {learning.totals.totalAnswers} answers ·{" "}
                {learning.totals.accuracy}% accuracy
              </p>
              <p className="muted">
                Score 16/20 in one session to complete a topic. Progress stays
                on this browser.
              </p>
            </div>
          </details>
          <p className="rail-note">A little practice, at your pace.</p>
        </aside>
        <dialog
          ref={dialog}
          className="topics-dialog"
          aria-label="Grammar topics"
          onClick={(event) => {
            if (event.target === dialog.current) dialog.current?.close();
          }}
        >
          {sidebar(true)}
          <p className="muted mobile-progress">
            {learning.totals.completedTopics} of {topics.length} topics complete
            · Progress stays on this browser.
          </p>
        </dialog>
        <main className="learning-space">
          {learning.storageMessage && (
            <p role="alert" className="notice">
              {learning.storageMessage}
            </p>
          )}
          {learning.legacyProgress && (
            <details className="small-disclosure">
              <summary>About your earlier progress</summary>
              <p>
                Your earlier prototype progress is preserved separately in this
                browser. This beta uses new questions, so completion starts
                fresh.
              </p>
            </details>
          )}
          <div className="lesson-toolbar">
            <span className="topic-position">
              {view === "map" ? (
                "Whole course"
              ) : (
                <>
                  {topic.stage?.split(" · ")[1] ?? "Grammar"}{" "}
                  <span aria-hidden="true">/</span>{" "}
                  {String(topics.indexOf(topic) + 1).padStart(2, "0")}
                </>
              )}
            </span>
            <div
              className="view-tabs"
              role="tablist"
              aria-label="Learning mode"
            >
              <button
                ref={mapTab}
                id="map-tab"
                role="tab"
                aria-selected={view === "map"}
                aria-controls="lesson-content"
                tabIndex={view === "map" ? 0 : -1}
                onKeyDown={tabKeys}
                onClick={() => changeView("map")}
              >
                Grammar map
              </button>
              <button
                ref={readTab}
                id="read-tab"
                role="tab"
                aria-selected={view === "read"}
                aria-controls="lesson-content"
                tabIndex={view === "read" ? 0 : -1}
                onKeyDown={tabKeys}
                onClick={() => changeView("read")}
              >
                Read
              </button>
              <button
                ref={practiceTab}
                id="practice-tab"
                role="tab"
                aria-selected={view === "practice"}
                aria-controls="lesson-content"
                tabIndex={view === "practice" ? 0 : -1}
                onKeyDown={tabKeys}
                onClick={() => changeView("practice")}
              >
                Practice
              </button>
            </div>
          </div>
          <div
            ref={content}
            id="lesson-content"
            className="lesson-content"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`${view}-tab`}
          >
            {view === "map" ? (
              <GrammarMap onOpen={select} />
            ) : view === "read" ? (
              <TopicReader
                key={topic.slug}
                topic={topic}
                onPractice={practise}
                onNext={nextTopic ? () => select(nextTopic.slug) : undefined}
              />
            ) : (
              <PracticePanel
                key={topic.slug}
                topic={topic}
                progress={learning.progress[topic.slug]}
                session={learning.sessions[topic.slug]}
                onStart={() => learning.startSession(topic.slug)}
                onAnswer={(sessionId, itemId, choice) =>
                  learning.answer(topic.slug, sessionId, itemId, choice)
                }
                onNext={(sessionId) => learning.next(topic.slug, sessionId)}
                onReset={() => learning.resetTopic(topic.slug)}
                onContinue={
                  nextTopic ? () => select(nextTopic.slug) : undefined
                }
              />
            )}
          </div>
          <footer className="app-footer">
            <details className="curriculum-about">
              <summary>About this learning path</summary>
              <p>
                {topics.length} chapters and{" "}
                {(topics.length * 200).toLocaleString()} questions cover the
                standard-English grammar course. The Grammar map shows every
                reading section across 20 subject areas, from sentence
                foundations to advanced clauses and style. Each practice draws
                20 questions randomly, balancing skills and prioritising unseen
                items.
              </p>
              <p>
                The sequence follows prerequisites and draws on British Council
                learning levels and England’s school grammar guidance. It is our
                teaching sequence, not an institution’s prescribed syllabus.
              </p>
              <p>
                Completing the course shows broad practice coverage. Lasting
                mastery also needs varied reading, listening, speaking and
                writing; no finite quiz bank covers every construction, idiom or
                dialect.
              </p>
            </details>
            <div className="shared-learning-note">
              <strong>Keep in mind</strong>
              <p>
                Read for meaning, notice the highlighted pattern, and explain
                your choice before checking it. Revisit mistakes and try another
                session after a break. A score of 16/20 marks a chapter
                complete; it is a practice milestone, not a CEFR certificate.
              </p>
            </div>
            <p>
              Original practice with published references. Independent educator
              review pending. Your progress stays on this browser.
            </p>
            <p className="release-label">Curriculum {catalogVersion}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

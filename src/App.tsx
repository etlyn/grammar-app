import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { PracticePanel } from "./components/PracticePanel";
import { TopicReader } from "./components/TopicReader";
import { TopicSidebar } from "./components/TopicSidebar";
import { useProgress } from "./hooks/useProgress";
import {
  grammarCatalog as topics,
  catalogVersion,
} from "./services/contentService";

type View = "read" | "practice";
const viewKey = "grammacho-web-view";
export default function App() {
  const learning = useProgress();
  const topic = topics.find((t) => t.slug === learning.activeSlug) ?? topics[0];
  const nextTopic = topics[topics.indexOf(topic) + 1];
  const [view, setView] = useState<View>(() => {
    try {
      return localStorage.getItem(viewKey) === "practice" ? "practice" : "read";
    } catch {
      return "read";
    }
  });
  const dialog = useRef<HTMLDialogElement>(null);
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
  const select = (slug: string) => {
    learning.selectTopic(slug);
    setView("read");
    dialog.current?.close();
    requestAnimationFrame(() => {
      readTab.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
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
    const next =
      event.key === "Home"
        ? "read"
        : event.key === "End"
          ? "practice"
          : view === "read"
            ? "practice"
            : "read";
    changeView(next);
    (next === "read" ? readTab : practiceTab).current?.focus();
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
              Foundations <span aria-hidden="true">/</span>{" "}
              {String(topics.indexOf(topic) + 1).padStart(2, "0")}
            </span>
            <div
              className="view-tabs"
              role="tablist"
              aria-label="Learning mode"
            >
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
            {view === "read" ? (
              <TopicReader
                key={topic.slug}
                topic={topic}
                onPractice={practise}
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
            Original practice with published references.
            <br />
            Educator review pending · Curriculum {catalogVersion}
          </footer>
        </main>
      </div>
    </div>
  );
}

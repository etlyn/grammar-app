import { useEffect, useState } from "react";
import { PracticePanel } from "./components/PracticePanel";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { TopicReader } from "./components/TopicReader";
import { TopicSidebar } from "./components/TopicSidebar";
import { useProgress } from "./hooks/useProgress";
import {
  grammarCatalog as topics,
  catalogVersion,
} from "./services/contentService";

export default function App() {
  const learning = useProgress();
  const topic = topics.find((t) => t.slug === learning.activeSlug) ?? topics[0];
  const nextTopic = topics[topics.indexOf(topic) + 1];
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);
  const select = (slug: string) => {
    learning.selectTopic(slug);
    setMenuOpen(false);
  };
  return (
    <main className="min-h-screen bg-[#fbf9ff] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-indigo-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-indigo-200 px-3 py-2 font-bold text-indigo-700 lg:hidden"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              Topics
            </button>
            <img
              src="/assets/grammacho-logo.png"
              alt=""
              className="h-9 w-9 rounded-xl"
            />
            <div>
              <h1 className="font-black">
                Grammacho{" "}
                <span className="ml-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
                  Beta
                </span>
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                English foundations · Learn, practise, review
              </p>
            </div>
          </div>
          <p className="text-right text-xs font-medium text-slate-500">
            Progress saved
            <br />
            on this browser
          </p>
        </div>
      </header>
      <ProgressDashboard {...learning.totals} syncing={false} />
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        {learning.storageMessage && (
          <p
            role="alert"
            className="mb-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950"
          >
            {learning.storageMessage}
          </p>
        )}
        {learning.legacyProgress && (
          <details className="mb-3 rounded-2xl bg-white p-3 text-sm text-slate-600">
            <summary className="cursor-pointer font-semibold">
              A fresh start with the foundation curriculum
            </summary>
            <p className="mt-2">
              Your earlier prototype progress is preserved separately in this
              browser. This beta uses new questions, so completion starts fresh.
            </p>
          </details>
        )}
        <p className="text-sm leading-6 text-slate-600">
          8 foundation topics · 200 practice questions per topic · No account
          needed
        </p>
      </div>
      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[69px] z-40 flex flex-col bg-slate-950/30 p-3 lg:hidden">
          <div className="h-full max-w-sm">
            <TopicSidebar
              topics={topics}
              activeSlug={topic.slug}
              progress={learning.progress}
              onSelect={select}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8">
        <div className="hidden lg:block">
          <TopicSidebar
            topics={topics}
            activeSlug={topic.slug}
            progress={learning.progress}
            onSelect={select}
          />
        </div>
        <div className="min-w-0 space-y-6">
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
            onContinue={nextTopic ? () => select(nextTopic.slug) : undefined}
          />
          <TopicReader topic={topic} progress={learning.progress[topic.slug]} />
        </div>
      </div>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs leading-6 text-slate-500 sm:px-6 lg:px-8">
        Curriculum {catalogVersion}. Original practice with published
        references; educator review pending. Progress stays on this browser.
      </footer>
    </main>
  );
}

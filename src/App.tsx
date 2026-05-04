import { useEffect, useMemo, useState } from "react";
import { AuthPanel } from "./components/AuthPanel";
import { PlacementTestDialog } from "./components/PlacementTestDialog.tsx";
import { PracticePanel } from "./components/PracticePanel";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { TopicReader } from "./components/TopicReader";
import { TopicSidebar } from "./components/TopicSidebar";
import { useAuth } from "./hooks/useAuth";
import { useProgress } from "./hooks/useProgress";
import { isSupabaseConfigured } from "./lib/supabase";
import {
  generateReusableContent,
  loadGrammarCatalog,
} from "./services/contentService";
import type { GrammarTopic } from "./types/grammar";

function App() {
  const auth = useAuth();
  const { progress, totals, syncing, recordAttempt, resetTopic } = useProgress(
    auth.user,
  );
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [isCurriculumCollapsed, setIsCurriculumCollapsed] = useState(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingTopics(true);
      const catalog = await loadGrammarCatalog();
      setTopics(catalog);
      setActiveSlug((current) => current || catalog[0]?.slug || "");
      setLoadingTopics(false);
    };

    load();
  }, []);

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.slug === activeSlug) ?? topics[0],
    [activeSlug, topics],
  );

  useEffect(() => {
    document.body.style.overflow = isTopicMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isTopicMenuOpen]);

  const generateMore = async () => {
    if (!activeTopic) return;

    setGenerating(true);
    setContentMessage("");
    try {
      const nextTopic = await generateReusableContent(
        activeTopic,
        activeTopic.level,
      );
      if (nextTopic) {
        setTopics((current) =>
          current.map((topic) =>
            topic.slug === nextTopic.slug ? nextTopic : topic,
          ),
        );
        setContentMessage(
          "New AI content was saved to Supabase and added to this topic.",
        );
      } else {
        setContentMessage("Supabase content generation is not configured yet.");
      }
    } catch (error) {
      setContentMessage(
        error instanceof Error
          ? error.message
          : "Could not generate new content right now.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#fbf9ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.22)_1.4px,transparent_0)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-60 -z-10 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <header className="sticky top-0 z-30 border-b border-indigo-100/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open grammar topics menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-700 shadow-sm shadow-indigo-100/70 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 lg:hidden"
              onClick={() => setIsTopicMenuOpen(true)}
              type="button"
            >
              <span className="sr-only">Open topics</span>
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 rounded bg-current" />
                <span className="block h-0.5 w-5 rounded bg-current" />
                <span className="block h-0.5 w-5 rounded bg-current" />
              </span>
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-400 to-fuchsia-400 text-sm font-black text-white shadow-md shadow-indigo-200/70">
              G
            </div>
            <div className="flex min-w-0 items-baseline gap-2">
              <h1 className="truncate text-sm font-black tracking-tight text-slate-950 sm:text-base">
                Grammacho
              </h1>
              <span className="hidden text-xs font-semibold text-indigo-400 sm:inline">
                Practice first
              </span>
            </div>
          </div>
          <button
            className="hidden shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
            onClick={() => setIsPlacementTestOpen(true)}
            type="button"
          >
            Test your CEFR level
          </button>
          <AuthPanel
            isConfigured={auth.isConfigured}
            loading={auth.loading}
            message={auth.message}
            onSendMagicLink={auth.sendMagicLink}
            onSignOut={auth.signOut}
            user={auth.user}
          />
        </div>
      </header>

      <ProgressDashboard syncing={syncing} {...totals} />
      <div className="border-b border-indigo-100/70 bg-white/45 px-4 py-1.5 sm:hidden">
        <button
          className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-800 shadow-sm"
          onClick={() => setIsPlacementTestOpen(true)}
          type="button"
        >
          Test your CEFR level · 50 questions
        </button>
      </div>

      {isTopicMenuOpen ? (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Grammar topics"
        >
          <button
            aria-label="Close grammar topics menu"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsTopicMenuOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(23rem,calc(100vw-1.5rem))] max-w-full p-3">
            <TopicSidebar
              activeSlug={activeTopic?.slug ?? activeSlug}
              onClose={() => setIsTopicMenuOpen(false)}
              onSelect={setActiveSlug}
              progress={progress}
              topics={topics}
            />
          </div>
        </div>
      ) : null}

      {isPlacementTestOpen ? (
        <PlacementTestDialog
          onClose={() => setIsPlacementTestOpen(false)}
          topics={topics}
        />
      ) : null}

      <div
        className={`mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7 ${
          isCurriculumCollapsed
            ? "lg:grid-cols-[4rem_minmax(0,1fr)]"
            : "lg:grid-cols-[20rem_minmax(0,1fr)]"
        }`}
      >
        {loadingTopics ? (
          <div className="rounded-[2rem] border border-indigo-100 bg-white/80 p-10 text-center shadow-soft lg:col-span-2">
            <p className="font-semibold text-indigo-500">
              Loading grammar curriculum…
            </p>
          </div>
        ) : activeTopic ? (
          <>
            <div className="hidden lg:block">
              {isCurriculumCollapsed ? (
                <button
                  aria-label="Expand curriculum"
                  className="sticky top-24 flex h-40 w-full flex-col items-center justify-center gap-3 rounded-[2rem] border border-indigo-100 bg-white/90 text-indigo-700 shadow-soft transition hover:-translate-y-0.5 hover:bg-indigo-50"
                  onClick={() => setIsCurriculumCollapsed(false)}
                  title="Expand curriculum"
                  type="button"
                >
                  <span className="text-2xl font-black">›</span>
                  <span className="rotate-180 text-xs font-black uppercase tracking-[0.2em] [writing-mode:vertical-rl]">
                    Topics
                  </span>
                </button>
              ) : (
                <TopicSidebar
                  activeSlug={activeTopic.slug}
                  onCollapse={() => setIsCurriculumCollapsed(true)}
                  onSelect={setActiveSlug}
                  progress={progress}
                  topics={topics}
                />
              )}
            </div>
            <div className="space-y-7">
              {contentMessage && (
                <div className="rounded-3xl border border-sky-100 bg-sky-50/90 px-5 py-4 text-sm font-medium text-sky-900 shadow-sm shadow-sky-100/70">
                  {contentMessage}
                </div>
              )}
              <PracticePanel
                onRecordAttempt={recordAttempt}
                onResetTopic={resetTopic}
                progress={progress[activeTopic.slug]}
                topic={activeTopic}
              />
              <TopicReader
                canGenerate={isSupabaseConfigured}
                generating={generating}
                onGenerateMore={generateMore}
                progress={progress[activeTopic.slug]}
                topic={activeTopic}
              />
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-indigo-100 bg-white/80 p-10 text-center shadow-soft lg:col-span-2">
            <p className="font-semibold text-slate-500">
              No grammar topics are available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;

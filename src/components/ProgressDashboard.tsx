type ProgressDashboardProps = {
  completedTopics: number;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  syncing: boolean;
};

export function ProgressDashboard({
  completedTopics,
  totalAnswers,
  correctAnswers,
  accuracy,
  syncing,
}: ProgressDashboardProps) {
  const cards = [
    { label: "Completed", value: completedTopics },
    { label: "Answered", value: totalAnswers },
    { label: "Correct", value: correctAnswers },
    { label: "Accuracy", value: `${accuracy}%` },
  ];

  return (
    <section className="border-b border-indigo-100/70 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-1 sm:px-6 lg:px-8">
        {cards.map((card) => (
          <div
            className="flex shrink-0 items-baseline gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm"
            key={card.label}
          >
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-500">
              {card.label}
            </span>
            <span className="text-sm font-black text-slate-950">
              {card.value}
            </span>
          </div>
        ))}
        {syncing && (
          <p className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-500">
            Syncing progress…
          </p>
        )}
      </div>
    </section>
  );
}

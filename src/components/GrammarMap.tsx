import { useState } from "react";
import { grammarMap, contentSources } from "../services/contentService";

type Props = { onOpen: (slug: string, sectionId?: string) => void };
export function GrammarMap({ onOpen }: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const needle = query.trim().toLocaleLowerCase();
  const domains = grammarMap.domains
    .map((d) => ({
      ...d,
      concepts: d.concepts.filter((c) =>
        `${d.title} ${c.title} ${c.topicTitle}`
          .toLocaleLowerCase()
          .includes(needle),
      ),
    }))
    .filter((d) => d.concepts.length);
  const total = grammarMap.domains.reduce((n, d) => n + d.concepts.length, 0);
  const chapters = new Set(
    grammarMap.domains.flatMap((d) => d.concepts.map((c) => c.topicSlug)),
  ).size;
  const matches = domains.reduce((n, d) => n + d.concepts.length, 0);
  return (
    <article className="grammar-map panel-enter">
      <header className="topic-intro">
        <p className="eyebrow">The whole subject, in one place</p>
        <h1>{grammarMap.title}</h1>
        <p className="lead">
          From your first sentence to the finer points of grammar. See how the
          subject fits together, then explore any concept.
        </p>
        <p className="map-counts">
          {grammarMap.domains.length} grammar areas{" "}
          <span aria-hidden="true">·</span> {chapters} chapters{" "}
          <span aria-hidden="true">·</span> {total} reading sections
        </p>
        <p className="map-scope">{grammarMap.scope}</p>
        <button
          className="button primary"
          type="button"
          onClick={() => onOpen("sentence-structure")}
        >
          Start with the foundations <span aria-hidden="true">→</span>
        </button>
      </header>
      <div className="map-search-controls">
        <label htmlFor="concept-search">Find a concept</label>
        <input
          id="concept-search"
          type="search"
          className="topic-search"
          placeholder="Try negation, articles or word formation"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="contents-controls">
          <p aria-live="polite">
            {needle
              ? `${matches} matching sections`
              : "Explore by grammar area"}
          </p>
          {needle ? (
            <button
              className="text-button"
              type="button"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          ) : (
            <button
              className="text-button"
              type="button"
              onClick={() =>
                setExpanded(
                  expanded.length === grammarMap.domains.length
                    ? []
                    : grammarMap.domains.map((d) => d.id),
                )
              }
            >
              {expanded.length === grammarMap.domains.length
                ? "Collapse all"
                : "Expand all areas"}
            </button>
          )}
        </div>
      </div>
      <div className="grammar-areas">
        {domains.map((d) => {
          const open = !!needle || expanded.includes(d.id);
          return (
            <section className="grammar-area" key={d.id}>
              <h2>
                <button
                  type="button"
                  className="grammar-area-toggle"
                  aria-expanded={open}
                  aria-controls={`area-${d.id}`}
                  onClick={() =>
                    setExpanded((v) =>
                      v.includes(d.id)
                        ? v.filter((x) => x !== d.id)
                        : [...v, d.id],
                    )
                  }
                  disabled={!!needle}
                >
                  <span>
                    {d.title}
                    <small>{d.summary}</small>
                  </span>
                  <span className="map-area-count">
                    {d.concepts.length}
                    <span aria-hidden="true"> {open ? "−" : "+"}</span>
                  </span>
                </button>
              </h2>
              <div id={`area-${d.id}`} hidden={!open}>
                <ul className="concept-list">
                  {d.concepts.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(c.topicSlug, c.id)}
                      >
                        <span>{c.title}</span>
                        <small>
                          Chapter {c.order} · {c.topicTitle}
                        </small>
                        <span className="concept-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
      {!domains.length && (
        <p className="empty-topics" role="status">
          No matching concepts. Try a shorter phrase or a related word.
        </p>
      )}
      <details className="reading-details map-method">
        <summary>How to use this map</summary>
        <div className="disclosure-content">
          <p>
            The sidebar follows a learning sequence. This map groups the same
            reading sections by the grammar system they explain. Every entry
            opens a full reading; nothing is locked behind a practice score.
          </p>
          <p>
            Reading gives you the picture. Practice helps you use it. Each
            chapter keeps its 200-question bank and draws 20 items per session.
            A practice pass and familiarity with every reading section are
            different milestones.
          </p>
          <p>
            The subject-area map is checked against the contents of Cambridge’s
            comprehensive grammar, alongside British Council guidance and
            England’s school grammar scope. This is our learning arrangement,
            not an institution’s prescribed syllabus. Section counts describe
            this book’s organisation, not a fixed number of English rules.
          </p>
          <p>
            Coverage includes the main systems of contemporary standard English
            and common spoken, written and regional patterns. Individual
            vocabulary items, every dialect-specific rule and historical English
            require additional references. Independent educator review is
            pending.
          </p>
          <ul>
            {contentSources
              .filter((s) => grammarMap.referenceIds.includes(s.id))
              .map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.publisher}: {s.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </details>
    </article>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GrammarMap,
  GrammarTopic,
  ProgressByTopic,
} from "../../types/grammar";
import { RichText } from "../RichText";
import { areaTile, Icon, Tile } from "./Brand";
import type { LearningSource } from "./learningView";
import "./rebrand-learning.css";

export type MapProps = {
  courseId: "en" | "es";
  topics: GrammarTopic[];
  map: GrammarMap;
  progress: ProgressByTopic;
  sources?: LearningSource[];
  onRead: (slug: string, sectionId?: string) => void;
};
type Concept = GrammarMap["domains"][number]["concepts"][number];

export function Map({
  courseId,
  topics,
  map,
  progress,
  sources = [],
  onRead,
}: MapProps) {
  const [view, setView] = useState<"mosaic" | "outline">("mosaic");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [full, setFull] = useState<string[]>([]);
  const [areaId, setAreaId] = useState<string | null>(null);
  const areaHeading = useRef<HTMLHeadingElement>(null);
  const areaTrigger = useRef<string | null>(null);
  const needle = query.trim().toLocaleLowerCase();
  const language = courseId === "es" ? "Spanish" : "English";
  const hint =
    courseId === "es"
      ? "Try ser, pronouns or subjunctive"
      : "Try negation, articles or word formation";
  const areas = map.domains;
  const chapters = new Set(
    areas.flatMap((area) => area.concepts.map((concept) => concept.topicSlug)),
  ).size;
  const sections = areas.reduce(
    (count, area) => count + area.concepts.length,
    0,
  );
  const matches = useMemo(
    () =>
      areas
        .map((area) => ({
          ...area,
          concepts: area.concepts.filter((concept) =>
            `${area.title} ${concept.title} ${concept.topicTitle}`
              .toLocaleLowerCase()
              .includes(needle),
          ),
        }))
        .filter((area) => area.concepts.length),
    [areas, needle],
  );
  const matchCount = matches.reduce(
    (count, area) => count + area.concepts.length,
    0,
  );
  const selected = areas.find((area) => area.id === areaId);
  const selectedChapters = selected
    ? [...new Set(selected.concepts.map((concept) => concept.topicSlug))]
        .map((slug) => ({
          slug,
          topic: topics.find((topic) => topic.slug === slug),
          concepts: selected.concepts.filter(
            (concept) => concept.topicSlug === slug,
          ),
        }))
        .sort(
          (a, b) =>
            (a.topic?.order ?? a.concepts[0].order) -
            (b.topic?.order ?? b.concepts[0].order),
        )
    : [];
  const completedChapters = selectedChapters.filter(
    (chapter) => progress[chapter.slug]?.isCompleted,
  ).length;
  useEffect(() => {
    setAreaId(null);
    setQuery("");
    setExpanded([]);
    setFull([]);
  }, [courseId]);
  useEffect(() => {
    if (areaId) {
      areaHeading.current?.focus({ preventScroll: true });
      areaHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [areaId]);
  const backToMap = () => {
    setAreaId(null);
    requestAnimationFrame(() => {
      if (areaTrigger.current)
        document
          .getElementById(`rb-area-trigger-${areaTrigger.current}`)
          ?.focus({ preventScroll: true });
    });
  };
  const conceptRow = (concept: Concept, withChapter = true) => (
    <button
      key={concept.id}
      type="button"
      className="rb-learning-concept"
      aria-label={`${concept.title}, chapter ${concept.order}, ${concept.topicTitle}`}
      onClick={() => onRead(concept.topicSlug, concept.id)}
    >
      <span>
        <span>{concept.title}</span>
        {withChapter && (
          <small>
            Chapter {concept.order} · {concept.topicTitle}
          </small>
        )}
      </span>
      <Icon name="chevronRight" size={17} />
    </button>
  );

  if (selected)
    return (
      <section
        className="rb-learning-page rb-map-area"
        aria-labelledby="rb-area-title"
      >
        <button type="button" className="rb-learning-back" onClick={backToMap}>
          <Icon name="arrowLeft" size={19} />
          Grammar map
        </button>
        <header className="rb-learning-area-intro">
          <Tile stage={areaTile(areas.indexOf(selected))} size={60} />
          <h1 id="rb-area-title" tabIndex={-1} ref={areaHeading}>
            {selected.title}
          </h1>
          <p>{selected.summary}</p>
          <div className="rb-learning-pills">
            <span className="rb-learning-pill">
              {selected.concepts.length} concepts
            </span>
            <span className="rb-learning-pill">
              {selectedChapters.length} chapters
            </span>
            {!!completedChapters && (
              <span className="rb-learning-pill rb-learning-pill-ok">
                {completedChapters} complete
              </span>
            )}
          </div>
        </header>
        {selectedChapters.map(({ slug, topic, concepts }) => (
          <section
            className="rb-learning-area-chapter"
            key={slug}
            aria-labelledby={`rb-map-chapter-${slug}`}
          >
            <header>
              <div>
                <p className="rb-learning-eyebrow">
                  Chapter {topic?.order ?? concepts[0].order}
                  {topic ? ` · ${topic.level}` : ""}
                </p>
                <h2 id={`rb-map-chapter-${slug}`}>
                  {topic?.title ?? concepts[0].topicTitle}
                </h2>
              </div>
              {progress[slug]?.isCompleted && (
                <span className="rb-learning-pill rb-learning-pill-ok">
                  Complete
                </span>
              )}
            </header>
            <div className="rb-learning-list">
              {concepts.map((concept) => conceptRow(concept, false))}
            </div>
          </section>
        ))}
      </section>
    );

  return (
    <section className="rb-learning-page rb-map" aria-labelledby="rb-map-title">
      <header className="rb-learning-page-header">
        <div>
          <h1 id="rb-map-title">Grammar map</h1>
          <p>
            {areas.length} areas · {chapters} chapters · {sections} reading
            sections
          </p>
        </div>
        <div
          className="rb-learning-segmented"
          role="group"
          aria-label="Map view"
        >
          {(["mosaic", "outline"] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
            >
              <Icon name={mode === "mosaic" ? "grid" : "list"} size={17} />
              {mode === "mosaic" ? "Mosaic" : "Outline"}
            </button>
          ))}
        </div>
      </header>
      <form
        role="search"
        className="rb-learning-search-controls"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="rb-learning-search-field">
          <Icon name="search" size={20} />
          <span className="sr-only">Find a grammar concept</span>
          <input
            type="search"
            placeholder={hint}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setQuery("");
            }}
          />
        </label>
      </form>
      {needle ? (
        <>
          <p role="status" className="rb-learning-caption">
            {matchCount} matching {matchCount === 1 ? "section" : "sections"}
          </p>
          {matches.map((area) => (
            <section className="rb-learning-map-results" key={area.id}>
              <h2>
                <Tile
                  stage={areaTile(
                    areas.findIndex((item) => item.id === area.id),
                  )}
                  size={30}
                />
                {area.title}
              </h2>
              <div className="rb-learning-list">
                {area.concepts.map((concept) => conceptRow(concept))}
              </div>
            </section>
          ))}
          {!matches.length && (
            <div className="rb-learning-empty">
              <Tile stage={9} size={64} />
              <h2>No matching concepts</h2>
              <p>Try a shorter phrase or a related word.</p>
              <button
                type="button"
                className="rb-learning-text-button"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            </div>
          )}
        </>
      ) : view === "mosaic" ? (
        <>
          <div className="rb-learning-map-intro">
            <p className="rb-learning-eyebrow">Your {language} grammar map</p>
            <p>
              See how {language} grammar fits together, then open any concept.
              Nothing is locked behind a practice score.
            </p>
            {topics[0] && (
              <button
                type="button"
                className="rb-learning-text-button"
                onClick={() => onRead(topics[0].slug)}
              >
                Start with the foundations
                <Icon name="arrowRight" size={17} />
              </button>
            )}
          </div>
          <div className="rb-learning-mosaic">
            {areas.map((area, index) => (
              <button
                type="button"
                className="rb-learning-area-tile"
                key={area.id}
                id={`rb-area-trigger-${area.id}`}
                aria-label={`${area.title}, ${area.concepts.length} sections`}
                onClick={(event) => {
                  areaTrigger.current = area.id;
                  setAreaId(area.id);
                }}
              >
                <span className="rb-learning-area-tile-top">
                  <Tile stage={areaTile(index)} size={48} />
                  <span className="rb-learning-pill">
                    {area.concepts.length}
                    <span className="sr-only"> sections</span>
                  </span>
                </span>
                <strong>{area.title}</strong>
              </button>
            ))}
          </div>
        </>
      ) : (
        <section className="rb-learning-outline" aria-label="Grammar areas">
          <div className="rb-learning-section-heading">
            <p className="rb-learning-caption">Explore by grammar area</p>
            <button
              type="button"
              className="rb-learning-text-button"
              onClick={() =>
                setExpanded(
                  expanded.length === areas.length
                    ? []
                    : areas.map((area) => area.id),
                )
              }
            >
              {expanded.length === areas.length ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <div className="rb-learning-list">
            {areas.map((area, index) => {
              const open = expanded.includes(area.id);
              const visible = full.includes(area.id)
                ? area.concepts
                : area.concepts.slice(0, 4);
              const more = area.concepts.length - visible.length;
              return (
                <div className="rb-learning-outline-area" key={area.id}>
                  <h2>
                    <button
                      className="rb-learning-area-toggle"
                      type="button"
                      aria-expanded={open}
                      aria-controls={`rb-map-area-${area.id}`}
                      onClick={() =>
                        setExpanded((current) =>
                          current.includes(area.id)
                            ? current.filter((id) => id !== area.id)
                            : [...current, area.id],
                        )
                      }
                    >
                      <Tile stage={areaTile(index)} size={38} />
                      <span className="rb-learning-row-copy">
                        <strong>{area.title}</strong>
                        {open && <small>{area.summary}</small>}
                      </span>
                      <span className="rb-learning-caption">
                        {area.concepts.length}
                      </span>
                      <span
                        className={`rb-learning-chevron${open ? " is-open" : ""}`}
                      >
                        <Icon name="chevronDown" size={18} />
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`rb-map-area-${area.id}`}
                    className="rb-learning-area-content"
                    hidden={!open}
                  >
                    {visible.map((concept) => conceptRow(concept))}
                    {more > 0 && (
                      <button
                        type="button"
                        className="rb-learning-show-more"
                        onClick={() =>
                          setFull((current) => [...current, area.id])
                        }
                      >
                        {more} more in this area
                        <Icon name="chevronDown" size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      <details className="rb-learning-details rb-learning-map-help">
        <summary>
          <Icon name="info" size={20} />
          <span>
            <strong>How to use this map</strong>
            <small>What the map covers, and its sources</small>
          </span>
          <Icon name="chevronDown" size={18} />
        </summary>
        <div className="rb-learning-disclosure-body">
          <p>
            The learning path follows a sequence. This map gathers the same
            reading sections by the grammar system they explain. Open any
            concept to read its chapter.
          </p>
          <p>
            <RichText>{map.scope}</RichText>
          </p>
          {map.description && (
            <p>
              <RichText>{map.description}</RichText>
            </p>
          )}
          <p>
            Reading gives you the picture. Practice helps you use it. Each
            session draws 20 questions from its chapter’s bank. A practice pass
            and familiarity with every reading section are different milestones.
            Independent educator review is pending.
          </p>
          {sources.some((source) => map.referenceIds.includes(source.id)) && (
            <ul className="rb-learning-source-list">
              {sources
                .filter((source) => map.referenceIds.includes(source.id))
                .map((source) => (
                  <li key={source.id}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.publisher}: {source.title}
                      <Icon name="external" size={15} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </details>
    </section>
  );
}

export default Map;

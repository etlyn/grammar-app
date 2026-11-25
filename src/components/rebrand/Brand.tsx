import { MARK, WORDMARK, WORDMARK_PLAIN } from "./logoPaths";

const fixed = {
  azul: "#2440D8",
  ink: "#1B1A2B",
  paper: "#FBF7F0",
  sol: "#FFC933",
  terra: "#E0603A",
  white: "#FFFFFF",
};
const markTones = {
  azul: { background: fixed.azul, letter: fixed.white, tilde: fixed.sol },
  paper: { background: fixed.paper, letter: fixed.ink, tilde: fixed.terra },
  ink: { background: fixed.ink, letter: fixed.paper, tilde: fixed.sol },
  bare: { background: undefined, letter: fixed.white, tilde: fixed.sol },
};

export function Mark({
  size = 28,
  tone = "azul",
}: {
  size?: number;
  tone?: keyof typeof markTones;
}) {
  const { background, letter, tilde } = markTones[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${MARK.size} ${MARK.size}`}
      aria-hidden="true"
    >
      {background && (
        <rect
          width={MARK.size}
          height={MARK.size}
          rx={MARK.size * 0.2237}
          fill={background}
        />
      )}
      <path d={MARK.g} fill={letter} />
      <path
        d={MARK.tilde}
        stroke={tilde}
        strokeWidth={MARK.tildeStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({
  height = 28,
  accent = false,
}: {
  height?: number;
  accent?: boolean;
}) {
  const source = accent ? WORDMARK : WORDMARK_PLAIN;
  return (
    <svg
      width={(height * source.width) / source.height}
      height={height}
      viewBox={`0 0 ${source.width} ${source.height}`}
      role="img"
      aria-label="Grammacho"
    >
      <path d={source.letters} fill="currentColor" />
      {accent && (
        <path
          d={WORDMARK.tilde}
          stroke={fixed.sol}
          strokeWidth={WORDMARK.tildeStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
}

export function TildeUnderline() {
  const path = Array.from(
    { length: 16 },
    (_, index) =>
      ` Q${index * 12 + 9} ${index % 2 ? 16 : 0} ${index * 12 + 15} 8`,
  ).join("");
  return (
    <svg width="196" height="16" viewBox="0 0 196 16" aria-hidden="true">
      <path
        d={`M3 8${path}`}
        stroke={fixed.sol}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const tileColors = {
  ...fixed,
  mentaMain: "var(--menta-main)",
  malvaMain: "var(--malva-main)",
  solSoft: "var(--sol-soft)",
  brandSoft: "var(--brand-soft)",
  mentaSoft: "var(--menta-soft)",
  terraSoft: "var(--terra-soft)",
  malvaSoft: "var(--malva-soft)",
};

export type TileKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Pattern = "quad" | "half" | "arc" | "petal" | "diamond" | "wave";
type Tone = keyof typeof tileColors;

const kinds: Record<TileKind, [Pattern, Tone, Tone, Tone]> = {
  1: ["quad", "azul", "sol", "paper"],
  2: ["half", "sol", "terra", "azul"],
  3: ["arc", "terra", "sol", "paper"],
  4: ["petal", "mentaMain", "paper", "sol"],
  5: ["diamond", "malvaMain", "sol", "ink"],
  6: ["wave", "ink", "sol", "sol"],
  7: ["quad", "solSoft", "terra", "azul"],
  8: ["half", "brandSoft", "azul", "sol"],
  9: ["arc", "mentaSoft", "mentaMain", "terra"],
  10: ["petal", "terraSoft", "terra", "azul"],
  11: ["diamond", "malvaSoft", "malvaMain", "sol"],
  12: ["wave", "sol", "ink", "ink"],
};

const wave = (y: number) =>
  `M-6 ${y}C12 ${y - 18} 30 ${y - 18} 50 ${y}S88 ${y + 18} 106 ${y}`;

const Shapes = ({
  pattern,
  a,
  b,
}: {
  pattern: Pattern;
  a: string;
  b: string;
}) => {
  switch (pattern) {
    case "quad":
      return (
        <>
          <path d="M0 0H50A50 50 0 0 1 0 50Z" fill={a} />
          <path d="M100 0V50A50 50 0 0 1 50 0Z" fill={a} />
          <path d="M100 100H50A50 50 0 0 1 100 50Z" fill={a} />
          <path d="M0 100V50A50 50 0 0 1 50 100Z" fill={a} />
          <circle cx={50} cy={50} r={13} fill={b} />
        </>
      );
    case "half":
      return (
        <>
          <path d="M0 50A50 50 0 0 1 100 50Z" fill={a} />
          <path d="M0 100A50 50 0 0 1 100 100Z" fill={b} />
        </>
      );
    case "arc":
      return (
        <>
          <path d="M0 0A100 100 0 0 1 100 100H0Z" fill={a} />
          <circle cx={76} cy={24} r={12} fill={b} />
        </>
      );
    case "petal":
      return (
        <>
          <path d="M0 0A100 100 0 0 1 100 100A100 100 0 0 1 0 0Z" fill={a} />
          <circle cx={80} cy={20} r={9} fill={b} />
          <circle cx={20} cy={80} r={9} fill={b} />
        </>
      );
    case "diamond":
      return (
        <>
          <path d="M50 8L92 50L50 92L8 50Z" fill={a} />
          <circle cx={50} cy={50} r={13} fill={b} />
        </>
      );
    case "wave":
      return (
        <>
          {[28, 52, 76].map((y) => (
            <path
              key={y}
              d={wave(y)}
              stroke={a}
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </>
      );
  }
};

export function Tile({
  stage,
  size = 44,
  className,
}: {
  stage: number;
  size?: number;
  className?: string;
}) {
  const [pattern, base, first, second] = kinds[stage as TileKind] ?? kinds[1];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ borderRadius: (size * 22) / 96 }}
      aria-hidden="true"
    >
      <rect width={100} height={100} fill={tileColors[base]} />
      <Shapes pattern={pattern} a={tileColors[first]} b={tileColors[second]} />
    </svg>
  );
}

export const areaTile = (index: number) =>
  [1, 8, 3, 10, 5, 9, 2, 6, 11, 4, 7, 12][index % 12];

/** Lucide paths adapted from the native Grammacho icon set, ISC licence. */
type Shape =
  | string
  | { c: [number, number, number] }
  | { r: [number, number, number, number, number] };

const shapes = {
  book: [
    "M12 7v14",
    "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
  ],
  grid: [
    { r: [3, 3, 7, 7, 1.5] },
    { r: [14, 3, 7, 7, 1.5] },
    { r: [14, 14, 7, 7, 1.5] },
    { r: [3, 14, 7, 7, 1.5] },
  ],
  target: [{ c: [12, 12, 10] }, { c: [12, 12, 6] }, { c: [12, 12, 2] }],
  chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  search: [{ c: [11, 11, 8] }, "m21 21-4.3-4.3"],
  chevronRight: ["m9 18 6-6-6-6"],
  chevronLeft: ["m15 18-6-6 6-6"],
  chevronDown: ["m6 9 6 6 6-6"],
  chevronsUpDown: ["m7 15 5 5 5-5", "m7 9 5-5 5 5"],
  close: ["M18 6 6 18", "m6 6 12 12"],
  check: ["M20 6 9 17l-5-5"],
  arrowRight: ["M5 12h14", "m12 5 7 7-7 7"],
  arrowLeft: ["m12 19-7-7 7-7", "M19 12H5"],
  bulb: [
    "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
    "M9 18h6",
    "M10 22h4",
  ],
  gear: [
    "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
    { c: [12, 12, 3] },
  ],
  refresh: ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"],
  external: [
    "M15 3h6v6",
    "M10 14 21 3",
    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  ],
  list: [
    "M3 12h.01",
    "M3 18h.01",
    "M3 6h.01",
    "M8 12h13",
    "M8 18h13",
    "M8 6h13",
  ],
  info: [{ c: [12, 12, 10] }, "M12 16v-4", "M12 8h.01"],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof shapes;

const SolidTab = ({
  name,
  color,
  knockout,
}: {
  name: IconName;
  color: string;
  knockout: string;
}) => {
  const cut = {
    stroke: knockout,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    fill: "none",
  } as const;
  if (name === "book") {
    return (
      <>
        <path
          d={shapes.book[1]}
          fill={color}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d="M12 7.5v12.5" {...cut} />
      </>
    );
  }
  if (name === "grid") {
    return (
      <>
        {shapes.grid.map((shape, index) => (
          <rect
            key={index}
            x={shape.r[0]}
            y={shape.r[1]}
            width={shape.r[2]}
            height={shape.r[3]}
            rx={shape.r[4]}
            fill={color}
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}
      </>
    );
  }
  if (name === "target") {
    return (
      <>
        <circle
          cx={12}
          cy={12}
          r={10}
          fill={color}
          stroke={color}
          strokeWidth={2}
        />
        <circle cx={12} cy={12} r={6} {...cut} />
        <circle cx={12} cy={12} r={2} fill={knockout} />
      </>
    );
  }
  const bar = {
    stroke: color,
    strokeWidth: 4.2,
    strokeLinecap: "round",
    fill: "none",
  } as const;
  return (
    <>
      <path d="M18 19.4V10.6" {...bar} />
      <path d="M12 19.4V4.6" {...bar} />
      <path d="M6 19.4v-4.8" {...bar} />
    </>
  );
};

const hasSolid = (name: IconName) =>
  name === "book" || name === "grid" || name === "target" || name === "chart";

export function Icon({
  name,
  size = 22,
  className,
  solid = false,
}: {
  name: string;
  size?: number;
  className?: string;
  solid?: boolean;
}) {
  const selected = Object.prototype.hasOwnProperty.call(shapes, name)
    ? (name as IconName)
    : "info";
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  } as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {solid && hasSolid(selected) ? (
        <SolidTab
          name={selected}
          color="currentColor"
          knockout="var(--brand-soft)"
        />
      ) : (
        (shapes[selected] as Shape[]).map((shape, i) =>
          typeof shape === "string" ? (
            <path key={i} d={shape} {...stroke} />
          ) : "c" in shape ? (
            <circle
              key={i}
              cx={shape.c[0]}
              cy={shape.c[1]}
              r={shape.c[2]}
              {...stroke}
            />
          ) : (
            <rect
              key={i}
              x={shape.r[0]}
              y={shape.r[1]}
              width={shape.r[2]}
              height={shape.r[3]}
              rx={shape.r[4]}
              {...stroke}
            />
          ),
        )
      )}
    </svg>
  );
}

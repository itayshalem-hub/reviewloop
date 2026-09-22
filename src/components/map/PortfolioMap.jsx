import Card from '../ui/Card';
import { formatRating } from '../../utils/formatters';

/**
 * The portfolio map — an illustrative, not geographic, layout of the managed
 * properties. It exists to answer one question at a glance: "where are my
 * units, and which one am I looking at?" — then to offer a second way into the
 * same filter the dropdown above the action-item list already provides.
 *
 * Three technical choices worth noting:
 *   • the town itself (river, park, plaza, streets, district labels) is a
 *     decorative background SVG with a fixed 760×420 coordinate space;
 *   • the property pins are real HTML buttons absolutely positioned as a
 *     percentage of that same 760×420 space, layered on top. Real buttons
 *     get real focus rings and real hover states for free — cheaper and more
 *     accessible than making raw SVG shapes interactive;
 *   • the SVG background and the pin overlay are two separate layers, only
 *     the first of which is clipped to the card's rounded corners. Pin
 *     labels are fixed-pixel HTML, not vector, so they don't shrink with a
 *     narrower card the way the SVG art does — clipping them to the same
 *     rounded box would crop a label's text at small widths. Left unclipped,
 *     a label that needs a few extra pixels near an edge spills gracefully
 *     into the card's own padding instead of losing a word.
 * The two coordinate spaces only line up because the container's aspect
 * ratio is locked to 760/420 (`aspect-[760/420]` below), so a pin at
 * map-space (x, y) and a percentage position of (x/760, y/420) land on the
 * same pixel regardless of how wide the card actually renders.
 */

const MAP_WIDTH = 760;
const MAP_HEIGHT = 420;

/** Convert a position in the map's coordinate space to a CSS percentage pair. */
function toPercentPosition({ x, y }) {
  return { left: `${(x / MAP_WIDTH) * 100}%`, top: `${(y / MAP_HEIGHT) * 100}%` };
}

/** Where a pin's label sits relative to its dot, keyed by each property's `mapLabelAnchor`. */
const LABEL_ANCHOR_STYLES = {
  top: { transform: 'translate(-50%, calc(-100% - 10px))', textAlign: 'center' },
  bottom: { transform: 'translate(-50%, 10px)', textAlign: 'center' },
  left: { transform: 'translate(calc(-100% - 10px), -50%)', textAlign: 'right' },
  right: { transform: 'translate(10px, -50%)', textAlign: 'left' },
};

/**
 * The decorative town itself — river, park, old-city outline, market plaza,
 * a loose street grid, and district labels. Purely illustrative geography;
 * every shape is a simple curve or primitive, not traced map data.
 */
function TownIllustration() {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* Loose street grid, sketched rather than ruled, so it reads as an old
          town rather than a survey drawing. */}
      <g stroke="var(--map-street)" strokeWidth="2" fill="none">
        <path d="M 0 120 C 200 110, 500 130, 760 100" />
        <path d="M 0 260 C 180 250, 420 270, 760 250" />
        <path d="M 120 0 C 130 150, 100 300, 130 420" />
        <path d="M 430 0 C 420 90, 450 160, 420 420" />
        <path d="M 600 0 C 610 120, 580 240, 620 420" />
      </g>

      {/* River, flowing from the west edge down into the harbor. */}
      <path
        d="M -10 235 C 120 265, 180 305, 250 335 C 330 365, 480 345, 560 322
           C 610 308, 650 302, 780 312"
        stroke="var(--map-water)"
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Harbor: the river mouth widening into a bay at the corner. */}
      <ellipse cx="690" cy="325" rx="150" ry="110" fill="var(--map-water)" opacity="0.5" />

      {/* North Quarter park. */}
      <ellipse cx="330" cy="65" rx="100" ry="52" fill="var(--map-park)" opacity="0.7" />

      {/* Old City — a rounded historic core, distinct from the street grid. */}
      <circle
        cx="430"
        cy="195"
        r="78"
        fill="var(--map-old-city)"
        stroke="var(--map-old-city-line)"
        strokeWidth="2"
        opacity="0.85"
      />

      {/* Market Lane's plaza. */}
      <rect
        x="118"
        y="168"
        width="74"
        height="58"
        rx="6"
        fill="var(--map-plaza)"
        stroke="var(--border)"
        strokeWidth="1"
      />

      {/* District labels — the map's captions, set in the data-furniture face. */}
      <g
        fill="var(--ink-muted)"
        fontSize="11"
        fontFamily="var(--font-mono)"
        letterSpacing="0.08em"
      >
        <text x="330" y="24" textAnchor="middle">
          NORTH QUARTER
        </text>
        <text x="430" y="290" textAnchor="middle">
          OLD CITY
        </text>
        <text x="155" y="155" textAnchor="middle">
          MARKET LANE
        </text>
        <text x="130" y="405" textAnchor="start">
          RIVERSIDE
        </text>
        <text x="700" y="405" textAnchor="end">
          HARBOR DISTRICT
        </text>
      </g>

      {/* Compass — a small, real cartographic convention that costs nothing
          and confirms the map is oriented, not just decorative. */}
      <g transform="translate(715, 34)" fill="var(--ink-muted)">
        <path d="M 0 -14 L 6 4 L 0 -1 L -6 4 Z" />
        <text x="0" y="20" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">
          N
        </text>
      </g>
    </svg>
  );
}

/**
 * The bit of the name worth putting on a pin. The district is already
 * captioned on the map itself, so repeating "— Old City" on every label would
 * just be the slowest way to say something the map already says; the unit
 * identifier alone ("Apt 3", "Loft 12") is what a manager actually scans for,
 * and it's short enough to hold to one line at any card width.
 */
function shortPropertyLabel(propertyName) {
  return propertyName.split(' — ')[0];
}

/** One property, as a real button positioned over the town illustration. */
function PropertyPin({ property, isHighlighted, onSelect }) {
  const dotPosition = toPercentPosition(property.mapPosition);
  const labelStyle = LABEL_ANCHOR_STYLES[property.mapLabelAnchor];

  return (
    <button
      type="button"
      onClick={() => onSelect(property.id)}
      aria-pressed={isHighlighted}
      title={property.name}
      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={dotPosition}
    >
      {/* The dot. A surface-coloured ring keeps it legible over any part of
          the illustration behind it, the same device used on chart markers. */}
      <span
        className={`block h-3.5 w-3.5 rounded-full ring-2 ring-[var(--surface)] transition-transform group-hover:scale-125 ${
          isHighlighted ? 'bg-[var(--accent)]' : 'bg-[var(--ink-muted)]'
        }`}
      />

      {/* The label. Always visible — five properties is few enough that
          direct-labelling all of them beats hover-only discovery. Kept to a
          narrow, short max-width so it holds one line and never needs to
          wrap into the multi-line overflow risk a full property name would. */}
      <span
        className="pointer-events-none absolute top-1/2 left-1/2 w-max max-w-[7rem] leading-tight whitespace-nowrap"
        style={labelStyle}
      >
        <span
          className={`block text-xs font-semibold ${
            isHighlighted ? 'text-[var(--accent-strong)]' : 'text-[var(--ink-primary)]'
          }`}
        >
          {shortPropertyLabel(property.name)}
        </span>
        <span className="block text-[11px] text-[var(--ink-muted)]">
          {formatRating(property.overallRating)}
        </span>
      </span>
    </button>
  );
}

export default function PortfolioMap({ properties, highlightedPropertyId, onSelectProperty }) {
  return (
    <Card>
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h3 className="text-sm font-semibold text-[var(--ink-primary)]">Portfolio map</h3>
        <p className="mt-1 text-xs text-[var(--ink-secondary)]">
          Click a property to filter the action items below to it.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* The aspect ratio lock described above — this is what keeps the
            percentage-positioned pins aligned with the SVG's own coordinates.
            This outer box is intentionally NOT clipped: only the decorative
            art beneath the pins is, so a label near an edge can spill into
            the card's padding instead of having its text cropped. */}
        <div className="relative aspect-[760/420] w-full">
          <div className="absolute inset-0 overflow-hidden rounded-lg bg-[var(--surface-subtle)]">
            <TownIllustration />
          </div>
          {properties.map((property) => (
            <PropertyPin
              key={property.id}
              property={property}
              isHighlighted={property.id === highlightedPropertyId}
              onSelect={onSelectProperty}
            />
          ))}
        </div>

        {/* Legend — the map's only two colour states, named directly rather
            than left for the reader to infer. */}
        <div className="mt-4 flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <span className="text-xs text-[var(--ink-secondary)]">Currently filtered</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink-muted)]" aria-hidden="true" />
            <span className="text-xs text-[var(--ink-secondary)]">Other properties</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

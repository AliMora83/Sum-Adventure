import { railPath, railPathLength, stations, formatElevation } from "@/data/stations";

/**
 * A small pill (rect + centred text), used for both the tick labels (quiet
 * state) and the marker's current-elevation readout (emphasised state).
 * Width is computed from the label so it fits without hand-tuned constants
 * per station.
 */
function ElevationPill({
  x,
  y,
  elevation,
  provisional,
  emphasis,
  className = "",
}: {
  x: number;
  y: number;
  elevation: number | null;
  provisional?: boolean;
  emphasis?: boolean;
  className?: string;
}) {
  const label = formatElevation(elevation) + (provisional ? " prov." : "");
  const width = Math.round(label.length * 6.6 + 16);
  // Quiet chip is the dark surface; the emphasised one steps up to teal-deep
  // so the current station reads as active. Both carry their own opaque fill,
  // which is what keeps the digits legible over light AND dark sections —
  // white on teal-deep is 6.78, teal-light on surface-dark is 6.81.
  const fillCls = emphasis ? "fill-teal-deep" : "fill-surface-dark";
  const textCls = emphasis ? "fill-white" : "fill-teal-light";
  const borderCls = provisional
    ? emphasis
      ? "stroke-white"
      : "stroke-teal"
    : emphasis
      ? "stroke-white/25"
      : "stroke-teal-light/25";

  return (
    <g transform={`translate(${x} ${y})`} className={className}>
      <rect
        x="0"
        y="-8"
        width={width}
        height="16"
        rx="8"
        className={`${fillCls} ${borderCls}`}
        strokeWidth="1"
        strokeDasharray={provisional ? "3 2" : undefined}
      />
      <text
        x={width / 2}
        y="4"
        textAnchor="middle"
        className={`font-mono text-[11px] font-medium [font-variant-numeric:tabular-nums] ${textCls}`}
      >
        {label}
      </text>
    </g>
  );
}

/**
 * The signature element: a route profile, not a vertical scale.
 * Rightward deviation means higher. Read as a journey, which is why
 * ascending while scrolling down is legible.
 *
 * The marker DOT rides the actual path via offset-path rather than a faked
 * vertical translate, so it tracks the profile's kinks — pure motion, no
 * data attached. Desktop only — on mobile this collapses to ScrollProgress
 * and the per-section chips.
 *
 * The elevation READOUT is deliberately a separate concern from the dot's
 * path position. Each station gets its own pill, pre-rendered with its real
 * data/stations.ts value, anchored at that station's own fixed tick
 * coordinate (not travelling with the dot) and faded in/out by a named CSS
 * view-timeline tied to that station's actual section being on screen (see
 * .anim-station-* in globals.css). Earlier draft had the pills travel with
 * the dot instead; that broke because the path's segment lengths don't
 * match the sections' actual rendered heights, so the dot's position and
 * "which section is really on screen" drift apart — a correct pill could
 * end up rendered next to the wrong tick. Anchoring to the tick coordinate
 * sidesteps that: the pill for a station always appears exactly where that
 * station's tick already is, correct by construction.
 */
export function AltitudeRail() {
  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-50 hidden w-rail items-center lg:flex"
    >
      <svg viewBox="0 0 132 600" fill="none" className="h-[600px] w-rail overflow-visible">
        <text
          x="20"
          y="34"
          className="fill-teal font-mono text-[9px] tracking-[0.18em] opacity-55"
        >
          ROUTE PROFILE
        </text>

        <path
          d={railPath}
          className="stroke-teal opacity-40"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <path
          d={railPath}
          className="anim-rail-draw stroke-teal"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={railPathLength}
          strokeDashoffset={railPathLength}
        />

        {stations.map((s) => (
          <g key={s.id}>
            <circle cx={s.railX} cy={s.railY} r="2" className="fill-teal opacity-70" />
            {/* Quiet state: always visible, low-emphasis pill so the digits
                hold their own contrast ratio regardless of what section
                background is behind the rail at this point. */}
            <ElevationPill
              x={s.railX + 14}
              y={s.railY}
              elevation={s.elevation}
              provisional={s.provisional}
            />
            {/* Emphasised state: the current station only, overlaid on
                top of the quiet pill at the identical position/size. */}
            <ElevationPill
              x={s.railX + 14}
              y={s.railY}
              elevation={s.elevation}
              provisional={s.provisional}
              emphasis
              className={`anim-station-${s.id}`}
            />
          </g>
        ))}

        <circle
          r="5"
          className="anim-rail-marker fill-teal"
          style={
            {
              offsetPath: `path('${railPath}')`,
              offsetRotate: "0deg",
            } as React.CSSProperties
          }
        />
      </svg>
    </aside>
  );
}

/** Mobile stand-in for the rail. */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="anim-progress fixed inset-x-0 top-[74px] z-40 h-0.5 origin-left scale-x-0 bg-teal sm:top-[88px] lg:hidden"
    />
  );
}

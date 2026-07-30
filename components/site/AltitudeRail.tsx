import { railPath, railPathLength, stations, formatElevation } from "@/data/stations";

/**
 * The signature element: a route profile, not a vertical scale.
 * Rightward deviation means higher. Read as a journey, which is why
 * ascending while scrolling down is legible.
 *
 * The marker rides the actual path via offset-path rather than a faked
 * vertical translate, so it tracks the profile's kinks. Desktop only —
 * on mobile this collapses to ScrollProgress and the per-section chips.
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
          className="fill-contour font-mono text-[9px] tracking-[0.18em] opacity-55"
        >
          ROUTE PROFILE
        </text>

        <path
          d={railPath}
          className="stroke-contour opacity-30"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <path
          d={railPath}
          className="anim-rail-draw stroke-contour"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={railPathLength}
          strokeDashoffset={railPathLength}
        />

        {stations.map((s) => (
          <g key={s.id}>
            <circle cx={s.railX} cy={s.railY} r="2" className="fill-contour opacity-50" />
            <text
              x={s.railX + 14}
              y={s.railY + 4}
              className="fill-contour font-mono text-[11px] font-medium opacity-75 [font-variant-numeric:tabular-nums]"
            >
              {s.elevation === null ? "tbc" : formatElevation(s.elevation)}
            </text>
          </g>
        ))}

        <circle
          r="5"
          className="anim-rail-marker fill-minowane"
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
      className="anim-progress fixed inset-x-0 top-[70px] z-40 h-0.5 origin-left scale-x-0 bg-minowane lg:hidden"
    />
  );
}

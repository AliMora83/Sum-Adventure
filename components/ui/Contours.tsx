/**
 * Topographic contour hairlines. Two layers drifting at different rates
 * is the parallax. Kept at 5-10% opacity and never placed over a
 * photo's focal area — this is the element most likely to become noise.
 */
export function Contours({ depth }: { depth: "near" | "far" }) {
  const near = depth === "near";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-x-[5%] -inset-y-[10%] overflow-hidden text-mahlasela ${
        near ? "anim-drift-near" : "anim-drift-far"
      }`}
    >
      <svg
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        className={`block h-full w-[120%] ${near ? "opacity-10" : "opacity-[0.055]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        {near ? (
          <>
            <path d="M0 120 Q 300 60 600 126 T 1200 116 T 1440 130" />
            <path d="M0 230 Q 280 168 560 236 T 1160 224 T 1440 240" />
            <path d="M0 348 Q 310 284 620 354 T 1240 342 T 1440 358" />
          </>
        ) : (
          <>
            <path d="M0 90 Q 260 48 520 92 T 1000 86 T 1440 96" />
            <path d="M0 200 Q 240 156 480 202 T 960 194 T 1440 206" />
            <path d="M0 320 Q 270 274 540 322 T 1040 314 T 1440 326" />
            <path d="M0 430 Q 250 386 500 432 T 980 424 T 1440 436" />
          </>
        )}
      </svg>
    </div>
  );
}

import { formatElevation } from "@/data/stations";

/**
 * The altitude chip that heads every section. This is the structural
 * device of the whole design — it encodes real elevation, not a
 * decorative step number.
 */
export function Station({
  elevation,
  place,
  tone = "dark",
  className = "",
}: {
  elevation: number | null;
  place: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const toneCls = tone === "dark" ? "text-mahlasela" : "text-contour";
  return (
    <p
      className={`flex items-center gap-4 font-mono text-xs font-medium uppercase tracking-[0.16em] [font-variant-numeric:tabular-nums] ${toneCls} ${className}`}
    >
      <b className="font-medium text-minowane">{formatElevation(elevation)}</b>
      <span className="h-px w-full max-w-[120px] flex-1 bg-current opacity-30" />
      {place}
    </p>
  );
}

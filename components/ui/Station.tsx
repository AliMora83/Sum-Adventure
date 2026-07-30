import { formatElevation } from "@/data/stations";

/**
 * The altitude chip that heads every section. This is the structural
 * device of the whole design — it encodes real elevation, not a
 * decorative step number.
 *
 * `provisional` marks a fenced, temporary exception to "never invent a
 * number" (see CLAUDE.md) — a dashed border and a "prov." suffix, so it
 * can never be mistaken for a confirmed value.
 */
export function Station({
  elevation,
  place,
  tone = "dark",
  provisional = false,
  className = "",
}: {
  elevation: number | null;
  place: string;
  tone?: "dark" | "light";
  provisional?: boolean;
  className?: string;
}) {
  const toneCls = tone === "dark" ? "text-mahlasela" : "text-contour";
  return (
    <p
      className={`flex items-center gap-4 font-mono text-xs font-medium uppercase tracking-[0.16em] [font-variant-numeric:tabular-nums] ${toneCls} ${className}`}
    >
      <b
        className={
          provisional
            ? "rounded-full border border-dashed border-minowane px-2 py-0.5 font-medium text-minowane"
            : "font-medium text-minowane"
        }
      >
        {formatElevation(elevation)}
        {provisional && <span className="opacity-70"> prov.</span>}
      </b>
      <span className="h-px w-full max-w-[120px] flex-1 bg-current opacity-30" />
      {place}
    </p>
  );
}

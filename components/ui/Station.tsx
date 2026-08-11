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
  const toneCls = tone === "dark" ? "text-teal-light" : "text-teal-deep";
  /**
   * The elevation figure follows `tone`, and it has to. Gold is 7.12 on
   * surface-dark but 1.94 on the ice page background — it fails every text
   * threshold on a light surface, including the 3.0 for large type. So gold
   * is the dark-surface figure only; light surfaces get teal-deep (6.16 on
   * ice). One token for both would fail half the sections.
   */
  const figureCls = tone === "dark" ? "text-gold" : "text-teal-deep";
  const figureBorder = tone === "dark" ? "border-gold" : "border-teal-deep";
  return (
    <p
      className={`flex items-center gap-4 font-mono text-xs font-medium uppercase tracking-[0.16em] [font-variant-numeric:tabular-nums] ${toneCls} ${className}`}
    >
      <b
        className={
          provisional
            ? `rounded-sm border border-dashed ${figureBorder} px-2 py-0.5 font-medium ${figureCls}`
            : `font-medium ${figureCls}`
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

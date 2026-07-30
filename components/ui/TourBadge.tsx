import type { Tour } from "@/data/tours";

/**
 * A past tour outranks flagship — status is the more important signal to a
 * customer, and no tour is both. Returns null when neither applies.
 */
export function TourBadge({
  tour,
  className = "",
}: {
  tour: Pick<Tour, "status" | "flagship">;
  className?: string;
}) {
  if (tour.status === "past") {
    return (
      <span
        className={`bg-[#5B6C90] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white ${className}`}
      >
        Past trip
      </span>
    );
  }
  if (tour.flagship) {
    return (
      <span
        className={`bg-minowane-deep px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white ${className}`}
      >
        Flagship
      </span>
    );
  }
  return null;
}

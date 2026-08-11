import { type Tour, isPastTour, PAST_TOUR_LABEL } from "@/data/tours";

/**
 * A past tour outranks flagship — status is the more important signal to a
 * customer, and no tour is both. Returns null when neither applies.
 *
 * The predicate and the label come from `data/tours.ts` so this badge and the
 * metadata description in `/tours/[slug]` cannot disagree about what "past"
 * means or what it is called.
 */
export function TourBadge({
  tour,
  className = "",
}: {
  tour: Pick<Tour, "status" | "flagship">;
  className?: string;
}) {
  if (isPastTour(tour)) {
    return (
      <span
        className={`bg-[#586A67] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white ${className}`}
      >
        {PAST_TOUR_LABEL}
      </span>
    );
  }
  if (tour.flagship) {
    return (
      <span
        className={`bg-surface-dark px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white ${className}`}
      >
        Flagship
      </span>
    );
  }
  return null;
}

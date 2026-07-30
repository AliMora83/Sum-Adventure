import Image from "next/image";
import { Station } from "@/components/ui/Station";
import { TourBadge } from "@/components/ui/TourBadge";
import { tours, formatPrice } from "@/data/tours";
import { tourEnquiryLink } from "@/lib/whatsapp";
import { stations, formatElevation } from "@/data/stations";

export function TourGrid() {
  const s = stations[3];
  // Past tours never appear in the featured homepage grid — see /tours
  // for the separate "past trips" section.
  const liveTours = tours.filter((t) => t.status !== "past");
  return (
    <section id="tours" className="relative bg-snowline py-26">
      <div className="mx-auto max-w-[1180px] px-7 lg:pl-[152px]">
        <div className="reveal">
          <Station elevation={s.elevation} place={s.place} tone="light" />
          <h2 className="type-display mt-5 max-w-[24ch] text-[clamp(28px,4vw,46px)] text-senqu">
            Highest road pass in Southern Africa
          </h2>
        </div>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveTours.map((tour) => (
            <article
              key={tour.slug}
              className="reveal group flex flex-col border border-contour/20 bg-white transition-transform duration-200 ease-alt hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-contour to-senqu">
                <Image
                  src={tour.image}
                  alt={tour.imageAlt}
                  fill
                  sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
                <TourBadge tour={tour} className="absolute left-3.5 top-3.5" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-contour [font-variant-numeric:tabular-nums]">
                  {formatElevation(tour.elevation)} · {tour.place}
                </p>
                <h3 className="type-display mt-2 text-xl text-senqu">{tour.name}</h3>
                <p className="mt-2.5 flex-1 text-[14.5px] text-[#33456B]">{tour.blurb}</p>

                <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-contour/25 pt-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6C90]">
                      From
                    </span>
                    <b className="type-data text-xl text-minowane-deep">
                      {formatPrice(tour.priceFrom)}
                    </b>
                    <span className="ml-1 font-mono text-[11px] text-[#5B6C90]">pp</span>
                  </div>
                  <a
                    href={tourEnquiryLink(tour)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-senqu underline-offset-4 hover:text-minowane-deep hover:underline"
                  >
                    Enquire →
                  </a>
                </div>
                {tour.minPax && (
                  <p className="mt-2.5 font-mono text-[10.5px] tracking-[0.06em] text-[#5B6C90]">
                    Minimum {tour.minPax} people
                  </p>
                )}
                {tour.priceNote && (
                  <p className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-[#5B6C90]">
                    {tour.priceNote}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

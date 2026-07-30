import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Station } from "@/components/ui/Station";
import { stations, formatElevation } from "@/data/stations";
import { tours, formatPrice } from "@/data/tours";
import { tourEnquiryLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tours & Packages — Sum Adventures",
  description:
    "Guided adventure tours across Lesotho: Afriski winter trips, Tsikoane plateau camping and multi-day packages, run out of Hlotse, Leribe.",
};

export default function ToursIndexPage() {
  const s = stations[3];
  return (
    <section className="relative bg-snowline pb-26 pt-[140px]">
      <div className="mx-auto max-w-[1180px] px-7 lg:pl-[152px]">
        <Station elevation={s.elevation} place={s.place} tone="light" />
        <h1 className="type-display mt-5 max-w-[24ch] text-[clamp(30px,4vw,46px)] text-senqu">
          Tours &amp; packages
        </h1>
        <p className="mt-5 max-w-[54ch] text-[16.5px] text-[#33456B]">
          Every trip Sum Adventures runs, from a day at Afriski to a full weekend on the
          Tsikoane plateau. Prices are per person, from the client&rsquo;s own price list.
        </p>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <article
              key={tour.slug}
              className="group flex flex-col border border-contour/20 bg-white transition-transform duration-200 ease-alt hover:-translate-y-1"
            >
              <Link href={`/tours/${tour.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-contour to-senqu">
                  <Image
                    src={tour.image}
                    alt={tour.imageAlt}
                    fill
                    sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {tour.flagship && (
                    <span className="absolute left-3.5 top-3.5 bg-minowane-deep px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                      Flagship
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 pb-4">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-contour [font-variant-numeric:tabular-nums]">
                    {formatElevation(tour.elevation)} · {tour.place}
                  </p>
                  <h2 className="type-display mt-2 text-xl text-senqu group-hover:text-minowane-deep">
                    {tour.name}
                  </h2>
                  <p className="mt-2.5 flex-1 text-[14.5px] text-[#33456B]">{tour.blurb}</p>
                </div>
              </Link>

              <div className="flex flex-col gap-2.5 px-6 pb-6">
                <div className="flex items-end justify-between gap-4 border-t border-dashed border-contour/25 pt-4">
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
                  <p className="font-mono text-[10.5px] tracking-[0.06em] text-[#5B6C90]">
                    Minimum {tour.minPax} people
                  </p>
                )}
                {tour.priceNote && (
                  <p className="font-mono text-[10.5px] tracking-[0.06em] text-[#5B6C90]">
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

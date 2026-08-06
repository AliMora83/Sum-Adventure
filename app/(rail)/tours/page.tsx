import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Station } from "@/components/ui/Station";
import { TourBadge } from "@/components/ui/TourBadge";
import { stations, formatElevation } from "@/data/stations";
import { tours, formatPrice, isPastTour } from "@/data/tours";
import { tourEnquiryLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/site";

const flagshipTour = tours.find((t) => t.flagship);

export const metadata: Metadata = buildMetadata({
  title: "Tours & Packages",
  description:
    "Guided adventure tours across Lesotho: Afriski winter trips, Tsikoane plateau camping and multi-day packages.",
  path: "/tours",
  image: flagshipTour?.image,
  imageAlt: flagshipTour?.imageAlt,
});

export default function ToursIndexPage() {
  const s = stations[3];
  const liveTours = tours.filter((t) => !isPastTour(t));
  const pastTours = tours.filter((t) => isPastTour(t));

  return (
    <section className="relative bg-ice pb-26 pt-[140px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Station elevation={s.elevation} place={s.place} tone="light" />
        <h1 className="type-display mt-5 max-w-[24ch] text-[clamp(30px,4vw,46px)] text-surface-dark">
          Tours &amp; packages
        </h1>
        <p className="mt-5 max-w-[54ch] text-[16.5px] text-[#2F3E3C]">
          Every trip Sum Adventures runs, from a day at Afriski to a full weekend on the
          Tsikoane plateau. Prices are per person, from the client&rsquo;s own price list.
        </p>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveTours.map((tour) => (
            <article
              key={tour.slug}
              className="group flex flex-col border border-teal-deep/20 bg-white rounded-md overflow-hidden transition-transform duration-200 ease-alt hover:-translate-y-1"
            >
              <Link href={`/tours/${tour.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-md bg-gradient-to-br from-teal-deep to-surface-dark">
                  <Image
                    src={tour.image}
                    alt={tour.imageAlt}
                    fill
                    sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <TourBadge tour={tour} className="absolute left-3.5 top-3.5" />
                </div>
                <div className="flex flex-1 flex-col p-6 pb-4">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal-deep [font-variant-numeric:tabular-nums]">
                    {formatElevation(tour.elevation)} · {tour.place}
                  </p>
                  <h2 className="type-display mt-2 text-xl text-surface-dark group-hover:text-teal-deep">
                    {tour.name}
                  </h2>
                  <p className="mt-2.5 flex-1 text-[14.5px] text-[#2F3E3C]">{tour.blurb}</p>
                </div>
              </Link>

              <div className="flex flex-col gap-2.5 px-6 pb-6">
                <div className="flex items-end justify-between gap-4 border-t border-dashed border-teal-deep/25 pt-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#586A67]">
                      From
                    </span>
                    <b className="type-data text-xl text-teal-deep">
                      {formatPrice(tour.priceFrom)}
                    </b>
                    <span className="ml-1 font-mono text-[11px] text-[#586A67]">pp</span>
                  </div>
                  <a
                    href={tourEnquiryLink(tour)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-surface-dark underline-offset-4 hover:text-teal-deep hover:underline"
                  >
                    Enquire →
                  </a>
                </div>
                {tour.minPax && (
                  <p className="font-mono text-[10.5px] tracking-[0.06em] text-[#586A67]">
                    Minimum {tour.minPax} people
                  </p>
                )}
                {tour.priceNote && (
                  <p className="font-mono text-[10.5px] tracking-[0.06em] text-[#586A67]">
                    {tour.priceNote}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {pastTours.length > 0 && (
          <div className="mt-20 border-t border-teal-deep/20 pt-13">
            <h2 className="type-display text-2xl text-surface-dark">Past trips</h2>
            <p className="mt-3 max-w-[54ch] text-[14.5px] text-[#586A67]">
              These have already run. Ask us if there&rsquo;s a next date.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastTours.map((tour) => (
                <article
                  key={tour.slug}
                  className="flex flex-col border border-teal-deep/20 bg-white rounded-md overflow-hidden"
                >
                  <Link href={`/tours/${tour.slug}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-md bg-gradient-to-br from-teal-deep to-surface-dark">
                      <Image
                        src={tour.image}
                        alt={tour.imageAlt}
                        fill
                        sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <TourBadge tour={tour} className="absolute left-3.5 top-3.5" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 pb-4">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal-deep [font-variant-numeric:tabular-nums]">
                        {formatElevation(tour.elevation)} · {tour.place}
                      </p>
                      <h3 className="type-display mt-2 text-xl text-surface-dark">{tour.name}</h3>
                      <p className="mt-2.5 flex-1 text-[14.5px] text-[#2F3E3C]">{tour.blurb}</p>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2.5 px-6 pb-6">
                    <div className="border-t border-dashed border-teal-deep/25 pt-4">
                      <p className="font-mono text-[12.5px] text-[#586A67]">
                        Ran for {formatPrice(tour.priceFrom)} pp
                      </p>
                      {tour.priceNote && (
                        <p className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-[#586A67]">
                          {tour.priceNote}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/contact?tour=${tour.slug}`}
                      className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-surface-dark underline-offset-4 hover:text-teal-deep hover:underline"
                    >
                      Ask when this runs again →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

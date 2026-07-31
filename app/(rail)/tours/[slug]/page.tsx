import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Station } from "@/components/ui/Station";
import { Contours } from "@/components/ui/Contours";
import { Button } from "@/components/ui/Button";
import { TourBadge } from "@/components/ui/TourBadge";
import { tours, formatPrice, tourDescription } from "@/data/tours";
import { tourEnquiryLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return {};

  return buildMetadata({
    // Title is unchanged for past tours — the status belongs in the
    // description, which is the part that travels into a search snippet.
    title: tour.name,
    description: tourDescription(tour),
    path: `/tours/${tour.slug}`,
    image: tour.image,
    imageAlt: tour.imageAlt,
  });
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  return (
    <>
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-senqu text-white">
        <div className="absolute inset-0">
          <Image
            src={tour.image}
            alt={tour.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Contours depth="far" />
        <div className="absolute inset-0 bg-gradient-to-b from-senqu/60 via-senqu/30 to-senqu/95" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-7 pb-16 pt-36 lg:pl-[152px]">
          <Link
            href="/tours"
            className="block font-mono text-xs uppercase tracking-[0.14em] text-mahlasela hover:text-minowane"
          >
            ← All tours
          </Link>

          <TourBadge tour={tour} className="mt-5 inline-block" />

          <Station
            elevation={tour.elevation}
            place={tour.place}
            className={tour.flagship || tour.status === "past" ? "mt-4" : "mt-6"}
          />
          <h1 className="type-display mt-4 text-[clamp(34px,6vw,64px)]">{tour.name}</h1>
          <p className="mt-5 max-w-[52ch] text-[16.5px] text-[#dce9f6]">{tour.blurb}</p>
        </div>
      </section>

      <section className="relative bg-snowline py-26">
        <div className="mx-auto max-w-[1180px] px-7 lg:pl-[152px]">
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="type-display text-2xl text-senqu">What&rsquo;s included</h2>
              <ul className="mt-5 space-y-3">
                {tour.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 border-b border-contour/20 pb-3 text-[15px] text-[#33456B]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-minowane" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {tour.status === "past" ? (
              <div className="h-fit border border-contour/20 bg-white p-8">
                <div className="type-data text-[clamp(28px,3.4vw,36px)] leading-none tracking-tight text-[#5B6C90]">
                  Ran for {formatPrice(tour.priceFrom)}
                </div>
                <div className="mt-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-[#5B6C90]">
                  per person · {tour.duration}
                </div>
                {tour.priceNote && (
                  <p className="mt-2 font-mono text-[11.5px] tracking-[0.03em] text-[#5B6C90]">
                    {tour.priceNote}
                  </p>
                )}
                <p className="mt-5 text-[14px] leading-relaxed text-[#33456B]">
                  This trip has already run.
                </p>
                <Button
                  href={`/contact?tour=${tour.slug}`}
                  variant="dark"
                  className="mt-4 w-full justify-center"
                >
                  Ask when it&rsquo;s back
                </Button>
              </div>
            ) : (
              <div className="h-fit border border-contour/20 bg-white p-8">
                <div className="type-data text-[clamp(34px,4vw,48px)] leading-none tracking-tight text-minowane-deep">
                  {formatPrice(tour.priceFrom)}
                </div>
                <div className="mt-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-[#5B6C90]">
                  per person · {tour.duration}
                </div>
                {tour.priceNote && (
                  <p className="mt-2 font-mono text-[11.5px] tracking-[0.03em] text-[#5B6C90]">
                    {tour.priceNote}
                  </p>
                )}
                {tour.minPax && (
                  <p className="mt-2 font-mono text-[11.5px] tracking-[0.03em] text-[#5B6C90]">
                    Minimum {tour.minPax} people
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <Button href={tourEnquiryLink(tour)} external className="justify-center">
                    Enquire on WhatsApp
                  </Button>
                  <Button
                    href={`/contact?tour=${tour.slug}`}
                    variant="dark"
                    className="justify-center"
                  >
                    Use the enquiry form
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

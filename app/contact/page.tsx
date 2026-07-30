import type { Metadata } from "next";
import { Station } from "@/components/ui/Station";
import { stations } from "@/data/stations";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire — Sum Adventures",
  description:
    "Send Sum Adventures an enquiry for a tour, event or photography booking in Lesotho.",
};

type Props = {
  searchParams: Promise<{ tour?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { tour } = await searchParams;
  const s = stations[4];

  return (
    <section className="relative bg-snowline pb-26 pt-[140px]">
      <div className="mx-auto max-w-[820px] px-7 lg:pl-[152px]">
        <Station elevation={s.elevation} place={s.place} tone="light" />
        <h1 className="type-display mt-5 max-w-[20ch] text-[clamp(30px,4vw,46px)] text-senqu">
          Send an enquiry
        </h1>
        <p className="mt-5 max-w-[54ch] text-[16.5px] text-[#33456B]">
          Tell us what you have in mind and we&rsquo;ll get back to you. For a faster
          reply, WhatsApp usually beats email for this audience.
        </p>

        <EnquiryForm defaultTourSlug={tour} />
      </div>
    </section>
  );
}

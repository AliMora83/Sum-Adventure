import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Enquire",
  description:
    "Send Sum Adventures an enquiry about a tour, event or photography booking in Lesotho — by form or on WhatsApp.",
  path: "/contact",
});

type Props = {
  searchParams: Promise<{ tour?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { tour } = await searchParams;

  return (
    <section className="relative bg-ice pb-26 pt-[140px]">
      {/* Plain centred container: equal `px-7` both sides, no rail gutter.
          The altitude rail is the homepage's alone, so there is nothing on
          this side of the viewport to clear — see (rail)/page.tsx. */}
      <div className="mx-auto max-w-[820px] px-7">
        {/* No <Station> eyebrow. Contact is a transactional page, not a stop
            on the elevation narrative — the summit figure above the form was
            decoration here. The heading leads. */}
        <h1 className="type-display max-w-[20ch] text-[clamp(30px,4vw,46px)] text-surface-dark">
          Send an enquiry
        </h1>
        <p className="mt-5 max-w-[54ch] text-[16.5px] text-[#2F3E3C]">
          Tell us what you have in mind and we&rsquo;ll get back to you. For a faster
          reply, WhatsApp usually beats email for this audience.
        </p>

        <EnquiryForm defaultTourSlug={tour} />
      </div>
    </section>
  );
}

import Image from "next/image";
import { Station } from "@/components/ui/Station";
import { Contours } from "@/components/ui/Contours";
import { Button } from "@/components/ui/Button";
import { stations } from "@/data/stations";
import { generalEnquiryLink } from "@/lib/whatsapp";

export function Hero() {
  const s = stations[0];
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-senqu text-white">
      <div className="anim-hero-media absolute inset-0 origin-[center_40%] bg-gradient-to-b from-[#2C5794] via-maloti to-senqu">
        <Image
          src="/images/skii-1.jpg"
          alt="Snow-covered peaks of the Maloti mountains, Lesotho"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_32%]"
        />
      </div>

      <Contours depth="far" />
      <Contours depth="near" />

      <div className="absolute inset-0 bg-gradient-to-b from-senqu/60 via-senqu/30 to-senqu/95" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-7 pb-24 pt-36 lg:pl-[152px]">
        <Station elevation={s.elevation} place={s.place} />
        <h1 className="type-display mt-4 text-[clamp(44px,8.4vw,104px)] [text-shadow:0_2px_30px_rgba(10,27,61,0.45)]">
          More than
          <br />
          <em className="not-italic text-mahlasela">just a</em> trip
        </h1>
        <p className="mt-6 max-w-[52ch] text-[clamp(16px,1.5vw,18.5px)] text-[#dce9f6]">
          Adventure tours, cultural experiences and unforgettable stories across the
          Mountain Kingdom — guided by people who know every pass, cave and footprint.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#tours">Explore tours</Button>
          <Button href={generalEnquiryLink} variant="line" external>
            WhatsApp us
          </Button>
        </div>
        <p className="mt-13 max-w-[46ch] border-t border-mahlasela/20 pt-5 font-mono text-[12.5px] leading-relaxed text-mahlasela [font-variant-numeric:tabular-nums]">
          Lesotho&rsquo;s <b className="font-medium text-white">lowest</b> point sits at
          1,400 m — higher than the summit of Ben Nevis.
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const nav = [
  { href: "/about", label: "About" },
  { href: "/#tsikoane", label: "Tsikoane" },
  { href: "/tours", label: "Tours" },
];

export function Masthead() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-mahlasela/15 bg-senqu/80 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between gap-5 px-7 lg:pl-[152px]">
        <Link href="/" className="flex items-center gap-3">
          {/* Supplied PNGs had white backgrounds; these are knocked out.
              Still need a proper .svg and a white variant from the client. */}
          <Image
            src="/images/sumadv-icon.png"
            alt="Sum Adventures"
            width={252}
            height={280}
            className="h-[38px] w-auto"
            priority
          />
          <span className="text-base uppercase leading-none tracking-[0.1em] text-white [font-variation-settings:'wdth'_112,'wght'_800]">
            Sum Adventures
            <span className="mt-1.5 block font-mono text-[8.5px] font-normal tracking-[0.2em] text-mahlasela">
              More than just a trip
            </span>
          </span>
        </Link>

        <nav className="hidden gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[12.5px] uppercase tracking-[0.1em] text-[#cfe0f2] transition-colors duration-200 hover:text-minowane [font-variation-settings:'wdth'_100,'wght'_600]"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Button href="/contact" className="px-5 py-3 text-[11.5px]">
          Enquire
        </Button>
      </div>
    </header>
  );
}

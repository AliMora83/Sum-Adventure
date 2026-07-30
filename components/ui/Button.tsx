import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "line" | "dark";

const variants: Record<Variant, string> = {
  // minowane-deep only — the lighter orange fails AA behind 13px white text
  primary: "bg-minowane-deep text-white hover:bg-minowane",
  line: "text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]",
  dark: "bg-senqu text-white hover:bg-maloti",
};

export function Button({
  href,
  variant = "primary",
  external,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-sm px-7 py-4 text-[13px] uppercase tracking-[0.1em] transition-transform duration-200 ease-alt hover:-translate-y-0.5 [font-variation-settings:'wdth'_100,'wght'_700]";
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import { archivo, plexMono } from "@/lib/fonts";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";
import { AltitudeRail, ScrollProgress } from "@/components/site/AltitudeRail";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sum Adventures — More Than Just A Trip",
  description:
    "Adventure tours, photography and events across Lesotho and Southern Africa. Tsikoane plateau camping, Afriski winter trips and educational tours, run out of Hlotse, Leribe.",
  openGraph: {
    title: "Sum Adventures — More Than Just A Trip",
    description:
      "Adventure tours, photography and events across Lesotho and Southern Africa.",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <Masthead />
        <ScrollProgress />
        <AltitudeRail />
        <main>{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}

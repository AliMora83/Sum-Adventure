import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Two families only. Archivo carries display AND body — display is the same
 * family at wdth 125 / wght 900, which is why we load the wdth axis.
 * Plex Mono carries every number on the site: altitudes, prices, durations.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

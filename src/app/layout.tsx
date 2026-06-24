import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { profile } from "@/data/profile";

// Fonts are SELF-HOSTED (woff2 committed under ./fonts, Geist via the official
// `geist` package). next/font/google fetches font files from Google at BUILD
// time, and that fetch intermittently fails on CI — it once broke a production
// deploy ("Failed to fetch `Geist` from Google Fonts"). Self-hosting makes the
// build deterministic: no network dependency. Variable names are unchanged, so
// globals.css (--font-instrument-serif / --font-geist-sans / --font-jetbrains-mono)
// keeps working as-is.

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  src: [
    { path: "./fonts/instrument-serif-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
});

const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  // Variable font: the single file covers the full weight axis.
  src: [{ path: "./fonts/jetbrains-mono-variable.woff2", weight: "100 800", style: "normal" }],
  display: "swap",
});

const SITE_URL = "https://mosaad-portfolio-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  authors: [{ name: profile.fullName }],
  keywords: [
    "Ahmed Mosaad",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "GSAP",
    "Three.js",
    "Portfolio",
    "Alexandria",
    "Egypt",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: `${profile.name} · Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

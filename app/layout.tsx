import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { profile } from "@/lib/content";
import "./globals.css";

// Display: an elegant, condensed editorial serif (one weight, plus its true italic).
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// Text: a clear, slightly characterful grotesque (variable weight).
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

// Annotations: technical labels and indexes.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  title,
  description: profile.siteDescription,
  authors: [{ name: profile.name, url: profile.linkedin }],
  openGraph: {
    title,
    description: profile.siteDescription,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description: profile.siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1ea",
  colorScheme: "light",
};

/** If JavaScript is unavailable, undo the hidden "before animation" styles so nothing stays invisible. */
const NOSCRIPT_CSS = `
[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important}
[style*="translateY"],[style*="translate("]{transform:none!important}
[style*="background-size"]{background-size:100% 42%!important}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

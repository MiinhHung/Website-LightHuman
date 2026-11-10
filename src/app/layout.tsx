import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono, Merriweather } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Be Vietnam Pro (drawn for Vietnamese diacritics) for text and headings; Merriweather only for quotes.
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin", "vietnamese"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "vi_VN", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#14285a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      data-theme="lighthuman"
      data-color-scheme="light"
      data-scroll-behavior="smooth"
      className={`${beVietnam.variable} ${merriweather.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

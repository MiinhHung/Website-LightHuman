import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Overlays } from "@/components/mk/Overlays";
import { Runtime, RuntimeChrome } from "@/components/mk/Runtime";
// Brand + feature stylesheets are pulled in by globals.css (legacy `lh` layer, mock `mk` layer).
import "./globals.css";

// Archivo with its width axis: the mock's display type is the wide cut (font-stretch 108–125%).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "vi_VN", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#0d1a3d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      data-theme="lighthuman"
      data-color-scheme="light"
      data-scroll-behavior="smooth"
      // `js` gates the mock's entrance states (clip reveals); Next always runs JS.
      className={`js ${archivo.variable} ${jetbrains.variable}`}
    >
      <body>
        <a className="skip" href="#noi-dung">
          Bỏ qua, tới nội dung chính
        </a>
        <Header />
        <main id="noi-dung">{children}</main>
        <Footer />
        <Overlays />
        <RuntimeChrome />
        <Runtime />
      </body>
    </html>
  );
}

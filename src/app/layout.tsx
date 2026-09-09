import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { WhatsappFab } from "@/components/ui/whatsapp-fab";
import { JsonLd } from "@/components/seo/json-ld";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "neurodiversidad",
    "autismo",
    "TEA",
    "TDAH",
    "Paraguay",
    "fundación",
    "inclusión",
    "ONG",
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PY",
    url: site.url,
    siteName: site.legalName,
    title: site.legalName,
    description: site.description,
    images: [
      {
        url: "/images/brand/og.jpg",
        width: 1200,
        height: 630,
        alt: site.legalName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
    images: ["/images/brand/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1524" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PY" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${fraunces.variable} antialiased`}>
        <JsonLd />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
          >
            Saltar al contenido
          </a>
          <LenisProvider>
            <ScrollProgress />
            <Navbar />
            <div id="top" />
            <main id="main">{children}</main>
            <Footer />
            <WhatsappFab />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

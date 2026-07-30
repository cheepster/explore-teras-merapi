import "./globals.css";
import { EB_Garamond, DM_Mono } from "next/font/google";
import WhatsAppFab from "./WhatsAppFab";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://terasmerapi.com";

const TITLE = "Teras Merapi · Desa Wisata Lereng Merapi";
const DESCRIPTION =
  "Eksplorasi harmoni alam, budaya, dan potensi warga di Teras Merapi, Sleman, Yogyakarta. Wisata alam, UMKM lokal, homestay, event budaya, dan lava tour jeep di lereng Gunung Merapi.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Teras Merapi",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Teras Merapi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/assets/hero-poster.webp", width: 1200, height: 630, alt: "Teras Merapi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/hero-poster.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`h-full scroll-smooth ${ebGaramond.variable} ${dmMono.variable}`}>
      <body className="min-h-full antialiased">
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
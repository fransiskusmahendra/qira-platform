import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { WebVitalsReporter } from "./_components/WebVitalsReporter";
import { FloatingWhatsApp } from "./_components/FloatingWhatsApp";
import { StickyMobileDock } from "./_components/StickyMobileDock";
import { LanguageProvider } from "../lib/i18n";
import "./styles.css";
import "./brand-logo.css";
import "./company.css";
import "./portfolio.css";
import "./conversion-v2.css";
import "./simplify-all.css";
import "./visual-home.css";
import "./services-page.css";
import "./quality.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const siteTitle = "QIRA - Solusi Digital Sederhana | Simple Digital Solutions";
const siteDescription = "QIRA membuat website, form, dashboard, dan otomatisasi agar usaha lebih mudah ditemukan dan dijalankan. Simple digital solutions for business.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA - Solusi digital sederhana untuk bisnis" };
const siteUrl = "https://www.qirasolution.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${siteUrl}/#organization`,
      name: "QIRA",
      legalName: "QIRA Digital Solutions",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon-512.png`, width: 512, height: 512 },
      image: `${siteUrl}/opengraph-image`,
      description: siteDescription,
      telephone: "+6285183042571",
      email: "hello@qirasolution.com",
      priceRange: "Rp1.500.000 - Rp7.500.000",
      areaServed: [
        { "@type": "Country", name: "Indonesia" },
        { "@type": "AdministrativeArea", name: "Worldwide" }
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+6285183042571",
        contactType: "customer service",
        availableLanguage: ["Indonesian", "English"]
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Layanan Solusi Digital QIRA",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Usaha & UMKM" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Otomatisasi Bisnis" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digitalisasi Administrasi & Form" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Alat Kerja Digital & Dashboard" } }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "QIRA",
      url: siteUrl,
      inLanguage: ["id-ID", "en-US"],
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#services`,
      name: "Layanan QIRA",
      itemListElement: ["Website", "Alat kerja digital", "Otomatisasi", "Pemetaan kebutuhan bisnis"].map((name) => ({
        "@type": "Service",
        name,
        provider: { "@id": `${siteUrl}/#organization` },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "QIRA",
  category: "business",
  manifest: "/manifest.webmanifest",
  title: { default: siteTitle, template: "%s | QIRA" },
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/qira-mark.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "QIRA",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071a33" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <LanguageProvider>
          <a className="skipLink" href="#main-content">
            Lewati ke konten utama
          </a>
          <WebVitalsReporter />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <FloatingWhatsApp />
          <StickyMobileDock />
        </LanguageProvider>
      </body>
    </html>
  );
}
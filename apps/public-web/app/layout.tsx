import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./styles.css";
import "./brand-logo.css";
import "./company.css";
import "./portfolio.css";
import "./conversion-v2.css";
import "./simplify-all.css";
import "./visual-home.css";
import "./services-page.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const siteTitle = "QIRA — Solusi Digital Sederhana";
const siteDescription = "QIRA membuat website, form, dashboard, dan otomatisasi agar usaha lebih mudah ditemukan dan dijalankan.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — solusi digital sederhana untuk bisnis" };
const siteUrl = "https://www.qirasolution.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "QIRA",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${siteUrl}/opengraph-image`,
      description: siteDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "QIRA",
      url: siteUrl,
      inLanguage: "id-ID",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#services`,
      name: "Layanan QIRA",
      itemListElement: [
        { "@type": "Service", name: "Website", provider: { "@id": `${siteUrl}/#organization` } },
        { "@type": "Service", name: "Alat kerja digital", provider: { "@id": `${siteUrl}/#organization` } },
        { "@type": "Service", name: "Otomatisasi", provider: { "@id": `${siteUrl}/#organization` } },
        { "@type": "Service", name: "Pemetaan kebutuhan bisnis", provider: { "@id": `${siteUrl}/#organization` } },
      ],
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
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: { title: siteTitle, description: siteDescription, url: "/", siteName: "QIRA", locale: "id_ID", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: ["/opengraph-image"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071a33" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id" className={`${geist.variable} ${geistMono.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}

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

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const siteTitle = "QIRA — Simple Digital Solutions";
const siteDescription = "QIRA membantu bisnis dan UMKM membangun website, aplikasi sederhana, automation, integrasi, dan workflow digital yang praktis serta mudah digunakan.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — Simple Digital Solutions" };
const siteUrl = "https://www.qirasolution.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "QIRA",
      legalName: "PT Rays Solusi Informasi",
      url: siteUrl,
      logo: `${siteUrl}/qira-mark.svg`,
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
        { "@type": "Service", name: "Business tools", provider: { "@id": `${siteUrl}/#organization` } },
        { "@type": "Service", name: "Automation", provider: { "@id": `${siteUrl}/#organization` } },
        { "@type": "Service", name: "Business Discovery", provider: { "@id": `${siteUrl}/#organization` } },
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "QIRA",
  title: { default: siteTitle, template: "%s | QIRA" },
  description: siteDescription,
  alternates: { canonical: "/" },
  icons: { icon: "/qira-mark.svg" },
  openGraph: { title: siteTitle, description: siteDescription, url: "/", siteName: "QIRA", locale: "id_ID", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: ["/opengraph-image"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071a33" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id" className={`${geist.variable} ${geistMono.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}

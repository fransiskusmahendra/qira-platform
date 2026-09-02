import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./styles.css";
import "./brand-logo.css";
import "./company.css";
import "./portfolio.css";
import "./conversion-v2.css";
import "./simplify-all.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const siteTitle = "QIRA — Simple Digital Solutions";
const siteDescription = "QIRA membantu bisnis dan UMKM membangun website, aplikasi sederhana, automation, integrasi, dan workflow digital yang praktis serta mudah digunakan.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — Simple Digital Solutions" };

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qirasolution.com"),
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
  return <html lang="id" className={`${geist.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}

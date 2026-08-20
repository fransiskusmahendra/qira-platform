import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./styles.css";
import "./brand-logo.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const siteTitle = "QIRA — Bantu Usaha Jadi Lebih Mudah";
const siteDescription = "Ceritakan bagian usaha yang terasa ribet. QIRA membantu memahami masalahnya, menyiapkan arah yang sederhana, lalu membangun solusi yang siap dipakai.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qirasolution.com"),
  applicationName: "QIRA",
  title: {
    default: siteTitle,
    template: "%s | QIRA",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  icons: { icon: "/qira-mark.svg" },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "QIRA",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071a33",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

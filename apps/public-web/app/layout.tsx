import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./styles.css";
import "./brand-logo.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "QIRA — Bantu Usaha Jadi Lebih Mudah",
    template: "%s | QIRA",
  },
  description:
    "Ceritakan bagian usaha yang terasa ribet. QIRA membantu memahami masalahnya, menyiapkan arah yang sederhana, lalu membangun solusi yang siap dipakai.",
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

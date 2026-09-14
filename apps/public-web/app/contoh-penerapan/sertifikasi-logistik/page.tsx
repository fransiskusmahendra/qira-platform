import type { Metadata } from "next";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { LogisticsCertificationClient } from "./LogisticsCertificationClient";

const description =
  "Simulasi interaktif sistem verifikasi sertifikat logistik & supply chain nasional, auto-reminder masa kadaluarsa (Email & WhatsApp Cloud API), serta pemulihan recurring revenue sertifikasi.";

export const metadata: Metadata = {
  title: "Simulasi Sistem Notifikasi & Sertifikasi Logistik",
  description,
  alternates: { canonical: "/contoh-penerapan/sertifikasi-logistik" },
  openGraph: {
    title: "Simulasi Sistem Notifikasi & Sertifikasi Logistik - QIRA",
    description,
    url: "/contoh-penerapan/sertifikasi-logistik",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Simulasi sistem sertifikasi dan notifikasi otomatis QIRA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulasi Sistem Notifikasi & Sertifikasi Logistik - QIRA",
    description,
    images: ["/opengraph-image"],
  },
};

export default function LogisticsCertificationPage() {
  return (
    <>
      <Navbar />
      <main>
        <LogisticsCertificationClient />
      </main>
      <Footer />
    </>
  );
}

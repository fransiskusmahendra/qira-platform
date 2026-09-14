import type { Metadata } from "next";
import { HomePageClient } from "./_components/HomePageClient";

export const metadata: Metadata = {
  title: "QIRA - Solusi Digital Sederhana | Simple Digital Solutions",
  description: "QIRA membuat website, form, dashboard, dan otomatisasi agar usaha lebih mudah ditemukan dan dijalankan. Simple digital solutions for business.",
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "QIRA - Solusi Digital Sederhana",
    description: "QIRA membuat website, form, dashboard, dan otomatisasi agar usaha lebih mudah ditemukan dan dijalankan.",
    url: "/",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA" }],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
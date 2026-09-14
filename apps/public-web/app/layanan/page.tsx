import type { Metadata } from "next";
import { ServicesPageClient } from "./_components/ServicesPageClient";

const description = "Layanan QIRA untuk website UMKM, otomatisasi bisnis, administrasi digital, dan alat kerja digital yang dibuat sesuai kebutuhan nyata usaha.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Layanan QIRA — website, otomatisasi, administrasi, dan alat kerja digital" };

export const metadata: Metadata = {
  title: "Layanan",
  description,
  alternates: { canonical: "/layanan" },
  openGraph: { title: "Layanan QIRA", description, url: "/layanan", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Layanan QIRA", description, images: ["/opengraph-image"] },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
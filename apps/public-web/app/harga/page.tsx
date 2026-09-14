import type { Metadata } from "next";
import { PricingPageClient } from "./_components/PricingPageClient";

const title = "Harga & Paket";
const description = "Lihat pilihan paket solusi digital QIRA yang transparan, tanpa biaya langganan membengkak, dan sesuai skala usaha Anda.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harga" },
  openGraph: { title: `${title} | QIRA`, description, url: "/harga", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA â€” harga dan paket" }] },
  twitter: { card: "summary_large_image", title: `${title} | QIRA`, description, images: ["/opengraph-image"] },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
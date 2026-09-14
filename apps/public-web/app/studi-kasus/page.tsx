import type { Metadata } from "next";
import { CaseStudyPageClient } from "./_components/CaseStudyPageClient";

const description = "Studi kasus QIRA yang menunjukkan masalah, solusi, dan hasil alur kerja yang dapat diperiksa tanpa mempublikasikan data sensitif klien.";

export const metadata: Metadata = {
  title: "Studi Kasus QIRA",
  description,
  alternates: { canonical: "/studi-kasus" },
  openGraph: { title: "Studi Kasus QIRA", description, url: "/studi-kasus", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Studi kasus QIRA" }] },
  twitter: { card: "summary_large_image", title: "Studi Kasus QIRA", description, images: ["/opengraph-image"] },
};

export default function CaseStudyPage() {
  return <CaseStudyPageClient />;
}
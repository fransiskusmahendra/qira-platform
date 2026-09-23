import type { Metadata } from "next";
import { PortfolioPageClient } from "./_components/PortfolioPageClient";

const PORTFOLIO_DESCRIPTION = "Karya sistem software, penerapan operasional nyata, dan solusi digital terbukti yang dibangun dan diterapkan oleh QIRA.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Karya QIRA — produk, penerapan, dan software operasional" };

export const metadata: Metadata = {
  title: "Karya & Penerapan",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Karya & Penerapan | QIRA", description: PORTFOLIO_DESCRIPTION, url: "/portfolio", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Karya & Penerapan | QIRA", description: PORTFOLIO_DESCRIPTION, images: ["/opengraph-image"] },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
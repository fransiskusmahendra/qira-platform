import type { Metadata } from "next";
import { PortfolioPageClient } from "./_components/PortfolioPageClient";

const PORTFOLIO_DESCRIPTION = "Lihat produk internal, penerapan nyata, dan demo solusi QIRA melalui contoh aplikasi yang aman ditampilkan.";
const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Portofolio QIRA â€” produk, penerapan, dan demo solusi digital" };

export const metadata: Metadata = {
  title: "Portofolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION, url: "/portfolio", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Portofolio QIRA", description: PORTFOLIO_DESCRIPTION, images: ["/opengraph-image"] },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
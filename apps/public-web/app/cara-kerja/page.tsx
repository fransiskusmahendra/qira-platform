import type { Metadata } from "next";
import { ProcessPageClient } from "./_components/ProcessPageClient";

const description = "Pahami proses kerja QIRA dari pemetaan kebutuhan, estimasi, pembangunan, review, implementasi, hingga dukungan setelah solusi digunakan.";

export const metadata: Metadata = {
  title: "Cara Kerja QIRA | How QIRA Works",
  description,
  alternates: {
    canonical: "/cara-kerja",
    languages: {
      "id-ID": "/cara-kerja",
      "en-US": "/cara-kerja",
      "x-default": "/cara-kerja",
    },
  },
  openGraph: {
    title: "Cara Kerja QIRA | How QIRA Works",
    description,
    url: "/cara-kerja",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Cara kerja QIRA" }],
  },
  twitter: { card: "summary_large_image", title: "Cara Kerja QIRA | How QIRA Works", description },
};

export default function ProcessPage() {
  return <ProcessPageClient />;
}
import type { Metadata } from "next";
import { AboutPageClient } from "./_components/AboutPageClient";

const ABOUT_DESCRIPTION = "Kenali cara QIRA membantu bisnis membuat teknologi lebih sederhana, praktis, dan sesuai kebutuhan nyata.";

export const metadata: Metadata = {
  title: "Tentang QIRA | About QIRA",
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: "/about",
    languages: {
      "id-ID": "/about",
      "en-US": "/about",
      "x-default": "/about",
    },
  },
  openGraph: {
    title: "Tentang QIRA | About QIRA",
    description: ABOUT_DESCRIPTION,
    url: "/about",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tentang QIRA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang QIRA | About QIRA",
    description: ABOUT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
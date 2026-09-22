import type { Metadata } from "next";
import { HomePageClient } from "./_components/HomePageClient";

export const metadata: Metadata = {
  title: "QIRA — Digital Solutions for Modern Business",
  description: "QIRA designs, builds and connects practical digital solutions for modern businesses. Turn business needs into digital solutions.",
  alternates: {
    canonical: "https://qirasolution.com",
    languages: {
      "id-ID": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "QIRA — Digital Solutions for Modern Business",
    description: "QIRA designs, builds and connects practical digital solutions for modern businesses. Turn business needs into digital solutions.",
    url: "https://qirasolution.com",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "QIRA — Digital Solutions for Modern Business" }],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
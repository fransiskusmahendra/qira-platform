import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QIRA — Solusi Digital Sederhana",
    short_name: "QIRA",
    description: "Website, form, dashboard, dan otomatisasi sederhana untuk membantu bisnis bekerja lebih rapi.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071a33",
    lang: "id-ID",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

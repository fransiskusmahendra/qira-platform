import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/about",
  "/layanan",
  "/portfolio",
  "/contoh-penerapan",
  "/coba-masalah",
  "/harga",
  "/solusi/website-umkm",
  "/solusi/automation-bisnis",
  "/solusi/digitalisasi-administrasi",
  "/solusi/business-tools",
  "/untuk/usaha-jasa",
  "/untuk/retail-umkm",
  "/untuk/administrasi-tim",
  "/privasi",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.qirasolution.com";
  return routes.map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/coba-masalah" ? 0.9 : route === "/layanan" || route.startsWith("/solusi/") ? 0.8 : 0.7,
  }));
}

import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/about",
  "/layanan",
  "/portfolio",
  "/studi-kasus",
  "/cara-kerja",
  "/panduan",
  "/panduan/jasa-pembuatan-website-umkm",
  "/panduan/otomatisasi-bisnis",
  "/panduan/digitalisasi-administrasi-usaha",
  "/panduan/aplikasi-custom-operasional",
  "/contoh-penerapan",
  "/contoh-penerapan/sertifikasi-logistik",
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
    url: route === "/" ? `${baseUrl}/` : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority:
      route === "/"
        ? 1.0
        : route === "/coba-masalah"
        ? 0.9
        : route === "/layanan" || route.startsWith("/solusi/") || route.startsWith("/panduan/") || route.startsWith("/contoh-penerapan/")
        ? 0.8
        : 0.7,
  }));
}

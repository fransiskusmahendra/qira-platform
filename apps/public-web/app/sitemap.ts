import type { MetadataRoute } from "next";

const baseUrl = "https://www.qirasolution.com";

// Keep the public sitemap intentionally focused on customer-facing sales and trust pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/coba-masalah`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/harga`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privasi`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

import type { MetadataRoute } from "next";

const baseUrl = "https://www.qirasolution.com";

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
  ];
}

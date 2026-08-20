import type { MetadataRoute } from "next";

const baseUrl = "https://www.qirasolution.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/client/",
        "/workspace/",
        "/implementation/",
        "/invite/",
        "/login",
        "/discovery",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/bg", "/de", "/fr", "/es"], disallow: ["/operator", "/api/"] }],
    sitemap: "https://mind-reply.com/sitemap.xml",
    host: "https://mind-reply.com",
  };
}

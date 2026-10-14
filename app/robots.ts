import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/codex/"] }],
    sitemap: `${process.env.NEXTAUTH_URL || "https://epos.example.com"}/sitemap.xml`,
  };
}

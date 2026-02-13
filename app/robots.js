export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/main/admin", "/main/admin/", "/api/admin/"],
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

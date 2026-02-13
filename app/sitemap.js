import { getAllBlogs } from "@/lib/blog";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site";
  const now = new Date().toISOString();

  const staticRoutes = ["/", "/about", "/blog", "/quotes", "/connect"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
    })
  );

  try {
    const blogs = await getAllBlogs();
    const blogRoutes = blogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: post.updated_at || post.published_at || now,
    }));
    return [...staticRoutes, ...blogRoutes];
  } catch {
    // Do not fail the build if database is unavailable in build workers.
    return staticRoutes;
  }
}

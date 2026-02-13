import { getAllBlogs } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site";
  const now = new Date().toISOString();

  const staticRoutes = ["/", "/about", "/blog", "/quotes", "/connect"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.8,
    })
  );

  try {
    const blogs = await getAllBlogs();
    const blogRoutes = blogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: post.updated_at || post.published_at || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...blogRoutes];
  } catch {
    // Do not fail the build if database is unavailable in build workers.
    return staticRoutes;
  }
}

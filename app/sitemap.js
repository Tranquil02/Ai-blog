import { getAllBlogs } from "@/lib/blog";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site";
  const now = new Date().toISOString();

  const blogs = await getAllBlogs();

  const staticRoutes = ["/", "/about", "/blog", "/quotes", "/connect"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
    })
  );

  const blogRoutes = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.updated_at || post.published_at || now,
  }));

  return [...staticRoutes, ...blogRoutes];
}

import { NextResponse } from "next/server";
import {
  getFeaturedBlog,
  getLatestBlogs,
  getMostViewedBlogs,
  getTrendingBlogs,
} from "@/lib/blog";

export async function GET() {
  try {
    const [featured, trending, latest, mostViewed] = await Promise.all([
      getFeaturedBlog(),
      getTrendingBlogs(6),
      getLatestBlogs(12),
      getMostViewedBlogs(6),
    ]);

    return NextResponse.json({
      featured,
      trending,
      latest,
      mostViewed,
    });
  } catch {
    // Do not hard-fail the public blog page if DB calls fail.
    return NextResponse.json({
      featured: null,
      trending: [],
      latest: [],
      mostViewed: [],
    });
  }
}

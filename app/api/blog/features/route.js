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
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

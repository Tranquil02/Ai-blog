import { NextResponse } from "next/server";
import { getBlogFeatureSets } from "@/lib/blog";

export const revalidate = 60;

export async function GET() {
  try {
    const { featured, trending, latest, mostViewed } = await getBlogFeatureSets(
      {
        trendingLimit: 6,
        latestLimit: 12,
        mostViewedLimit: 6,
      }
    );

    return NextResponse.json(
      {
        featured,
        trending,
        latest,
        mostViewed,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    // Do not hard-fail the public blog page if DB calls fail.
    return NextResponse.json(
      {
        featured: null,
        trending: [],
        latest: [],
        mostViewed: [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    );
  }
}

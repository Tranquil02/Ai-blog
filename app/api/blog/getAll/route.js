// app/api/blogs/all/route.ts
import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blog'

export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawLimit = Number(searchParams.get("limit") || "200")
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.trunc(rawLimit), 1), 500)
      : 200

    const blogs = await getAllBlogs(limit)
    return NextResponse.json(blogs, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch {
    // Keep public pages functional when DB connectivity is temporarily unavailable.
    return NextResponse.json([], {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
      },
    })
  }
}

// app/api/blogs/all/route.ts
import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blog'

export const revalidate = 60

export async function GET() {
  try {
    const blogs = await getAllBlogs()
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

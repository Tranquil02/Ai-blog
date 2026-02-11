// app/api/blogs/all/route.ts
import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blog'

export async function GET() {
  try {
    const blogs = await getAllBlogs()
    return NextResponse.json(blogs)
  } catch {
    // Keep public pages functional when DB connectivity is temporarily unavailable.
    return NextResponse.json([])
  }
}

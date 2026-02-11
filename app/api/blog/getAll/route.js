// app/api/blogs/all/route.ts
import { NextResponse } from 'next/server'
import { getAllBlogs } from '@/lib/blog'

export async function GET() {
  const blogs = await getAllBlogs()
  // return blogs
  return NextResponse.json(blogs)
}

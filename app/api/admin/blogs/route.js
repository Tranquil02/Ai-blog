import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongodb";

const collectionName = "blogs";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const calculateReadingTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? verifyAdminToken(token) : null;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    excerpt,
    content,
    status = "draft",
    cover_image = null,
    category = "AI Productivity",
    author = "TrendyStory Editorial",
    tags = [],
  } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const now = new Date();
  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => tag.trim()).filter(Boolean)
    : [];

  const document = {
    title,
    slug: slugify(title),
    author,
    excerpt: excerpt || "",
    content,
    cover_image,
    category,
    tags: normalizedTags,
    reading_time: calculateReadingTime(content),
    status,
    views: 0,
    likes: 0,
    saves: 0,
    created_at: now,
    updated_at: now,
    published_at: status === "published" ? now : null,
  };

  const db = await getDb();
  const result = await db.collection(collectionName).insertOne(document);

  return NextResponse.json({ id: result.insertedId.toString() });
}

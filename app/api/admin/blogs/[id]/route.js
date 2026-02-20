import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongodb";
import { analyzeBlogQuality } from "@/lib/contentQuality";

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

export async function PUT(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? verifyAdminToken(token) : null;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID." }, { status: 400 });
  }

  const body = await req.json();
  const {
    title,
    excerpt,
    content,
    status,
    cover_image,
    category,
    author,
    tags,
  } = body;

  const db = await getDb();
  const collection = db.collection(collectionName);
  const objectId = new ObjectId(id);
  const current = await collection.findOne({ _id: objectId });

  if (!current) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  const finalTitle = title ?? current.title ?? "";
  const finalExcerpt = excerpt ?? current.excerpt ?? "";
  const finalContent = content ?? current.content ?? "";
  const finalStatus = status ?? current.status ?? "draft";
  const quality = analyzeBlogQuality({
    title: finalTitle,
    excerpt: finalExcerpt,
    content: finalContent,
    status: finalStatus,
  });

  if (quality.blockPublish) {
    return NextResponse.json(
      {
        error: "Quality checks failed for publishing.",
        quality,
      },
      { status: 400 }
    );
  }

  const update = {
    updated_at: new Date(),
    quality_score: quality.score,
    quality_issues: quality.issues,
    quality_checked_at: new Date(),
  };

  if (title) update.title = title;
  if (title) update.slug = slugify(title);
  if (excerpt !== undefined) update.excerpt = excerpt;
  if (content) {
    update.content = content;
    update.reading_time = calculateReadingTime(content);
  }
  if (status) update.status = status;
  if (cover_image !== undefined) update.cover_image = cover_image;
  if (category) update.category = category;
  if (author) update.author = author;
  if (Array.isArray(tags)) {
    update.tags = tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (status === "published" && !body.published_at) {
    update.published_at = new Date();
  }

  const updated = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: update },
    { returnDocument: "after", includeResultMetadata: false }
  );

  return NextResponse.json({ ok: Boolean(updated), quality });
}

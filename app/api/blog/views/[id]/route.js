import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const collectionName = "blogs";

export async function POST(req, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(collectionName).findOneAndUpdate(
    {
      _id: new ObjectId(id),
      $or: [{ status: "published" }, { status: { $exists: false } }],
    },
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  );

  if (!result.value) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  return NextResponse.json({ views: result.value.views ?? 0 });
}

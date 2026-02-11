import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const collectionName = "blogs";

export async function POST(req, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const delta = typeof body?.delta === "number" ? body.delta : 1;

  const db = await getDb();
  const result = await db.collection(collectionName).findOneAndUpdate(
    { _id: new ObjectId(id), status: "published" },
    { $inc: { likes: delta } },
    { returnDocument: "after" }
  );

  if (!result.value) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }

  const likes = Math.max(0, result.value.likes ?? 0);
  return NextResponse.json({ likes });
}

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const DATA_URI_RE = /^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.+)$/i;

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const db = await getDb();
    const blog = await db.collection("blogs").findOne(
      { _id: new ObjectId(id), status: "published" },
      { projection: { cover_image: 1 } }
    );

    const cover = typeof blog?.cover_image === "string" ? blog.cover_image.trim() : "";
    if (!cover) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (!cover.startsWith("data:")) {
      return NextResponse.redirect(cover, 307);
    }

    const match = cover.match(DATA_URI_RE);
    if (!match) {
      return new NextResponse("Invalid image data", { status: 400 });
    }

    const mimeType = match[1] || "image/png";
    const bytes = Buffer.from(match[2], "base64");

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

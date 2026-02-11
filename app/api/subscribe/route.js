import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const collectionName = "subscribers";

const isValidEmail = (value) =>
  typeof value === "string" && /\S+@\S+\.\S+/.test(value);

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const name = String(body?.name || "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db
      .collection(collectionName)
      .findOne({ email });

    if (existing) {
      return NextResponse.json({ ok: true, exists: true });
    }

    await db.collection(collectionName).insertOne({
      email,
      name: name || null,
      created_at: new Date(),
      source: "subscribe",
      status: "active",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to subscribe.", details: err.message },
      { status: 500 }
    );
  }
}

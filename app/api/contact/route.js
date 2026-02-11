import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const collectionName = "contact_messages";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const company = String(body?.company || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection(collectionName).insertOne({
      name,
      email,
      message,
      company: company || null,
      created_at: new Date(),
      source: "connect",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit message.", details: err.message },
      { status: 500 }
    );
  }
}

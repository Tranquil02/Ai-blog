import { NextResponse } from "next/server";
import { getQuotesForPage } from "@/lib/quotes";

export async function GET() {
  const data = await getQuotesForPage();
  return NextResponse.json({ ok: true, ...data });
}

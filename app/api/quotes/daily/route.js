import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "@/lib/jwt";
import { ensureDailyQuotes } from "@/lib/quotes";

export async function POST(req) {
  const secret = process.env.CRON_SECRET;
  const cronHeader = req.headers.get("x-cron-secret");
  if (secret && cronHeader === secret) {
    // allowed via cron secret
  } else {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const user = token ? verifyAdminToken(token) : null;
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json().catch(() => ({}));
    const count = Number(body?.count ?? 3);
    const result = await ensureDailyQuotes({ count });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate daily quotes", details: err.message },
      { status: 500 }
    );
  }
}

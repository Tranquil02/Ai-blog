import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, signAdminToken } from "@/lib/jwt";

export async function POST(req) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured." },
      { status: 500 }
    );
  }

  const emailOk = !!email && email === adminEmail;
  if (!emailOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const passwordTrimmed = typeof password === "string" ? password.trim() : password;
  const passwordOk = passwordTrimmed === adminPassword;
  if (!passwordOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminToken({ email, role: "admin" });
  const response = NextResponse.json({ user: { email } });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

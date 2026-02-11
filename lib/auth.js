import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAdminToken } from "./jwt";

export async function requireAdmin() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  const user = token ? verifyAdminToken(token) : null;

  if (!user) redirect("/main/auth/login");
  if (user.role !== "admin") redirect("/");

  return user;
}

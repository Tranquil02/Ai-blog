import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "trendystory_admin_token";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    issuer: "trendystory",
  });
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "trendystory",
    });
  } catch {
    return null;
  }
}

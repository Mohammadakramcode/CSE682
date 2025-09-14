import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_COOKIE = "session_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type JwtPayload = {
  userId: string;
  email: string;
};

export function createJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function buildSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${TOKEN_COOKIE}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${TOKEN_TTL_SECONDS}`,
    isProd ? `Secure` : ``,
  ].filter(Boolean);
  return parts.join("; ");
}

export function clearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${TOKEN_COOKIE}=`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=0`,
    isProd ? `Secure` : ``,
  ].filter(Boolean);
  return parts.join("; ");
}

export function getTokenCookieName(): string {
  return TOKEN_COOKIE;
}



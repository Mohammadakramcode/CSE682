// logout: clear cookie
import { NextResponse } from "next/server";
import { getTokenCookieName } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set({
    name: getTokenCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 0,
  });
  return res;
}

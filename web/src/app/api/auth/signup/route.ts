// signup: create user + set cookie
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createJwt, getTokenCookieName } from "@/lib/auth";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  await prisma.actionLog.create({
    data: { userId: user.id, action: "signup", metadata: { email } },
  });

  const token = createJwt({ userId: user.id, email: user.email });
  const res = NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set({
    name: getTokenCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

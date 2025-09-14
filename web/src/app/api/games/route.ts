import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getTokenCookieName, verifyJwt } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const games = await prisma.game.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    include: { achievements: true },
  });
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await request.json();
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  try {
    const game = await prisma.game.create({ data: { title: title.trim(), userId: payload.userId } });
    await prisma.actionLog.create({ data: { userId: payload.userId, action: "add_game", metadata: { gameId: game.id, title } } });
    return NextResponse.json(game, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Duplicate game" }, { status: 409 });
  }
}

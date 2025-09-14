// achievements: toggle complete
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getTokenCookieName, verifyJwt } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const achievement = await prisma.achievement.findUnique({
    where: { id: params.id },
    include: { game: true },
  });
  if (!achievement || achievement.game.userId !== payload.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.achievement.update({
    where: { id: params.id },
    data: { completed: !achievement.completed },
  });

  await prisma.actionLog.create({
    data: {
      userId: payload.userId,
      action: updated.completed ? "mark_completed" : "mark_incomplete",
      metadata: { achievementId: updated.id, gameId: achievement.gameId },
    },
  });

  return NextResponse.json({ ok: true });
}

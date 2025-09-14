import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTokenCookieName, verifyJwt } from "@/lib/auth";
import Link from "next/link";
import Header from "@/components/Header";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// auth: extract user id from cookie
async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  return payload?.userId ?? null;
}

// page: dashboard
export default async function DashboardPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return (
      <div className="p-6">
        <p>Not authenticated. <Link className="text-blue-600 underline" href="/login">Login</Link></p>
      </div>
    );
  }

  const games = await prisma.game.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { achievements: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-3xl p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Games</h1>
        </div>

        {searchParams?.error === "duplicate_game" && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            You already have a game with that title.
          </div>
        )}

        <AddGameForm />

        <div className="space-y-4">
          {games.map((g) => (
            <Card key={g.id}>
              <CardHeader
                title={<span className="flex items-center gap-2">{g.title} <Badge>{g.achievements.filter(a=>a.completed).length}/{g.achievements.length} done</Badge></span> as unknown as string}
                actions={
                  <div className="flex items-center gap-2">
                    <AddAchievementForm gameId={g.id} />
                    <form action={deleteGame}>
                      <input type="hidden" name="gameId" value={g.id} />
                      <button className="rounded border px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800">Delete</button>
                    </form>
                  </div>
                }
              />
              <CardContent>
                <ul className="space-y-2">
                  {g.achievements.map((a) => (
                    <li key={a.id} className="flex items-center justify-between">
                      <span className={a.completed ? "line-through" : ""}>{a.title}</span>
                      <div className="flex items-center gap-2">
                        <form action={toggleAchievement}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="rounded border px-2 py-1 text-sm">
                            {a.completed ? "Mark Incomplete" : "Mark Complete"}
                          </button>
                        </form>
                        <form action={deleteAchievement}>
                          <input type="hidden" name="achievementId" value={a.id} />
                          <button className="rounded border px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800">Delete</button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
// action: toggle achievement
async function toggleAchievement(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return;

  const achievement = await prisma.achievement.findUnique({ where: { id }, include: { game: true } });
  if (!achievement || achievement.game.userId !== payload.userId) return;

  await prisma.achievement.update({ where: { id }, data: { completed: !achievement.completed } });
  await prisma.actionLog.create({ data: { userId: payload.userId, action: achievement.completed ? "mark_incomplete" : "mark_completed", metadata: { achievementId: id, gameId: achievement.gameId } } });
  revalidatePath("/dashboard");
}

// action: delete achievement
async function deleteAchievement(formData: FormData) {
  "use server";
  const achievementId = String(formData.get("achievementId") || "");
  if (!achievementId) return;
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return;

  const achievement = await prisma.achievement.findUnique({ where: { id: achievementId }, include: { game: true } });
  if (!achievement || achievement.game.userId !== payload.userId) return;

  await prisma.achievement.delete({ where: { id: achievementId } });
  await prisma.actionLog.create({ data: { userId: payload.userId, action: "delete_achievement", metadata: { achievementId, gameId: achievement.gameId } } });
  revalidatePath("/dashboard");
}

// action: delete game
async function deleteGame(formData: FormData) {
  "use server";
  const gameId = String(formData.get("gameId") || "");
  if (!gameId) return;
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return;

  const game = await prisma.game.findUnique({ where: { id: gameId }, include: { achievements: true } });
  if (!game || game.userId !== payload.userId) return;

  await prisma.achievement.deleteMany({ where: { gameId } });
  await prisma.game.delete({ where: { id: gameId } });
  await prisma.actionLog.create({ data: { userId: payload.userId, action: "delete_game", metadata: { gameId } } });
  revalidatePath("/dashboard");
}

// util: headers (reserved)
function getFormHeaders() {
  return { "Content-Type": "application/json" } as const;
}

// util: no-op (placeholder)
function revalidatePathClient() {}

// form: add game
function AddGameForm() {
  async function action(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    if (!title) return;
    const cookieStore = await cookies();
    const token = cookieStore.get(getTokenCookieName())?.value || "";
    const payload = verifyJwt(token);
    if (!payload) return;
    const userId = payload.userId;

    try {
      const game = await prisma.game.create({ data: { title, userId } });
      await prisma.actionLog.create({ data: { userId, action: "add_game", metadata: { gameId: game.id, title } } });
      revalidatePath("/dashboard");
    } catch (e) {
      if ((e as any)?.code === "P2002") {
        redirect("/dashboard?error=duplicate_game");
        return;
      }
      // Non-duplicate errors: just revalidate
      revalidatePath("/dashboard");
    }
  }

  return (
    <form action={action} className="flex gap-2">
      <input name="title" placeholder="Add a game" className="flex-1 rounded border px-3 py-2" />
      <button className="rounded bg-green-600 px-3 py-2 text-white">Add</button>
    </form>
  );
}

// form: add achievement
function AddAchievementForm({ gameId }: { gameId: string }) {
  async function action(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    if (!title) return;
    const cookieStore = await cookies();
    const token = cookieStore.get(getTokenCookieName())?.value || "";
    const payload = verifyJwt(token);
    if (!payload) return;
    const userId = payload.userId;

    const achievement = await prisma.achievement.create({ data: { title, gameId } });
    await prisma.actionLog.create({ data: { userId, action: "add_achievement", metadata: { gameId, achievementId: achievement.id, title } } });
    revalidatePath("/dashboard");
  }

  return (
    <form action={action} className="flex gap-2">
      <input name="title" placeholder="Add achievement" className="flex-1 rounded border px-2 py-1 text-sm" />
      <input type="hidden" name="gameId" value={gameId} />
      <button className="rounded border px-2 py-1 text-sm">Add</button>
    </form>
  );
}

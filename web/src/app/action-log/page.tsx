import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTokenCookieName, verifyJwt } from "@/lib/auth";
import Link from "next/link";
import Header from "@/components/Header";

async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value;
  if (!token) return null;
  const payload = verifyJwt(token);
  return payload?.userId ?? null;
}

export default async function ActionLogPage() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return (
      <div className="p-6">
        <p>Not authenticated. <Link className="text-blue-600 underline" href="/login">Login</Link></p>
      </div>
    );
  }

  const logs = await prisma.actionLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Action Log</h1>
          <Link href="/dashboard" className="text-blue-600 underline">Back to Dashboard</Link>
        </div>
        <ul className="space-y-2">
          {logs.map((l) => (
            <li key={l.id} className="rounded border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{l.action}</span>
                <span className="text-gray-500">{new Date(l.createdAt).toLocaleString()}</span>
              </div>
              {l.metadata && (
                <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">{JSON.stringify(l.metadata, null, 2)}</pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



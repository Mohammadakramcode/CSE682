// top nav: links + logout
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTokenCookieName, verifyJwt } from "@/lib/auth";

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  const user = payload
    ? await prisma.user.findUnique({ where: { id: payload.userId } })
    : null;

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur dark:bg-zinc-900/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-lg font-semibold">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Game Tracker</span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            <Link className="rounded px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800" href="/dashboard">Dashboard</Link>
            <Link className="rounded px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800" href="/action-log">Action Log</Link>
            <Link className="rounded px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800" href="/settings">Settings</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-gray-600 dark:text-gray-300 sm:inline">{user.email}</span>
          )}
          <form action="/api/auth/logout" method="post">
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800">Logout</button>
          </form>
        </div>
      </div>
    </header>
  );
}



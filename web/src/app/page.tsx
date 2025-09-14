import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Game Achievement Tracker</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Track your games and achievements</p>
          <div className="flex justify-center gap-3">
            <Link className="rounded-md border px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition" href="/login">Login</Link>
            <Link className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition shadow-sm" href="/signup">Sign up</Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:bg-zinc-900/60">
            <div className="mb-2 text-xl">🎮</div>
            <div className="font-medium">Track Games</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Add your library and stay organized.</div>
          </div>
          <div className="rounded-xl border bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:bg-zinc-900/60">
            <div className="mb-2 text-xl">🏆</div>
            <div className="font-medium">Manage Achievements</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Add, toggle, and delete progress.</div>
          </div>
          <div className="rounded-xl border bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:bg-zinc-900/60">
            <div className="mb-2 text-xl">📝</div>
            <div className="font-medium">Action Log</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Every action is timestamped.</div>
          </div>
        </div>
      </div>
    </main>
  );
}

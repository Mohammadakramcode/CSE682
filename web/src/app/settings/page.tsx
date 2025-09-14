import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTokenCookieName, verifyJwt, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) {
    return (
      <div className="p-6">
        <p>You need to login.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-2xl p-4 space-y-8">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>

        <section className="rounded-xl border bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-zinc-900/60">
          <h2 className="mb-3 font-medium">Update Email</h2>
          <form action={updateEmail} className="flex max-w-md items-center gap-2">
            <input name="email" defaultValue={user?.email || ""} type="email" className="flex-1 rounded border px-3 py-2" />
            <button className="rounded bg-blue-600 px-3 py-2 text-white">Save</button>
          </form>
        </section>

        <section className="rounded-xl border bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-zinc-900/60">
          <h2 className="mb-3 font-medium">Change Password</h2>
          <form action={updatePassword} className="grid max-w-md gap-2">
            <input name="password" placeholder="New password" type="password" className="rounded border px-3 py-2" minLength={8} />
            <button className="rounded bg-blue-600 px-3 py-2 text-white">Update Password</button>
          </form>
        </section>
      </div>
    </div>
  );
}

async function updateEmail(formData: FormData) {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return;
  const email = String(formData.get("email") || "").trim();
  if (!email) return;
  await prisma.user.update({ where: { id: payload.userId }, data: { email } });
  revalidatePath("/settings");
}

async function updatePassword(formData: FormData) {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenCookieName())?.value || "";
  const payload = verifyJwt(token);
  if (!payload) return;
  const password = String(formData.get("password") || "").trim();
  if (!password || password.length < 8) return;
  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: payload.userId }, data: { passwordHash } });
  revalidatePath("/settings");
}



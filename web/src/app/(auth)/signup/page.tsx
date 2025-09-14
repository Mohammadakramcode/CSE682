"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Signup failed");
      }
      window.location.assign("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-zinc-900/60">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-sm">
          Have an account? <a className="text-blue-600 underline" href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

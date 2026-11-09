"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Envelope, Lock, Warning } from "@phosphor-icons/react";
import { Input, Button } from "@/components/ui";
import { api, token } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token.get()) router.replace("/dashboard/overview");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const res = await api<{ token: string }>("/auth/login", { method: "POST", json: { email, password } });
      token.set(res.token);
      router.push("/dashboard/overview");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to manage your store.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div role="alert" className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
            <Warning size={16} weight="fill" className="shrink-0 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Envelope size={18} weight="regular" />} autoComplete="email" />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock size={18} weight="regular" />} autoComplete="current-password" />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}

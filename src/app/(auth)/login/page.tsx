"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("demo@gomaintenance.io");
  const [password, setPassword] = useState("demo1234");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const gradientOverlay = useMemo(
    () =>
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.32) 0, rgba(255,255,255,0) 35%), " +
      "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.24) 0, rgba(255,255,255,0) 30%), " +
      "radial-gradient(circle at 50% 80%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 28%)",
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[680px] overflow-hidden rounded-3xl border bg-card shadow-2xl md:min-h-[760px]"
    >
      <div className="flex w-full flex-col justify-between bg-background px-8 py-8 md:w-[56%] md:px-12 md:py-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-md">
              GM
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Maintenance cloud</p>
              <p className="text-xl font-semibold">Welcome back</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </div>
        </div>

        <div className="max-w-xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Sign in to GoMaintenance</h1>
            <p className="text-sm text-muted-foreground">
              Access your dashboard, track assets, and keep maintenance running smoothly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-11 rounded-xl border-border bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-xl border-border bg-background"
                required
              />
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
              disabled={submitting || authLoading}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <div className="text-xs text-muted-foreground">
          Use demo credentials <span className="font-semibold text-foreground">demo@gomaintenance.io / demo1234</span> to
          explore the platform.
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 md:block">
        <div className="absolute inset-0" style={{ backgroundImage: gradientOverlay }} />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-sky-900/20 to-transparent" />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%, transparent)", backgroundSize: "40px 40px" }} />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3 text-sm font-medium opacity-90">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur-sm">GM</span>
            <span>Trusted maintenance platform for modern teams</span>
          </div>

          <div className="relative mt-auto w-full max-w-sm self-end">
            <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-sky-300/25 blur-3xl" />
            <Image
              src="/window.svg"
              alt="Maintenance dashboard preview"
              width={520}
              height={420}
              className="relative w-full rounded-2xl border border-white/20 bg-white/15 p-4 shadow-2xl backdrop-blur"
              priority
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

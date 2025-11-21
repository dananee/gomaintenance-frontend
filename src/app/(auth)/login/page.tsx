"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      className="flex min-h-screen flex-col bg-background md:flex-row"
    >
      <div className="flex w-full flex-col justify-center px-8 py-12 md:max-w-xl md:px-12 lg:px-16">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-sm ring-1 ring-border/40">
              GM
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Maintenance cloud</p>
              <p className="text-lg font-semibold text-foreground">Welcome back</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Sign in to GoMaintenance</h1>
            <p className="text-base text-muted-foreground">Access your dashboard and assets.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl border-border bg-card"
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
                className="h-12 rounded-xl border-border bg-card"
                required
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:shadow-md"
              disabled={submitting || authLoading}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-2 text-sm text-muted-foreground">
            Forgot Password? <Link className="font-semibold text-primary" href="#">Reset</Link>
          </div>
        </div>

        <div className="pt-6 text-xs text-muted-foreground">
          Use demo credentials <span className="font-semibold text-foreground">demo@gomaintenance.io / demo1234</span> to explore the platform.
        </div>
      </div>

      <div className="relative hidden flex-1 items-center justify-center bg-gradient-to-br from-[#0080ff] via-[#0068d6] to-[#0049a7] p-16 text-white md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 mix-blend-overlay" />
        <div className="relative flex max-w-lg flex-col items-center text-center">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold backdrop-blur ring-1 ring-white/20">
            GM
          </div>
          <h2 className="text-2xl font-semibold">Trusted maintenance platform</h2>
          <p className="mt-2 max-w-md text-base opacity-80">
            Modern maintenance and fleet operations with real-time visibility.
          </p>
          <div className="mt-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <Image
              src="/window.svg"
              alt="Maintenance dashboard preview"
              width={520}
              height={420}
              className="w-full rounded-xl bg-white/5"
              priority
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

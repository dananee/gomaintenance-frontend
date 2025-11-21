"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(email, fullName, password);
      router.push("/dashboard");
    } catch {
      setError("Unable to sign up (email might be used or password too short)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 rounded-2xl bg-gm-card border border-gm-border shadow-xl"
    >
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gm-primary flex items-center justify-center text-black font-bold">
            GM
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              GoMaintenance
            </h1>
            <p className="text-sm text-gm-muted">
              Create your maintenance account
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            placeholder="John Mechanic"
            className="mt-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gm-primary text-black hover:bg-yellow-400 transition-transform hover:-translate-y-0.5"
        >
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-center text-gm-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-gm-primary hover:underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}

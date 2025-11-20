"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-gm-muted">Loading GoMaintenance…</span>
    </div>
  );
}

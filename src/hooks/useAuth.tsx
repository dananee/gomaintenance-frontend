"use client";

import { apiFetch } from "@/lib/api-client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("gm_token") : null;
    const u =
      typeof window !== "undefined" ? localStorage.getItem("gm_user") : null;
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    if (typeof window !== "undefined") {
      localStorage.setItem("gm_token", t);
      localStorage.setItem("gm_user", JSON.stringify(u));
    }
  };

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string; user: User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    persist(res.access_token, res.user);
  };

  const signup = async (email: string, fullName: string, password: string) => {
    const res = await apiFetch<{ access_token: string; user: User }>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, full_name: fullName, password }),
      }
    );
    persist(res.access_token, res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("gm_token");
      localStorage.removeItem("gm_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

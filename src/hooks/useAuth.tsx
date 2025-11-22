"use client";

import { apiFetch } from "@/lib/api-client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id?: number | null;
  email?: string;
  full_name?: string;
  role?: string;
  company_id?: number | null;
};

type AuthEnvelope<T> = {
  success: boolean;
  data?: T;
  detail?: string;
};

type AuthResponse = {
  token: string;
  company_id?: number;
  role?: string;
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
    /* eslint-disable react-hooks/set-state-in-effect */
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("gm_token");
    const storedUser = localStorage.getItem("gm_user");

    let parsedUser: User | null = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser) as User;
      } catch (error) {
        console.warn("Failed to parse stored user, clearing session", error);
        localStorage.removeItem("gm_user");
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }
    if (parsedUser) {
      setUser(parsedUser);
    }

    setLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
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
    const res = await apiFetch<AuthEnvelope<AuthResponse>>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.data?.token) {
      throw new Error(res.detail || "Authentication failed");
    }

    persist(res.data.token, {
      id: res.data.company_id ?? null,
      company_id: res.data.company_id ?? null,
      email,
      full_name: email,
      role: res.data.role ?? "user",
    });
  };

  const signup = async (email: string, fullName: string, password: string) => {
    const res = await apiFetch<AuthEnvelope<AuthResponse>>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, name: fullName }),
      }
    );

    if (!res.data?.token) {
      throw new Error(res.detail || "Sign up failed");
    }

    persist(res.data.token, {
      id: res.data.company_id ?? null,
      company_id: res.data.company_id ?? null,
      email,
      full_name: fullName,
      role: res.data.role ?? "admin",
    });
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

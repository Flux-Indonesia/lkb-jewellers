"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

type AdminRole = "admin" | "seo" | null;

interface AuthContextType {
  isAdmin: boolean;
  adminRole: AdminRole;
  adminSignOut: () => void;
  user: User | null;
  userLoading: boolean;
  userSignOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  // Check admin session via server-side verification
  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(data.admin === true);
        setAdminRole(data.role || null);
      })
      .catch(() => {
        setIsAdmin(false);
        setAdminRole(null);
      })
      .finally(() => setAdminLoading(false));
  }, []);

  // Check Supabase user session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setUserLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const adminSignOut = () => {
    // Clear httpOnly cookie via server
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      setIsAdmin(false);
      setAdminRole(null);
      window.location.href = "/dashboard";
    });
  };

  const userSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
  };

  const loading = adminLoading || userLoading;

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminRole,
        adminSignOut,
        user,
        userLoading,
        userSignOut,
        refreshUser,
        loading,
        signOut: adminSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

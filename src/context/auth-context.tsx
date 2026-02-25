"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin_session cookie
    const hasSession = document.cookie
      .split("; ")
      .some((c) => c.startsWith("admin_session="));
    setIsAdmin(hasSession);
    setLoading(false);
  }, []);

  const signOut = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    setIsAdmin(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    setLoading(true);

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lkb2024";

    if (password === adminPassword) {
      // Set admin session cookie (7 days)
      document.cookie = `admin_session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push("/dashboard");
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-800 bg-[#0a0a0a] rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl text-white mb-2 font-heading">
          Dashboard Access
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Enter admin password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-auto w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-white"
              disabled={loading}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="h-auto absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Button
            type="submit"
            className="h-auto w-full bg-white text-black py-3 rounded-lg font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </Button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}

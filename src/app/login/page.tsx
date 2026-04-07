"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

function LoginPageContent() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
        toast.success("Welcome back!");
        router.refresh();
        router.push(redirect);
      } else {
        toast.error(error.message || "Invalid credentials");
        setError(error.message || "Invalid credentials");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl text-white mb-3 tracking-[0.1em] font-heading">
            WELCOME BACK
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gray-700" />
            <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Sign In</span>
            <div className="h-px w-12 bg-gray-700" />
          </div>
          <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-400 text-xs tracking-widest uppercase">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white py-6 text-sm"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400 text-xs tracking-widest uppercase">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white py-6 text-sm pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Signing In..." : <> Sign In <ArrowRight size={16} /> </>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline transition-colors tracking-wider">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginPageContent />
    </Suspense>
  );
}

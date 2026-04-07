"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="mx-auto mb-6 text-white" size={48} />
          <h1 className="text-3xl text-white mb-3 tracking-widest font-heading">PASSWORD UPDATED</h1>
          <p className="text-gray-400 text-sm">Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4" />
          <p className="text-gray-400 text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl text-white mb-3 tracking-[0.1em] font-heading">
            NEW PASSWORD
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gray-700" />
            <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Reset Password</span>
            <div className="h-px w-12 bg-gray-700" />
          </div>
          <p className="text-gray-400 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-400 text-xs tracking-widest uppercase">New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white py-6 text-sm pr-12"
                disabled={loading}
                autoFocus
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400 text-xs tracking-widest uppercase">Confirm Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white py-6 text-sm"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Updating..." : <> Update Password <ArrowRight size={16} /> </>}
          </button>
        </form>
      </div>
    </div>
  );
}

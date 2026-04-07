"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="mx-auto mb-6 text-white" size={48} />
          <h1 className="text-3xl text-white mb-3 tracking-widest font-heading">CHECK YOUR EMAIL</h1>
          <p className="text-gray-400 text-sm mb-2 leading-relaxed">
            We sent a password reset link to
          </p>
          <p className="text-white font-medium mb-8">{email}</p>
          <p className="text-gray-500 text-xs mb-8">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-gray-400 text-sm hover:text-white transition-colors underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl text-white mb-3 tracking-[0.1em] font-heading">
            RESET PASSWORD
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gray-700" />
            <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Forgot Password</span>
            <div className="h-px w-12 bg-gray-700" />
          </div>
          <p className="text-gray-400 text-sm">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Sending..." : <> Send Reset Link <ArrowRight size={16} /> </>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-gray-500 text-sm hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

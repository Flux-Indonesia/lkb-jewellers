"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

function SignupPageContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to create account");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="mx-auto mb-6 text-white" size={48} />
          <h1 className="text-3xl text-white mb-3 tracking-widest font-heading">
            ACCOUNT CREATED
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Your account is ready. You can sign in now.
          </p>
          <Link
            href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all"
          >
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl text-white mb-3 tracking-widest font-heading">
            CREATE ACCOUNT
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gray-700" />
            <span className="text-gray-500 text-xs tracking-[0.3em] uppercase">Register</span>
            <div className="h-px w-12 bg-gray-700" />
          </div>
          <p className="text-gray-400 text-sm">
            Join us to explore exclusive timepieces and jewellery
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full bg-transparent border border-gray-800 text-white pl-12 pr-4 py-4 text-sm tracking-wider focus:outline-none focus:border-white transition-colors placeholder:text-gray-600"
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full bg-transparent border border-gray-800 text-white px-4 py-4 text-sm tracking-wider focus:outline-none focus:border-white transition-colors placeholder:text-gray-600"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-transparent border border-gray-800 text-white pl-12 pr-4 py-4 text-sm tracking-wider focus:outline-none focus:border-white transition-colors placeholder:text-gray-600"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)"
              className="w-full bg-transparent border border-gray-800 text-white pl-12 pr-12 py-4 text-sm tracking-wider focus:outline-none focus:border-white transition-colors placeholder:text-gray-600"
              disabled={loading}
              required
              minLength={6}
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

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-black py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} className="text-white hover:underline transition-colors tracking-wider">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignupPageContent />
    </Suspense>
  );
}

"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Laptop, AlertCircle, Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email address or password.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-sm">
        {/* Brand */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-2xl mb-2">
            <Laptop size={28} />
            <span className="text-foreground tracking-tight">
              Demo<span className="text-primary">Verse</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your B2B SaaS sandbox and bookmark dashboards
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg flex items-start space-x-1.5">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. user@demoverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg shadow-sm transition-all uppercase tracking-wider"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground animate-pulse font-sans">
          Loading login credentials...
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

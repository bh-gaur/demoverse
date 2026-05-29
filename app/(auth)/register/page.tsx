"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Laptop, AlertCircle, Eye, EyeOff, User, Briefcase } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "vendor">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Success, redirect to login page
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}&registered=true`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to register account.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-card border border-border p-8 rounded-2xl shadow-sm">
        {/* Brand */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-2xl mb-2">
            <Laptop size={28} />
            <span className="text-foreground tracking-tight">
              Demo<span className="text-primary">Verse</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Join the local-first marketplace sandbox
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

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Work Email
            </label>
            <input
              type="email"
              placeholder="e.g. name@company.com"
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
                placeholder="Min 6 characters"
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

          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Select Profile Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg border text-xs font-semibold transition-all ${
                  role === "user"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                <User size={14} />
                <span>Standard User</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg border text-xs font-semibold transition-all ${
                  role === "vendor"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                <Briefcase size={14} />
                <span>Vendor Publisher</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg shadow-sm transition-all uppercase tracking-wider"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground animate-pulse font-sans">
          Loading registration...
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}

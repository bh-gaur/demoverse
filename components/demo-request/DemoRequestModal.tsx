"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Send, AlertCircle, CheckCircle2, Laptop } from "lucide-react";

import { Platform } from "@prisma/client";
import { Session } from "next-auth";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  session: Session | null;
  isLoggedIn: boolean;
}

export default function DemoRequestModal({
  isOpen,
  onClose,
  platform,
  session,
  isLoggedIn,
}: DemoRequestModalProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState<"1-10" | "11-50" | "51-200" | "200+">("11-50");
  const [useCase, setUseCase] = useState("");
  const [preferredFormat, setPreferredFormat] = useState<"live" | "recorded" | "either">("either");

  // Loading and alerts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    } else {
      setName("");
      setEmail("");
    }
  }, [session, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !email || !company || !useCase) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (useCase.length < 10) {
      setError("Please describe what you want to see in at least 10 characters.");
      setLoading(false);
      return;
    }

    if (useCase.length > 300) {
      setError("Use case cannot exceed 300 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: platform.id,
          requesterName: name,
          requesterEmail: email,
          company,
          teamSize,
          useCase,
          preferredFormat,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setUseCase("");
        setCompany("");
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to submit demo request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-secondary/40 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Laptop size={18} className="text-primary" />
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              Request Demo video from <span className="text-primary">{platform?.name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isLoggedIn ? (
            <div className="py-8 text-center space-y-4">
              <AlertCircle className="mx-auto text-amber-500" size={36} />
              <h4 className="font-bold text-foreground text-base">Authentication Required</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                You must be logged in to request private demo videos from vendors. Creating an account takes under a minute.
              </p>
              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-accent text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/login?callbackUrl=/platform/${platform.slug}`);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg shadow-sm"
                >
                  Log In
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="mx-auto text-primary animate-bounce" size={44} />
              <h4 className="font-bold text-foreground text-base">Demo Request Sent!</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Your request has been delivered. The vendor will contact you within 2 business days to schedule your session or upload the video.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg flex items-start space-x-1.5">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name & Email (Pre-filled if logged in) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Company & Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Team Size</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value as "1-10" | "11-50" | "51-200" | "200+")}
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="1-10">1 - 10 members</option>
                    <option value="11-50">11 - 50 members</option>
                    <option value="51-200">51 - 200 members</option>
                    <option value="200+">200+ members</option>
                  </select>
                </div>
              </div>

              {/* Use Case */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  What do you want to see? (Use Case)
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  placeholder="Describe your workflows, key features, or specific integrations you want demonstrated in the video..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                  <span>Describe specific integrations needed.</span>
                  <span>{useCase.length}/300 chars</span>
                </div>
              </div>

              {/* Format radio option */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Preferred Demo Format</label>
                <div className="flex space-x-4">
                  {[
                    { label: "Recorded Video", val: "recorded" },
                    { label: "Live Walkthrough", val: "live" },
                    { label: "Either format", val: "either" },
                  ].map((f) => (
                    <label key={f.val} className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="preferredFormat"
                        value={f.val}
                        checked={preferredFormat === f.val}
                        onChange={() => setPreferredFormat(f.val as "live" | "recorded" | "either")}
                        className="border-border text-primary focus:ring-primary h-4.5 w-4.5"
                      />
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-accent text-foreground transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-primary hover:bg-primary/95 text-xs font-semibold rounded-lg text-primary-foreground shadow shadow-primary/10 transition-all"
                >
                  <Send size={12} />
                  <span>{loading ? "Sending..." : "Submit Request"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

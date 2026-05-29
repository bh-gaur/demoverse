"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, Upload, AlertCircle, CheckCircle, Laptop, X } from "lucide-react";

interface SubmitFormProps {
  isLoggedIn: boolean;
  role: string;
}

export default function SubmitForm({ isLoggedIn, role }: SubmitFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CRM");
  const [coverColor, setCoverColor] = useState("#1D9E75");
  const [pricingModel, setPricingModel] = useState("freemium");
  const [teamSizeFit, setTeamSizeFit] = useState<string[]>([]);

  // Features List State
  const [features, setFeatures] = useState<{ name: string; icon: string; description: string }[]>([
    { name: "Core Dashboard", icon: "Layers", description: "Consolidated visual control panel for tracking metrics." },
  ]);

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState<{
    name: string;
    price: number | null;
    period: string;
    features: string[];
    highlighted: boolean;
  }[]>([
    { name: "Starter", price: 0, period: "month", features: ["1 user account", "Standard dashboard metrics"], highlighted: false },
  ]);

  // Media State
  const [logoUrl, setLogoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("https://example.com");
  const [demoType, setDemoType] = useState<"embed" | "video" | "none">("embed");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");

  // Upload progress loaders
  const [logoUploading, setLogoUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  if (!isLoggedIn) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto text-center space-y-4">
        <AlertCircle className="mx-auto text-destructive" size={40} />
        <h2 className="text-xl font-bold text-foreground">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">
          You must be logged in as a Vendor or Admin to submit new platforms to DemoVerse.
        </p>
        <button
          onClick={() => router.push("/login?callbackUrl=/submit")}
          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold rounded-lg shadow"
        >
          Log In
        </button>
      </div>
    );
  }

  if (role !== "vendor" && role !== "admin") {
    return (
      <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto text-center space-y-4">
        <AlertCircle className="mx-auto text-amber-500" size={40} />
        <h2 className="text-xl font-bold text-foreground">Vendor Privileges Required</h2>
        <p className="text-sm text-muted-foreground">
          Your current account is registered as a regular User. Only Vendors and Administrators have access to submit B2B platforms.
        </p>
      </div>
    );
  }

  const toggleTeamSize = (size: string) => {
    if (teamSizeFit.includes(size)) {
      setTeamSizeFit(teamSizeFit.filter((s) => s !== size));
    } else {
      setTeamSizeFit([...teamSizeFit, size]);
    }
  };

  // Feature actions
  const addFeature = () => {
    if (features.length >= 6) return;
    setFeatures([...features, { name: "", icon: "Layers", description: "" }]);
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const updateFeature = (idx: number, field: "name" | "icon" | "description", val: string) => {
    const updated = [...features];
    updated[idx][field] = val;
    setFeatures(updated);
  };

  // Pricing actions
  const addPricingTier = () => {
    setPricingTiers([...pricingTiers, { name: "", price: 0, period: "month", features: [""], highlighted: false }]);
  };

  const removePricingTier = (idx: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== idx));
  };

  const updatePricingTier = (
    idx: number,
    field: "name" | "price" | "period" | "highlighted",
    val: string | number | boolean | null
  ) => {
    const updated = [...pricingTiers];
    if (field === "name" && typeof val === "string") {
      updated[idx].name = val;
    } else if (field === "price" && (typeof val === "number" || val === null)) {
      updated[idx].price = val;
    } else if (field === "period" && typeof val === "string") {
      updated[idx].period = val;
    } else if (field === "highlighted" && typeof val === "boolean") {
      updated[idx].highlighted = val;
    }
    setPricingTiers(updated);
  };

  const addPricingFeature = (tierIdx: number) => {
    const updated = [...pricingTiers];
    updated[tierIdx].features.push("");
    setPricingTiers(updated);
  };

  const removePricingFeature = (tierIdx: number, featIdx: number) => {
    const updated = [...pricingTiers];
    updated[tierIdx].features = updated[tierIdx].features.filter((_, i) => i !== featIdx);
    setPricingTiers(updated);
  };

  const updatePricingFeature = (tierIdx: number, featIdx: number, val: string) => {
    const updated = [...pricingTiers];
    updated[tierIdx].features[featIdx] = val;
    setPricingTiers(updated);
  };

  // Upload Logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    if (type === "logo") {
      setLogoUploading(true);
    } else {
      setVideoUploading(true);
      setVideoProgress(10);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // Simple upload progress bar mock
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && type === "video") {
          const percent = Math.round((event.loaded / event.total) * 100);
          setVideoProgress(percent);
        }
      };

      const responsePromise = new Promise<{ url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const err = JSON.parse(xhr.responseText || '{"error":"Upload failed"}');
            reject(new Error(err.error || "Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network upload error"));
      });

      xhr.send(formData);

      const result = await responsePromise;
      if (type === "logo") {
        setLogoUrl(result.url);
      } else {
        setDemoVideoUrl(result.url);
        setDemoType("video");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload file. Please try again.";
      setError(message);
    } finally {
      if (type === "logo") {
        setLogoUploading(false);
      } else {
        setVideoUploading(false);
        setVideoProgress(0);
      }
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!name || !tagline || !description || teamSizeFit.length === 0) {
      setError("Please fill in all details and select at least one team size.");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      tagline,
      description,
      category,
      coverColor,
      logoUrl: logoUrl || undefined,
      demoUrl: demoUrl || undefined,
      demoType,
      demoVideoUrl: demoVideoUrl || undefined,
      teamSizeFit,
      pricingModel,
      features,
      pricingTiers: pricingTiers.map((t) => ({
        ...t,
        price: t.price === null || isNaN(t.price) ? null : Number(t.price),
      })),
    };

    try {
      const response = await fetch("/api/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/platform/${data.slug}`);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Form Progress Header */}
      <div className="bg-secondary/40 border-b border-border px-6 py-4 flex items-center justify-between">
        <h2 className="font-bold text-foreground flex items-center space-x-2 text-base md:text-lg">
          <Laptop className="text-primary" size={20} />
          <span>Onboard B2B SaaS Platform</span>
        </h2>
        <span className="text-xs text-muted-foreground font-semibold">Step {step} of 4</span>
      </div>

      {/* Steps indicators */}
      <div className="flex border-b border-border text-center text-xs font-semibold">
        {["Details", "Features", "Pricing", "Media"].map((label, idx) => {
          const active = step === idx + 1;
          const done = step > idx + 1;
          return (
            <div
              key={label}
              className={`flex-1 py-3 border-b-2 transition-all ${
                active
                  ? "border-primary text-primary bg-primary/5"
                  : done
                  ? "border-primary/50 text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start space-x-2">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-primary/10 text-primary text-sm rounded-lg flex items-start space-x-2">
            <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>Success! Platform submitted. Redirecting to detail sandbox...</span>
          </div>
        )}

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Platform Name</label>
                <input
                  type="text"
                  placeholder="e.g. NexusCRM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Next-gen pipeline intelligence"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Description (Product Pitch)</label>
              <textarea
                rows={4}
                placeholder="Describe your SaaS product core workflows, unique value propositions, and integrations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {["CRM", "Analytics", "Dev Tools", "HR", "Marketing", "Finance"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Pricing Model</label>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {["free", "freemium", "paid", "custom"].map((m) => (
                    <option key={m} value={m} className="capitalize">{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Card Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground uppercase font-mono">{coverColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Team Size Fit</label>
              <div className="flex flex-wrap gap-3">
                {["1-10", "11-50", "51-200", "200+"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleTeamSize(size)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      teamSizeFit.includes(size)
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {size} members
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FEATURES */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-foreground text-sm">Product Capabilities</h3>
                <p className="text-xs text-muted-foreground">List up to 6 core capabilities with Lucide icon names.</p>
              </div>
              <button
                type="button"
                onClick={addFeature}
                disabled={features.length >= 6}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50"
              >
                <Plus size={14} />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {features.map((feature, idx) => (
                <div key={idx} className="p-4 border border-border bg-secondary/10 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Feature Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Interactive Charts"
                        value={feature.name}
                        onChange={(e) => updateFeature(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Lucide Icon Name</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                      >
                        {["Layers", "Zap", "Shield", "Calendar", "TrendingUp", "Target", "Users", "Code", "Sparkles", "Database", "Clock"].map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="Brief details about what the feature accomplishes..."
                      value={feature.description}
                      onChange={(e) => updateFeature(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-foreground text-sm">Pricing Tiers</h3>
                <p className="text-xs text-muted-foreground">Add billing options (Free, Starter, Pro, Custom plans).</p>
              </div>
              <button
                type="button"
                onClick={addPricingTier}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/95"
              >
                <Plus size={14} />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
              {pricingTiers.map((tier, tierIdx) => (
                <div key={tierIdx} className="p-4 border border-border rounded-xl space-y-4 relative bg-secondary/5">
                  <button
                    type="button"
                    onClick={() => removePricingTier(tierIdx)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tier Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Professional Suite"
                        value={tier.name}
                        onChange={(e) => updatePricingTier(tierIdx, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Price ($)</label>
                      <input
                        type="number"
                        placeholder="e.g. 29"
                        value={tier.price === null ? "" : tier.price}
                        onChange={(e) => updatePricingTier(tierIdx, "price", e.target.value === "" ? null : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Period</label>
                      <select
                        value={tier.period}
                        onChange={(e) => updatePricingTier(tierIdx, "period", e.target.value)}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                      >
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                        <option value="user/month">User/Month</option>
                      </select>
                    </div>
                  </div>

                  {/* Highlights and features checkboxes */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`highlight-${tierIdx}`}
                      checked={tier.highlighted}
                      onChange={(e) => updatePricingTier(tierIdx, "highlighted", e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor={`highlight-${tierIdx}`} className="text-xs text-muted-foreground font-semibold">
                      Highlight this tier as popular
                    </label>
                  </div>

                  {/* Tier features subset */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan Features</label>
                      <button
                        type="button"
                        onClick={() => addPricingFeature(tierIdx)}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tier.features.map((feat, featIdx) => (
                        <div key={featIdx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="e.g. Unlimited users support"
                            value={feat}
                            onChange={(e) => updatePricingFeature(tierIdx, featIdx, e.target.value)}
                            className="flex-grow px-3 py-1.5 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removePricingFeature(tierIdx, featIdx)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: MEDIA */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-bold text-foreground text-sm border-b border-border pb-2">Media & Demonstration</h3>

            {/* Logo upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Logo</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-primary/50 bg-secondary/15 hover:bg-secondary/30 cursor-pointer text-xs font-semibold transition-all">
                  <Upload size={14} />
                  <span>{logoUploading ? "Uploading..." : "Upload Logo (.png, .jpg, .webp)"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo")}
                    className="hidden"
                    disabled={logoUploading}
                  />
                </label>
                <div className="text-xs text-muted-foreground">Or provide direct URL:</div>
                <input
                  type="text"
                  placeholder="e.g. https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-grow w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
              {logoUrl && (
                <div className="flex items-center space-x-2 p-2 border border-border rounded-lg bg-secondary/10 w-fit">
                  <img src={logoUrl} alt="logo preview" className="w-8 h-8 object-contain" />
                  <span className="text-xs text-muted-foreground truncate max-w-xs">{logoUrl}</span>
                </div>
              )}
            </div>

            {/* Demo Sandbox Link */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Interactive Sandbox Demo URL</label>
              <input
                type="text"
                placeholder="e.g. https://example.com/demo"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground block">
                This URL will be embedded as an iframe mockup on your platform page.
              </span>
            </div>

            {/* Demo video upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Recorded Video Demo</label>
              <div className="flex flex-col gap-2">
                <label className="w-full sm:w-fit flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer text-xs font-semibold text-primary transition-all">
                  <Upload size={14} />
                  <span>{videoUploading ? `Uploading (${videoProgress}%)` : "Browse Demo Video (.mp4, .webm, .mov)"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="hidden"
                    disabled={videoUploading}
                  />
                </label>
                {videoUploading && (
                  <div className="w-full bg-secondary rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                  </div>
                )}
                {demoVideoUrl && (
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-xs text-primary font-medium flex items-center justify-between">
                    <span className="truncate">Demo Video Uploaded: {demoVideoUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoVideoUrl("");
                        setDemoType("embed");
                      }}
                      className="text-destructive hover:underline font-bold"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground">
                  Max file size limit is 500MB. Uploading a video sets your demo display strategy to native playback.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer controls */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || loading}
            className="inline-flex items-center space-x-1 px-4 py-2 border border-border text-sm font-semibold rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow transition-all"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow shadow-primary/20 disabled:opacity-50 transition-all"
            >
              <Save size={16} />
              <span>{loading ? "Submitting..." : "Publish Platform"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

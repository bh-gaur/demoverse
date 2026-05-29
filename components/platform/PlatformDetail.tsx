"use client";

import { useState } from "react";
import { Star, ShieldCheck, Heart, Users, Laptop, Play, BookOpen, Layers, DollarSign, MessageSquare, AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { PlatformWithRelations, Feature, PricingTier } from "@/types";
import { User } from "next-auth";
import DemoEmbed from "./DemoEmbed";
import DemoVideoPlayer from "./DemoVideoPlayer";
import ReviewList from "../reviews/ReviewList";

// Dynamic Icon Loader
function DynamicIcon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
}

interface PlatformDetailProps {
  platform: PlatformWithRelations;
  isBookmarked: boolean;
  onBookmarkToggle: () => Promise<void>;
  onRequestDemo: () => void;
  isLoggedIn: boolean;
  currentUser: User | null;
}

export default function PlatformDetail({
  platform,
  isBookmarked,
  onBookmarkToggle,
  onRequestDemo,
  isLoggedIn,
  currentUser,
}: PlatformDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "pricing" | "reviews" | "demo">("overview");
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [demoViewLogged, setDemoViewLogged] = useState(false);

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      alert("Please log in to bookmark platforms.");
      return;
    }
    setBookmarkLoading(true);
    await onBookmarkToggle();
    setBookmarkLoading(false);
  };

  const handleTabChange = (tab: "overview" | "features" | "pricing" | "reviews" | "demo") => {
    setActiveTab(tab);
    // Simulates logging the demo view counts when they open the demo tab
    if (tab === "demo" && !demoViewLogged) {
      setDemoViewLogged(true);
      // Optional analytics ping
    }
  };

  // Safe JSON Parsing helper
  const parseJson = (str: string, fallback: string[] = []) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  const teamSizes = parseJson(platform.teamSizeFit, ["1-10", "11-50"]);
  const hasVideo = !!platform.demoVideoUrl;

  return (
    <div className="space-y-8 pb-16">
      {/* Platform Cover Header */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        {/* Cover Color Strip */}
        <div
          className="h-32 md:h-48 w-full transition-colors"
          style={{ backgroundColor: platform.coverColor || "#1D9E75" }}
        />

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end md:space-x-6 -mt-10 md:-mt-12">
          {/* Logo */}
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-4 border-card bg-white shadow-md flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0 z-10">
            {platform.logoUrl ? (
              <img
                src={platform.logoUrl}
                alt={`${platform.name} logo`}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Laptop size={40} />
            )}
          </div>

          {/* Details */}
          <div className="mt-4 md:mt-0 flex-grow z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans">
                    {platform.name}
                  </h1>
                  {platform.verified && (
                    <span title="Verified Provider" className="flex items-center">
                      <ShieldCheck size={24} className="text-primary fill-primary/10" />
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium font-sans">
                  {platform.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 self-start md:self-auto">
                <button
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    isBookmarked
                      ? "border-red-200 dark:border-red-950 text-red-500 bg-red-50/50 dark:bg-red-950/20"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Heart size={16} className={isBookmarked ? "fill-red-500" : ""} />
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>

                {hasVideo ? (
                  <button
                    onClick={() => handleTabChange("demo")}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 shadow transition-all"
                  >
                    <Play size={16} className="fill-primary-foreground" />
                    <span>Watch Demo</span>
                  </button>
                ) : (
                  <button
                    onClick={onRequestDemo}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-primary text-primary hover:bg-primary/5 transition-all"
                  >
                    <span>Request Demo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-1 overflow-x-auto pb-px">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "features", label: "Features", icon: Layers },
            { id: "pricing", label: "Pricing", icon: DollarSign },
            { id: "reviews", label: "Reviews", icon: MessageSquare },
            ...(hasVideo || platform.demoUrl
              ? [{ id: "demo", label: "Watch Demo", icon: Play }]
              : []),
          ].map((tab) => {
            const TabIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as "overview" | "features" | "pricing" | "reviews" | "demo")}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-all outline-none whitespace-nowrap ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Main */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">About {platform.name}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {platform.description}
                </p>
              </div>

              {/* No Video Banner */}
              {!hasVideo && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-start space-x-3 text-left">
                    <AlertCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-primary text-sm sm:text-base">Want to see this platform in action?</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        There is no demo video uploaded for this platform yet. Submit a request to the vendor, and they will upload a demo video or contact you.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onRequestDemo}
                    className="flex-shrink-0 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
                  >
                    Request a recorded demo
                  </button>
                </div>
              )}
            </div>

            {/* Right Meta Column */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-foreground border-b border-border pb-3">Specs & Highlights</h3>

                {/* Rating */}
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">User Satisfaction</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      <Star size={18} className="fill-amber-500" />
                      <span className="font-bold text-foreground ml-1 text-base">
                        {platform.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({platform.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Category</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground mt-1">
                    {platform.category}
                  </span>
                </div>

                {/* Pricing Model */}
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Pricing Strategy</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground mt-1 capitalize">
                    {platform.pricingModel}
                  </span>
                </div>

                {/* Team Size Fit */}
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Recommended Team Size</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {teamSizes.map((size: string) => (
                      <span
                        key={size}
                        className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/10 font-medium"
                      >
                        <Users size={10} />
                        <span>{size}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="border-t border-border pt-4 mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Marketplace Activity</span>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Demo Views: <strong className="text-foreground">{platform.demoViewCount}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6">Product Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platform.features.map((feature: Feature) => (
                <div
                  key={feature.id}
                  className="flex items-start space-x-3.5 p-4 rounded-xl border border-border/65 bg-secondary/10"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                    <DynamicIcon name={feature.icon} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{feature.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {feature.description || "Core integration features built to optimize workspace operations."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto mb-4">
              <h3 className="text-lg font-bold text-foreground">Flexible Billing Options</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a plan tailored to your team scale. Pricing model: <span className="font-semibold capitalize">{platform.pricingModel}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platform.pricingTiers.map((tier: PricingTier) => {
                const tierFeatures = parseJson(tier.features, []);
                return (
                  <div
                    key={tier.id}
                    className={`rounded-2xl border p-6 flex flex-col relative h-full bg-card ${
                      tier.highlighted
                        ? "border-primary shadow-md ring-1 ring-primary/20"
                        : "border-border shadow-sm"
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                        Popular
                      </span>
                    )}

                    <h4 className="font-bold text-lg text-foreground mb-1">{tier.name}</h4>
                    <div className="flex items-baseline my-4 text-foreground">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {tier.price !== null ? `$${tier.price}` : "Custom"}
                      </span>
                      {tier.price !== null && (
                        <span className="text-xs text-muted-foreground ml-1">/{tier.period}</span>
                      )}
                    </div>

                    <ul className="space-y-2.5 my-6 flex-grow">
                      {tierFeatures.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start text-xs text-muted-foreground leading-relaxed">
                          <span className="text-primary mr-2 flex-shrink-0 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                        tier.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/20"
                          : "bg-secondary text-foreground hover:bg-accent border border-border"
                      }`}
                    >
                      {tier.price !== null ? "Get Started" : "Contact Sales"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <ReviewList
            platformId={platform.id}
            initialReviews={platform.reviews}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />
        )}

        {/* WATCH DEMO TAB */}
        {activeTab === "demo" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">Product Demonstration Sandbox</h3>
            {platform.demoType === "video" && platform.demoVideoUrl ? (
              <DemoVideoPlayer videoUrl={platform.demoVideoUrl} isActive={activeTab === "demo"} />
            ) : platform.demoUrl ? (
              <DemoEmbed demoUrl={platform.demoUrl} name={platform.name} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card text-center">
                <Laptop size={32} className="text-muted-foreground mb-2" />
                <span className="text-sm font-semibold">No demo sandbox is configured.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Star, ShieldCheck, Heart, ArrowRight, Play, CheckSquare, Square, Laptop } from "lucide-react";
import { useState } from "react";

import { Platform } from "@prisma/client";

interface PlatformCardProps {
  platform: Platform;
  isBookmarked: boolean;
  onBookmarkToggle: () => void | Promise<void>;
  isComparing: boolean;
  onCompareToggle: () => void;
  onRequestDemo: () => void;
  isLoggedIn: boolean;
}

export default function PlatformCard({
  platform,
  isBookmarked,
  onBookmarkToggle,
  isComparing,
  onCompareToggle,
  onRequestDemo,
  isLoggedIn,
}: PlatformCardProps) {
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please log in to bookmark platforms.");
      return;
    }
    setBookmarkLoading(true);
    await onBookmarkToggle();
    setBookmarkLoading(false);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCompareToggle();
  };

  const handleRequestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRequestDemo();
  };

  // Resolve cover background class or style
  const coverBgColor = platform.coverColor || "#1D9E75";

  return (
    <div className="premium-card relative flex flex-col overflow-hidden h-full">
      {/* Top Banner (Category specific color or preset coverColor) */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: coverBgColor }}
      />

      <div className="p-6 flex flex-col flex-grow">
        {/* Header (Logo + Title + Badges) */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {platform.logoUrl ? (
              <img
                src={platform.logoUrl}
                alt={`${platform.name} logo`}
                className="w-12 h-12 rounded-lg border border-border object-contain bg-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-border bg-accent flex items-center justify-center text-primary font-bold">
                <Laptop size={20} />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-base text-foreground font-sans line-clamp-1">
                  {platform.name}
                </h3>
                {platform.verified && (
                  <span title="Verified Vendor" className="flex items-center">
                    <ShieldCheck size={16} className="text-primary fill-primary/10 flex-shrink-0" />
                  </span>
                )}
              </div>
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mt-0.5">
                {platform.category}
              </span>
            </div>
          </div>

          {/* Bookmark Toggle */}
          <button
            onClick={handleBookmarkClick}
            disabled={bookmarkLoading}
            className={`p-1.5 rounded-lg border border-border bg-card hover:bg-accent transition-colors ${
              isBookmarked ? "text-red-500 hover:text-red-600 border-red-200 dark:border-red-950" : "text-muted-foreground hover:text-foreground"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            <Heart size={16} className={isBookmarked ? "fill-red-500" : ""} />
          </button>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-grow">
          {platform.tagline}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4 text-sm mb-6 pb-4 border-b border-border bg-card">
          <div className="flex items-center space-x-1 text-amber-500">
            <Star size={16} className="fill-amber-500" />
            <span className="font-bold text-foreground">{platform.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground text-xs">
            {platform.reviewCount} {platform.reviewCount === 1 ? "review" : "reviews"}
          </span>
          <span className="text-muted-foreground/30 text-xs">|</span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {platform.pricingModel}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 mt-auto">
          {/* Compare Selector & Request Demo */}
          <div className="flex justify-between items-center space-x-2">
            <button
              onClick={handleCompareClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                isComparing
                  ? "border-primary text-primary bg-primary/5 font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {isComparing ? <CheckSquare size={14} /> : <Square size={14} />}
              <span>Compare</span>
            </button>

            {platform.demoVideoUrl ? (
              <span className="text-xs font-semibold text-primary flex items-center space-x-1 px-2.5 py-1.5 bg-primary/10 rounded-full">
                <Play size={10} className="fill-primary" />
                <span>Demo Ready</span>
              </span>
            ) : (
              <button
                onClick={handleRequestClick}
                className="text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-primary/20 transition-all"
              >
                Request Demo
              </button>
            )}
          </div>

          {/* View Platform Details Link */}
          <Link
            href={`/platform/${platform.slug}`}
            className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground py-2.5 text-sm font-medium transition-all shadow-sm shadow-primary/5"
          >
            <span>Watch & Compare</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

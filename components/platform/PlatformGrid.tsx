"use client";

import PlatformCard from "./PlatformCard";
import { Laptop } from "lucide-react";

import { Platform } from "@prisma/client";

interface PlatformGridProps {
  platforms: Platform[];
  bookmarks: string[]; // List of platform IDs
  onBookmarkToggle: (platformId: string) => Promise<void>;
  compareList: Platform[]; // List of platforms currently being compared
  onCompareToggle: (platform: Platform) => void;
  onRequestDemo: (platform: Platform) => void;
  isLoggedIn: boolean;
}

export default function PlatformGrid({
  platforms,
  bookmarks,
  onBookmarkToggle,
  compareList,
  onCompareToggle,
  onRequestDemo,
  isLoggedIn,
}: PlatformGridProps) {
  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border bg-card rounded-2xl w-full">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-muted-foreground mb-4">
          <Laptop size={32} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No platforms found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No SaaS platforms matched your search or filters. Try adjusting your query parameters.
        </p>
      </div>
    );
  }

  const isPlatformComparing = (id: string) => {
    return compareList.some((p) => p.id === id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {platforms.map((platform) => (
        <PlatformCard
          key={platform.id}
          platform={platform}
          isBookmarked={bookmarks.includes(platform.id)}
          onBookmarkToggle={() => onBookmarkToggle(platform.id)}
          isComparing={isPlatformComparing(platform.id)}
          onCompareToggle={() => onCompareToggle(platform)}
          onRequestDemo={() => onRequestDemo(platform)}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
}

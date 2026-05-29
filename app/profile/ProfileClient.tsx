"use client";

import { useState } from "react";
import PlatformCard from "@/components/platform/PlatformCard";
import DemoRequestModal from "@/components/demo-request/DemoRequestModal";
import Link from "next/link";
import { Mail, ShieldAlert, Heart, Laptop, ArrowRight } from "lucide-react";
import { Platform } from "@/types";
import { Session } from "next-auth";

interface ProfileClientProps {
  session: Session;
  initialBookmarkedPlatforms: Platform[];
}

export default function ProfileClient({ session, initialBookmarkedPlatforms }: ProfileClientProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialBookmarkedPlatforms);
  const [selectedDemoPlatform, setSelectedDemoPlatform] = useState<Platform | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Remove bookmark directly from profile view
  const handleBookmarkToggle = async (platformId: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformId }),
      });
      if (response.ok) {
        setPlatforms(platforms.filter((p) => p.id !== platformId));
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  const handleRequestDemo = (platform: Platform) => {
    setSelectedDemoPlatform(platform);
    setIsRequestModalOpen(true);
  };

  const role = session.user.role || "user";

  return (
    <div className="space-y-8">
      {/* Account Info Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
            {session.user.name?.substring(0, 2) || "ME"}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-bold text-lg text-foreground flex items-center justify-center sm:justify-start space-x-1.5">
              <span>{session.user.name}</span>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1 justify-center sm:justify-start">
                <Mail size={12} />
                <span>{session.user.email}</span>
              </span>
              <span className="hidden sm:inline text-muted-foreground/30">|</span>
              <span className="flex items-center space-x-1 justify-center sm:justify-start capitalize font-semibold text-primary">
                <ShieldAlert size={12} />
                <span>Role: {role}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dash shortcuts */}
        {(role === "vendor" || role === "admin") && (
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-4 py-2 border border-primary text-primary hover:bg-primary/5 text-xs font-semibold rounded-lg text-center transition-all"
          >
            Go to Vendor Dashboard
          </Link>
        )}
      </div>

      {/* Bookmarked section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center space-x-2 border-b border-border pb-2">
          <Heart size={18} className="text-red-500 fill-red-500" />
          <span>My Bookmarked Platforms ({platforms.length})</span>
        </h3>

        {platforms.length === 0 ? (
          <div className="p-12 border border-dashed border-border bg-card rounded-2xl text-center text-muted-foreground text-sm max-w-xl">
            <Laptop size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">No bookmarked platforms yet</p>
            <p className="text-xs max-w-xs mx-auto mt-1">Explore platforms in the Discover feed and tap the heart icon to bookmark.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center space-x-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isBookmarked={true}
                onBookmarkToggle={() => handleBookmarkToggle(platform.id)}
                isComparing={false}
                onCompareToggle={() => {}}
                onRequestDemo={() => handleRequestDemo(platform)}
                isLoggedIn={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Demo request modal */}
      {selectedDemoPlatform && (
        <DemoRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedDemoPlatform(null);
          }}
          platform={selectedDemoPlatform}
          session={session}
          isLoggedIn={true}
        />
      )}
    </div>
  );
}

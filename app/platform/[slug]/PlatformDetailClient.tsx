"use client";

import { useState } from "react";
import PlatformDetail from "@/components/platform/PlatformDetail";
import DemoRequestModal from "@/components/demo-request/DemoRequestModal";
import { PlatformWithRelations } from "@/types";
import { Session } from "next-auth";

interface PlatformDetailClientProps {
  platform: PlatformWithRelations;
  isBookmarked: boolean;
  session: Session | null;
}

export default function PlatformDetailClient({
  platform,
  isBookmarked: initialBookmark,
  session,
}: PlatformDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmark);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleBookmarkToggle = async () => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformId: platform.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  return (
    <>
      <PlatformDetail
        platform={platform}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
        onRequestDemo={() => setIsRequestModalOpen(true)}
        isLoggedIn={!!session}
        currentUser={session?.user || null}
      />
      
      <DemoRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        platform={platform}
        session={session}
        isLoggedIn={!!session}
      />
    </>
  );
}

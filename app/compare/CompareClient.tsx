"use client";

import { useState } from "react";
import CompareTable from "@/components/compare/CompareTable";
import DemoRequestModal from "@/components/demo-request/DemoRequestModal";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PlatformWithRelations } from "@/types";
import { Session } from "next-auth";

interface CompareClientProps {
  initialPlatforms: PlatformWithRelations[];
  session: Session | null;
}

export default function CompareClient({ initialPlatforms, session }: CompareClientProps) {
  const [platforms, setPlatforms] = useState<PlatformWithRelations[]>(initialPlatforms);
  const [selectedDemoPlatform, setSelectedDemoPlatform] = useState<PlatformWithRelations | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRemove = (id: string) => {
    setPlatforms(platforms.filter((p) => p.id !== id));
  };

  const handleRequestDemo = (platform: PlatformWithRelations) => {
    setSelectedDemoPlatform(platform);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Discover</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-sans">
          Platform Comparison Matrix
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Compare pricing tiers, target scopes, capabilities, and customer ratings side-by-side.
        </p>
      </div>

      {/* Compare Table */}
      <CompareTable
        platforms={platforms}
        onRemove={handleRemove}
        onRequestDemo={handleRequestDemo}
      />

      {/* Request Demo Modal overlay */}
      {selectedDemoPlatform && (
        <DemoRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedDemoPlatform(null);
          }}
          platform={selectedDemoPlatform}
          session={session}
          isLoggedIn={!!session}
        />
      )}
    </div>
  );
}

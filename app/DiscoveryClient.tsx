"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PlatformGrid from "@/components/platform/PlatformGrid";
import ChatBot from "@/components/chatbot/ChatBot";
import DemoRequestModal from "@/components/demo-request/DemoRequestModal";
import Link from "next/link";
import { Columns, ArrowRight } from "lucide-react";

import { Platform } from "@prisma/client";
import { Session } from "next-auth";

interface DiscoveryClientProps {
  initialPlatforms: Platform[];
  initialBookmarks: string[]; // List of platform IDs
  session: Session | null;
}

export default function DiscoveryClient({
  initialPlatforms,
  initialBookmarks,
  session,
}: DiscoveryClientProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricingModel, setSelectedPricingModel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bookmark list state (local sync)
  const [bookmarks, setBookmarks] = useState<string[]>(initialBookmarks);

  // Compare list state (up to 3 platforms)
  const [compareList, setCompareList] = useState<Platform[]>([]);

  // Demo request modal state
  const [selectedDemoPlatform, setSelectedDemoPlatform] = useState<Platform | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const categories = ["CRM", "Analytics", "Dev Tools", "HR", "Marketing", "Finance"];
  const pricingModels = [
    { label: "All Pricing Models", value: "all" },
    { label: "Free", value: "free" },
    { label: "Freemium", value: "freemium" },
    { label: "Paid Plan", value: "paid" },
    { label: "Custom Contract", value: "custom" },
  ];

  // Bookmark Toggle action
  const handleBookmarkToggle = async (platformId: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformId }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.bookmarked) {
          setBookmarks([...bookmarks, platformId]);
        } else {
          setBookmarks(bookmarks.filter((id) => id !== platformId));
        }
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };

  // Compare list actions
  const handleCompareToggle = (platform: Platform) => {
    const isAlreadyAdded = compareList.some((p) => p.id === platform.id);
    if (isAlreadyAdded) {
      setCompareList(compareList.filter((p) => p.id !== platform.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 platforms side-by-side.");
        return;
      }
      setCompareList([...compareList, platform]);
    }
  };

  // Open demo request modal
  const handleRequestDemo = (platform: Platform) => {
    setSelectedDemoPlatform(platform);
    setIsRequestModalOpen(true);
  };

  // Filter & Search Logic
  const filteredPlatforms = initialPlatforms.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesPricing = selectedPricingModel === "all" || p.pricingModel === selectedPricingModel;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.tagline.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);

    return matchesCategory && matchesPricing && matchesSearch;
  });

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedPricingModel("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-8 relative">
      {/* Intro Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 py-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans">
          Discover B2B SaaS in <span className="text-primary">Action</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Skip sales pitches. Watch recorded developer walkthroughs, explore interactive software sandboxes, and compare features side-by-side.
        </p>
      </div>

      {/* Compare floating bar overlay if platforms are selected */}
      {compareList.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card border border-primary/30 rounded-full px-6 py-3 shadow-2xl flex items-center space-x-6 z-30 animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="flex items-center space-x-3">
            <Columns size={16} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Comparing {compareList.length} of 3 platforms
            </span>
          </div>

          <div className="flex -space-x-2">
            {compareList.map((p) => (
              <div
                key={p.id}
                className="w-7 h-7 rounded-full bg-secondary border border-background text-[10px] font-bold flex items-center justify-center text-primary cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all"
                onClick={() => handleCompareToggle(p)}
                title={`Remove ${p.name}`}
              >
                {p.name.substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>

          <Link
            href={{
              pathname: "/compare",
              query: { ids: compareList.map((p) => p.id).join(",") },
            }}
            className="flex items-center space-x-1 px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-full transition-all shadow"
          >
            <span>Compare Now</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Layout Content Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          pricingModels={pricingModels}
          selectedPricingModel={selectedPricingModel}
          setSelectedPricingModel={setSelectedPricingModel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReset={handleResetFilters}
        />

        {/* Platform Listing */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground font-semibold">
              Showing {filteredPlatforms.length} platform{filteredPlatforms.length !== 1 && "s"}
            </span>
          </div>
          <PlatformGrid
            platforms={filteredPlatforms}
            bookmarks={bookmarks}
            onBookmarkToggle={handleBookmarkToggle}
            compareList={compareList}
            onCompareToggle={handleCompareToggle}
            onRequestDemo={handleRequestDemo}
            isLoggedIn={!!session}
          />
        </div>
      </div>

      {/* Floating Chatbot Matchmaker */}
      <ChatBot platforms={initialPlatforms} />

      {/* Request Demo video Modal overlay */}
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

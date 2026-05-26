"use client";

import { Star, Bookmark, Play } from "lucide-react";
import { Platform } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface PlatformCardProps {
  platform: Platform;
  onRequestDemo?: () => void;
}

export function PlatformCard({ platform, onRequestDemo }: PlatformCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="card group">
      <div
        className="h-24 rounded-lg mb-4"
        style={{ backgroundColor: platform.coverColor }}
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <Link href={`/platform/${platform.slug}`}>
            <h3 className="font-bold text-lg hover:text-primary transition">
              {platform.name}
            </h3>
          </Link>
          <p className="text-sm text-muted">{platform.tagline}</p>
        </div>
        {platform.verified && (
          <span className="text-xs bg-primary text-white px-2 py-1 rounded">
            Verified
          </span>
        )}
      </div>

      <p className="text-sm text-muted mb-4 line-clamp-2">
        {platform.description}
      </p>

      <div className="flex items-center gap-1 mb-4">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{platform.rating.toFixed(1)}</span>
        <span className="text-sm text-muted">
          ({platform.reviewCount} reviews)
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRequestDemo}
          className="btn-secondary flex-1 text-sm"
        >
          Request demo
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="btn-secondary p-2"
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark
            size={16}
            className={isBookmarked ? "fill-current" : ""}
          />
        </button>
        {platform.demoVideoUrl && (
          <Link
            href={`/platform/${platform.slug}`}
            className="btn-secondary p-2"
            title="Watch demo"
          >
            <Play size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

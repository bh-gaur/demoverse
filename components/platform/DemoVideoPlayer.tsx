"use client";

import { useEffect, useRef } from "react";
import { Film } from "lucide-react";

interface DemoVideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
}

export default function DemoVideoPlayer({ videoUrl, isActive }: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause the video immediately if the tab becomes inactive
  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card text-center">
        <Film size={32} className="text-muted-foreground mb-2" />
        <span className="text-sm font-semibold">No demo video uploaded yet.</span>
      </div>
    );
  }

  // Prepend application path if relative uploads route is used
  const fullVideoUrl = videoUrl.startsWith("/") ? videoUrl : `/${videoUrl}`;

  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-black shadow-lg relative aspect-video flex items-center justify-center">
      {/* We only render the video source when active, ensuring lazy load */}
      {isActive ? (
        <video
          ref={videoRef}
          src={fullVideoUrl}
          controls
          preload="metadata"
          className="w-full h-full object-contain"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-zinc-950">
          <Film size={48} className="animate-pulse text-primary mb-2" />
          <span className="text-sm font-medium">Click the Watch tab to play demo video</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";

interface DemoEmbedProps {
  demoUrl: string;
  name: string;
}

export default function DemoEmbed({ demoUrl, name }: DemoEmbedProps) {
  // Simple check for relative or absolute paths, default to https:// if missing protocol
  const absoluteUrl = demoUrl.startsWith("http://") || demoUrl.startsWith("https://")
    ? demoUrl
    : `https://${demoUrl}`;

  return (
    <div className="w-full flex flex-col border border-border rounded-xl overflow-hidden bg-card shadow-inner">
      {/* Browser Mockup Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>

        {/* Address Input Bar */}
        <div className="bg-background text-muted-foreground text-xs px-4 py-1.5 rounded-md border border-border w-2/3 md:w-1/2 text-center select-all flex items-center justify-center space-x-1 truncate font-mono">
          <ShieldCheck size={12} className="text-primary" />
          <span className="truncate">{absoluteUrl}</span>
        </div>

        {/* Open In New Tab Link */}
        <a
          href={absoluteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary flex items-center space-x-1 transition-colors"
          title="Open interactive demo in new window"
        >
          <span className="hidden sm:inline">Open sandbox</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Frame Embed Container */}
      <div className="relative aspect-video w-full bg-slate-50 dark:bg-zinc-950 flex items-center justify-center min-h-[400px]">
        {/* We use an actual iframe containing the URL */}
        <iframe
          src={absoluteUrl}
          title={`${name} Interactive Sandbox Sandbox`}
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  );
}

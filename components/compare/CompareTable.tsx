"use client";

import Link from "next/link";
import { Star, ShieldCheck, X, ArrowRight, Play, Laptop } from "lucide-react";

import { PlatformWithRelations, PricingTier } from "@/types";

interface CompareTableProps {
  platforms: PlatformWithRelations[];
  onRemove: (id: string) => void;
  onRequestDemo: (platform: PlatformWithRelations) => void;
}

export default function CompareTable({ platforms, onRemove, onRequestDemo }: CompareTableProps) {
  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border bg-card rounded-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-muted-foreground mb-4">
          <Laptop size={32} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No platforms selected</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Go back to the Discover feed and select &quot;Compare&quot; on up to 3 platforms to evaluate them side-by-side.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-1 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow transition-all"
        >
          Browse Platforms
        </Link>
      </div>
    );
  }

  const parseJson = (str: string, fallback: string[] = []) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  return (
    <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {/* Spec Labels Column */}
            <th className="p-4 w-1/4 font-semibold text-sm text-muted-foreground min-w-[200px]">
              Features Matrix ({platforms.length}/3)
            </th>

            {/* Platform Columns */}
            {platforms.map((platform) => (
              <th
                key={platform.id}
                className="p-4 w-1/4 min-w-[250px] relative border-l border-border"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(platform.id)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  title="Remove from comparison"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center space-x-3 pr-6">
                  {platform.logoUrl ? (
                    <img
                      src={platform.logoUrl}
                      alt={platform.name}
                      className="w-10 h-10 rounded-lg border border-border object-contain bg-white flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-border bg-accent text-primary flex items-center justify-center font-bold flex-shrink-0">
                      <Laptop size={18} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center space-x-1">
                      <span>{platform.name}</span>
                      {platform.verified && (
                        <ShieldCheck size={14} className="text-primary fill-primary/10 flex-shrink-0" />
                      )}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {platform.category}
                    </span>
                  </div>
                </div>
              </th>
            ))}

            {/* Empty Columns Filler to keep 4-column symmetry */}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <th key={i} className="p-4 w-1/4 min-w-[250px] border-l border-border bg-secondary/5" />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {/* Row 1: Tagline */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Tagline</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border text-muted-foreground text-xs leading-relaxed">
                {p.tagline}
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 2: Rating */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Rating</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-foreground">{p.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({p.reviewCount} reviews)</span>
                </div>
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 3: Pricing Strategy */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Pricing Model</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border capitalize text-foreground font-medium">
                {p.pricingModel}
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 4: Pricing Tiers */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Pricing Tiers</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border space-y-2">
                {p.pricingTiers && p.pricingTiers.length > 0 ? (
                  (p.pricingTiers as unknown as PricingTier[]).map((t) => {
                    return (
                      <div key={t.id} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{t.name}</span>
                        <span className="font-semibold text-foreground">
                          {t.price !== null ? `$${t.price}/${t.period}` : "Custom"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-muted-foreground">No pricing data</span>
                )}
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 5: Team Size Fit */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Team Size Fit</td>
            {platforms.map((p) => {
              const sizes = parseJson(p.teamSizeFit, []);
              return (
                <td key={p.id} className="p-4 border-l border-border">
                  <div className="flex flex-wrap gap-1">
                    {sizes.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-secondary text-foreground font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              );
            })}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 6: Core Features */}
          <tr>
            <td className="p-4 font-semibold text-muted-foreground">Key Features</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border">
                <ul className="space-y-1.5 list-disc list-inside text-xs text-muted-foreground">
                  {p.features && p.features.length > 0 ? (
                    p.features.map((f) => <li key={f.id} className="truncate" title={f.name}>{f.name}</li>)
                  ) : (
                    <li>Standard integrations</li>
                  )}
                </ul>
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>

          {/* Row 7: Actions */}
          <tr className="bg-secondary/10">
            <td className="p-4 font-semibold text-muted-foreground">Operations</td>
            {platforms.map((p) => (
              <td key={p.id} className="p-4 border-l border-border">
                <div className="space-y-2">
                  {p.demoVideoUrl ? (
                    <span className="text-[10px] font-semibold text-primary flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-full w-fit">
                      <Play size={8} className="fill-primary" />
                      <span>Demo Ready</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onRequestDemo(p)}
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition-all border border-border rounded px-2.5 py-1 hover:bg-primary/5 block w-fit"
                    >
                      Request Demo
                    </button>
                  )}
                  <Link
                    href={`/platform/${p.slug}`}
                    className="flex items-center space-x-1 text-xs text-primary font-semibold hover:underline"
                  >
                    <span>View Sandbox</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </td>
            ))}
            {Array.from({ length: 3 - platforms.length }).map((_, i) => (
              <td key={i} className="p-4 border-l border-border bg-secondary/5" />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

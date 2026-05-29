import { Platform, Feature, PricingTier, Review, User, Bookmark, DemoRequest } from "@prisma/client";

export type { Platform, Feature, PricingTier, Review, User, Bookmark, DemoRequest };

export type PlatformWithRelations = Platform & {
  features: Feature[];
  pricingTiers: PricingTier[];
  reviews: ReviewWithUser[];
};

export type ReviewWithUser = Review & {
  user: {
    name: string;
  };
};

export type DemoRequestWithPlatform = DemoRequest & {
  platform: {
    name: string;
  } | null;
};

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
  isFallback?: boolean;
}

export interface Recommendation {
  slug: string;
  name: string;
  fitScore: number;
  reason: string;
  matchingFeatures: string[];
}

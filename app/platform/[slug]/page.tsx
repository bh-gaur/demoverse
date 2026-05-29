import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 0;

interface PlatformPageProps {
  params: {
    slug: string;
  };
}

export default async function PlatformPage({ params }: PlatformPageProps) {
  const { slug } = params;

  // Retrieve platform by slug
  const platform = await prisma.platform.findUnique({
    where: { slug },
    include: {
      features: true,
      pricingTiers: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!platform) {
    notFound();
  }

  // Increment demo view count when page loads
  await prisma.platform.update({
    where: { id: platform.id },
    data: {
      demoViewCount: {
        increment: 1,
      },
    },
  });

  const session = await auth();
  let isBookmarked = false;

  if (session?.user) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_platformId: {
          userId: session.user.id,
          platformId: platform.id,
        },
      },
    });
    isBookmarked = !!bookmark;
  }



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

      <PlatformDetailWrapper
        platform={platform}
        isBookmarked={isBookmarked}
        session={session}
      />
    </div>
  );
}

// Simple Client wrapper helper inside page to hold the modal trigger state
import PlatformDetailClient from "./PlatformDetailClient";
import { PlatformWithRelations } from "@/types";
import { Session } from "next-auth";

function PlatformDetailWrapper({ platform, isBookmarked, session }: { platform: PlatformWithRelations; isBookmarked: boolean; session: Session | null }) {
  return (
    <PlatformDetailClient
      platform={platform}
      isBookmarked={isBookmarked}
      session={session}
    />
  );
}

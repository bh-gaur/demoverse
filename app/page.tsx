import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import DiscoveryClient from "./DiscoveryClient";

// Forces database fetching on every reload (SSR)
export const revalidate = 0;

export default async function HomePage() {
  // Retrieve SaaS platforms and their related records
  const platforms = await prisma.platform.findMany({
    include: {
      features: true,
      pricingTiers: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get active session
  const session = await auth();
  let initialBookmarks: string[] = [];

  if (session?.user) {
    const userBookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      select: { platformId: true },
    });
    initialBookmarks = userBookmarks.map((b) => b.platformId);
  }

  return (
    <DiscoveryClient
      initialPlatforms={platforms}
      initialBookmarks={initialBookmarks}
      session={session}
    />
  );
}

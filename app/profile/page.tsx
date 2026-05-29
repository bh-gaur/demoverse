import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await auth();

  // Authentication barrier
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch bookmarked platforms
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      platform: {
        include: {
          features: true,
          pricingTiers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const bookmarkedPlatforms = bookmarks.map((b) => b.platform);

  return (
    <ProfileClient
      session={session}
      initialBookmarkedPlatforms={bookmarkedPlatforms}
    />
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import CompareClient from "./CompareClient";
import { PlatformWithRelations } from "@/types";

export const revalidate = 0;

interface ComparePageProps {
  searchParams: {
    ids?: string;
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const idsString = searchParams.ids || "";
  const ids = idsString.split(",").filter((id) => id.trim() !== "");

  let platforms: PlatformWithRelations[] = [];

  if (ids.length > 0) {
    platforms = await prisma.platform.findMany({
      where: {
        id: {
          in: ids,
        },
      },
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
        },
      },
    });
  }

  const session = await auth();

  return <CompareClient initialPlatforms={platforms} session={session} />;
}

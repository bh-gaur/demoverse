import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const platform = await prisma.platform.findUnique({
      where: { slug },
      include: {
        features: true,
        pricingTiers: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
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
      return NextResponse.json({ error: "Platform not found" }, { status: 404 });
    }

    // Increment demo view count when retrieved (simulates user looking at platform)
    await prisma.platform.update({
      where: { id: platform.id },
      data: {
        demoViewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(platform);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch platform details", details: message },
      { status: 500 }
    );
  }
}

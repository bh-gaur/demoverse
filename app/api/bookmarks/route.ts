import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/bookmarks
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
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

    const platforms = bookmarks.map((b) => b.platform);
    return NextResponse.json(platforms);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch bookmarks", details: message },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platformId } = body;

    if (!platformId) {
      return NextResponse.json({ error: "Platform ID is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if the bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_platformId: {
          userId,
          platformId,
        },
      },
    });

    if (existingBookmark) {
      // Delete bookmark
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
      return NextResponse.json({ success: true, bookmarked: false });
    } else {
      // Create bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          platformId,
        },
      });
      return NextResponse.json({ success: true, bookmarked: true });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

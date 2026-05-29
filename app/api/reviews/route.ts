import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  platformId: z.string().min(1, "Platform ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  body: z.string().min(10, "Review must be at least 10 characters long"),
  role: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const userId = session.user.id;

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        platformId: data.platformId,
        userId: userId,
        rating: data.rating,
        body: data.body,
        role: data.role || null,
        company: data.company || null,
      },
    });

    // Re-calculate rating and reviewCount for this platform
    const platformReviews = await prisma.review.findMany({
      where: { platformId: data.platformId },
    });

    const reviewCount = platformReviews.length;
    const totalRating = platformReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRating / reviewCount).toFixed(1));

    await prisma.platform.update({
      where: { id: data.platformId },
      data: {
        reviewCount,
        rating: averageRating,
      },
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Review creation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const demoRequestSchema = z.object({
  platformId: z.string().min(1, "Platform ID is required"),
  requesterName: z.string().min(2, "Name must be at least 2 characters"),
  requesterEmail: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  teamSize: z.enum(["1-10", "11-50", "51-200", "200+"]),
  useCase: z.string().min(10, "Use case description must be at least 10 characters").max(300, "Use case cannot exceed 300 characters"),
  preferredFormat: z.enum(["live", "recorded", "either"]),
});

const statusUpdateSchema = z.object({
  id: z.string().min(1, "Request ID is required"),
  status: z.enum(["pending", "responded", "fulfilled"]),
});

// POST /api/demo-request (Submit a new request)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    
    const result = demoRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const userId = session?.user?.id || null;

    // Create the Demo Request record in DB
    const newRequest = await prisma.demoRequest.create({
      data: {
        platformId: data.platformId,
        userId: userId,
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
        company: data.company,
        teamSize: data.teamSize,
        useCase: data.useCase,
        preferredFormat: data.preferredFormat,
        status: "pending", // Always defaults to pending
      },
    });

    return NextResponse.json({ success: true, requestId: newRequest.id });
  } catch (error) {
    console.error("Demo Request submission error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

// PATCH /api/demo-request (Update status - Vendor Action)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "vendor" && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only vendors/admins can manage demo requests" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = statusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { id, status } = result.data;

    // Update the request status
    const updatedRequest = await prisma.demoRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.error("Demo Request PATCH error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

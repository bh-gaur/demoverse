import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Zod validation schema for platform submission
const platformSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  logoUrl: z.string().url("Invalid Logo URL").optional().or(z.literal("")),
  coverColor: z.string().min(4, "Cover color is required"),
  demoUrl: z.string().url("Invalid Demo URL").optional().or(z.literal("")),
  demoType: z.enum(["embed", "video", "none"]),
  teamSizeFit: z.array(z.string()).min(1, "Select at least one team size fit"),
  pricingModel: z.string().min(1, "Pricing model is required"),
  features: z.array(
    z.object({
      name: z.string().min(1, "Feature name is required"),
      icon: z.string().min(1, "Feature icon name is required"),
      description: z.string().optional(),
    })
  ).min(1, "Provide at least one feature"),
  pricingTiers: z.array(
    z.object({
      name: z.string().min(1, "Tier name is required"),
      price: z.number().nullable().optional(),
      period: z.string().default("month"),
      features: z.array(z.string()).min(1, "Provide at least one tier feature"),
      highlighted: z.boolean().default(false),
    })
  ).min(1, "Provide at least one pricing tier"),
});

// GET /api/platforms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const pricingModel = searchParams.get("pricingModel");
    const q = searchParams.get("q");

    const where: {
      category?: string;
      pricingModel?: string;
      OR?: {
        name?: { contains: string };
        tagline?: { contains: string };
        description?: { contains: string };
      }[];
    } = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (pricingModel && pricingModel !== "all") {
      where.pricingModel = pricingModel;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { tagline: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const platforms = await prisma.platform.findMany({
      where,
      include: {
        features: true,
        pricingTiers: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(platforms);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch platforms", details: message },
      { status: 500 }
    );
  }
}

// POST /api/platforms
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow vendor and admin roles to submit platforms
    const role = session.user.role;
    if (role !== "vendor" && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only vendors or admins can submit platforms" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = platformSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if slug is unique
    const existing = await prisma.platform.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A platform with the name "${data.name}" already exists.` },
        { status: 400 }
      );
    }

    // Create the platform and its related Features and Tiers in a transaction
    const newPlatform = await prisma.$transaction(async (tx) => {
      const plat = await tx.platform.create({
        data: {
          name: data.name,
          slug,
          tagline: data.tagline,
          description: data.description,
          category: data.category,
          logoUrl: data.logoUrl || null,
          coverColor: data.coverColor,
          demoUrl: data.demoUrl || null,
          demoType: data.demoType,
          teamSizeFit: JSON.stringify(data.teamSizeFit),
          pricingModel: data.pricingModel,
          rating: 0,
          reviewCount: 0,
          verified: false, // Submitted platforms need admin verification
        },
      });

      // Insert Features
      for (const feat of data.features) {
        await tx.feature.create({
          data: {
            name: feat.name,
            icon: feat.icon,
            description: feat.description || "",
            platformId: plat.id,
          },
        });
      }

      // Insert Pricing Tiers
      for (const tier of data.pricingTiers) {
        await tx.pricingTier.create({
          data: {
            name: tier.name,
            price: tier.price !== undefined ? tier.price : null,
            period: tier.period,
            features: JSON.stringify(tier.features),
            highlighted: tier.highlighted,
            platformId: plat.id,
          },
        });
      }

      return plat;
    });

    return NextResponse.json({ success: true, slug: newPlatform.slug, id: newPlatform.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Platform Submission Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

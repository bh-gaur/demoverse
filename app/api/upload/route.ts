import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "vendor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Only vendors/admins can upload files" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "logo" or "video"
    const platformId = formData.get("platformId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || (type !== "logo" && type !== "video")) {
      return NextResponse.json({ error: "Invalid upload type. Must be 'logo' or 'video'." }, { status: 400 });
    }

    // Enforce file size limit
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sizeMB = buffer.length / (1024 * 1024);
    const maxVideoSize = parseInt(process.env.MAX_VIDEO_SIZE_MB || "500", 10);
    const maxLogoSize = 5; // 5MB limit for logos

    if (type === "video" && sizeMB > maxVideoSize) {
      return NextResponse.json({ error: `Video file exceeds max size limit of ${maxVideoSize}MB.` }, { status: 400 });
    }

    if (type === "logo" && sizeMB > maxLogoSize) {
      return NextResponse.json({ error: `Logo file exceeds max size limit of ${maxLogoSize}MB.` }, { status: 400 });
    }

    // Validate file extensions
    const ext = path.extname(file.name).toLowerCase();
    if (type === "video" && !['.mp4', '.webm', '.mov'].includes(ext)) {
      return NextResponse.json({ error: "Invalid video format. Only .mp4, .webm, and .mov are allowed." }, { status: 400 });
    }
    if (type === "logo" && !['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(ext)) {
      return NextResponse.json({ error: "Invalid logo format. Only .png, .jpg, .jpeg, .svg, and .webp are allowed." }, { status: 400 });
    }

    // Prepare storage path
    const uploadBaseDir = path.resolve(process.env.UPLOAD_DIR || "./public/uploads");
    const subfolder = type === "logo" ? "logos" : "videos";
    const targetDir = path.join(uploadBaseDir, subfolder);

    // Create directories if missing
    await fs.mkdir(targetDir, { recursive: true });

    // Generate unique name
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(targetDir, uniqueFilename);

    // Write file to filesystem
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subfolder}/${uniqueFilename}`;

    // If platformId is provided, update the platform model directly
    if (platformId) {
      if (type === "video") {
        await prisma?.platform.update({
          where: { id: platformId },
          data: {
            demoVideoUrl: publicUrl,
            demoType: "video",
          },
        });
      } else if (type === "logo") {
        await prisma?.platform.update({
          where: { id: platformId },
          data: {
            logoUrl: publicUrl,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error during upload", details: message },
      { status: 500 }
    );
  }
}

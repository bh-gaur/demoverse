import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/claude";
import { z } from "zod";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).min(1, "Chat messages history is required"),
  platformCatalog: z.array(z.any()).min(1, "Platform catalog is required"),
  userAnswers: z.record(z.string(), z.any()).default({}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = chatRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { messages, platformCatalog, userAnswers } = result.data;

    // Call the Claude AI integration helper (which supports offline fallback internally)
    const aiResponse = await getRecommendations(messages, platformCatalog, userAnswers);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("AI Matchmaker Route Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

import { Platform, Feature } from "@prisma/client";

export interface Recommendation {
  slug: string;
  name: string;
  fitScore: number;
  reason: string;
  matchingFeatures: string[];
}

export interface ChatBotResponse {
  recommendations: Recommendation[];
  followUpAnswer: string | null;
  isFallback?: boolean;
}

export async function getRecommendations(
  chatHistory: { role: "user" | "assistant"; content: string }[],
  platformCatalog: (Platform & { features: Feature[] })[],
  userAnswers: Record<string, string>
): Promise<ChatBotResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback if API key is not provided or is a placeholder
  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    // Return offline fallback recommendation
    const sortedPlatforms = [...platformCatalog]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const recommendations: Recommendation[] = sortedPlatforms.map((p, index) => {
      // Extract up to 3 features
      const features = Array.isArray(p.features)
        ? p.features.slice(0, 3).map((f) => f.name)
        : ["Core Dashboard", "Integrations", "Security"];

      return {
        slug: p.slug,
        name: p.name,
        fitScore: 10 - index, // 10, 9, 8
        reason: `Based on your selection, ${p.name} is a top-rated platform (rating: ${p.rating}) and a leading choice in the ${p.category} category.`,
        matchingFeatures: features,
      };
    });

    return {
      recommendations,
      followUpAnswer: "AI matchmaking is currently offline — please add your Gemini API key to `.env` to enable live reasoning. In the meantime, I've matched you with our top-rated platforms!",
      isFallback: true,
    };
  }

  const systemPrompt = `You are DemoVerse AI, an expert B2B SaaS consultant embedded in a platform discovery marketplace. You have access to a catalog of platforms passed in the user message. Your job: recommend the top 3 platforms best suited to the user's needs based on their answers. For each recommendation respond ONLY with valid JSON, no markdown, no explanation outside the JSON:
{ 
  "recommendations": [
    { 
      "slug": "string", 
      "name": "string", 
      "fitScore": number (1-10), 
      "reason": "string (1 sentence)", 
      "matchingFeatures": ["string", "string", "string"]
    }
  ],
  "followUpAnswer": "string | null"  
}
For follow-up questions after recommendations, put your answer in followUpAnswer and return an empty recommendations array.`;

  // Prepare input message content
  const formattedCatalog = platformCatalog.map(p => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    tagline: p.tagline,
    rating: p.rating,
    pricingModel: p.pricingModel,
    teamSizeFit: p.teamSizeFit,
    features: Array.isArray(p.features) ? p.features.map((f) => f.name) : []
  }));

  const payloadContent = `Here is the catalog of B2B platforms:
${JSON.stringify(formattedCatalog, null, 2)}

User survey answers (for recommendation context):
${JSON.stringify(userAnswers, null, 2)}

Conversation history between User and you:
${JSON.stringify(chatHistory, null, 2)}

Analyze the history and user answers. Make your top 3 recommendations or answer follow-up queries. Provide ONLY raw valid JSON matching the requested schema.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: payloadContent,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Status:", response.status, errorText);
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const assistantContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean markdown code blocks if the model wrapped it in ```json ... ```
    let cleanJson = assistantContent.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.substring(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    cleanJson = cleanJson.trim();

    // Find the first '{' and last '}' to extract JSON block safely
    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.slice(firstBrace, lastBrace + 1);
    }

    const parsedResponse = JSON.parse(cleanJson) as ChatBotResponse;
    return {
      recommendations: parsedResponse.recommendations || [],
      followUpAnswer: parsedResponse.followUpAnswer || null,
      isFallback: false,
    };
  } catch (error) {
    console.error("AI Matchmaker Exception:", error);
    // Return fallback if API call fails
    return {
      recommendations: platformCatalog
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((p, index) => ({
          slug: p.slug,
          name: p.name,
          fitScore: 10 - index,
          reason: `Auto-recommended because ${p.name} matches your profile (Rating: ${p.rating}).`,
          matchingFeatures: Array.isArray(p.features)
            ? p.features.slice(0, 3).map((f) => f.name)
            : ["General Feature"],
        })),
      followUpAnswer: "Note: AI matchmaking service encountered an issue. Reverted to offline mode. Here are the top-rated platforms.",
      isFallback: true,
    };
  }
}

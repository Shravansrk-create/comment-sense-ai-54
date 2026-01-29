import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalysisResult {
  overallSentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  rating: number;
  themes: {
    name: string;
    sentiment: "positive" | "neutral" | "negative";
    count: number;
  }[];
  pros: string[];
  cons: string[];
  summary: string;
  recommendation: string;
  totalComments: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchYouTubeComments(videoId: string, apiKey: string): Promise<string[]> {
  const comments: string[] = [];
  let pageToken = "";
  let fetched = 0;
  const maxComments = 100;

  try {
    while (fetched < maxComments) {
      const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("videoId", videoId);
      url.searchParams.set("maxResults", "100");
      url.searchParams.set("order", "relevance");
      url.searchParams.set("key", apiKey);
      if (pageToken) {
        url.searchParams.set("pageToken", pageToken);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error = await response.json();
        console.error("YouTube API error:", error);
        throw new Error(error.error?.message || "Failed to fetch YouTube comments");
      }

      const data = await response.json();
      
      for (const item of data.items || []) {
        const comment = item.snippet?.topLevelComment?.snippet?.textOriginal;
        if (comment) {
          comments.push(comment);
          fetched++;
          if (fetched >= maxComments) break;
        }
      }

      pageToken = data.nextPageToken || "";
      if (!pageToken) break;
    }
  } catch (error) {
    console.error("Error fetching YouTube comments:", error);
    throw error;
  }

  return comments;
}

async function analyzeWithAI(comments: string[]): Promise<AnalysisResult> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const commentsText = comments.slice(0, 50).join("\n---\n");

  const systemPrompt = `You are an expert sentiment analyst. Analyze the following comments/reviews and provide a comprehensive analysis.

Return your analysis as a JSON object with this exact structure:
{
  "overallSentiment": "positive" | "neutral" | "negative",
  "sentimentScore": number between 0 and 100,
  "rating": number between 1 and 5 (can have decimals like 4.2),
  "themes": [
    { "name": "theme name", "sentiment": "positive" | "neutral" | "negative", "count": number }
  ],
  "pros": ["pro 1", "pro 2", ...],
  "cons": ["con 1", "con 2", ...],
  "summary": "A 2-3 sentence natural language summary of the overall sentiment",
  "recommendation": "One of: Worth it / Mixed reviews / Not recommended",
  "sentimentBreakdown": {
    "positive": percentage,
    "neutral": percentage,
    "negative": percentage
  }
}

Themes should identify common topics like: quality, value, performance, usability, support, delivery, content, entertainment, etc.
Limit to 5-6 themes max.
Pros and cons should be 3-5 items each.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze these ${comments.length} comments:\n\n${commentsText}` },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Please add funds to continue.");
    }
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error("Failed to analyze comments with AI");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from AI");
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  try {
    const result = JSON.parse(jsonStr.trim());
    return {
      ...result,
      totalComments: comments.length,
    };
  } catch (e) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse AI analysis result");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    
    // Check if it's a YouTube URL
    const videoId = extractYouTubeVideoId(url);
    
    if (videoId) {
      if (!YOUTUBE_API_KEY) {
        return new Response(
          JSON.stringify({ error: "YouTube API key not configured. Please add YOUTUBE_API_KEY in settings." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Fetching comments for video:", videoId);
      const comments = await fetchYouTubeComments(videoId, YOUTUBE_API_KEY);

      if (comments.length === 0) {
        return new Response(
          JSON.stringify({ error: "No comments found for this video. Comments may be disabled." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Fetched ${comments.length} comments, analyzing...`);
      const analysis = await analyzeWithAI(comments);

      return new Response(
        JSON.stringify({ success: true, data: analysis }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For non-YouTube URLs, return a demo analysis
    // In production, you would integrate product review APIs here
    return new Response(
      JSON.stringify({ 
        error: "Currently only YouTube URLs are supported. Product review support coming soon!" 
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-comments:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

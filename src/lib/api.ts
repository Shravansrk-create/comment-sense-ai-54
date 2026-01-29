import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult } from "@/types/analysis";

interface ApiResponse {
  success?: boolean;
  data?: AnalysisResult;
  error?: string;
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke<ApiResponse>("analyze-comments", {
    body: { url },
  });

  if (error) {
    throw new Error(error.message || "Failed to analyze URL");
  }

  if (!data) {
    throw new Error("No response received from analysis");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.success || !data.data) {
    throw new Error("Analysis failed");
  }

  return data.data;
}

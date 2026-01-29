export interface AnalysisResult {
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

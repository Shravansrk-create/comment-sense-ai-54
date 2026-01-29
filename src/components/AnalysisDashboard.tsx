import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SentimentGauge } from "./SentimentGauge";
import { RatingDisplay } from "./RatingDisplay";
import { ProsConsList } from "./ProsConsList";
import { ThemesDisplay } from "./ThemesDisplay";
import { SummaryCard } from "./SummaryCard";
import { SentimentBreakdown } from "./SentimentBreakdown";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

export function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 card-gradient">
          <SentimentGauge
            score={result.sentimentScore}
            sentiment={result.overallSentiment}
          />
        </Card>

        <Card className="p-6 card-gradient flex items-center justify-center">
          <RatingDisplay
            rating={result.rating}
            totalComments={result.totalComments}
          />
        </Card>

        <Card className="p-6 card-gradient">
          <SentimentBreakdown breakdown={result.sentimentBreakdown} />
        </Card>
      </div>

      {/* Themes */}
      <Card className="p-6 card-gradient">
        <ThemesDisplay themes={result.themes} />
      </Card>

      {/* Pros and Cons */}
      <ProsConsList pros={result.pros} cons={result.cons} />

      {/* Summary */}
      <SummaryCard
        summary={result.summary}
        recommendation={result.recommendation}
        sentiment={result.overallSentiment}
      />
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  summary: string;
  recommendation: string;
  sentiment: "positive" | "neutral" | "negative";
}

export function SummaryCard({ summary, recommendation, sentiment }: SummaryCardProps) {
  const getRecommendationStyle = () => {
    if (recommendation.toLowerCase().includes("worth")) {
      return {
        bg: "bg-sentiment-positive/10",
        text: "text-sentiment-positive",
        border: "border-sentiment-positive/30",
        icon: TrendingUp,
      };
    }
    if (recommendation.toLowerCase().includes("not")) {
      return {
        bg: "bg-sentiment-negative/10",
        text: "text-sentiment-negative",
        border: "border-sentiment-negative/30",
        icon: TrendingDown,
      };
    }
    return {
      bg: "bg-sentiment-neutral/10",
      text: "text-sentiment-neutral",
      border: "border-sentiment-neutral/30",
      icon: Minus,
    };
  };

  const recStyle = getRecommendationStyle();
  const RecIcon = recStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6 card-gradient">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Recommendation:</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "px-4 py-1.5 text-sm font-semibold border-2",
              recStyle.bg,
              recStyle.text,
              recStyle.border
            )}
          >
            <RecIcon className="w-4 h-4 mr-2" />
            {recommendation}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentGaugeProps {
  score: number;
  sentiment: "positive" | "neutral" | "negative";
}

export function SentimentGauge({ score, sentiment }: SentimentGaugeProps) {
  const getColor = () => {
    if (sentiment === "positive") return "text-sentiment-positive";
    if (sentiment === "negative") return "text-sentiment-negative";
    return "text-sentiment-neutral";
  };

  const getBgColor = () => {
    if (sentiment === "positive") return "bg-sentiment-positive";
    if (sentiment === "negative") return "bg-sentiment-negative";
    return "bg-sentiment-neutral";
  };

  const getIcon = () => {
    if (sentiment === "positive") return TrendingUp;
    if (sentiment === "negative") return TrendingDown;
    return Minus;
  };

  const Icon = getIcon();
  const rotation = ((score / 100) * 180) - 90;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--sentiment-negative))" />
                <stop offset="50%" stopColor="hsl(var(--sentiment-neutral))" />
                <stop offset="100%" stopColor="hsl(var(--sentiment-positive))" />
              </linearGradient>
            </defs>
            <path
              d="M 10 95 A 90 90 0 0 1 190 95"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <motion.path
              d="M 10 95 A 90 90 0 0 1 190 95"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
        </div>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className={cn("w-1 h-20 rounded-full", getBgColor())} />
          <div className={cn("absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full", getBgColor())} />
        </motion.div>
      </div>

      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center mt-4"
      >
        <div className={cn("flex items-center gap-2 text-4xl font-bold", getColor())}>
          <Icon className="w-8 h-8" />
          <span>{score}%</span>
        </div>
        <p className="text-muted-foreground text-sm mt-1 capitalize">{sentiment} Sentiment</p>
      </motion.div>
    </div>
  );
}

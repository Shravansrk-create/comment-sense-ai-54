import { motion } from "framer-motion";

interface SentimentBreakdownProps {
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export function SentimentBreakdown({ breakdown }: SentimentBreakdownProps) {
  const items = [
    { label: "Positive", value: breakdown.positive, color: "bg-sentiment-positive" },
    { label: "Neutral", value: breakdown.neutral, color: "bg-sentiment-neutral" },
    { label: "Negative", value: breakdown.negative, color: "bg-sentiment-negative" },
  ];

  return (
    <div className="flex flex-col h-full justify-center">
      <h3 className="text-lg font-semibold mb-4 text-center">Breakdown</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.value}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

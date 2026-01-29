import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Theme {
  name: string;
  sentiment: "positive" | "neutral" | "negative";
  count: number;
}

interface ThemesDisplayProps {
  themes: Theme[];
}

export function ThemesDisplay({ themes }: ThemesDisplayProps) {
  const getSentimentClass = (sentiment: string) => {
    if (sentiment === "positive") return "sentiment-positive";
    if (sentiment === "negative") return "sentiment-negative";
    return "sentiment-neutral";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4">Common Themes</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Badge
              variant="outline"
              className={cn(
                "px-4 py-2 text-sm font-medium border-2 capitalize",
                getSentimentClass(theme.sentiment)
              )}
            >
              {theme.name}
              <span className="ml-2 opacity-70">({theme.count})</span>
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

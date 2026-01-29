import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export function ProsConsList({ pros, cons }: ProsConsListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 h-full border-2 border-sentiment-positive/20 bg-sentiment-positive-light/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sentiment-positive/10 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-sentiment-positive" />
            </div>
            <h3 className="text-lg font-semibold text-sentiment-positive">Pros</h3>
          </div>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sentiment-positive mt-2 flex-shrink-0" />
                <span className="text-foreground">{pro}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 h-full border-2 border-sentiment-negative/20 bg-sentiment-negative-light/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sentiment-negative/10 flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-sentiment-negative" />
            </div>
            <h3 className="text-lg font-semibold text-sentiment-negative">Cons</h3>
          </div>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sentiment-negative mt-2 flex-shrink-0" />
                <span className="text-foreground">{con}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}

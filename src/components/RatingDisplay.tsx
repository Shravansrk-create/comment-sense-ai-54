import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  totalComments: number;
}

export function RatingDisplay({ rating, totalComments }: RatingDisplayProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-foreground">{rating.toFixed(1)}</span>
        <span className="text-2xl text-muted-foreground">/5</span>
      </div>

      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: fullStars }).map((_, i) => (
          <motion.div
            key={`full-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Star className="w-6 h-6 fill-sentiment-neutral text-sentiment-neutral" />
          </motion.div>
        ))}
        {hasHalfStar && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + fullStars * 0.1 }}
            className="relative"
          >
            <Star className="w-6 h-6 text-muted" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-6 h-6 fill-sentiment-neutral text-sentiment-neutral" />
            </div>
          </motion.div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1 }}
          >
            <Star className="w-6 h-6 text-muted" />
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-3">
        Based on {totalComments} comments
      </p>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Loader2, MessageSquareText, Sparkles, BarChart3 } from "lucide-react";

export function LoadingState() {
  const steps = [
    { icon: MessageSquareText, label: "Fetching comments..." },
    { icon: Sparkles, label: "Analyzing sentiment..." },
    { icon: BarChart3, label: "Generating insights..." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto py-16"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center shadow-glow mb-8"
        >
          <Loader2 className="w-8 h-8 text-primary-foreground" />
        </motion.div>

        <div className="space-y-4 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{step.label}</span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                className="ml-auto"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

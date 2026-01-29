import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlInputForm } from "@/components/UrlInputForm";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { LoadingState } from "@/components/LoadingState";
import { analyzeUrl } from "@/lib/api";
import { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze URL";
      setError(message);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-md">
                <MessageSquareText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CommentSense</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Sentiment Analysis</p>
              </div>
            </motion.div>

            {result && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!result && !isLoading && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                >
                  Understand What People
                  <span className="hero-gradient bg-clip-text text-transparent"> Really Think</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  Paste a YouTube video or product link and let AI analyze the comments
                  to give you instant sentiment insights, ratings, and recommendations.
                </motion.p>
              </div>

              <UrlInputForm onSubmit={handleSubmit} isLoading={isLoading} />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mt-6 text-sentiment-negative"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
              >
                {[
                  {
                    title: "Sentiment Analysis",
                    description: "AI-powered analysis of positive, neutral, and negative sentiments",
                  },
                  {
                    title: "Smart Rating",
                    description: "Automatic 5-star rating calculated from comment sentiment",
                  },
                  {
                    title: "Key Insights",
                    description: "Pros, cons, themes, and actionable recommendations",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border text-center"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Analyze comments and reviews instantly</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

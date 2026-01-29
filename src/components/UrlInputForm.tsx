import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Link, Youtube, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isProduct = url.includes("amazon") || url.includes("ebay") || url.includes("shop");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative rounded-2xl transition-all duration-300",
            isFocused && "shadow-glow"
          )}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {isYouTube ? (
              <Youtube className="w-5 h-5 text-red-500" />
            ) : isProduct ? (
              <ShoppingBag className="w-5 h-5 text-primary" />
            ) : (
              <Link className="w-5 h-5" />
            )}
          </div>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste a YouTube video or product link..."
            className="h-14 pl-12 pr-32 text-base rounded-2xl border-2 border-border bg-card focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="h-10 px-6 rounded-xl hero-gradient text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <span>YouTube</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <ShoppingBag className="w-4 h-4" />
          <span>Products (coming soon)</span>
        </div>
      </div>
    </motion.div>
  );
}

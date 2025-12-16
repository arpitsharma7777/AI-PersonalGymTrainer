import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
              Hackfinity
            </h2>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black text-foreground leading-tight">
            AI Personal Gym Trainer
          </h1>

          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            Real-time posture correction via device camera{" "}
            <span className="text-primary font-bold">(95%+ accuracy)</span>
          </p>
        </div>

        <Button
          onClick={() => navigate("/camera")}
          size="lg"
          className="px-8 py-6 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg animate-glow"
        >
          Start Camera
        </Button>

        <div className="pt-12 border-t border-muted">
          <p className="text-sm text-muted-foreground">
            🔒 Privacy Focused: Processing runs entirely in your browser
          </p>
        </div>
      </div>
    </div>
  );
}

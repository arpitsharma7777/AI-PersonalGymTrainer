import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Activity, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center gap-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-white/5 backdrop-blur-sm animate-fade-in-up">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium tracking-wider text-white/80 uppercase">AI-Powered Analysis</span>
        </div>

        {/* Hero Heading */}
        <div className="space-y-2">
          <h1 className="text-7xl md:text-9xl font-heading font-bold italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 leading-[0.9]">
            AI PERSONAL
          </h1>
          <h1 className="text-7xl md:text-9xl font-heading font-bold italic tracking-tighter text-primary leading-[0.9]">
            GYM TRAINER
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light">
          Master your form with real-time computer vision feedback.
          <span className="text-white font-medium block mt-2">No wearables. Just your camera.</span>
        </p>

        {/* Action Button */}
        <div className="pt-8">
          <Button
            onClick={() => navigate("/camera")}
            size="lg"
            className="h-16 px-10 text-xl font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(23,231,119,0.5)]"
          >
            START TRAINING
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>

        {/* Feature Cards / Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
          {[
            { label: "Form Accuracy", value: "99%" },
            { label: "Latency", value: "<10ms" },
            { label: "Privacy", value: "Local" }
          ].map((stat, i) => (
            <div key={i} className="bg-surface-container/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:bg-surface-container transition-colors">
              <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

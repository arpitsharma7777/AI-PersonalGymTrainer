import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { CameraSetup } from "@/components/camera-coach/CameraSetup";
import { CameraFeed } from "@/components/camera-coach/CameraFeed";
import { useHackfinityStore } from "@/store";

export default function CameraCoach() {
  const navigate = useNavigate();
  const [frameScale, setFrameScale] = useState(100);
  const { cameraChecks } = useHackfinityStore();
  const allPassed = cameraChecks.isBodyVisible && cameraChecks.isCentered;

  // useCallback keeps the reference stable across re-renders caused by
  // cameraChecks store updates — prevents CameraSetup's timer from
  // being cancelled and restarted on every frame.
  const handleSetupComplete = useCallback(() => {
    navigate("/workout");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-xs font-medium tracking-wide">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-white tracking-[0.2em] text-sm">AI GYM</span>
        </div>
        <div className="w-16" />
      </nav>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-12 pt-5 sm:pt-8 pb-5">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">Step 1 of 2</span>
          </div>
          <div className="pl-4 border-l-2 border-primary/60">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white leading-none tracking-tight">CAMERA</h1>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary leading-none tracking-tight">SETUP</h1>
          </div>
          <p className="text-white/35 mt-3 text-sm">
            Position yourself so your full body is visible in the frame, then start your session.
          </p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 md:px-12 pb-6 sm:pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Camera feed column */}
            <div className="lg:col-span-2 space-y-3">
              {/* Controls row */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Camera Preview</p>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setFrameScale((s) => Math.max(40, s - 10))}
                    disabled={frameScale === 40}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-base leading-none font-bold"
                    aria-label="Decrease frame size"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold text-primary w-10 text-center tabular-nums">
                    {frameScale}%
                  </span>
                  <button
                    onClick={() => setFrameScale((s) => Math.min(100, s + 10))}
                    disabled={frameScale === 100}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-base leading-none font-bold"
                    aria-label="Increase frame size"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Feed with dynamic status ring */}
              <div
                style={{ maxWidth: `${frameScale}%` }}
                className="mx-auto transition-all duration-300"
              >
                <div
                  className={`rounded-3xl transition-all duration-500 ${
                    allPassed
                      ? "shadow-[0_0_50px_-10px_rgba(23,231,119,0.45)] ring-2 ring-primary/50"
                      : "ring-1 ring-white/10"
                  }`}
                >
                  <CameraFeed />
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    allPassed ? "bg-primary shadow-[0_0_6px_rgba(23,231,119,0.8)]" : "bg-white/20 animate-pulse"
                  }`}
                />
                <span
                  className={`text-xs tracking-wide transition-colors duration-500 ${
                    allPassed ? "text-primary font-semibold" : "text-white/30"
                  }`}
                >
                  {allPassed
                    ? "All checks passed — ready to start"
                    : "Adjust your position to pass all checks"}
                </span>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <CameraSetup onSetupComplete={handleSetupComplete} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

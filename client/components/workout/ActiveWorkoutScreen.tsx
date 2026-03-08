import { RepCounter } from "./RepCounter";
import { RepQualityScore } from "./RepQualityScore";
import { RealTimeFeedback } from "./RealTimeFeedback";
import { CameraFeed } from "@/components/camera-coach/CameraFeed";
import { Activity, Square } from "lucide-react";
import { useHackfinityStore } from "@/store";

interface ActiveWorkoutScreenProps {
  reps: number;
  qualityScore: number;
  feedback: string;
  onStopWorkout: () => void;
  onSimulateGoodPosture: () => void;
  onSimulateBadPosture: () => void;
}

const EXERCISE_LABELS: Record<string, string> = {
  SQUAT:        "Squat",
  PUSHUP:       "Pushup",
  JUMPING_JACK: "Jumping Jack",
};

export function ActiveWorkoutScreen({
  reps,
  qualityScore,
  feedback,
  onStopWorkout,
}: ActiveWorkoutScreenProps) {
  const selectedExercise = useHackfinityStore((state) => state.selectedExercise);

  const feedbackType =
    feedback.includes("Good") || feedback.includes("perfect")
      ? "good"
      : feedback.includes("Keep") || feedback.includes("Adjust")
        ? "warning"
        : "info";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-white tracking-[0.2em] text-sm">AI GYM</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold tracking-[0.15em] text-primary uppercase">Live Session</span>
        </div>

        <button
          onClick={onStopWorkout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 text-xs font-bold tracking-widest transition-all duration-200"
        >
          <Square className="w-3 h-3 fill-current" />
          STOP
        </button>
      </nav>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Camera feed */}
            <div className="lg:col-span-2">
              <CameraFeed />
            </div>

            {/* Stats sidebar */}
            <div className="flex flex-col gap-4">

              {/* Exercise label */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">
                  Exercise
                </p>
                <p className="font-heading font-bold text-white text-xl tracking-wide">
                  {EXERCISE_LABELS[selectedExercise] ?? selectedExercise}
                </p>
              </div>

              {/* Rep counter + Quality ring: side-by-side on mobile, stacked on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <RepCounter reps={reps} />
                <RepQualityScore score={qualityScore} />
              </div>

              {/* End session button */}
              <button
                onClick={onStopWorkout}
                className="mt-auto w-full py-3 rounded-xl border border-red-500/25 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold tracking-widest text-red-400/60 hover:text-red-400 transition-all duration-200"
              >
                END SESSION
              </button>

            </div>
          </div>

          {/* Feedback bar */}
          <div className="mt-4">
            <RealTimeFeedback
              message={feedback || "Get into position..."}
              type={feedbackType}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

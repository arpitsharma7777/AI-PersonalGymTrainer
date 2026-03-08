import { useEffect, useState } from "react";
import { CameraChecklistItem } from "./CameraChecklistItem";
import { Button } from "@/components/ui/button";
import { useHackfinityStore } from "@/store";
import { ArrowRight } from "lucide-react";

interface CameraSetupProps {
  onSetupComplete: () => void;
}

const EXERCISES = [
  { id: "SQUAT"        as const, emoji: "🏋️", label: "SQUAT",     desc: "Knee & hip depth" },
  { id: "PUSHUP"       as const, emoji: "💪", label: "PUSHUP",    desc: "Elbow & core form" },
  { id: "JUMPING_JACK" as const, emoji: "⚡", label: "JUMP JACK", desc: "Full body sync" },
];

export function CameraSetup({ onSetupComplete }: CameraSetupProps) {
  const { cameraChecks, resetWorkout } = useHackfinityStore();
  const selectedExercise = useHackfinityStore((state) => state.selectedExercise);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    resetWorkout();
  }, []);

  const allPassed = cameraChecks.isBodyVisible && cameraChecks.isCentered;

  useEffect(() => {
    if (allPassed) {
      setIsStarting(true);
      const timer = setTimeout(() => {
        onSetupComplete();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsStarting(false);
    }
  }, [allPassed, onSetupComplete]);

  const checklist = [
    { label: "Full body visible", passed: cameraChecks.isBodyVisible,     optional: false },
    { label: "Body centered",     passed: cameraChecks.isCentered,        optional: false },
    { label: "Correct distance",  passed: cameraChecks.isDistanceCorrect, optional: true  },
  ];

  const passedCount   = checklist.filter((c) => !c.optional && c.passed).length;
  const requiredCount = checklist.filter((c) => !c.optional).length;

  return (
    <div className="space-y-6">

      {/* ── Exercise selector ──────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3">
          Select Exercise
        </p>
        <div className="space-y-2">
          {EXERCISES.map((ex) => {
            const active = selectedExercise === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => useHackfinityStore.getState().setSelectedExercise(ex.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                  active
                    ? "bg-primary/10 border-primary/40 shadow-[0_0_18px_-6px_rgba(23,231,119,0.4)]"
                    : "bg-white/[0.03] border-white/8 hover:bg-white/6 hover:border-white/15"
                }`}
              >
                <span className="text-xl leading-none">{ex.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-heading font-bold tracking-widest ${active ? "text-primary" : "text-white/60"}`}>
                    {ex.label}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">{ex.desc}</p>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/8" />

      {/* ── Position checklist ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Position Check
          </p>
          <span className={`text-[10px] font-bold tabular-nums ${allPassed ? "text-primary" : "text-white/25"}`}>
            {passedCount}/{requiredCount}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/8 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(passedCount / requiredCount) * 100}%` }}
          />
        </div>

        <div className="space-y-1">
          {checklist.map((item) => (
            <CameraChecklistItem
              key={item.label}
              label={item.label}
              completed={item.passed}
              optional={item.optional}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/8" />

      {/* ── Start button ───────────────────────────────────────── */}
      <Button
        onClick={onSetupComplete}
        disabled={!allPassed}
        className={`w-full h-12 font-heading font-bold tracking-widest text-sm rounded-xl transition-all duration-300 border-0 ${
          allPassed
            ? "bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_-6px_rgba(23,231,119,0.55)]"
            : "bg-white/5 text-white/25 cursor-not-allowed"
        }`}
      >
        {isStarting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            STARTING...
          </span>
        ) : allPassed ? (
          <span className="flex items-center gap-2">
            START WORKOUT <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          "ADJUST CAMERA"
        )}
      </Button>

    </div>
  );
}

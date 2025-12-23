import { useEffect, useState } from "react";
import { CameraChecklistItem } from "./CameraChecklistItem";
import { Button } from "@/components/ui/button";
import { useHackfinityStore } from "@/store";

interface CameraSetupProps {
  onSetupComplete: () => void;
}

export function CameraSetup({ onSetupComplete }: CameraSetupProps) {
  const { cameraChecks, resetWorkout } = useHackfinityStore();
  const [isStarting, setIsStarting] = useState(false);

  // Reset workout to CALIBRATING state on mount
  useEffect(() => {
    resetWorkout();
  }, []);

  // Determine if all checks pass
  // Note: 'isLevel' acts as proxy for "good enough" in our simple logic, but better to check all.
  const allPassed =
    cameraChecks.isBodyVisible &&
    cameraChecks.isCentered;
  // && cameraChecks.isDistanceCorrect; // Relaxed per user request to allow easier entry

  // Auto-start when all checks pass
  useEffect(() => {
    if (allPassed) {
      setIsStarting(true);
      // slight delay to avoid instant snapping if user is just passing through
      const timer = setTimeout(() => {
        onSetupComplete();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsStarting(false);
    }
  }, [allPassed, onSetupComplete]);
  // isLevel is nice to have but maybe optional for "Pass"? Let's include it.
  // && cameraChecks.isLevel; 

  const checklist = [
    { label: "Full body visible", passed: cameraChecks.isBodyVisible },
    { label: "Body Centered", passed: cameraChecks.isCentered },
    { label: "Correct Distance (Optional)", passed: cameraChecks.isDistanceCorrect },
    // { label: "Camera Level", passed: cameraChecks.isLevel },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-8">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest block">Select Exercise</label>
        <div className="grid grid-cols-3 gap-2">
          {(['SQUAT', 'PUSHUP', 'JUMPING_JACK'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => useHackfinityStore.getState().setSelectedExercise(ex)}
              className={`
                 py-3 px-2 rounded-xl text-sm font-bold border transition-all
                 ${useHackfinityStore.getState().selectedExercise === ex
                  ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_-3px_rgba(23,231,119,0.5)]'
                  : 'bg-surface-container text-muted-foreground border-transparent hover:bg-white/5'}
               `}
            >
              {ex.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <CameraChecklistItem
            key={item.label}
            label={item.label}
            completed={item.passed}
          />
        ))}
      </div>

      <div className="pt-4">
        <Button
          onClick={onSetupComplete}
          disabled={!allPassed} // Disable until checks pass
          size="lg"
          className="w-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStarting ? "Starting..." : (allPassed ? "Start Workout" : "Adjust Camera to Continue")}
        </Button>
      </div>
    </div>
  );
}

import { RepCounter } from "./RepCounter";
import { RepQualityScore } from "./RepQualityScore";
import { RealTimeFeedback } from "./RealTimeFeedback";
import { Button } from "@/components/ui/button";
import { MockVideoFeed } from "@/components/camera-coach/MockVideoFeed";

interface ActiveWorkoutScreenProps {
  reps: number;
  qualityScore: number;
  feedback: string;
  onStopWorkout: () => void;
  onSimulateGoodPosture: () => void;
  onSimulateBadPosture: () => void;
}

export function ActiveWorkoutScreen({
  reps,
  qualityScore,
  feedback,
  onStopWorkout,
  onSimulateGoodPosture,
  onSimulateBadPosture,
}: ActiveWorkoutScreenProps) {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <MockVideoFeed />

          <div className="flex gap-3">
            <Button
              onClick={onSimulateGoodPosture}
              variant="outline"
              size="sm"
              className="flex-1 bg-primary/10 border-primary text-primary hover:bg-primary/20"
            >
              Simulate Good Form
            </Button>
            <Button
              onClick={onSimulateBadPosture}
              variant="outline"
              size="sm"
              className="flex-1 bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
            >
              Simulate Bad Form
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <RepCounter reps={reps} />
          <RepQualityScore score={qualityScore} />
        </div>
      </div>

      <div className="space-y-3">
        <RealTimeFeedback
          message={feedback || "Hold position..."}
          type={
            feedback.includes("Good") || feedback.includes("perfect")
              ? "good"
              : feedback.includes("Keep") || feedback.includes("Adjust")
                ? "warning"
                : "info"
          }
        />
      </div>

      <Button
        onClick={onStopWorkout}
        size="lg"
        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg font-bold"
      >
        Stop Workout
      </Button>
    </div>
  );
}

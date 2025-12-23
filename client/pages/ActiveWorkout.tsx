import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useHackfinityStore } from "@/store";
import { ActiveWorkoutScreen } from "@/components/workout/ActiveWorkoutScreen";

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const {
    repCount,
    qualityScore,
    feedbackMessage,
    setAppState
  } = useHackfinityStore();

  useEffect(() => {
    // Ensure we are in WORKOUT mode when this page mounts
    setAppState("WORKOUT");
  }, [setAppState]);

  const handleStopWorkout = () => {
    setAppState("SUMMARY"); // Optional, but good for tracking
    navigate("/summary");
  };

  return (
    <ActiveWorkoutScreen
      reps={repCount}
      qualityScore={qualityScore}
      feedback={feedbackMessage}
      onStopWorkout={handleStopWorkout}
      // These simulation props are technically still in the interface but now unused/removed from UI
      onSimulateGoodPosture={() => { }}
      onSimulateBadPosture={() => { }}
    />
  );
}

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWorkoutStore } from "@/lib/store";
import { useMediaPipeMock } from "@/hooks/use-media-pipe-mock";
import { ActiveWorkoutScreen } from "@/components/workout/ActiveWorkoutScreen";

const FEEDBACK_MESSAGES = [
  "Good depth. Keep back straight.",
  "Excellent form!",
  "Lower a bit more.",
  "Engage your core.",
  "Perfect rep!",
  "Stay balanced.",
  "Control the movement.",
];

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { session, startWorkout, incrementRep, setRepQualityScore, setFeedback, stopWorkout } = useWorkoutStore();
  const { simulateGoodPosture, simulateBadPosture } = useMediaPipeMock();
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  useEffect(() => {
    startWorkout();
  }, [startWorkout]);

  const handleSimulateGoodPosture = () => {
    simulateGoodPosture();
    incrementRep();
    const qualityScore = 85 + Math.random() * 15;
    setRepQualityScore(qualityScore);
    const message = FEEDBACK_MESSAGES[feedbackIndex % FEEDBACK_MESSAGES.length];
    setFeedback(message);
    setFeedbackIndex((prev) => prev + 1);
  };

  const handleSimulateBadPosture = () => {
    simulateBadPosture();
    const qualityScore = 40 + Math.random() * 30;
    setRepQualityScore(qualityScore);
    setFeedback("Adjust your form - keep your back straight");
  };

  const handleStopWorkout = () => {
    stopWorkout();
    navigate("/summary");
  };

  return (
    <ActiveWorkoutScreen
      reps={session.currentReps}
      qualityScore={session.repQualityScore}
      feedback={session.lastFeedback}
      onStopWorkout={handleStopWorkout}
      onSimulateGoodPosture={handleSimulateGoodPosture}
      onSimulateBadPosture={handleSimulateBadPosture}
    />
  );
}

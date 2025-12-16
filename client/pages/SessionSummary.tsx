import { useNavigate } from "react-router-dom";
import { useWorkoutStore } from "@/lib/store";
import { SessionSummaryChart } from "@/components/workout/SessionSummaryChart";
import { Button } from "@/components/ui/button";

export default function SessionSummary() {
  const navigate = useNavigate();
  const { session, resetSession } = useWorkoutStore();

  const avgFormScore = session.repQualityHistory.length > 0
    ? Math.round(
        session.repQualityHistory.reduce((a, b) => a + b, 0) /
          session.repQualityHistory.length
      )
    : 0;

  const bestRep = session.repQualityHistory.length > 0
    ? Math.max(...session.repQualityHistory)
    : 0;

  const bestRepIndex = session.repQualityHistory.indexOf(bestRep);

  const handleBackToHome = () => {
    resetSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground">
            Session Complete
          </h1>
          <p className="text-lg text-muted-foreground">Great workout!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-muted">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Total Reps
            </p>
            <p className="text-5xl font-bold text-primary">{session.currentReps}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-muted">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Avg Form Score
            </p>
            <p className="text-5xl font-bold text-secondary">{avgFormScore}%</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-muted">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Best Rep
            </p>
            <p className="text-4xl font-bold text-primary">{bestRep}%</p>
            {bestRepIndex >= 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Rep #{bestRepIndex + 1}
              </p>
            )}
          </div>
        </div>

        {session.repQualityHistory.length > 0 && (
          <div className="bg-card p-8 rounded-lg border border-muted">
            <SessionSummaryChart qualityHistory={session.repQualityHistory} />
          </div>
        )}

        <Button
          onClick={handleBackToHome}
          size="lg"
          className="w-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

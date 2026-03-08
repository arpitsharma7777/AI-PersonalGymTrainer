import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useHackfinityStore } from "@/store";
import { Button } from "@/components/ui/button";
import { completeSession } from "@/lib/api";
import { Activity, ArrowRight, CheckCircle, AlertCircle, Zap, Brain } from "lucide-react";

export default function SessionSummary() {
  const navigate = useNavigate();
  const {
    repCount,
    qualityScore,
    selectedExercise,
    errorCounts,
    repHistory,
    sessionStartTime,
    aiInsights,
    isLoadingInsights,
    setAiInsights,
    setLoadingInsights,
    resetWorkout,
  } = useHackfinityStore();

  useEffect(() => {
    if (repCount === 0 || aiInsights || isLoadingInsights) return;

    setLoadingInsights(true);
    completeSession({
      exercise: selectedExercise,
      totalReps: repCount,
      averageScore: qualityScore,
      errorCounts,
      repScores: repHistory.map((r) => r.scoreAdjustment),
      sessionStartTime,
    })
      .then((res) => { setAiInsights(res.insights); })
      .catch((err) => { console.error("Failed to get AI insights:", err); setAiInsights(null); })
      .finally(() => { setLoadingInsights(false); });
  }, []);

  const handleBackToHome = () => {
    resetWorkout();
    navigate("/");
  };

  const handleTrainAgain = () => {
    resetWorkout();
    navigate("/camera");
  };

  const grade      = qualityScore >= 90 ? "A" : qualityScore >= 80 ? "B" : qualityScore >= 70 ? "C" : qualityScore >= 60 ? "D" : "F";
  const scoreColor = qualityScore >= 80 ? "text-primary" : qualityScore >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-white tracking-[0.2em] text-sm">AI GYM</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold tracking-[0.15em] text-primary uppercase">Session Complete</span>
        </div>
        <div className="w-20" />
      </nav>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 md:px-12 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Hero header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">
                Workout Finished
              </span>
            </div>
            <div className="pl-4 border-l-2 border-primary/60">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white leading-none tracking-tight">
                SESSION
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-primary leading-none tracking-tight">
                COMPLETE
              </h1>
            </div>
            <div className="mt-5">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm font-heading font-bold text-white/80 tracking-wider uppercase">
                {selectedExercise.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* ── Stats strip ──────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-3 sm:p-5 text-center">
              <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1 sm:mb-3">Total Reps</p>
              <p className="text-3xl sm:text-5xl font-heading font-bold text-white leading-none">{repCount}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-3 sm:p-5 text-center">
              <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1 sm:mb-3">Form Score</p>
              <p className={`text-3xl sm:text-5xl font-heading font-bold leading-none ${scoreColor}`}>
                {qualityScore}<span className="text-sm sm:text-2xl align-top">%</span>
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-3 sm:p-5 text-center">
              <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1 sm:mb-3">Grade</p>
              <p className={`text-3xl sm:text-5xl font-heading font-bold leading-none ${scoreColor}`}>{grade}</p>
            </div>
          </div>

          {/* ── AI loading ───────────────────────────────────────────── */}
          {isLoadingInsights && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-5 h-5 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-white/50">AI Coach is analyzing your session...</p>
              </div>
              <p className="text-[11px] text-white/20 tracking-widest uppercase">
                Powered by Amazon Bedrock
              </p>
            </div>
          )}

          {/* ── AI Insights ──────────────────────────────────────────── */}
          {aiInsights && (
            <div className="space-y-4">

              {/* Coach summary */}
              <div className="relative flex gap-4 px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5 ml-2" />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2">
                    AI Coach Analysis
                  </p>
                  <p className="text-sm text-white/55 leading-relaxed">{aiInsights.summary}</p>
                </div>
              </div>

              {/* Strengths + Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Strengths</p>
                  </div>
                  <ul className="space-y-2.5">
                    {aiInsights.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                        <span className="text-primary font-bold shrink-0 mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <p className="text-[10px] font-bold tracking-[0.2em] text-yellow-400 uppercase">
                      Areas to Improve
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {aiInsights.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                        <span className="text-yellow-400 font-bold shrink-0 mt-0.5">!</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-white/40" />
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    Recommendations
                  </p>
                </div>
                <ol className="space-y-3">
                  {aiInsights.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                      <span className="w-5 h-5 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/50 mt-0.5">
                        {i + 1}
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Progress note */}
              {aiInsights.progressNote && (
                <div className="bg-primary/5 border border-primary/15 rounded-2xl px-6 py-5 text-center">
                  <p className="text-sm text-white/50 italic">"{aiInsights.progressNote}"</p>
                </div>
              )}

              {/* Powered by */}
              <div className="flex justify-center pt-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/8 text-[11px] text-white/25 tracking-widest uppercase">
                  Powered by Amazon Bedrock
                </span>
              </div>

            </div>
          )}

          {/* ── CTAs ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Button
              onClick={handleTrainAgain}
              className="h-12 font-heading font-bold tracking-widest text-sm rounded-full bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_-6px_rgba(23,231,119,0.45)] border-0 transition-all duration-200"
            >
              TRAIN AGAIN <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              onClick={handleBackToHome}
              className="h-12 font-heading font-bold tracking-widest text-sm rounded-full bg-transparent border border-white/15 text-white/55 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              BACK TO HOME
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

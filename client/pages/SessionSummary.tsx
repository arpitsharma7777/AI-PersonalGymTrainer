import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useHackfinityStore } from "@/store";
import { Button } from "@/components/ui/button";
import { completeSession } from "@/lib/api";

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
      .then((res) => {
        setAiInsights(res.insights);
      })
      .catch((err) => {
        console.error("Failed to get AI insights:", err);
        setAiInsights(null);
      })
      .finally(() => {
        setLoadingInsights(false);
      });
  }, []);

  const handleBackToHome = () => {
    resetWorkout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-12">

        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Workout Finished</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground uppercase tracking-tighter leading-none">
            SESSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">COMPLETE</span>
          </h1>
          <div className="inline-block mt-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-xl md:text-2xl font-heading font-bold text-primary tracking-wider uppercase">
              {selectedExercise.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xl text-muted-foreground font-light max-w-lg mx-auto">
            Great work! Here's your performance breakdown.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reps Card */}
          <div className="bg-surface-container p-8 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" /></svg>
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Reps</p>
            <p className="text-7xl font-heading font-bold text-white">{repCount}</p>
          </div>

          {/* Quality Card */}
          <div className="bg-surface-container p-8 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Form Quality</p>
            <p className={`text-7xl font-heading font-bold ${qualityScore >= 80 ? 'text-primary' : 'text-yellow-500'}`}>
              {qualityScore}<span className="text-4xl align-top">%</span>
            </p>
          </div>
        </div>

        {/* AI Insights Section */}
        {isLoadingInsights && (
          <div className="bg-surface-container p-8 rounded-3xl text-center">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-lg text-muted-foreground">AI Coach is analyzing your workout...</p>
              </div>
              <p className="text-sm text-muted-foreground/60">Powered by Amazon Bedrock</p>
            </div>
          </div>
        )}

        {aiInsights && (
          <div className="space-y-6">
            {/* AI Summary */}
            <div className="bg-surface-container p-6 rounded-3xl border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <h2 className="text-lg font-heading font-bold text-primary uppercase tracking-wider">AI Coach Analysis</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{aiInsights.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-surface-container p-6 rounded-3xl">
                <h3 className="text-sm uppercase tracking-widest font-bold text-green-400 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {aiInsights.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-green-400 mt-0.5 shrink-0">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-surface-container p-6 rounded-3xl">
                <h3 className="text-sm uppercase tracking-widest font-bold text-yellow-400 mb-4">Areas to Improve</h3>
                <ul className="space-y-2">
                  {aiInsights.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-yellow-400 mt-0.5 shrink-0">!</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-surface-container p-6 rounded-3xl">
              <h3 className="text-sm uppercase tracking-widest font-bold text-blue-400 mb-4">Recommendations</h3>
              <ol className="space-y-3">
                {aiInsights.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="bg-blue-400/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ol>
            </div>

            {/* Progress Note */}
            {aiInsights.progressNote && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-3xl border border-primary/10">
                <p className="text-muted-foreground italic text-center">"{aiInsights.progressNote}"</p>
              </div>
            )}

            {/* Powered by badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground/60">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                Powered by Amazon Bedrock (Claude AI)
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 px-4 sm:px-12">
          <Button
            onClick={handleBackToHome}
            size="lg"
            className="w-full h-16 text-xl font-bold rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.5)]"
          >
            START NEW SESSION
          </Button>
        </div>
      </div>
    </div>
  );
}

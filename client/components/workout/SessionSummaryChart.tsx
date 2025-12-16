interface SessionSummaryChartProps {
  qualityHistory: number[];
}

export function SessionSummaryChart({
  qualityHistory,
}: SessionSummaryChartProps) {
  const sets = ["Set 1", "Set 2", "Set 3"];
  const maxScore = 100;

  const setAverages = [
    qualityHistory.slice(0, Math.ceil(qualityHistory.length / 3)),
    qualityHistory.slice(
      Math.ceil(qualityHistory.length / 3),
      Math.ceil((qualityHistory.length / 3) * 2)
    ),
    qualityHistory.slice(Math.ceil((qualityHistory.length / 3) * 2)),
  ];

  const averages = setAverages.map((set) =>
    set.length > 0 ? Math.round(set.reduce((a, b) => a + b, 0) / set.length) : 0
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground">Rep Quality by Set</h3>

      <div className="flex items-end justify-center gap-8 h-64">
        {sets.map((set, index) => (
          <div key={set} className="flex flex-col items-center gap-2">
            <div className="relative h-40 flex items-end">
              <div
                className="w-16 bg-gradient-to-t from-primary to-secondary rounded-t transition-all"
                style={{ height: `${(averages[index] / maxScore) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-primary font-bold">{averages[index]}%</p>
              <p className="text-xs text-muted-foreground">{set}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

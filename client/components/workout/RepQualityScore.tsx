interface RepQualityScoreProps {
  score: number;
}

export function RepQualityScore({ score }: RepQualityScoreProps) {
  const displayScore = Math.round(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        Quality
      </p>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${displayScore * 2.83} 283`}
            className="text-primary transition-all"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-primary">
          {displayScore}%
        </span>
      </div>
    </div>
  );
}

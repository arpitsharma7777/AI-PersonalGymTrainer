interface RepQualityScoreProps {
  score: number;
}

export function RepQualityScore({ score }: RepQualityScoreProps) {
  const displayScore  = Math.round(score);
  const grade         = displayScore >= 90 ? "A" : displayScore >= 80 ? "B" : displayScore >= 70 ? "C" : displayScore >= 60 ? "D" : "F";
  const strokeColor   = displayScore >= 80 ? "#17E777" : displayScore >= 60 ? "#facc15" : "#f87171";
  const textCls       = displayScore >= 80 ? "text-primary" : displayScore >= 60 ? "text-yellow-400" : "text-red-400";

  const r             = 42;
  const circumference = 2 * Math.PI * r;
  const dash          = (displayScore / 100) * circumference;

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 sm:p-6 text-center">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Form Quality</p>

      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }}
          />
        </svg>

        <div className="absolute flex flex-col items-center leading-none">
          <span className={`text-2xl sm:text-3xl font-heading font-bold ${textCls}`}>
            {displayScore}<span className="text-sm sm:text-base align-top">%</span>
          </span>
          <span className={`text-xs font-heading font-bold tracking-widest mt-1 ${textCls}`}>
            {grade}
          </span>
        </div>
      </div>
    </div>
  );
}

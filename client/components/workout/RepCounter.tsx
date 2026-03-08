import { useEffect, useRef, useState } from "react";

interface RepCounterProps {
  reps: number;
}

export function RepCounter({ reps }: RepCounterProps) {
  const [flash, setFlash] = useState(false);
  const prevReps = useRef(reps);

  useEffect(() => {
    if (reps > prevReps.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 450);
      prevReps.current = reps;
      return () => clearTimeout(t);
    }
    prevReps.current = reps;
  }, [reps]);

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 sm:p-6 text-center">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3">Reps</p>
      <p
        className={`text-5xl sm:text-7xl font-heading font-bold leading-none transition-colors duration-300 ${
          flash ? "text-primary" : "text-white"
        }`}
        style={flash ? { textShadow: "0 0 32px rgba(23,231,119,0.65)" } : {}}
      >
        {reps}
      </p>
      <p className="text-[10px] text-white/25 uppercase tracking-widest mt-3">completed</p>
    </div>
  );
}

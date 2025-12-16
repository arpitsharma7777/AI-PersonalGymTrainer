interface RepCounterProps {
  reps: number;
}

export function RepCounter({ reps }: RepCounterProps) {
  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">
        Reps Completed
      </p>
      <p className="text-7xl font-bold text-primary">{reps}</p>
    </div>
  );
}

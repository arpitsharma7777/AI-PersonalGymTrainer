import { Check } from "lucide-react";

interface CameraChecklistItemProps {
  label: string;
  completed: boolean;
}

export function CameraChecklistItem({
  label,
  completed,
}: CameraChecklistItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 text-lg">
      <div
        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
          completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted"
        }`}
      >
        {completed && <Check size={16} />}
      </div>
      <span className={completed ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}

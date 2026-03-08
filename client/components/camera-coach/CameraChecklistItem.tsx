import { Check } from "lucide-react";

interface CameraChecklistItemProps {
  label: string;
  completed: boolean;
  optional?: boolean;
}

export function CameraChecklistItem({ label, completed, optional }: CameraChecklistItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 ${
          completed
            ? "bg-primary shadow-[0_0_8px_rgba(23,231,119,0.5)]"
            : "border border-white/20 bg-transparent"
        }`}
      >
        {completed && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
      </div>
      <span className={`text-sm transition-colors duration-300 flex-1 ${completed ? "text-white" : "text-white/40"}`}>
        {label}
      </span>
      {optional && (
        <span className="text-[10px] text-white/20 tracking-wide shrink-0">optional</span>
      )}
    </div>
  );
}

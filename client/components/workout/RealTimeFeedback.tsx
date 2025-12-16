import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface RealTimeFeedbackProps {
  message: string;
  type?: "good" | "warning" | "info";
}

export function RealTimeFeedback({
  message,
  type = "info",
}: RealTimeFeedbackProps) {
  if (!message) return null;

  const bgClass =
    type === "good"
      ? "bg-primary/20 border-primary"
      : type === "warning"
        ? "bg-destructive/20 border-destructive"
        : "bg-secondary/20 border-secondary";

  const textClass =
    type === "good"
      ? "text-primary"
      : type === "warning"
        ? "text-destructive"
        : "text-secondary";

  const Icon =
    type === "good" ? CheckCircle : type === "warning" ? AlertCircle : Info;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 ${bgClass}`}
    >
      <Icon className={`w-5 h-5 ${textClass}`} />
      <span className={`text-sm font-medium ${textClass}`}>{message}</span>
    </div>
  );
}

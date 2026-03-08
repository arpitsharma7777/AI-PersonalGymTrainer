import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface RealTimeFeedbackProps {
  message: string;
  type?: "good" | "warning" | "info";
}

export function RealTimeFeedback({ message, type = "info" }: RealTimeFeedbackProps) {
  if (!message) return null;

  const accentBg  = type === "good" ? "bg-primary"    : type === "warning" ? "bg-red-400"   : "bg-white/20";
  const textCls   = type === "good" ? "text-primary"   : type === "warning" ? "text-red-400" : "text-white/55";
  const Icon      = type === "good" ? CheckCircle      : type === "warning" ? AlertCircle    : Info;

  return (
    <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBg} transition-colors duration-300`} />
      <Icon className={`w-5 h-5 ${textCls} shrink-0 ml-2 transition-colors duration-300`} />
      <span className={`text-sm font-medium ${textCls} transition-colors duration-300`}>
        {message}
      </span>
    </div>
  );
}

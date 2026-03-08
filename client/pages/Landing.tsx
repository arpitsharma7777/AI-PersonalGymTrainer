import { lazy, Suspense, Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Zap,
  Eye,
  Brain,
  ShieldCheck,
  Camera,
  CheckCircle,
  BarChart3,
  Github,
} from "lucide-react";

const GymModel3D = lazy(() => import("@/components/landing/GymModel3D"));

// Catches any runtime error in the 3D canvas so the page never goes blank
class ThreeErrorBoundary extends Component<
  { children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
}


// ── Mini pose SVGs for exercise cards ────────────────────────────────────────
function MiniSquat() {
  return (
    <svg viewBox="0 0 120 150" fill="none" className="w-20 h-24 opacity-80">
      {/* squat-ish stick figure */}
      <circle cx="60" cy="18" r="10" fill="#17E777" fillOpacity="0.9"/>
      <line x1="60" y1="28" x2="60" y2="72" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="38" y1="40" x2="82" y2="40" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="38" y1="40" x2="22" y2="62" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="82" y1="40" x2="98" y2="62" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="42" y1="72" x2="78" y2="72" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="42" y1="72" x2="28" y2="115" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="78" y1="72" x2="92" y2="115" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="28" y1="115" x2="36" y2="138" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="92" y1="115" x2="84" y2="138" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      {[{cx:38,cy:40},{cx:82,cy:40},{cx:42,cy:72},{cx:78,cy:72},{cx:28,cy:115},{cx:92,cy:115}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#17E777" fillOpacity="0.9"/>
      ))}
    </svg>
  );
}
function MiniPushup() {
  return (
    <svg viewBox="0 0 150 100" fill="none" className="w-24 h-16 opacity-80">
      <circle cx="22" cy="38" r="10" fill="#17E777" fillOpacity="0.9"/>
      <line x1="30" y1="42" x2="90" y2="55" stroke="#17E777" strokeWidth="2.5" strokeOpacity="0.7"/>
      <line x1="55" y1="50" x2="55" y2="75" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="55" y1="75" x2="42" y2="90" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="55" y1="75" x2="68" y2="90" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="30" y1="42" x2="18" y2="68" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="90" y1="55" x2="108" y2="70" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      {[{cx:30,cy:42},{cx:55,cy:50},{cx:90,cy:55},{cx:18,cy:68},{cx:108,cy:70}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#17E777" fillOpacity="0.9"/>
      ))}
    </svg>
  );
}
function MiniJumpingJack() {
  return (
    <svg viewBox="0 0 130 160" fill="none" className="w-20 h-24 opacity-80">
      <circle cx="65" cy="18" r="10" fill="#17E777" fillOpacity="0.9"/>
      <line x1="65" y1="28" x2="65" y2="90" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="20" y1="52" x2="110" y2="52" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="20" y1="52" x2="8"  y2="28" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="110" y1="52" x2="122" y2="28" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="50" y1="90" x2="80" y2="90" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="50" y1="90" x2="22" y2="148" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="80" y1="90" x2="108" y2="148" stroke="#17E777" strokeWidth="2" strokeOpacity="0.7"/>
      {[{cx:20,cy:52},{cx:110,cy:52},{cx:8,cy:28},{cx:122,cy:28},{cx:50,cy:90},{cx:80,cy:90}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#17E777" fillOpacity="0.9"/>
      ))}
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const EXERCISES_DATA = [
  {
    name: "Squat",
    emoji: "🏋️",
    mini: <MiniSquat />,
    difficulty: "Beginner",
    tracked: ["Knee angle & depth", "Hip hinge alignment", "Back straightness", "Feet position"],
    tip: "Aim for thighs parallel to the floor. Keep chest up and knees over toes.",
  },
  {
    name: "Pushup",
    emoji: "💪",
    mini: <MiniPushup />,
    difficulty: "Intermediate",
    tracked: ["Elbow angle at bottom", "Core alignment", "Head & neck position", "Range of motion"],
    tip: "Keep your body in a straight line. Lower until elbows reach 90°.",
  },
  {
    name: "Jumping Jack",
    emoji: "⚡",
    mini: <MiniJumpingJack />,
    difficulty: "Beginner",
    tracked: ["Arm symmetry", "Jump timing & rhythm", "Full extension", "Landing alignment"],
    tip: "Land softly with slightly bent knees. Keep arms fully extended overhead.",
  },
];

const FEATURES_DATA = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Real-Time Pose Detection",
    desc: "MediaPipe tracks 33 body landmarks at sub-10ms latency directly in your browser — no server round-trips.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Coaching",
    desc: "Amazon Bedrock (Nova Pro) analyzes your session and generates personalized insights, strengths, and corrections.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "100% Private",
    desc: "Your video never leaves your device. Only anonymized metrics (rep count, angles) are sent to the cloud.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Rep Feedback",
    desc: "Every rep is scored in real-time. Bad form triggers immediate audio and visual cues so you correct it now.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Session History",
    desc: "Workouts are stored in DynamoDB. Track your quality score trends over time and see your progress.",
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: "No Equipment Needed",
    desc: "Just your phone or laptop camera. Works on any device with a modern browser — no app install required.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Allow Camera",
    desc: "Grant camera access in your browser. Your video is processed locally — nothing is uploaded.",
    icon: <Camera className="w-7 h-7" />,
  },
  {
    step: "02",
    title: "Pick Exercise",
    desc: "Choose from Squat, Pushup, or Jumping Jack. Position yourself and let the AI calibrate your posture.",
    icon: <CheckCircle className="w-7 h-7" />,
  },
  {
    step: "03",
    title: "Train with Feedback",
    desc: "Real-time form scores appear on every rep. Green means good. Yellow or red — correct immediately.",
    icon: <Zap className="w-7 h-7" />,
  },
  {
    step: "04",
    title: "Get AI Insights",
    desc: "After your session, Amazon Bedrock generates a personalized report with strengths and recommendations.",
    icon: <Brain className="w-7 h-7" />,
  },
];

const AWS_SERVICES = [
  "Amazon Bedrock",
  "AWS Lambda",
  "Amazon DynamoDB",
  "Amazon API Gateway",
  "AWS Amplify",
  "AWS CDK",
];

const EXERCISES_CARD = [
  { name: "Squat",        icon: "🏋️", desc: "Knee & hip depth tracking"    },
  { name: "Pushup",       icon: "💪", desc: "Elbow angle & core alignment"  },
  { name: "Jumping Jack", icon: "⚡", desc: "Full-body symmetry analysis"   },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-white tracking-[0.2em] text-sm">AI GYM</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40 font-medium tracking-wide">
          {[
            { label: "Features",    id: "features"     },
            { label: "Exercises",   id: "exercises"    },
            { label: "How It Works",id: "how-it-works" },
            { label: "About",       id: "about"        },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </button>
          ))}
        </div>
        <Button
          onClick={() => navigate("/camera")}
          className="rounded-full px-3 sm:px-6 h-8 sm:h-9 text-xs sm:text-sm font-bold bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-200"
        >
          START TRAINING
        </Button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex overflow-hidden min-h-[calc(100vh-65px)]">
        {/* Background glow — right */}
        <div className="pointer-events-none absolute right-0 top-0 w-[55%] h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/8 via-primary/4 to-transparent" />
          <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[480px] h-[480px] bg-primary/14 rounded-full blur-[130px]" />
          <div className="absolute top-[30%] right-[5%] w-[260px] h-[260px] bg-primary/10 rounded-full blur-[90px]" />
          <div className="absolute bottom-[20%] right-[25%] w-[200px] h-[200px] bg-secondary/8 rounded-full blur-[80px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <span className="absolute top-5 left-5 text-white/15 text-base select-none font-thin">✕</span>
        <span className="absolute bottom-5 left-5 text-white/15 text-base select-none font-thin">+</span>
        <div className="absolute top-5 right-5 flex flex-col items-end gap-1 select-none">
          <span className="text-white/15 text-sm">✕</span>
          <span className="text-white/15 text-sm">+</span>
          <span className="text-white/15 text-sm">⤢</span>
        </div>

        {/* Left */}
        <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-20 py-8 sm:py-12 w-full md:w-[52%] gap-5 sm:gap-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-[0.15em] text-white/60 uppercase">AI-Powered Real-Time Analysis</span>
          </div>
          <div className="leading-none pl-4 border-l-2 border-primary/60">
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-bold tracking-tight text-white leading-none">AI PERSONAL</h1>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-heading font-bold tracking-tight text-primary leading-none">GYM TRAINER</h1>
          </div>
          <p className="text-base md:text-lg text-white/45 max-w-sm leading-relaxed">
            Your AI coach analyzes posture and reps in real-time using just your camera.{" "}
            <span className="text-white/75 font-semibold">No wearables. No equipment.</span>
          </p>
          <div className="bg-black/50 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden max-w-[300px] shadow-2xl">
            {EXERCISES_CARD.map((ex, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === 0 ? "bg-white/6 border-l-2 border-primary" : "hover:bg-white/4"}`}>
                <span className="text-xl leading-none">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold text-white tracking-wide">{ex.name.toUpperCase()}</p>
                  <p className="text-xs text-white/35 truncate">{ex.desc}</p>
                </div>
                {i === 0 && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              </div>
            ))}
            <div className="px-4 py-3 border-t border-white/8 bg-black/30">
              <p className="text-xs text-white/35 leading-relaxed">
                Powered by <span className="text-primary font-semibold">MediaPipe</span> + <span className="text-primary font-semibold">Amazon Bedrock</span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/camera")}
            className="w-fit h-11 sm:h-13 px-7 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-bold rounded-full bg-white text-black hover:bg-white/92 hover:scale-105 transition-all duration-200 shadow-[0_0_40px_-8px_rgba(255,255,255,0.4)]"
          >
            START TRAINING <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="flex items-center gap-0 pt-1 divide-x divide-white/10">
            {[{value:"99%",label:"Form Accuracy"},{value:"<10ms",label:"Latency"},{value:"100%",label:"Private"}].map((s,i) => (
              <div key={i} className={i === 0 ? "pr-4 sm:pr-8" : "px-4 sm:px-8"}>
                <p className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight">{s.value}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D animated pose model */}
        <div className="hidden md:flex relative w-[48%] items-center justify-center">
          <ThreeErrorBoundary>
            <Suspense fallback={null}>
              <GymModel3D />
            </Suspense>
          </ThreeErrorBoundary>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo("features")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 hover:opacity-70 transition-opacity duration-300 cursor-pointer bg-transparent border-none z-20"
        >
          <span className="text-[9px] text-white uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </button>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section id="features" className="relative py-16 md:py-24 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">What You Get</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white">FEATURES</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full mx-auto mt-4" />
            <p className="text-white/45 mt-4 max-w-xl mx-auto text-base">
              Everything you need for a smarter, safer workout — powered by AWS and computer vision.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES_DATA.map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden bg-white/3 hover:bg-white/6 border border-white/8 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-white text-lg tracking-wide mb-2">{f.title.toUpperCase()}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exercises ──────────────────────────────────────────────── */}
      <section id="exercises" className="relative py-16 md:py-24 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
        {/* Left glow */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">Supported Movements</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white">EXERCISES</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full mx-auto mt-4" />
            <p className="text-white/45 mt-4 max-w-xl mx-auto text-base">
              Three core movements with full landmark tracking and rep-by-rep scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXERCISES_DATA.map((ex, i) => (
              <div
                key={i}
                className="group relative bg-black/40 hover:bg-white/4 border border-white/8 hover:border-primary/40 rounded-3xl p-6 transition-all duration-300 overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

                {/* Mini figure */}
                <div className="flex justify-center mb-4 h-24 items-end">
                  {ex.mini}
                </div>

                {/* Difficulty badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{ex.difficulty}</span>
                </div>

                <h3 className="font-heading font-bold text-white text-2xl tracking-wide mb-1">
                  {ex.name.toUpperCase()}
                </h3>
                <p className="text-xs text-white/35 mb-4 leading-relaxed italic">"{ex.tip}"</p>

                {/* Tracked metrics */}
                <div className="space-y-2">
                  {ex.tracked.map((t, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      <span className="text-xs text-white/55">{t}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/camera")}
                  className="mt-5 w-full py-2.5 rounded-xl border border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-xs font-bold tracking-widest text-white/50 hover:text-primary transition-all duration-200 bg-transparent"
                >
                  TRAIN NOW →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-16 md:py-24 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">Simple Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white">HOW IT WORKS</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full mx-auto mt-4" />
            <p className="text-white/45 mt-4 max-w-xl mx-auto text-base">
              From camera on to AI insights in under a minute.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-0">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="group relative flex flex-col items-center text-center px-4">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] right-0 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-white/5" />
                )}
                {/* Step icon circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-5 z-10 group-hover:bg-primary/20 transition-colors">
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-background border border-primary/50 flex items-center justify-center shadow-[0_0_12px_rgba(23,231,119,0.2)]">
                    <span className="text-[10px] font-heading font-bold text-primary">{step.step}</span>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-white text-sm tracking-wide mb-2">{step.title.toUpperCase()}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button
              onClick={() => navigate("/camera")}
              className="h-12 sm:h-14 px-8 sm:px-12 text-sm sm:text-base font-bold rounded-full bg-primary text-black hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-[0_0_40px_-8px_rgba(23,231,119,0.5)]"
            >
              START YOUR FIRST SESSION <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────── */}
      <section id="about" className="relative py-16 md:py-24 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/6 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">The Project</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white">ABOUT</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left — description */}
            <div className="space-y-5">
              <p className="text-white/65 text-base leading-relaxed">
                <span className="text-white font-semibold">AI Personal Gym Trainer</span> is a browser-based fitness coach that uses
                computer vision to analyze your workout form in real-time. Built for the AWS Hackathon, it combines
                the power of <span className="text-primary">MediaPipe</span> pose detection with{" "}
                <span className="text-primary">Amazon Bedrock</span> AI to deliver professional-grade feedback.
              </p>
              <p className="text-white/65 text-base leading-relaxed">
                Your privacy is paramount — video is processed entirely on your device. Only anonymized rep metrics
                are securely transmitted to the backend for AI analysis and history tracking.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/arpitsharma7777/AI-PersonalGymTrainer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:border-white/40 text-sm text-white/60 hover:text-white transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right — AWS services */}
            <div className="bg-black/40 border border-white/8 rounded-2xl p-6">
              <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Built With AWS</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {AWS_SERVICES.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                    {s}
                  </span>
                ))}
              </div>
              <div className="border-t border-white/8 pt-4 space-y-3">
                {[
                  { label: "AI Model",     value: "Amazon Nova Pro (Bedrock)" },
                  { label: "Pose Engine",  value: "MediaPipe PoseLandmarker"  },
                  { label: "Frontend",     value: "React 18 + Vite + Tailwind" },
                  { label: "IaC",          value: "AWS CDK (TypeScript)"       },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-white/35 uppercase tracking-wide">{label}</span>
                    <span className="text-xs text-white/70 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="relative border-t border-white/5 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs text-white/40 tracking-[0.2em] font-heading font-bold">AI GYM TRAINER</span>
        </div>
        <p className="text-[11px] text-white/25 tracking-wide">Video never leaves your browser — 100% private</p>
        <p className="text-[11px] text-white/20 hidden md:block tracking-wide">Built on AWS · us-east-1</p>
      </footer>
    </div>
  );
}

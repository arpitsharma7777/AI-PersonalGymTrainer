# AI Personal Gym Trainer

A browser-based AI fitness coaching application that uses your device camera and machine learning to act as a real-time personal trainer — no wearables or gym equipment required.

Built for an AWS Hackathon using MediaPipe for in-browser pose detection and Amazon Bedrock for AI-powered post-session coaching.

---

## Features

- **Real-time pose detection** — MediaPipe PoseLandmarker tracks 33 body landmarks entirely in-browser; no video ever leaves your device
- **Exercise support** — Squats, Pushups, and Jumping Jacks with form analysis
- **Rep counting** — Automatic stage-transition detection (up/down phases) per exercise
- **Form quality scoring** — Session score starts at 100 and adjusts with each rep based on depth/range quality
- **Audio feedback** — Web Speech API reads feedback aloud during your workout
- **Camera calibration** — Checks body visibility, centering, distance, and shoulder level before allowing a session to start
- **AI post-session coaching** — Amazon Bedrock (Nova Pro) analyzes anonymized session metrics and returns a personalized coaching report with strengths, weaknesses, and actionable recommendations
- **Session history** — Sessions are stored in DynamoDB and retrievable per user

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 7 (SWC) |
| Routing | React Router v6 |
| Styling | TailwindCSS v3, shadcn/ui, Radix UI |
| State | Zustand v5 |
| Data fetching | TanStack React Query v5 |
| Pose detection | MediaPipe Tasks Vision |
| 3D landing | Three.js, @react-three/fiber |

### Backend
| | |
|---|---|
| Runtime | AWS Lambda (Node.js 20, ARM64) |
| AI model | Amazon Bedrock — Amazon Nova Pro |
| Database | Amazon DynamoDB |

### Infrastructure (AWS CDK)
| Service | Purpose |
|---|---|
| Amazon API Gateway | REST API with throttling |
| AWS Lambda | `session-complete` and `session-history` functions |
| Amazon DynamoDB | Session storage with 1-year TTL |
| Amazon Bedrock | AI coaching insights |
| AWS Amplify | Frontend hosting and CI/CD |

---

## Project Structure

```
├── client/                  # React frontend
│   ├── pages/               # Landing, CameraCoach, ActiveWorkout, SessionSummary
│   ├── components/          # Camera feed, workout UI, 3D model, shadcn primitives
│   ├── hooks/               # MediaPipe init, toast
│   ├── lib/                 # API client, utilities
│   └── logic/
│       └── pose-analysis.ts # Pose analysis engine (exercise logic)
├── backend/
│   └── src/
│       ├── session-complete.ts      # POST /sessions/complete Lambda
│       ├── session-history.ts       # GET /sessions/{userId}/history Lambda
│       └── shared/
│           ├── bedrock-client.ts    # Bedrock Nova Pro integration
│           └── types.ts
├── cdk/
│   └── lib/
│       └── ai-fitness-stack.ts      # Full AWS infrastructure definition
├── amplify.yml              # Amplify CI/CD build config
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- AWS account with credentials configured (for backend/infrastructure)

### Frontend (local development)

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:8080
npm run dev

# Production build (output: dist/spa/)
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=<your-api-gateway-url>
```

You get this URL after deploying the CDK stack (see below).

### Backend / Infrastructure (AWS CDK)

```bash
cd cdk
npm install

# Preview the CloudFormation output
npm run synth

# Deploy to AWS
npm run deploy

# Tear down
npm run destroy
```

After deployment, copy the API Gateway URL from the CDK output and set it as `VITE_API_URL` in your `.env`.

Lambda environment variables are injected automatically by CDK:
- `SESSIONS_TABLE` — DynamoDB table name
- `BEDROCK_MODEL_ID` — `amazon.nova-pro-v1:0`
- `BEDROCK_REGION` — AWS region

### AWS Amplify (CI/CD)

Connect your repository to AWS Amplify. The `amplify.yml` at the root is pre-configured:

```yaml
preBuild:  npm install
build:     npm run build
artifacts: dist/spa/**/*
```

Set `VITE_API_URL` as an environment variable in the Amplify console.

---

## How It Works

1. **Choose an exercise** on the landing page (Squat, Pushup, or Jumping Jack)
2. **Grant camera access** — MediaPipe calibrates your position (checks visibility, centering, distance, and shoulder level)
3. **Start your workout** — pose landmarks are analyzed every frame; reps are counted and form is scored in real time
4. **Stop the session** — anonymized metrics (rep count, form scores, error counts) are sent to the backend API
5. **Review your results** — Amazon Bedrock returns a coaching report with summary, strengths, weaknesses, and recommendations
6. Session data is stored in DynamoDB for history tracking

**Privacy:** Your video never leaves the device. All pose inference runs client-side in the browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run Vitest test suite |
| `npm run typecheck` | TypeScript type checking |
| `npm run format.fix` | Auto-format with Prettier |

---

## License

MIT
